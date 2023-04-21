using CommonDefLib;
using MathNet.Numerics.Distributions;

namespace Hunter.Hra.Distributions
{
    /// <summary>
    /// Represents an abstract distribution handler, which is responsible for sampling time values based on different distributions.
    /// </summary>
    public abstract class DistributionHandler
    {
        /// <summary>
        /// Samples a time value based on the distribution type associated with the given primitive.
        /// </summary>
        /// <param name="primitive">The primitive object containing the distribution information.</param>
        /// <returns>A sampled time value.</returns>
        public abstract double SampleTime(HRAEngine.Primitive primitive);
    }

    /// <summary>
    /// Represents a lognormal distribution handler, which is responsible for sampling time values based on the lognormal distribution.
    /// </summary>
    public class LognormalDistributionHandler : DistributionHandler
    {
        /// <summary>
        /// Samples a time value based on the lognormal distribution associated with the given primitive.
        /// </summary>
        /// <param name="primitive">The primitive object containing the distribution information.</param>
        /// <returns>A sampled time value.</returns>
        public override double SampleTime(HRAEngine.Primitive primitive)
        {
            return SampleLognormalTime(Convert.ToDouble(primitive.Time), Convert.ToDouble(primitive.Std));
        }

        /// <summary>
        /// Samples a random time value from a Log-Normal distribution with the given mean and standard deviation.
        /// </summary>
        /// <param name="time">The mean time value of the Log-Normal distribution.</param>
        /// <param name="std">The standard deviation of the Log-Normal distribution.</param>
        /// <returns>A random time value sampled from the Log-Normal distribution with a minimum value of zero.</returns>
        public static double SampleLognormalTime(double time, double std)
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

    }

    /// <summary>
    /// Represents a normal distribution handler, which is responsible for sampling time values based on the normal distribution.
    /// </summary>
    public class NormalDistributionHandler : DistributionHandler
    {
        /// <summary>
        /// Samples a time value based on the normal distribution associated with the given primitive.
        /// </summary>
        /// <param name="primitive">The primitive object containing the distribution information.</param>
        /// <returns>A sampled time value.</returns>
        public override double SampleTime(HRAEngine.Primitive primitive)
        {
            return SampleNormalTime(Convert.ToDouble(primitive.Time), Convert.ToDouble(primitive.Std));
        }

        /// <summary>
        /// Samples a random time value from a Normal distribution with the given mean and standard deviation.
        /// </summary>
        /// <param name="time">The mean time value of the Normal distribution.</param>
        /// <param name="std">The standard deviation of the Normal distribution.</param>
        /// <returns>A random time value sampled from the Normal distribution with a minimum value of zero.</returns>
        public static double SampleNormalTime(double time, double std)
        {
            // Create a Normal distribution object with the given mean (time) and standard deviation (std)
            Normal normalDistribution = new Normal(time, std, SingleRandom.Instance);

            // Sample a random time value from the normal distribution
            double randomTime = normalDistribution.Sample();

            // Ensure the sampled time is non-negative
            randomTime = Math.Max(0, randomTime);

            return randomTime;
        }

    }

    /// <summary>
    /// Represents an exponential distribution handler, which is responsible for sampling time values based on the exponential distribution.
    /// </summary>
    public class ExponentialDistributionHandler : DistributionHandler
    {
        /// <summary>
        /// Samples a time value based on the exponential distribution associated with the given primitive.
        /// </summary>
        /// <param name="primitive">The primitive object containing the distribution information.</param>
        /// <returns>A sampled time value.</returns>
        public override double SampleTime(HRAEngine.Primitive primitive)
        {
            return SampleExponentialTime(Convert.ToDouble(primitive.Time));
        }

        /// <summary>
        /// Samples a random time value from an Exponential distribution with the given mean.
        /// </summary>
        /// <param name="time">The mean time value of the Exponential distribution.</param>
        /// <returns>A random time value sampled from the Exponential distribution with a minimum value of zero.</returns>
        public static double SampleExponentialTime(double time)
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
    }

    /// <summary>
    /// Represents an unknown distribution handler, which is responsible for handling unrecognized distribution types.
    /// </summary>
    public class UnknownDistributionHandler : DistributionHandler
    {
        /// <summary>
        /// Handles the case when an unknown distribution type is encountered in the given primitive.
        /// </summary>
        /// <param name="primitive">The primitive object containing the unknown distribution information.</param>
        /// <returns>A default time value of 0.</returns>
        public override double SampleTime(HRAEngine.Primitive primitive)
        {
            Console.WriteLine($"Unknown distribution type: {primitive.Distribution}");
            return 0;
        }
    }
}
