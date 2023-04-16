using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using System.Reflection.Emit;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Hunter
{
    public enum OperationType
    {
        Action,
        Diagnosis
    }

    public class PerformanceShapingFactor
    {
        [JsonIgnore]
        private IUpdateStrategy UpdateStrategy { get; set; }

        [JsonProperty("operation")]
        [JsonConverter(typeof(StringEnumConverter))]
        public OperationType Operation { get; set; }

        [JsonProperty("factor")]
        public string Factor { get; set; }

        [JsonProperty("levels")]
        public List<Level> Levels { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("is_static", DefaultValueHandling = DefaultValueHandling.Populate)]
        public bool IsStatic { get; set; } = false;

        [JsonProperty("initial_level")]
        public string? InitialLevel { get; set; }

        [JsonIgnore]
        public Level CurrentLevel { get; set; }

        public class Level
        {
            [JsonProperty("level")]
            public string LevelName { get; set; }

            [JsonProperty("multiplier")]
            public double Multiplier { get; set; }

            [JsonProperty("time_multiplier")]
            public double? TimeMultiplier { get; set; } = null;
        }

        public PerformanceShapingFactor(OperationType type, string factor, List<Level> levels, string id, 
            string initialLevelName = null, bool isStatic = false, bool validateAgainstEnums = true)
        {
            Operation = type;
            Factor = factor;
            Levels = levels;
            Id = id;
            IsStatic = isStatic;
            InitialLevel = initialLevelName;
            CalculateInitialLevel();
            SetUpdateStrategy();
        }


        [OnDeserialized]
        private void OnDeserialized(StreamingContext context)
        {
            CalculateInitialLevel();
            SetUpdateStrategy();
        }

        private void CalculateInitialLevel()
        {
            // If InitialLevel is not null or empty, find the corresponding level
            if (!string.IsNullOrEmpty(InitialLevel))
            {
                CurrentLevel = Levels.FirstOrDefault(l => l.LevelName == InitialLevel);
                if (CurrentLevel == null)
                {
                    throw new ArgumentException($"Invalid initial level name: {InitialLevel}");
                }
                return;
            }

            // If no matching level is found or InitialLevel is not specified, use the existing logic
            foreach (Level level in Levels)
            {
                if (level.LevelName.Contains(PsfEnums.Nominal))
                {
                    CurrentLevel = level;
                    return;
                }
            }

            // If no level with "Nominal" is found, warn the user
            Console.WriteLine("Warning: Hunter.PerformanceShapingFactor.CalculateInitialLevel No 'Nominal' level found. Setting CurrentLevel to the middle level.");

            // If no level with "Nominal" is found, set CurrentLevel to the middle level
            int middleIndex = (int)Math.Round((double)Levels.Count / 2) - 1;
            CurrentLevel = Levels[middleIndex];
        }

        private void SetUpdateStrategy()
        {
            if (Factor == PsfEnums.Factor.FitnessForDuty)
            {
                UpdateStrategy = new FitnessforDuty();
            }

            // Add more strategies here
        }

        // called from PerformanceShapingFactorCollection
        public void ValidateAgainstStaticEnums()
        {
            // Check if OperationDescription is in PsfEnums.OperationDescription
            var typeFields = typeof(PsfEnums.Operation).GetFields(BindingFlags.Public | BindingFlags.Static);
            bool typeMatched = false;

            foreach (var field in typeFields)
            {
                if (Enum.TryParse(field.GetValue(null).ToString(), out OperationType taskType) && taskType == Operation)
                {
                    typeMatched = true;
                    break;
                }
            }

            if (!typeMatched)
            {
                throw new ArgumentException($"Invalid OperationDescription value: {Operation}");
            }

            // Check if Factor is in PsfEnums.Factor
            var factorFields = typeof(PsfEnums.Factor).GetFields(BindingFlags.Public | BindingFlags.Static);
            if (!factorFields.Any(field => field.GetValue(null).ToString() == Factor))
            {
                throw new ArgumentException($"Invalid Factor value: {Factor}");
            }

            // Check if Id is in PsfEnums.Id
            var idFields = typeof(PsfEnums.Id).GetFields(BindingFlags.Public | BindingFlags.Static);
            if (!idFields.Any(field => field.GetValue(null).ToString() == Id))
            {
                throw new ArgumentException($"Invalid Id value: {Id}");
            }

            // Get the nested class corresponding to the current factor in the PsfEnums.Level class
            Type nestedClass = typeof(PsfEnums.Level).GetNestedTypes().FirstOrDefault(nt => nt.Name == Factor);

            if (nestedClass == null)
            {
                throw new ArgumentException($"Invalid factor name: {Factor}");
            }

            // Get the property names in the nested class
            List<string> nestedClassProperties = nestedClass.GetFields().Select(field => field.GetValue(null).ToString()).ToList();

            // Compare the property names with the level names in the Levels list
            foreach (Level level in Levels)
            {
                if (!nestedClassProperties.Contains(level.LevelName))
                {
                    throw new ArgumentException($"{level.LevelName} not in PsfEnums.Level.{Factor}");
                }
            }
        }

        public double CurrentMultiplier
        {
            get
            {
                if (CurrentLevel == null)
                {
                    return 0;
                }
                return Levels.FirstOrDefault(l => l.LevelName == CurrentLevel.LevelName)?.Multiplier ?? 1.0;
            }
        }

        public double? CurrentTimeMultiplier
        {
            get
            {
                if (CurrentLevel == null)
                {
                    return 1;
                }
                return Levels.FirstOrDefault(l => l.LevelName == CurrentLevel.LevelName)?.TimeMultiplier;
            }
        }

        public void Update(HRAEngine? hRAEngine= null, string jsonData = null)
        {
            if (IsStatic)
            {
                return;
            } else
            {
                // Implement effect of lag and linger on PSF levels

                // Adjust PSF based on plant state
                UpdateStrategy?.UpdateLevel(this, hRAEngine, jsonData);

            }
        }

        /// <summary>
        /// Serializes the current PerformanceShapingFactor instance into a JSON string.
        /// </summary>
        /// <returns>A JSON string representation of the current PerformanceShapingFactor instance.</returns>
        public string GetJSON()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }

        /// <summary>
        /// Deserializes a JSON string into an PerformanceShapingFactor instance.
        /// </summary>
        /// <param name="json">The JSON string to deserialize.</param>
        /// <returns>An HRAEngine instance deserialized from the JSON string.</returns>
        public static PerformanceShapingFactor DeserializeJSON(string json)
        {
            return JsonConvert.DeserializeObject<PerformanceShapingFactor>(json);
        }
    }
}
