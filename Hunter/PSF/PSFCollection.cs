using System.Collections;
using Newtonsoft.Json;
using Hunter.Hra;

namespace Hunter.Psf
{
    public class PSFCollection : IEnumerable<PSF>
    {
        public enum AggregationMethod
        {
            Multipy,
            Minimum
        }

        private readonly Dictionary<string, PSF> _psfs;

        [JsonIgnore]
        public HRAEngine _hraEngine { get; set; }

        public PSFCollection(string filePath = null)
        {
            _psfs = new Dictionary<string, PSF>();

            if (filePath == "")
                return;

            if (filePath == null)
            {
                string assemblyLocation = Path.GetDirectoryName(typeof(HRAEngine).Assembly.Location);
                filePath = Path.Combine(assemblyLocation, "hunter_db", "archetypes", "psfs.json");
            }

            string jsonData = File.ReadAllText(filePath);
            List<PSF> psfList = JsonConvert.DeserializeObject<List<PSF>>(jsonData);
            foreach (PSF psf in psfList)
            {
                _psfs.Add(psf.Id, psf);
                psf.ValidateAgainstStaticEnums();
            }
            SetReferences();
        }

        public PSF this[string id]
        {
            get { return _psfs[id]; }
        }

        public int Count
        {
            get { return _psfs.Count; }
        }

        private Dictionary<string, object> _context;

        private void SetReferences()
        {
            foreach (PSF psf in this)
            {
                _psfs[psf.Id]._psfCollection = this;
            }
        }

        public void SetContext(Dictionary<string, object> context)
        {
            foreach (var grouping in this.Where(p => p.IsStatic && 
                                                context.ContainsKey(p.Factor)).GroupBy(p => p.Factor))
            {
                string levelName = (string)context[grouping.Key];
                foreach (PSF _psf in this.Where(p => p.Factor == grouping.Key))
                {
                    SetLevel(_psf.Id, levelName);
                }
            }

            _context = context;
        }

        public void Update(HRAEngine? hraEngine = null, string jsonData = null)
        {
            foreach (var psf in _psfs.Values)
            {
                psf.Update(hraEngine, jsonData);
            }
        }

        /// <summary>
        /// Retrieves the relevant performance shaping factors (PSFs) for the given primitive.
        /// </summary>
        /// <param name="primitive">The primitive used to determine relevant PSFs.</param>
        /// <returns>A list of relevant performance shaping factors for the specified primitive.</returns>
        public List<PSF> RelevantPsfs(HRAEngine.Primitive primitive)
        {
            var relevantPsfIds = primitive.RelevantPsfIds;
            var relevantPsfs = new List<PSF>();

            foreach (var psfId in relevantPsfIds)
            {
                relevantPsfs.Add(_psfs[psfId]);
            }

            return relevantPsfs;
        }

        /// <summary>
        /// Aggregates a list of multipliers using the specified aggregation method.
        /// </summary>
        /// <param name="multipliers">A list of double values representing the multipliers to be aggregated.</param>
        /// <param name="aggregationMethod">The method to use for aggregating the multipliers (options: "multiply" or "minimum").</param>
        /// <returns>The aggregated value of the multipliers based on the specified aggregation method.</returns>
        /// <exception cref="ArgumentException">Thrown when an invalid aggregation method is provided.</exception>
        /// <exception cref="InvalidOperationException">Thrown when the aggregated multiplier is less than or equal to 0.</exception>
        internal double? AggregateMultipliers(List<double> multipliers, AggregationMethod aggregationMethod)
        {
            return AggregateMultipliers(multipliers.Select(x => (double?)x).ToList(), aggregationMethod);
        }

        /// <summary>
        /// Aggregates a list of multipliers using the specified aggregation method.
        /// </summary>
        /// <param name="multipliers">A list of double values representing the multipliers to be aggregated.</param>
        /// <param name="aggregationMethod">The method to use for aggregating the multipliers (options: "multiply" or "minimum").</param>
        /// <returns>The aggregated value of the multipliers based on the specified aggregation method.</returns>
        /// <exception cref="ArgumentException">Thrown when an invalid aggregation method is provided.</exception>
        /// <exception cref="InvalidOperationException">Thrown when the aggregated multiplier is less than or equal to 0.</exception>
        /// <summary>
        /// Aggregates a list of nullable multipliers using the specified aggregation method, ignoring null values.
        /// </summary>
        /// <param name="multipliers">A list of nullable double values representing the multipliers to be aggregated.</param>
        /// <param name="aggregationMethod">The method to use for aggregating the multipliers (options: "multiply" or "minimum").</param>
        /// <returns>The aggregated value of the non-null multipliers based on the specified aggregation method.</returns>
        /// <exception cref="ArgumentException">Thrown when an invalid aggregation method is provided.</exception>
        /// <exception cref="InvalidOperationException">Thrown when the aggregated multiplier is less than or equal to 0</exception>
        internal double? AggregateMultipliers(List<double?> multipliers, AggregationMethod aggregationMethod)
        {
            var nonNullMultipliers = multipliers.Where(x => x.HasValue).Select(x => x.Value).ToList();

            if (!nonNullMultipliers.Any())
            {
                return null;
            }

            double result;

            switch (aggregationMethod)
            {
                case AggregationMethod.Multipy:
                    result = nonNullMultipliers.Aggregate(1.0, (acc, multiplier) => acc * multiplier);
                    break;
                case AggregationMethod.Minimum:
                    result = nonNullMultipliers.Min();
                    break;
                default:
                    throw new ArgumentException("Invalid aggregation method.");
            }

            if (result <= 0)
            {
                throw new InvalidOperationException("The aggregated multiplier must be greater than 0.");
            }

            return result;
        }



        /// <summary>
        /// Calculates the composite multiplier for the given task type based on the current 
        /// multipliers of relevant performance shaping factors (PSFs).
        /// </summary>
        /// <param name="primitive">The primitive used to determine relevant psfs.</param>
        /// <param name="aggregationMethod">The method to use for aggregating the PSF multipliers 
        /// (default is "multiply").</param>
        /// <returns>The composite multiplier for the given task type.</returns>
        public double CompositeMultiplier(HRAEngine.Primitive primitive, 
            AggregationMethod aggregationMethod = AggregationMethod.Multipy)
        {
            var relevantPsfs = RelevantPsfs(primitive);
            var multipliers = relevantPsfs.Select(psf => psf.CurrentMultiplier).ToList();
            var result = AggregateMultipliers(multipliers, aggregationMethod);

            if (!result.HasValue)
            {
                throw new ArgumentNullException(nameof(result), "The provided value is null.");
            }
            return result.Value;
        }

        /// <summary>
        /// Calculates the time multiplier for the given task type based on the current 
        /// multipliers of relevant performance shaping factors (PSFs).
        /// </summary>
        /// <param name="primitive">The primitive used to determine relevant psfs.</param>
        /// <param name="aggregationMethod">The method to use for aggregating the PSF multipliers 
        /// (default is "multiply").</param>
        /// <returns>The composite multiplier for the given task type.</returns>
        public double? TimeMultiplier(HRAEngine.Primitive primitive, AggregationMethod aggregationMethod = AggregationMethod.Multipy)
        {
            var relevantPsfs = RelevantPsfs(primitive);
            var multipliers = relevantPsfs.Select(psf => psf.CurrentTimeMultiplier).ToList();
            return AggregateMultipliers(multipliers, aggregationMethod);
        }

        public bool HasTimePressure
        {
            get { 
                return (_psfs[PsfEnums.Id.ATa].CurrentLevel.LevelName == 
                        PsfEnums.Level.AvailableTime.BarelyAdequateTime) ||
                       (_psfs[PsfEnums.Id.ATd].CurrentLevel.LevelName == 
                        PsfEnums.Level.AvailableTime.BarelyAdequateTime);
            }
        }

        public IEnumerator<PSF> GetEnumerator()
        {
            return _psfs.Values.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public void Clear()
        {
            _psfs.Clear();
        }

        /// <summary>
        /// Adds a PSF to the collection.
        /// </summary>
        /// <param name="psf">The PSF to add.</param>
        /// <exception cref="System.ArgumentNullException">Thrown when psf is null.</exception>
        /// <exception cref="System.ArgumentException">Thrown when a PSF with the same ID already exists in the collection.</exception>
        public void Add(PSF psf, bool overwrite = false)
        {
            if (psf == null)
            {
                throw new ArgumentNullException(nameof(psf), "PSF cannot be null.");
            }

            if (_psfs.ContainsKey(psf.Id))
            {
                if (overwrite)
                {
                    _psfs[psf.Id] = psf;
                }
                else
                {
                    throw new ArgumentException($"A PSF with ID '{psf.Id}' already exists in the collection.", nameof(psf));
                }
            }
            else
            {
                _psfs.Add(psf.Id, psf);
            }
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
        /// var psfCollection = new PSFCollection();
        /// psfCollection.SetLevel("ATa", "BarelyAdequateTime");
        /// psfCollection.SetLevel("ATd", "BarelyAdequateTime");
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
            PSF psf = _psfs[psfId];

            // Search for the level with the specified name in the performance shaping factor's levels list
            PSF.Level level = psf.Levels.FirstOrDefault(l => l.LevelName == levelName);

            // Check if the level was found
            if (level == null)
            {
                var validLevelNames = string.Join(", ", psf.Levels.Select(l => l.LevelName));
                throw new ArgumentException($"Level with name '{levelName}' not found for performance shaping factor with ID '{psfId}'. Valid level names: {validLevelNames}");
            }

            // Set the current level of the performance shaping factor to the specified level
            psf.CurrentLevel = level;
        }

        /// <summary>
        /// Serializes the current PSFCollection instance into a JSON string.
        /// </summary>
        /// <returns>A JSON string representation of the current PSFCollection instance.</returns>
        public string GetJSON()
        {
            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.Converters.Add(new PSFCollectionConverter());

            return JsonConvert.SerializeObject(this, Formatting.Indented, jsonSettings);
        }

        /// <summary>
        /// Deserializes a JSON string into an PSFCollection instance.
        /// </summary>
        /// <param name="json">The JSON string to deserialize.</param>
        /// <returns>An HRAEngine instance deserialized from the JSON string.</returns>
        public static PSFCollection DeserializeJSON(string json)
        {
            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.Converters.Add(new PSFCollectionConverter());

            return JsonConvert.DeserializeObject<PSFCollection>(json, jsonSettings);
        }
    }
}
