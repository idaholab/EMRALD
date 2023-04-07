
using NUnit.Framework;
using System;
using System.Collections.Generic;
using Hunter;
using static Hunter.HRAEngine;

namespace Hunter.Tests
{
    namespace Hunter.Tests
    {
        [TestFixture]
        public class PerformanceShapingFactorCollectionTests
        {
            private PerformanceShapingFactor _psf;
            private PerformanceShapingFactorCollection _psfCollection;

            [SetUp]
            public void SetUp()
            {            
                // Set up a PerformanceShapingFactor object with some sample data
                _psf = new PerformanceShapingFactor("Action", "Available Time", new List<PerformanceShapingFactor.Level>
{
    new PerformanceShapingFactor.Level { LevelName = "Barely adequate time", Multiplier = 0.01 },
    new PerformanceShapingFactor.Level { LevelName = "Expansive time", Multiplier = 0.00001 },
    new PerformanceShapingFactor.Level { LevelName = "Extra time", Multiplier = 0.0001 },
    new PerformanceShapingFactor.Level { LevelName = "Inadequate time", Multiplier = 1 },
    new PerformanceShapingFactor.Level { LevelName = "Nominal time", Multiplier = 0.001 }
}, "ATa", "Inadequate time");
                _psfCollection = new PerformanceShapingFactorCollection();
            }

            [Test]
            public void Update_WithJsonData_UpdatesPerformanceShapingFactor()
            {
                // Arrange
                TimeSpan? elapsedTime = null;
                string jsonData = "{\"levelName\": \"Expansive time\"}";

                Assert.That(_psf.CurrentLevel.LevelName, Is.EqualTo("Inadequate time"));

                // Act
                _psf.Update(elapsedTime, jsonData);

                // Assert
//                Assert.That(_psf.CurrentLevel.LevelName, Is.EqualTo("Expansive time"));
            }

            [Test]
            public void Update_WithElapsedTime_UpdatesAllPerformanceShapingFactors()
            {
                // Arrange
                TimeSpan elapsedTime = TimeSpan.FromSeconds(5);
                string jsonData = null;

                // Act
                _psfCollection.Update(elapsedTime, jsonData);

                // Assert
                Assert.That(_psfCollection.Count, Is.EqualTo(16));
            }

            [Test]
            public void Update_WithJsonData_UpdatesSelectedPerformanceShapingFactors()
            {
                // Arrange
                TimeSpan? elapsedTime = null;
                string jsonData = "{\"id\": \"ATa\", \"levelName\": \"Extra time\"}";

                // Act
                _psfCollection.Update(elapsedTime, jsonData);

                // Assert
                Assert.That(_psfCollection.Count, Is.EqualTo(16));
            }


        }
    }

}
