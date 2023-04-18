
using NUnit.Framework;
using Hunter;

namespace Hunter.Tests.PerformanceShapingFactor
{
    [TestFixture]
    public class PerformanceShapingFactorCollectionTests
    {
        private PSFCollection _psfCollection;

        [SetUp]
        public void SetUp()
        {
            _psfCollection = new PSFCollection();

            // Add a sample PSF to the collection
            var levels = new List<PSF.Level>
            {
                new PSF.Level { LevelName = PsfEnums.Level.AvailableTime.BarelyAdequateTime, Multiplier = 2 },
                new PSF.Level { LevelName = PsfEnums.Level.AvailableTime.NominalTime, Multiplier = 1 }
            };
            var psf = new PSF(OperationType.Action, "Time", levels, "ATi");
            _psfCollection.Add(psf);
        }

        [Test]
        public void SetLevel_ValidPsfIdAndLevelName_SetsCurrentLevel()
        {
            // Act
            _psfCollection.SetLevel(PsfEnums.Id.ATd, PsfEnums.Level.AvailableTime.BarelyAdequateTime);

            // Assert
            var currentLevel = _psfCollection[PsfEnums.Id.ATd].CurrentLevel;
            Assert.IsNotNull(currentLevel);
            Assert.AreEqual(PsfEnums.Level.AvailableTime.BarelyAdequateTime, currentLevel.LevelName);
        }

        [Test]
        public void SetLevel_InvalidPsfId_ThrowsArgumentException()
        {
            // Act & Assert
            var ex = Assert.Throws<ArgumentException>(() => _psfCollection.SetLevel("InvalidId", "BarelyAdequateTime"));
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
            var psfCollection = new PSFCollection();

            // Act
            // Serialize the PSFCollection
            string serializedPsfCollection = psfCollection.GetJSON();

            TestContext.Out.WriteLine(serializedPsfCollection);

            // Deserialize the serialized PSFCollection
            var deserializedPsfCollection = PSFCollection.DeserializeJSON(serializedPsfCollection);

            // Assert
            // Compare the properties of the original and deserialized PerformanceShapingFactorCollections
            Assert.AreEqual(psfCollection.Count, deserializedPsfCollection.Count);

            foreach (var originalPsf in psfCollection)
            {
                var deserializedPsf = deserializedPsfCollection[originalPsf.Id];
                Assert.NotNull(deserializedPsf);
                Assert.AreEqual(originalPsf.Id, deserializedPsf.Id);
                Assert.AreEqual(originalPsf.Factor, deserializedPsf.Factor);
                Assert.AreEqual(originalPsf.Operation, deserializedPsf.Operation);
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