using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using static Hunter.Hra.HRAEngine;

namespace Hunter.Hra
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
                { "_currentProcedureId", engine.CurrentProcedureId },
                { "_currentStepId", engine.CurrentStepId },
                { "_currentEvalState", engine.CurrentEvalState.Value },
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
            engine.SetCurrentEvalState(obj["_currentEvalState"].Value<int>());
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
