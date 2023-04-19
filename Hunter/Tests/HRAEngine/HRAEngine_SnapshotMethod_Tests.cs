using Hunter;
using NUnit.Framework;
using System;
using Hunter.Hra;
using Hunter.Model;

namespace Hunter.Tests
{
    [TestFixture]
    public class HRAEngineTests
    {
        private HRAEngine hraEngine;

        [SetUp]
        public void Setup()
        {
            hraEngine = new HRAEngine();
            hraEngine.RepeatMode = true;
            hraEngine.TimeOnShiftFatigueEnabled = true;
            hraEngine.TimeOnShift = TimeSpan.FromHours(1);
            hraEngine.SetCurrentProcedureId("procedure123");
            hraEngine.SetCurrentStepId("step456");
            hraEngine.SetCurrentSuccess(true);
            hraEngine.SetPrimitiveEvalCount(42);
            hraEngine.SetRepeatCount(3);
        }

        [Test]
        public void TestSnapshot()
        {
            HunterSnapshot snapshot = hraEngine.Snapshot();

            Assert.AreEqual(hraEngine.RepeatMode, snapshot.RepeatMode);
            Assert.AreEqual(hraEngine.TimeOnShiftFatigueEnabled, snapshot.TimeOnShiftFatigueEnabled);
            Assert.AreEqual(hraEngine.TimeOnShift, snapshot.TimeOnShift);
            Assert.AreEqual(hraEngine.CurrentProcedureId, snapshot._currentProcedureId);
            Assert.AreEqual(hraEngine.CurrentStepId, snapshot._currentStepId);
            Assert.AreEqual(hraEngine.CurrentSuccess, snapshot._currentSuccess);
            Assert.AreEqual(hraEngine.PrimitiveEvalCount, snapshot._primitiveEvalCount);
            Assert.AreEqual(hraEngine.RepeatCount, snapshot._repeatCount);
        }

        [Test]
        public void TestSnapshotWithHunterFactory()
        {
            HunterSnapshot snapshot = hraEngine.Snapshot();

            HRAEngine hraEngine2 = HunterFactory.CreateOperator(snapshot);

            Assert.AreEqual(hraEngine.RepeatMode, hraEngine2.RepeatMode);
            Assert.AreEqual(hraEngine.TimeOnShiftFatigueEnabled, hraEngine2.TimeOnShiftFatigueEnabled);
            Assert.AreEqual(hraEngine.TimeOnShift, hraEngine2.TimeOnShift);
            Assert.AreEqual(hraEngine.CurrentProcedureId, hraEngine2.CurrentProcedureId);
            Assert.AreEqual(hraEngine.CurrentStepId, hraEngine2.CurrentStepId);
            Assert.AreEqual(hraEngine.CurrentSuccess, hraEngine2.CurrentSuccess);
            Assert.AreEqual(hraEngine.PrimitiveEvalCount, hraEngine2.PrimitiveEvalCount);
            Assert.AreEqual(hraEngine.RepeatCount, hraEngine2.RepeatCount);
        }
    }
}