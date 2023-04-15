using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Hunter;
using static Hunter.HRAEngine;
using System.Text.Json.Nodes;

namespace Hunter
{
    public class HRAEngineConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(HRAEngine);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            HRAEngine engine = (HRAEngine)value;

            var primitivesArray = new JArray();

            foreach (var primitive in engine)
            {
                primitivesArray.Add(JObject.FromObject(primitive, serializer));
            }

            JObject hraEngineJson = new JObject
            {
                { "RepeatMode", engine.RepeatMode },
                { "MaxRepeatCount", engine.MaxRepeatCount },
                { "TimeOnShiftFatigueEnabled", engine.TimeOnShiftFatigueEnabled },
                { "TimeOnShift", engine.TimeOnShift.TotalSeconds },
                { "Primitives", primitivesArray }
            };

            hraEngineJson.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            JObject obj = JObject.Load(reader);

            HRAEngine engine = new HRAEngine();

            engine.RepeatMode = obj["RepeatMode"].Value<bool>();
            engine.MaxRepeatCount = obj["MaxRepeatCount"].Value<int>();
            engine.TimeOnShiftFatigueEnabled = obj["TimeOnShiftFatigueEnabled"].Value<bool>();
            engine.TimeOnShift = TimeSpan.FromSeconds(obj["TimeOnShift"].Value<double>());

            var primitives = serializer.Deserialize<List<Primitive>>(obj["Primitives"].CreateReader()); 
            
            engine.Clear();

            if (primitives != null)
            {
                foreach (var primitive in primitives)
                {
                    engine.Add(primitive, overwrite: true);
                }
            }
            return engine;
        }
    }
}
