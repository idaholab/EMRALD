// Copyright 2026 Battelle Energy Alliance
// Tests for WebSocket coupling with several connections at once, checking each connection only gets its own data.

using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CouplingWebSocket;
using MessageDefLib;
using WebSocketTestServer;
using Xunit;

namespace UnitAndIntegrationTesting
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  public class WebSocketCoupling_Testing
  {
    private const string MooseApp = "MooseEMRALDTranslation";
    private static readonly TimeSpan WaitTimeout = TimeSpan.FromSeconds(15);

    public WebSocketCoupling_Testing()
    {
      WebSocketTestServer.Program.LogMessages = false;
      WebSocketClient.LogMessages = false;
    }

    #region Helpers

    /// <summary>
    /// Collects the sim events a coupler passes to its callback, by app name.
    /// </summary>
    private sealed class EventCollector
    {
      public readonly ConcurrentQueue<(string app, SimEvent ev)> Events = new ConcurrentQueue<(string app, SimEvent ev)>();

      public void OnEvent(string clientName, TMsgWrapper msg)
      {
        if (msg?.simEvents == null)
          return;
        foreach (var ev in msg.simEvents)
          Events.Enqueue((clientName, ev));
      }

      public bool HasStatus(string app, StatusType status) =>
        Events.Any(e => e.app == app && e.ev.evType == SimEventType.etStatus && e.ev.status == status);

      public List<string> CompValues(string app, string nameId) =>
        Events.Where(e => e.app == app && e.ev.evType == SimEventType.etCompEv && e.ev.itemData?.nameId == nameId)
              .Select(e => e.ev.itemData.value)
              .ToList();
    }

    private static async Task WaitUntil(Func<bool> condition, string what)
    {
      var deadline = DateTime.UtcNow + WaitTimeout;
      while (!condition())
      {
        if (DateTime.UtcNow > deadline)
          throw new TimeoutException("Timed out waiting for " + what);
        await Task.Delay(20);
      }
    }

    private static TMsgWrapper ActionMsg(SimAction action, string dispName) =>
      new TMsgWrapper(MessageType.mtSimAction, dispName, TimeSpan.Zero) { simAction = action };

    private static TMsgWrapper OpenSimMsg(int seed) =>
      ActionMsg(new SimAction(new SimInfo("", TimeSpan.FromMinutes(5), "", seed, 1, 1), TimeSpan.Zero), "OpenSim");

    private static TMsgWrapper CompModifyMsg(string nameId, string value) =>
      ActionMsg(new SimAction(SimActionType.atCompModify, TimeSpan.Zero, new ItemData(nameId, value)), "CompModify");

    private static TMsgWrapper ContinueMsg() =>
      ActionMsg(new SimAction(SimActionType.atContinue), "Continue");

    private static List<WatchItem> WatchTFW() => new List<WatchItem> { new WatchItem("T_FW", "double") };

    #endregion

    [Fact]
    [Description("Several couplers, each on its own socket, run the example sim at once and each only gets the T_FW from its own flow rate")]
    public async Task ParallelCouplersGetOwnDataTest()
    {
      const int couplerCnt = 4;
      await using var host = new WebSocketServerHost();
      await host.StartAsync();
      string url = host.WsUri.ToString();

      async Task<(int k, Guid conID, List<string> tfwVals)> RunOne(int k)
      {
        var events = new EventCollector();
        using var coupler = new WebApiCoupling(url, 10000);
        // set before StartupApp, the Idle status arrives right after the connection is created
        coupler.evCallBackFunc = events.OnEvent;

        Guid conID = await coupler.StartupApp(MooseApp, WatchTFW());
        Assert.True(coupler.SendMessage(OpenSimMsg(k), MooseApp));
        await WaitUntil(() => events.HasStatus(MooseApp, StatusType.stWaiting), $"coupler {k} to reach Waiting");

        Assert.True(coupler.SendMessage(CompModifyMsg("epsilon3", k.ToString()), MooseApp));
        Assert.True(coupler.SendMessage(ContinueMsg(), MooseApp));
        await WaitUntil(() => events.CompValues(MooseApp, "T_FW").Count > 0, $"coupler {k} to get T_FW");

        return (k, conID, events.CompValues(MooseApp, "T_FW"));
      }

      var results = await Task.WhenAll(Enumerable.Range(1, couplerCnt).Select(k => Task.Run(() => RunOne(k))));

      Assert.Equal(couplerCnt, host.Ledger.SocketCount);
      Assert.Equal(couplerCnt, results.Select(r => r.conID).Distinct().Count());

      foreach (var (k, conID, tfwVals) in results)
      {
        // one second of sim time at k gallons per minute and 250 tritium per gallon
        double expected = k * (1.0 / 60.0) * 250.0;
        Assert.Equal(expected, double.Parse(tfwVals[0]), 9);

        ConnectionTraffic traffic = host.Ledger.Get(conID);
        Assert.NotNull(traffic);
        Assert.Equal(new[] { k.ToString() }, traffic.Received.Where(r => r.NameId == "epsilon3").Select(r => r.Value));
        Assert.Equal(tfwVals[0], traffic.Sent.First(s => s.NameId == "T_FW").Value);
        Assert.Single(traffic.OpenSims);
        Assert.Equal(k, traffic.OpenSims[0].Seed);
      }
    }

    [Fact]
    [Description("StartupApp returns the connection ID the server created, even though the Idle status for it arrives first")]
    public async Task StartupAppReturnsServerConnectionIdTest()
    {
      await using var host = new WebSocketServerHost();
      await host.StartAsync();

      var events = new EventCollector();
      using var coupler = new WebApiCoupling(host.WsUri.ToString(), 10000);
      coupler.evCallBackFunc = events.OnEvent;

      Guid conID = await coupler.StartupApp("App1", WatchTFW());

      Assert.NotEqual(Guid.Empty, conID);
      Assert.Equal(conID, coupler.ConnectionIds["App1"]);
      ConnectionTraffic traffic = host.Ledger.Get(conID);
      Assert.NotNull(traffic);
      Assert.Equal("App1", traffic.AppName);

      // The Idle status is a normal message for the connection, not the CreateConnection response
      await WaitUntil(() => events.HasStatus("App1", StatusType.stIdle), "the Idle status");
    }

    [Fact]
    [Description("Two threads send on one coupler at the same time to different apps and each app gets only its own messages, in order")]
    public async Task ConcurrentSendOnOneCouplerTest()
    {
      const int msgCnt = 50;
      await using var host = new WebSocketServerHost();
      await host.StartAsync();

      var events = new EventCollector();
      using var coupler = new WebApiCoupling(host.WsUri.ToString(), 10000);
      coupler.evCallBackFunc = events.OnEvent;

      // start both apps at the same time, requests on one socket are matched to their own responses
      string[] apps = { "App1", "App2" };
      Guid[] conIDs = await Task.WhenAll(apps.Select(a => Task.Run(() => coupler.StartupApp(a, WatchTFW()))));
      Assert.Equal(2, conIDs.Distinct().Count());
      Assert.Equal(1, host.Ledger.SocketCount);
      for (int i = 0; i < apps.Length; i++)
        Assert.Equal(conIDs[i], coupler.ConnectionIds[apps[i]]);

      // open both sims at once
      var opened = await Task.WhenAll(apps.Select((a, i) => Task.Run(() => coupler.SendMessage(OpenSimMsg(i + 1), a))));
      Assert.All(opened, ok => Assert.True(ok));
      foreach (string app in apps)
        await WaitUntil(() => events.HasStatus(app, StatusType.stWaiting), app + " to reach Waiting");

      // send many flow rate changes from two threads at the same time
      using var start = new ManualResetEventSlim(false);
      var sendTasks = apps.Select((app, appIdx) => Task.Run(() =>
      {
        start.Wait();
        for (int m = 0; m < msgCnt; m++)
        {
          if (!coupler.SendMessage(CompModifyMsg("epsilon3", $"{appIdx + 1}.{m}"), app))
            return false;
        }
        return true;
      })).ToArray();
      start.Set();
      Assert.All(await Task.WhenAll(sendTasks), ok => Assert.True(ok));

      for (int i = 0; i < apps.Length; i++)
      {
        ConnectionTraffic traffic = host.Ledger.Get(conIDs[i]);
        Assert.NotNull(traffic);
        await WaitUntil(() => traffic.Received.Count >= msgCnt, apps[i] + " to receive all messages");

        var expected = Enumerable.Range(0, msgCnt).Select(m => $"{i + 1}.{m}");
        Assert.Equal(expected, traffic.Received.Where(r => r.NameId == "epsilon3").Select(r => r.Value));
        Assert.Equal(apps[i], traffic.AppName);
      }

      // no errors from the server for either app
      Assert.False(events.HasStatus("App1", StatusType.stError));
      Assert.False(events.HasStatus("App2", StatusType.stError));
    }

    [Fact]
    [Description("Starting the same app twice on one coupler throws, since messages are routed by app name")]
    public async Task DuplicateAppNameThrowsTest()
    {
      await using var host = new WebSocketServerHost();
      await host.StartAsync();

      using var coupler = new WebApiCoupling(host.WsUri.ToString(), 10000);
      Guid first = await coupler.StartupApp("App1", WatchTFW());

      await Assert.ThrowsAsync<InvalidOperationException>(() => coupler.StartupApp("App1", WatchTFW()));

      // the first connection is still the one used for the app, and no second connection was created
      Assert.Equal(first, coupler.ConnectionIds["App1"]);
      Assert.Single(host.Ledger.Connections);
    }
  }
}
