using Newtonsoft.Json;
using Hunter.Proc;
using Hunter.Hra;

namespace Hunter.Model
{
    public class HunterModel
    {
        public HunterSnapshot Snapshot { get; set; }
        public HunterTask Task { get; set; }

        [JsonIgnore]
        public HRAEngine _engine;

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

        public void LoadEngine()
        {
            _engine = HunterFactory.CreateOperator(Snapshot);
        }

        public HRAEngine CreateOperator()
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
