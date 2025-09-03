// Copyright 2021 Battelle Energy Alliance{


using System;
using System.Collections;
using System.Collections.Generic;
//using System.Windows.Forms;
using System.Data;
//using System.Collections;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using MathNet.Numerics.LinearAlgebra;
using MessageDefLib;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using NLog;
using Sop.Collections.BTree;


namespace SimulationDAL
{

  //public delegate int NewStateDecisionCallBack(StEvKey stEvKey);


  //public static class GlobalVar
  //{
  //  public const string GET_EVS_FOR_ST_SQL = "Select * from rEvent inner join bState_Events on rEvent.Event_ID = bState_Events.Event_ID where Sim_ID = ";
  //  public const string GET_ACTS_FOR_ST_SQL = "Select * from rAction inner join bState_Actions on rAction.Action_ID = bState_Actions.Action_ID where Sim_ID = 1 and State_ID = ";
  //  public const string GET_STATES_SQL = "Select State_ID, BegEnd, Sim_ID from rState where Sim_ID = ";
  //  public const string GET_COMPONENTS_SQL = "Select * from rComponent inner join bSim_Comps on rComponent.Component_ID = bSim_Comps.Comp_ID where Sim_ID = ";
  //}





  //[DataContract]
  public class EmraldModel : BaseObjInfo
  {
    private Boolean _multiThreadReady = false;
    private int? _threadNumber = 0;
    private bool _updated = false;
    private MultiThreadInfo _MultiThreadInfo = null;
    public const double SCHEMA_VERSION = 3.1;
    //public dSimulation _Sim = null;
    //protected Diagram _Diagram = null; //TODO remove was added for testing.
    public AllDiagrams allDiagrams = new AllDiagrams();
    public AllStates allStates = new AllStates();
    public AllEvents allEvents = new AllEvents();
    public AllActions allActions = new AllActions();
    public AllExtSims allExtSims = new AllExtSims();
    public VariableList allVariables = new VariableList();
    //public ComponentsList allComponents = new ComponentsList();
    public LogicNodeList allLogicNodes = new LogicNodeList();
    public Dictionary<int, List<AccrualVariable>> AccrualVars = new Dictionary<int, List<AccrualVariable>>();
    private static readonly object deleteLock = new object(); // a static object for thread file locking


    public string fileName { get; set; } = "";
    public string rootPath { get; set; } = "";
    public string modelTxt { get; set; } = "";
    public bool updated { get { return _updated; } }
    public MultiThreadInfo multiThreadInfo
    {
      get { if (_MultiThreadInfo == null) _MultiThreadInfo = new MultiThreadInfo(); return _MultiThreadInfo; }
    }

    //public int dbID = 0;
    public int curRunIdx = 0; //current run index.
    public int totRunsReq = 0; //total runs requested
    //public bool multiThreadReady { get { return _multiThreadReady; } }
    public int? threadNum { get { return _threadNumber; } }
    
    //public Dictionary<int, Formula> allFormulas = new Dictionary<int, Formula>();
    //public Diagram curDiagram { get { return _Diagram; } set { _Diagram = value; } }

    public EmraldModel() {}

    public EmraldModel(String name, String desc)
    {
      this.name = name;
      this.desc = desc;
      this._id = 0;
    }

    public void SetMultiThreadInfo (MultiThreadInfo value = null)
    {
      if (value != null)
        this._MultiThreadInfo = value;

      dynamic jsonObj = JsonConvert.DeserializeObject(this.modelTxt);
      string multiThreadInfoJson = JsonConvert.SerializeObject(this._MultiThreadInfo);
      JToken multiThreadInfoToken = JToken.Parse(multiThreadInfoJson);

      // Modify the property if it exists, or add it if it does not
      ((JObject)jsonObj)["multiThreadInfo"] = multiThreadInfoToken;

      // Serialize the modified object back into a JSON string
      this.modelTxt = JsonConvert.SerializeObject(jsonObj, Formatting.Indented);
    }


    public void AddList(EmraldModel toAdd)
    {
      foreach (var i in toAdd.allDiagrams) { allDiagrams.Add(i.Value); }
      foreach (var i in toAdd.allStates) { allStates.Add(i.Value); }
      foreach (var i in toAdd.allEvents) { allEvents.Add(i.Value); }
      foreach (var i in toAdd.allActions) { allActions.Add(i.Value); }
      foreach (var i in toAdd.allExtSims) { allExtSims.Add(i.Value); }
      foreach (var i in toAdd.allVariables) { allVariables.Add(i.Value); }
      foreach (var i in toAdd.allLogicNodes) { allLogicNodes.Add(i.Value); }
    }

    public void SetProcessed(bool value)
    {
      allDiagrams.SetProcessed(value);
      allStates.SetProcessed(value);
      allEvents.SetProcessed(value);
      allActions.SetProcessed(value);
      allVariables.SetProcessed(value);
      allLogicNodes.SetProcessed(value);
    }

    public string ListsAllProcessed()
    {
      string resultStr = "";
      resultStr = resultStr + allDiagrams.AllProcessed();
      resultStr = resultStr + allStates.AllProcessed();
      resultStr = resultStr + allEvents.AllProcessed();
      resultStr = resultStr + allActions.AllProcessed();
      resultStr = resultStr + allVariables.AllProcessed();
      resultStr = resultStr + allLogicNodes.AllProcessed();

      return resultStr;
    }

    public override string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + base.GetJSON(false, lists);
      retStr = retStr + "," + this.allActions.GetJSON(false, lists);
      retStr = retStr + "," + this.allDiagrams.GetJSON(false, lists);
      retStr = retStr + "," + this.allEvents.GetJSON(false, lists);
      retStr = retStr + "," + this.allLogicNodes.GetJSON(false, lists);
      retStr = retStr + "," + this.allStates.GetJSON(false, lists);
      retStr = retStr + "," + this.allVariables.GetJSON(false, lists);
      retStr = retStr + "," + this.allExtSims.GetJSON(false, lists);

      if (incBrackets)
      {
        retStr = retStr + Environment.NewLine + "}";
      }

      return retStr;
    }

    public string UpdateModel(string jsonModel)
    {
      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //update the model if needed
      if ((jsonObj.emraldVersion == null) || (jsonObj.emraldVersion < SCHEMA_VERSION))
      {
        try
        {
          string upgraded = UpgradeModel.UpgradeJSON(jsonModel);
          _updated = true;
          return upgraded;
        }
        catch (Exception ex)
        {
          throw new Exception("Failed to Upgrade old model to v" + SCHEMA_VERSION + ex.Message);
        }
      }
      else if(jsonObj.emraldVersion > SCHEMA_VERSION)
      {
        throw new Exception("EMRALD solver version too old to solve this model. Upgrade to v" + jsonObj.emraldVersion);
      }
     
      return jsonModel;
    }

    private string GetTempThreadFilesPath(int threadID = -1)
    {
      if(threadID < 0)
        threadID = (int)_threadNumber;
      return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), @"EMRALD\" + this.fileName + "_T" + threadID.ToString());
    }

    public bool DeserializeJSON(string jsonModel, string modelPath, string fileName, int? threadNum = null) 
    {
      SingleNextIDs.Instance.Reset();

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      this.modelTxt = jsonModel;
      this.fileName = fileName;
      this._threadNumber = threadNum;

      // Deserialize multiThreadInfo if present
      if (jsonObj.multiThreadInfo != null)
      {
        this._MultiThreadInfo = JsonConvert.DeserializeObject<MultiThreadInfo>(Convert.ToString(jsonObj.multiThreadInfo));
      }
      else
      {
        this._MultiThreadInfo = new MultiThreadInfo();
      }

      if (threadNum != null) //assign thread info and copy data
      {
        this.rootPath = GetTempThreadFilesPath();

        // Ensure the directory exists and is empty
        if (Directory.Exists(this.rootPath))
        {
          Directory.Delete(this.rootPath, true);
        }
        Directory.CreateDirectory(this.rootPath);

        if (threadNum != 0) //if not the first thread then just copy the first one's files.
        {
          string firstRootPath = GetTempThreadFilesPath(0);
          if (!Directory.Exists(firstRootPath))
          {
            throw new Exception("Missing data to copy from first thread.");
          }
          CommonFunctions.CopyDirectory(firstRootPath, this.rootPath, true);
        }
        else
        {
          //copy all the data needed to run in its own thread

          File.WriteAllText(this.rootPath + Path.DirectorySeparatorChar + this.fileName + ".emrald", this.modelTxt); 
          Dictionary<string, string> copied = new Dictionary<string, string>(); //files copied and where they came from
          foreach (var item in multiThreadInfo.ToCopyForRefs)
          {
            if (threadNum == 0)// && (item.ToCopy.Count > 0)) //if the first thread then make sure to figure out all the files needed.
            {
              string commonFolder = CommonFunctions.FindClosestParentFolder(item.ToCopy);
              for (int i = 0; i < item.ToCopy.Count; i++)
              {
                var copyItem = item.ToCopy[i];
                
                //copy the items needed
                string copyFrom = Path.GetFullPath(Path.Combine(modelPath, copyItem));
                if (File.Exists(copyFrom))
                {
                  string root = rootPath;
                  //if this is not directly reletive to the model location adjust it
                  if (item.AdjRelRoot != "")
                    root = Path.GetFullPath(Path.Combine(rootPath, item.AdjRelRoot));
                  string copyTo = Path.GetFullPath(Path.Combine(root, item.RelPath));
                  if (i > 0) //not the main copy/replace item, so use the path of the [0] item for this copy
                  {
                    string subItemPath = Path.GetDirectoryName(item.RelPath);
                    if (subItemPath == ".")
                      subItemPath = "";
                    else
                      subItemPath += Path.DirectorySeparatorChar;

                    copyTo = Path.GetFullPath(Path.Combine(root, subItemPath + Path.GetFileName(copyItem)));
                  }

                  if (copied.ContainsKey(copyTo))
                  {
                    if (copied[copyTo] != copyFrom)
                    {
                      throw new Exception("If run using multithreading, the model would have idenical relaive path references to two different files of the same name.");
                    }
                    //else it already coppied the file, dont copy again
                  }
                  else //not copied yet so copy for multithreading.
                  {
                    //make sure directory exists
                    string directory = Path.GetDirectoryName(copyTo);
                    if (directory != null && !Directory.Exists(directory))
                    {
                      Directory.CreateDirectory(directory);
                    }

                    File.Copy(copyFrom, copyTo);
                    copied.Add(copyTo, copyFrom);
                  }
                }
              }
            }
          }
        }
      }
      else
      {
        this.rootPath = modelPath;
      }
      
      
      //update the model if needed
      if((jsonObj.emraldVersion == null) || (jsonObj.emraldVersion < SCHEMA_VERSION) ) 
      {
        try
        {
          string upgraded = UpgradeModel.UpgradeJSON(jsonModel);
          jsonObj = JsonConvert.DeserializeObject(upgraded);
        }
        catch (Exception ex)
        {
          throw new Exception("Failed to Upgrade old model to v" + SCHEMA_VERSION + ex.Message);
        }
      }

      if (DeserializeDerived(jsonObj, true, this, false))
      {
        if(threadNum.HasValue)
          ApplyMultiThreadChanges(jsonObj);
        return true;
      }

      return false;

             
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      //construct all the objects
      this.allActions.DeserializeJSON(dynObj.ActionList, this, useGivenIDs);
      this.allDiagrams.DeserializeJSON(dynObj.DiagramList, this, useGivenIDs);
      this.allVariables.DeserializeJSON(dynObj.VariableList, this, useGivenIDs);
      var evs = dynObj.EventList;
      this.allEvents.DeserializeJSON(dynObj.EventList, this, useGivenIDs);
      var logic = dynObj.LogicNodeList;
      this.allLogicNodes.DeserializeJSON(dynObj.LogicNodeList, this, useGivenIDs);
      this.allStates.DeserializeJSON(dynObj.StateList, this, useGivenIDs);
      if (dynObj.ExtSimList != null)
        this.allExtSims.DeserializeJSON(dynObj.ExtSimList, this, useGivenIDs);

      //make the links to all the other objects
      this.allActions.LoadLinks(dynObj.ActionList, this);
      this.allDiagrams.LoadLinks(dynObj.DiagramList, this);
      this.allVariables.LoadLinks(dynObj.VariableList, this);
      this.allLogicNodes.LoadLinks(logic, this);
      this.allEvents.LoadLinks(dynObj.EventList, this);
      this.allStates.LoadLinks(dynObj.StateList, this);

      this.allActions.loaded = true;
      this.allDiagrams.loaded = true;
      this.allVariables.loaded = true;
      this.allLogicNodes.loaded = true;
      this.allEvents.loaded = true;
      this.allStates.loaded = true;

      //compile codes
      this.allEvents.CompileCodes(this);
      this.allActions.CompileCodes(this);

      return true;
    }

    /// <summary>
    /// if result cout is > 0 there are issues
    /// </summary>
    /// <returns>description of issues if there are any</returns>
    public List<string> CanMutiThread()
    {
      // Ensure multiThreadInfo and its ToCopyForRefs list are initialized before use.
      // This prevents NullReferenceExceptions if either the multiThreadInfo object or its ToCopyForRefs property
      // have not been set (such as after deserialization, or if not initialized elsewhere in the code).
      if (_MultiThreadInfo == null)
        _MultiThreadInfo = new MultiThreadInfo();
      if (_MultiThreadInfo.ToCopyForRefs == null)
        _MultiThreadInfo.ToCopyForRefs = new List<ToCopyForRef>();
      
      var ModelRefsList = new List<ScanForReturnItem>();

      //Return any issues that actions could have with reference when multithreading
      ModelRefsList.AddRange(allDiagrams.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allStates.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allEvents.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allActions.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allExtSims.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allVariables.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allLogicNodes.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      
      //go through each of the found items and look for them in the multiThreadInfo or put in a new list.
      var notAccountedFor = new List<String>();
      Dictionary<string, List<ToCopyForRef>> curMutiThreadItems = new Dictionary<string, List<ToCopyForRef>>();
      foreach (var item in multiThreadInfo.ToCopyForRefs)
      {
        //create list if doens't exist yet for key
        if (!curMutiThreadItems.ContainsKey(item.ItemName))
          curMutiThreadItems.Add(item.ItemName, new List<ToCopyForRef>());

        curMutiThreadItems[item.ItemName].Add(item);          
      }

      //add items to the multiThreadInfo if not there and keep track if items were not accounted for.
      foreach (var modelRef in ModelRefsList)
      {
        var mPathRef = (modelRef as ScanForRefsItem);
        //see if the item is in the saved JSON reference info
        if (curMutiThreadItems.ContainsKey(modelRef.itemName)) 
        {
          bool found = false;
          string issue = "";
          foreach (var curI in curMutiThreadItems[modelRef.itemName])
          {
            issue = $"{modelRef.itemName} missing RelPath";
            if (string.IsNullOrEmpty(curI.RelPath))
            {
              break;
            }
            if (curI.RefPath == mPathRef.Path)
            {
              found = true;
              break;
            }
          }
          if (!found)
            notAccountedFor.Add($"{modelRef.itemName} missing RelPath");
        }
        else //not in the saved items so add it 
        {
          var addI = new ToCopyForRef(mPathRef.itemName, mPathRef.itemType, mPathRef.Path, null, "");
          
          string actualPath = mPathRef.Path;
          //if it as a relative reference get to full path 
          if (!Path.IsPathRooted(mPathRef.Path) && (mPathRef.Path[0] == '.'))
          {
            actualPath = Path.GetFullPath(Path.Combine(rootPath, mPathRef.Path));
          }

          string commonParent = CommonFunctions.FindClosestParentFolder(rootPath, actualPath);
          //if item provided a different root location use that one instead
          if (mPathRef.calcRelativeFrom != "")
          {
            string newRootPath = CommonFunctions.FindClosestParentFolder(mPathRef.calcRelativeFrom, actualPath);
            addI.AdjRelRoot = CommonFunctions.GetRelativePath(commonParent, newRootPath);
            commonParent = newRootPath;
          }
          addI.RelPath = CommonFunctions.GetRelativePath(commonParent, actualPath);
          addI.ToCopy.Add(mPathRef.Path); //combine and normalize the path.

          multiThreadInfo.ToCopyForRefs.Add(addI);
          notAccountedFor.Add(addI.ItemName);

        }
      }

      //put the multiTheadInfo back onto the model JSON string by assigning it;
      SetMultiThreadInfo();
      //dynamic jsonObj = JsonConvert.DeserializeObject(this.modelTxt);
      //string multiThreadInfoJson = JsonConvert.SerializeObject(multiThreadInfo);
      //JToken multiThreadInfoToken = JToken.Parse(multiThreadInfoJson);

      //// Check if the "multiThreadInfo" property exists
      //if (jsonObj.multiThreadInfo != null)
      //{
      //  // Replace the existing value
      //  jsonObj.multiThreadInfo = multiThreadInfoToken;
      //}
      //else
      //{
      //  // Add the new property and value
      //  ((JObject)jsonObj).Add("multiThreadInfo", multiThreadInfoToken);
      //}

      //// Serialize the modified object back into a JSON string
      //this.modelTxt = JsonConvert.SerializeObject(jsonObj, Formatting.Indented);

      _multiThreadReady = notAccountedFor.Count == 0;
      return notAccountedFor;
    }

    public void ClearMultiThreadData()
    {
      if (this._threadNumber != null)
      {
        if (Directory.Exists(this.rootPath))
        {
          Directory.Delete(this.rootPath, true);
        }

        //clear out any old tread files that could be lingering
        // Get the parent directory info
        DirectoryInfo parentDirInfo = new DirectoryInfo(this.rootPath).Parent;

        // Get all subdirectories
        DirectoryInfo[] subDirs = parentDirInfo.GetDirectories();

        foreach (DirectoryInfo dir in subDirs)
        {
          // Get the creation time of the folder
          DateTime creationTime = dir.CreationTime;

          // Calculate the time difference
          TimeSpan timeDifference = DateTime.Now - creationTime;

          // Check if the folder was created more than a week ago
          if (timeDifference.TotalDays > 1)
          {
            // Use a lock to ensure thread safety
            lock (deleteLock)
            {
              try
              {
                // Delete the directory and its contents
                dir.Delete(true);
              }
              catch (Exception ex) { }
            }
          }
        }
      }
    }

   
    private void ApplyMultiThreadChanges(object obj)
    {
      foreach (var item in multiThreadInfo.ToCopyForRefs)
      {
        //update items so that they will work with multi threading.
        switch (item.ItemType)
        {
          case EnIDTypes.itVar:
            //only DocVariable
            var vItem = this.allVariables.FindByName(item.ItemName);
            if (!(vItem is DocVariable))
              throw new Exception("Broken path reference edit " + item.ItemName + " is not a document variable.");

            (vItem as DocVariable).UpdatePathRefs(item.RefPath, item.RelPath, this.rootPath);
            break;
          case EnIDTypes.itState:
            throw new Exception("Currently there are no state properties that need to be modified for multi threading, check the entry for - " + item.ItemName);
            break;
          case EnIDTypes.itEvent:
            var eItem = this.allEvents.FindByName(item.ItemName);
            if (!((eItem is EvalVarEvent) || (eItem is ExtSimEv)))
              throw new Exception("Broken path reference edit " + item.ItemName + " is not an external Simulation or evaluate Variable event.");

            if(eItem is EvalVarEvent)
              (eItem as EvalVarEvent).UpdatePathRefs(item.RefPath, item.RelPath, this.rootPath);

            if (eItem is ExtSimEv)
               (eItem as ExtSimEv).UpdatePathRefs(item.RefPath, item.RelPath, this.rootPath);
            break;
          case EnIDTypes.itAction:
            var aItem = this.allActions.FindByName(item.ItemName);
            if (!((aItem is ScriptAct) || (aItem is RunExtAppAct)))
              throw new Exception("Broken path reference edit " + item.ItemName + " is not an Variable Value or Run Exe Action.");

            if (aItem is ScriptAct)
              (aItem as ScriptAct).UpdatePathRefs(item.RefPath, item.RelPath, this.rootPath);

            if (aItem is RunExtAppAct)
              (aItem as RunExtAppAct).UpdatePathRefs(item.RefPath, item.RelPath, this.rootPath, this);

            break;
          case EnIDTypes.itTreeNode:
            throw new Exception("Currently there are no Logic Tree properties that need to be modified for multi threading, check the entry for - " + item.ItemName);
            break;
          case EnIDTypes.itTimer:
            throw new Exception("Currently there are no Timer properties that need to be modified for multi threading, check the entry for - " + item.ItemName);
            break;
          case EnIDTypes.itDiagram:
            throw new Exception("Currently there are no Diagram properties that need to be modified for multi threading, check the entry for - " + item.ItemName);
            break;
          case EnIDTypes.itExtSim:
            throw new Exception("Currently there are no External Sim properties that need to be modified for multi threading, check the entry for - " + item.ItemName);
            break;
          default:
            throw new ArgumentOutOfRangeException(nameof(EnIDTypes), item.ItemType, null);
        }

      }
    }
//The following code sections are for constructing a model through code
      
    public void AutoItemsForNewComponent(string compName, 
                                         string desc, 
                                         List<EnFailType> failTypes, 
                                         double runFailure, 
                                         List<State> startStates, 
                                         List<State> turnOffStates, 
                                         double demandFailure = 0.0, 
                                         string sim3DComp = "")
    {
      EvalDiagram addComp = new EvalDiagram(compName);
      addComp.desc = desc;
      allDiagrams.Add(addComp);

      //Action addAct;
      //Event addEv;

      //all items going to have active state and failed state
      State standbyState = new State(compName + "_Standby", EnStateType.stStart, addComp, -1);
      State activeState = new State(compName + "_Active", EnStateType.stStandard, addComp, 1);
      State failedState = new State(compName + "_Failed", EnStateType.stStandard, addComp, 0);
      allStates.Add(standbyState);
      allStates.Add(activeState);
      allStates.Add(failedState);

      //add event for a demand 
      StateCngEvent demandEv;
      demandEv = new StateCngEvent(compName + "_Demand", true, false);
      

      //add all the start states to the related items
      if (startStates != null)
        demandEv.AddRelatedItems(startStates.Select(c => c.id).ToList());
      allEvents.Add(demandEv);

      //add action to move from off to on or failed for the demand
      TransitionAct demandAct;
      if (failTypes.Contains(EnFailType.ftFailToStart))
      {
        demandAct = new TransitionAct("Goto_" + compName + "_ActOrFail");
        //setup the probability of failure on demand
        demandAct.AddToState(failedState, demandFailure);
        demandAct.AddToState(activeState);
      }
      else
      {
        demandAct = new TransitionAct("Goto_" + compName + "_Active");
        //add the action to move to the active state automatically on start request when no fails to start.
        demandAct.AddToState(activeState);
      }
      allActions.Add(demandAct);
      //add the events and movement to the standbyState
      standbyState.AddEvent(demandEv, true, demandAct);

      //add event for a shutoff request 
      StateCngEvent offEv = new StateCngEvent(compName + "_Stop", false);
      if (turnOffStates != null)
        offEv.AddRelatedItems(turnOffStates.Select(c => c.id).ToList());
      allEvents.Add(offEv);

      //add action to move from off to on or failed for the demand
      TransitionAct offAct = new TransitionAct("Goto_" + compName + "_Off");
      offAct.AddToState(standbyState);
      allActions.Add(offAct);

      //add the Events and movement back to the standby state
      activeState.AddEvent(offEv, true, offAct);
      failedState.AddEvent(offEv, true, offAct);


      if (failTypes.Contains(EnFailType.ftFailToRun) || (sim3DComp != "")) //add the fail to run links
      {
        //add transition leading from active to failed for the event above
        TransitionAct failAct = new TransitionAct("Goto_" + compName + "_Failed");
        failAct.AddToState(failedState);
        allActions.Add(failAct);

        if (failTypes.Contains(EnFailType.ftFailToRun))
        {
          //add event leading from active to failed 
          FailProbEvent failEv = new FailProbEvent(compName + "_FR", runFailure, Globals.HourTimeSpan, Globals.DayTimeSpan);
          allEvents.Add(failEv);        

          activeState.AddEvent(failEv, true, failAct);
        }

        if (sim3DComp != "")
        {
          Sim3DVariable simVar = (Sim3DVariable)this.allVariables.FindByName(sim3DComp);
          ExtSimEv sim3DEvent = new ExtSimEv(sim3DComp, "return true;", null, simVar, SimEventType.etCompEv);
          //sim3DEvent.AddRelatedItem(simVar.id);
          allEvents.Add(sim3DEvent);
          activeState.AddEvent(sim3DEvent, true, failAct);
        }
      }
    }



    public void AutoItemsForNewComponent(string compName,
                                         string desc,
                                         string[] demandNames,
                                         double[] demandFailProbs,
                                         SimVariable[] demandFailVars,
                                         string[] rateNames,
                                         double[] runningFailRates,
                                         List<State> startStates,
                                         List<State> turnOffStates,
                                         string sim3DComp = "",
                                         bool sepFailStates = false)
    {
      if (demandNames.Count() != demandFailProbs.Count())
        throw new Exception("Not equal Demand names and prob list");

      if (rateNames.Count() != runningFailRates.Count())
        throw new Exception("Not equal Demand names and prob list");

      EvalDiagram addComp = new EvalDiagram(compName);
      addComp.desc = desc;
      allDiagrams.Add(addComp);

      //Action addAct;
      //Event addEv;

      //all items going to have active state and failed state
      State standbyState = new State(compName + "_Standby", EnStateType.stStart, addComp, -1);
      State activeState = new State(compName + "_Active", EnStateType.stStandard, addComp, 1);
      allStates.Add(standbyState);
      allStates.Add(activeState);
      List<State> failStates = new List<State>();

      State failedState = null;
      if (!sepFailStates)
      {
        failedState = new State(compName + "_Failed", EnStateType.stStandard, addComp, 0);
        allStates.Add(failedState);
        failStates.Add(failedState);
      }
      

      //add event for a demand 
      StateCngEvent DemandEv;
      DemandEv = new StateCngEvent(compName + "_Demand", true, false);


      //add all the start states to the related items
      if (startStates != null)
        DemandEv.AddRelatedItems(startStates.Select(c => c.id).ToList());
      allEvents.Add(DemandEv);

      //add action to move from off to on or failed for the demand
      TransitionAct demandAct = new TransitionAct("From_" + compName + "_Demand");
      if (demandFailProbs.Count() > 0)
      {
        for (int i = 0; i < demandFailProbs.Count(); ++i)
        {
          if (sepFailStates)
          {
            failedState = new State(compName + "_Failed" + demandNames[i], EnStateType.stStandard, addComp, 0);
            allStates.Add(failedState);
            failStates.Add(failedState);
          }

          //setup the probability of failure on demand
          //TODO : Add the demandNames[i] somehow to the path data when moving to the failed state.
          if ((demandFailVars != null) && (demandFailVars.Count() > 0) && (demandFailVars[i] != null))
            demandAct.AddToState(failedState, demandFailVars[i], demandNames[i]);
          else
            demandAct.AddToState(failedState, demandFailProbs[i], demandNames[i]);
        }

        demandAct.AddToState(activeState);
        allActions.Add(demandAct);
        //add the events and movement to the standbyState
        standbyState.AddEvent(DemandEv, true, demandAct);
      }
      else
      {
        //add the action to move to the active state automatically on start request when no fails to start.
        demandAct.AddToState(activeState);
        allActions.Add(demandAct);
        //add the events and movement to the standbyState
        standbyState.AddEvent(DemandEv, true, demandAct);
      }

      //add event for a shutoff request 
      StateCngEvent offEv = new StateCngEvent(compName + "_Stop", false);
      if (turnOffStates != null)
        offEv.AddRelatedItems(turnOffStates.Select(c => c.id).ToList());
      allEvents.Add(offEv);

      //add action to move from off to on or failed for the demand
      TransitionAct offAct = new TransitionAct("Goto_" + compName + "_Off");
      offAct.AddToState(standbyState);
      allActions.Add(offAct);

      //add the Events and movement back to the standby state
      activeState.AddEvent(offEv, true, offAct);
      foreach(State curSt in failStates)
        curSt.AddEvent(offEv, true, offAct);


      if ((runningFailRates.Count() > 0) || ((sim3DComp != null) && (sim3DComp != ""))) //add the fail to run links
      {
        //add transition leading from active to failed for the event above
        //TransitionAct failAct = new TransitionAct("Goto_" + compName + "_Failed");
        //failAct.AddToState(failedState);
        //allActions.Add(failAct);

        for (int i = 0; i < runningFailRates.Count(); ++i)
        {
          if (sepFailStates)
          {
            failedState = new State(compName + "_Failed" + rateNames[i], EnStateType.stStandard, addComp, 0);
            allStates.Add(failedState);
            failStates.Add(failedState);
          }

          TransitionAct failAct = new TransitionAct("Goto_" + compName + "_Had_" +rateNames[i] + "_Failure");
          failAct.AddToState(failedState);
          allActions.Add(failAct);

          //add event leading from active to failed 
          FailProbEvent failEv = new FailProbEvent(compName + rateNames[i], runningFailRates[i], Globals.HourTimeSpan, Globals.DayTimeSpan);
          allEvents.Add(failEv);

          activeState.AddEvent(failEv, true, failAct);
        }

        if ((sim3DComp != null)&&(sim3DComp != ""))
        {
          if (sepFailStates)
          {
            failedState = new State(compName + "_Failed_3D", EnStateType.stStandard, addComp, 0);
            allStates.Add(failedState);
            failStates.Add(failedState);
          }

          TransitionAct failAct = new TransitionAct("Goto_" + compName + "_Had_3D" + "_Failure");
          failAct.AddToState(failedState);
          allActions.Add(failAct);

          Sim3DVariable simVar = (Sim3DVariable)this.allVariables.FindByName(sim3DComp);
          VariableList varList = new VariableList();
          varList.Add(simVar);
          ExtSimEv sim3DEvent = new ExtSimEv(sim3DComp, "if (" + simVar.name + " > 0) return true; else return false;", varList, simVar, SimEventType.etCompEv) ;
          //sim3DEvent.AddRelatedItem(simVar.id);
          allEvents.Add(sim3DEvent);
          activeState.AddEvent(sim3DEvent, true, failAct);
        }
      }
    }

    public void AutoItemsForNewComponent(string compName,
                                           string desc,
                                           string[] demandNames,
                                           double[] demandFailProbs,
                                           SimVariable[] demandFailVars,
                                           string[] rateNames,
                                           double[] runningFailRates,
                                           string[] startStates,
                                           string[] turnOffStates,
                                           string sim3DComp = "",
                                           bool sepFailStates = false,
                                           EmraldModel refLookup = null) //only have this not null if trying to get the JSON for this.
    {
      if (refLookup == null)
        refLookup = this;

      if (demandNames.Count() != demandFailProbs.Count())
        throw new Exception("Not equal Demand names and prob list");

      if (rateNames.Count() != runningFailRates.Count())
        throw new Exception("Not equal Demand names and prob list");

      EvalDiagram addComp = new EvalDiagram(compName);
      addComp.desc = desc;
      allDiagrams.Add(addComp);

      //Action addAct;
      //Event addEv;

      //all items going to have active state and failed state
      State standbyState = new State(compName + "_Standby", EnStateType.stStandard, addComp, -1);
      State activeState = new State(compName + "_Active", EnStateType.stStandard, addComp, 1);
      allStates.Add(standbyState);
      allStates.Add(activeState);
      List<State> failStates = new List<State>();

      State failedState = null;
      if (!sepFailStates)
      {
        failedState = new State(compName + "_Failed", EnStateType.stStandard, addComp, 0);
        allStates.Add(failedState);
        failStates.Add(failedState);
      }

      //add event for a demand 
      TransitionAct gotoDemandEv = new TransitionAct("Start_" + compName + "_Demand");
      gotoDemandEv.AddToState(standbyState);
      allActions.Add(gotoDemandEv);
      //add all the start states to the related items
      foreach (string sName in startStates)
      {
        State stState = refLookup.allStates.FindByName(sName);
        if (stState != null)
        {
          stState.AddImmediateAction(gotoDemandEv);
        }
        else
          throw new Exception("Failed to find start system State named " + stState);
      }


      //add action to move from off to on or failed for the demand
      TransitionAct demandAct = new TransitionAct("From_" + compName + "_Demand");
      NowTimerEvent demandEv = new NowTimerEvent(compName + "_Demand");
      if (demandFailProbs.Count() > 0)
      {
        for (int i = 0; i < demandFailProbs.Count(); ++i)
        {
          if (sepFailStates)
          {
            failedState = new State(compName + "_Failed" + demandNames[i], EnStateType.stStandard, addComp, 0);
            allStates.Add(failedState);
            failStates.Add(failedState);
          }

          //setup the probability of failure on demand
          //TODO : Add the demandNames[i] somehow to the path data when moving to the failed state.
          if ((demandFailVars != null) && (demandFailVars.Count() > 0) && (demandFailVars[i] != null))
            demandAct.AddToState(failedState, demandFailVars[i], demandNames[i]);
          else
            demandAct.AddToState(failedState, demandFailProbs[i], demandNames[i]);
        }

        demandAct.AddToState(activeState);
        allActions.Add(demandAct);
        //add the events and movement to the standbyState
        standbyState.AddEvent(demandEv, true, demandAct);
        //standbyState.AddImmediateAction(demandAct);
      }
      else
      {
        //add the action to move to the active state automatically on start request when no fails to start.
        demandAct.AddToState(activeState);
        allActions.Add(demandAct);
        //add the events and movement to the standbyState
        standbyState.AddEvent(demandEv, true, demandAct);
        //standbyState.AddImmediateAction(demandAct);
      }

      //add event for a shutoff request 
      StateCngEvent offEv = new StateCngEvent(compName + "_Stop", false);
      foreach (string sName in turnOffStates)
      {
        State endState = refLookup.allStates.FindByName(sName);
        if (endState != null)
          offEv.AddRelatedItem(endState.id);
      }
      allEvents.Add(offEv);

      //add action to move from off to on or failed for the demand
      TransitionAct offAct = new TransitionAct("Goto_" + compName + "_Off");
      offAct.AddToState(standbyState);
      allActions.Add(offAct);

      //add the Events and movement back to the standby state
      activeState.AddEvent(offEv, true, offAct);
      foreach (State curSt in failStates)
        curSt.AddEvent(offEv, true, offAct);


      if ((runningFailRates.Count() > 0) || ((sim3DComp != null) && (sim3DComp != ""))) //add the fail to run links
      {
        //add transition leading from active to failed for the event above
        //TransitionAct failAct = new TransitionAct("Goto_" + compName + "_Failed");
        //failAct.AddToState(failedState);
        //allActions.Add(failAct);

        for (int i = 0; i < runningFailRates.Count(); ++i)
        {
          if (sepFailStates)
          {
            failedState = new State(compName + "_Failed" + rateNames[i], EnStateType.stStandard, addComp, 0);
            allStates.Add(failedState);
            failStates.Add(failedState);
          }

          TransitionAct failAct = new TransitionAct("Goto_" + compName + "_Had_" + rateNames[i] + "_Failure");
          failAct.AddToState(failedState);
          allActions.Add(failAct);

          //add event leading from active to failed 
          FailProbEvent failEv = new FailProbEvent(compName + rateNames[i], runningFailRates[i], Globals.HourTimeSpan, Globals.DayTimeSpan);
          allEvents.Add(failEv);

          activeState.AddEvent(failEv, true, failAct);
        }

        if ((sim3DComp != null) && (sim3DComp != ""))
        {
          if (sepFailStates)
          {
            failedState = new State(compName + "_Failed_3D", EnStateType.stStandard, addComp, 0);
            allStates.Add(failedState);
            failStates.Add(failedState);
          }

          TransitionAct failAct = new TransitionAct("Goto_" + compName + "_Had_3D" + "_Failure");
          failAct.AddToState(failedState);
          allActions.Add(failAct);

          Sim3DVariable simVar = (Sim3DVariable)refLookup.allVariables.FindByName(sim3DComp);
          VariableList varList = new VariableList();
          varList.Add(simVar);

          ExtSimEv sim3DEvent = (ExtSimEv)allEvents.FindByName(sim3DComp, false);
          if (sim3DEvent == null)
          {
            sim3DEvent = new ExtSimEv(sim3DComp, "if (" + simVar.name + " > 0) return true; else return false;", varList, simVar, SimEventType.etCompEv);
            allEvents.Add(sim3DEvent);
          }
          activeState.AddEvent(sim3DEvent, true, failAct);
        }
      }
    }

    public void AutoItemsForPipeFail(string compName,
                                      string desc,
                                      string[] demandNames,
                                      SimVariable[] demandFailVars,
                                      string[] setVarsIf,
                                      string[] setToVals,
                                      string[] startStates,
                                      string[] turnOffStates)
    {
      if ((demandNames.Count() != demandFailVars.Count()) || (demandNames.Count() != setVarsIf.Count()) || (demandNames.Count() != setToVals.Count()))
        throw new Exception("Not equal Demand names and lists");


      EvalDiagram addComp = new EvalDiagram(compName);
      addComp.desc = desc;
      allDiagrams.Add(addComp);

      //Action addAct;
      //Event addEv;

      //all items going to have active state and failed state
      State standbyState = new State(compName + "_Standby", EnStateType.stStart, addComp, -1);
      State activeState = new State(compName + "_Active", EnStateType.stStandard, addComp, 1);
      allStates.Add(standbyState);
      allStates.Add(activeState);
      List<State> failStates = new List<State>();

      State failedState = new State(compName + "_Failed", EnStateType.stStandard, addComp, 0);
      allStates.Add(failedState);
      failStates.Add(failedState);

      //add event for a demand 
      StateCngEvent demandEv;
      demandEv = new StateCngEvent(compName + "_Demand", true, false);


      //add all the start states to the related items
      foreach (string sName in startStates)
      {
        State stState = this.allStates.FindByName(sName);
        if (stState != null)
          demandEv.AddRelatedItem(stState.id);
      }
      allEvents.Add(demandEv);

      TransitionAct toFailedAct = new TransitionAct("_Goto_" + compName + "_Failed");
      NowTimerEvent nowEv = new NowTimerEvent(compName + "_Failed");
      toFailedAct.AddToState(failedState);
      allActions.Add(toFailedAct);

      //add action to move from off to on or failed for the demand
      TransitionAct demandAct = new TransitionAct("From_" + compName + "_Demand");

      for (int i = 0; i < demandFailVars.Count(); ++i)
      {
        VarValueAct setVarVal = new VarValueAct("_Set_" + compName + "_Demand_val" + i.ToString(), allVariables.FindByName(setVarsIf[i]),
                              setToVals[i], typeof(double), null);
        allActions.Add(setVarVal);

        State tempState = new State(compName + "_Temp" + demandNames[i], EnStateType.stStandard, addComp, 0); //"Joint_3_Temp_SIL1"
        allStates.Add(tempState);
        tempState.AddImmediateAction(setVarVal);
        //tempState.AddImmediateAction(toFailedAct);
        tempState.AddEvent(nowEv, true, toFailedAct);

        failStates.Add(tempState);

        demandAct.AddToState(tempState, demandFailVars[i], demandNames[i]);
      }

      demandAct.AddToState(activeState, -1, "No joint Failure");
      allActions.Add(demandAct);
      //add the events and movement to the standbyState
      standbyState.AddEvent(demandEv, true, demandAct);



      //add event for a shutoff request 
      StateCngEvent offEv = new StateCngEvent(compName + "_Stop", false);
      foreach (string sName in turnOffStates)
      {
        State endState = this.allStates.FindByName(sName);
        if (endState != null)
          offEv.AddRelatedItem(endState.id);
      }
      allEvents.Add(offEv);

      //add action to move from off to on or failed for the demand
      TransitionAct offAct = new TransitionAct("_Goto_" + compName + "_Off");
      offAct.AddToState(standbyState);
      allActions.Add(offAct);

      //add the Events and movement back to the standby state
      activeState.AddEvent(offEv, true, offAct);
      foreach (State curSt in failStates)
        curSt.AddEvent(offEv, true, offAct);
    }


    //returns the active state
    public State AutoItemsForSystemGroup(string sysName, string desc, LogicNode logicTop, List<State> startSysStates, List<State> stopSysStates)
    {
      EvalDiagram addComp = new EvalDiagram(sysName);
      addComp.desc = desc;
      allDiagrams.Add(addComp);

      //all items going to have active state and failed state
      State activeState = new State(sysName + "_Active", EnStateType.stStandard, addComp, 1);
      State failedState = new State(sysName + "_Failed", EnStateType.stStandard, addComp, 0);
      allStates.Add(activeState);
      allStates.Add(failedState);
      
      //add event to move from active to failed using the logicTop 
      ComponentLogicEvent evalEvent = new ComponentLogicEvent(sysName + "_Eval", logicTop, false);
      allEvents.Add(evalEvent);

      //add event to exit this system evaluation 
      StateCngEvent stopEvent = new StateCngEvent(sysName + "_Stop", true, false, stopSysStates.Select(i=> i.id).ToList());
      allEvents.Add(stopEvent);

      //add the goto action to start this state from the given startSysStates
      TransitionAct gotoAct = new TransitionAct("_Goto_" + sysName + "_Active");
      gotoAct.AddToState(activeState);
      allActions.Add(gotoAct);
      foreach (State stState in startSysStates)
      {
        stState.AddImmediateAction(gotoAct);
      }
      

      //add action to move from off to on or failed for the demand
      TransitionAct failAct = new TransitionAct("_Goto_" + sysName + "_Failed");
      failAct.AddToState(failedState);
      allActions.Add(failAct);


      //add the events to the states
      activeState.AddEvent(evalEvent, true, failAct);
      activeState.AddEvent(stopEvent, true, null);

      failedState.AddEvent(stopEvent, true, null);

      allLogicNodes.AddRecursive(logicTop);

      
      return activeState;      
    }

    public State AutoItemsForSystemGroup(string sysName, string desc, LogicNode logicTop, string[] startSysStates, string[] stopSysStates)
    {
      EvalDiagram addComp = new EvalDiagram(sysName);
      addComp.desc = desc;
      allDiagrams.Add(addComp);

      //all items going to have active state and failed state
      State activeState = new State(sysName + "_Active", EnStateType.stStandard, addComp, 1);
      State failedState = new State(sysName + "_Failed", EnStateType.stStandard, addComp, 0);
      allStates.Add(activeState);
      allStates.Add(failedState);

      //add event to move from active to failed using the logicTop 
      ComponentLogicEvent evalEvent = new ComponentLogicEvent(sysName + "_Eval", logicTop, false);
      allEvents.Add(evalEvent);

      //add event to exit this system evaluation 
      List<int> ids = new List<int>();
      foreach (string sName in stopSysStates)
      {
        State stState = this.allStates.FindByName(sName);
        if (stState != null)
          ids.Add(stState.id);
      }
      StateCngEvent stopEvent = new StateCngEvent(sysName + "_Stop", true, false, ids);
      allEvents.Add(stopEvent);

      //add the goto action to start this state from the given startSysStates
      TransitionAct gotoAct = new TransitionAct("_Goto_" + sysName + "_Active");
      gotoAct.AddToState(activeState);
      allActions.Add(gotoAct);
      foreach (string sName in startSysStates)
      {
        State stState = this.allStates.FindByName(sName);
        if (stState != null)
          stState.AddImmediateAction(gotoAct);
      }

      //add action to move from off to on or failed for the demand
      TransitionAct failAct = new TransitionAct("_Goto_" + sysName + "_Failed");
      failAct.AddToState(failedState);
      allActions.Add(failAct);


      //add the events to the states
      activeState.AddEvent(evalEvent, true, failAct);
      activeState.AddEvent(stopEvent, true, null);

      failedState.AddEvent(stopEvent, true, null);

      allLogicNodes.AddRecursive(logicTop);


      return activeState;
    }

   
   
  }


}
