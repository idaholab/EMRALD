using NUnit.Framework;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;


namespace Hunter.Tests.PerformanceShapingFactor
{
    [TestFixture]
    public class PerformanceShapingFactorTests
    {
        private const string psfFilePath = @"hunter_db/archetypes/psfs.json";
        private List<PSF> psfList;

        [SetUp]
        public void Setup()
        {
            string jsonData = File.ReadAllText(psfFilePath);
            psfList = JsonConvert.DeserializeObject<List<PSF>>(jsonData);
        }

        [Test]
        public void TestCalculateInitialLevel()
        {
            // Arrange
            var levels = new List<PSF.Level>
            {
                new PSF.Level { LevelName = "Low", Multiplier = 0.5 },
                new PSF.Level { LevelName = "Nominal", Multiplier = 1.0 },
                new PSF.Level { LevelName = "High", Multiplier = 1.5 }
            };

            var psf = new PSF(OperationType.Action, "Test Factor", levels, "TestId");

            // Assert
            Assert.AreEqual("Nominal", psf.CurrentLevel.LevelName);
        }

        [Test]
        public void TestCalculateInitialLevelNoNominal()
        {
            // Arrange
            var levels = new List<PSF.Level>
            {
                new PSF.Level { LevelName = "Low", Multiplier = 0.5 },
                new PSF.Level { LevelName = "Medium", Multiplier = 1.0 },
                new PSF.Level { LevelName = "High", Multiplier = 1.5 }
            };

            var psf = new PSF(OperationType.Action, "Test Factor", levels, "TestId");

            // Assert
            Assert.AreEqual("Medium", psf.CurrentLevel.LevelName);
        }

        [Test]
        public void PerformanceShapingFactor_Deserialize_ValidJson_ReturnsObject()
        {
            string json = @"{
            ""type"": ""Action"",
            ""factor"": ""AvailableTime"",
            ""levels"": [
                {
                    ""level"": ""BarelyAdequateTime"",
                    ""multiplier"": ""0.01""
                },
                {
                    ""level"": ""ExpansiveTime"",
                    ""multiplier"": ""0.00001""
                },
                {
                    ""level"": ""ExtraTime"",
                    ""multiplier"": ""0.0001""
                },
                {
                    ""level"": ""InadequateTime"",
                    ""multiplier"": ""1""
                },
                {
                    ""level"": ""NominalTime"",
                    ""multiplier"": ""0.001""
                }
            ],
            ""id"": ""ATa""
        }";

            PSF psf = JsonConvert.DeserializeObject<PSF>(json);

            Assert.IsNotNull(psf);
            Assert.AreEqual(OperationType.Action, psf.Operation);
            Assert.AreEqual("AvailableTime", psf.Factor);
            Assert.AreEqual("ATa", psf.Id);
            Assert.AreEqual(5, psf.Levels.Count);
            Assert.AreEqual("BarelyAdequateTime", psf.Levels[0].LevelName);
            Assert.AreEqual(0.01, psf.Levels[0].Multiplier);
        }

        [Test]
        public void PerformanceShapingFactorCollection_Create_ValidJson_ReturnsObject()
        {
            PSFCollection psfCollection = new PSFCollection();

            Assert.IsNotNull(psfCollection);
            Assert.AreEqual(psfList.Count, psfCollection.Count);
            foreach (PSF psf in psfList)
            {
                PSF retrievedPsf = psfCollection[psf.Id];
                Assert.IsNotNull(retrievedPsf);
                Assert.AreEqual(psf.Operation, retrievedPsf.Operation);
                Assert.AreEqual(psf.Factor, retrievedPsf.Factor);
                Assert.AreEqual(psf.Id, retrievedPsf.Id);
                Assert.AreEqual(psf.Levels.Count, retrievedPsf.Levels.Count);
                for (int i = 0; i < psf.Levels.Count; i++)
                {
                    Assert.AreEqual(psf.Levels[i].LevelName, retrievedPsf.Levels[i].LevelName);
                    Assert.AreEqual(psf.Levels[i].Multiplier, retrievedPsf.Levels[i].Multiplier);
                }
            }
        }
        [Test]
        public void PerformanceShapingFactorTestSerializationAndDeserialization()
        {
            // Arrange
            var levels = new List<PSF.Level>
            {
                new PSF.Level { LevelName = "Nominal", Multiplier = 1.0 },
                new PSF.Level { LevelName = "High", Multiplier = 1.5 }
            };

            var psf = new PSF(OperationType.Action, "TestFactor", levels, "TestId", "Nominal", false);

            // Act
            string json = psf.GetJSON();
            PSF deserializedPsf = PSF.DeserializeJSON(json);

            // Assert
            Assert.AreEqual(psf.Operation, deserializedPsf.Operation);
            Assert.AreEqual(psf.Factor, deserializedPsf.Factor);
            Assert.AreEqual(psf.Id, deserializedPsf.Id);
            Assert.AreEqual(psf.IsStatic, deserializedPsf.IsStatic);
            Assert.AreEqual(psf.CurrentLevel.LevelName, deserializedPsf.CurrentLevel.LevelName);

            for (int i = 0; i < psf.Levels.Count; i++)
            {
                Assert.AreEqual(psf.Levels[i].LevelName, deserializedPsf.Levels[i].LevelName);
                Assert.AreEqual(psf.Levels[i].Multiplier, deserializedPsf.Levels[i].Multiplier);
            }
        }

        [Test]
        public void DeserializeJSON_WithInitialLevel_SetsCurrentLevelCorrectly()
        {
            // Arrange
            string json = @"
        {
            ""type"": ""Diagnosis"",
            ""factor"": ""FitnessforDuty"",
            ""levels"": [
                {
                ""level"": ""Unfit"",
                ""multiplier"": ""5""
                },
                {
                ""level"": ""DegradedFitness"",
                ""multiplier"": ""2""
                },
                {
                ""level"": ""Nominal"",
                ""multiplier"": ""1""
                }
            ],
            ""id"": ""FfDd"",
            ""initial_level"": ""DegradedFitness""
        }";

            // Act
            PSF psf = JsonConvert.DeserializeObject<PSF>(json);

            // Assert
            Assert.AreEqual("DegradedFitness", psf.CurrentLevel.LevelName);
        }

        [Test]
        public void InstantiatePSF_WithInitialLevel_SetsCurrentLevelCorrectly()
        {
            // Arrange
            List<PSF.Level> levels = new List<PSF.Level>
            {
                new PSF.Level { LevelName = "Unfit", Multiplier = 5 },
                new PSF.Level { LevelName = "Degraded Fitness", Multiplier = 2 },
                new PSF.Level { LevelName = "Nominal", Multiplier = 1 }
            };

            PSF psf = new PSF(
                OperationType.Diagnosis, "Fitness for Duty",
                levels,
                "FfDd",
                "Degraded Fitness");


            // Assert
            Assert.AreEqual(psf.CurrentLevel.LevelName, "Degraded Fitness");
        }

        [Test]
        public void InstantiatePSF_WithInvalidInitialLevel_Raise()
        {
            // Arrange
            List<PSF.Level> levels = new List<PSF.Level>
            {
                new PSF.Level { LevelName = "Unfit", Multiplier = 5 },
                new PSF.Level { LevelName = "Degraded Fitness", Multiplier = 2 },
                new PSF.Level { LevelName = "Nominal", Multiplier = 1 }
            };

            var exception = Assert.Throws<ArgumentException>(() => new PSF(
                OperationType.Diagnosis,
                "Fitness for Duty",
                levels,
                "FfDd",
                "Invalid Level"));
            Assert.AreEqual("Invalid initial level name: Invalid Level", exception.Message);
        }

        [Test]
        public void TestIsStaticProperty()
        {
            // JSON data for the PSF
            string psfJson = @"{
            ""type"": ""Diagnosis"",
            ""factor"": ""FitnessForDuty"",
            ""levels"": [
              {
                ""level"": ""Unfit"",
                ""multiplier"": ""5""
              },
              {
                ""level"": ""DegradedFitness"",
                ""multiplier"": ""2""
              },
              {
                ""level"": ""Nominal"",
                ""multiplier"": ""1""
              }
            ],
            ""initial_level"": ""Unfit"",
            ""id"": ""FfDd""
        }";

            // Deserialize the JSON data into a PSF instance
            PSF psf = JsonConvert.DeserializeObject<PSF>(psfJson);

            // Assert that the current multiplier hasn't changed after calling Update
            Assert.That(psf.CurrentLevel.LevelName, Is.EqualTo("Unfit"));

            // Set the IsStatic property to true
            psf.IsStatic = true;

            // Get the current multiplier before calling Update
            double initialMultiplier = psf.CurrentMultiplier;

            // Create an HRAEngine instance here
            HRAEngine hraEngine = new HRAEngine();

            // Call the Update method
            psf.Update(hraEngine);

            // Get the current multiplier after calling Update
            double updatedMultiplier = psf.CurrentMultiplier;

            // Assert that the current multiplier hasn't changed after calling Update
            Assert.AreEqual(initialMultiplier, updatedMultiplier);
        }
    }
}

