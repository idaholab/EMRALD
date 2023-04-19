using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Hunter.Psf
{
    public class PSFCollectionConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(PSFCollection);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var jsonArray = JArray.Load(reader);
            var collection = new PSFCollection();
            collection.Clear();

            foreach (var jsonPerformanceShapingFactor in jsonArray)
            {
                var performanceShapingFactor = jsonPerformanceShapingFactor.ToObject<PSF>(serializer);
                collection.Add(performanceShapingFactor, overwrite: true);
            }

            return collection;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var collection = (PSFCollection)value;
            var jsonArray = new JArray();

            foreach (var performanceShapingFactor in collection)
            {
                jsonArray.Add(JObject.FromObject(performanceShapingFactor, serializer));
            }

            jsonArray.WriteTo(writer);
        }
    }
}
