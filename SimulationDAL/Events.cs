// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using MyStuff.Collections;
using ScriptEngineNS;
using System.Xml;
using System.Collections.ObjectModel;
using MathNet.Numerics.Distributions;
using MessageDefLib;

namespace SimulationDAL
{

  public abstract class Event : BaseObjInfo
  {
    protected List<int> _relatedIDs = new List<int>(); //IDs of items used to evaluate this event. 
    public bool mainItem = false;
    //protected virtual EnModifiableTypes GetModType() { return EnModifiableTypes.mtNone; }

    public ReadOnlyCollection<int> relatedIDs { get { return _relatedIDs.AsReadOnly(); } }
    //public EnModifiableTypes modType { get { return GetModType(); } }

    protected abstract EnEventType GetEvType();
    public EnEventType evType { get { return GetEvType(); } }

    public Event(string inName, bool inMainItem = false)
    {
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itEvent);
      this.name = inName;
      this.mainItem = inMainItem;
    }

    public void AddRelatedItem(int itemID)
    {
      if (!this._relatedIDs.Contains(itemID))
      {
        this._relatedIDs.Add(itemID);
      }
    }

    public void AddRelatedItems(List<int> itemIDs)
    {
      foreach (int id in itemIDs)
        AddRelatedItem(id);
    }

    public abstract string GetDerivedJSON(EmraldModel lists);

    public override string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"Event\": {" + Environment.NewLine + base.GetJSON(false, lists);

      retStr = retStr + "," + Environment.NewLine;
      retStr = retStr + "\"mainItem\": " + this.mainItem.ToString().ToLower() + "," + Environment.NewLine;
      retStr = retStr + "\"evType\": \"" + this.evType.ToString() + "\"," + Environment.NewLine;
      retStr += GetDerivedJSON(lists);

      retStr = retStr + Environment.NewLine + "}";

      if (incBrackets)
      {
        retStr = retStr + Environment.NewLine + "}";
      }

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }


      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      if (dynObj.mainItem != null)
      {
        mainItem = Convert.ToBoolean(dynObj.mainItem);
      }

      return true;
    }

    public virtual void LookupRelatedItems(EmraldModel all, EmraldModel addToList)
    {
      if (addToList.allEvents.ContainsKey(this.id))
      {
        return;
      }

      addToList.allEvents.Add(this, false);
    }
  }

  public abstract class CondBasedEvent : Event
  {
    public CondBasedEvent(string inName)
      : base(inName) { }

    public abstract bool EventTriggered(MyBitArray curStates, object otherData, TimeSpan curSimTime, TimeSpan start3DTime, TimeSpan nextEvTime);

    //public override bool DeleteFromDB(LookupLists lists) { return base.DeleteFromDB(lists); }
  }

  public class StateCngEvent : CondBasedEvent //etStateCng
  {
    //protected override EnModifiableTypes GetModType() { return EnModifiableTypes.mtState; }
    public bool ifInState = true;
    public bool allItems = false;

    protected override EnEventType GetEvType() { return EnEventType.etStateCng; }

    public StateCngEvent() : base("") { }

    public StateCngEvent(string inName, bool inIfInState, bool inAllItems = true, List<int> inStates = null)
      : base(inName)
    {
      this.ifInState = inIfInState;
      this.allItems = inAllItems;

      if (inStates != null)
      {
        this.AddRelatedItems(inStates);
      }
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {

      string retStr = "\"ifInState\":\"" + this.ifInState.ToString().ToLower() + "\"," + Environment.NewLine +
                      "\"allItems\":\"" + this.allItems.ToString().ToLower() + "\"";

      retStr = retStr + "," + Environment.NewLine + "\"triggerStates\": [";


      for (int i = 0; i < this._relatedIDs.Count; ++i)
      {
        retStr = retStr + Environment.NewLine + "\"" + lists.allStates[this._relatedIDs[i]].name + "\"";
        if (i < this._relatedIDs.Count - 1)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
      }
      retStr = retStr + "]";

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allEvents.Add(this, false);

      if (EnEventType.etStateCng != (EnEventType)Enum.Parse(typeof(EnEventType), (string)dynObj.evType, true))
        throw new Exception("event types do not match, cannot change the type once an item is created!");

      this.ifInState = Convert.ToBoolean(dynObj.ifInState);
      this.allItems = Convert.ToBoolean(dynObj.allItems);

      //Now Done in LoadOBjLinks()
      ////load the Trigger States.
      //if (dynObj.triggerStates != null)
      //{
      //  this.relatedIDs.Clear();
      //  foreach (dynamic stateName in dynObj.triggerStates)
      //  {
      //    State trigState = lists.allStates.FindByName(stateName);
      //    if (trigState == null)
      //    {
      //      throw new Exception("Could not find State - " + stateName + ", to add as a trigger state");
      //    }

      //    this.relatedIDs.Add(trigState.id);
      //  }
      //}

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      //load the Trigger States.
      if (dynObj.triggerStates != null)
      {
        this._relatedIDs.Clear();
        foreach (var stateName in dynObj.triggerStates)
        {
          State trigState = lists.allStates.FindByName((string)stateName);
          if (trigState == null)
          {
            throw new Exception("Could not find State - " + stateName + ", to add as a trigger state");
          }

          this._relatedIDs.Add(trigState.id);
        }
      }

      if (_relatedIDs.Count <= 0)
        throw new Exception(this.name + " is missing the State or States to evaluate for a change.");
      return true;
    }

    public override bool EventTriggered(MyBitArray curStates, object otherData, TimeSpan curSimTime, TimeSpan start3DTime, TimeSpan nextEvTime)
    {
      bool found = false;

      foreach (int i in _relatedIDs)
      {
        if ((curStates.Count > i) && (curStates[i])) //desired state is in current list
        {
          found = true;

          if (ifInState) //We are looking for an item in the list to trigger us       
          {
            if (!allItems) //only one item true needed.
              return true;
          }
          else //don't want the item in order to trigger us but we found it
          {
            if (allItems) //only one item needed to not trigger.
              return false;
          }
        }
        else //desired state is not in current list
        {
          if (ifInState) //We are looking for an item in the list to trigger us       
          {
            if (allItems) //must have all items for a trigger needed.
              return false;
          }
          else //don't want the item in order to trigger and we didn't find it
          {
            if (!allItems) //only one item needed trigger.
              return true;
          }
        }
      }

      if (ifInState)
        return found; //if we didn't kick out early then we went through all the items, as long we found is true then we got a match.
      else
        return !found; //if we didn't kick out early then we went through all the items, as long we found is false then we got a match.
    }

    public override void LookupRelatedItems(EmraldModel all, EmraldModel addToList)
    {
      if (addToList.allEvents.ContainsKey(this.id))
      {
        return;
      }

      addToList.allEvents.Add(this, false);

      //foreach (int id in this._relatedIDs)
      //{
      //  State curItem = all.allStates[this.relatedIDs[0]];
      //  curItem.LookupRelatedItems(all, addToList);
      //}
    }
  }


  public class ComponentLogicEvent : CondBasedEvent //etComponentLogic
  {
    //bool onSuccess;//true if our logic evaluation is looking for a true.
    public bool successSpace = true;
    private LogicNode logicTop = null;

    //protected override EnModifiableTypes GetModType() { return EnModifiableTypes.mtState; } //the modified items concerned about for component logic are states.

    protected override EnEventType GetEvType() { return EnEventType.etComponentLogic; }

    public ComponentLogicEvent() : base("") { }

    public ComponentLogicEvent(string inName, LogicNode inLogicTop, bool inSuccessSpace)
      : base(inName)
    {
      this.logicTop = inLogicTop;
      AutoAddRelatedComponents(logicTop);
      successSpace = inSuccessSpace;
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {

      string retStr = "\"onSuccess\":\"" + this.successSpace.ToString().ToLower() + "\"," + Environment.NewLine +
                      "\"logicTop\":" + "\"" + this.logicTop.name + "\"";
      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allEvents.Add(this, false);

      if (EnEventType.etComponentLogic != (EnEventType)Enum.Parse(typeof(EnEventType), (string)dynObj.evType, true))
        throw new Exception("event types do not match, cannot change the type once an item is created!");

      this.successSpace = (((string)dynObj.onSuccess).ToLower() == "true");

      //Now done in LoadObjLinks()
      //if ((dynObj.logicTop != null) || (dynObj.LogicTop == 0))
      //{
      //  this.logicTop = lists.allLogicNodes[dynObj.logicTop];
      //  AutoAddRelatedComponents(logicTop);
      //}

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      if ((dynObj.logicTop != null) || ((int)dynObj.LogicTop == 0))
      {
        this.logicTop = lists.allLogicNodes.FindByName((string)dynObj.logicTop);
        AutoAddRelatedComponents(logicTop);
      }
      return true;
    }

    public override bool EventTriggered(MyBitArray curStates, object otherData, TimeSpan curSimTime, TimeSpan start3DTime, TimeSpan nextEvTime)
    {
      bool evalRes = logicTop.Evaluate(curStates);

      if (!successSpace)
        return evalRes;
      else
        return !evalRes;
    }

    public void AutoAddRelatedComponents(LogicNode logicTop)
    {
      this.AddRelatedItems(logicTop.AllUsedStateIDs);
    }

    public override void LookupRelatedItems(EmraldModel all, EmraldModel addToList)
    {

      if (addToList.allEvents.ContainsKey(this.id))
      {
        return;
      }

      addToList.allEvents.Add(this, false);

      //if (logicTop != null)
      //{
      //  logicTop.LookupRelatedItems(all, addToList);
      //}
    }
  }

  public class EvalVarEvent : CondBasedEvent //etVarCond, et3dSimEv
  {
    public string sim3dID = null;
    public string compCode = "";
    protected bool compiled;
    protected ScriptEngine compiledComp;
    protected VariableList varList = null;
    protected string variable = "";
    //protected override EnModifiableTypes GetModType() { return EnModifiableTypes.mtVar; }

    //protected override EnEventType GetEvType() { return (variable == "") ? EnEventType.etVarCond : EnEventType.et3dSimEv; }

    public EvalVarEvent() : base("")
    {
      compiledComp = new ScriptEngine("EvalVar_" + this.name, ScriptEngine.Languages.CSharp);
    }

    public EvalVarEvent(string inName, string inCompCode, VariableList inVarList, Sim3DVariable sim3dVar)// = null)
      : base(inName)
    {
      this.compCode = inCompCode;
      this.compiled = false;
      this.varList = inVarList;
      if (inVarList != null)
        foreach (var curVar in inVarList)
        {
          this.AddRelatedItem(curVar.Value.id);
        }

      if (sim3dVar != null)
      {
        this.sim3dID = sim3dVar.sim3DNameId;
        this.AddRelatedItem(sim3dVar.id);
      }
      else
        this.sim3dID = null;

      compiledComp = new ScriptEngine("EvarVal_" + this.name, ScriptEngine.Languages.CSharp);
    }

    protected override EnEventType GetEvType() { return (variable == "") ? EnEventType.etVarCond : EnEventType.et3dSimEv; }

    public override string GetDerivedJSON(EmraldModel lists)
    {
      string compCodeStr = compCode.Replace("\n", "\\n").Replace("\r", "\\r");
      string codeHasVars = varList == null ? "False" : "True";
      string varNames = "";
            
      if (varList != null)
      {
        foreach(var i in varList.Values)
        {
          if(i.name!=variable)
          varNames += ", \"" + i.name + "\"";
        }
        varNames = varNames.TrimStart(',');
      }
      //varNames = string.Join(",", varList.Values);
      string retStr = null;

      if (sim3dID != null)
        retStr = retStr + "\"evType\": \"" + EnEventType.et3dSimEv.ToString() + "\"," + Environment.NewLine;
      else
        retStr = retStr + "\"evType\": \"" + EnEventType.etVarCond.ToString() + "\"," + Environment.NewLine;


      retStr = retStr + "\"varNames\": [" + varNames + "]," + Environment.NewLine;// +
      //                "\"code\":\"" + compCodeStr + "\"";

      if (sim3dID != null)// re-ordered list to match actual where the External Sim variable comes before code
        retStr = retStr + "," + Environment.NewLine + "\"sim3dID\":" + this.sim3dID;

      retStr = retStr + Environment.NewLine;

      retStr = retStr + "\"code\":\"" + compCodeStr + "\"";
      
      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allEvents.Add(this, false);

      if ((EnEventType.etVarCond != (EnEventType)Enum.Parse(typeof(EnEventType), (string)dynObj.evType, true)) &&
         (EnEventType.et3dSimEv != (EnEventType)Enum.Parse(typeof(EnEventType), (string)dynObj.evType, true)))
        throw new Exception("event types do not match, cannot change the type once an item is created!");

    //  this.evType = (EnEventType)Enum.Parse(typeof(EnEventType), (string)dynObj.evType, true);
      if (dynObj.sim3dID != null)
      {
        this.sim3dID = Convert.ToString(dynObj.sim3DId);

        if (dynObj.varNames == null)
          throw new Exception("Deserilaizing Event, missing varNames value for the 3D SimVar ");
      }

      if (dynObj.code == null)
      {
        throw new Exception("Deserilaizing Event, missing code");
      }

      compCode = (string)dynObj.code;

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      if (dynObj.varNames != null)
      {
        if (varList == null)
          varList = new VariableList();

     
      if (dynObj.varNames != null)
      {
        foreach (var varName in dynObj.varNames)
        {
          SimVariable curVar = lists.allVariables.FindByName((string)varName);
          if (curVar == null)
            throw new Exception("Failed to find variable - " + (string)varName);

          this.varList.Add(curVar);
          this.AddRelatedItem(curVar.id);
        }
      }
      //3D simulation var condition has a variable link
      if (dynObj.variable != null)
      {
        variable = (string)dynObj.variable;
        SimVariable curVar = lists.allVariables.FindByName((string)dynObj.variable);
        if (curVar == null)
          throw new Exception("Failed to find variable - " + dynObj.variable);
        this.varList.Add(curVar);
        this.AddRelatedItem(curVar.id);
      }
      return true;
    }



    public virtual bool CompileCompCode()
    {
      compiledComp.Code = compCode;

      if (this.sim3dID != null)
      {
        //add the TEventType as a constant //TODO is this still correct with the new XMPP message system
        foreach (SimEventType itemType in Enum.GetValues(typeof(SimEventType)))
        {
          compiledComp.AddConstant(itemType.ToString(), typeof(int), (int)itemType);
        }

        //add the variable for the 3D simulation TEventType for use in the code
        compiledComp.AddVariable("simEventType", typeof(int));

      }

      //add the Time and 3D Frame variables needed event if 
      compiledComp.AddVariable("CurTime", typeof(Double));
      compiledComp.AddVariable("ExtSimStartTime", typeof(double));
      compiledComp.AddVariable("NextEvTime", typeof(double));

      if (varList != null)
      {
        //add the user defined variables
        foreach (var varItem in varList)
        {
          if ((varItem.Value.name != "CurTime") &&
              (varItem.Value.name != "ExtSimStartTime") &&
              (varItem.Value.name != "NextEvTime"))
          {
            compiledComp.AddVariable(varItem.Value.name, varItem.Value.dType);
          }
        }
      }


      if (!compiledComp.Compile(typeof(bool)))
      {
        throw new Exception("failed to compile code - " + String.Join(Environment.NewLine, compiledComp.messages.ToArray()) + Environment.NewLine + compCode);
      }
      else
      {
        this.compiled = true;
      }

      return this.compiled;
    }

    public override bool EventTriggered(MyBitArray curStates, object otherData, TimeSpan curSimTime, TimeSpan start3DTime, TimeSpan nextEvTime)
    {
      if (!this.compiled)
      {
        if (!CompileCompCode())
          throw new Exception("Code failed compile, can not evaluate");
      }

      if ((this.sim3dID != null) && (otherData != null))
      {
        Dictionary<string, SimEventType> lastEvTypes = (Dictionary<string, SimEventType>)otherData;
        if (lastEvTypes.ContainsKey(this.sim3dID))
        {
          compiledComp.SetVariable("simEventType", typeof(int), (int)lastEvTypes[this.sim3dID]);
        }
      }

      compiledComp.SetVariable("CurTime", typeof(double), curSimTime.TotalHours);
      compiledComp.SetVariable("ExtSimStartTime", typeof(double), start3DTime.TotalHours);
      compiledComp.SetVariable("NextEvTime", typeof(double), nextEvTime.TotalHours);//NextEvTime

      if (varList != null) //assign the values to the variables if assigned
      {
        foreach (var varItem in varList)
        {
          compiledComp.SetVariable(varItem.Value.name, varItem.Value.dType, varItem.Value.value);
        }
      }
      bool result = false;

      try
      {
         result = compiledComp.EvaluateBool();
      }
      catch(Exception e)
      {
        throw new Exception("Event \"" + this.name + "\" - Failed to run code. error - " + e.Message);
      }

      return result;
    }

    public override void LookupRelatedItems(EmraldModel all, EmraldModel addToList)
    {

      if (addToList.allEvents.ContainsKey(this.id))
      {
        return;
      }

      addToList.allEvents.Add(this, false);

      //if (varList != null)
      //{
      //  foreach (SimVariable item in varList.Values)
      //  {
      //    item.LookupRelatedItems(all, addToList);
      //  }
      //}

      //SimVariable varItem = all.allVariables[this.relatedIDs[0]];
      //varItem.LookupRelatedItems(all, addToList);
    }
  }

  //public class Eval3DVarEvent : EvalEvent //et3dSimEv
  //{
  //  private int sim3dId;



  //  //public EvalEvent(int inID, EnEventType inEvType, string inCompCode, string inCompStyle) : base(inID, inEvType)
  //  public Eval3DVarEvent(string inName, int in3dId, string inCompCode, VariableList inVarList)
  //    : base(inName, inCompCode, inVarList)
  //  {
  //    this.sim3dId = in3dId;
  //  }

  //  public override bool CompileCompCode()
  //  {
  //    //add the TEventType as a constant
  //    foreach (T3DEventType itemType in Enum.GetValues(typeof(T3DEventType)))
  //    {
  //      compiledComp.AddConstant(itemType.ToString(), typeof(int), (int)itemType);
  //    }

  //    //add the variable for the 3D simulation TEventType for use in the code
  //    compiledComp.AddVariable("simEventType", typeof(int));


  //    return base.CompileCompCode();
  //  }

  //  public override bool EventTriggered(MyBitArray curStates, object otherData)
  //  {
  //    if (!this.compiled)
  //    {
  //      if (!CompileCompCode())
  //        throw new Exception("Code failed compile, can not evaluate");
  //    }

  //    if (otherData != null)
  //    {
  //      Dictionary<int, T3DEventType> lastEvTypes = (Dictionary<int, T3DEventType>)otherData;
  //      if (lastEvTypes.ContainsKey(this.sim3dId))
  //      {
  //        compiledComp.SetVariable("simEventType", typeof(int), (int)lastEvTypes[this.sim3dId]);
  //      }
  //    }

  //    return base.EventTriggered(curStates, otherData);
  //  }
  //}

  public abstract class TimeBasedEvent : Event
  {
    protected override EnEventType GetEvType() { return EnEventType.etTimer; }

    public TimeBasedEvent(string inName)
      : base(inName) { }

    public abstract TimeSpan NextTime();
  }

  public class TimerEvent : TimeBasedEvent //etTimer
  {
    public EnTimeRate timerVariableUnit = EnTimeRate.trHours;
    protected SimVariable timeVariable = null;
    public TimeSpan time = TimeSpan.FromTicks(0);

    public TimerEvent() : base("") { }

    public TimerEvent(string inName, TimeSpan inTime)
      : base(inName)
    {
      this.time = inTime;
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {
      string retStr = "";// "\"evType\": \"" + EnEventType.etTimer.ToString() + "\"," + Environment.NewLine;
      if (timeVariable == null)
      {
        retStr = retStr +
          "\"time\":\"" + XmlConvert.ToString(this.time) + "\"," + Environment.NewLine +
          "\"useVariable\": false";
      }
      else
      {
        retStr = retStr +
          "\"time\":\"" + timeVariable.name + "\"," + Environment.NewLine +
          "\"useVariable\": true, " + Environment.NewLine +
          "\"timeVariableUnit\":\"" + this.timerVariableUnit.ToString() + "\"," + Environment.NewLine;
      }

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allEvents.Add(this, false);

      if (EnEventType.etTimer != (EnEventType)Enum.Parse(typeof(EnEventType), (string)dynObj.evType, true))
        throw new Exception("event types do not match, cannot change the type once an item is created!");      

      if ((dynObj.useVariable != null) && (bool)dynObj.useVariable)
      {
        if(dynObj.timeVariableUnit == null)
          throw new Exception("No Time Unit 'timeVariable' defined for timer event using a variable.");
        try
        {
          this.timerVariableUnit = (EnTimeRate)Enum.Parse(typeof(EnTimeRate), (string)dynObj.timeVariableUnit, true);
        }
        catch
        {
          throw new Exception("Invalid Time Unit 'timeVariableUnit' defined use trDays, trHours, trMinutes, trSeconds.");
        }

      }   
      else
      {
        this.time = XmlConvert.ToTimeSpan((string)dynObj.time);
      }

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      if ((dynObj.useVariable != null) && (bool)dynObj.useVariable)
      {
        try
        {
          this.timeVariable = lists.allVariables.FindByName((string)dynObj.time); 
           
          //this.AddRelatedItem(curVar.id); //don't need to add to relatedItems, because it doesn't trigger the event and time is fixed once started 
        }
        catch
        {
          throw new Exception("Failed to find variable - " + (string)dynObj.time);
        }
      }
     
      return true;
    }

    public override TimeSpan NextTime()
    {
      if (this.timeVariable != null)
      {

        time = Globals.NumberToTimeSpan(timeVariable.dblValue, timerVariableUnit);
      }

      return (TimeSpan)time;
    }
  }

  public class NowTimerEvent : TimerEvent
  {
    public NowTimerEvent(string inName)
      : base(inName, Globals.NowTimeSpan) { }
  }

  //This is only used internally and not meant to be modeled. An immediate message needs an event to trigger the evaluation 
  public class ExtSimEvent : TimerEvent
  {
    public ExtSimEvent(string inName)
      : base(inName, Globals.NowTimeSpan) { }
  }

  public class FailProbEvent : TimeBasedEvent //etFailRate
  {
    //public TimeSpan timeRate { get { return _dbItem.dFailRateEv.lambdaTimeRate; } set { this.locOutOfSync = true; _dbItem.dFailRateEv.lambdaTimeRate = value; } }
    protected double _lambda = 0.0;
    //protected TimeSpan _compMissionTime { get { return _dbItem.dFailRateEv.missionTime; } set { this.locOutOfSync = true; _dbItem.dFailRateEv.missionTime = value; } }

    //protected TimeSpan _lambdaTimeRate;
    //protected double _lambda;
    //protected TimeSpan _compMissionTime;
    //protected FailProbEvType _failType;
    //public int FailureFuncID { get { return _FailureFuncID; } set { this.linksModified = true; _FailureFuncID = value; } }
    public TimeSpan timeRate = TimeSpan.FromDays(365.25);
    public TimeSpan compMissionTime = TimeSpan.FromHours(24);
    protected SimVariable lambdaVariable = null;

    protected override EnEventType GetEvType() { return EnEventType.etFailRate; }

    public FailProbEvent() : base("") { }

    public FailProbEvent(string inName, double lambdaOrFreq, TimeSpan lambdaTimeRate, TimeSpan compMissionTime)
      : base(inName)
    {
      this._lambda = lambdaOrFreq; // (lambdaOrFreq / lambdaTimeRate.TotalHours);
      this.timeRate = lambdaTimeRate;
      this.compMissionTime = compMissionTime;
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {
      string retStr = "\"lambdaTimeRate\":\"" + XmlConvert.ToString(this.timeRate) + "\"," + Environment.NewLine;// +
                      //"\"missionTime\":\"" + XmlConvert.ToString(this.compMissionTime) + "\",";
      if (lambdaVariable != null)
      {
        retStr = retStr +
          "\"useVariable\": true, " + Environment.NewLine +
          "\"lambda\":\"" + this.lambdaVariable.name + "\"," + Environment.NewLine;          
      }
      else
      {
        retStr = retStr +
          "\"useVariable\": false, " + Environment.NewLine +
          "\"lambda\":" + this._lambda.ToString() + Environment.NewLine;          
      }

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allEvents.Add(this, false);

      if (EnEventType.etFailRate != (EnEventType)Enum.Parse(typeof(EnEventType), (string)dynObj.evType, true))
        throw new Exception("event types do not match, cannot change the type once an item is created!");

      
      this.timeRate = XmlConvert.ToTimeSpan((string)dynObj.lambdaTimeRate);
      if (dynObj.missionTime == null)
        compMissionTime = TimeSpan.FromDays(365.3);
      else
      {
        this.compMissionTime = XmlConvert.ToTimeSpan((string)dynObj.missionTime);
        if (compMissionTime < TimeSpan.FromSeconds(1))
          compMissionTime = TimeSpan.FromDays(365.3);
      }

      if ((dynObj.useVariable == null) || !(bool)dynObj.useVariable)
      {
        //use normal assigned lambda if not a variable
        this._lambda = (double)dynObj.lambda;
      }

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      if ((dynObj.useVariable != null) && (bool)dynObj.useVariable)
      {
        try
        {
          this.lambdaVariable = lists.allVariables.FindByName((string)dynObj.lambda);
          //this.AddRelatedItem(curVar.id); //don't need to add to relatedItems, because it doesn't trigger the event and time is fixed once started 
        }
        catch
        {
          throw new Exception("Failed to find variable - " + (string)dynObj.time);
        }
      }

      return true;
    }

    public override TimeSpan NextTime()
    {
      TimeSpan retVal = TimeSpan.MaxValue;
      if (lambdaVariable != null)
      {
        _lambda = lambdaVariable.dblValue;
      }
      else
      {
        if (_lambda == 0.0)
        {
          return TimeSpan.MaxValue;
        }
      }

      //Random rand = new Random();
      //rand.NextDouble();
      double randNum = SingleRandom.Instance.NextDouble();
      double tempD = Math.Log(1 - randNum);
      double timeToFail = -(tempD / (_lambda));
      try { retVal = TimeSpan.FromHours(timeToFail * timeRate.TotalHours); }
      catch { retVal = TimeSpan.MaxValue; }

      //debugging to keep track of probabilities of items
      if (Stats.Instance.logStats)
      {
        if ((retVal < compMissionTime) && (timeRate == Globals.HourTimeSpan))
        {
          if (Stats.Instance.comp_fails.ContainsKey(name))
          {
            Stats.Instance.comp_fails[name]++;// (hoursToFail);
          }
          else
          {
            Stats.Instance.comp_fails.Add(name, 1);
          }
        }
        else if (timeRate > Globals.DayTimeSpan)
        {
          Stats.Instance.ie_Times.Add(timeToFail);
        }
      }

      if ((retVal > compMissionTime) || (retVal < Globals.NowTimeSpan)) //time surpasses the allotted time span or is negative (to small to calculate) so return back that it does not fail.
      {
        return TimeSpan.MaxValue;
      }

      return retVal;
    }
  }

  public class NormalDistEvent : TimeBasedEvent //etNormalDist  
  {
    protected double _Mean = 0.0;
    protected double _Std = 0.0;
    protected double _Min = 0.0;
    protected double _Max = 0.0;
    protected EnTimeRate _MeanTimeRate = EnTimeRate.trHours;
    protected EnTimeRate _StdTimeRate = EnTimeRate.trHours;
    protected EnTimeRate _MinTimeRate = EnTimeRate.trHours;
    protected EnTimeRate _MaxTimeRate = EnTimeRate.trHours;
    public bool allItems = false;

    protected Normal mathFuncs = null;

    protected override EnEventType GetEvType() { return EnEventType.etNormalDist; }

    public NormalDistEvent() : base("") { }

    public NormalDistEvent(string inName, double mean, double std, double min, double max, bool inAllItems = true)
      : base(inName)
    {
      this._Mean = mean;
      this._Std = std;
      this._Min = min;
      this._Max = max;
      this.allItems = inAllItems;
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {

      string retStr = "\"evType\": \"" + EnEventType.etNormalDist.ToString() + "\"," + Environment.NewLine +
                      "\"mean\": " + this._Mean.ToString() + "," + Environment.NewLine +
                      "\"std\": " + this._Std.ToString() + "," + Environment.NewLine +
                      "\"min\": " + this._Min.ToString() + "," + Environment.NewLine +
                      "\"max\": " + this._Max.ToString() + "," + Environment.NewLine +
                      "\"meanTimeRate\": \"" + this._MeanTimeRate.ToString() + "\"," + Environment.NewLine +
                      "\"stdTimeRate\": \"" + this._StdTimeRate.ToString() + "\"," + Environment.NewLine +
                      "\"minTimeRate\": \"" + this._MinTimeRate.ToString() + "\"," + Environment.NewLine +
                      "\"maxTimeRate\": \"" + this._MaxTimeRate.ToString() + "\""; //+ "," + Environment.NewLine 

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      try
      {
        dynamic dynObj = (dynamic)obj;
        if (wrapped)
        {
          if (dynObj.Event == null)
            return false;

          dynObj = ((dynamic)obj).Event;
        }

        //  //load the Trigger States.
        //  if (dynObj.triggerStates != null)
        //  {
        //    this.relatedIDs.Clear();
        //    foreach (dynamic stateName in dynObj.triggerStates)
        //    {
        //      State trigState = lists.allStates.FindByName(stateName);
        //      if (trigState == null)
        //      {
        //        throw new Exception("Could not find State - " + stateName + ", to add as a trigger state");
        //      }

        //      this.relatedIDs.Add(trigState.id);
        //    }
        //  }
        //}

        if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
          return false;

        lists.allEvents.Add(this, false);
        EnEventType evType = (EnEventType)Enum.Parse(typeof(EnEventType), (string)dynObj.evType, true);
        if ((EnEventType.etNormalDist != evType) &&
            (EnEventType.etLogNormalDist != evType))
          throw new Exception("event types do not match, cannot change the type once an item is created!");

        this._Mean = Convert.ToDouble(dynObj.mean);
        this._Std = Convert.ToDouble(dynObj.std);
        this._Min = Convert.ToDouble(dynObj.min);
        this._Max = Convert.ToDouble(dynObj.max);
        this._MeanTimeRate = (dynObj.meanTimeRate != null) ? (EnTimeRate)Enum.Parse(typeof(EnTimeRate), (string)dynObj.meanTimeRate, true) : this._MeanTimeRate;
        this._StdTimeRate = (dynObj.stdTimeRate != null) ? (EnTimeRate)Enum.Parse(typeof(EnTimeRate), (string)dynObj.stdTimeRate, true) : this._StdTimeRate;
        this._MinTimeRate = (dynObj.minTimeRate != null) ? (EnTimeRate)Enum.Parse(typeof(EnTimeRate), (string)dynObj.minTimeRate, true) : this._MinTimeRate;
        this._MaxTimeRate = (dynObj.maxTimeRate != null) ? (EnTimeRate)Enum.Parse(typeof(EnTimeRate), (string)dynObj.maxTimeRate, true) : this._MaxTimeRate;
        this.allItems = Convert.ToBoolean(dynObj.allItems);
      }
      catch
      {
        throw new Exception("Failed to convert Normal Distribution Event from JSON could be missing a required field");
      }
      processed = true;
      return true;
      }

    public override TimeSpan NextTime()
    {
      if (mathFuncs == null)
        mathFuncs = new Normal(_Mean, Globals.ConvertToNewTimeSpan(_StdTimeRate, _Std, _MeanTimeRate), SingleRandom.Instance);

      double sampled = mathFuncs.Sample();
      TimeSpan sampledTime = Globals.NumberToTimeSpan(sampled, _MeanTimeRate);
      TimeSpan maxTime = Globals.NumberToTimeSpan(_Max, _MaxTimeRate);
      if (sampledTime > maxTime)
        return maxTime;

      TimeSpan minTime = Globals.NumberToTimeSpan(_Min, _MinTimeRate);
      if (sampledTime < minTime)
        return minTime;

      return sampledTime;
    }
  }

  public class LogNormalDistEvent : NormalDistEvent //etNormalDist  
  {
    protected LogNormal mathFuncs = null;

    protected override EnEventType GetEvType() { return EnEventType.etLogNormalDist; }

    //public override string GetDerivedJSON(EmraldModel lists)
    //{

    //  string retStr = EnEventType.Replace("etNormalDist", EnEventType.etLogNormalDist.ToString())
    //  //string retStr = "\"evType\": \"" + EnEventType.etLogNormalDist.ToString() + "\"," + Environment.NewLine;

    //  return retStr;
    //}

    //public override string GetDerivedJSON(EmraldModel lists)
    //{
    //  string retStr = retStr.Replace(EnEventType.etNormalDist.ToString(), EnEventType.etLogNormalDist.ToString());

    //  return retStr;
    //}

    public override TimeSpan NextTime()
    {
      if (mathFuncs == null)
        mathFuncs = new LogNormal(_Mean, _Std, SingleRandom.Instance);

      double sampled = mathFuncs.Sample();
      //convert the sampled value into the correct time type
      TimeSpan sampledTime;
      try
      {
        sampledTime = Globals.NumberToTimeSpan(sampled, _StdTimeRate);
      }
      catch (System.OverflowException e) //in case it is over use max time
      {
        sampledTime = Globals.NumberToTimeSpan(_Max, _MaxTimeRate);
      }

      TimeSpan maxTime = Globals.NumberToTimeSpan(_Max, _MaxTimeRate);
      if (sampledTime > maxTime)
        return maxTime;

      TimeSpan minTime = Globals.NumberToTimeSpan(_Min, _MinTimeRate);
      if (sampledTime < minTime)
        return minTime;

      return sampledTime;
    }
  }

  public class WeibullDistEvent : TimeBasedEvent  //etWeibullDist  
  {
    protected double _Shape = 0.0;
    protected double _Scale = 0.0;
    protected EnTimeRate _TimeRate = EnTimeRate.trHours;

    Weibull mathFuncs = null;

    protected override EnEventType GetEvType() { return EnEventType.etWeibullDist; }

    public WeibullDistEvent() : base("") { }

    public WeibullDistEvent(string inName, double shape, double scale) //based on minutes
      : base(inName)
    {
      this._Shape = shape;
      this._Scale = scale;
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {
      string retStr = "\"evType\": \"" + EnEventType.etWeibullDist.ToString() + "\"," + Environment.NewLine +
                      "\"shape\":" + this._Shape.ToString() + "," + Environment.NewLine +
                      "\"scale\":" + this._Scale.ToString() + "," + Environment.NewLine +
                      "\"timeRate\":\"" + this._TimeRate.ToString() + "\""; //+ "," + Environment.NewLine 

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }

      try
      {
        if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
          return false;

        lists.allEvents.Add(this, false);

        if (EnEventType.etWeibullDist != (EnEventType)Enum.Parse(typeof(EnEventType), (string)dynObj.evType, true))
          throw new Exception("event types do not match, cannot change the type once an item is created!");        

        this._Shape = Convert.ToDouble(dynObj.shape);
        this._Scale = Convert.ToDouble(dynObj.scale);
        this._TimeRate = (dynObj.timeRate != null) ? (EnTimeRate)Enum.Parse(typeof(EnTimeRate), (string)dynObj.timeRate, true) : this._TimeRate;
      }
      catch
      {
        throw new Exception("Failed to convert Weibull Distribution Event from JSON could be missing a required field");
      }

      processed = true;
      return true;
    }

    public override TimeSpan NextTime()
    {
      if (mathFuncs == null)
        mathFuncs = new Weibull(_Shape, _Scale, SingleRandom.Instance);
      double sampled = mathFuncs.Sample();
      return Globals.NumberToTimeSpan(sampled, this._TimeRate);
    }
  }
  public class ExponentialDistEvent : TimeBasedEvent
  {
    protected VariableList varList = null;
    protected double _Rate = 0.0;
    protected EnTimeRate _TimeRate = EnTimeRate.trHours;

    Exponential mathFuncs = null;

    protected override EnEventType GetEvType() { return EnEventType.etExponentialDist; }

    public ExponentialDistEvent() : base("") { }

    public ExponentialDistEvent(string inName, VariableList inVarList, double rate) 
      : base(inName)
    {
      this._Rate = rate;
      this.varList = inVarList;

    }

    public override string GetDerivedJSON(EmraldModel lists)
    {

      string retStr = "\"evType\": \"" + EnEventType.etExponentialDist.ToString() + "\"," + Environment.NewLine +
                      //"\"varNames\": [" + varNames + "]," + Environment.NewLine +
                      "\"rate\":" + this._Rate.ToString() + "," + Environment.NewLine +
                      "\"timeRate\":\"" + this._TimeRate.ToString() + "\"";// + Environment.NewLine ;

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Event == null)
          return false;

        dynObj = ((dynamic)obj).Event;
      }
      try 
      { 
        if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
          return false;

        lists.allEvents.Add(this, false);

        if (EnEventType.etExponentialDist != (EnEventType)Enum.Parse(typeof(EnEventType), (string)dynObj.evType, true))
          throw new Exception("event types do not match, cannot change the type once an item is created!");

        this._Rate = Convert.ToDouble(dynObj.rate);
        this._TimeRate = (dynObj.timeRate != null) ? (EnTimeRate)Enum.Parse(typeof(EnTimeRate), (string)dynObj.timeRate, true) : this._TimeRate;

      }
      catch
      {
        throw new Exception("Failed to convert Exponential Distribution Event from JSON could be missing a required field");
      }
      processed = true;
      return true;
    }

    public override TimeSpan NextTime()
    {
      if (mathFuncs == null)
        mathFuncs = new Exponential(_Rate, SingleRandom.Instance);
      double sampled = mathFuncs.Sample();
      return Globals.NumberToTimeSpan(sampled, this._TimeRate);
    }
  }
  public class AllEvents : Dictionary<int, Event>, ModelItemLists
  {
    private Dictionary<string, int> nameToID = new Dictionary<string, int>();
    private List<Event> deleted = new List<Event>();
    //private dynamic jsonList = null;

    public bool loaded = false;

    public void Add(Event inEvent, bool errorOnDup = true)
    {
      if (nameToID.ContainsKey(inEvent.name))
      {
        if (errorOnDup)
          throw new Exception("Event already exists " + inEvent.name);
        return;
      }

      nameToID.Add(inEvent.name, inEvent.id);
      this.Add(inEvent.id, inEvent);
    }

    public void SetProcessed(bool value)
    {
      foreach (var item in this)
      {
        item.Value.processed = value;
      }
    }

    public string AllProcessed()
    {
      string retStr = "";
      foreach (var item in this)
      {
        if (item.Value.processed != true)
          retStr = retStr + ((BaseObjInfo)item.Value).name + " Diagram not processed" + Environment.NewLine;
      }

      return retStr;
    }

    new public void Clear()
    {
      nameToID.Clear();
      deleted.Clear();
      base.Clear();
    }

    public void DeleteAll()
    {
      foreach (Event curItem in this.Values)
      {
        deleted.Add(curItem);
      }

      nameToID.Clear();
      base.Clear();
    }

    new public void Remove(int key)
    {
      if (this.ContainsKey(key))
      {
        Event curItem = this[key];
        deleted.Add(curItem);

        nameToID.Remove(curItem.name);
        base.Remove(key);
      }
    }

    public Event FindByName(string name, bool exception = true)
    {
      try
      {
        if (nameToID.ContainsKey(name))
          return this[nameToID[name]];
        else
        {
          if (exception)
            throw new Exception("Failed to find Event - " + name);
          else
            return null;
        }
      }
      catch
      {
        if (exception)
          throw new Exception("Failed to find Event - " + name);
        else
          return null;
      }
    }

    public static Event CreateNewEvent(EnEventType evType)
    {
      Event retEv = null;

      switch (evType)
      {
        case EnEventType.et3dSimEv: retEv = new EvalVarEvent(); break;//string inName, string inCompCode, VariableList inVarList, Sim3DVariable sim3dVar = null)
        case EnEventType.etComponentLogic: retEv = new ComponentLogicEvent(); break; //(string inName, LogicNode inLogicTop, bool inOnSuccess);
        case EnEventType.etFailRate: retEv = new FailProbEvent(); break;  //(string inName, double lambdaOrFreq, TimeSpan lambdaTimeRate, TimeSpan compMissionTime)                
        case EnEventType.etStateCng: retEv = new StateCngEvent(); break; //string inName, bool inIfInState, bool inAllItems = true, List<int> inStates = null)();
        case EnEventType.etTimer: retEv = new TimerEvent(); break; //(string inName, TimeSpan inTime)                  
        case EnEventType.etVarCond: retEv = new EvalVarEvent(); break; //(string inName, string inCompCode, VariableList inVarList, Sim3DVariable sim3dVar = null)
        case EnEventType.etNormalDist: retEv = new NormalDistEvent(); break;
        case EnEventType.etWeibullDist: retEv = new WeibullDistEvent(); break;
        case EnEventType.etExponentialDist: retEv = new ExponentialDistEvent(); break;
        case EnEventType.etLogNormalDist: retEv = new LogNormalDistEvent(); break;

        default: break;
      }

      return retEv;
    }

    public string GetJSON(bool incBrackets, EmraldModel lists)
    {
      //if (jsonList != null)
      //  return Newtonsoft.Json.JsonConvert.SerializeObject(jsonList);

      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"EventList\": [";

      int i = 1;
      foreach (Event curItem in this.Values)
      {
        retStr = retStr + Environment.NewLine;
        retStr += curItem.GetJSON(true, lists);
        if (i < this.Count)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
        ++i;
      }

      retStr = retStr + "]";

      if (incBrackets)
      {
        retStr = retStr + Environment.NewLine + "}";
      }

      return retStr;
    }

    public void DeserializeJSON(object obj, EmraldModel lists, bool useGivenIDs)
    {
      var dynamicObj = (dynamic)obj;
      string curName = "";
      try
      {
        foreach (var wrapper in dynamicObj)
        {
          var item = wrapper.Event;
          curName = (string)item.name;
          Event curItem = null;

          if (loaded && (item.id != null) && ((int)item.id > 0))
          {
            curItem = this[(int)item.id];
            if (curItem == null)
              throw new Exception("Failed to find Event with id of " + (int)item.id);
          }
          else
          {
            curItem = this.FindByName(curName, false);
            if (curItem != null)
              throw new Exception("Event with the name of " + (string)item.name + " already exists");
          }

          if (curItem == null)
          {
            EnEventType evType = (EnEventType)Enum.Parse(typeof(EnEventType), (string)item.evType, true);
            curItem = CreateNewEvent(evType);
          }

          if (!curItem.DeserializeDerived((object)item, false, lists, useGivenIDs))
            throw new Exception("Failed to deserialize Event List JSON");
        }
      }
      catch (Exception e)
      {
        throw new Exception("On event named " + curName + ". " + e.Message);
      }
    }

    public bool LoadLinks(object obj, EmraldModel lists)
    {
      var dynamicObj = (dynamic)obj;

      foreach (var wrapper in dynamicObj)
      {
        var item = wrapper.Event;
        EnEventType evType = (EnEventType)Enum.Parse(typeof(EnEventType), (string)item.evType, true);

        if ((evType == EnEventType.etStateCng) || (evType == EnEventType.etComponentLogic) || 
            (evType == EnEventType.etVarCond) || (evType == EnEventType.et3dSimEv) ||
            (evType == EnEventType.etTimer) || (evType == EnEventType.etFailRate))
        {
          Event curItem = this.FindByName((string)item.name, false);
          try
          {
            if (curItem == null)
            {
              throw new Exception("Failed to find Action with the name of " + (string)item.name);
            }

            if (!curItem.LoadObjLinks((object)item, false, lists))
              throw new Exception("Failed to deserialize Action List JSON");
          }
          catch (Exception e)
          {
            throw new Exception("On Event named " + curItem.name + ". " + e.Message);
          }
        }
      }

      return true;
    }

    public void CompileCodes(EmraldModel lists)
    {
      foreach (var item in this)
      {
        if (item.Value is EvalVarEvent )
        {
          try
          {
            ((EvalVarEvent)item.Value).CompileCompCode();
          }
          catch (Exception e)
          {
            throw new Exception("Event \"" + item.Value.name + " \" - " + e.Message);
          }
        }
      }
    }

    //void LoadIfNot()
    //{
    //  if (jsonList != N)
    //  {
    //    //todo
    //    jsonList = "";
    //  }
    //}
  }

}
