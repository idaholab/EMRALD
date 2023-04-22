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
        public double t0 { get; set; } // Start of Stress
        public double? tReturn { get; set; } // End of Stress
        public double? K { get; set; } // PSF Multiplier
        public double tAvail { get; set; } // Available Time
        public double tLag { get; set; } // Lag Time Constant
        public double tLinger { get; set; } // Linger Time Constant
        public double tAdapt { get; set; } // Adaptation Time Constant

        private double _t = -1;
        private double _fK = 1;
        private double _tLoss = 0; // Time lost due to t0 adjustment

        public LagAdaptLinger(double? tLag = null, double? tLinger = null, double? tAdapt = null)
        {
            if (tLag is not null)
            {
                this.tLag = (double)tLag;
            }
            else
            {
                this.tLag = Math.Round(LognormalDistributionHandler.SampleLognormalTime(3600, 3600 * 0.5));
            }

            if (tLinger is not null)
            {
                this.tLinger = (double)tLinger;
            }
            else
            {
                this.tLinger = Math.Round(LognormalDistributionHandler.SampleLognormalTime(7200, 7200 * 0.5));
            }

            if (tAdapt is not null)
            {
                this.tAdapt = (double)tAdapt;
            }
            else
            {
                this.tAdapt = Math.Round(LognormalDistributionHandler.SampleLognormalTime(57600, 57600 * 0.5));
            }
        }

        public void TriggerLag(double t, double k, double tAvail = 7200)
        {
            // Raise Exception if k <= 1
            if (k <= 1)
            {
                throw new Exception("K must be greater than 1");
            }

            K = k;
            
            // Calculate tLoss
            _tLoss = Math.Exp((_fK - 1) * Math.Log(tLag + 1) / (K.Value - 1)) - 1;

            // Update tAvail
            this.tAvail = tAvail - _tLoss;

            // Update t0
            t0 = t - _tLoss;

            if (tReturn != null)
            {
                tReturn = null;
            }
            _t = t;
        }

        public void TriggerLinger(double t)
        {
            tReturn = t + tLinger - _tLoss;
            K = _fK;
            _t = t - _tLoss;
        }

        public double GetValue(double t)
        {
            // Get time since TriggerLag
            double x = t - t0;

            // If in the linger phase
            if (tReturn != null)
            {
                _fK = Math.Exp(-(Math.Log(K.Value) / tLinger) * (t - (double)tReturn));

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
            // If in the adaptation phase
            else
            {
                double lambda = Math.Log(1.0 / K.Value) / tAdapt;
                _fK = K.Value * Math.Exp(lambda * (x - tLag));
            }

            return _fK;
        }
    }
}
