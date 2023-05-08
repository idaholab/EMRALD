// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Data.SqlClient;
//using System.Data.EntityClient;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CommonDefLib;
using System.Linq;
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
    etDistribution,
    etHRAEval //time based event using HRA time calculation module
    };

  public enum EnDiagramType { dtComponent = 0, dtSystem, dtPlant, dtOther }; 

  public enum EnStateType { stStart = 0, stStandard, stKeyState, stTerminal };
  public enum EnActionType { atTransition = 0, atCngVarVal, at3DSimMsg, atRunExtApp, atCustomStateShift, atJumpToTime };
  public enum EnModifiableTypes { mtNone = 0, mtVar, mtComp, mtState, mtExtEv };
  public enum EnFailType { ftFailToStart = 0, ftFailToRun }

  [JsonConverter(typeof(StringEnumConverter))]
  public enum EnTimeRate { trYears, trDays, trHours, trMinutes, trSeconds}

  public enum EnIDTypes { itVar = 0, itComp, itState, itEvent, itAction, itTreeNode, itTimer, itPacket, itDiagram, itExtSim };
  public enum EnDistType { dtNormal, dtWeibull, dtExponential, dtLogNormal, dtUniform, dtTriangular, dtGamma, dtGompertz};
  //public class ModelTypesInfo
  //{
  //  //private static readonly string[] EnDiagramTypeName = { "Component", "System", "Plant Response", "Other" };
  //  //private static readonly string[] EnDiagramTypeDesc = {
  //  //  "Models a specific component and it's failure methods. (Single active state)",
  //  //  "Should model and evaluate a defined logic. (single active state)",
  //  //  "Models sequences and scenarios of concern with key end states. (multiple active states)" ,
  //  //  "Other" };

  //  //private static readonly string[] EnActionTypeName = { "Transition", "Change Var Value", "External Sim Msg"};
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
      else if (evItem is NormalDistEvent)
        return EnEventType.etNormalDist;

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
    static SingleNextIDs _Instance;
    public static SingleNextIDs Instance
    {
      get
      {
        if (_Instance == null)
        {
          _Instance = new SingleNextIDs();

          int aSize = 1 + Enum.GetValues(typeof(EnIDTypes)).Cast<int>().Max();
          _Instance.curMaxID = new int[aSize];
          for (int i = 0; i < aSize; ++i)
          {
            _Instance.curMaxID[i] = 1;
          }
        }
        return _Instance;
      }
    }

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
      for (int i = 0; i < _Instance.curMaxID.Length; ++i)
      {
        _Instance.curMaxID[i] = 1;
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
    public readonly Dictionary<int, List<Action>> statesAndActions = new Dictionary<int, List<Action>>();
    public readonly int eventID;
    

    public EventStatesAndActions(int evID, int stID, ActionList inActions, List<string> evPickKeys = null)
    {
      //copy the action list
      ActionList actions = null; 
      if(evPickKeys == null) //use all of them
      {
        actions = new ActionList(inActions);
      }
      else //only add action options the event says are to be executed.
      {
        actions = new ActionList();
        for(int i = 0; i < inActions.Count();  ++i)
        {
          if (evPickKeys.Contains(inActions.eventPickedActionKeys[i]))
            actions.Add(inActions[i]);
        }
      }

      this.statesAndActions.Add(stID, actions);
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


}
