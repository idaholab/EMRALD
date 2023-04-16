using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Globalization;
using System.Linq;
using System;
using NUnit.Framework;

using Hunter;
using Hunter.Utils;
using Hunter.utils;

namespace Hunter.Tests.utils
{
    [TestFixture]
    public class UtilsDictWriterTests
    {

        [Test]
        public void TestFixtureOutputDirectoryTest()
        {
            // create the output directory if it doesn't exist
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);

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
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);

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


        [Test]
        public void CsvLoggerTest()
        {
            // create the output directory if it doesn't exist
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);

            // use the output directory to write test file outputs
            string outputFile = Path.Combine(outputDirectory, "output.csv");

            CsvLogger.WriteRow(outputFile, new Dictionary<string, object> { { "Name", "John" }, { "Age", 30 }, { "Address", "102, Ps" } });
            CsvLogger.WriteRow(outputFile, new Dictionary<string, object> { { "Name", "Jane" }, { "Age", 25 }, { "Address", "104 Ps" } });
            CsvLogger.WriteRows(outputFile, new List<Dictionary<string, object>>
            {
                new Dictionary<string, object> { { "Name", "Bob" }, { "Age", 40 }, { "Address", "102, Ps" } },
                new Dictionary<string, object> { { "Name", "Alice" }, { "Age", 35 }, { "Address", "102, Ps" } }
            });

            // assert that the output file exists
            Assert.IsTrue(File.Exists(outputFile), $"Expected output file {outputFile} does not exist.");
        }

        [Test]
        public void CheckFieldNames_ExistingFileWithMatchingFieldNames_NoExceptionThrown()
        {
            // create the output directory if it doesn't exist
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);

            // use the output directory to write test file outputs
            string outputFile = Path.Combine(outputDirectory, "output.csv");

            List<string> fieldnames = new List<string> { "Name", "Age", "City" };
            using (StreamWriter streamWriter = new StreamWriter(outputFile))
            {
                streamWriter.WriteLine("Name,Age,City");
            }

            // Act
            CsvLogger.CheckFieldNames(outputFile, fieldnames);

            // Assert
            Assert.Pass("No exception was thrown.");
        }

        [Test]
        public void CheckFieldNames_ExistingFileWithNonMatchingFieldNames_ArgumentExceptionThrown()
        {
            // create the output directory if it doesn't exist
            string outputDirectory = TestUtility.GetOutputDirectory();
            TestUtility.CleanDirectory(outputDirectory);

            // use the output directory to write test file outputs
            string outputFile = Path.Combine(outputDirectory, "output.csv");

            List<string> fieldnames = new List<string> { "Name", "Age", "City" };
            using (StreamWriter streamWriter = new StreamWriter(outputFile))
            {
                streamWriter.WriteLine("Name,Age,Zip");
            }

            // Act and Assert
            Assert.Throws<ArgumentException>(() => CsvLogger.CheckFieldNames(outputFile, fieldnames));
        }

        [Test]
        public void EnumDictTest()
        {
            PSFCollection _psfs = new PSFCollection();
            PSF psf = _psfs[PsfEnums.Id.Ed];
            
            TestContext.Out.WriteLine($"{OperationType.Action.ToString()}");
            TestContext.Out.WriteLine($"{psf.ToString()}");
        }
    }

}
