﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hunter.Psf;
using Hunter.Hra;

using NUnit.Framework;

namespace Hunter.Tests.PerformanceShapingFactor
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
            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(12.1));
            var fatigueIndex = engine.FatigueIndex;

            _psfCollection.Update(hraEngine: engine);

            var level = _psfCollection["FfDa"].CurrentLevel;

            if (level is not null)
            {
                TestContext.Out.WriteLine($"LevelName: {level.LevelName}");
                Assert.That(level.LevelName == "DegradedFitness");
            }
            else
            {
                Assert.Fail("CurrentLevel is null");
            }
        }

        [Test]
        public void FatigueIndex_Test18h()
        {
            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(18));
            var fatigueIndex = engine.FatigueIndex;

            _psfCollection.Update(hraEngine: engine);

            var level = _psfCollection["FfDa"].CurrentLevel;

            if (level is not null)
            {
                TestContext.Out.WriteLine($"LevelName: {level.LevelName}");
                Assert.That(level.LevelName == "Unfit");
            }
            else
            {
                Assert.Fail("CurrentLevel is null");
            }
        }

        [Test]
        public void FatigueIndex_Test24h()
        {
            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(24));
            var fatigueIndex = engine.FatigueIndex;

            _psfCollection.Update(hraEngine: engine);

            var level = _psfCollection["FfDa"].CurrentLevel;

            if (level is not null)
            {
                TestContext.Out.WriteLine($"LevelName: {level.LevelName}");
                Assert.That(level.LevelName == "Unfit");
            }
            else
            {
                Assert.Fail("CurrentLevel is null");
            }
        }
    }
}
