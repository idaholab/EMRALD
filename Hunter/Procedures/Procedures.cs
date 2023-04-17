using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter
{
    public struct Step
    {
        [JsonProperty("primitive_ids")]
        public List<string> PrimitiveIds { get; set; }

        [JsonProperty("step_id")]
        public string StepId { get; set; }
    }

    public struct Procedure
    {
        [JsonProperty("steps")]
        public List<Step> Steps { get; set; }
    }

    public static class ProceduresFactory
    {
        /// <summary>
        /// Builds a dictionary of procedures based on a JSON file containing procedure references.
        /// </summary>
        /// <param name="hunterModelFilename">The path of the JSON file containing procedure references.</param>
        /// <returns>A dictionary of procedures keyed by their respective procedure_id.</returns>
        public static Dictionary<string, Procedure> FromHunterModelFilename(string hunterModelFilename)
        {
            // Get the directory of the hunterModelFilename file
            var hunterModelDir = Path.GetDirectoryName(Path.GetFullPath(hunterModelFilename));

            // Load the hunterModelFilename file into a string
            string json = File.ReadAllText(hunterModelFilename);

            // Create JsonSerializerSettings with MetadataPropertyHandling.ReadAhead to resolve external references
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                MetadataPropertyHandling = MetadataPropertyHandling.ReadAhead
            };

            // Deserialize the JSON into a JObject using JsonConvert and the custom settings
            JObject model = JsonConvert.DeserializeObject<JObject>(json, settings);

            // Get the procedure references array
            JArray procedureReferencesArray = (JArray)model["procedure_refs"];

            // Load each procedure into a Dictionary<string, Procedure> with a key that matches the "description" property of the reference object
            Dictionary<string, Procedure> procedures = new Dictionary<string, Procedure>();
            foreach (JObject referenceObject in procedureReferencesArray)
            {
                // Get the $ref property and load the referenced JSON file into a JArray
                string procedureRef = (string)referenceObject["$ref"];
                var procedureFilename = Path.Combine(hunterModelDir, procedureRef);
                var jsonData = File.ReadAllText(procedureFilename);

                // Deserialize the procedure JArray into a Procedure object
                var procedure = JsonConvert.DeserializeObject<Procedure>(jsonData);

                // Add the procedure to the Dictionary using the "description" property as the key
                string key = (string)referenceObject["procedure_id"];
                procedures.Add(key, procedure);
            }

            return procedures;
        }
    }
}
