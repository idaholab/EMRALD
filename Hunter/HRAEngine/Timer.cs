using Hunter.Hra;
using System;
using System.Collections.Generic;

namespace Hunter.Hra
{
    public struct Timer
    {
        private HRAEngine _hraEngine;
        public TimeSpan? Duration { get; private set; }
        public TimeSpan StartTime { get; private set; }

        public Timer(Dictionary<string, object> context, HRAEngine hraEngine, string contextKey) : this()
        {
            _hraEngine = hraEngine;
            StartTime = _hraEngine.TimeOnShift;

            double hours = context.ContainsKey(contextKey + "H") ? (double)context[contextKey + "H"] : 0;
            double minutes = context.ContainsKey(contextKey + "M") ? (double)context[contextKey + "M"] : 0;
            double seconds = context.ContainsKey(contextKey + "S") ? (double)context[contextKey + "S"] : 0;

            if (hours != 0 || minutes != 0 || seconds != 0)
            {
                Duration = TimeSpan.FromHours(hours) + 
                           TimeSpan.FromMinutes(minutes) + 
                           TimeSpan.FromSeconds(seconds);
            }
        }

        public Timer(TimeSpan duration, HRAEngine hraEngine) : this()
        {
            _hraEngine = hraEngine;
            StartTime = _hraEngine.TimeOnShift;
            Duration = duration;
        }

        public TimeSpan? RemainingTime
        {
            get
            {
                if (!Duration.HasValue)
                {
                    return null;
                }

                TimeSpan elapsedTime = _hraEngine.TimeOnShift - StartTime;
                TimeSpan remainingTime = Duration.Value - elapsedTime;

                return remainingTime > TimeSpan.Zero ? remainingTime : TimeSpan.Zero;
            }
        }

        public bool? HasTimeRemaining
        {
            get
            {
                TimeSpan? remainingTime = RemainingTime;
                if (!remainingTime.HasValue)
                {
                    return null;
                }

                return remainingTime.HasValue && remainingTime.Value > TimeSpan.Zero;
            }
        }

        public static Timer? FromContext(Dictionary<string, object> context, HRAEngine hraEngine, string contextKey)
        {
            if (!context.ContainsKey(contextKey + "H") &&
                !context.ContainsKey(contextKey + "M") &&
                !context.ContainsKey(contextKey + "S"))
            {
                return null;
            }

            return new Timer(context, hraEngine, contextKey);
        }
    }
}