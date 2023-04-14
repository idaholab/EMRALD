using System.Collections;
using System.Collections.Generic;
using System.Reflection.Emit;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Hunter
{
    public class PerformanceShapingFactorCollection : IEnumerable<PerformanceShapingFactor>
    {
        private readonly Dictionary<string, PerformanceShapingFactor> _psfs;

        public PerformanceShapingFactorCollection(string filePath = null)
        {
            _psfs = new Dictionary<string, PerformanceShapingFactor>();

            if (filePath == "")
                return;

            if (filePath == null)
            {
                string assemblyLocation = Path.GetDirectoryName(typeof(HRAEngine).Assembly.Location);
                filePath = Path.Combine(assemblyLocation, "hunter", "archetypes", "psfs.json");
            }

            string jsonData = File.ReadAllText(filePath);
            List<PerformanceShapingFactor> psfList = 
                JsonConvert.DeserializeObject<List<PerformanceShapingFactor>>(jsonData);
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

        public void Update(HRAEngine? hRAEngine = null, string jsonData = null)
        {
            foreach (var psf in _psfs.Values)
            {
                psf.Update(hRAEngine, jsonData);
            }
        }

        /// <summary>
        /// Calculates the time multiplier for the given task type based on the current 
        /// multipliers of relevant performance shaping factors (PSFs).
        /// </summary>
        /// <param name="taskType">The task type to calculate the time multiplier for.</param>
        /// <returns>The time multiplier for the given task type.</returns>
        public double TimeMultiplier(TaskType taskType)
        {
            // Get all relevant PSFs for the task type
            var relevantPsfs = _psfs.Values.Where(psf => psf.Type == taskType);

            // Filter relevant PSFs further to only include the "Available Time" PSF
            relevantPsfs = relevantPsfs.Where(psf => psf.Label == "Available Time");

            // Calculate the combined multiplier for all relevant PSFs
            double currentMultiplier = relevantPsfs.Aggregate(1.0, (acc, psf) => acc * psf.CurrentMultiplier);

            // If the combined multiplier is greater than 1, return 2.0, otherwise return 1.0
            if (currentMultiplier > 1)
                return 0.5; // execute at twice the speed
            return 1.0;
        }

        /// <summary>
        /// Calculates the composite multiplier for the given task type based on the current 
        /// multipliers of relevant performance shaping factors (PSFs).
        /// </summary>
        /// <param name="taskType">The task type to calculate the composite multiplier for.</param>
        /// <param name="aggregationMethod">The method to use for aggregating the PSF multipliers 
        /// (default is "multiply").</param>
        /// <returns>The composite multiplier for the given task type.</returns>
        public double CompositeMultiplier(TaskType taskType, string aggregationMethod = "multiply")
        {
            // Get all relevant PSFs for the task type
            var relevantPsfs = _psfs.Values.Where(psf => psf.Type == taskType);

            // Aggregate the multipliers based on the specified aggregation method
            switch (aggregationMethod)
            {
                case "multiply":
                    // Multiply the multipliers together
                    return relevantPsfs.Aggregate(1.0, (acc, psf) => acc * psf.CurrentMultiplier);
                case "minimum":
                    // Take the minimum multiplier
                    return relevantPsfs.Min(psf => psf.CurrentMultiplier);
                default:
                    throw new ArgumentException("Invalid aggregation method.");
            }
        }

        public IEnumerator<PerformanceShapingFactor> GetEnumerator()
        {
            return _psfs.Values.GetEnumerator();
        }

        public void Clear()
        {
            _psfs.Clear();
        }

        /// <summary>
        /// Adds a PerformanceShapingFactor to the collection.
        /// </summary>
        /// <param name="psf">The PerformanceShapingFactor to add.</param>
        /// <exception cref="System.ArgumentNullException">Thrown when psf is null.</exception>
        /// <exception cref="System.ArgumentException">Thrown when a PerformanceShapingFactor with the same ID already exists in the collection.</exception>
        public void Add(PerformanceShapingFactor psf, bool overwrite = false)
        {
            if (psf == null)
            {
                throw new ArgumentNullException(nameof(psf), "PerformanceShapingFactor cannot be null.");
            }

            if (_psfs.ContainsKey(psf.Id))
            {
                if (overwrite)
                {
                    _psfs[psf.Id] = psf;
                }
                else
                {
                    throw new ArgumentException($"A PerformanceShapingFactor with ID '{psf.Id}' already exists in the collection.", nameof(psf));
                }
            }
            else
            {
                _psfs.Add(psf.Id, psf);
            }
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        /// <summary>
        /// Sets the current level of a performance shaping factor with the specified ID to the level with the specified name.
        /// </summary>
        /// <param name="psfId">The ID of the performance shaping factor to update.</param>
        /// <param name="levelName">The name of the level to set as the current level.</param>
        /// <exception cref="ArgumentException">Thrown when the specified performance shaping factor ID or level name is not found.</exception>
        ///
        /// <example>
        /// This example demonstrates how to set the level of two performance shaping factors in a collection:
        ///
        /// <code>
        /// var psfCollection = new PerformanceShapingFactorCollection();
        /// psfCollection.SetLevel("ATa", "Barely adequate time");
        /// psfCollection.SetLevel("ATd", "Barely adequate time");
        /// </code>
        /// </example>

        public void SetLevel(string psfId, string levelName)
        {
            // Check if the performance shaping factor exists in the collection
            if (!_psfs.ContainsKey(psfId))
            {
                var validPsfIds = string.Join(", ", _psfs.Keys);
                throw new ArgumentException($"Performance shaping factor with ID '{psfId}' not found. Valid IDs: {validPsfIds}");
            }

            // Retrieve the performance shaping factor from the collection
            PerformanceShapingFactor psf = _psfs[psfId];

            // Search for the level with the specified name in the performance shaping factor's levels list
            PerformanceShapingFactor.Level level = psf.Levels.FirstOrDefault(l => l.LevelName == levelName);

            // Check if the level was found
            if (level == null)
            {
                var validLevelNames = string.Join(", ", psf.Levels.Select(l => l.LevelName));
                throw new ArgumentException($"Level with name '{levelName}' not found for performance shaping factor with ID '{psfId}'. Valid level names: {validLevelNames}");
            }

            // Set the current level of the performance shaping factor to the specified level
            psf.CurrentLevel = level;
        }
        public string GetJSON()
        {
            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.Converters.Add(new PerformanceShapingFactorCollectionConverter());

            return JsonConvert.SerializeObject(this, Formatting.Indented, jsonSettings);
        }

        public static PerformanceShapingFactorCollection DeserializeJSON(string json)
        {
            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.Converters.Add(new PerformanceShapingFactorCollectionConverter());

            return JsonConvert.DeserializeObject<PerformanceShapingFactorCollection>(json, jsonSettings);
        }
    }
}
