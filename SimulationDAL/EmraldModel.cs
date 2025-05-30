// Copyright 2021 Battelle Energy Alliance

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
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
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
    private int _threadNumber = 0;
    public const double SCHEMA_VERSION = 3.0;
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
    public MultiThreadInfo multiThreadInfo = null;

    public string fileName { get; set; } = "";
    public string rootPath { get; set; } = "";
    public string modelTxt { get; set; } = "";

    //public int dbID = 0;
    public int curRunIdx = 0; //current run index.
    public int totRunsReq = 0; //total runs requested
    public bool multiThreadReady { get { return _multiThreadReady; } }
    public int threadNum { get { return _threadNumber; } }
    
    //public Dictionary<int, Formula> allFormulas = new Dictionary<int, Formula>();
    //public Diagram curDiagram { get { return _Diagram; } set { _Diagram = value; } }

    public EmraldModel() {}

    public EmraldModel(String name, String desc)
    {
      this.name = name;
      this.desc = desc;
      this._id = 0;
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
          return upgraded;
        }
        catch (Exception ex)
        {
          throw new Exception("Failed to Upgrade old model to v" + SCHEMA_VERSION + ex.Message);
        }
      }
      else if(jsonObj.emraldVersion > SCHEMA_VERSION)
      {
        throw new Exception("EMRALD solver version to old to solve this model. Upgrade to v" + jsonObj.emraldVersion);
      }
     
      return jsonModel;
    }

    public bool DeserializeJSON(string jsonModel, string modelPath, string fileName) 
    {
      SingleNextIDs.Instance.Reset();
      this.rootPath = modelPath;
      this.modelTxt = jsonModel;
      this.fileName = fileName;
      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
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
      return DeserializeDerived(jsonObj, true, this, false);
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      // Deserialize multiThreadInfo if present
      if (dynObj.multiThreadInfo != null)
      {
        this.multiThreadInfo = JsonConvert.DeserializeObject<MultiThreadInfo>(Convert.ToString(dynObj.multiThreadInfo));
      }
      else
      {
        this.multiThreadInfo = new MultiThreadInfo();
      }

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
      var ModelRefsList = new List<ScanForReturnItem>();

      //Return any issues that actions could have with reference when multithreading
      ModelRefsList.AddRange(allDiagrams.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allStates.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allEvents.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allActions.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allExtSims.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allVariables.ScanFor(ScanForTypes.sfMultiThreadIssues, this));
      ModelRefsList.AddRange(allLogicNodes.ScanFor(ScanForTypes.sfMultiThreadIssues, this));

      //go through each of the found items and look for hem in the multiThreadInfo or put in a new list.
      var notAccountedFor = new List<String>();
      Dictionary<string, ToCopyForRef> curMutiThreadItems = new Dictionary<string, ToCopyForRef>();
      foreach (var item in multiThreadInfo.ToCopyForRefs)
      {
        curMutiThreadItems.Add(item.ItemName, item);
      }

      foreach (var modelRef in ModelRefsList)
      {
        var mPathRef = (modelRef as ScanForRefsItem);
        if (curMutiThreadItems.ContainsKey(modelRef.itemName))
        {
          var curI = curMutiThreadItems[modelRef.itemName];
          if(curI.RelPath == "") //this should have been added before if it exists.
          {
            throw new Exception("missing RelPath for " + modelRef.itemName);
          }

          if (curI.RefPath != mPathRef.Path) //this should have been added before if it exists.
          {
            // "missing RerPath for " + modelRef.itemName);
            curI.RefPath = mPathRef.Path;
            notAccountedFor.Add(curI.ItemName);
          }
        }
        else
        {
          var addI = new ToCopyForRef(mPathRef.itemName, mPathRef.itemType, mPathRef.Path, null, "");

          if (!Path.IsPathRooted(mPathRef.Path) && (mPathRef.Path[0] == '.'))
          {
            addI.RelPath = mPathRef.Path;
            addI.ToCopy.Add(Path.GetFullPath(Path.Combine(rootPath, mPathRef.Path))); //combine and normalize the path.
          }

          multiThreadInfo.ToCopyForRefs.Add(addI);
          notAccountedFor.Add(addI.ItemName);

        }
      }

      //put the multiTheadInfo back onto the model JSON string
      dynamic jsonObj = JsonConvert.DeserializeObject(this.modelTxt);
      string multiThreadInfoJson = JsonConvert.SerializeObject(multiThreadInfo);
      JToken multiThreadInfoToken = JToken.Parse(multiThreadInfoJson);

      // Check if the "multiThreadInfo" property exists
      if (jsonObj.multiThreadInfo != null)
      {
        // Replace the existing value
        jsonObj.multiThreadInfo = multiThreadInfoToken;
      }
      else
      {
        // Add the new property and value
        ((JObject)jsonObj).Add("multiThreadInfo", multiThreadInfoToken);
      }

      // Serialize the modified object back into a JSON string
      this.modelTxt = JsonConvert.SerializeObject(jsonObj, Formatting.Indented);

      return notAccountedFor;
    }

   
    public bool ApplyMultiThreadChangs(int threadNum)
    {
      if (!this.multiThreadReady)
      {
        
        this._threadNumber = threadNum;

        this.rootPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), @"EMRALD\" + this.fileName + "_T" + ((int)_threadNumber).ToString());
        // Ensure the directory exists and is empty
        if (Directory.Exists(this.rootPath))
        {
          Directory.Delete(this.rootPath, true);
        }
        Directory.CreateDirectory(this.rootPath);

        if (threadNum != 0) //if not the first thread then just copy the first one's files.
        {
          string firstRootPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), @"EMRALD\" + this.fileName + "_T0");
          CommonFunctions.CopyDirectory(firstRootPath, this.rootPath, true);

        }

        foreach (var item in multiThreadInfo.ToCopyForRefs)
        {
          if ((threadNum == 0) && (item.ToCopy.Count > 0)) //if the first thread then make sure to figure out all the files needed.
          {
            string commonFolder = CommonFunctions.FindClosestParentFolder(item.ToCopy);
            foreach (var copyItem in item.ToCopy)
            {
              //copy the items needed
              if (File.Exists(copyItem))
              {
                string remainingPath = CommonFunctions.GetRemainingPath(commonFolder, copyItem);
                string copyTo = Path.GetFullPath(Path.Combine(rootPath, remainingPath));
                File.Copy(copyItem, copyTo);
              }
            }
          }


          //update items so that they will work with multi threading.
          var iType = item.GetEnumType();
          switch (iType)
          {
            case EnIDTypes.itVar:
              //only DocVariable
              var simItem = this.allVariables.FindByName(item.ItemName);
              if (!(simItem is DocVariable))
                throw new Exception("Broken path reference edit " + item.ItemName + " is not a document variable.");

              (simItem as DocVariable).UpdatePathRefs(item.RefPath, item.RelPath);
              break;
            case EnIDTypes.itComp:
              Console.WriteLine("Handling itComp");
              break;
            case EnIDTypes.itState:
              Console.WriteLine("Handling itState");
              break;
            case EnIDTypes.itEvent:
              Console.WriteLine("Handling itEvent");
              break;
            case EnIDTypes.itAction:
              Console.WriteLine("Handling itAction");
              break;
            case EnIDTypes.itTreeNode:
              Console.WriteLine("Handling itTreeNode");
              break;
            case EnIDTypes.itTimer:
              Console.WriteLine("Handling itTimer");
              break;
            case EnIDTypes.itDiagram:
              Console.WriteLine("Handling itDiagram");
              break;
            case EnIDTypes.itExtSim:
              Console.WriteLine("Handling itExtSim");
              break;
            default:
              throw new ArgumentOutOfRangeException(nameof(EnIDTypes), iType, null);
          }

        }
      }
      return true;
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
