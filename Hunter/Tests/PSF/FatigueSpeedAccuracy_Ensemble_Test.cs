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
    public class FatigueSpeedAccuracy_Ensemble_Test
    {
        [Test]
        public void Ensemble_Generator()
        {
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);
            string outputFile = Path.Combine(outputDirectory, "output.csv");
            StreamWriter writer = new StreamWriter(outputFile);
            List<double> vals;
            for (int i = 0; i < 10; i++)
            {
                double dt = 100;
                double end = 3600 * 14;
                
                vals = new List<double>();

                FatigueSpeedAccuracy fatigueLagLinger = new FatigueSpeedAccuracy();

                for (double x = 0; x <= end; x += dt)
                {
                    vals.Add(fatigueLagLinger.GetValue(x/3600));
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

        [Test]
        public void AtFolkardPoints_Generator()
        {
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);
            string outputFile = Path.Combine(outputDirectory, "folkard.csv");
            StreamWriter writer = new StreamWriter(outputFile);
            List<double> times = new List<double> { 
                0.415958021,
                1.438361772,
                2.41954932,
                3.424610632,
                4.482183063,
                5.472488417,
                6.460318937,
                7.493571017,
                8.488565527,
                9.480117601,
                1.941553004,
                4.973316462,
                6.96883199,
                9.002940027,
                11.01806814,
                13.03386614,
            };

            FatigueSpeedAccuracy fatigueLagLinger = new FatigueSpeedAccuracy(
                    fatigueBaseline: 0.925,
                    fatigueLimit: 2.06,
                    timeToFatigueLimit: 11.0,
                    fatigueTransitionTime: 2.0,
                    circadianAmpitude: 0.437,
                    circadianPhase: -0.15,
                    finalMultiplier: null);
            foreach (var time in times)
            {
                double val = fatigueLagLinger.GetMultiplier(time);
                writer.Write($"{time},{val}\n");
            }
            writer.Close();
        }
    }
}
