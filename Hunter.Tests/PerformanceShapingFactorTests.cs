using NUnit.Framework;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;


namespace Hunter.Tests
{
    [TestFixture]
    public class PerformanceShapingFactorTests
    {
        private const string psfFilePath = "hunter/archetypes/psfs.json";
        private List<PerformanceShapingFactor> psfList;

        [SetUp]
        public void Setup()
        {
            string jsonData = File.ReadAllText(psfFilePath);
            psfList = JsonConvert.DeserializeObject<List<PerformanceShapingFactor>>(jsonData);
        }

        [Test]
        public void TestCalculateInitialLevel()
        {
            // Arrange
            var levels = new List<PerformanceShapingFactor.Level>
            {
                new PerformanceShapingFactor.Level { LevelName = "Low", Multiplier = 0.5 },
                new PerformanceShapingFactor.Level { LevelName = "Nominal", Multiplier = 1.0 },
                new PerformanceShapingFactor.Level { LevelName = "High", Multiplier = 1.5 }
            };

            var psf = new PerformanceShapingFactor(TaskType.Action, "Test Label", levels, "TestId");

            // Assert
            Assert.AreEqual("Nominal", psf.CurrentLevel.LevelName);
        }

        [Test]
        public void TestCalculateInitialLevelNoNominal()
        {
            // Arrange
            var levels = new List<PerformanceShapingFactor.Level>
            {
                new PerformanceShapingFactor.Level { LevelName = "Low", Multiplier = 0.5 },
                new PerformanceShapingFactor.Level { LevelName = "Medium", Multiplier = 1.0 },
                new PerformanceShapingFactor.Level { LevelName = "High", Multiplier = 1.5 }
            };

            var psf = new PerformanceShapingFactor(TaskType.Action, "Test Label", levels, "TestId");

            // Assert
            Assert.AreEqual("Medium", psf.CurrentLevel.LevelName);
        }

        [Test]
        public void PerformanceShapingFactor_Deserialize_ValidJson_ReturnsObject()
        {
            string json = @"{
            ""type"": ""Action"",
            ""label"": ""Available Time"",
            ""levels"": [
                {
                    ""level"": ""Barely adequate time"",
                    ""multiplier"": ""0.01""
                },
                {
                    ""level"": ""Expansive time"",
                    ""multiplier"": ""0.00001""
                },
                {
                    ""level"": ""Extra time"",
                    ""multiplier"": ""0.0001""
                },
                {
                    ""level"": ""Inadequate time"",
                    ""multiplier"": ""1""
                },
                {
                    ""level"": ""Nominal time"",
                    ""multiplier"": ""0.001""
                }
            ],
            ""id"": ""ATa""
        }";

            PerformanceShapingFactor psf = JsonConvert.DeserializeObject<PerformanceShapingFactor>(json);

            Assert.IsNotNull(psf);
            Assert.AreEqual(TaskType.Action, psf.Type);
            Assert.AreEqual("Available Time", psf.Label);
            Assert.AreEqual("ATa", psf.Id);
            Assert.AreEqual(5, psf.Levels.Count);
            Assert.AreEqual("Barely adequate time", psf.Levels[0].LevelName);
            Assert.AreEqual(0.01, psf.Levels[0].Multiplier);
        }

        [Test]
        public void PerformanceShapingFactorCollection_Create_ValidJson_ReturnsObject()
        {
            PerformanceShapingFactorCollection psfCollection = new PerformanceShapingFactorCollection();

            Assert.IsNotNull(psfCollection);
            Assert.AreEqual(psfList.Count, psfCollection.Count);
            foreach (PerformanceShapingFactor psf in psfList)
            {
                PerformanceShapingFactor retrievedPsf = psfCollection[psf.Id];
                Assert.IsNotNull(retrievedPsf);
                Assert.AreEqual(psf.Type, retrievedPsf.Type);
                Assert.AreEqual(psf.Label, retrievedPsf.Label);
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
            var levels = new List<PerformanceShapingFactor.Level>
            {
                new PerformanceShapingFactor.Level { LevelName = "Nominal", Multiplier = 1.0 },
                new PerformanceShapingFactor.Level { LevelName = "High", Multiplier = 1.5 }
            };

            var psf = new PerformanceShapingFactor(TaskType.Action, "Test Label", levels, "TestId", "Nominal", false);

            // Act
            string json = psf.GetJSON();
            PerformanceShapingFactor deserializedPsf = PerformanceShapingFactor.DeserializeJSON(json);

            // Assert
            Assert.AreEqual(psf.Type, deserializedPsf.Type);
            Assert.AreEqual(psf.Label, deserializedPsf.Label);
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
            ""label"": ""Fitness for Duty"",
            ""levels"": [
                {
                ""level"": ""Unfit"",
                ""multiplier"": ""5""
                },
                {
                ""level"": ""Degraded Fitness"",
                ""multiplier"": ""2""
                },
                {
                ""level"": ""Nominal"",
                ""multiplier"": ""1""
                }
            ],
            ""id"": ""FfDd"",
            ""initial_level"": ""Degraded Fitness""
        }";

            // Act
            PerformanceShapingFactor psf = JsonConvert.DeserializeObject<PerformanceShapingFactor>(json);
            
            // Assert
            Assert.AreEqual("Degraded Fitness", psf.CurrentLevel.LevelName);
        }

        [Test]
        public void InstantiatePSF_WithInitialLevel_SetsCurrentLevelCorrectly()
        {
            // Arrange
            List<PerformanceShapingFactor.Level> levels = new List<PerformanceShapingFactor.Level>
            {
                new PerformanceShapingFactor.Level { LevelName = "Unfit", Multiplier = 5 },
                new PerformanceShapingFactor.Level { LevelName = "Degraded Fitness", Multiplier = 2 },
                new PerformanceShapingFactor.Level { LevelName = "Nominal", Multiplier = 1 }
            };

            PerformanceShapingFactor psf = new PerformanceShapingFactor(
                TaskType.Diagnosis,"Fitness for Duty",
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
            List<PerformanceShapingFactor.Level> levels = new List<PerformanceShapingFactor.Level>
            {
                new PerformanceShapingFactor.Level { LevelName = "Unfit", Multiplier = 5 },
                new PerformanceShapingFactor.Level { LevelName = "Degraded Fitness", Multiplier = 2 },
                new PerformanceShapingFactor.Level { LevelName = "Nominal", Multiplier = 1 }
            };

            var exception = Assert.Throws<ArgumentException>(() => new PerformanceShapingFactor(
                TaskType.Diagnosis,
                "Fitness for Duty",
                levels,
                "FfDd",
                "Invalid Level"));
            Assert.AreEqual("Invalid initial level name: Invalid Level", exception.Message);
        }

        [Test]
        public void TestIsStaticProperty()
        {
            // JSON data for the PerformanceShapingFactor
            string psfJson = @"{
            ""type"": ""Diagnosis"",
            ""label"": ""Fitness for Duty"",
            ""levels"": [
              {
                ""level"": ""Unfit"",
                ""multiplier"": ""5""
              },
              {
                ""level"": ""Degraded Fitness"",
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

            // Deserialize the JSON data into a PerformanceShapingFactor instance
            PerformanceShapingFactor psf = JsonConvert.DeserializeObject<PerformanceShapingFactor>(psfJson);

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

