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

    }
}
