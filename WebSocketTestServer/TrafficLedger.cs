using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace WebSocketTestServer
{
    // Records what each connection received and sent so tests can check that every EMRALD thread
    // talked only to its own connection. Not needed by a real coupling server.

    /// <summary>
    /// SimInfo received with an atOpenSim action.
    /// </summary>
    public sealed record RecordedSimInfo(int Seed, int NumRuns, int CurRun);

    /// <summary>
    /// A value received in an atCompModify action or sent in an etCompEv event. CurRun is the run
    /// index from the most recent atOpenSim on the connection, SimTime is the sim's local time for sent values.
    /// </summary>
    public sealed record RecordedValue(int CurRun, string NameId, string Value, TimeSpan? SimTime);

    /// <summary>
    /// Traffic for a single connection ID.
    /// </summary>
    public sealed class ConnectionTraffic
    {
        private readonly object _lock = new();
        private readonly List<RecordedSimInfo> _openSims = new();
        private readonly List<RecordedValue> _received = new();
        private readonly List<RecordedValue> _sent = new();
        private int _curRun = 0;

        internal ConnectionTraffic(Guid conID, string appName, Guid socketID)
        {
            ConID = conID;
            AppName = appName;
            SocketID = socketID;
        }

        public Guid ConID { get; }
        public string AppName { get; }
        // Identifies the WebSocket the connection was created on.
        public Guid SocketID { get; }

        public IReadOnlyList<RecordedSimInfo> OpenSims { get { lock (_lock) return _openSims.ToList(); } }
        public IReadOnlyList<RecordedValue> Received { get { lock (_lock) return _received.ToList(); } }
        public IReadOnlyList<RecordedValue> Sent { get { lock (_lock) return _sent.ToList(); } }

        internal void RecordOpenSim(int seed, int numRuns, int curRun)
        {
            lock (_lock)
            {
                _curRun = curRun;
                _openSims.Add(new RecordedSimInfo(seed, numRuns, curRun));
            }
        }

        internal void RecordReceived(string nameId, string value)
        {
            lock (_lock)
                _received.Add(new RecordedValue(_curRun, nameId, value, null));
        }

        internal void RecordSent(string nameId, string value, TimeSpan simTime)
        {
            lock (_lock)
                _sent.Add(new RecordedValue(_curRun, nameId, value, simTime));
        }
    }

    /// <summary>
    /// Traffic for every connection a server has created.
    /// </summary>
    public sealed class TrafficLedger
    {
        private readonly ConcurrentDictionary<Guid, ConnectionTraffic> _byConID = new();

        public IReadOnlyList<ConnectionTraffic> Connections => _byConID.Values.ToList();

        public int SocketCount => _byConID.Values.Select(c => c.SocketID).Distinct().Count();

        public ConnectionTraffic? Get(Guid conID) => _byConID.TryGetValue(conID, out var traffic) ? traffic : null;

        internal ConnectionTraffic Register(Guid conID, string appName, Guid socketID)
        {
            var traffic = new ConnectionTraffic(conID, appName, socketID);
            _byConID[conID] = traffic;
            return traffic;
        }
    }
}
