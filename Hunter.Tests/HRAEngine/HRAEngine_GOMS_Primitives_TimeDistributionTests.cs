using System;
using System.Collections.Generic;
using MathNet.Numerics.Statistics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter.Tests.HumanReliabilityAnalysisEngine
{
    [TestFixture]
    public class HRAEngine_GOMS_Primitives_TimeDistributionTests
    {
        bool success = false;
        int count = 10000;
        List<double> times;

        /// <summary>
        /// Generates table of mean time and time stdeves
        /// </summary>
        [Test]
        public void GOMS_Primitives_TimeDistribution_Test()
        {
            HRAEngine engine = new HRAEngine();
            engine.RepeatMode = false;

            foreach (HRAEngine.Primitive primitive in engine)
            {
                times = new List<double>();

                var primitiveIds = new List<string> { primitive.Id };

                for (int i = 0; i < count; i++)
                {
                    times.Add(engine.Evaluate(primitiveIds, ref success));
                }

                double mean = Math.Round(times.Average(), 2);
                double stdev = Math.Round(times.StandardDeviation(), 2);

                Assert.That(mean > 0, Is.True);
                Assert.That(stdev > 0, Is.True);

                TestContext.Out.WriteLine($"Primitive ID: {primitive.Id } \tMean Time: {mean} s \tTime Stdev: {stdev} s");
            }
        }
    }
}
