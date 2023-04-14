using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Hunter;

namespace Hunter
{
    public class PerformanceShapingFactorCollectionConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(PerformanceShapingFactorCollection);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var jsonArray = JArray.Load(reader);
            var collection = new PerformanceShapingFactorCollection();
            collection.Clear();

            foreach (var jsonPerformanceShapingFactor in jsonArray)
            {
                var performanceShapingFactor = jsonPerformanceShapingFactor.ToObject<PerformanceShapingFactor>(serializer);
                collection.Add(performanceShapingFactor, overwrite: true);
            }

            return collection;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var collection = (PerformanceShapingFactorCollection)value;
            var jsonArray = new JArray();

            foreach (var performanceShapingFactor in collection)
            {
                jsonArray.Add(JObject.FromObject(performanceShapingFactor, serializer));
            }

            jsonArray.WriteTo(writer);
        }
    }
}
