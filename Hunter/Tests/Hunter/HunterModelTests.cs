using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;

namespace Hunter.Tests
{
    using System.IO;
    using Newtonsoft.Json.Linq;
    using NUnit.Framework;
    using Hunter.Model;

    namespace HunterTests
    {
        [TestFixture]
        public class HunterModelTests
        {
            private const string TestFilename = @"hunter_db/models/default_wTimePressure.json";

            [Test]
            public void FromHunterModelFilename_WithValidFilename_ReturnsHunterModelInstance()
            {
                HunterModel model = HunterModel.FromHunterModelFilename(TestFilename);

                Assert.IsNotNull(model);
                Assert.IsNotNull(model.Snapshot);
                Assert.IsNotNull(model.Task);
                Assert.IsNotNull(model.Task.ProcedureCatalog);
                Assert.IsTrue(model.Task.ProcedureCatalog.ContainsKey("sgtr"));
                Assert.IsTrue(model.Task.ProcedureCatalog.ContainsKey("rapid_shutdown"));
            }

            [Test]
            public void GetJSON_WithInitializedModel_ReturnsValidJson()
            {
                HunterModel model = HunterModel.FromHunterModelFilename(TestFilename);
                string json = model.GetJSON();
                TestContext.WriteLine(json);

                JObject parsedJson = JObject.Parse(json);


                Assert.IsNotNull(parsedJson["Snapshot"]);
                Assert.IsNotNull(parsedJson["Task"]);
            }

            [Test]
            public void DeserializeJSON_WithValidJson_ReturnsHunterModelInstance()
            {
                HunterModel model = HunterModel.FromHunterModelFilename(TestFilename);
                string json = model.GetJSON();
                
                HunterModel model2 = HunterModel.DeserializeJSON(json);
                string json2 = model.GetJSON();
                TestContext.WriteLine(json2);


                Assert.That(model.Snapshot.RepeatMode, Is.EqualTo(model2.Snapshot.RepeatMode));
                Assert.IsNotNull(model2);
                Assert.IsNotNull(model2.Snapshot);
                Assert.IsNotNull(model2.Task);
                Assert.IsNotNull(model2.Task.ProcedureCatalog);
                Assert.IsTrue(model2.Task.ProcedureCatalog.ContainsKey("sgtr"));
                Assert.IsTrue(model2.Task.ProcedureCatalog.ContainsKey("rapid_shutdown"));
            }
        }
    }

}
