using System;
using System.IO;
using Hunter;
using NUnit.Framework;

namespace Hunter.Tests
{
    [TestFixture]
    public class HRAEngineTests
    {
        private string _testDataPath;

        [OneTimeSetUp]
        public void SetUp()
        {
//            // Set the path to the test data (primitives.json) relative to the test project's output directory
//            string testProjectLocation = Path.GetDirectoryName(typeof(HRAEngineTests).Assembly.Location);
//            _testDataPath = Path.Combine(testProjectLocation, "archetypes", "primitives.json");

//            // Copy the primitives.json file from the Hunter project's output directory to the test data path
//            string hunterProjectLocation = Path.GetDirectoryName(typeof(HRAEngine).Assembly.Location);
//            string sourceFilePath = Path.Combine(hunterProjectLocation, "archetypes", "primitives.json");
//            Directory.CreateDirectory(Path.GetDirectoryName(_testDataPath));
//            File.Copy(sourceFilePath, _testDataPath, overwrite: true);
        }

        [Test]
        public void InstantiateAndLoadPrimitives_UsingDefaultPath_LoadsPrimitives()
        {
            // Arrange
            HRAEngine engine;

            // Act
            engine = new HRAEngine();

            // Assert
            Assert.NotNull(engine);
        }

        [Test]
        public void InstantiateAndLoadPrimitives_UsingCustomPath_LoadsPrimitives()
        {
            // Arrange
            HRAEngine engine;

            // Act
            engine = new HRAEngine(_testDataPath);

            // Assert
            Assert.NotNull(engine);
        }



        [Test]
        public void TestEvaluate_SinglePrimitive()
        {
            // Arrange
            HRAEngine hraEngine = new HRAEngine();
            List<string> primitiveIds = new List<string> { "Ac" };

            // Act
            TimeSpan elapsedTime = hraEngine.Evaluate(primitiveIds);

            // Assert
            Assert.Greater(elapsedTime.TotalSeconds, 0);
        }

        [Test]
        public void TestEvaluate_MultiplePrimitives()
        {
            // Arrange
            HRAEngine hraEngine = new HRAEngine();
            List<string> primitiveIds = new List<string> { "Ac", "Rc", "Sf" };

            // Act
            TimeSpan elapsedTime = hraEngine.Evaluate(primitiveIds);

            // Assert
            Assert.Greater(elapsedTime.TotalSeconds, 0);
        }

        [Test]
        public void TestEvaluate_UnknownPrimitive()
        {
            // Arrange
            HRAEngine hraEngine = new HRAEngine();
            List<string> primitiveIds = new List<string> { "Unknown" };

            // Act
            TimeSpan elapsedTime = hraEngine.Evaluate(primitiveIds);

            // Assert
            Assert.AreEqual(0, elapsedTime.TotalSeconds);
        }

        [Test]
        public void TestEvaluate_EmptyList()
        {
            // Arrange
            HRAEngine hraEngine = new HRAEngine();
            List<string> primitiveIds = new List<string>();

            // Act
            TimeSpan elapsedTime = hraEngine.Evaluate(primitiveIds);

            // Assert
            Assert.AreEqual(0, elapsedTime.TotalSeconds);
        }
    }
}
