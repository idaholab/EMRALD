using System;
using System.Collections.Generic;
using MathNet.Numerics.Statistics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Hunter.HRAEngine;

namespace Hunter.Tests.HumanReliabilityAnalysisEngine
{
    [TestFixture]
    public class HRAEngine_GOMS_Primitives_TimeDistributionTests
    {
        bool success = false;
        int count = 1000;
        List<double> times;

        /// <summary>
        /// Generates table of mean time and time stdeves
        /// </summary>
        [Test]
        public void GOMS_Primitives_wPSFs_TimeDistribution_Test()
        {
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);

            PSFCollection psfCollection;
            HRAEngine engine;

            (engine, psfCollection) = HunterFactory.CreateNoviceOperator();

            engine.RepeatMode = false;

            foreach (HRAEngine.Primitive primitive in engine)
            {
                times = new List<double>();


                for (int i = 0; i < count; i++)
                {
                    bool success = true;
                    times.Add(engine.EvaluatePrimitive(primitive, ref success, psfs: psfCollection, outputDir: outputDirectory));
                }

                double mean = Math.Round(times.Average(), 2);
                double stdev = Math.Round(times.StandardDeviation(), 2);

                Assert.That(mean > 0, Is.True);
                Assert.That(stdev > 0, Is.True);

                TestContext.Out.WriteLine($"Primitive ID: {primitive.Id} \tMean Time: {mean} s \tTime Stdev: {stdev} s");
            }
        }

        /// <summary>
        /// Generates table of mean time and time stdeves
        /// </summary>
        [Test]
        public void GOMS_Primitives_TimeDistribution_Test()
        {
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);

            PSFCollection psfCollection = new PSFCollection();

            HRAEngine engine = new HRAEngine();
            engine.RepeatMode = false;

            foreach (HRAEngine.Primitive primitive in engine)
            {
                times = new List<double>();


                for (int i = 0; i < count; i++)
                {
                    bool success = true;
                    times.Add(engine.EvaluatePrimitive(primitive, ref success, outputDir: outputDirectory));
                }

                double mean = Math.Round(times.Average(), 2);
                double stdev = Math.Round(times.StandardDeviation(), 2);

                Assert.That(mean > 0, Is.True);
                Assert.That(stdev > 0, Is.True);

                TestContext.Out.WriteLine($"Primitive ID: {primitive.Id } \tMean Time: {mean} s \tTime Stdev: {stdev} s");
            }
        }

        [Test]
        public void GOMS_Primitive_Test()
        {
            // create the output directory if it doesn't exist
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);

            HRAEngine engine = new HRAEngine();
            engine.RepeatMode = false;
            bool success = true;
            Primitive primitive = engine.GetPrimitiveById(Goms.Id.Ac);
            engine.EvaluatePrimitive(primitive, ref success, outputDir: outputDirectory);
        }
    }
}
