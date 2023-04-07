
using System;
using System.Collections.Generic;
using System.IO;
using MathNet.Numerics.Distributions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using MathNet.Numerics.Distributions;

using static Hunter.HRAEngine;

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
        }

        public struct PSF
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
        }

        private Dictionary<string, Primitive> _primitives;
        public HRAEngine(string primitivesFilePath = null)
        {
            if (primitivesFilePath == null)
            {
                string assemblyLocation = Path.GetDirectoryName(typeof(HRAEngine).Assembly.Location);
                primitivesFilePath = Path.Combine(assemblyLocation, "hunter", "archetypes", "primitives.json");
            }
            _primitives = LoadPrimitives(primitivesFilePath);
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
        private static double SampleNormalTime(double time, double std)
        {
            // Create a Normal distribution object with the given mean (time) and standard deviation (std)
            Normal normalDistribution = new Normal(time, std);

            // Sample a random time value from the normal distribution
            double randomTime = normalDistribution.Sample();

            // Ensure the sampled time is non-negative
            randomTime = Math.Max(0, randomTime);

            return randomTime;
        }
        private static double SampleLogTime(double time, double std)
        {
            // Create a Log-Normal distribution object with the given mean (time) and standard deviation (std)
            LogNormal logNormalDistribution = new LogNormal(time, std);

            // Sample a random time value from the log-normal distribution
            double randomTime = logNormalDistribution.Sample();

            // Ensure the sampled time is non-negative
            randomTime = Math.Max(0, randomTime);

            // Return the random time (in seconds) as a double
            return randomTime;
        }

        private static double SampleExponentialTime(double time)
        {
            // Create an Exponential distribution object with the given mean (time)
            Exponential exponentialDistribution = new Exponential(time);

            // Sample a random time value from the exponential distribution
            double randomTime = exponentialDistribution.Sample();

            // Ensure the sampled time is non-negative
            randomTime = Math.Max(0, randomTime);

            // Return the random time (in seconds) as a double
            return randomTime;
        }
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

        public TimeSpan EvaluateSteps(string procedureCollectionJson,
                                      string procedureId,
                                      int startStep, int endStep,
                                      PerformanceShapingFactorCollection? psfs = null)
        {
            var procedureCollection = DeserializeProcedureCollection(procedureCollectionJson);
            return EvaluateSteps(procedureCollection, procedureId,
                startStep, endStep, psfs);

        }

        public TimeSpan EvaluateSteps(Dictionary<string, Procedure> procedureCollection, 
                                      string procedureId,  
                                      int startStep, int endStep,
                                      PerformanceShapingFactorCollection? psfs = null)
        // use 1 relative step numbering
        // to run one step start_step and end_step
        {
            double elapsed_time = 0.0;

            if (procedureCollection.TryGetValue(procedureId, out Procedure procedure))
            {
                for (int i = startStep; i <= endStep; i++)
                {
                    List<string> primitiveIds = procedure.Steps[i - 1].PrimitiveIds;
                    elapsed_time += Evaluate(primitiveIds, psfs);
                }
            }
            else
            {
                Console.WriteLine($"Procedure not found: {procedureId}");
            }

            return TimeSpan.FromSeconds(elapsed_time);
        }

        public double Evaluate(List<string> primitiveIds, PerformanceShapingFactorCollection? psfs = null)
        {
            double elapsed_time = 0.0;
            foreach (string primitiveId in primitiveIds)
            {
                if (_primitives.TryGetValue(primitiveId, out Primitive primitive))
                {
                    string distributionType = primitive.DistributionType;
                    double? time = primitive.Time;
                    double? std = primitive.Std;

                    if (time == null)
                        continue;

                    switch (distributionType)
                    {
                        case "log":
                            // Implement log distribution logic here
                            elapsed_time += SampleLogTime(System.Convert.ToDouble(time), 
                                                          System.Convert.ToDouble(std));
                            break;
                        case "normal":
                            // Implement normal distribution logic here
                            elapsed_time += SampleNormalTime(System.Convert.ToDouble(time),
                                                             System.Convert.ToDouble(std));
                            break;
                        case "exponential":
                            // Implement exponential distribution logic here
                            elapsed_time += SampleExponentialTime(System.Convert.ToDouble(time));
                            break;
                        default:
                            Console.WriteLine($"Unknown distribution type: {distributionType}");
                            break;
                    }
                }
                else
                {
                    Console.WriteLine($"Primitive not found: {primitiveId}");
                }
            }
            // Convert the random time (in seconds) to a TimeSpan object and return it
            return elapsed_time;
        }
        public static Dictionary<string, Procedure> BuildProcedureCatalog(string hunterModelFilename)
        {
            // 
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
    }
}