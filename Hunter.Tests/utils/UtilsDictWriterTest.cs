using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Globalization;
using System.Linq;
using System;

using Hunter.Utils;

namespace Hunter.Tests.utils
{
    using NUnit.Framework;
    using System.IO;

    [TestFixture]
    public class UtilsDictWriterTests
    {
        private string GetOutputDirectory()
        {
            // construct the output directory path based on the TestFixture and Test names
            string testFixtureName = TestContext.CurrentContext.Test.ClassName;
            string testName = TestContext.CurrentContext.Test.MethodName;
            string outputDirectory = Path.Combine(TestContext.CurrentContext.TestDirectory, "Output", testFixtureName, testName);

            return outputDirectory;
        }

        public void CleanDirectory(string outputDirectory)
        {
            // delete all files and subdirectories in the output directory
            if (Directory.Exists(outputDirectory))
            {
                Directory.Delete(outputDirectory, true);
            }
            Directory.CreateDirectory(outputDirectory);
        }

        [Test]
        public void TestFixtureOutputDirectoryTest()
        {
            // create the output directory if it doesn't exist
            string outputDirectory = GetOutputDirectory();
            CleanDirectory(outputDirectory);

            // use the output directory to write test file outputs
            string outputFile = Path.Combine(outputDirectory, "output.txt");
            File.WriteAllText(outputFile, "test output");

            // assert that the output file exists
            Assert.IsTrue(File.Exists(outputFile), $"Expected output file {outputFile} does not exist.");
        }

        [Test]
        public void DictWriterTest()
        {
            // create the output directory if it doesn't exist
            string outputDirectory = GetOutputDirectory();
            CleanDirectory(outputDirectory);

            // use the output directory to write test file outputs
            string outputFile = Path.Combine(outputDirectory, "output.csv");

            using (var writer = new StreamWriter(outputFile))
            {
                var dictWriter = new DictWriter(writer, new List<string> { "Name", "Age", "Address" });
                dictWriter.WriteHeader();
                dictWriter.WriteRow(new Dictionary<string, object> { { "Name", "John" }, { "Age", 30 }, { "Address", "102, Ps" } });
                dictWriter.WriteRow(new Dictionary<string, object> { { "Name", "Jane" }, { "Age", 25 }, { "Address", "104 Ps" } });
                dictWriter.WriteRows(new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "Name", "Bob" }, { "Age", 40 } },
            new Dictionary<string, object> { { "Name", "Alice" }, { "Age", 35 } }
        });
            }
        }
    }

}
