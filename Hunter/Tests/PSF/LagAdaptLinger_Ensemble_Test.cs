using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hunter.Psf;
using Hunter.Hra;

using NUnit.Framework;
using Hunter.Model;
using Newtonsoft.Json.Linq;
using Hunter.Hra.Distributions;

namespace Hunter.Tests.PerformanceShapingFactorTests
{
    [TestFixture]
    public class LagAdaptLinger_Ensemble_Test
    {
        [Test]
        public void Ensemble_Generator()
        {
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);
            string outputFile = Path.Combine(outputDirectory, "output.csv");
            StreamWriter writer = new StreamWriter(outputFile);
            List<double> vals;
            for (int i = 0; i < 1000; i++ )
            {
                double dt = 10;
                double end = 3600 * 10;
                double k = LognormalDistributionHandler.SampleLognormalTime(5, 5* 0.25);
                double tLag = Math.Round(LognormalDistributionHandler.SampleLognormalTime(3600, 3600 * 0.5));
                double tLinger = Math.Round(LognormalDistributionHandler.SampleLognormalTime(7200, 7200 * 0.5));
                double tAdapt = Math.Round(LognormalDistributionHandler.SampleLognormalTime(57600, 57600 * 0.5));

                vals = new List<double>();

                LagAdaptLinger _lagLinger2 = new LagAdaptLinger(tLag, tLinger, tAdapt);

                for (double x = 0; x <= end; x += dt)
                {
                    if (x == 60)
                    {
                        _lagLinger2.TriggerLag(x, k: k);
                    }

                    if (x == 3600 * 3)
                        _lagLinger2.TriggerLinger(x);

                    vals.Add(_lagLinger2.GetValue(x));
                }

                foreach (double x in vals)
                {
                    string formattedVal = x.ToString("0.000");
                    writer.Write(formattedVal + ",");
                }
                writer.Write("\n");
            }
            writer.Close();
        }
    }
}
