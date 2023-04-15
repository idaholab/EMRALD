using NUnit.Framework;
using Hunter; // Replace with your actual namespace
using MathNet.Numerics.Distributions;
using CommonDefLib;

namespace Hunter.Tests
{
    [TestFixture]
    public class PerformanceShapingFactorEnumsTest
    {

        [Test]
        public void TestEnums()
        {
            var e = HunterEnums.AvailableTime.ExpansiveTime;

            TestContext.Out.WriteLine($"hello: {e}");
        }
    }
}