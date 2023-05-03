using Newtonsoft.Json;
using System.Collections;
using CommonDefLib;
using Newtonsoft.Json.Converters;
using Hunter.Utils;
using Hunter.Psf;
using Hunter.Proc;
using Hunter.Model;
using Hunter.Hra.Distributions;
using Hunter.ExpGoms;

namespace Hunter.Hra
{
    public enum DistributionType
    {
        Lognormal,
        Normal,
        Exponential
    }

    public class HRAEngine : IEnumerable<HRAEngine.Primitive>
    {
        public struct Primitive
        {
            [JsonProperty("operation")]
            public string OperationDescription { get; set; }

            [JsonProperty("sub_operation")]
            public string SubOperation { get; set; }

            [JsonProperty("base_primitive")]
            public string BasePrimitive { get; set; }

            [JsonProperty("sub_primitive")]
            public string SubPrimitive { get; set; }

            [JsonProperty("id")]
            public string Id { get; set; }

            [JsonProperty("distribution_type")]
            [JsonConverter(typeof(StringEnumConverter))]
            public DistributionType Distribution { get; set; }

            [JsonProperty("time")]
            public double? Time { get; set; }

            [JsonProperty("std")]
            public double? Std { get; set; }

            [JsonProperty("nominal_hep")]
            public double NominalHep { get; set; }

            [JsonProperty("relevant_psfs")]
            public List<string> RelevantPsfIds { get; set; }

            public OperationType Operation => 
                OperationDescription == PsfEnums.Operation.Action ? OperationType.Action : OperationType.Diagnosis;
        }

        private Dictionary<string, Primitive> _primitives;

        private PSFCollection _psfCollection;
        public PSFCollection psfCollection { get { return _psfCollection; } }
        internal void SetPSFCollection(PSFCollection value) { 
            _psfCollection = value; 
            _psfCollection._hraEngine = this;
        }

        /// <summary>
        /// Gets or sets a value indicating whether to repeat <see cref="EvalStep"/> until all primitives are completed (default is false).
        /// </summary>
        /// <remarks>
        /// When <see cref="RepeatMode"/> is true, <see cref="EvalStep"/> will be repeated until all primitives are completed. When <see cref="RepeatMode"/> is false, <see cref="EvalStep"/> will only be called once.
        /// </remarks>
        public bool RepeatMode { get; set; } = false;

        /// <summary>
        /// The number of times an action should be repeated.
        /// </summary>
        private int _repeatCount;

        /// <summary>
        /// Gets the number of times an action should be repeated.
        /// </summary>
        public int RepeatCount { get { return _repeatCount; } }
        internal void SetRepeatCount(int value) { _repeatCount = value; }

        /// <summary>
        /// Gets or sets the maximum number of repetitions for <see cref="EvalStep"/> when <see cref="RepeatMode"/> is true (default is 100).
        /// </summary>
        /// <remarks>
        /// When <see cref="RepeatMode"/> is true, <see cref="EvalStep"/> will be repeated until all primitives are completed or the maximum repeat count is reached.
        /// </remarks>
        public int MaxRepeatCount { get; set; } = 100;

        /// <summary>
        /// Gets or sets a value indicating whether TimeOnShift Fatigue should impact the model.
        /// </summary>
        /// <value><c>true</c> if TimeOnShift Fatigue should impact the model; otherwise, <c>false</c>.</value>
        public bool TimeOnShiftFatigueEnabled { get; set; } = true;

        /// <summary>
        /// The time on shift
        /// </summary>
        public TimeSpan TimeOnShift { get; set; } = TimeSpan.Zero;

        /// <summary>
        /// Calculates the fatigue index based on the duration of the shift.
        /// </summary>
        /// <returns>The fatigue index as a double value.</returns>
        public double FatigueIndex
        {
            get
            {
                double timeOnShiftH = Math.Min(TimeOnShift.TotalHours, 18);
                return ((0.0054 * Math.Pow(timeOnShiftH, 3)) -
                        (0.0939 * Math.Pow(timeOnShiftH, 2)) +
                        (0.4271 * timeOnShiftH) + 0.599);
            }
        }

        private string? _currentStepId;
        public string? CurrentStepId { get { return _currentStepId; } }
        internal void SetCurrentStepId(string? value) { _currentStepId = value; }


        private string? _currentProcedureId;
        public string? CurrentProcedureId { get { return _currentProcedureId; } }

        internal void SetCurrentProcedureId(string? value) { _currentProcedureId = value; }


        public bool? StepSuccess;

        private bool? _currentSuccess;
        public bool? CurrentSuccess { get { return _currentSuccess; } }
        internal void SetCurrentSuccess(bool? value) { _currentSuccess = value; }


        private int _primitiveEvalCount;
        public int PrimitiveEvalCount { get { return _primitiveEvalCount; } }
        internal void SetPrimitiveEvalCount(int value) { _primitiveEvalCount = value; }
        public void ResetPrimitiveEvalCount() { _primitiveEvalCount = 0; }

        private Dictionary<string, object> _context;
        public Dictionary<string, object> Context { get { return _context; } }


        private AvailableTime _taskAvailableTime;
        public AvailableTime TaskAvailableTime { get { return _taskAvailableTime; } }

        public int Count
        {
            get { return _primitives.Count; }
        }

        private List<string> _eventLog { get; set; } = new List<string>();

        public HRAEngine(string primitivesFilePath = null, TimeSpan timeOnShift = default, bool initPsfs = true)
        {
            if (primitivesFilePath == null)
            {
                string assemblyLocation = Path.GetDirectoryName(typeof(HRAEngine).Assembly.Location);
                primitivesFilePath = Path.Combine(assemblyLocation, "hunter_db", "archetypes", "primitives.json");
            }
            _primitives = LoadPrimitives(primitivesFilePath);
            TimeOnShift = timeOnShift;
            if (initPsfs)
                _psfCollection = new PSFCollection();
        }

        public HunterSnapshot Snapshot()
        {
            string experience = "null";
            bool hasTimePressure = false;
            if (psfCollection != null)
            {
                experience = psfCollection[PsfEnums.Id.Ea].CurrentLevel.LevelName;
                hasTimePressure = psfCollection.HasTimePressure;
            }

            return new HunterSnapshot
            {
                RepeatMode = RepeatMode,
                TimeOnShiftFatigueEnabled = TimeOnShiftFatigueEnabled,
                TimeOnShift = TimeOnShift,
                Experience = experience,
                HasTimePressure = hasTimePressure,
                _currentProcedureId = CurrentProcedureId,
                _currentStepId = CurrentStepId,
                _currentSuccess = CurrentSuccess,
                _primitiveEvalCount = PrimitiveEvalCount,
                _repeatCount = RepeatCount
            };
        }

        public void SetContext(Dictionary<string, object> context)
        {
            if (context.ContainsKey("ShiftTimeH"))
            {
                TimeOnShift = TimeSpan.FromHours((double)context["ShiftTimeH"]);
            }

            // Get the available time from the context
            AvailableTime? availableTime = AvailableTime.FromContext(context, this);
            if (availableTime != null)
            {
                _taskAvailableTime = (AvailableTime)availableTime;
            }

            // Set the context in the PSF collection
            if (psfCollection != null)
            {
                psfCollection.SetContext(context);
            }

            _context = context;
        }

        /// <summary>
        /// Adds a Primitive to the collection.
        /// </summary>
        /// <param name="primitive">The Primitive to add.</param>
        /// <exception cref="System.ArgumentNullException">Thrown when primitive is null.</exception>
        /// <exception cref="System.ArgumentException">Thrown when a Primitive with the same ID already exists in the collection.</exception>
        public void Add(Primitive primitive, bool overwrite = false)
        {
            if (_primitives.ContainsKey(primitive.Id))
            {
                if (overwrite)
                {
                    _primitives[primitive.Id] = primitive;
                }
                else
                {
                    throw new ArgumentException($"A Primitive with ID '{primitive.Id}' already exists in the collection.", nameof(primitive));
                }
            }
            else
            {
                _primitives.Add(primitive.Id, primitive);
            }
        }

        /// <summary>
        /// Retrieves a Primitive object from the _primitives dictionary by the specified string id.
        /// </summary>
        /// <param name="id">The string id of the Primitive object to retrieve.</param>
        /// <returns>The Primitive object with the specified id.</returns>
        /// <exception cref="KeyNotFoundException">Thrown if the specified id is not found in the _primitives dictionary.</exception>
        public Primitive GetPrimitiveById(string id)
        {
            if (_primitives.ContainsKey(id))
            {
                return _primitives[id];
            }
            else
            {
                throw new KeyNotFoundException($"Primitive with id '{id}' not found.");
            }
        }

        public IEnumerator<Primitive> GetEnumerator()
        {
            return _primitives.Values.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public void Clear()
        {
            _primitives.Clear();
        }

        private Dictionary<string, Primitive> LoadPrimitives(string filePath)
        {
            try
            {
                string jsonData = File.ReadAllText(filePath);
                List<Primitive> primitiveList = JsonConvert.DeserializeObject<List<Primitive>>(jsonData);
                Dictionary<string, Primitive> primitives = new Dictionary<string, Primitive>();
                primitives = primitiveList.ToDictionary(p => p.Id, p => p);

                return primitives;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading JSON file: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Deserializes a JSON string into a dictionary of Procedure objects.
        /// </summary>
        /// <param name="procedureCollectionJson">The JSON string to deserialize.</param>
        /// <returns>A dictionary of Procedure objects deserialized from the JSON string.</returns>
        /// <exception cref="ArgumentException">Thrown when an error occurs while deserializing the JSON string, or if the deserialized procedure collection has no items.</exception>
        private Dictionary<string, Procedure> DeserializeProcedureCollection(string procedureCollectionJson)
        {
            Dictionary<string, Procedure> catalog;
            try
            {
                catalog = JsonConvert.DeserializeObject<Dictionary<string, Procedure>>(procedureCollectionJson);
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"Error deserializing JSON: {ex.Message}");
            }

            if (catalog == null || catalog.Count == 0)
            {
                throw new ArgumentException("Deserialized procedure collection has no items.");
            }

            return catalog;
        }

        /// <summary>
        /// Deserializes a JSON string into a dictionary of Procedure objects, then evaluates a range 
        /// of steps in the specified Procedure object.
        /// </summary>
        /// <param name="procedureCollectionJson">The JSON string to deserialize into a dictionary of 
        /// Procedure objects.</param>
        /// <param name="procedureId">The ID of the Procedure object to evaluate.</param>
        /// <param name="startStep">The 1-relative index of the first step to evaluate.</param>
        /// <param name="endStep">The 1-relative index of the last step to evaluate.</param>
        /// <param name="psfs">An optional collection of PSF objects to use in the 
        /// evaluation.</param>
        /// <returns>A TimeSpan object representing the total elapsed time to evaluate the specified range 
        /// of steps in the specified Procedure object.</returns>
        public TimeSpan EvaluateSteps(string procedureCollectionJson,
                                      string procedureId,
                                      int startStep, int endStep,
                                      string? outputDir = null,
                                      bool? success = true)
        {
            var procedureCollection = DeserializeProcedureCollection(procedureCollectionJson);
            return EvaluateSteps(procedureCollection, procedureId,
                startStep, endStep, outputDir);
        }

        public TimeSpan EvaluateSteps(Dictionary<string, Procedure> procedureCollection,
                              string procedureId,
                              int startStep, int endStep,
                              string? outputDir = null)
        {
            psfCollection?.Update(this);
            double elapsedTime = 0.0;
            _currentSuccess = true;
            if (procedureCollection.TryGetValue(procedureId, out Procedure procedure))
            {
                _currentProcedureId = procedureId;
                for (int i = startStep; i <= endStep; i++)
                {
                    _currentStepId = procedure.Steps[i - 1].StepId;
                    List<ExpressiveGoms.Token> tokens = procedure.Steps[i - 1].GomsExpression;

                    elapsedTime += ExpressiveGoms.EvaluatePostfixExpression(tokens, this);
                    elapsedTime += HandleRepeatMode(tokens);

                    // ExpressiveGoms sets StepSuccess
                    _currentSuccess = (_currentSuccess & StepSuccess) ?? null;

                    if (!_taskAvailableTime.HasTimeRemaining ?? false && _currentSuccess != null)
                    {
                        _currentSuccess = null;
                    }

                    // halt execution of the procedure if the current step failed
                    if (_currentSuccess == null)
                    {
                        return TimeSpan.MaxValue;
                        //return TimeSpan.FromSeconds(elapsedTime);
                    }
                }
            }
            else
            {
                Console.WriteLine($"Procedure not found: {procedureId}");
            }

            if (_currentSuccess != true)
            {
                return TimeSpan.MaxValue;
            } else
            {
                return TimeSpan.FromSeconds(elapsedTime);

            }

        }

        private double HandleRepeatMode(List<ExpressiveGoms.Token> groupedTokens)
        {
            double elapsedTime = 0.0;

            if (RepeatMode && (StepSuccess == false))
            {
                for (int j = 1; j < MaxRepeatCount && (StepSuccess == false); j++)
                {
                    _repeatCount += 1;
                    elapsedTime += ExpressiveGoms.EvaluatePostfixExpression(groupedTokens, this);
                }
            }

            return elapsedTime;
        }
        internal double Evaluate(List<string> primitiveIds,
                       ref bool? success,
                       string? outputDir = null)
        {
            double elapsedTime = 0.0;

            foreach (string primitiveId in primitiveIds)
            {
                elapsedTime += EvaluatePrimitiveById(primitiveId, ref success, outputDir);
            }

            if (outputDir != null)
            {
                WriteEvaluateOutput(outputDir, success, elapsedTime);
            }

            return elapsedTime;
        }

        private double EvaluatePrimitiveById(string primitiveId,
                                             ref bool? success,
                                             string? outputDir)
        {
            double elapsedTime = 0.0;

            if (_primitives.TryGetValue(primitiveId, out Primitive primitive))
            {
                if (primitive.Time is null)
                    return elapsedTime;

                elapsedTime = EvaluatePrimitive(primitive, ref success, outputDir);
            }
            else
            {
                Console.WriteLine($"Primitive not found: {primitiveId}");
            }

            return elapsedTime;
        }

        private void WriteEvaluateOutput(string outputDir, bool? success, double elapsedTime)
        {
            string outputFile = Path.Combine(outputDir, "step.csv");

            Dictionary<string, object> record = new Dictionary<string, object>
            {
                { "step_id", _currentStepId ?? "null" },
                { "success", success?.CompareTo(true) ?? 0 },
                { "elapsed_time", elapsedTime }
            };
            CsvLogger.WriteRow(outputFile, record);
        }
        /// <summary>
        /// Evaluates a primitive, calculating the adjusted time and human error probability (HEP) based on the given primitive, PSF collection, and output directory.
        /// </summary>
        /// <param name="primitive">The primitive object to evaluate.</param>
        /// <param name="success">A reference to a nullable boolean indicating the success status of the primitive.</param>
        /// <param name="psfs">The PSF collection object containing the time multiplier and composite multiplier, or null if not available.</param>
        /// <param name="outputDir">The output directory for writing test file outputs, or null if not required.</param>
        /// <returns>The adjusted time value for the primitive.</returns>
        public double EvaluatePrimitive(Primitive primitive,
                                        ref bool? success,
                                        string? outputDir = null)
        {
            double sampled_time = SamplePrimitiveTime(primitive);
            double adjusted_hep = CalculateAdjustedHep(primitive);
            double adjusted_time = CalculateAdjustedTime(primitive, sampled_time);

            if (adjusted_hep == 1.0)
                success = null;

            if (success == true)
            {
                success = SingleRandom.Instance.NextDouble() >= adjusted_hep;
            }

            TimeOnShift += TimeSpan.FromSeconds(adjusted_time);

            if (outputDir != null)
            {
                WritePrimitiveOutput(primitive, success, sampled_time, adjusted_time, outputDir);
            }

            _primitiveEvalCount += 1;

            return adjusted_time;
        }

        /// <summary>
        /// Calculates the adjusted human error probability (HEP) based on the given primitive and PSF collection.
        /// </summary>
        /// <param name="primitive">The primitive object containing the nominal HEP.</param>
        /// <param name="psfs">The PSF collection object containing the composite multiplier, or null if not available.</param>
        /// <returns>The adjusted HEP value.</returns>
        private double CalculateAdjustedHep(Primitive primitive)
        {
            double nominal_hep = primitive.NominalHep;
            double adjusted_hep = nominal_hep;

            if (psfCollection != null)
            {
                double psf_composite_multiplier = psfCollection.CompositeMultiplier(primitive);
                adjusted_hep *= psf_composite_multiplier;

                if (adjusted_hep > 1.0)
                    adjusted_hep = 1.0;
            }

            return adjusted_hep;
        }

        /// <summary>
        /// Samples a time value for the given primitive based on its distribution type.
        /// </summary>
        /// <param name="primitive">The primitive object containing the distribution information.</param>
        /// <returns>A sampled time value.</returns>
        private double SamplePrimitiveTime(Primitive primitive)
        {
            DistributionHandler handler = primitive.Distribution switch
            {
                DistributionType.Lognormal => new LognormalDistributionHandler(),
                DistributionType.Normal => new NormalDistributionHandler(),
                DistributionType.Exponential => new ExponentialDistributionHandler(),
                _ => new UnknownDistributionHandler(),
            };

            return handler.SampleTime(primitive);
        }

        /// <summary>
        /// Calculates the adjusted time value based on the given primitive, PSF collection, and sampled time.
        /// </summary>
        /// <param name="primitive">The primitive object containing the distribution information.</param>
        /// <param name="psfs">The PSF collection object containing the time multiplier, or null if not available.</param>
        /// <param name="sampled_time">The sampled time value.</param>
        /// <returns>The adjusted time value.</returns>
        private double CalculateAdjustedTime(Primitive primitive, double sampled_time)
        {
            double adjusted_time = sampled_time;

            if (psfCollection != null)
            {
                double psf_time_multiplier = psfCollection.TimeMultiplier(primitive) ?? 1.0;
                adjusted_time *= psf_time_multiplier;
            }

            if (TimeOnShiftFatigueEnabled)
            {
                adjusted_time *= FatigueIndex;
            }

            return adjusted_time;
        }

        /// <summary>
        /// Writes the primitive evaluation output to a CSV file in the specified output directory.
        /// </summary>
        /// <param name="primitive">The primitive object to evaluate.</param>
        /// <param name="success">A nullable boolean indicating the success status of the primitive.</param>
        /// <param name="psfs">The PSF collection object containing the time multiplier and composite multiplier, or null if not available.</param>
        /// <param name="sampled_time">The sampled time value.</param>
        /// <param name="adjusted_time">The adjusted time value.</param>
        /// <param name="outputDir">The output directory for writing test file outputs.</param>
        private void WritePrimitiveOutput(Primitive primitive, bool? success, double sampled_time, double adjusted_time, string outputDir)
        {
            string outputFile = Path.Combine(outputDir, "primitive.csv");

            Dictionary<string, object> record = new Dictionary<string, object>
            {
                { "procedure_id", _currentProcedureId ?? "null" },
                { "step_id", _currentStepId ?? "null" },
                { "primitive_id", primitive.Id },
                { "success", success?.CompareTo(true) ?? 00 },
                { "sampled_time", sampled_time },
                { "psf_time_multiplier", psfCollection != null ? psfCollection.TimeMultiplier(primitive) ?? 1.0 : "null" },
                { "fatigue_index", TimeOnShiftFatigueEnabled ? FatigueIndex : "null" },
                { "adjusted_time", adjusted_time },
                { "nominal_hep", primitive.NominalHep },
                { "psf_composite_multiplier", psfCollection != null ? psfCollection.CompositeMultiplier(primitive) : "null" },
                { "adjusted_hep", CalculateAdjustedHep(primitive) },
            };
            CsvLogger.WriteRow(outputFile, record);
        }

        /// <summary>
        /// Serializes the current HRAEngine instance into a JSON string.
        /// </summary>
        /// <returns>A JSON string representation of the current HRAEngine instance.</returns>
        public string GetJSON()
        {
            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.Converters.Add(new HRAEngineConverter());

            return JsonConvert.SerializeObject(this, Formatting.Indented, jsonSettings);
        }

        /// <summary>
        /// Deserializes a JSON string into an HRAEngine instance.
        /// </summary>
        /// <param name="json">The JSON string to deserialize.</param>
        /// <returns>An HRAEngine instance deserialized from the JSON string.</returns>
        public static HRAEngine DeserializeJSON(string json)
        {
            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.Converters.Add(new HRAEngineConverter());

            return JsonConvert.DeserializeObject<HRAEngine>(json, jsonSettings);
        }

    }
}