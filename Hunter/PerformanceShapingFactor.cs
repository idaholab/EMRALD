using System.Collections;
using System.Collections.Generic;
using System.Reflection.Emit;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Hunter
{
    public enum TaskType
    {
        Action,
        Diagnosis
    }


    public class PerformanceShapingFactor
    {
        [JsonIgnore]
        private IUpdateStrategy UpdateStrategy { get; set; }

        [JsonProperty("type")]
        [JsonConverter(typeof(StringEnumConverter))]
        public TaskType Type { get; set; }

        [JsonProperty("label")]
        public string Label { get; set; }

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

        public PerformanceShapingFactor(TaskType type, string label, List<Level> levels, string id, string initialLevelName = null, bool isStatic = false)
        {
            Type = type;
            Label = label;
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
            // Calculate the initial level based on the Levels list
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
                if (level.LevelName.Contains("Nominal"))
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
            if (Label.Contains("Fitness"))
            {
                UpdateStrategy = new FitnessforDuty();
            }

            // Add more strategies here
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
