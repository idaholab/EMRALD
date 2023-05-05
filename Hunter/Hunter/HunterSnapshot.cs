using Hunter.Hra;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Hunter.Model
{
    /// <summary>
    /// HunterSnapshot is a simple struct that contains all the properties 
    /// of the HRAEngine to support serialization and deserialization.
    /// </summary>
    public struct HunterSnapshot
    {
        public bool RepeatMode { get; set; } = true;
        public bool TimeOnShiftFatigueEnabled { get; set; } = true;
        public TimeSpan TimeOnShift { get; set; } = default;
        public bool HasTimePressure { get; set; } = false;
        public string Experience { get; set; } = default;
        public string? _currentProcedureId { get; set; } = default;
        public string? _currentStepId { get; set; } = default;
        public int _currentEvalState { get; set; } = default;
        public int _primitiveEvalCount { get; set; } = default;
        public int _repeatCount { get; set; } = default;

        public HunterSnapshot(
            bool repeatMode = true,
            bool timeOnShiftFatigueEnabled = true,
            TimeSpan timeOnShift = default,
            bool hasTimePressure = false,
            string experience = "Nominal",
            string? currentProcedureId = null,
            string? currentStepId = null,
            int currentEvalState = -1,
            int primitiveEvalCount = 0,
            int repeatCount = 0)
        {
            RepeatMode = repeatMode;
            TimeOnShiftFatigueEnabled = timeOnShiftFatigueEnabled;
            TimeOnShift = timeOnShift;
            HasTimePressure = hasTimePressure;
            Experience = experience;
            _currentProcedureId = currentProcedureId;
            _currentStepId = currentStepId;
            _currentEvalState = currentEvalState;
            _primitiveEvalCount = primitiveEvalCount;
            _repeatCount = repeatCount;
        }

        // Get JSON representation of this instance
        public string GetJSON()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }

        // Deserialize a JSON string to an instance of HunterSnapshot
        public static HunterSnapshot DeserializeJSON(string json)
        {
            return JsonConvert.DeserializeObject<HunterSnapshot>(json);
        }

        public static HunterSnapshot FromHunterModelFilename(string hunterModelFilename)
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
            var hunterSnapshot = HunterSnapshot.DeserializeJSON(jsonData);

            return hunterSnapshot;
        }
    }
}
