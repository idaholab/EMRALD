using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;
using NUnit.Framework;
using System;
using Hunter.Hra;
using Hunter.Model;

namespace Hunter.Tests
{
    [TestFixture]
    public class HunterSnapshotTests
    {
        private HRAEngine hraEngine;
        private HunterSnapshot snapshot;

        [SetUp]
        public void Setup()
        {
            snapshot = new HunterSnapshot(
                repeatMode: true,
                timeOnShiftFatigueEnabled: true,
                timeOnShift: TimeSpan.FromHours(1),
                hasTimePressure: false,
                experience: "Nominal",
                currentProcedureId: "procedure123",
                currentStepId: "step456",
                currentSuccess: true,
                primitiveEvalCount: 42,
                repeatCount: 3);

            hraEngine = new HRAEngine();
            hraEngine.RepeatMode = snapshot.RepeatMode;
            hraEngine.TimeOnShiftFatigueEnabled = snapshot.TimeOnShiftFatigueEnabled;
            hraEngine.TimeOnShift = snapshot.TimeOnShift;
            hraEngine.SetCurrentProcedureId(snapshot._currentProcedureId);
            hraEngine.SetCurrentStepId(snapshot._currentStepId);
            hraEngine.SetCurrentSuccess(snapshot._currentSuccess);
            hraEngine.SetPrimitiveEvalCount(snapshot._primitiveEvalCount);
            hraEngine.SetRepeatCount(snapshot._repeatCount);
        }

        [Test]
        public void TestProperties()
        {
            Assert.AreEqual(snapshot.RepeatMode, hraEngine.RepeatMode);
            Assert.AreEqual(snapshot.TimeOnShiftFatigueEnabled, hraEngine.TimeOnShiftFatigueEnabled);
            Assert.AreEqual(snapshot.TimeOnShift, hraEngine.TimeOnShift);
            // Compare other properties here...
        }

        [Test]
        public void TestJsonSerialization()

        {
            string json = snapshot.GetJSON();
            TestContext.Out.WriteLine(json);

            HunterSnapshot deserializedSnapshot = HunterSnapshot.DeserializeJSON(json);
            Assert.AreEqual(snapshot, deserializedSnapshot);
        }

        [TestCase(true, true, "01:00:00", false, "Nominal", "procedure123", "step456", true, 42, 3)]
        public void TestConstructor(
            bool repeatMode,
            bool timeOnShiftFatigueEnabled,
            string timeOnShiftStr,
            bool hasTimePressure,
            string experience,
            string currentProcedureId,
            string currentStepId,
            bool currentSuccess,
            int primitiveEvalCount,
            int repeatCount)
        {
            TimeSpan timeOnShift = TimeSpan.Parse(timeOnShiftStr);
            HunterSnapshot newSnapshot = new HunterSnapshot(
                repeatMode,
                timeOnShiftFatigueEnabled,
                timeOnShift,
                hasTimePressure,
                experience,
                currentProcedureId,
                currentStepId,
                currentSuccess,
                primitiveEvalCount,
                repeatCount);

            Assert.AreEqual(repeatMode, newSnapshot.RepeatMode);
            Assert.AreEqual(timeOnShiftFatigueEnabled, newSnapshot.TimeOnShiftFatigueEnabled);
            Assert.AreEqual(timeOnShift, newSnapshot.TimeOnShift);
            // Compare other properties here...
        }
    }

}
