using Hunter.Hra;
using System;
using System.Collections.Generic;

namespace Hunter.Hra
{
    public struct AvailableTime
    {
        private HRAEngine _hraEngine;
        public TimeSpan? Duration { get; private set; }
        public TimeSpan StartTime { get; private set; }

        public AvailableTime(Dictionary<string, object> context, HRAEngine hraEngine) : this()
        {
            _hraEngine = hraEngine;
            StartTime = _hraEngine.TimeOnShift;

            int hours = context.ContainsKey("TaskAvailableTimeH") ? (int)context["TaskAvailableTimeH"] : 0;
            int minutes = context.ContainsKey("TaskAvailableTimeM") ? (int)context["TaskAvailableTimeM"] : 0;
            int seconds = context.ContainsKey("TaskAvailableTimeS") ? (int)context["TaskAvailableTimeS"] : 0;

            if (hours != 0 || minutes != 0 || seconds != 0)
            {
                Duration = TimeSpan.FromHours(hours) + TimeSpan.FromMinutes(minutes) + TimeSpan.FromSeconds(seconds);
            }
        }

        public AvailableTime(TimeSpan duration, HRAEngine hraEngine) : this()
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

        public static AvailableTime? FromContext(Dictionary<string, object> context, HRAEngine hraEngine)
        {
            if (!context.ContainsKey("TaskAvailableTimeH") &&
                !context.ContainsKey("TaskAvailableTimeM") &&
                !context.ContainsKey("TaskAvailableTimeS"))
            {
                return null;
            }

            return new AvailableTime(context, hraEngine);
        }
    }
}