using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Hunter;

namespace Hunter.Tests.HumanReliabilityAnalysisEngine
{
    [TestFixture]
    public class HRAEngine_FatigueIndex_Tests
    {

        [Test]
        public void FatigueIndex_Test()
        {
            // Arrange
            HRAEngine engine = new HRAEngine();
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(0.6).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test8h()
        {
            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(8));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(0.771).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test12h()
        {
            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(12));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(1.53).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test18h()
        {
            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(18));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(9.36).Within(0.01));
        }

        [Test]
        public void FatigueIndex_Test24h()
        {
            // Arrange
            HRAEngine engine = new HRAEngine(timeOnShift: TimeSpan.FromHours(24));
            var fatigueIndex = engine.FatigueIndex;
            Assert.That(fatigueIndex, Is.EqualTo(9.36).Within(0.01));
        }
    }
}
