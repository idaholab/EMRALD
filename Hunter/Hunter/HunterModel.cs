using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace Hunter
{
    public class HunterModel
    {
        public HunterSnapshot Snapshot { get; set; }
        public HunterTask Task { get; set; }

        public static HunterModel FromHunterModelFilename(string filename)
        {
            string json = File.ReadAllText(filename);
            HunterModel model = DeserializeJSON(json);
            model.Snapshot = HunterSnapshot.FromHunterModelFilename(filename);
            model.Task = new HunterTask
            {
                ProcedureCatalog = ProceduresFactory.FromHunterModelFilename(filename)
            };
            return model;
        }

        public (HRAEngine hraEngine, PSFCollection psfCollection) CreateOperator()
        {
            return HunterFactory.CreateOperator(Snapshot);
        }

        public string GetJSON()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }

        public static HunterModel DeserializeJSON(string json)
        {
            return JsonConvert.DeserializeObject<HunterModel>(json);
        }
    }
}
