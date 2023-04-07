using System;
using System.IO;
using Hunter;
using Newtonsoft.Json;
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
            double elapsedTime = hraEngine.Evaluate(primitiveIds);

            // Assert
            Assert.Greater(elapsedTime, 0);
        }

        [Test]
        public void TestEvaluate_MultiplePrimitives()
        {
            // Arrange
            HRAEngine hraEngine = new HRAEngine();
            List<string> primitiveIds = new List<string> { "Ac", "Rc", "Sf" };

            // Act
            double elapsedTime = hraEngine.Evaluate(primitiveIds);

            // Assert
            Assert.Greater(elapsedTime, 0);
        }

        [Test]
        public void TestEvaluate_MultiplePrimitives_withPSFs()
        {
            // Arrange
            HRAEngine hraEngine = new HRAEngine();
            List<string> primitiveIds = new List<string> { "Ac", "Rc", "Sf" };

            PerformanceShapingFactorCollection psfCollection = new PerformanceShapingFactorCollection();

            // Act
            double elapsedTime = hraEngine.Evaluate(primitiveIds, psfCollection);

            // Assert
            Assert.Greater(elapsedTime, 0);
        }

        [Test]
        public void TestEvaluate_UnknownPrimitive()
        {
            // Arrange
            HRAEngine hraEngine = new HRAEngine();
            List<string> primitiveIds = new List<string> { "Unknown" };

            // Act
            double elapsedTime = hraEngine.Evaluate(primitiveIds);

            // Assert
            Assert.AreEqual(0, elapsedTime);
        }

        [Test]
        public void TestEvaluate_EmptyList()
        {
            // Arrange
            HRAEngine hraEngine = new HRAEngine();
            List<string> primitiveIds = new List<string>();

            // Act
            double elapsedTime = hraEngine.Evaluate(primitiveIds);

            // Assert
            Assert.AreEqual(0, elapsedTime);
        }


        [Test]
        public void BuildProcedureCatalog_ReturnsExpectedDictionary()
        {
            // Arrange
            string hunterModelFilename = @"hunter/models/sgtr_model.json";

            // Act
            Dictionary<string, Procedure> procedures = HRAEngine.BuildProcedureCatalog(hunterModelFilename);

            // Assert
            Assert.AreEqual(2, procedures.Count);

            Assert.IsTrue(procedures.ContainsKey("sgtr"));
            Procedure sgtrProcedure = procedures["sgtr"];
            Assert.AreEqual(7, sgtrProcedure.Steps.Count);
            Assert.AreEqual("Entry Conditions", sgtrProcedure.Steps[0].StepId);
            Assert.AreEqual("Step 3 - Perform Rapid Shutdown", sgtrProcedure.Steps[6].StepId);

            Assert.IsTrue(procedures.ContainsKey("rapid_shutdown"));
            Procedure rapidShutdownProcedure = procedures["rapid_shutdown"];
            Assert.AreEqual(14, rapidShutdownProcedure.Steps.Count);
        }

        [Test]
        public void BuildProcedureCatalog_ThrowsFileNotFoundException_WhenHunterModelFileDoesNotExist()
        {
            // Arrange
            string hunterModelFilename = @"nonexistent_file.json";

            // Assert
            Assert.Throws<System.IO.FileNotFoundException>(() =>
            {
                // Act
                Dictionary<string, Procedure> procedures = HRAEngine.BuildProcedureCatalog(hunterModelFilename);
            });
        }


        [Test]
        public void EvaluateSteps_WithJsonString_ReturnsExpectedTimeSpan()
        {
            // Arrange
            string hunterModelFilename = @"hunter/models/sgtr_model.json";
            Dictionary<string, Procedure> procedures = HRAEngine.BuildProcedureCatalog(hunterModelFilename);
            string proceduresString = JsonConvert.SerializeObject(procedures);

            PerformanceShapingFactorCollection psfCollection = new PerformanceShapingFactorCollection();


            HRAEngine hraEngine = new HRAEngine();

            // Arrange
            string procedureId = "sgtr";
            int startStep = 1;
            int endStep = 3;

            // Act
            TimeSpan result = hraEngine.EvaluateSteps(proceduresString, procedureId, startStep, endStep, psfCollection);

            // Assert
            Assert.That(result.TotalSeconds > 0);
        }

        [Test]
        public void EvaluateSteps_WithBadJsonString_ThrowsArgumentException()
        {
            string proceduresString = "";

            HRAEngine hraEngine = new HRAEngine();

            // Arrange
            string procedureId = "sgtr";
            int startStep = 1;
            int endStep = 3;


            // Act & Assert
            Assert.Throws<ArgumentException>(() => hraEngine.EvaluateSteps(proceduresString, procedureId, startStep, endStep));
        }

        [Test]
        public void EvaluateSteps_WithDictionary_ReturnsExpectedTimeSpan()
        {
            // Arrange
            string hunterModelFilename = @"hunter/models/sgtr_model.json";
            Dictionary<string, Procedure> procedures = HRAEngine.BuildProcedureCatalog(hunterModelFilename);

            HRAEngine hraEngine = new HRAEngine();

            // Arrange
            string procedureId = "sgtr";
            int startStep = 1;
            int endStep = 3;

            // Act
            TimeSpan result = hraEngine.EvaluateSteps(procedures, procedureId, startStep, endStep);

            // Assert
            Assert.That(result.TotalSeconds > 0);
        }

        [Test]
        public void EvaluateSteps_WithDictionarySingleStep_ReturnsExpectedTimeSpan()
        {
            // Arrange
            string hunterModelFilename = @"hunter/models/sgtr_model.json";
            Dictionary<string, Procedure> procedures = HRAEngine.BuildProcedureCatalog(hunterModelFilename);

            HRAEngine hraEngine = new HRAEngine();

            // Arrange
            string procedureId = "sgtr";
            int startStep = 3;
            int endStep = 3;

            // Act
            TimeSpan result = hraEngine.EvaluateSteps(procedures, procedureId, startStep, endStep);

            // Assert
            Assert.That(result.TotalSeconds > 0);
        }

        [Test]
        public void EvaluateSteps_WithDictionaryStepsOutOfRange_ThrowsArgumentOutOfRangeException()
        {
            // Arrange
            string hunterModelFilename = @"hunter/models/sgtr_model.json";
            Dictionary<string, Procedure> procedures = HRAEngine.BuildProcedureCatalog(hunterModelFilename);

            HRAEngine hraEngine = new HRAEngine();

            // Arrange
            string procedureId = "sgtr";
            int startStep = 99;
            int endStep = 99;

            // Act & Assert
            Assert.Throws<ArgumentOutOfRangeException>(() => hraEngine.EvaluateSteps(procedures, procedureId, startStep, endStep));
        }
    }
}
