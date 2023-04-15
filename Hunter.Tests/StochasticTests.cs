using Hunter;
using MathNet.Numerics.Statistics;
using NUnit.Framework;
using System;
using System.Collections.Generic;

namespace Hunter.Tests {

    [TestFixture]
    public class StochasticTests
    {
        private const int ITERATIONS = 1000;
        private List<double> results;
        private List<int> repeatCounts;
        private List<int> primitiveEvalCounts;

        [SetUp]
        public void Setup()
        {
            results = new List<double>();
            repeatCounts = new List<int>();
            primitiveEvalCounts = new List<int>();
        }

        [Test]
        public void RunFullModel_WithoutPSFS()
        {
            RunTest(withPsfs: false, timePressure: false);
        }

        [Test]
        public void RunFullModel_WithoutPSFS_Fatigue()
        {
            RunTest(withPsfs: false, timePressure: false, fatigue: true);
        }

        [Test]
        public void RunFullModel_WithPSFS_repeatMode_Stress_Fatigue()
        {
            RunTest(withPsfs: true, timePressure: true, repeatMode: true, stress: true, fatigue: true);
        }

        [Test]
        public void RunFullModel_WithPSFS_repeatMode_Stress()
        {
            RunTest(withPsfs: true, timePressure: true, repeatMode: true, stress: true);
        }

        [Test]
        public void RunFullModel_WithPSFS()
        {
            RunTest(withPsfs: true, timePressure: false);
        }

        [Test]
        public void RunFullModel_WithTimePressure()
        {
            RunTest(withPsfs: true, timePressure: true);
        }

        [Test]
        public void RunFullModel_WithPSFs_repeatMode_Stress_Fatigue_TimePressure()
        {
            RunTest(withPsfs: true, timePressure: true, repeatMode: true, stress: true, fatigue: true);
        }

        [Test]
        public void RunFullModel_WithPSFs_repeatMode_Stress_Fatigue_StartOfShift()
        {
            RunTest(withPsfs: true, timePressure: false, repeatMode: true,
                stress: true, fatigue: true, atStartOfShift: true);
        }

        [Test]
        public void RunFullModel_WithPSFs_repeatMode_Stress_Fatigue_TimePressure_StartOfShift()
        {
            RunTest(withPsfs: true, timePressure: true, repeatMode: true, 
                stress: true, fatigue: true, atStartOfShift: true);
        }

        private void RunTest(bool withPsfs, bool timePressure, 
            bool repeatMode=false, bool stress = false, 
            bool fatigue = false, bool atStartOfShift = false)
        {
            // start timer
            var watch = System.Diagnostics.Stopwatch.StartNew();

            // run the stochastic code multiple times and add the result of each iteration to the list
            for (int i = 0; i < ITERATIONS; i++)
            {
                (double result, int repeatCount, int primitiveEvalCount) = RunSGTR(
                    withPsfs, timePressure, 
                    repeatMode, stress, 
                    fatigue, atStartOfShift);
                results.Add(result);
                repeatCounts.Add(repeatCount);
                primitiveEvalCounts.Add(primitiveEvalCount);
            }

            // stop timer
            watch.Stop();

            double mean = Math.Round(results.Average(), 0);
            double stdev = Math.Round(results.StandardDeviation(), 0);
            double aveRepeats = Math.Round(repeatCounts.Average(), 3);
            double aveEvals = Math.Round(primitiveEvalCounts.Average(), 3);

            // calculate time per iteration
            TimeSpan timePerIteration = TimeSpan.FromMilliseconds(watch.ElapsedMilliseconds / ITERATIONS);

            TestContext.Out.WriteLine("Operator");
            TestContext.Out.WriteLine($"Mean Time: {mean} s, Time Stdev: {stdev} s");
            TestContext.Out.WriteLine($"Mean Repeats per Iteration: {aveRepeats}");
            TestContext.Out.WriteLine($"Mean Primitives Evaluated: {aveEvals}");

            TestContext.Out.WriteLine($"Total time: {watch.Elapsed}, Time per iteration: {timePerIteration}");

            // assert that the results meet certain criteria
            // for example, assert that the mean is within a certain range
            // replace these assertions with ones that are appropriate for your use case
            Assert.That(results.Count, Is.EqualTo(ITERATIONS));
            Assert.That(results[0], Is.GreaterThan(0));
        }

        private (double, int, int) RunSGTR(bool PSFs = false, bool timePressure = false, 
                                      bool repeatMode = false, bool stress = false, 
                                      bool fatigue = false, bool atStartOfShift=false)
        {
            // Arrange
            string hunterModelFilename = @"hunter/models/sgtr_model.json";
            Dictionary<string, Procedure> procedures = HRAEngine.BuildProcedureCatalog(hunterModelFilename);

            PerformanceShapingFactorCollection? psfCollection = null;
            if (PSFs)
            {
                psfCollection = new PerformanceShapingFactorCollection();
                psfCollection.SetLevel("ATa", "Barely adequate time");
                Assert.That(psfCollection.Count > 0);

                if (timePressure)
                {
                    psfCollection.SetLevel("ATa", "Barely adequate time");
                    psfCollection.SetLevel("ATd", "Barely adequate time");
                }

                if (stress)
                {
                    psfCollection.SetLevel("Sa", "High");
                    psfCollection.SetLevel("Sd", "High");
                }

            }

            HRAEngine hraEngine = new HRAEngine();
            hraEngine.RepeatMode = repeatMode;
            hraEngine.TimeOnShiftFatigueEnabled = fatigue;
            if (!atStartOfShift)
            {
                hraEngine.TimeOnShift = TimeSpan.FromHours(12);
            }
            
            TimeSpan result = TimeSpan.Zero;

            foreach (KeyValuePair<string, Procedure> kvp in procedures)
            {
                string procedureId = kvp.Key;
                Procedure procedure = kvp.Value;
                int endStep = procedure.Steps.Count;

                result += hraEngine.EvaluateSteps(procedures, procedureId, 1, endStep, psfCollection);
            }

            return (result.TotalSeconds, hraEngine.RepeatCount, hraEngine.PrimitiveEvalCount);
        }
    }
}
