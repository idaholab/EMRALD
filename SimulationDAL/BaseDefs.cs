// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
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
  //public delegate void AddObject(TEntity entity);
  //public delegate bool ExecuteEvCallBack(int evID);
  public delegate void TLogEvCallBack(string text);

  //[JsonConverter(typeof(StringEnumConverter))]
  //public enum T3DPacketType { ptEvent = 0, ptAction = 1, ptRequest = 2, ptStillProcessing = 3, ptAck = 4 };
  //[JsonConverter(typeof(StringEnumConverter))]
  //public enum T3DEventType { etWaterContact = 0, etWaterSubmerge = 1, etTimer = 2, etSubSim = 3, etSimStarted = 4, etEndSim = 5 };
  //[JsonConverter(typeof(StringEnumConverter))]
  //public enum T3DActionType { atStartSim = 0, atPauseSim = 1, atCancelSim = 2, atContinue = 3, atTimer = 4, atReset = 5, atSetVal = 6 };

  [JsonConverter(typeof(StringEnumConverter))]
  public enum EnEventType
  {
    et3dSimEv,// = 0, //event from a 3D simulation
    etFailRate, //probabilistic failure rate - fails after a sampled time
    etVarCond, //executes when the value of a variable meets a condition 
    etStateCng, //executes when a different desired state\s are executed
    etComponentLogic,
    etTimer,
    etNormalDist, //time event following a normal distribution.
    etWeibullDist,
    etExponentialDist,
    etLogNormalDist,
    etDistribution
  };

  //public enum EnDiagramType { dtComponent = 0, dtSystem, dtPlant, dtOther };
  public enum EnDiagramType2 { dtSingle = 0, dtMulti };

  public enum EnStateType { stStart = 0, stStandard, stKeyState, stTerminal };
  public enum EnActionType { atTransition = 0, atCngVarVal, at3DSimMsg, atRunExtApp, atCustomStateShift, atJumpToTime, atCngVarDll };
  public enum EnModifiableTypes { mtNone = 0, mtVar, mtComp, mtState, mtExtEv };
  public enum EnFailType { ftFailToStart = 0, ftFailToRun }

  [JsonConverter(typeof(StringEnumConverter))]
  public enum EnTimeRate { trYears, trDays, trHours, trMinutes, trSeconds}

  public enum EnIDTypes { itVar = 0, itComp, itState, itEvent, itAction, itTreeNode, itTimer, itDiagram, itExtSim };
  public enum EnDistType { dtNormal, dtWeibull, dtExponential, dtLogNormal, dtUniform, dtTriangular, dtGamma, dtGompertz};
  //public class ModelTypesInfo
  //{
  //  //private static readonly string[] EnDiagramTypeName = { "Component", "System", "Plant Response", "Other" };
  //  //private static readonly string[] EnDiagramTypeDesc = {
  //  //  "Models a specific component and it's failure methods. (Single active state)",
  //  //  "Should model and evaluate a defined logic. (single active state)",
  //  //  "Models sequences and scenarios of concern with key end states. (multiple active states)" ,
  //  //  "Other" };

  //  //private static readonly string[] EnActionTypeName = { "Transition", "Change Var Value", "External Sim msg"};
  //  //private static readonly string[] EnActionTypeDesc = {
  //  //  "Move from the current state to new one or add a new state to the active ones.",
  //  //  "Evaluate a script and change the value of a the assigned variable to the result.",
  //  //  "Send a message to and external simulation."};

  //  //private static readonly string[] EnEventTypeName = { "Ext Simulation Ev", "Failure Rate Ev", "Variable Condition", "State Change", "Component Logic", "Timer" };
  //  //private static readonly string[] EnEventTypeDesc = {
  //  //  "Event tied to external simulation event.",
  //  //  "Event with a failure rate that sampled and then triggers it according to the next sampled time.",
  //  //  "Executes if evaluation of a variable meets a specified condition.",
  //  //  "Executes if a specified state is entered or exited.",
  //  //  "Executes if evaluate a set of logic from component states is equal to specified boolean value.",
  //  //  "Executes at a specified simulation time."
  //  //};


  //  //public static string DiagramTypeName(EnDiagramType dType) {return EnDiagramTypeName[(int)dType];}
  //  //public static string DiagramTypeDesc(EnDiagramType dType) { return EnDiagramTypeName[(int)dType]; }
  //  //public static string ActionTypeName(EnActionType dType) { return EnActionTypeName[(int)dType]; }
  //  //public static string ActionTypeDesc(EnActionType dType) { return EnActionTypeName[(int)dType]; }
  //  //public static string EventTypeName(EnEventType dType) { return EnActionTypeName[(int)dType]; }
  //  //public static string EventTypeDesc(EnEventType dType) { return EnActionTypeName[(int)dType]; }
  //}
  public enum ScanForTypes { sfMultiThreadIssues = 0};

  public static class ConfigData
  {
    static public int? threads = null;
    static public int? seed = null;
    static public LogLevel debugLev = LogLevel.Off;
    static public int? debugRunStart = null;
    static public int? debugRunEnd = null;
  }

    public class DBModified
  {
    protected bool _itemModified = true;
    protected bool _linksModified = true;

    public bool itemModified { get { return _itemModified; } set { _itemModified = value; } }
    public bool linksModified { get { return _linksModified; } set { _linksModified = value; } }
  }

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
    
  public abstract class BaseObjInfo// : IDBMinimumInfo
  {
    protected int _id; //ids are local only, to be used for lookups where names can't be used like bitsets

    public int id { get {return _id; } }
    public string name { get; set; }
    public string desc { get; set; }
    public bool processed = false;


    //public abstract bool LoadLinks(LookupLists list);
    //public abstract bool SavePrep(LookupLists lists);
    //public abstract bool SaveLinks(LookupLists lists);
    //public abstract bool DeleteFromDB(LookupLists lists);

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


  public interface ModelItemLists
  {
    //void DeleteAll();
    //bool SaveItemsPrep(LookupLists lists);
    //bool RemoveDeletedFromDB(LookupLists lists);
    //void SaveDone();
    //void LoadFromDB();
    //bool LoadLinks(LookupLists lists);  //after loading all objects from the DB load the reference links or bridge items
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
    

    //void LoadIfNot();
  }


  public static class Globals
  {
    //public static int simID = 1;
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

    public static TimeSpan NumberToTimeSpan(double number, EnTimeRate timeRate)
    {
      try
      {
        switch (timeRate)
        {
          case EnTimeRate.trYears:
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
      TimeSpan asTS;
      switch (fromTimeRate)
      {
        case EnTimeRate.trYears:
          asTS = TimeSpan.FromDays(number * 365);
          break;
        case EnTimeRate.trDays:
          asTS = TimeSpan.FromDays(number);
          break;
        case EnTimeRate.trHours:
          asTS = TimeSpan.FromHours(number);
          break;
        case EnTimeRate.trMinutes:
          asTS = TimeSpan.FromMinutes(number);
          break;
        case EnTimeRate.trSeconds:
          asTS = TimeSpan.FromSeconds(number);
          break;
        default:
          throw new Exception("Invalid time rate");
      }

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

  public static class Constants
  {
    public static List<EnEventType> CondEventTypes = new List<EnEventType> 
    { 
      EnEventType.et3dSimEv, 
      EnEventType.etVarCond, 
      EnEventType.etStateCng, 
      EnEventType.etComponentLogic 
    };

    //public List<int> CondEventTypes = new List<int> 
    //{ 
    //  (int)EnEventType.et3dSimEv, 
    //  (int)EnEventType.etVarCond, 
    //  (int)EnEventType.etStateCng, 
    //  (int)EnEventType.etStateLogic 
    //};

    //public bool IsCondEventType(EnEventType etType)
    //{
    //  return (etType == EnEventType.et3dSimEv) ||
    //         (etType == EnEventType.etVarCond) ||
    //         (etType == EnEventType.etStateCng) ||
    //         (etType == EnEventType.etStateLogic);

    //}
  }

  public class SingleRandom : Random
  {
    static SingleRandom _Instance;
    public static SingleRandom Instance
    {
      get
      {
        if (_Instance == null)
        {
          if(ConfigData.seed == null)
            _Instance = new SingleRandom();
          else
            _Instance = new SingleRandom((int)ConfigData.seed);
        }
        return _Instance;
      }
    }

    private SingleRandom() : base() { }
    private SingleRandom(int seed) : base(seed) { }
    public static void Reset()
    {
      _Instance = null;
    }
  }


  public class Stats
  {
    public bool logStats = false;
    public List<double> ie_Times = new List<double>();
    public Dictionary<string, int> comp_fails = new Dictionary<string, int>();
    public int sampleCnt = 0;


    static Stats _Instance;
    public static Stats Instance
    {
      get
      {
        if (_Instance == null) _Instance = new Stats();
        return _Instance;
      }
    }

    private Stats() { }
  }

  //public class DBLoad : SimRunnerEntities
  //{
  //  static string _dbName = null;
  //  static DBLoad _Instance;
  //  static Dictionary<int, int> _ordToStateType;
  //  static Dictionary<int, int> _ordToVarScopeType;

  //  public static void SetDBName(string dbName)
  //  {
  //    _dbName = dbName.Replace(' ', '_');
  //  }

  //  private DBLoad() : base() 
  //  {
  //    //_dbName = dbName;
  //  }

  //  private DBLoad(string connStr) : base(connStr) { }

  //  public static DBLoad Instance
  //  {
  //    get
  //    {
  //      if (_Instance == null)
  //      {
  //        string connStr = null;

  //        //if (!localDB)
  //        //{ 
  //          connStr = System.Configuration.ConfigurationManager.ConnectionStrings["SimRunnerEntities"].ConnectionString;
  //          try
  //          {
  //            //NOTE: comment this line out. Switching between connection is done in the app/web config file.
  //            //string connStrTest = System.Configuration.ConfigurationManager.ConnectionStrings["SimRunnerEntitiesTest"].ConnectionString;
  //            EntityConnectionStringBuilder ECSB = new EntityConnectionStringBuilder(connStr);
  //            using (SqlConnection conn = new SqlConnection(ECSB.ProviderConnectionString))
  //            {
  //              conn.Open(); // throws if invalid
  //              conn.Close();
  //            }
  //          }
  //          catch (Exception ex)
  //          {
  //            //localDB = true;
  //            throw ex;
  //          }


  //        //_Instance = new DBLoad();
  //        _Instance = new DBLoad(connStr);
  //      } //      


  //      if (_ordToStateType == null)
  //      {
  //        _ordToStateType = new Dictionary<int, int>();
  //        foreach (rStateType curState in _Instance.rStateTypes)
  //        {
  //          _ordToStateType.Add(curState.EnumVal, curState.StateType_ID);
  //        }
  //      }

  //      if (_ordToVarScopeType == null)
  //      {
  //        _ordToVarScopeType = new Dictionary<int, int>();
  //        foreach (rScopeType curState in _Instance.rScopeTypes)
  //        {
  //          _ordToVarScopeType.Add(curState.EnumVal, curState.ScopeType_ID);
  //        }
  //      }

  //      return _Instance;
  //    }
  //  }

  //  public static void ResetInstance()
  //  {
  //    _Instance = null;
  //  }
  //}

  public class SingleNextIDs
  {
    private int[] curMaxID;

    private static ThreadLocal<SingleNextIDs> _Instance = new ThreadLocal<SingleNextIDs>(() =>
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

    public static SingleNextIDs Instance => _Instance.Value;

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

    //public StEvKey(List<int> stIDs, int evID, ActionList inActions)
    //{
    //  this.stateIDs = stIDs;
    //  this.eventID = evID;
    //  this.actions = inActions;
    //}

    public void AddStateEv(int stID, ActionList inActions)
    {
      if (!statesAndActions.ContainsKey(stID))
        this.statesAndActions.Add(stID, inActions);
      //else
      //  throw new Exception("Already has state ID " + stID.ToString() + " In the list");
    }

    public void RemoveStateActions(int stID)
    {
      if (this.statesAndActions.ContainsKey(stID))
          statesAndActions.Remove(stID);
    }
  }

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
            root = JToken.Parse(newValue.ToString());
          }
          else
          {
            root = JToken.FromObject(newValue);
          }
        }
        else
        {
          if (value.Type == JTokenType.Object)
          {
            value.Replace(JToken.Parse(newValue.ToString()));
          }
          else
          {
            value.Replace(JToken.FromObject(newValue));
          }          
        }
      }

      return (JObject)root;
    }
  }

  public class CommonFunctions
  {
    public static List<string> FindFilePathReferences(ref string code, string oldPath = null, string newPath = null)
    {
      // Define a regular expression pattern to match file paths
      string pattern = @"(?<![:\/])((?:[a-zA-Z]:\\)|(?:\.\/)|(?:\.\.\/)|(?:\.\\)|(?:\.\.\\))(?:[\w\s\.-]+\\)*(?:[\w\s\.-]+)";

      // Create a regex object with the defined pattern
      Regex regex = new Regex(pattern, RegexOptions.IgnoreCase);

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
          filePaths.Add(newPath);
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
        Console.WriteLine("Modified code:\n" + code);
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
        string targetFilePath = Path.Combine(destinationDir, file.Name);
        file.CopyTo(targetFilePath);
      }

      // If recursive and copying subdirectories, recursively call this method
      if (recursive)
      {
        foreach (DirectoryInfo subDir in dirs)
        {
          string newDestinationDir = Path.Combine(destinationDir, subDir.Name);
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
        return Path.GetDirectoryName(Path.GetFullPath(filePaths[0])).Replace('\\', '/');
      }

      // Split the file paths into directory parts
      List<string[]> pathParts = filePaths
          .Select(path => Path.GetFullPath(path).Replace('\\', '/').Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries))
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

    public static string GetRemainingPath(string parentFolder, string filePath)
    {
      // Ensure the parent folder and file path are in a consistent format
      string normalizedParentFolder = Path.GetFullPath(parentFolder).Replace('\\', '/');
      string normalizedFilePath = Path.GetFullPath(filePath).Replace('\\', '/');

      // Check if the file path starts with the parent folder path
      if (!normalizedFilePath.StartsWith(normalizedParentFolder, StringComparison.OrdinalIgnoreCase))
      {
        throw new ArgumentException("The file path does not start with the provided parent folder path.");
      }

      // Get the remaining path after the parent folder
      string remainingPath = normalizedFilePath.Substring(normalizedParentFolder.Length).TrimStart('/');
      return remainingPath;
    }


  }

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

  public class ToCopyForRef
  {
    public string ItemName { get; set; }
    public EnIDTypes ItemType { get; set; }
    public string RefPath { get; set; }
    public List<string> ToCopy { get; set; }
    public string RelPath { get; set; }

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

    //[JsonIgnore]
    //public EnIDTypes GetEnumType()
    //{
    //  foreach (EnIDTypes type in Enum.GetValues(typeof(EnIDTypes)))
    //  {
    //    if (type.ToString().Substring(2).Equals(this.ItemType, StringComparison.OrdinalIgnoreCase))
    //    {
    //      return type;
    //    }
    //  }
    //  throw new ArgumentException($"Invalid item type string: {this.ItemType}");
    //}
  }

  public class ScanForReturnItem
  {
    public int itemID { get; set; }
    public string itemName { get; set; }
    public EnIDTypes itemType { get; set; }
    public string msg { get; set; }

    // Constructor
    public ScanForReturnItem(int itemId, string itemName, EnIDTypes itemType, string msg)
    {
      this.itemID = itemId;
      this.itemName = itemName;
      this.itemType = itemType;
      this.msg = msg;
    }

  }

  public class ScanForRefsItem : ScanForReturnItem
  {
    public string Path { get; set; }

    // ConstructorI t
    public ScanForRefsItem(int itemId, string itemName, EnIDTypes itemType, string msg, string path)
        : base(itemId, itemName, itemType, msg)
    {
      this.Path = path;
    }
  }

}
