using Hunter;
using MathNet.Numerics.Statistics;
using NUnit.Framework;
using System.Collections.Generic;

namespace Hunter.Tests {

    [TestFixture]
    public class StochasticTests
    {
        private const int ITERATIONS = 1000;
        private List<double> results;

        [SetUp]
        public void Setup()
        {
            results = new List<double>();
        }

        [Test]
        public void RunFullModel_WithoutPSFS()
        {
            RunTest(false, false);
        }

        [Test]
        public void RunFullModel_WithPSFS()
        {
            RunTest(true, false);
        }

        [Test]
        public void RunFullModel_WithTimePressure()
        {
            RunTest(true, true);
        }

        private void RunTest(bool withPsfs, bool TimePressure)
        {
            // start timer
            var watch = System.Diagnostics.Stopwatch.StartNew();

            // run the stochastic code multiple times and add the result of each iteration to the list
            for (int i = 0; i < ITERATIONS; i++)
            {
                double result = RunSGTR(withPsfs, TimePressure); // replace with the name of your stochastic code method
                results.Add(result);
            }

            // stop timer
            watch.Stop();

            double mean = Math.Round(results.Average(), 0);
            double stdev = Math.Round(results.StandardDeviation(), 0);

            // calculate time per iteration
            TimeSpan timePerIteration = TimeSpan.FromMilliseconds(watch.ElapsedMilliseconds / ITERATIONS);

            TestContext.Out.WriteLine("Operator Time");
            TestContext.Out.WriteLine($"Mean: {mean} s, Stdev: {stdev} s\n");
            TestContext.Out.WriteLine("Test Time");
            TestContext.Out.WriteLine($"Total time: {watch.Elapsed}, Time per iteration: {timePerIteration}");

            // assert that the results meet certain criteria
            // for example, assert that the mean is within a certain range
            // replace these assertions with ones that are appropriate for your use case
            Assert.That(results.Count, Is.EqualTo(ITERATIONS));
            Assert.That(results[0], Is.GreaterThan(0));
        }

        private double RunSGTR(bool PSFs=false, bool TimePressure=false)
        {
            // Arrange
            string hunterModelFilename = @"hunter/models/sgtr_model.json";
            Dictionary<string, Procedure> procedures = HRAEngine.BuildProcedureCatalog(hunterModelFilename);

            PerformanceShapingFactorCollection? psfCollection = null;
            if (PSFs)
            {
                psfCollection = new PerformanceShapingFactorCollection();
                if (TimePressure)
                {
                    psfCollection.SetLevel("ATa", "Barely adequate time");
                    psfCollection.SetLevel("ATd", "Barely adequate time");
                }
            }

            HRAEngine hraEngine = new HRAEngine();

            TimeSpan result = TimeSpan.Zero;

            foreach (KeyValuePair<string, Procedure> kvp in procedures)
            {
                string procedureId = kvp.Key;
                Procedure procedure = kvp.Value;
                int endStep = procedure.Steps.Count;

                result += hraEngine.EvaluateSteps(procedures, procedureId, 1, endStep, psfCollection);
            }

            return result.TotalSeconds;
        }
    }
}
