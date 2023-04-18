using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter.hunter_db.ModelBuilder
{
    [TestFixture]
    public class ModelBuilder
    {

        [Test]
        public void BuildFullModels()
        {
            string assemblyLocation = Path.GetDirectoryName(typeof(HRAEngine).Assembly.Location);
            string modelsPath = Path.Combine(assemblyLocation, "../../../", "hunter_db", "models");
            string searchPattern = "*.json";

            string[] filePaths = Directory.GetFiles(modelsPath, searchPattern);

            foreach (string filePath in filePaths)
            {
                string fileName = Path.GetFileName(filePath);

                TestContext.Out.WriteLine(filePath);
                HunterModel model = HunterModel.FromHunterModelFilename(filePath);
                string json = model.GetJSON();

                TestContext.Out.WriteLine("\nFull Model:");
                TestContext.Out.WriteLine(json);
                TestContext.Out.WriteLine("\n\n");

                string outDirectory = Path.Combine(assemblyLocation, "../../../", "hunter_db", "built_models");
                Directory.CreateDirectory(outDirectory);

                string outFilename = Path.Combine(outDirectory, fileName);
                File.WriteAllText(outFilename, json);

                Assert.IsTrue(File.Exists(outFilename));

            }
        }
    }
}
