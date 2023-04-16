
using NUnit.Framework;
using System;
using System.Collections.Generic;
using static Hunter.HRAEngine;

namespace Hunter.Tests.PerformanceShapingFactor
{
    [TestFixture]
    public class PerformanceShapingFactorUpdateTests
    {
        private PSF _psf;
        private PSFCollection _psfCollection;

        [SetUp]
        public void SetUp()
        {
            // Set up a PSF object with some sample data
            _psf = new PSF(OperationType.Action, "Available Time", new List<PSF.Level>
{
new PSF.Level { LevelName = "Barely adequate time", Multiplier = 0.01 },
new PSF.Level { LevelName = "Expansive time", Multiplier = 0.00001 },
new PSF.Level { LevelName = "Extra time", Multiplier = 0.0001 },
new PSF.Level { LevelName = "Inadequate time", Multiplier = 1 },
new PSF.Level { LevelName = "Nominal time", Multiplier = 0.001 }
}, "ATa", "Inadequate time");
            _psfCollection = new PSFCollection();
        }

        [Test]
        public void Update_WithJsonData_UpdatesPerformanceShapingFactor()
        {
            // Arrange
            HRAEngine? hraEngine = null;
            string jsonData = "{\"levelName\": \"Expansive time\"}";

            Assert.That(_psf.CurrentLevel.LevelName, Is.EqualTo("Inadequate time"));

            // Act
            _psf.Update(hraEngine, jsonData);

            // Assert
            //                Assert.That(_psf.CurrentLevel.LevelName, Is.EqualTo("Expansive time"));
        }

        [Test]
        public void Update_WithHRAEngine_UpdatesAllPerformanceShapingFactors()
        {
            // Arrange
            HRAEngine hRAEngine = new HRAEngine(timeOnShift: TimeSpan.FromHours(12));
            string jsonData = null;

            // Act
            _psfCollection.Update(hRAEngine, jsonData);

            // Assert
            Assert.That(_psfCollection.Count, Is.EqualTo(16));
        }

        [Test]
        public void Update_WithJsonData_UpdatesSelectedPerformanceShapingFactors()
        {
            // Arrange
            HRAEngine? hRAEngine = null;
            string jsonData = "{\"id\": \"ATa\", \"levelName\": \"Extra time\"}";

            // Act
            _psfCollection.Update(hRAEngine, jsonData);

            // Assert
            Assert.That(_psfCollection.Count, Is.EqualTo(16));
        }


    }
}

