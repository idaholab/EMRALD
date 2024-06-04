// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Web.Helpers;

namespace SimulationDAL
{
  public class State : BaseObjInfo
  {
    public string geometry = "";
    

    public EnStateType stateType  = EnStateType.stStandard;   
    public Diagram diagram { get { return _Diagram; } }

    protected ActionList _immediateActions;
    protected List<Event> _events;
    protected List<ActionList> _evActions;
    protected Diagram _Diagram;
    protected int _dfltStateValue; //[-1 = unknow, 0 = false, 1 = true]
    public int dfltStateValue { get { return _dfltStateValue; } }

    //public readonly EnStateType stateType;
    public int eventCnt { get { return _events.Count; } }

    public State()//Diagram inDiagram)
    {
      geometry = "";

      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itState);
      this._events = new List<Event>();
      this._evActions = new List<ActionList>();
      this._immediateActions = new ActionList();
    }

    public State(string inName, EnStateType inStateType, Diagram inDiagram, int dfltValue)
    {
      _Diagram = inDiagram;
      geometry = "";

      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itState);
      this.name = inName;
      this.stateType = inStateType;
      this._events = new List<Event>();
      this._evActions = new List<ActionList>();
      this._immediateActions = new ActionList();
      this._dfltStateValue = dfltValue;

      _Diagram.AddState(this);      
    }

    public void AddEvent(Event ev, bool inMoveFromCur = false, Action act = null)
    {
      if ((!inMoveFromCur) && (act == null))
        throw new Exception("Need an action for an event that does not move from the state - " + this.name + " Event - " + ev.name);
      this._events.Add(ev);
      this._evActions.Add(new ActionList(inMoveFromCur));

      if (act != null)
      {
        _evActions[_evActions.Count - 1].Add(act);
      }
    }

    public void AddActionForEvent(Event forEvent, Action addAct, bool? inMoveFromCur = null)
    {
      int idx = -1;

      for (int i = 0; i < _events.Count; ++i)
      {
        if (_events[i] == forEvent)
          idx = i;
      }

      if (idx == -1)
        throw new Exception("Failed to find the event (" + forEvent.name + ") in the state.");

      if (inMoveFromCur != null)
      {
        _evActions[idx].moveFromCurrent = (_evActions[idx].moveFromCurrent || (bool)inMoveFromCur);
      }
      _evActions[idx].Add(addAct);
    }

    public void AddImmediateAction(Action immediateAct)
    {
      if ((this.stateType == EnStateType.stStart) && (immediateAct is Sim3DAction))
      {
        throw new Exception("Can't have an immediate action with a 3D sim message in a start state");
      }

      _immediateActions.Add(immediateAct);
    }

    public ActionList GetImmediateActions()
    {
      ActionList retVal = new ActionList();
      retVal.AddRange(this._immediateActions);
      return retVal;
    }

    public Event GetEventIdx(int idx)
    {
      if (idx >= _events.Count)
      {
        throw new IndexOutOfRangeException();
      }

      return _events[idx];
    }

    public ActionList GetEvActionsIdx(int idx)
    {
      if (idx >= this._evActions.Count)
      {
        throw new IndexOutOfRangeException();
      }

      return _evActions[idx];
    }

    public override string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"State\": {" + Environment.NewLine + base.GetJSON(false, lists) + "," + Environment.NewLine;

      //add derived items
      retStr = retStr + "\"stateType\": \"" + this.stateType.ToString() + "\"," + Environment.NewLine +
                        "\"diagramName\": \"" + this._Diagram.name.ToString() + "\"," + Environment.NewLine +
                        "\"geometry\": \"" + this.geometry + "\"";
      
      
      //add immediate action array items
      retStr = retStr + "," + Environment.NewLine + "\"immediateActions\": [";
      for (int i = 0; i < this._immediateActions.Count; ++i)
      {
        retStr = retStr +  "\"" + this._immediateActions[i].name + "\"";
        
        if (i < this._immediateActions.Count - 1)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
      }

      retStr = retStr + "]";



      //add Event items
      retStr = retStr + "," + Environment.NewLine + "\"events\": [";
      for (int i = 0; i < this._events.Count; ++i)
      {
        retStr = retStr + "\"" + this._events[i].name + "\"";

        if (i < this._events.Count - 1)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
      }

      retStr = retStr + "]";


      //add Event Actions
      retStr = retStr + "," + Environment.NewLine + "\"eventActions\": [";
      for (int i = 0; i < this._evActions.Count; ++i)
      {
        retStr = retStr + Environment.NewLine + this._evActions[i].GetJSON(true, lists);
                
        if (i < this._evActions.Count - 1)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
      }

      retStr = retStr + "]";
      
      

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
        if (dynObj.State == null)
          return false;

        dynObj = ((dynamic)obj).State;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allStates.Add(this, false);

      this.stateType = (EnStateType)Enum.Parse(typeof(EnStateType), (string)dynObj.stateType, true);

      this._Diagram = lists.allDiagrams.FindByName((string)dynObj.diagramName);
      if (this._Diagram == null)
        //Diagram should already be created by this point, if not this should be moved to LoadObjectLinks
        throw new Exception("State must have a valid diagram ");

      this._Diagram.AddState(this);

      this.geometry = (string)dynObj.geometry;

      if ((dynObj.immediateActions == null) || (dynObj.events == null) || (dynObj.eventActions == null))
      {
        throw new Exception("Deserialize State, missing immediateActions, events, or eventActions.");
      }

      if (dynObj.defaultSingleStateValue != null)
      {

        switch ((string)dynObj.defaultSingleStateValue)
        {
          case "True":
            this._dfltStateValue = 1;
            break;
          case "False":
            this._dfltStateValue = 0;
            break;
          case "Unknown":
            this._dfltStateValue = -1;
            break;
        }
      }
      

      //Now done in LoadObjLinks()
      ////load the Immediate Actions
      //this._immediateActions.Clear();
      //foreach (dynamic actName in dynObj.immediateActions)
      //{
      //  Action curAct = lists.allActions.FindByName(actName);
      //  if (curAct == null)
      //  {
      //    throw new Exception("Deserialize State, failed to find immediateAction - " + actName);
      //  }
        
      //  _immediateActions.Add(curAct);
      //}

      ////load the Event Items
      //foreach (dynamic eventName in dynObj.events)
      //{
      //  Event curEv = lists.allEvents.FindByName(eventName);
      //  if (curEv == null)
      //  {
      //    throw new Exception("Deserialize State, failed to find event - " + eventName);
      //  }
      //  _events.Add(curEv);
      //}

      ////load the Event Actions
      //if (dynObj.eventActions != null)
      //{
      //  this._evActions.Clear();

      //  foreach (dynamic curToObj in dynObj.eventActions)
      //  {
      //    ActionList curEvActList = new ActionList();
      //    curEvActList.DeserializeJSON(curToObj, lists);
      //    this._evActions.Add(curEvActList);
      //  }
      //}

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
     
      //load the Immediate Actions
      this._immediateActions.Clear();
      foreach (var actName in dynObj.immediateActions)
      {
        Action curAct = lists.allActions.FindByName((string)actName);
        if (curAct == null)
        {
          throw new Exception("Deserialize State, failed to find immediateAction - " + actName);
        }

        _immediateActions.Add(curAct);
      }

      //load the Event Items
      foreach (var eventName in dynObj.events)
      {
        Event curEv = lists.allEvents.FindByName((string)eventName);
        if (curEv == null)
        {
          throw new Exception("Deserialize State, failed to find event - " + eventName);
        }
        _events.Add(curEv);
      }

      //load the Event Actions
      if (dynObj.eventActions != null)
      {
        this._evActions.Clear();
        foreach (dynamic curToObj in dynObj.eventActions)
        {
          try
          {
            ActionList curEvActList = new ActionList();
            curEvActList.DeserializeJSON(curToObj, lists);
            this._evActions.Add(curEvActList);
          }
          catch (Exception e)
          {
            throw new Exception("Syntax error bad event actions- " + e.Message);
          }
        }
      }
      return true;
    }

    public virtual void LookupRelatedItems(EmraldModel all, EmraldModel addToList)
    {
      if (addToList.allStates.ContainsKey(this.id))
      {
        return;
      }

      addToList.allStates.Add(this, false);

      foreach (Action curItem in this._immediateActions)
      {
        curItem.LookupRelatedItems(all, addToList);
      }

      foreach (ActionList curItem in this._evActions)
      {
        foreach (Action curItem2 in curItem)
        {
          curItem2.LookupRelatedItems(all, addToList);
        }
      }

      foreach (Event curItem in this._events)
      {
        curItem.LookupRelatedItems(all, addToList);
      }

    }

    public void ResetEventCriteria()
    {
      foreach(var e in _events)
      {
        e.Reset();
      }
    }
  }


  class StateSort : IComparer<State>
  {
    public int Compare(State c1, State c2)
    {
      return c1.name.CompareTo(c2.name);
    }
  }


  public class AllStates : Dictionary<int, State>, ModelItemLists
  {
    private Dictionary<string, int> nameToID = new Dictionary<string, int>();
    private List<State> deleted = new List<State>();

    public bool loaded = false;

    public void Add(State inState, bool errorOnDup = true)
    {
      if (nameToID.ContainsKey(inState.name))
      {
        if (errorOnDup)
          throw new Exception("State already exists " + inState.name);
        return;
      }

      nameToID.Add(inState.name, inState.id);
      this.Add(inState.id, inState);
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
          retStr = retStr + ((BaseObjInfo)item.Value).name + " State not processed" + Environment.NewLine;
      }

      return retStr;
    }

    new public void Clear()
    {
      nameToID.Clear();
      base.Clear();
    }

    public void DeleteAll()
    {
      foreach (State curVar in this.Values)
      {
        deleted.Add(curVar);
      }

      nameToID.Clear();
      base.Clear();
    }

    new public void Remove(int key)
    {
      if (this.ContainsKey(key))
      {
        State temp = this[key];
        deleted.Add(temp);

        nameToID.Remove(temp.name);
        base.Remove(key);
      }
    }

    public State FindByName(string name, bool exception = true)
    {
      try
      {
        if (nameToID.ContainsKey(name))
          return this[nameToID[name]];
        else
        {
          if (exception)
            throw new Exception("Failed to find State - " + name);
          else
            return null;
        }
      }
      catch
      {
        if (exception)
          throw new Exception("Failed to find State - " + name);
        else
          return null;
      }
    }


    public string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"StateList\": [";

      int i = 1;
      foreach (State curItem in this.Values)
      {
        retStr = retStr + Environment.NewLine + curItem.GetJSON(true, lists);
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
          var item = wrapper;
          State curItem = null;
          curName = (string)item.name;

          if (loaded && (item.id != null) && ((int)item.id > 0))
          {
            curItem = this[(int)item.id];
            if (curItem == null)
              throw new Exception("Failed to find State with id of " + (int)item.id);
          }
          else
          {
            curItem = this.FindByName(curName, false);
            if (curItem != null)
              throw new Exception("State with the name of " + (string)item.name + " already exists");
          }

          if (curItem == null)
          {
            curItem = new State();
          }

          if (!curItem.DeserializeDerived((object)item, false, lists, useGivenIDs))
            throw new Exception("Failed to deserialize State List JSON");
        }
      }

      catch (Exception e)
      {
        throw new Exception("On state named " + curName + ". " + e.Message);
      }
    }

  public bool LoadLinks(object obj, EmraldModel lists)
    {
      var dynamicObj = (dynamic)obj;

      foreach (var wrapper in dynamicObj)
      {
        var item = wrapper;

        State curItem = this.FindByName((string)item.name, false);
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
          throw new Exception("On State named " + curItem.name + ". " + e.Message);
        }
      }

      return true;
    }


  }
}
