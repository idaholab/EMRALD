using System;
using System.Collections.Generic;
using Hunter.ExpGoms;
using Hunter.Proc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Hunter.Procedures
{

    public class ProcedureJsonConverter : JsonConverter<Procedure>
    {
        public override Procedure ReadJson(JsonReader reader, Type objectType, Procedure existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            JObject jObject = JObject.Load(reader);

            var procedure = new Procedure
            {
                Steps = new List<Step>()
            };

            foreach (var step in jObject["steps"])
            {
                var stepId = step["step_id"].ToObject<string>();
                var gomsExpression = step["goms_expression"].ToObject<string>();

                // Tokenize the GOMS expression
                string preprocessedInput = ExpressiveGoms.Preprocess(gomsExpression);
                List<ExpressiveGoms.Token> tokens = ExpressiveGoms.Tokenize(preprocessedInput);

                procedure.Steps.Add(new Step
                {
                    StepId = stepId,
                    GomsExpression = tokens
                });
            }

            return procedure;
        }
        public override void WriteJson(JsonWriter writer, Procedure value, JsonSerializer serializer)
        {
            JObject procedureJson = new JObject();

            JArray stepsJsonArray = new JArray();
            foreach (var step in value.Steps)
            {
                string gomsExpression = ExpressiveGoms.ExpressionFromTokens(step.GomsExpression);

                JObject stepJson = new JObject
        {
            { "step_id", step.StepId },
            { "goms_expression", gomsExpression }
        };

                stepsJsonArray.Add(stepJson);
            }

            procedureJson.Add("steps", stepsJsonArray);

            procedureJson.WriteTo(writer);
        }
    }
}
