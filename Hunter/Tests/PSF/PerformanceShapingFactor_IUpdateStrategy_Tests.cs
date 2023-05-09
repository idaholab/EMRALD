using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hunter.Psf;
using Hunter.Hra;

using NUnit.Framework;
using CommonDefLib;
using Hunter.Model;

namespace Hunter.Tests.PerformanceShapingFactorTests
{
    [TestFixture]
    public class PerformanceShapingFactor_IUpdateStrategy_Tests
    {

        private PSFCollection _psfCollection;

        [SetUp]
        public void SetUp()
        {
            _psfCollection = new PSFCollection();

        }
        
        [Test]
        public void FatigueIndex_Test8h()
        {
            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(8));
            var fatigueIndex = engine.FatigueIndex;

            _psfCollection.Update(hraEngine: engine);

            var level = _psfCollection["FfDa"].CurrentLevel;

            if (level is not null)
            {
                TestContext.Out.WriteLine($"LevelName: {level.LevelName}");
                Assert.That(level.LevelName == "Nominal");
            }
            else
            {
                Assert.Fail("CurrentLevel is null");
            }
        }

        [Test]
        public void FatigueIndex_Test12h()
        {

            SingleRandom.Reset();
            ConfigData.seed = 1234;

            // Arrange
            HRAEngine hraEngine = HunterFactory.CreateDefaultOperator();
            hraEngine.TimeOnShift = TimeSpan.FromHours(12);
            hraEngine.fatigueModel = new FatigueSpeedAccuracy();
            var multiplier = hraEngine._psfCollection[PsfEnums.Id.FfDd].CurrentMultiplier;
            Assert.AreEqual(multiplier, 1.7258792660358675d, 0.0001);
        }
    }
}
