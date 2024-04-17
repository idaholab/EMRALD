using System;
using Microsoft.ClearScript.V8;
using System.IO;
using Microsoft.ClearScript;
using Newtonsoft.Json.Linq;
using ScriptEngineNS;

namespace SimulationDAL
{
  public class UpgradeModel
  {
    //use the same javascrpt code as the UI to upgrade the model
    public static string UpgradeJSON(string modelJSON_Str)
    {

      using (var engine = new V8ScriptEngine())
      {
        try
        {
          string javascriptCode = File.ReadAllText(@".//ExportForCSharp.js");
          

          //compile the javascript code into an engine.
          engine.Execute(javascriptCode);

          //call upgradeEmraldModel function.
          object strfnCall = engine.Invoke("UpgradeEMRALDModel", modelJSON_Str);
          string strRes = strfnCall.ToString();


          JToken jt = JToken.Parse(strRes);
          string formatted = jt.ToString(Newtonsoft.Json.Formatting.Indented);

          return formatted;
         

        }
        catch (ScriptEngineException ex)
        {
          Console.WriteLine("Script Engine Exception: " + ex.Message);
        }

        return "";
      }
    }
  }
}
