using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter.Tests
{
    public static class TestUtility
    {
        public static string GetOutputDirectory()
        {
            // construct the output directory path based on the TestFixture and Test names
            string testFixtureName = TestContext.CurrentContext.Test.ClassName;
            string testName = TestContext.CurrentContext.Test.MethodName;
            string outputDirectory = Path.Combine(TestContext.CurrentContext.TestDirectory, "Output", testFixtureName, testName);

            return outputDirectory;
        }

        public static void CleanDirectory(string outputDirectory)
        {
            // delete all files and subdirectories in the output directory
            if (Directory.Exists(outputDirectory))
            {
                Directory.Delete(outputDirectory, true);
            }
            Directory.CreateDirectory(outputDirectory);
        }
    }
}