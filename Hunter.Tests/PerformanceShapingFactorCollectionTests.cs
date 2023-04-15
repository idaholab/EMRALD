using Hunter;

namespace Hunter.Tests
{
    [TestFixture]
    public class PerformanceShapingFactorCollectionTests
    {
        private PerformanceShapingFactorCollection _psfCollection;

        [SetUp]
        public void SetUp()
        {
            _psfCollection = new PerformanceShapingFactorCollection();

            // Add a sample PerformanceShapingFactor to the collection
            var levels = new List<PerformanceShapingFactor.Level>
            {
                new PerformanceShapingFactor.Level { LevelName = "Barely adequate time", Multiplier = 2 },
                new PerformanceShapingFactor.Level { LevelName = "Nominal", Multiplier = 1 }
            };
            var psf = new PerformanceShapingFactor(TaskType.Action, "Time", levels, "ATi");
            _psfCollection.Add(psf);
        }

        [Test]
        public void SetLevel_ValidPsfIdAndLevelName_SetsCurrentLevel()
        {
            // Act
            _psfCollection.SetLevel("ATi", "Barely adequate time");

            // Assert
            var currentLevel = _psfCollection["ATi"].CurrentLevel;
            Assert.IsNotNull(currentLevel);
            Assert.AreEqual("Barely adequate time", currentLevel.LevelName);
        }

        [Test]
        public void SetLevel_InvalidPsfId_ThrowsArgumentException()
        {
            // Act & Assert
            var ex = Assert.Throws<ArgumentException>(() => _psfCollection.SetLevel("InvalidId", "Barely adequate time"));
            Assert.IsTrue(ex.Message.Contains("Performance shaping factor with ID 'InvalidId' not found."));
            TestContext.Out.WriteLine($"Message: {ex.Message}");
        }

        [Test]
        public void SetLevel_InvalidLevelName_ThrowsArgumentException()
        {
            // Act & Assert
            var ex = Assert.Throws<ArgumentException>(() => _psfCollection.SetLevel("ATa", "InvalidLevelName"));
            Assert.IsTrue(ex.Message.Contains("Level with name 'InvalidLevelName' not found for performance shaping factor with ID 'ATa'."));
            TestContext.Out.WriteLine($"Message: {ex.Message}");
        }

        [Test]
        public void SerializeDeserializePerformanceShapingFactorCollectionTest()
        {
            // Arrange
            var psfCollection = new PerformanceShapingFactorCollection();

            // Act
            // Serialize the PerformanceShapingFactorCollection
            string serializedPsfCollection = psfCollection.GetJSON();

            TestContext.Out.WriteLine(serializedPsfCollection);

            // Deserialize the serialized PerformanceShapingFactorCollection
            var deserializedPsfCollection = PerformanceShapingFactorCollection.DeserializeJSON(serializedPsfCollection);

            // Assert
            // Compare the properties of the original and deserialized PerformanceShapingFactorCollections
            Assert.AreEqual(psfCollection.Count, deserializedPsfCollection.Count);

            foreach (var originalPsf in psfCollection)
            {
                var deserializedPsf = deserializedPsfCollection[originalPsf.Id];
                Assert.NotNull(deserializedPsf);
                Assert.AreEqual(originalPsf.Id, deserializedPsf.Id);
                Assert.AreEqual(originalPsf.Label, deserializedPsf.Label);
                Assert.AreEqual(originalPsf.Type, deserializedPsf.Type);
                Assert.AreEqual(originalPsf.IsStatic, deserializedPsf.IsStatic);
                Assert.AreEqual(originalPsf.CurrentLevel.LevelName, deserializedPsf.CurrentLevel.LevelName);

                Assert.AreEqual(originalPsf.Levels.Count, deserializedPsf.Levels.Count);

                for (int i = 0; i < originalPsf.Levels.Count; i++)
                {
                    var originalLevel = originalPsf.Levels[i];
                    var deserializedLevel = deserializedPsf.Levels[i];

                    Assert.AreEqual(originalLevel.LevelName, deserializedLevel.LevelName);
                    Assert.AreEqual(originalLevel.Multiplier, deserializedLevel.Multiplier);
                }
            }
        }

    }
}