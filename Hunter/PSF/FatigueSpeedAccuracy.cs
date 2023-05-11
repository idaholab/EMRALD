using CommonDefLib;
using Hunter.Hra.Distributions;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Hunter.Psf
{
    public class FatigueSpeedAccuracy
    {
        public double FatigueBaseline { get; set; }
        public double FatigueLimit { get; set; }
        public double TimeToFatigueLimit { get; set; }
        public double FatigueTransitionTime { get; set; }
        public double CircadianAmplitude { get; set; }
        public double CircadianPhase{ get; set; }
        public double FinalMultiplier { get; set; }

        public FatigueSpeedAccuracy(double? fatigueBaseline = null, 
                                    double? fatigueLimit = null, 
                                    double? timeToFatigueLimit = null,
                                    double? fatigueTransitionTime = null,
                                    double? circadianAmpitude =null,
                                    double? circadianPhase = null,
                                    double? finalMultiplier = null)
        {
            FatigueBaseline = fatigueBaseline ?? 
                NormalDistributionHandler.SampleNormalTime(
                    0.925, 0.925 * 0.2);
            FatigueLimit = fatigueLimit ?? 
                NormalDistributionHandler.SampleNormalTime(
                    2.06, 2.06 * 0.2);
            TimeToFatigueLimit = timeToFatigueLimit ?? 
                LognormalDistributionHandler.SampleLognormalTime(
                    11, 11 * 0.2);
            FatigueTransitionTime = fatigueTransitionTime ?? 
                LognormalDistributionHandler.SampleLognormalTime(
                    2, 2 * 0.2);
            FinalMultiplier = finalMultiplier ?? 
                LognormalDistributionHandler.SampleLognormalTime(
                    4.5, 4.5 * 0.2);
            CircadianAmplitude = circadianAmpitude ?? 
                Math.Round(NormalDistributionHandler.SampleNormalTime(
                    0.437, 0.437 * 0.2));
            CircadianPhase = circadianPhase ?? 
                NormalDistributionHandler.SampleNormalTime(
                    -0.15, 0.03);

            while (FatigueBaseline - CircadianAmplitude < 0.1 || 
                   CircadianAmplitude < 0.1)
            { 
                CircadianAmplitude = 
                    NormalDistributionHandler.SampleNormalTime(
                        0.437, 0.437 * 0.2);
            }
        }

        public double GetValue(double t)
        {
            double radians = 2 * Math.PI * (t / 8);
            double phase = 2 * Math.PI * CircadianPhase;
            double sinusoid = CircadianAmplitude * Math.Sin(radians + phase);

            // fade from 4 - 8 hours
            var x = TimeToFatigueLimit / 2;
            var sinusoidFade = 1 - Math.Clamp(t - x, 0, x) / x;

            double v;
            if (t > TimeToFatigueLimit)
            {
                double transTime = t - TimeToFatigueLimit;
                transTime = Math.Clamp(transTime, 0, FatigueTransitionTime);
                double delta = (FatigueLimit - FatigueBaseline) * 
                               (transTime / FatigueTransitionTime);

                v = FatigueBaseline + delta;
            }
            else
            {
                v = FatigueBaseline;
            }


            return Math.Clamp(v + sinusoid * sinusoidFade, 0.333, 3.5);
        }

        public double GetSpeedAccuracy(double t)
        {
            double x = (625 * (1/ FinalMultiplier) - 598) / 3240000;

            double b = 0.0005;
            double a = ((1/FinalMultiplier) - 1 - b * 72) / (72 * 72);

            if (a > 0)
            {
                throw new Exception("a should be > 0");
            }

            double radians = 2 * Math.PI * (t / 24);
            double phase = 2 * Math.PI * CircadianPhase;
            double sinusoid = CircadianAmplitude / 
                              5 * Math.Sin(radians + phase);

            return x * (t * t) - 0.0006 * t + 1 + sinusoid;
        }

        public double GetMultiplier(double t)
        {
            double speedAccuracy = GetSpeedAccuracy(t);
            double speedMultiplier = GetValue(t);
            double accuracy = speedAccuracy * speedMultiplier;
            return 1 / accuracy;
        }

    }
}
