
using System;
using System.Collections.Generic;
using System.IO;
using MathNet.Numerics.Distributions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using MathNet.Numerics.Distributions;
using CommonDefLib;

namespace Hunter
{
    public struct Step
    {
        [JsonProperty("primitive_ids")]
        public List<string> PrimitiveIds { get; set; }

        [JsonProperty("step_id")]
        public string StepId { get; set; }
    }

    public struct Procedure
    {
        [JsonProperty("steps")]
        public List<Step> Steps { get; set; }
    }

    public class HRAEngine
    {
        public struct Primitive
        {
            [JsonProperty("operator")]
            public string Operator { get; set; }

            [JsonProperty("sub_operator_type")]
            public string SubOperatorType { get; set; }

            [JsonProperty("base_primitive_type")]
            public string BasePrimitiveType { get; set; }

            [JsonProperty("sub_primitive_type")]
            public string SubPrimitiveType { get; set; }

            [JsonProperty("id")]
            public string Id { get; set; }

            [JsonProperty("distribution_type")]
            public string DistributionType { get; set; }

            [JsonProperty("time")]
            public double? Time { get; set; }

            [JsonProperty("std")]
            public double? Std { get; set; }

            [JsonProperty("nominal_hep")]
            public double NominalHep { get; set; }

            public TaskType OperatorType => Operator == "Action" ? TaskType.Action : TaskType.Diagnosis;

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

        public HRAEngine(string primitivesFilePath = null, TimeSpan timeOnShift = default)
        {
            if (primitivesFilePath == null)
            {
                string assemblyLocation = Path.GetDirectoryName(typeof(HRAEngine).Assembly.Location);
                primitivesFilePath = Path.Combine(assemblyLocation, "hunter", "archetypes", "primitives.json");
            }
            _primitives = LoadPrimitives(primitivesFilePath);
            TimeOnShift = timeOnShift;
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
        internal static double SampleLogTime(double time, double std)
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
        /// <param name="psfs">An optional collection of PerformanceShapingFactor objects to use in the 
        /// evaluation.</param>
        /// <returns>A TimeSpan object representing the total elapsed time to evaluate the specified range 
        /// of steps in the specified Procedure object.</returns>
        public TimeSpan EvaluateSteps(string procedureCollectionJson,
                                      string procedureId,
                                      int startStep, int endStep,
                                      PerformanceShapingFactorCollection? psfs = null)
        {
            var procedureCollection = DeserializeProcedureCollection(procedureCollectionJson);
            return EvaluateSteps(procedureCollection, procedureId,
                startStep, endStep, psfs);
        }

        /// <summary>
        /// Evaluates a range of steps in the specified Procedure object.
        /// </summary>
        /// <param name="procedureCollection">A dictionary of Procedure objects to use in the evaluation.</param>
        /// <param name="procedureId">The ID of the Procedure object to evaluate.</param>
        /// <param name="startStep">The 1-relative index of the first step to evaluate.</param>
        /// <param name="endStep">The 1-relative index of the last step to evaluate.</param>
        /// <param name="psfs">An optional collection of PerformanceShapingFactor objects to use in the evaluation.</param>
        /// <returns>A TimeSpan object representing the total elapsed time to evaluate the specified range of steps in the specified Procedure object.</returns>
        public TimeSpan EvaluateSteps(Dictionary<string, Procedure> procedureCollection,
                                      string procedureId,
                                      int startStep, int endStep,
                                      PerformanceShapingFactorCollection? psfs = null)
        {
            // Initialize elapsed_time and success variables to 0 and true, respectively.
            double elapsed_time = 0.0;
            bool success = true;

            // Check if the specified Procedure object exists in the dictionary.
            if (procedureCollection.TryGetValue(procedureId, out Procedure procedure))
            {
                // Iterate over the range of steps to evaluate.
                for (int i = startStep; i <= endStep; i++)
                {
                    // Get the list of primitive IDs for the current step.
                    List<string> primitiveIds = procedure.Steps[i - 1].PrimitiveIds;

                    // Evaluate the current step and update the elapsed_time variable.
                    bool stepSuccess = true;
                    elapsed_time += Evaluate(primitiveIds, ref stepSuccess, psfs);

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

            // Return the total elapsed time as a TimeSpan object.
            return TimeSpan.FromSeconds(elapsed_time);
        }
        /// <summary>
        /// Evaluates a list of primitive IDs and calculates the elapsed time for each primitive based on its distribution type,
        /// time, and standard deviation. The method also updates the success status based on the nominal human error probability (HEP).
        /// </summary>
        /// <param name="primitiveIds">A list of primitive IDs to evaluate.</param>
        /// <param name="success">A reference to a boolean that indicates whether the evaluation is successful or not.</param>
        /// <param name="psfs">An optional collection of PerformanceShapingFactor objects to use for calculating the elapsed time.</param>
        /// <returns>The total elapsed time for all primitives in the list.</returns>
        public double Evaluate(List<string> primitiveIds, ref bool success, PerformanceShapingFactorCollection? psfs = null)
        {
            double elapsed_time = 0.0;

            foreach (string primitiveId in primitiveIds)
            {
                // Get the primitive object from the _primitives dictionary
                if (_primitives.TryGetValue(primitiveId, out Primitive primitive))
                {
                    // Get the primitive's distribution type, time, standard deviation, and nominal HEP
                    string distributionType = primitive.DistributionType;
                    double? time = primitive.Time;
                    double? std = primitive.Std;
                    double nominalHep = primitive.NominalHep;

                    // If time is null, continue to the next primitive
                    if (time == null)
                        continue;

                    double compositePSF = 1.0;
                    double timeMultiplier = 1.0;

                    // If psfs is not null, calculate the composite multiplier and time multiplier
                    if (psfs != null)
                    {
                        // Get the composite multiplier for the primitive's task type
                        compositePSF = psfs.CompositeMultiplier(primitive.OperatorType);
                        nominalHep *= compositePSF;

                        // Cap the nominal HEP at 1.0
                        if (nominalHep > 1.0)
                            nominalHep = 1.0;

                        // Get the time multiplier for the primitive's task type
                        timeMultiplier = psfs.TimeMultiplier(primitive.OperatorType);
                    }

                    // Sample the elapsed time for the primitive based on its distribution type
                    switch (distributionType)
                    {
                        case "log":
                            elapsed_time += SampleLogTime(Convert.ToDouble(time), Convert.ToDouble(std)) * timeMultiplier;
                            break;
                        case "normal":
                            elapsed_time += SampleNormalTime(Convert.ToDouble(time), Convert.ToDouble(std)) * timeMultiplier;
                            break;
                        case "expo":
                            elapsed_time += SampleExponentialTime(Convert.ToDouble(time)) * timeMultiplier;
                            break;
                        default:
                            Console.WriteLine($"Unknown distribution type: {distributionType}");
                            break;
                    }

                    // Update the success status based on the nominal HEP
                    if (success)
                    {
                        success = SingleRandom.Instance.NextDouble() >= nominalHep;
                    }
                }
                else
                {
                    Console.WriteLine($"Primitive not found: {primitiveId}");
                }
            }

            if (TimeOnShiftFatigueEnabled)
            {
                elapsed_time *= FatigueIndex;
            }

            // Convert the random time (in seconds) to a TimeSpan object and return it
            return elapsed_time;
        }

        /// <summary>
        /// Builds a dictionary of procedures based on a JSON file containing procedure references.
        /// </summary>
        /// <param name="hunterModelFilename">The path of the JSON file containing procedure references.</param>
        /// <returns>A dictionary of procedures keyed by their respective procedure_id.</returns>
        public static Dictionary<string, Procedure> BuildProcedureCatalog(string hunterModelFilename)
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

            // Get the procedure references array
            JArray procedureReferencesArray = (JArray)model["procedure_refs"];

            // Load each procedure into a Dictionary<string, Procedure> with a key that matches the "description" property of the reference object
            Dictionary<string, Procedure> procedures = new Dictionary<string, Procedure>();
            foreach (JObject referenceObject in procedureReferencesArray)
            {
                // Get the $ref property and load the referenced JSON file into a JArray
                string procedureRef = (string)referenceObject["$ref"];
                var procedureFilename = Path.Combine(hunterModelDir, procedureRef);
                var jsonData = File.ReadAllText(procedureFilename);

                // Deserialize the procedure JArray into a Procedure object
                var procedure = JsonConvert.DeserializeObject<Procedure>(jsonData);

                // Add the procedure to the Dictionary using the "description" property as the key
                string key = (string)referenceObject["procedure_id"];
                procedures.Add(key, procedure);
            }

            return procedures;
        }

        /// <summary>
        /// Serializes the current HRAEngine instance into a JSON string.
        /// </summary>
        /// <returns>A JSON string representation of the current HRAEngine instance.</returns>
        public string GetJSON()
        {
            try
            {
                string jsonData = JsonConvert.SerializeObject(this, Formatting.Indented);
                return jsonData;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error serializing HRAEngine instance to JSON: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Deserializes a JSON string into an HRAEngine instance.
        /// </summary>
        /// <param name="json">The JSON string to deserialize.</param>
        /// <returns>An HRAEngine instance deserialized from the JSON string.</returns>
        public static HRAEngine DeserializeJSON(string json)
        {
            try
            {
                HRAEngine deserializedInstance = JsonConvert.DeserializeObject<HRAEngine>(json);
                return deserializedInstance;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deserializing JSON into HRAEngine instance: {ex.Message}");
                return null;
            }
        }

    }
}