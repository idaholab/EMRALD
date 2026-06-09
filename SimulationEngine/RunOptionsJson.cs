// Copyright 2026 Battelle Energy Alliance
// Defines JSON-serializable run option classes including simulation settings, coupling configuration, and output parameters.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace SimulationEngine
{


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

  public enum CouplingType
  {
    XMPP,
    WebSocket
  }

  public class CouplingData
  {
    [JsonConverter(typeof(Newtonsoft.Json.Converters.StringEnumConverter))]
    public CouplingType couplingType { get; set; } = CouplingType.XMPP;
    public string couplingPassword { get; set; } = "secret"; //EMRALD client user password for XMPP password needed
    public string user { get; set; } = "user"; //user, currently for XMPP user name if needed
    public string couplingURL { get; set; } = null;
    public int timeout { get; set; } = 30; //timeout in seconds
    public bool logCouplingMsgs { get; set; } = true; //log coupling messages to console (debug builds only), set false to suppress during testing
  }

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
    "  \"pathResultsInterval\": 1000, // how often to write the path results, every X runs (-1 to disable and write at end)\n" +
    "  \"clearThreadTemps\": true, // delete per-thread temp files after a multi-threaded run completes; defaults to true if omitted\n" +
    "  \"couplingInfo\": { // External application coupling information\n" +
    "    \"couplingType\": \"XMPP\", // XMPP or WebSocket\n" +
    "    \"couplingPassword\": \"secret\", // Password for external application connection\n" +
    "    \"user\": \"user\", // User name for coupling connection (e.g., XMPP user)\n" +
    "    \"couplingURL\": null, // If WebSocket, this is the URL to connect to; can be null for XMPP\n" +
    "    \"timeout\": 30 // Timeout in seconds\n" +
    "  }\n" +
    "}";

    //version of the options json
    public double opsVer { get; set; } = 1.02;

    // Total number of runs
    public int runct { get; set; } = 100;
    // Input file path
    public string inpfile { get; set; } = "";
    // Results output file path
    public string resout { get; set; } = "";
    // Result paths JSON output file path
    public string jsonRes { get; set; } = "";
    //variables to output in the results
    public List<string> variables { get; set; } = null;
    // //initialize these variables with new values (if they have the property to reset on every run, it will get this value on each run othrwise behavior is the same)
    public List<VarInitValue> initVars { get; set; } = new List<VarInitValue>();
    // Maximum simulation time
    public string runtime { get; set; } = "365.00:00:00";
    // Seed for random number generation
    public int? seed { get; set; } = 0;
    // debug level [basic, detailed, off]
    public string debug { get; set; } = "off";
    // start index for debug if null then from beginning
    public int? debugStartIdx { get; set; } = null;
    // start index for debug if null then to end
    public int? debugEndIdx { get; set; } = null;
    // external application XMPP or other connection
    public int pathResultsInterval { get; set; } = 1000;
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public CouplingData couplingInfo { get; set; } = null;

    
    

    public int? threads { get; set; } = null; //null is default no threading. Even 1 will use a tread and the temp folders so that you can run multiple instances using the same model, by just changing the name.
    public bool clearThreadTemps { get; set; } = true; //clear temp thread files after run completes; default true when not specified in options JSON

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

        // Copy existing fields that still map 1:1
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

        // ---------- Coupling migration ----------

        // Determine coupling type (default XMPP)
        string couplingType =
          (string)oldOptions["couplingType"] ??
          // If we see XMPP-specific fields, assume XMPP
          (oldOptions.ContainsKey("xmppPassword") || oldOptions.ContainsKey("xmppLinks") ? "XMPP" : "XMPP");

        // Determine coupling password (xmppPassword and old couplingPassword are both accepted)
        JToken couplingPasswordToken =
          oldOptions.ContainsKey("couplingPassword") ? oldOptions["couplingPassword"] :
          oldOptions.ContainsKey("xmppPassword") ? oldOptions["xmppPassword"] :
          new JValue("secret");

        // User name for coupling (if not present, default matches CouplingData default)
        string user =
          (string)oldOptions["user"] ?? "user";

        // Coupling URL:
        // In older JSON this may have been an array (for WebSocket) or missing. New schema expects a string or null.
        JToken couplingUrlToken = null!;
        if (oldOptions.ContainsKey("couplingURL"))
        {
          var urlToken = oldOptions["couplingURL"];
          if (urlToken != null)
          {
            if (urlToken.Type == JTokenType.String)
            {
              couplingUrlToken = urlToken; // already a string
            }
            else if (urlToken.Type == JTokenType.Array && urlToken.Any())
            {
              // If old format used an array, grab the first entry as a best-effort migration
              couplingUrlToken = urlToken.First!;
            }
          }
        }

        // Timeout (new field) – default to 30 if not provided
        int timeout =
          oldOptions.Value<int?>("timeout") ?? 30;

        // Decide if we actually need to emit couplingInfo at all
        bool hasAnyCouplingInfo =
          oldOptions.ContainsKey("xmppPassword") ||
          oldOptions.ContainsKey("xmppLinks") ||
          oldOptions.ContainsKey("couplingPassword") ||
          oldOptions.ContainsKey("couplingType") ||
          oldOptions.ContainsKey("couplingURL") ||
          oldOptions.ContainsKey("timeout");

        if (hasAnyCouplingInfo)
        {
          var couplingInfo = new JObject
          {
            ["couplingType"] = couplingType,
            ["couplingPassword"] = couplingPasswordToken,
            ["user"] = user,
            ["timeout"] = timeout
          };

          // Only include couplingURL if we managed to resolve something meaningful
          if (couplingUrlToken != null && couplingUrlToken.Type != JTokenType.Null)
          {
            couplingInfo["couplingURL"] = couplingUrlToken;
          }
          else
          {
            couplingInfo["couplingURL"] = null; // explicit null is fine; serializer will ignore if configured
          }

          newOptions["couplingInfo"] = couplingInfo;
        }
        else
        {
          // Leave couplingInfo absent; when deserialized into Options_cur,
          // couplingInfo will be null and ignored on re-serialize.
        }

        // Note: xmppLinks / couplingLinks from older versions are intentionally not
        // carried over since the new schema moved to CouplingData without links.

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
