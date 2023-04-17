
using System;
using System.Collections.Generic;
using System.IO;
using MathNet.Numerics.Distributions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections;
using CommonDefLib;
using Newtonsoft.Json.Converters;
using System.Data.Common;
using MathNet.Numerics.LinearAlgebra.Solvers;
using NLog;
using Hunter.utils;
using static Hunter.HRAEngine;

namespace Hunter
{
    public enum DistributionType
    {
        Lognormal,
        Normal,
        Exponential
    }

    public class HRAEngine : IEnumerable<Primitive>
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
        public int RepeatCount
        {
            get { return _repeatCount; }
        }

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

        private Step? _currentStep;
        private string? _currentProcedureId;

        private int _primitiveEvalCount;

        public int PrimitiveEvalCount
        {
            get { return _primitiveEvalCount; }
        }
        public void ResetPrimitiveEvalCount()
        {
            _primitiveEvalCount = 0;
        }

        public int Count
        {
            get { return _primitives.Count; }
        }

        public HRAEngine(string primitivesFilePath = null, TimeSpan timeOnShift = default)
        {
            if (primitivesFilePath == null)
            {
                string assemblyLocation = Path.GetDirectoryName(typeof(HRAEngine).Assembly.Location);
                primitivesFilePath = Path.Combine(assemblyLocation, "hunter_db", "archetypes", "primitives.json");
            }
            _primitives = LoadPrimitives(primitivesFilePath);
            TimeOnShift = timeOnShift;
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
        /// Samples a random time value from a Normal distribution with the given mean and standard deviation.
        /// </summary>
        /// <param name="time">The mean time value of the Normal distribution.</param>
        /// <param name="std">The standard deviation of the Normal distribution.</param>
        /// <returns>A random time value sampled from the Normal distribution with a minimum value of zero.</returns>
        internal static double SampleNormalTime(double time, double std)
        {
            // Create a Normal distribution object with the given mean (time) and standard deviation (std)
            Normal normalDistribution = new Normal(time, std, SingleRandom.Instance);

            // Sample a random time value from the normal distribution
            double randomTime = normalDistribution.Sample();

            // Ensure the sampled time is non-negative
            randomTime = Math.Max(0, randomTime);

            return randomTime;
        }

        /// <summary>
        /// Samples a random time value from a Log-Normal distribution with the given mean and standard deviation.
        /// </summary>
        /// <param name="time">The mean time value of the Log-Normal distribution.</param>
        /// <param name="std">The standard deviation of the Log-Normal distribution.</param>
        /// <returns>A random time value sampled from the Log-Normal distribution with a minimum value of zero.</returns>
        internal static double SampleLognormalTime(double time, double std)
        {
            // Calculate the shape and scale parameters
            double shape = Math.Sqrt(Math.Log(1 + (std * std) / (time * time)));
            double scale = Math.Log(time) - 0.5 * shape * shape;

            // Create a Log-Normal distribution object with the given shape and scale parameters
            LogNormal logNormalDistribution = new LogNormal(scale, shape, SingleRandom.Instance);

            // Sample a random time value from the Log-Normal distribution
            double randomTime = logNormalDistribution.Sample();

            // Ensure the sampled time is non-negative
            randomTime = Math.Max(0, randomTime);

            // Return the random time (in seconds) as a double
            return randomTime;
        }
        /// <summary>
        /// Samples a random time value from an Exponential distribution with the given mean.
        /// </summary>
        /// <param name="time">The mean time value of the Exponential distribution.</param>
        /// <returns>A random time value sampled from the Exponential distribution with a minimum value of zero.</returns>
        internal static double SampleExponentialTime(double time)
        {
            // Create an Exponential distribution object with the given mean (time)
            var rate = 1 / time;
            Exponential exponentialDistribution = new Exponential(rate, SingleRandom.Instance);

            // Sample a random time value from the exponential distribution
            double randomTime = exponentialDistribution.Sample();

            // Ensure the sampled time is non-negative
            randomTime = Math.Max(0, randomTime);

            // Return the random time (in seconds) as a double
            return randomTime;
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
                                      PSFCollection? psfs = null,
                                      string? outputDir = null)
        {
            var procedureCollection = DeserializeProcedureCollection(procedureCollectionJson);
            return EvaluateSteps(procedureCollection, procedureId,
                startStep, endStep, psfs, outputDir);
        }

        /// <summary>
        /// Evaluates a range of steps in the specified Procedure object.
        /// </summary>
        /// <param name="procedureCollection">A dictionary of Procedure objects to use in the evaluation.</param>
        /// <param name="procedureId">The ID of the Procedure object to evaluate.</param>
        /// <param name="startStep">The 1-relative index of the first step to evaluate.</param>
        /// <param name="endStep">The 1-relative index of the last step to evaluate.</param>
        /// <param name="psfs">An optional collection of PSF objects to use in the evaluation.</param>
        /// <returns>A TimeSpan object representing the total elapsed time to evaluate the specified range of steps in the specified Procedure object.</returns>
        public TimeSpan EvaluateSteps(Dictionary<string, Procedure> procedureCollection,
                                      string procedureId,
                                      int startStep, int endStep,
                                      PSFCollection? psfs = null,
                                      string? outputDir = null)
        {
            // Initialize elapsed_time and success variables to 0 and true, respectively.
            double elapsed_time = 0.0;
            bool success = true;


            // Check if the specified Procedure object exists in the dictionary.
            if (procedureCollection.TryGetValue(procedureId, out Procedure procedure))
            {
                _currentProcedureId = procedureId;

                // Iterate over the range of steps to evaluate.
                for (int i = startStep; i <= endStep; i++)
                {
                    // Get the list of primitive IDs for the current step.
                    _currentStep = procedure.Steps[i - 1];
                    List<string> primitiveIds = _currentStep?.PrimitiveIds;

                    // Evaluate the current step and update the elapsed_time variable.
                    bool stepSuccess = true;
                    elapsed_time += Evaluate(primitiveIds, ref stepSuccess, psfs, outputDir);

                    // If RepeatMode is true and the current step was not successful, repeat the evaluation up to the specified maximum count.
                    if (RepeatMode && !stepSuccess)
                    {
                        for (int j = 1; j < MaxRepeatCount && !stepSuccess; j++)
                        {
                            _repeatCount += 1;
                            stepSuccess = true;
                            elapsed_time += Evaluate(primitiveIds, ref stepSuccess, psfs);
                        }
                    }

                    // Update the overall success variable based on the success of the current step.
                    success = success && stepSuccess;
                }
            }
            else
            {
                Console.WriteLine($"Procedure not found: {procedureId}");
            }

            if (psfs!= null)
            {
                psfs.Update(this);
            }

            _currentStep = null;
            _currentProcedureId = null;
            // Return the total elapsed time as a TimeSpan object.
            return TimeSpan.FromSeconds(elapsed_time);
        }

        /// <summary>
        /// Evaluates a list of primitive IDs and calculates the elapsed time for each primitive based on its distribution type,
        /// time, and standard deviation. The method also updates the success status based on the nominal human error probability (HEP).
        /// </summary>
        /// <param name="primitiveIds">A list of primitive IDs to evaluate.</param>
        /// <param name="success">A reference to a boolean that indicates whether the evaluation is successful or not.</param>
        /// <param name="psfs">An optional collection of PSF objects to use for calculating the elapsed time.</param>
        /// <returns>The total elapsed time for all primitives in the list.</returns>
        public double Evaluate(List<string> primitiveIds, 
                               ref bool success, 
                               PSFCollection? psfs = null,
                               string? outputDir = null)
        {
            double elapsed_time = 0.0;

            foreach (string primitiveId in primitiveIds)
            {
                // Get the primitive object from the _primitives dictionary
                if (_primitives.TryGetValue(primitiveId, out Primitive primitive))
                {
                    if (primitive.Time is null)
                        continue;

                    elapsed_time += EvaluatePrimitive(primitive, ref success, psfs, outputDir);
                }
                else
                {
                    Console.WriteLine($"Primitive not found: {primitiveId}");
                }
            }

            if (outputDir != null)
            {
                // use the output directory to write test file outputs
                string outputFile = Path.Combine(outputDir, "step.csv");

                Dictionary<string, object> record = new Dictionary<string, object>
                {
                    { "step_id", _currentStep?.StepId ?? "null" },
                    { "success", success ? 1 : 0 },
                    { "elapsed_time", elapsed_time }
                };
                CsvLogger.WriteRow(outputFile, record);
            }

            // Convert the random time (in seconds) to a TimeSpan object and return it
            return elapsed_time;
        }

        public double EvaluatePrimitive(Primitive primitive, 
                                        ref bool success, 
                                        PSFCollection? psfs = null,
                                        string? outputDir = null)
        {
            // Get the primitive's distribution type, time, standard deviation, and nominal HEP
            var distributionType = primitive.Distribution;
            double? time = primitive.Time;
            double? std = primitive.Std;
            double nominal_hep = primitive.NominalHep;
            double adjusted_hep = nominal_hep;

            double psf_composite_multiplier = 1.0;
            double psf_time_multiplier = 1.0;
            double sampled_time = 0;
            // Sample the elapsed time for the primitive based on its distribution type
            switch (distributionType)
            {
                case DistributionType.Lognormal:
                    sampled_time = SampleLognormalTime(Convert.ToDouble(time), Convert.ToDouble(std));
                    break;
                case DistributionType.Normal:
                    sampled_time = SampleNormalTime(Convert.ToDouble(time), Convert.ToDouble(std));
                    break;
                case DistributionType.Exponential:
                    sampled_time = SampleExponentialTime(Convert.ToDouble(time));
                    break;
                default:
                    Console.WriteLine($"Unknown distribution type: {distributionType}");
                    break;
            }

            double adjusted_time = sampled_time;

            if (psfs != null)
            {
                // Get the composite multiplier for the primitive
                psf_composite_multiplier = psfs.CompositeMultiplier(primitive);
                adjusted_hep *= psf_composite_multiplier;

                // Cap the nominal HEP at 1.0
                if (adjusted_hep > 1.0)
                    adjusted_hep = 1.0;

                // Get the time multiplier for the primitive
                psf_time_multiplier = psfs.TimeMultiplier(primitive) ?? 1.0;
                adjusted_time *= psf_time_multiplier;
            }

            double fatigue_index = 1.0;
            if (TimeOnShiftFatigueEnabled)
            {
                fatigue_index = FatigueIndex;
                adjusted_time *= fatigue_index;
            }

            _primitiveEvalCount += 1;

            // Update the success status based on the adjusted HEP
            if (success)
            {
                success = SingleRandom.Instance.NextDouble() >= adjusted_hep;
            }
            
            TimeOnShift += TimeSpan.FromSeconds(adjusted_time);

            if (outputDir != null)
            {
                // use the output directory to write test file outputs
                string outputFile = Path.Combine(outputDir, "primitive.csv");

                Dictionary<string, object> record = new Dictionary<string, object>
                {
                    { "procedure_id", _currentProcedureId ?? "null" },
                    { "step_id", _currentStep?.StepId ?? "null" },
                    { "primitive_id", primitive.Id },
                    { "success", success ? 1 : 0 },
                    { "sampled_time", sampled_time },
                    { "psf_time_multiplier", psfs != null ? psf_time_multiplier : "null" },
                    { "fatigue_index", TimeOnShiftFatigueEnabled ? fatigue_index : "null"},
                    { "adjusted_time", adjusted_time },
                    { "nominal_hep", nominal_hep },
                    { "psf_composite_multiplier", psfs != null ? psf_composite_multiplier : "null" },
                    { "adjusted_hep", adjusted_hep },
                };
                CsvLogger.WriteRow(outputFile, record);
            }

            return adjusted_time;
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