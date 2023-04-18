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

    /// <summary>
    /// Represents SPAR-H Performance Shaping Factors (PSF)
    /// </summary>
    public class PSF
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

        public PSF(OperationType type, string factor, List<Level> levels, string id, 
            string initialLevelName = null, bool isStatic = false)
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
            Console.WriteLine("Warning: Hunter.PSF.CalculateInitialLevel No 'Nominal' level found. Setting CurrentLevel to the middle level.");

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

        public void ValidateAgainstStaticEnums()
        {
            ValidateOperationDescription();
            ValidateFactor();
            ValidateId();
            ValidateLevels();
        }

        private void ValidateOperationDescription()
        {
            var typeFields = typeof(PsfEnums.Operation).GetFields(BindingFlags.Public | BindingFlags.Static);

            if (!EnumFieldsContainOperationValue(typeFields, Operation))
            {
                throw new ArgumentException($"Invalid OperationDescription value: {Operation}");
            }
        }

        private bool EnumFieldsContainOperationValue(FieldInfo[] fields, OperationType value)
        {
            return fields.Any(field => Enum.TryParse(field.GetValue(null).ToString(), out OperationType operationType) && operationType == value);
        }

        private void ValidateFactor()
        {
            var factorFields = typeof(PsfEnums.Factor).GetFields(BindingFlags.Public | BindingFlags.Static);

            if (!EnumFieldsContainValue(factorFields, Factor))
            {
                throw new ArgumentException($"Invalid Factor value: {Factor}");
            }
        }

        private void ValidateId()
        {
            var idFields = typeof(PsfEnums.Id).GetFields(BindingFlags.Public | BindingFlags.Static);

            if (!EnumFieldsContainValue(idFields, Id))
            {
                throw new ArgumentException($"Invalid Id value: {Id}");
            }
        }

        private void ValidateLevels()
        {
            Type nestedClass = typeof(PsfEnums.Level).GetNestedTypes().FirstOrDefault(nt => nt.Name == Factor);

            if (nestedClass == null)
            {
                throw new ArgumentException($"Invalid factor name: {Factor}");
            }

            List<string> nestedClassProperties = nestedClass.GetFields().Select(field => field.GetValue(null).ToString()).ToList();

            foreach (Level level in Levels)
            {
                if (!nestedClassProperties.Contains(level.LevelName))
                {
                    throw new ArgumentException($"{level.LevelName} not in PsfEnums.Level.{Factor}");
                }
            }
        }

        private bool EnumFieldsContainValue(FieldInfo[] fields, string value)
        {
            return fields.Any(field => field.GetValue(null).ToString() == value);
        }

        /// <summary>
        /// Current HEP Multiplier for the PSF
        /// </summary>
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

        /// <summary>
        /// Gets the current time multiplier for the PSF. 
        /// If the current level is not set, returns null.
        /// </summary>
        /// <value>
        /// A nullable double representing the time multiplier for the current level or null if the current level is not set.
        /// </value>
        public double? CurrentTimeMultiplier
        {
            get
            {
                if (CurrentLevel == null)
                {
                    return null;
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
        /// Serializes the current PSF instance into a JSON string.
        /// </summary>
        /// <returns>A JSON string representation of the current PSF instance.</returns>
        public string GetJSON()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }

        /// <summary>
        /// Deserializes a JSON string into an PSF instance.
        /// </summary>
        /// <param name="json">The JSON string to deserialize.</param>
        /// <returns>An HRAEngine instance deserialized from the JSON string.</returns>
        public static PSF DeserializeJSON(string json)
        {
            return JsonConvert.DeserializeObject<PSF>(json);
        }
    }
}
