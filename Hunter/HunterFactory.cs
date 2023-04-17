using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter
{
    public static class HunterFactory
    {
        public struct HunterSnapshot
        {
            public bool RepeatMode { get; set; } = true;
            public bool TimeOnShiftFatigueEnabled { get; set; } = true;
            public TimeSpan StartTimeOnShift { get; set; } = default;
            public bool HasTimePressure { get; set; } = false;
            public string Experience { get; set; } = default;

            public HunterSnapshot(
                bool repeatMode, 
                bool timeOnShiftFatigueEnabled, 
                TimeSpan startTimeOnShift, 
                bool hasTimePressure, 
                string experience)
            {
                RepeatMode = repeatMode;
                TimeOnShiftFatigueEnabled = timeOnShiftFatigueEnabled;
                StartTimeOnShift = startTimeOnShift;
                HasTimePressure = hasTimePressure;
                Experience = experience;
            }

            // Get JSON representation of this instance
            public string GetJSON()
            {
                return JsonConvert.SerializeObject(this);
            }

            // Deserialize a JSON string to an instance of HunterSnapshot
            public static HunterSnapshot DeserializeJson(string json)
            {
                return JsonConvert.DeserializeObject<HunterSnapshot>(json);
            }
        }

        public static (HRAEngine, PSFCollection) FromHunterModelFilename(string hunterModelFilename)
        {
            // Get the directory of the hunterModelFilename file
            var hunterModelDir = Path.GetDirectoryName(Path.GetFullPath(hunterModelFilename));

            // Load the hunterModelFilename file into a string
            string json = File.ReadAllText(hunterModelFilename);

            // Create JsonSerializerSettings with MetadataPropertyHandling.ReadAhead to resolve external references
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                MetadataPropertyHandling = MetadataPropertyHandling.ReadAhead
            };

            // Deserialize the JSON into a JObject using JsonConvert and the custom settings
            JObject model = JsonConvert.DeserializeObject<JObject>(json, settings);
            string snapshotRef = (string)model["hunter_snapshot"]["$ref"];

            var snapshotFilename = Path.Combine(hunterModelDir, snapshotRef);
            var jsonData = File.ReadAllText(snapshotFilename);

            // Deserialize the procedure JArray into a Procedure object
            var hunterSnapshot = HunterSnapshot.DeserializeJson(jsonData);

            return CreateOperator(hunterSnapshot);
        }

        public static (HRAEngine, PSFCollection) CreateOperator(HunterSnapshot snapshot)
        {
            return CreateOperator(
                snapshot.RepeatMode,
                snapshot.TimeOnShiftFatigueEnabled,
                snapshot.StartTimeOnShift,
                snapshot.HasTimePressure,
                snapshot.Experience);
        }
        public static (HRAEngine, PSFCollection) CreateOperator(
            bool repeatMode = true, 
            bool timeOnShiftFatigueEnabled = true,
            TimeSpan startTimeOnShift = default,
            bool hasTimePressure = false,
            string experience = default)
        {
            HRAEngine hraEngine = new HRAEngine
            {
                RepeatMode = repeatMode,
                TimeOnShiftFatigueEnabled = timeOnShiftFatigueEnabled,
                TimeOnShift = startTimeOnShift       
            };

            PSFCollection? psfCollection = new PSFCollection();
            if (hasTimePressure)
            {
                psfCollection.SetLevel(PsfEnums.Id.ATa, PsfEnums.Level.AvailableTime.BarelyAdequateTime);
                psfCollection.SetLevel(PsfEnums.Id.ATd, PsfEnums.Level.AvailableTime.BarelyAdequateTime);
            }

            if (experience == PsfEnums.Level.ExperienceAndTraining.Low)
            {
                psfCollection.SetLevel(PsfEnums.Id.EaTa, PsfEnums.Level.ExperienceAndTraining.Low);
                psfCollection.SetLevel(PsfEnums.Id.EaTd, PsfEnums.Level.ExperienceAndTraining.Low);
            }
            else if (experience == PsfEnums.Level.ExperienceAndTraining.High)
            {
                psfCollection.SetLevel(PsfEnums.Id.EaTa, PsfEnums.Level.ExperienceAndTraining.High);
                psfCollection.SetLevel(PsfEnums.Id.EaTd, PsfEnums.Level.ExperienceAndTraining.High);
            }

            return (hraEngine, psfCollection);
        }

        public static (HRAEngine, PSFCollection) CreateNoviceOperator()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.Low);
        }

        public static (HRAEngine, PSFCollection) CreateDefaultOperator()
        {
            return CreateOperator();
        }

        public static (HRAEngine, PSFCollection) CreateExpertOperator()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.High);
        }

        public static (HRAEngine, PSFCollection) CreateDefaultOperatorWithTimePressure()
        {
            return CreateOperator(
                hasTimePressure: true);
        }

        public static (HRAEngine, PSFCollection) CreateNoviceOperatorWithTimePressure()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.Low,
                hasTimePressure: true);
        }

        public static (HRAEngine, PSFCollection) CreateExpertOperatorWithTimePressure()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.High,
                hasTimePressure: true);
        }
    }
}
