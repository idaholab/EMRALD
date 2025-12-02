using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace SimulationEngine
{
  public enum CouplingType
  {
    XMPP,
    WebSocket
  }

  //public class Options_v1.02
  //{
  //  // Total number of runs
  //  public int runct { get; set; } = 100;
  //  // Input file path
  //  public string inpfile { get; set; } = "";
  //  // Results output file path
  //  public string resout { get; set; } = "BasicResults.txt";
  //  // Result paths JSON output file path
  //  public string jsonRes { get; set; } = "";
  //  //variables to output in the results
  //  public List<string> variables { get; set; } = null;
  //  // Path output file path
  //  public string pathout { get; set; } = null;
  //  // Maximum simulation time
  //  public string runtime { get; set; } = "365.00:00:00";
  //  // Seed for random number generation
  //  public int seed { get; set; } = 0;
  //  // debug level [basic, detailed, off]
  //  public string debug { get; set; } = "off";
  //  // start index for debug if null then from beginning
  //  public int? debugStartIdx { get; set; } = null;
  //  // start index for debug if null then to end
  //  public int? debugEndIdx { get; set; } = null;
  //  // external application XMPP connection
  //  public int pathResultsInterval { get; set; } = -1;
  //  public string xmppPassword { get; set; } = "secret";
  //  public List<List<string>> xmppLinks = new List<List<string>>();
  //}

  public class Options_cur
  {
    //Example JSON for passing in the run options 
    public static string CmdJSON_OptionsExample = "{\n" +
    "  \"opsVer\": 1.02, //version of this options file\n" +
    "  \"runct\": 100, // Total number of runs\n" +
    "  \"inpfile\": \"\", // Input model path\n" +
    "  \"resout\": \"BasicResults.txt\", // Results output file path\n" +
    "  \"jsonRes\": \"c:\\\\temp\\\\PathResults.txt\", // Result paths JSON output file path\n" +
    "  \"variables\": [ // Variables to output in the results\n" +
    "    \"var1\",\n" +
    "    \"var2\"\n" +
    "  ],\n" +
    "  \"initVars\": [ //initialize these variables with new values (if they have the property to reset on every run, it will get this value on each run otherwise behavior is the same)\n" +
    "    {\n" +
    "      \"varName\": \"var1\", //name of the variable\n" +
    "      \"value\": \"5\" //value for the variable, use a string for all the types.\n" +
    "    }\n" +
    "  ],\n" +
    "  \"runtime\": \"365.00:00:00\", // Maximum simulation time\n" +
    "  \"seed\": 0, // Seed for random number generation\n" +
    "  \"debug\": \"off\", // Debug level [basic, detailed, off]\n" +
    "  \"debugStartIdx\": null, // Start index for debug if null then from beginning\n" +
    "  \"debugEndIdx\": null, // End index for debug if null then to end\n" +
    "  \"pathResultsInterval\": -1, // External application XMPP connection path results interval\n" +
    "  \"couplingPassword\": \"secret\", // XMPP or outher coupling password for external application connection\n" +
    "  \"couplingType\": \"XMPP\", // XMPP or WebSocket\n" +
    "  \"couplingLinks\": [[]], // List of XMPP links or applications on coupling connection to use. [[external sim name, if XMPP - connection resource, if XMPP - user name, and timeout in seconds]]\n" +
    "  \"couplingURL\": [] // If WebSocket then this is the URL to connect to\n" +
    "}";

    //version of the options json
    public double opsVer { get; set; } = 1.01;

    // Total number of runs
    public int runct { get; set; } = 100;
    // Input file path
    public string inpfile { get; set; } = "";
    // Results output file path
    public string resout { get; set; } = "BasicResults.txt";
    // Result paths JSON output file path
    public string jsonRes { get; set; } = "";
    //variables to output in the results
    public List<string> variables { get; set; } = null;
    // //initialize these variables with new values (if they have the property to reset on every run, it will get this value on each run othrwise behavior is the same)
    public List<VarInitValue> initVars { get; set; } = new List<VarInitValue>();
    // Maximum simulation time
    public string runtime { get; set; } = "365.00:00:00";
    // Seed for random number generation
    public int seed { get; set; } = 0;
    // debug level [basic, detailed, off]
    public string debug { get; set; } = "off";
    // start index for debug if null then from beginning
    public int? debugStartIdx { get; set; } = null;
    // start index for debug if null then to end
    public int? debugEndIdx { get; set; } = null;
    // external application XMPP or other connection
    public int pathResultsInterval { get; set; } = -1;

    [Newtonsoft.Json.JsonConverter(typeof(JsonStringEnumConverter))]
    public CouplingType couplingType { get; set; } = CouplingType.XMPP;
    public string couplingPassword { get; set; } = "secret";
    public List<List<string>> couplingLinks = new List<List<string>>();
    public int? threads { get; set; } = null; //null is default no threading. Even 1 will use a tread and the temp folders so that you can run multiple instances using the same model, by just changing the name.
    public string couplingURL { get; set; } = null;

    /// <summary>
    /// Converts an old version options JSON string to the new version (1.02)
    /// </summary>
    /// <param name="oldJsonString">JSON string in old format</param>
    /// <returns>JSON string in new format (version 1.02)</returns>
    public static string ConvertOptionsJsonTo1_02(string oldJsonString)
    {
      try
      {
        // Parse the old JSON
        var oldOptions = JObject.Parse(oldJsonString);

        // Create new options object
        var newOptions = new JObject();

        // Get the current version or default to old version
        double currentVersion = oldOptions.Value<double?>("opsVer") ?? 1.0;

        // Set new version
        newOptions["opsVer"] = 1.02;

        // Copy existing fields
        CopyIfExists(oldOptions, newOptions, "runct");
        CopyIfExists(oldOptions, newOptions, "inpfile");
        CopyIfExists(oldOptions, newOptions, "resout");
        CopyIfExists(oldOptions, newOptions, "jsonRes");
        CopyIfExists(oldOptions, newOptions, "variables");
        CopyIfExists(oldOptions, newOptions, "initVars");
        CopyIfExists(oldOptions, newOptions, "runtime");
        CopyIfExists(oldOptions, newOptions, "seed");
        CopyIfExists(oldOptions, newOptions, "debug");
        CopyIfExists(oldOptions, newOptions, "debugStartIdx");
        CopyIfExists(oldOptions, newOptions, "debugEndIdx");
        CopyIfExists(oldOptions, newOptions, "pathResultsInterval");
        CopyIfExists(oldOptions, newOptions, "threads");

        // Handle renamed/new fields
        // Convert xmppPassword to couplingPassword
        if (oldOptions.ContainsKey("xmppPassword"))
        {
          newOptions["couplingPassword"] = oldOptions["xmppPassword"];
        }
        else if (oldOptions.ContainsKey("couplingPassword"))
        {
          newOptions["couplingPassword"] = oldOptions["couplingPassword"];
        }
        else
        {
          newOptions["couplingPassword"] = "secret";
        }

        // Set couplingType (default to XMPP if not present)
        if (oldOptions.ContainsKey("couplingType"))
        {
          newOptions["couplingType"] = oldOptions["couplingType"];
        }
        else
        {
          newOptions["couplingType"] = "XMPP";
        }

        // Convert xmppLinks to couplingLinks
        if (oldOptions.ContainsKey("xmppLinks"))
        {
          newOptions["couplingLinks"] = oldOptions["xmppLinks"];
        }
        else if (oldOptions.ContainsKey("couplingLinks"))
        {
          newOptions["couplingLinks"] = oldOptions["couplingLinks"];
        }
        else
        {
          newOptions["couplingLinks"] = new JArray();
        }

        // Return formatted JSON string
        return newOptions.ToString(Newtonsoft.Json.Formatting.Indented);
      }
      catch (Exception ex)
      {
        throw new ArgumentException($"Invalid JSON format: {ex.Message}", ex);
      }
    }

    /// <summary>
    /// Helper method to copy a property from old to new JObject if it exists
    /// </summary>
    private static void CopyIfExists(JObject source, JObject destination, string propertyName)
    {
      if (source.ContainsKey(propertyName))
      {
        destination[propertyName] = source[propertyName];
      }
    }
  }
}
