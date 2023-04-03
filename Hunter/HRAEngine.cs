
using System;
using System.Collections.Generic;
using System.IO;
using MathNet.Numerics.Distributions;
using Newtonsoft.Json;
using MathNet.Numerics.Distributions;

namespace Hunter
{
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

        private Dictionary<string, Primitive> _primitives;
        public HRAEngine(string filePath = null)
        {
            if (filePath == null)
            {
                string assemblyLocation = Path.GetDirectoryName(typeof(HRAEngine).Assembly.Location);
                filePath = Path.Combine(assemblyLocation, "archetypes", "primitives.json");
            }
            _primitives = LoadPrimitives(filePath);
        }

        private Dictionary<string, Primitive> LoadPrimitives(string filePath)
        {
            try
            {
                string jsonData = File.ReadAllText(filePath);
                List<Primitive> primitiveList = JsonConvert.DeserializeObject<List<Primitive>>(jsonData);
                Dictionary<string, Primitive> primitives = new Dictionary<string, Primitive>();

                foreach (var primitive in primitiveList)
                {
                    primitives[primitive.Id] = primitive;
                }

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

        public TimeSpan Evaluate(List<string> primitiveIds)
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
            return TimeSpan.FromSeconds(elapsed_time);
        }
    }
}