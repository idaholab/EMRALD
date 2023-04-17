using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Hunter;
using static Hunter.HRAEngine;
using System.Text.Json.Nodes;
using System.Reflection;

namespace Hunter
{
    public class HRAEngineConverter : JsonConverter<HRAEngine>
    {
        public override void WriteJson(JsonWriter writer, HRAEngine value, JsonSerializer serializer)
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
                { "Primitives", primitivesArray },
                { "_repeatCount", engine.RepeatCount },
                { "_primitiveEvalCount", engine.PrimitiveEvalCount },
                { "_currentProcedureId", engine.CurrentSuccess },
                { "_currentStepId", engine.CurrentStepId },
                { "_currentSuccess", engine.CurrentSuccess },
            };

            hraEngineJson.WriteTo(writer);
        }

        public override HRAEngine ReadJson(JsonReader reader, Type objectType, HRAEngine existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            JObject obj = JObject.Load(reader);

            HRAEngine engine = new HRAEngine();

            engine.RepeatMode = obj["RepeatMode"].Value<bool>();
            engine.MaxRepeatCount = obj["MaxRepeatCount"].Value<int>();
            engine.TimeOnShiftFatigueEnabled = obj["TimeOnShiftFatigueEnabled"].Value<bool>();
            engine.TimeOnShift = TimeSpan.FromSeconds(obj["TimeOnShift"].Value<double>());
            engine.SetRepeatCount(obj["_repeatCount"].Value<int>());
            engine.SetCurrentStepId(obj["_currentStepId"].Value<string?>());
            engine.SetCurrentProcedureId(obj["_currentProcedureId"].Value<string?>());
            engine.SetCurrentSuccess(obj["_currentSuccess"].Value<bool?>());
            engine.SetPrimitiveEvalCount(obj["_primitiveEvalCount"].Value<int>());

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
