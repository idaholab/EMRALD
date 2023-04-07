using Newtonsoft.Json;

namespace Hunter
{
    using System.Collections;
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using Newtonsoft.Json;

    public class PerformanceShapingFactor
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("label")]
        public string Label { get; set; }

        [JsonProperty("levels")]
        public List<Level> Levels { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("is_static", DefaultValueHandling = DefaultValueHandling.Populate)]
        public bool IsStatic { get; set; } = false;

        [JsonProperty("initial_level")]
        public Level? InitialLevel { get; set; }

        [JsonIgnore]
        public Level CurrentLevel { get; set; }

        public class Level
        {
            [JsonProperty("level")]
            public string LevelName { get; set; }

            [JsonProperty("multiplier")]
            public double Multiplier { get; set; }
        }

        public PerformanceShapingFactor(string type, string label, List<Level> levels, string id, string initialLevelName = null, bool isStatic = false)
        {
            Type = type;
            Label = label;
            Levels = levels;
            Id = id;
            IsStatic = isStatic;

            if (initialLevelName != null)
            {
                CurrentLevel = Levels.FirstOrDefault(l => l.LevelName == initialLevelName);
                if (CurrentLevel == null)
                {
                    throw new ArgumentException("Invalid initial level name.");
                }
            }
            else
            {
                CalculateInitialLevel();
            }
        }

        [OnDeserialized]
        private void OnDeserialized(StreamingContext context)
        {
            // Calculate the initial level based on the Levels list
            CalculateInitialLevel();
        }

        public void CalculateInitialLevel()
        {
            foreach (Level level in Levels)
            {
                if (level.LevelName.Contains("Nominal"))
                {
                    CurrentLevel = level;
                    return;
                }
            }
            // If no level with "Nominal" is found, set CurrentLevel to the first level in the list
            CurrentLevel = Levels[0];
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

        public void Update(TimeSpan? elapsedTime = null, string jsonData = null)
        {
            if (IsStatic)
            {
                return;
            } else
            {
                // update current level
            }
        }
    }

    public class PerformanceShapingFactorCollection : IEnumerable<PerformanceShapingFactor>
    {
        private readonly Dictionary<string, PerformanceShapingFactor> _psfs;

        public PerformanceShapingFactorCollection(string filePath = null)
        {
            if (filePath == null)
            {
                string assemblyLocation = Path.GetDirectoryName(typeof(HRAEngine).Assembly.Location);
                filePath = Path.Combine(assemblyLocation, "hunter", "archetypes", "psfs.json");
            }

            string jsonData = File.ReadAllText(filePath);
            List<PerformanceShapingFactor> psfList = JsonConvert.DeserializeObject<List<PerformanceShapingFactor>>(jsonData);

            _psfs = new Dictionary<string, PerformanceShapingFactor>();
            foreach (PerformanceShapingFactor psf in psfList)
            {
                _psfs.Add(psf.Id, psf);
            }
        }
        public PerformanceShapingFactor this[string id]
        {
            get { return _psfs[id]; }
        }

        public int Count
        {
            get { return _psfs.Count; }
        }

        public void Update(TimeSpan? elapsedTime = null, string jsonData = null)
        {
            foreach (var psf in _psfs.Values)
            {
                psf.Update(elapsedTime, jsonData);
            }
        }
        public double AggregateMultiplier(string aggregationMethod = "minimum")
        {
            switch (aggregationMethod)
            {
                case "minimum":
                    double minMultiplier = double.MaxValue;
                    foreach (PerformanceShapingFactor psf in _psfs.Values)
                    {
                        double currentMultiplier = psf.CurrentMultiplier;
                        if (currentMultiplier < minMultiplier)
                        {
                            minMultiplier = currentMultiplier;
                        }
                    }
                    return minMultiplier;
                default:
                    throw new ArgumentException("Invalid aggregation method.");
            }
        }

        public IEnumerator<PerformanceShapingFactor> GetEnumerator()
        {
            return _psfs.Values.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}

