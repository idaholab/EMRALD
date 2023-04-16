using Hunter.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter.utils
{
    public static class CsvLogger
    {
        private static readonly Dictionary<string, List<string>> fieldnameCache =
            new Dictionary<string, List<string>>();

        internal static void CreateDirectory(string outputFile)
        {
            string outputDirectory = Path.GetDirectoryName(outputFile);
            if (!Directory.Exists(outputDirectory))
            {
                Directory.CreateDirectory(outputDirectory);
            }
        }

        internal static void CheckFieldNames(string outputFile, List<string> newFieldNames)
        {
            if (fieldnameCache.TryGetValue(outputFile, out List<string> existingFieldNames))
            {
                if (!newFieldNames.SequenceEqual(existingFieldNames))
                {
                    throw new ArgumentException("The field names in the record do not match the existing field names in the file.");
                }
            }
            else
            {
                using (StreamReader reader = new StreamReader(outputFile))
                {
                    string headerLine = reader.ReadLine().TrimEnd('\r', '\n');
                    existingFieldNames = new List<string>(headerLine.Split(','));
                    fieldnameCache[outputFile] = existingFieldNames;

                    if (!newFieldNames.SequenceEqual(existingFieldNames))
                    {
                        throw new ArgumentException("The field names in the record do not match the existing field names in the file.");
                    }
                }
            }

        }

        public static void WriteRow(string outputFile, Dictionary<string, object> record)
        {
            CreateDirectory(outputFile);

            bool writeHeader = !File.Exists(outputFile);
            List<string> fieldnames = new List<string>(record.Keys);

            if (!writeHeader)
            {
                CheckFieldNames(outputFile, fieldnames);
            }

            using (StreamWriter streamWriter = new StreamWriter(outputFile, true))
            {
                DictWriter dictWriter = new DictWriter(streamWriter, fieldnames);
                if (writeHeader)
                    dictWriter.WriteHeader();

                dictWriter.WriteRow(record);
            }
        }

        public static void WriteRows(string outputFile, List<Dictionary<string, object>> records)
        {
            CreateDirectory(outputFile);

            bool writeHeader = !File.Exists(outputFile);
            List<string> fieldnames = new List<string>(records[0].Keys);

            if (!writeHeader)
            {
                CheckFieldNames(outputFile, fieldnames);
            }

            using (StreamWriter streamWriter = new StreamWriter(outputFile, true))
            {
                DictWriter dictWriter = new DictWriter(streamWriter, fieldnames);
                if (writeHeader)
                    dictWriter.WriteHeader();

                dictWriter.WriteRows(records);
            }
        }
    }
}
