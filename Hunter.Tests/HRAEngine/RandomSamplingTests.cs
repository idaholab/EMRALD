using NUnit.Framework;
using Hunter; // Replace with your actual namespace
using MathNet.Numerics.Distributions;
using CommonDefLib;

namespace Hunter.Tests.HumanReliabilityAnalysisEngine
{
    [TestFixture]
    public class RandomSamplingTests
    {
        private int seed = 1234;

        [Test]
        public void TestSampleNormalTimeSeed()
        {
            SingleRandom.Reset();
            ConfigData.seed = seed; // Set the seed for the random number generator

            double mean = 10;
            double std = 2;

            double firstSample = HRAEngine.SampleNormalTime(mean, std);
            double secondSample = HRAEngine.SampleNormalTime(mean, std);
            double thirdSample = HRAEngine.SampleNormalTime(mean, std);

            TestContext.Out.WriteLine($"Random Sequence: {firstSample}, {secondSample}, {thirdSample}");


            Assert.AreEqual(firstSample, 9.555961172814055, 0.0001);
            Assert.AreEqual(secondSample, 9.712146815037777, 0.0001);
            Assert.AreEqual(thirdSample, 9.705234995378733, 0.0001);
        }

        [Test]
        public void TestSampleLogTimeSeed()
        {
            SingleRandom.Reset();
            ConfigData.seed = seed; // Set the seed for the random number generator

            double mean = 10;
            double std = 6;

            double firstSample = HRAEngine.SampleLognormalTime(mean, std);
            double secondSample = HRAEngine.SampleLognormalTime(mean, std);
            double thirdSample = HRAEngine.SampleLognormalTime(mean, std);

            TestContext.Out.WriteLine($"Random Sequence: {firstSample}, {secondSample}, {thirdSample}");

            Assert.AreEqual(firstSample, 7.581644173065969, 0.0001);
            Assert.AreEqual(secondSample, 7.917168049025229, 0.0001);
            Assert.AreEqual(thirdSample, 7.902010535724295, 0.0001);
        }

        [Test]
        public void TestSampleExponentialTimeSeed()
        {
            SingleRandom.Reset();
            ConfigData.seed = seed; // Set the seed for the random number generator

            double mean = 10;

            double firstSample = HRAEngine.SampleExponentialTime(mean);
            double secondSample = HRAEngine.SampleExponentialTime(mean);
            double thirdSample = HRAEngine.SampleExponentialTime(mean);

            TestContext.Out.WriteLine($"Random Sequence: {firstSample}, {secondSample}, {thirdSample}");

            Assert.AreEqual(firstSample, 9.185909269006093, 0.0001);
            Assert.AreEqual(secondSample, 1.0992707573464877, 0.0001);
            Assert.AreEqual(thirdSample, 11.41928206896894, 0.0001);
        }

        [Test]
        public void TestSampleNormalTime()
        {
            double mean = 10;
            double std = 2;

            double firstSample = HRAEngine.SampleNormalTime(mean, std);
            double secondSample = HRAEngine.SampleNormalTime(mean, std);
            double thirdSample = HRAEngine.SampleNormalTime(mean, std);

            TestContext.Out.WriteLine($"Random Sequence: {firstSample}, {secondSample}, {thirdSample}");

            Assert.AreNotEqual(firstSample, 9.555961172814055);
            Assert.AreNotEqual(secondSample, 9.712146815037777);
            Assert.AreNotEqual(thirdSample, 9.705234995378733);
        }

        [Test]
        public void TestSampleLogTime()
        {
            double mean = 10;
            double std = 6;

            double firstSample = HRAEngine.SampleLognormalTime(mean, std);
            double secondSample = HRAEngine.SampleLognormalTime(mean, std);
            double thirdSample = HRAEngine.SampleLognormalTime(mean, std);

            TestContext.Out.WriteLine($"Random Sequence: {firstSample}, {secondSample}, {thirdSample}");
            
            Assert.AreNotEqual(firstSample, 8.667883518442164);
            Assert.AreNotEqual(secondSample, 9.13644044511333);
            Assert.AreNotEqual(thirdSample, 9.115704986136201);
        }

        [Test]
        public void TestSampleExponentialTime()
        {
            double mean = 10;

            double firstSample = HRAEngine.SampleExponentialTime(mean);
            double secondSample = HRAEngine.SampleExponentialTime(mean);
            double thirdSample = HRAEngine.SampleExponentialTime(mean);

            TestContext.Out.WriteLine($"Random Sequence: {firstSample}, {secondSample}, {thirdSample}");

            Assert.AreNotEqual(firstSample, 9.185909269006093);
            Assert.AreNotEqual(secondSample, 1.0992707573464877);
            Assert.AreNotEqual(thirdSample, 11.41928206896894);
        }
    }
}
