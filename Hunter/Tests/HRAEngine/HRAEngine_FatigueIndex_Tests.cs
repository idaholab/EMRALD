using NUnit.Framework;
using Hunter.Hra;
using Hunter.Hra.Distributions;
using Hunter.Psf;
using CommonDefLib;

namespace Hunter.Tests.HumanReliabilityAnalysisEngine
{
    [TestFixture]
    public class HRAEngine_FatigueIndex_Tests
    {

        [Test]
        public void FatigueIndex_Test()
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            // Arrange
            HRAEngine engine = new HRAEngine();
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(1.0396164633696146d).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test8h()
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(8));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(1.0396164633696146d).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test12h()
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(12));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(1.0396164633696146d).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test13_99h()
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(13.99));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(0.99603683367857709d).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test14_01h()
        {
            SingleRandom.Reset();
            ConfigData.seed = 567;

            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(14.01));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(1.5651906805834699d).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test18h()
        {
            SingleRandom.Reset();
            ConfigData.seed = 738;

            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(18));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(1.7536922084119362d).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test24h()
        {
            SingleRandom.Reset();
            ConfigData.seed = 947;

            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(24));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(1.8102358668272958d).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test60h()
        {
            SingleRandom.Reset();
            ConfigData.seed = 234;

            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(60));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(1.9311510690511198d).Within(0.01));
        }


        [Test]
        public void Plot_Generator()
        {
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);
            string outputFile = Path.Combine(outputDirectory, "fatigue_index.csv");
            StreamWriter writer = new StreamWriter(outputFile);

            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(60));
            writer.WriteLine("t,fatigueIndex");

            double t, fatigueIndex;

            List<double> vals;
            for (int i = 0; i < 7200; i++)
            {
                t = i/ 100;
                engine.TimeOnShift = TimeSpan.FromHours(t);
                fatigueIndex = engine.FatigueIndex;
                writer.WriteLine($"{t},{fatigueIndex}");
            }
            writer.Close();
        }
    }
}
