// Copyright 2026 Battelle Energy Alliance
// System and regression tests for EMRALD actions including state transitions, variable changes, and external application calls.
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using SimulationEngine;
using Testing;
using WebSocketTestServer;
using Xunit;

namespace SysAndRegressionTesting
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  public class ActionTests : TestingBaseClass
  {
    #region Validation Cases Setup Code
    protected override string CompareFilesDir()
    {
      return MainTestDir() + "CompareFiles" + Path.AltDirectorySeparatorChar;
    }

    protected override string TestFolder()
    {
      return "EMRALDTests" + Path.AltDirectorySeparatorChar;
    }

    protected override string ModelFolder()
    {
      return "Models" + Path.AltDirectorySeparatorChar;
    }
    #endregion


    [Fact]
    [Description("General test of several actions single option transition action, Change Var value action, and run application action.")]
    public async Task ActionsTest()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 10;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    [Description("Test transition acions that have multiple to states and a variable for one of the % Starts with 50% for S4 then 25% of remaining to 55")]
    public async Task TransitionPercentTest()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 100;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact]
    [Description("Test changing of a variable value using the math library MathNet.Numerics")]
    public async Task ChangeVarTest()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 100;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    [Description("Test changing of a variable value using the math library MathNet.Numerics and Multi threading")]
    public async Task ChangeVarTestMulti()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 100;
      optionsJ["seed"] = 0;
      optionsJ["threads"] = 2;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact(Skip = "DLL Value not fully implmented yet, will allow users to update a variable through a DLL call")]
    [Description("Test the use of executing dll functions with ")]
    public async Task DllValueTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";

      optionsJ["runct"] = 1;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact]
    [Description("Test pathing in the change variable action when running in multi thread")]
    public async Task MultiThreadVarChange()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".emrald";
      options.runct = 10;
      options.threads = 2;
      options.clearThreadTemps = true;
      options.variables = new List<string>() { "Var" };

      JSONRun testRun = new JSONRun(options);
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
    

    [Fact]
    [Description("Test pathing in the change variable action when running in multi thread")]
    public async Task MultiThreadExeTest()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 20;
      optionsJ["threads"] = 2;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    [Description("Test that runApplication acion runs correctuly and uses JSON document variables for input and output ")]
    public async Task JsonVarExeTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";

      optionsJ["runct"] = 10;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact]
    [Description("Test that RunApplication can get the executable from preprocessor code")]
    public async Task JsonVarExeFromPreCodeTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";

      optionsJ["runct"] = 10;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact]
    [Description("Test a External Simulation linking with the EMRALD model using WebSocketServer")]
    public async Task CoupledSimWebSocketTest()
    {
      string testName = GetCurrentMethodName(); // function name must match the model name

      // Setup directory for unit test 
      string dir = SetupTestDir(testName);
      // initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();

      // start the connection server
      using var host = new WebSocketServerHost();
      await host.StartAsync();                // start the server
      await Task.Delay(3000);                 // small buffer for startup (can trim as needed)

      // Change the default settings as needed for the test
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".emrald";
      options.runct = 5;
      options.seed = 1;
      options.variables = new List<string> { "TridiumVal" };
      options.couplingInfo = new CouplingData
      {
        couplingType = CouplingType.WebSocket,
        couplingURL = host.WsUri.ToString(), // e.g., "ws://localhost:52743/"
        timeout = 10,
        logCouplingMsgs = false
      };
      WebSocketTestServer.Program.LogMessages = false;
      options.opsVer = 1.02;

      var testRun = new JSONRun(options);
      Assert.True(await TestRunSim(testRun));

      // Uncomment to update the validation files after they’re verified
      //CopyToValidated(dir, testName, optionsJ);

      // compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Theory]
    [InlineData(2)]
    [InlineData(3)]
    [Description("Run the WebSocket coupled model on several threads and check each thread only used its own connection")]
    public async Task CoupledSimWebSocketMultiThreadTest(int threads)
    {
      const string modelName = "CoupledSimWebSocketTest";
      const string appName = "MooseEMRALDTranslation";
      const int runCnt = 6;
      string testName = GetCurrentMethodName() + "_" + threads.ToString();

      // Setup directory for unit test
      string dir = SetupTestDir(testName);
      // initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();

      // start the connection server
      using var host = new WebSocketServerHost();
      await host.StartAsync();

      // Change the default settings as needed for the test
      options.inpfile = MainTestDir() + ModelFolder() + modelName + ".emrald";
      options.runct = runCnt;
      options.seed = 1;
      options.threads = threads;
      options.clearThreadTemps = true;
      options.variables = new List<string> { "TridiumVal" };
      options.couplingInfo = new CouplingData
      {
        couplingType = CouplingType.WebSocket,
        couplingURL = host.WsUri.ToString(),
        timeout = 10,
        logCouplingMsgs = false
      };
      WebSocketTestServer.Program.LogMessages = false;
      options.opsVer = 1.02;

      var testRun = new JSONRun(options);
      string runErr = await testRun.RunSim();
      Assert.Equal("", runErr);

      // One socket and one connection per thread
      TrafficLedger ledger = host.Ledger;
      IReadOnlyList<ConnectionTraffic> connections = ledger.Connections;
      Assert.Equal(threads, testRun.simRuns.Count);
      Assert.Equal(threads, connections.Count);
      Assert.Equal(threads, ledger.SocketCount);

      // Each thread's connection ID is distinct and matches exactly one connection on the server
      List<Guid> threadConIDs = new List<Guid>();
      foreach (var simRun in testRun.simRuns)
      {
        Assert.NotNull(simRun.extSimConnectionIDs);
        Assert.True(simRun.extSimConnectionIDs.TryGetValue(appName, out Guid conID));
        threadConIDs.Add(conID);
      }
      Assert.Equal(threads, threadConIDs.Distinct().Count());
      Assert.True(connections.Select(c => c.ConID).ToHashSet().SetEquals(threadConIDs));

      // Every run opened the sim once, on its own thread's connection, with that thread's run numbering
      int totalOpens = 0;
      foreach (Guid conID in threadConIDs)
      {
        ConnectionTraffic traffic = ledger.Get(conID);
        Assert.NotNull(traffic);
        Assert.Equal(appName, traffic.AppName);
        var opens = traffic.OpenSims;
        Assert.NotEmpty(opens);
        Assert.All(opens, o => Assert.Equal(opens.Count, o.NumRuns));
        Assert.Equal(Enumerable.Range(1, opens.Count), opens.Select(o => o.CurRun));
        totalOpens += opens.Count;
      }
      Assert.Equal(runCnt, totalOpens);

      // The random flow rates sent by one thread never show up on another thread's connection
      var flowRatesByCon = connections.ToDictionary(
        c => c.ConID,
        c => c.Received.Where(r => r.NameId == "epsilon3" && r.Value != "0" && r.Value != "-1").Select(r => r.Value).ToList());
      foreach (var con in flowRatesByCon)
      {
        foreach (var other in flowRatesByCon.Where(o => o.Key != con.Key))
          Assert.Empty(con.Value.Intersect(other.Value));
      }

      // Each thread's TridiumVal result for a run was sent on its own connection during that run and on no other connection
      static bool SameVal(string a, string b)
      {
        double da = double.Parse(a);
        double db = double.Parse(b);
        return Math.Abs(da - db) <= 1e-9 * Math.Max(1.0, Math.Max(Math.Abs(da), Math.Abs(db)));
      }

      int matchedVals = 0;
      for (int k = 0; k < threads; k++)
      {
        ConnectionTraffic ownTraffic = ledger.Get(threadConIDs[k]);
        var ownSent = ownTraffic.Sent.Where(s => s.NameId == "T_FW").ToList();
        var otherSent = connections.Where(c => c.ConID != threadConIDs[k])
                                   .SelectMany(c => c.Sent.Where(s => s.NameId == "T_FW"))
                                   .ToList();

        // key state -> variable -> run index -> value
        foreach (var keyState in testRun.simRuns[k].ownVariableVals.Values)
        {
          if (!keyState.TryGetValue("TridiumVal", out var runVals))
            continue;

          foreach (var runVal in runVals)
          {
            int runIdx = int.Parse(runVal.Key);
            var sentInRun = ownSent.Where(s => s.CurRun == runIdx).ToList();
            if (sentInRun.Count == 0)
            {
              // the sim never reported a value this run, so TridiumVal kept its initial value
              Assert.True(SameVal("0", runVal.Value), $"Thread {k} run {runIdx} has TridiumVal {runVal.Value} but its connection sent no T_FW");
              continue;
            }

            Assert.Contains(sentInRun, s => SameVal(s.Value, runVal.Value));
            Assert.DoesNotContain(otherSent, s => SameVal(s.Value, runVal.Value));
            matchedVals++;
          }
        }
      }
      Assert.True(matchedVals > 0, "No TridiumVal results were reported by the external sim, the test checked nothing");

      // TODO: generate and validate the compare file before enabling this.
      //CopyToValidated(dir, testName, optionsJ);
      Compare(dir, testName, optionsJ);
    }
  }
}
