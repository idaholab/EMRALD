using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter.Psf
{

    public class LagLinger
    {
        public double t0 { get; set; } // Start of Stress
        public double? tReturn { get; set; } // End of Stress
        public double? K { get; set; } // PSF Multiplier
        public double tAvail { get; set; } // Available Time
        public double tLag { get; set; } // Lag Time Constant
        public double tLinger { get; set; } // Linger Time Constant

        private double _fK = 1;

        public LagLinger(double tLag = 3600, double tLinger = 7400)
        {
            this.tLag = tLag;
            this.tLinger = tLinger;
        }

        public void TriggerLag(double t, double k, double tAvail = 7200)
        {
            t0 = t;
            this.tAvail = tAvail;
            K = k;

            if (tReturn != null)
            {
                tReturn = null;
            }
        }

        public void TriggerLinger(double t)
        {
            tReturn = t + tLinger;
            K = _fK;
        }

        public double getValue(double t)
        {
            
            // TriggerLag has not been called
            if (K is null)
            {
                _fK = 1;
                return _fK;
            }

            // get time since TriggerLag
            var x = t - t0;

            // available time has expired
            if (x >= tAvail && tReturn == null)
            {
                TriggerLinger(t);
            }

            // in linger phase
            if (tReturn != null)
            {
                _fK = Math.Exp(-(Math.Log(K.Value) / tLinger) * (t - (double)tReturn));
                return _fK;
            }

            // in lag phase
            if (x < tLag)
            {
                _fK = ((K.Value - 1) / Math.Log(tLag + 1)) *
                    Math.Log(x + 1) + 1;
                return _fK;

            } 
            // in sustain phase
            else if (x >= tLag && x < tAvail)
            {
                _fK = K.Value;
                return _fK;
            }

            _fK = 1;
            return _fK;

        }
    }
}
