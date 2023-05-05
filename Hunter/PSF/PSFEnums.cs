namespace Hunter.Psf
{
    public static class PsfEnums
    {
        public static readonly string Nominal = "Nominal";

        public static class Operation
        {
            public static readonly string Action = "Action";
            public static readonly string Diagnosis = "Diagnosis";
        }

        public static class Factor
        {
            public static readonly string AvailableTime = "AvailableTime";
            public static readonly string Complexity = "Complexity";
            public static readonly string ErgonomicsHMI = "ErgonomicsHMI";
            public static readonly string ExperienceAndTraining = "ExperienceAndTraining";
            public static readonly string FitnessForDuty = "FitnessForDuty";
            public static readonly string Procedures = "Procedures";
            public static readonly string Stress = "Stress";
            public static readonly string WorkProcesses = "WorkProcesses";
            public static readonly string TimePressure = "TimePressure";
        }

        public static class Id
        {
            public static readonly string ATa = "ATa";
            public static readonly string ATd = "ATd";
            public static readonly string Ca = "Ca";
            public static readonly string Cd = "Cd";
            public static readonly string Ea = "Ea";
            public static readonly string Ed = "Ed";
            public static readonly string EaTa = "EaTa";
            public static readonly string EaTd = "EaTd";
            public static readonly string FfDa = "FfDa";
            public static readonly string FfDd = "FfDd";
            public static readonly string Pa = "Pa";
            public static readonly string Pd = "Pd";
            public static readonly string Sa = "Sa";
            public static readonly string Sd = "Sd";
            public static readonly string WPa = "WPa";
            public static readonly string WPd = "WPd";
            public static readonly string TPa = "TPa";
            public static readonly string TPd = "TPd";
        }

        public static class Level
        {
            public static class AvailableTime
            {
                public static readonly string InadequateTime = "InadequateTime";
                public static readonly string BarelyAdequateTime = "BarelyAdequateTime";
                public static readonly string NominalTime = "NominalTime";
                public static readonly string ExtraTime = "ExtraTime";
                public static readonly string ExpansiveTime = "ExpansiveTime";
            }

            public static class Complexity
            {
                public static readonly string HighlyComplex = "HighlyComplex";
                public static readonly string ModeratelyComplex = "ModeratelyComplex";
                public static readonly string Nominal = "Nominal";
                public static readonly string ObviousDiagnosis = "ObviousDiagnosis";
            }

            public static class ErgonomicsHMI
            {
                public static readonly string MissingOrMisleading = "MissingOrMisleading";
                public static readonly string Poor = "Poor";
                public static readonly string Nominal = "Nominal";
                public static readonly string Good = "Good";
            }

            public static class ExperienceAndTraining
            {
                public static readonly string Low = "Low";
                public static readonly string Nominal = "Nominal";
                public static readonly string High = "High";
            }

            public static class FitnessForDuty
            {
                public static readonly string Unfit = "Unfit";
                public static readonly string DegradedFitness = "DegradedFitness";
                public static readonly string Nominal = "Nominal";
            }

            public static class Procedures
            {
                public static readonly string NotAvailable = "NotAvailable";
                public static readonly string Incomplete = "Incomplete";
                public static readonly string AvailableButPoor = "AvailableButPoor";
                public static readonly string Nominal = "Nominal";
                public static readonly string DiagnosticOrSymptomOriented = "DiagnosticOrSymptomOriented";
            }

            public static class Stress
            {
                public static readonly string Extreme = "Extreme";
                public static readonly string High = "High";
                public static readonly string Nominal = "Nominal";
            }

            public static class WorkProcesses
            {
                public static readonly string Poor = "Poor";
                public static readonly string Nominal = "Nominal";
                public static readonly string Good = "Good";
            }

            public static class TimePressure
            {
                public static readonly string Nominal = "Nominal";
                public static readonly string High = "High";
            }

        }
    }
}
