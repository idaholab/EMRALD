using CsvHelper;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Globalization;
using System.Linq;
using System;

namespace Hunter.Utils
{
    public class DictWriter
    {
        private List<string> fieldnames;
        private CsvWriter csvWriter;

        public DictWriter(StreamWriter streamWriter, List<string> fieldnames)
        {
            this.fieldnames = fieldnames;
            csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture);

        }

        public void WriteHeader()
        {
            foreach (var fieldname in fieldnames)
            {
                csvWriter.WriteField(fieldname);
            }

            csvWriter.NextRecord();
        }

        public void WriteRow(Dictionary<string, object> record)
        {
            foreach (var fieldname in fieldnames)
            {
                object value;
                if (record.TryGetValue(fieldname, out value))
                {
                    csvWriter.WriteField(value);
                }
                else
                {
                    csvWriter.WriteField("");
                }
            }

            csvWriter.NextRecord();
        }

        public void WriteRows(List<Dictionary<string, object>> records)
        {
            foreach (var record in records)
            {
                WriteRow(record);
            }
        }
    }
}
