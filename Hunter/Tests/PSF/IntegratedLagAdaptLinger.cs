using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hunter.Psf;
using Hunter.Hra;

using NUnit.Framework;
using Hunter.Model;

namespace Hunter.Tests.PerformanceShapingFactorTests
{
    [TestFixture]
    public class Integrated_LagLinger_Model_Tests
    {
        [Test]
        public void DefaultOp_2hr()
        {
            HRAEngine hraEngine = HunterFactory.CreateDefaultOperator();
            hraEngine.TimeOnShift = TimeSpan.FromHours(1);
            hraEngine.psfCollection.SetLevel(PsfEnums.Id.Sd, PsfEnums.Level.Stress.Extreme);
            hraEngine.TimeOnShift += TimeSpan.FromSeconds(3600);
            double v = hraEngine.psfCollection[PsfEnums.Id.Sd].CurrentMultiplier;
            TestContext.WriteLine(v);
            Assert.AreEqual(5.332764505119454, v, 0.00001);
        }
        [Test]
        public void DefaultOp_12hr()
        {
            HRAEngine hraEngine = HunterFactory.CreateDefaultOperator();
            hraEngine.TimeOnShift = TimeSpan.FromHours(12);
            hraEngine.psfCollection.SetLevel(PsfEnums.Id.Sd, PsfEnums.Level.Stress.Extreme);
            hraEngine.TimeOnShift += TimeSpan.FromSeconds(3600);
            double v = hraEngine.psfCollection[PsfEnums.Id.Sd].CurrentMultiplier;
            TestContext.WriteLine(v);
            Assert.AreEqual(3.2598774286086822, v, 0.00001);
        }
    }
}
