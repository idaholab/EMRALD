// Copyright 2021 Battelle Energy Alliance
// Contains core enumerations, ID management, and the BaseObjInfo base class shared across all EMRALD simulation DAL types.

using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Threading;
using MessageDefLib;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json;
//using System.Data.EntityClient;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using NLog;

namespace SimulationDAL
{
  /// <summary>
  /// Callback delegate used to log event messages from the simulation engine to the UI or log output.
  /// </summary>
  public delegate void TLogEvCallBack(string text);


  /// <summary>
  /// Defines the types of events that can trigger state transitions in an EMRALD simulation.
  /// </summary>
  [JsonConverter(typeof(StringEnumConverter))]
  public enum EnEventType
  {
    /// <summary>Event triggered by an external 3D simulation.</summary>
    et3dSimEv,
    /// <summary>Probabilistic failure rate event; fails after a sampled time.</summary>
    etFailRate,
    /// <summary>Executes when the value of a variable meets a specified condition.</summary>
    etVarCond,
    /// <summary>Executes when a set of desired states have been entered.</summary>
    etStateCng,
    /// <summary>Logic tree of component boolean value evaluation.</summary>
    etComponentLogic,
    /// <summary>Event triggered at a specific simulation time.</summary>
    etTimer,
    /// <summary>Deprecated: use Distribution with type instead.</summary>
    etNormalDist,
    /// <summary>Deprecated: use Distribution with type instead.</summary>
    etWeibullDist,
    /// <summary>Deprecated: use Distribution with type instead.</summary>
    etExponentialDist,
    /// <summary>Deprecated: use Distribution with type instead.</summary>
    etLogNormalDist,
    /// <summary>Samples time-to-event from a specified statistical distribution.</summary>
    etDistribution
  };

  //public enum EnDiagramType { dtComponent = 0, dtSystem, dtPlant, dtOther };
  /// <summary>
  /// Specifies whether a diagram allows a single active state or multiple simultaneous active states.
  /// </summary>
  public enum EnDiagramType2
  {
    /// <summary>Only one state can be active at a time in this diagram.</summary>
    dtSingle = 0,
    /// <summary>Multiple states can be active simultaneously in this diagram.</summary>
    dtMulti
  };

  /// <summary>
  /// Classifies the role of a state within an EMRALD diagram.
  /// </summary>
  public enum EnStateType
  {
    /// <summary>The initial entry state of a diagram.</summary>
    stStart = 0,
    /// <summary>A normal intermediate state.</summary>
    stStandard,
    /// <summary>A state that is tracked as a key outcome in simulation results.</summary>
    stKeyState,
    /// <summary>A terminal/absorbing state that ends the simulation path for a diagram.</summary>
    stTerminal
  };

  /// <summary>
  /// Specifies the type of action to perform when a state event fires.
  /// </summary>
  public enum EnActionType
  {
    /// <summary>Transition to another state.</summary>
    atTransition = 0,
    /// <summary>Change the value of a simulation variable.</summary>
    atCngVarVal,
    /// <summary>Send a message to an external 3D simulation.</summary>
    at3DSimMsg,
    /// <summary>Run an external application.</summary>
    atRunExtApp,
    /// <summary>Perform a custom state shift across one or more components.</summary>
    atCustomStateShift,
    /// <summary>Jump simulation time forward to a specific point.</summary>
    atJumpToTime,
    /// <summary>Change a variable value via a DLL callback.</summary>
    atCngVarDll
  };

  /// <summary>
  /// Identifies which type of modifiable model item is involved in an operation.
  /// </summary>
  public enum EnModifiableTypes
  {
    /// <summary>No modifiable type specified.</summary>
    mtNone = 0,
    /// <summary>A simulation variable.</summary>
    mtVar,
    /// <summary>A component (diagram).</summary>
    mtComp,
    /// <summary>A state within a diagram.</summary>
    mtState,
    /// <summary>An external event source.</summary>
    mtExtEv
  };

  /// <summary>
  /// Describes how a component failure mode is classified.
  /// </summary>
  public enum EnFailType
  {
    /// <summary>The component fails to start when demanded.</summary>
    ftFailToStart = 0,
    /// <summary>The component fails while it is running.</summary>
    ftFailToRun
  }

  /// <summary>
  /// Time units used to express simulation time values and rates.
  /// </summary>
  [JsonConverter(typeof(StringEnumConverter))]
  public enum EnTimeRate
  {
    /// <summary>Time expressed in years.</summary>
    trYears,
    /// <summary>Time expressed in days.</summary>
    trDays,
    /// <summary>Time expressed in hours.</summary>
    trHours,
    /// <summary>Time expressed in minutes.</summary>
    trMinutes,
    /// <summary>Time expressed in seconds.</summary>
    trSeconds
  }

  /// <summary>
  /// Identifies the category of a model object for use in ID management and bit-array tracking.
  /// </summary>
  [JsonConverter(typeof(StringEnumConverter))]
  public enum EnIDTypes
  {
    /// <summary>A simulation variable.</summary>
    itVar = 0,
    /// <summary>A component (diagram).</summary>
    itComp,
    /// <summary>A state within a diagram.</summary>
    itState,
    /// <summary>An event definition.</summary>
    itEvent,
    /// <summary>An action definition.</summary>
    itAction,
    /// <summary>A logic tree node.</summary>
    itTreeNode,
    /// <summary>A timer instance.</summary>
    itTimer,
    /// <summary>A diagram.</summary>
    itDiagram,
    /// <summary>An external simulation resource.</summary>
    itExtSim
  };

  /// <summary>
  /// Statistical distribution types available for sampling time-to-event values.
  /// </summary>
  public enum EnDistType
  {
    /// <summary>Normal (Gaussian) distribution.</summary>
    dtNormal,
    /// <summary>Weibull distribution.</summary>
    dtWeibull,
    /// <summary>Exponential distribution.</summary>
    dtExponential,
    /// <summary>Log-normal distribution.</summary>
    dtLogNormal,
    /// <summary>Uniform distribution.</summary>
    dtUniform,
    /// <summary>Triangular distribution.</summary>
    dtTriangular,
    /// <summary>Gamma distribution.</summary>
    dtGamma,
    /// <summary>Gompertz distribution.</summary>
    dtGompertz
  };

  /// <summary>
  /// Enumerates the types of issues or patterns that can be scanned for across model item lists.
  /// </summary>
  public enum ScanForTypes
  {
    /// <summary>Scan for variables or references that may cause multi-threading race conditions.</summary>
    sfMultiThreadIssues = 0
  };

  /// <summary>
  /// Holds global simulation configuration values such as thread count, random seed, and debug log settings,
  /// typically sourced from command-line arguments or application configuration.
  /// </summary>
  public static class ConfigData
  {
    static public int? threads = null;
    static public int? seed = null;
    static public LogLevel debugLev = LogLevel.Off;
    static public int? debugRunStart = null;
    static public int? debugRunEnd = null;
  }

  /// <summary>
  /// Base class for tracking whether a model item's core data or its links to other objects
  /// have been modified and need to be persisted.
  /// </summary>
  public class DBModified
  {
    protected bool _itemModified = true;
    protected bool _linksModified = true;

    public bool itemModified { get { return _itemModified; } set { _itemModified = value; } }
    public bool linksModified { get { return _linksModified; } set { _linksModified = value; } }
  }

  /// <summary>
  /// Lightweight pair associating an integer index with a string value,
  /// used for indexed lookups where both a numeric key and a label are needed.
  /// </summary>
  public class IdxAndStr
  {
    public int idx;
    public string str;

    public IdxAndStr(int inIdx, string inStr)
    {
      idx = inIdx;
      str = inStr;
    }
  }

  /// <summary>
  /// Abstract base class for all named model objects in the EMRALD simulation DAL.
  /// Provides a local integer ID, name, description, and common JSON serialization
  /// and deserialization methods inherited by all diagram, state, event, action, and variable types.
  /// </summary>
  public abstract class BaseObjInfo// : IDBMinimumInfo
  {
    protected int _id; //ids are local only, to be used for lookups where names can't be used like bitsets

    public int id { get {return _id; } }
    public string name { get; set; } = "";
    public string desc { get; set; } = "";
    public bool processed = false;


    public virtual string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }

      string idStr = this.id.ToString();

      retStr = retStr + "\"id\": " + idStr + "," + Environment.NewLine +
              "\"name\":\"" + name + "\"," + Environment.NewLine +
              "\"desc\":\"" + desc + "\"";

      if (incBrackets)
      {
        retStr = retStr + Environment.NewLine + "}";
      }

      return retStr;
    }

    public virtual bool DeserializeJSON(string json, EmraldModel lists, bool useGivenIDs)
    {
      if (!string.IsNullOrEmpty(json))
      {
        var dynamicObj = JsonConvert.DeserializeObject(json);// Json.Decode(json);
        if (dynamicObj == null)
          return false;
        return DeserializeDerived(dynamicObj, true, lists, useGivenIDs) && LoadObjLinks(dynamicObj, true, lists);

      }
      else return false;
    }

    public virtual bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      if (wrapped)
        throw new Exception("Deserialize of base object cannot be wrapped in an object."); //base class does not know how to handle

      dynamic dynObj = (dynamic)obj;
      if (String.IsNullOrEmpty((string)dynObj.name) && (name == ""))
      {
        throw new Exception("All deserializing of JSON data objects must have a name");
      }

      if ((string)dynObj.name != "")
      {
        name = (string)dynObj.name;
        desc = (string)dynObj.desc;
      }
      if (useGivenIDs && (int)dynObj.id > 0)
        this._id = (int)dynObj.id;
      return true;
    }

    public virtual bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      //override this for the items that need to load links after initial deserializeDerived of each list is done.
      return true;
    }
  }


  /// <summary>
  /// Interface implemented by all typed model-item list containers (e.g., AllDiagrams, AllStates).
  /// Provides a consistent contract for JSON serialization, deserialization, link loading,
  /// processed-flag management, and model scanning.
  /// </summary>
  public interface ModelItemLists
  {
    string GetJSON(bool incBrackets, EmraldModel lists);
    void DeserializeJSON(object obj, EmraldModel lists, bool useGivenIDs);
    bool LoadLinks(object obj, EmraldModel lists); //load any links to other objects after initial lists are loaded.
    void SetProcessed(bool value);

    /// <summary>
    /// Look for issues or anything else that might be in the different item lists. Add a new scanType and implement ScanFor in each derived item type
    /// </summary>
    /// <param name="scanType">What is being looked for</param>
    /// <returns></returns>
    List<ScanForReturnItem> ScanFor(ScanForTypes scanType, EmraldModel model);
  }


  /// <summary>
  /// Provides globally shared simulation constants and utility methods including time-span
  /// conversions, failure-type lists, and event-class-to-enum mapping.
  /// </summary>
  public static class Globals
  {
    public static TimeSpan NowTimeSpan = new TimeSpan();
    public static TimeSpan SecondTimeSpan = new TimeSpan(0, 0, 1);
    public static TimeSpan MinTimeSpan = new TimeSpan(0, 1, 0);
    public static TimeSpan HourTimeSpan = new TimeSpan(1, 0, 0);
    public static TimeSpan DayTimeSpan = new TimeSpan(1, 0, 0, 0);
    public static TimeSpan YearTimeSpan = new TimeSpan(365, 0, 0, 0);

    public static List<EnFailType> failRunOnly = new List<EnFailType>() { EnFailType.ftFailToRun };
    public static List<EnFailType> failStartOnly = new List<EnFailType>() { EnFailType.ftFailToStart };
    public static List<EnFailType> failRunAndStart = new List<EnFailType>() { EnFailType.ftFailToRun, EnFailType.ftFailToStart };

    public static EnEventType EvClass_To_EnEventType(Event evItem)
    {
      if (evItem is ExtSimEv)
        return EnEventType.et3dSimEv;
      else if (evItem is EvalVarEvent)
        return EnEventType.etVarCond;
      else if (evItem is StateCngEvent)
        return EnEventType.etStateCng;
      else if (evItem is ComponentLogicEvent)
        return EnEventType.etComponentLogic;
      else if (evItem is FailProbEvent)
        return EnEventType.etFailRate;
      else if (evItem is TimerEvent)
        return EnEventType.etTimer;

      else
        throw new Exception("Missing conversion to EnEventType from class object");
    }

    /// <summary>
    /// Add two TimeSpans, clamping to TimeSpan.MaxValue instead of throwing on overflow.
    /// Used when computing an absolute occurrence time (curTime + sampled duration) where the
    /// sampled duration can legitimately be TimeSpan.MaxValue (e.g. an event that never occurs).
    /// </summary>
    public static TimeSpan AddClamped(TimeSpan a, TimeSpan b)
    {
      if ((a == TimeSpan.MaxValue) || (b == TimeSpan.MaxValue))
        return TimeSpan.MaxValue;

      try
      {
        return a + b;
      }
      catch (OverflowException)
      {
        return TimeSpan.MaxValue;
      }
    }

    public static TimeSpan NumberToTimeSpan(double number, EnTimeRate timeRate)
    {
      try
      {
        switch (timeRate)
        {
          case EnTimeRate.trYears:
            if((number * 365) > TimeSpan.MaxValue.TotalDays)
              return TimeSpan.MaxValue;
            else
              return TimeSpan.FromDays(number * 365);
          case EnTimeRate.trDays:
            return TimeSpan.FromDays(number);
          case EnTimeRate.trHours:
            return TimeSpan.FromHours(number);
          case EnTimeRate.trMinutes:
            return TimeSpan.FromMinutes(number);
          case EnTimeRate.trSeconds:
            return TimeSpan.FromSeconds(number);
          default:
            throw new Exception("Invalid time rate");
        }
      }
      catch
      {
        return TimeSpan.MaxValue;
      }

    }

    public static double ConvertToNewTimeSpan(EnTimeRate fromTimeRate, double number, EnTimeRate toTimeRate)
    {
      double totalDays;

      switch (fromTimeRate)
      {
        case EnTimeRate.trYears:
          totalDays = number * 365.0;
          break;
        case EnTimeRate.trDays:
          totalDays = number;
          break;
        case EnTimeRate.trHours:
          totalDays = number / 24.0;
          break;
        case EnTimeRate.trMinutes:
          totalDays = number / 1440.0;
          break;
        case EnTimeRate.trSeconds:
          totalDays = number / 86400.0;
          break;
        default:
          throw new Exception("Invalid time rate");
      }

      // make sure not over max
      if (totalDays > TimeSpan.MaxValue.TotalDays)
        totalDays = TimeSpan.MaxValue.TotalDays;
      else if (totalDays < TimeSpan.MinValue.TotalDays)
        totalDays = TimeSpan.MinValue.TotalDays;

      TimeSpan asTS = TimeSpan.FromDays(totalDays);

      switch (toTimeRate)
      {
        case EnTimeRate.trYears:
          return asTS.TotalDays/365.00;
        case EnTimeRate.trDays:
          return asTS.TotalDays;
        case EnTimeRate.trHours:
          return asTS.TotalHours;
        case EnTimeRate.trMinutes:
          return asTS.TotalMinutes;
        case EnTimeRate.trSeconds:
          return asTS.TotalSeconds;
        default:
          throw new Exception("Invalid time rate");
      }
    }
  }

  /// <summary>
  /// Holds constant collections used throughout the simulation, such as the set of
  /// event types that represent conditional (non-time-sampled) triggers.
  /// </summary>
  public static class Constants
  {
    public static List<EnEventType> CondEventTypes = new List<EnEventType>
    {
      EnEventType.et3dSimEv,
      EnEventType.etVarCond,
      EnEventType.etStateCng,
      EnEventType.etComponentLogic
    };
  }

  /// <summary>
  /// Thread-safe random number generator that provides a per-execution-context <see cref="Random"/> instance.
  /// Supports optional seeding via <see cref="ConfigData.seed"/> for reproducible simulation runs.
  /// Uses <see cref="AsyncLocal{T}"/> so the same RNG flows across async/await continuations.
  /// </summary>
  public class SingleRandom : Random
  {
    // Use AsyncLocal so the same RNG instance flows across async/await continuations,
    // avoiding resets when continuations resume on different threads (e.g., ReceiveLoop).
    private static AsyncLocal<Random>? _asyncLocalRandom;
    private static int _seedBase;
    private static int _seedOffset;

    static SingleRandom()
    {
      Reset();
    }

    public static Random Instance
    {
      get
      {
        if (_asyncLocalRandom == null)
          Reset();

        // Create a per-execution-context RNG the first time it's needed.
        if (_asyncLocalRandom!.Value == null)
        {
          int seed = _seedBase + Interlocked.Increment(ref _seedOffset);
          _asyncLocalRandom.Value = new Random(seed);
        }

        return _asyncLocalRandom.Value!;
      }
    }

    public static void Reset(int? seedOverride = null)
    {
      _seedBase = seedOverride ?? ConfigData.seed ?? Environment.TickCount;
      _seedOffset = 0;

      // Start with a clean AsyncLocal container and seed the current context immediately
      // so behaviour matches the previous implementation for the primary thread.
      _asyncLocalRandom = new AsyncLocal<Random>();
      _asyncLocalRandom.Value = new Random(_seedBase);
    }
  }


  /// <summary>
  /// Singleton that accumulates optional diagnostic statistics during a simulation run,
  /// including initiating event times, component failure counts, and total sample count.
  /// Statistics collection is disabled by default and activated via <see cref="logStats"/>.
  /// </summary>
  public class Stats
  {
    public bool logStats = false;
    public List<double> ie_Times = new List<double>();
    public Dictionary<string, int> comp_fails = new Dictionary<string, int>();
    public int sampleCnt = 0;

    private static readonly Lazy<Stats> _Instance = new Lazy<Stats>(() => new Stats());

    public static Stats Instance => _Instance.Value;

    private Stats() { }
  }

  /// <summary>
  /// Thread-local singleton that dispenses monotonically increasing integer IDs for each
  /// <see cref="EnIDTypes"/> category. Keeping IDs per-thread ensures that parallel simulation
  /// runs do not share or collide on ID sequences.
  /// </summary>
  public class SingleNextIDs
  {
    private int[] curMaxID = null!;

    private static readonly ThreadLocal<SingleNextIDs> _Instance = new ThreadLocal<SingleNextIDs>(() =>
    {
      var instance = new SingleNextIDs();
      int aSize = 1 + Enum.GetValues(typeof(EnIDTypes)).Cast<int>().Max();
      instance.curMaxID = new int[aSize];
      for (int i = 0; i < aSize; ++i)
      {
        instance.curMaxID[i] = 1;
      }
      return instance;
    });

    public static SingleNextIDs Instance => _Instance.Value!;

    private SingleNextIDs() { }

    public int NextID(EnIDTypes idType, bool inc = true)
    {
      int retVal = curMaxID[(int)idType];
      if (inc)
      {
        ++curMaxID[(int)idType];
      }
      return retVal;
    }

    public void Reset()
    {
      for (int i = 0; i < curMaxID.Length; ++i)
      {
        curMaxID[i] = 1;
      }
    }

    public void ResetTimerIDs()
    {
      curMaxID[(int)EnIDTypes.itTimer] = 1;
    }

    public void ResetAllIDs()
    {
      foreach (var idType in Enum.GetValues(typeof(EnIDTypes)))
      {
        curMaxID[(int)idType] = 1;
      }
    }
  }



  /// <summary>
  /// Associates an event with the set of states that reference it and the corresponding
  /// action lists to execute when the event fires in each of those states.
  /// </summary>
  public class EventStatesAndActions
  {
    public readonly Dictionary<int, ActionList> statesAndActions = new Dictionary<int, ActionList>();
    public readonly int eventID;


    public EventStatesAndActions(int evID, int stID, ActionList inActions)
    {
      if((evID == 2) && (stID ==2))
      {
        evID = evID / 1;
      }
      this.statesAndActions.Add(stID, inActions);
      this.eventID = evID;
    }

    public void AddStateEv(int stID, ActionList inActions)
    {
      if (!statesAndActions.ContainsKey(stID))
        this.statesAndActions.Add(stID, inActions);
    }

    public void RemoveStateActions(int stID)
    {
      if (this.statesAndActions.ContainsKey(stID))
          statesAndActions.Remove(stID);
    }
  }

  /// <summary>
  /// Extension methods for <see cref="JToken"/> and <see cref="JObject"/> that add
  /// in-place value replacement by JSONPath expression.
  /// </summary>
  public static class JsonExtensions
  {
    public static JObject ReplacePath<T>(this JToken root, string path, T newValue)
    {
      if (root == null || path == null)
      {
        throw new ArgumentNullException();
      }

      foreach (var value in root.SelectTokens(path).ToList())
      {
        if (value == root)
        {
          if (value.Type == JTokenType.Object)
          {
            root = JToken.Parse(newValue?.ToString() ?? "null");
          }
          else
          {
            root = JToken.FromObject(newValue ?? (object)JValue.CreateNull());
          }
        }
        else
        {
          if (value.Type == JTokenType.Object)
          {
            value.Replace(JToken.Parse(newValue?.ToString() ?? "null"));
          }
          else
          {
            value.Replace(JToken.FromObject(newValue ?? (object)JValue.CreateNull()));
          }
        }
      }

      return (JObject)root;
    }
  }

  /// <summary>
  /// Static utility class providing cross-platform file and directory path helpers,
  /// file-path reference scanning and replacement within script strings, and
  /// directory copy operations used throughout the EMRALD simulation toolchain.
  /// </summary>
  public class CommonFunctions
  {
    /// <summary>
    /// Get the full path but always use / instead of \\
    /// </summary>
    /// <param name="path"></param>
    /// <returns></returns>
    public static string NormalizeGetFullPath(string path)
    {
      string full = Path.GetFullPath(path);

      return RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
          ? full.Replace('\\', '/')
          : full;
    }

    public static string NormalizeGetDirectoryName(string path)
    {
      if (path == "")
        return "";

      string? full = Path.GetDirectoryName(path);

      if (full == null)
        return "";

      return RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
          ? full.Replace('\\', '/')
          : full;
    }

    public static string NormalizeGetCurrentDirectory()
    {
      string full = Directory.GetCurrentDirectory();

      return RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
          ? full.Replace('\\', '/')
          : full;
    }

    public static string NormalizeGetParent(string path)
    {
      DirectoryInfo? parent = Directory.GetParent(path);

      if (parent == null)
        return "";

      string full = parent.FullName;
      return RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
          ? full.Replace('\\', '/')
          : full;
    }

    public static string NormalizeCombine(params string[] paths)
    {
      string combined = Path.Combine(paths);

      return RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
          ? combined.Replace('\\', '/')
          : combined;
    }


    public static List<string> FindFilePathReferences(ref string code, string? oldPath = null, string? newPath = null)
    {
      // Define a regular expression pattern to match file paths, including paths separated by spaces
      string pattern = @"(?<![:\/])(?:""((?:[a-zA-Z]:\\|(?:\.\.\/)|(?:\.\.\\))(?:[\w\.-]+?[\\\/])*[\w\.-]+)""|((?:[a-zA-Z]:\\|(?:\.\.\/)|(?:\.\.\\))(?:[\w\.-]+?[\\\/])*[\w\.-]+))(?=\s|$|(?=""))";

      //doesn't get items with a space in the string and adds extra stuff if is escaped for code in a script
      //string pattern = @"(?:(?:[a-zA-Z]:)?[\\/]|\.{1,2}[\\/])(?:[^\s\\/]+[\\/]?)+";

      //doesn't get multiple items in a script string because it has quotes
//      string pattern = @"
//(?:
//    (?<="")                              # ---- quoted path ----
//    (?:
//        [A-Za-z]:[\\/]+ |                #   drive‑rooted     C:\ or C:/
//        [\\/]+        |                  #   absolute         / or \
//        \.{1,2}[\\/]+                    #   relative         ./ or ../
//    )
//    (?:[^""\\/\n]+[\\/]+)*               #   inner segments
//    [^""\\/\n]+                          #   last segment
//    (?="")                               #   up to, not incl. closing quote
//  |                                      # ---- OR ----
//    (?:
//        [A-Za-z]:[\\/]+ |                #   drive‑rooted
//        [\\/]+        |                  #   absolute
//        \.{1,2}[\\/]+                    #   relative
//    )
//    (?:[^\s""\\/\n]+[\\/]+)*             #   inner segments (no spaces allowed)
//    [^\s""\\/\n]+                        #   last segment
//)";

      var regex = new Regex(
                  pattern,
                  RegexOptions.IgnorePatternWhitespace |
                  RegexOptions.Multiline |
                  RegexOptions.Compiled,
                  TimeSpan.FromSeconds(4)             // safety timeout
              );

      // Create a regex object with the defined pattern
      //Regex regex = new Regex(pattern, RegexOptions.IgnoreCase);

      // Find matches in the provided code string
      MatchCollection matches = regex.Matches(code);

      // Create a list to store the found file paths
      List<string> filePaths = new List<string>();

      // Iterate through the matches
      foreach (Match match in matches)
      {
        // If oldPath is provided, check for replacement
        if (oldPath != null && match.Value.Equals(oldPath, StringComparison.OrdinalIgnoreCase))
        {
          // Replace oldPath with newPath in the code
          code = code.Replace(oldPath, newPath);

          // Add the newPath to the list
          filePaths.Add(newPath!);
        }
        else if (oldPath == null)
        {
          // If no replacement is needed, add the found paths to the list
          filePaths.Add(match.Value);
        }
      }

      // If replacements are made, print the modified code
      if (oldPath != null)
      {
        NLog.Logger logger = NLog.LogManager.GetLogger("logfile");
        logger.Info("Modified code:\n" + code);
      }

      return filePaths;
    }


    public static void CopyDirectory(string sourceDir, string destinationDir, bool recursive)
    {
      // Get information about the source directory
      var dir = new DirectoryInfo(sourceDir);

      // Check if the source directory exists
      if (!dir.Exists)
        throw new DirectoryNotFoundException($"Source directory not found: {dir.FullName}");

      // Cache directories before we start copying
      DirectoryInfo[] dirs = dir.GetDirectories();

      // Create the destination directory
      Directory.CreateDirectory(destinationDir);

      // Get the files in the source directory and copy to the destination directory
      foreach (FileInfo file in dir.GetFiles())
      {
        string targetFilePath = CommonFunctions.NormalizeCombine(destinationDir, file.Name);
        file.CopyTo(targetFilePath);
      }

      // If recursive and copying subdirectories, recursively call this method
      if (recursive)
      {
        foreach (DirectoryInfo subDir in dirs)
        {
          string newDestinationDir = CommonFunctions.NormalizeCombine(destinationDir, subDir.Name);
          CopyDirectory(subDir.FullName, newDestinationDir, true);
        }
      }
    }

    public static string FindClosestParentFolder(List<string> filePaths)
    {
      if (filePaths == null || filePaths.Count == 0)
      {
        throw new ArgumentException("File paths list cannot be null or empty");
      }

      if (filePaths.Count == 1)
      {
        // If there is only one file path, return its parent directory
        return CommonFunctions.NormalizeGetDirectoryName(CommonFunctions.NormalizeGetFullPath(filePaths[0]));
      }

      // Split the file paths into directory parts
      List<string[]> pathParts = filePaths
          .Select(path => CommonFunctions.NormalizeGetFullPath(path).Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries))
          .ToList();

      // Find the minimum length of the path parts
      int minLength = pathParts.Min(parts => parts.Length);

      // Find the common parts among all file paths
      List<string> commonParts = new List<string>();
      for (int i = 0; i < minLength; i++)
      {
        string currentPart = pathParts[0][i];
        if (pathParts.All(parts => parts[i] == currentPart))
        {
          commonParts.Add(currentPart);
        }
        else
        {
          break;
        }
      }

      // Combine the common parts into the closest parent directory
      string closestParent = string.Join("/", commonParts);
      return closestParent;
    }

    public static string FindClosestParentFolder(string filePath1, string filePath2)
    {
      var paths = new List<string>();
      paths.Add(filePath1);
      paths.Add(filePath2);
      return FindClosestParentFolder(paths);
    }

    public static string GetRelativePath(string rootPath, string actualPath)
    {
      // Normalize the root path - handle "C:" case
      string fullRootPath = rootPath;

      // If rootPath is just a drive letter (e.g., "C:" or "C:"), convert to root
      if (rootPath.Length == 2 && rootPath[1] == ':')
      {
        fullRootPath = rootPath + Path.AltDirectorySeparatorChar;
      }
      else if (rootPath.Length == 3 && rootPath[1] == ':' &&
               (rootPath[2] == '/' || rootPath[2] == '\\'))
      {
        // Already a root path like "C:\" or "C:/"
        fullRootPath = rootPath;
      }
      else
      {
        // For other paths, get the full path
        fullRootPath = CommonFunctions.NormalizeGetFullPath(rootPath);
      }

      string fullActualPath = CommonFunctions.NormalizeGetFullPath(actualPath);

      // If both paths point to the same location, return ".\"
      string rootTrimmed = fullRootPath.TrimEnd(
          Path.DirectorySeparatorChar,
          Path.AltDirectorySeparatorChar);

      string actualTrimmed = fullActualPath.TrimEnd(
          Path.DirectorySeparatorChar,
          Path.AltDirectorySeparatorChar);

      if (string.Equals(rootTrimmed, actualTrimmed, StringComparison.OrdinalIgnoreCase))
      {
        return "." + Path.AltDirectorySeparatorChar;
      }

      // Ensure the root path ends with a directory separator
      if (!fullRootPath.EndsWith(Path.DirectorySeparatorChar.ToString()) &&
          !fullRootPath.EndsWith(Path.AltDirectorySeparatorChar.ToString()))
      {
        fullRootPath += Path.AltDirectorySeparatorChar;
      }

      // Create URIs - must be absolute file URIs
      Uri rootUri = new Uri(fullRootPath);
      Uri targetUri = new Uri(fullActualPath);

      Uri relativeUri = rootUri.MakeRelativeUri(targetUri);
      string relativePath = Uri.UnescapeDataString(relativeUri.ToString());

      // Add .\ prefix if the path doesn't start with . or a separator
      if ((relativePath.Length > 0) &&
          (relativePath[0] != '.') &&
          (relativePath[0] != Path.AltDirectorySeparatorChar))
      {
        relativePath = "." + Path.AltDirectorySeparatorChar + relativePath;
      }

      return relativePath;
    }

  }

  /// <summary>
  /// Stores the list of file references that must be copied when distributing a simulation
  /// model for multi-threaded execution, along with the timestamp of when the list was last assigned.
  /// </summary>
  public class MultiThreadInfo
  {
    public List<ToCopyForRef> ToCopyForRefs { get; set; }
    public DateTime AssignedTime { get; set; } //if assigned time is earlier than the model modified then we need to re-evaluate the ToCopyForRefs
    public MultiThreadInfo()
    {
      ToCopyForRefs = new List<ToCopyForRef>();
      AssignedTime = DateTime.Now;
    }
  }

  /// <summary>
  /// Describes a single file or directory reference within a model item that must be copied
  /// and re-pathed when the model is distributed for multi-threaded or remote execution.
  /// Includes the item name, its type, the original reference path, files to copy, and
  /// the adjusted relative path to use in the copied model.
  /// </summary>
  public class ToCopyForRef
  {
    public string ItemName { get; set; } = "";
    [JsonConverter(typeof(StringEnumConverter))]
    public EnIDTypes ItemType { get; set; }  //type of item reference is in
    public string RefPath { get; set; } = ""; //reference string in the item
    public List<string>? ToCopy { get; set; } //list if items to copy, path is relative to the EMRALD model
    public string RelPath { get; set; } = ""; //relative path to replace RefPath in the model
    public string AdjRelRoot { get; set; } = ""; //if the relative path (RelPath) is not relative to the model location but another loc this is the adjustment. example would be an RunExe where the paths are relative to the exe location.


    //[JsonIgnore]
    // Constructor to initialize all properties

    public ToCopyForRef() { }

    public ToCopyForRef(string itemName, EnIDTypes itemType, string refPath, List<string> toCopy, string relPath)
    {
      ItemName = itemName;
      ItemType = itemType;
      RefPath = refPath;

      if (toCopy != null)
        ToCopy = toCopy;
      else
        ToCopy = new List<string>();

      RelPath = relPath;
    }
  }

  /// <summary>
  /// return item data when doing a scan for things in the model
  /// </summary>
  public class ScanForReturnItem
  {
    public int itemID { get; set; }
    public string itemName { get; set; }
    public EnIDTypes itemType { get; set; }
    public string msg { get; set; }

    // Constructor
    public ScanForReturnItem(
        int itemId,
        string itemName,
        EnIDTypes itemType,
        string msg)
    {
      this.itemID = itemId;
      this.itemName = itemName;
      this.itemType = itemType;
      this.msg = msg;
    }

  }

  /// <summary>
  /// Extends <see cref="ScanForReturnItem"/> with a file path reference and copy metadata,
  /// used when a scan identifies an external file reference that may need to be relocated
  /// when the model is saved to a new location or distributed for parallel execution.
  /// </summary>
  public class ScanForRefsItem : ScanForReturnItem
  {
    public string Path { get; set; }
    public string calcRelativeFrom { get; set; } = ""; //where the relative calc needs to come from if not from the new model location
    public bool copyByDefault { get; set; } = true;

    // ConstructorI t
    public ScanForRefsItem(int itemId, string itemName, EnIDTypes itemType, string msg, string path, string diffRootPath = "", bool dfltCopy = true)
        : base(itemId, itemName, itemType, msg)
    {
      this.Path = path;
      this.calcRelativeFrom = diffRootPath;
      this.copyByDefault = dfltCopy;
    }
  }

}
