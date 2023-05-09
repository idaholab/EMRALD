using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hunter.Psf;
using Hunter.Hra;

using NUnit.Framework;
using Hunter.Model;
using CommonDefLib;

namespace Hunter.Tests.PerformanceShapingFactorTests
{
    [TestFixture]
    public class Integrated_LagLinger_Model_Tests
    {
        [Test]
        public void DefaultOp_2hr()
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            HRAEngine hraEngine = HunterFactory.CreateDefaultOperator();
            hraEngine.TimeOnShift = TimeSpan.FromHours(1);
            hraEngine.psfCollection.SetLevel(PsfEnums.Id.Sd, PsfEnums.Level.Stress.Extreme);
            hraEngine.TimeOnShift += TimeSpan.FromSeconds(3600);
            double v = hraEngine.psfCollection[PsfEnums.Id.Sd].CurrentMultiplier;
            TestContext.WriteLine(v);
            Assert.AreEqual(3.7372069657332405d, v, 0.00001);
        }

        [Test]
        public void DefaultOp_12hr()
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            HRAEngine hraEngine = HunterFactory.CreateDefaultOperator();
            hraEngine.TimeOnShift = TimeSpan.FromHours(12);
            hraEngine.psfCollection.SetLevel(PsfEnums.Id.Sd, PsfEnums.Level.Stress.Extreme);
            hraEngine.TimeOnShift += TimeSpan.FromSeconds(3600);
            double v = hraEngine.psfCollection[PsfEnums.Id.Sd].CurrentMultiplier;
            TestContext.WriteLine(v);
            Assert.AreEqual(4.5736910883747939d, v, 0.00001);
        }

        [Test]
        public void DefaultOp_12hr_NoTime()
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            HRAEngine hraEngine = HunterFactory.CreateDefaultOperator();
            hraEngine.TimeOnShift = TimeSpan.FromHours(12);
            hraEngine.psfCollection.SetLevel(PsfEnums.Id.Sd, PsfEnums.Level.Stress.Extreme);
            hraEngine.TimeOnShift += TimeSpan.FromSeconds(3600);
            hraEngine.SetTaskAvailableTime(TimeSpan.FromMinutes(5));
            hraEngine.SetTaskTimeRequired(TimeSpan.FromMinutes(10));
            hraEngine.Update();
            double v = hraEngine.psfCollection[PsfEnums.Id.ATa].CurrentMultiplier;
            TestContext.WriteLine(v);
            Assert.AreEqual(9999.0d, v, 0.00001);
        }
    }
}
