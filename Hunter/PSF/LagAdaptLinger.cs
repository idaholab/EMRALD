using Hunter.Hra.Distributions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter.Psf
{
    public class LagAdaptLinger
    {
        public double t0 { get; set; }       // Start of Stress
        public double? tReturn { get; set; } // End of Stress
                                             // null before TriggerLinger has been called
                                             // (i.e. not in linger phase)
        public double? K { get; set; }       // Target PSF Multiplier
        public double tAvail { get; set; }   // Available Time
        public double tLag { get; set; }     // Lag Time Constant
        public double tLinger { get; set; }  // Linger Time Constant
        public double tAdapt { get; set; }   // Adaptation Time Constant

        private double _fK = 1;    // current K value f(t)
        private double _tLoss = 0; // Time lost due to t0 adjustment

        public LagAdaptLinger(double? tLag = null, 
                              double? tLinger = null, 
                              double? tAdapt = null)
        {
            this.tLag = tLag ?? 
                Math.Round(
                    LognormalDistributionHandler.SampleLognormalTime(
                        3600, 3600 * 0.2));
            this.tLinger = tLinger ?? 
                Math.Round(
                    LognormalDistributionHandler.SampleLognormalTime(
                        7200, 7200 * 0.2));
            this.tAdapt = tAdapt ?? 
                Math.Round(
                    LognormalDistributionHandler.SampleLognormalTime(
                        16 * 3600, 16 * 3600 * 0.2));
        }

        public void TriggerLag(double t, double k, double tAvail = 7200)
        {
            // K must be greater than 1
            if (k <= 1)
            {
                k = 1.00000001;
            }

            K = k;
            
            // Calculate tLoss needed to trigger new lag before _fK has returned to 1
            _tLoss = Math.Exp((_fK - 1) * Math.Log(tLag + 1) / (K.Value - 1)) - 1;

            // Update tAvail
            this.tAvail = tAvail - _tLoss;

            // Update t0
            t0 = t - _tLoss;

            // Reset tReturn
            if (tReturn != null)
            {
                tReturn = null;
            }
        }

        public void TriggerLinger(double t)
        {
            tReturn = t + tLinger - _tLoss;
            K = _fK;
        }

        public double GetValue(double t)
        {
            // Get time since TriggerLag
            double x = t - t0;

            // If in the linger phase
            if (tReturn != null)
            {
                _fK = Math.Exp(-(Math.Log(K.Value) / tLinger) * 
                                (t - (double)tReturn));

                // If returned to K = 1
                if (_fK < 1.0)
                {
                    tReturn = null;
                    K = null;
                    _fK = Math.Max(_fK, 1);
                }
                return _fK;
            }

            // If TriggerLag has not been called
            if (K is null)
            {
                _fK = 1;
                return _fK;
            }

            // If available time has expired and not in the linger phase
            if (x >= tAvail && tReturn == null)
            {
                TriggerLinger(t);
                return GetValue(t);
            }

            // If in the lag phase
            if (x < tLag && tReturn == null)
            {
                _fK = ((K.Value - 1) / Math.Log(tLag + 1)) * Math.Log(x + 1) + 1;
            }
            // In the adaptation phase
            else
            {
                double lambda = Math.Log(1.0 / K.Value) / tAdapt;
                _fK = K.Value * Math.Exp(lambda * (x - tLag));
            }

            return _fK;
        }
    }
}
