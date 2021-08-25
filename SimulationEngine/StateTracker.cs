﻿// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Windows.Forms;
using MyStuff.Collections;
using Sop.Collections.Generic.BTree;
using MultiKeyDict;
using SimulationDAL;
using XmppMessageServer;
using MessageDefLib;

namespace SimulationTracking
{
  
  public class EventListData
  {
    public EventStatesAndActions eventStateActions;
    public Event eventData;
    public String name;
    public int id;

    public EventListData(String inName, EventStatesAndActions inStEvID, Event inEventData)
    {
      this.id = SingleNextIDs.Instance.NextID(EnIDTypes.itTimer);
      this.eventStateActions = inStEvID;
      this.eventData = inEventData;
      this.name = inName;
    }

    //public EventListData(EventListData copyThis)
    //{
    //  this.id = copyThis.id;
    //  this.stEvID = copyThis.stEvID;
    //  this.eventData = copyThis.eventData;
    //  this.actions = copyThis.actions;
    //  this.name = copyThis.name;
    //}
  }

  public class TimeMoveEvent : EventListData
  {
    public TimeSpan time; //time for the event to occur
    public TimeSpan whenCreated; //time the item was created
    public TimeMoveEvent(String name, EventStatesAndActions inStEvID, Event inEventData, TimeSpan inTime, TimeSpan curTime)
      : base(name, inStEvID, inEventData) 
    {
      this.time = inTime;
      this.whenCreated = curTime;
    }
    public TimeMoveEvent(TimeMoveEvent copyEv)
      : this(copyEv.name, copyEv.eventStateActions, copyEv.eventData, copyEv.time, copyEv.whenCreated)
    {}
  }
  
  public class ConditionMoveEvent : EventListData
  {
    public ConditionMoveEvent(String name, EventStatesAndActions inStEvID, Event inEventData)
      : base(name, inStEvID, inEventData)
    {
      //if (inEventData.relatedIDs.Count == 0)
      //{
      //  MessageBox.Show("No Related IDs for " + inEventData.name);
      //  return;
      //}
      if (inEventData.relatedIDs.Count > 0)
      {
        this.relatedIDs = new MyBitArray(inEventData.relatedIDs.Max() + 1);
        for (int i = 0; i < inEventData.relatedIDs.Count(); ++i)
        {
          relatedIDs[inEventData.relatedIDs[i]] = true;
        }
      }
    }

    public MyBitArray relatedIDs; 
  }

  /// <summary>
  /// maintains lists of item IDs that have changed of different types [variables, 3DComps, states]
  /// </summary>
  public class ChangedIDs 
  {
    private MyBitArray variableIDs;
    private MyBitArray compIDs;
    private MyBitArray stateIDs;

    public ChangedIDs(int varIDMax, int compIDMax, int stateIDMax)
    {
      this.variableIDs = new MyBitArray(varIDMax + 1);
      this.compIDs = new MyBitArray(compIDMax + 1);
      this.stateIDs = new MyBitArray(stateIDMax + 1);
    }

    public void AddChangedID(EnModifiableTypes idType, int id)
    {
      int max;
      switch (idType)
      {
        case EnModifiableTypes.mtVar:
          max = variableIDs.Count;
          break;

        case EnModifiableTypes.mtComp:
          max = compIDs.Count;
          break;

        case EnModifiableTypes.mtState:
          max = stateIDs.Count;
          break;

        default:
          return;
      }

      if (id > max)
      {
        throw new ArgumentOutOfRangeException();
      }

      switch (idType)
      {
        case EnModifiableTypes.mtVar:
          variableIDs[id] = true;
          break;

        case EnModifiableTypes.mtComp:
          compIDs[id] = true;
          break;

        case EnModifiableTypes.mtState:
          stateIDs[id] = true;
          break;

        default:
          return;
      }
    }

    public bool HasApplicableItems(EnModifiableTypes idType, MyBitArray ids)
    {
      //switch (idType)
      //{
      //  case EnModifiableTypes.mtVar:
      //    return variableIDs.HasCommonBits(ids);

      //  case EnModifiableTypes.mtComp:
      //    return compIDs.HasCommonBits(ids);

      //  case EnModifiableTypes.mtState:
      //    return stateIDs.HasCommonBits(ids);

      //  default :
      //    return false;        
      //}
      if(idType == EnModifiableTypes.mtVar)
          return variableIDs.HasCommonBits(ids);

      else if(idType ==  EnModifiableTypes.mtComp)
          return compIDs.HasCommonBits(ids);

      else if(idType ==  EnModifiableTypes.mtState)
          return stateIDs.HasCommonBits(ids);

      else
          return false;
    }

    public void Clear()
    {
      variableIDs.SetAll(false);
      compIDs.SetAll(false);
      stateIDs.SetAll(false);
    }
  }

  /// <summary>
  /// Conditional events list and method to evaluate if events are triggered
  /// </summary>
  public class ConditionEventLists
  {
    private CurrentStates curStates;
    private Dictionary<EventStatesAndActions, ConditionMoveEvent> [] evLists; //lists to hold the different kind of condition, array by eventtype
    private Dictionary<int, List<EventStatesAndActions>>[] stateRefLookups; //lookup keys for all condition events from the same state.
    private Dictionary<ConditionMoveEvent, bool> initialCondEvalDone; //make sure all events are returned at least after fist added even if no related items have changed.

   
            

    public ConditionEventLists(CurrentStates curStates)
    {
      this.curStates = curStates;
      int cnt = (int)Enum.GetValues(typeof(EnEventType)).Cast<EnEventType>().Last() +1;
      evLists = new Dictionary<EventStatesAndActions, ConditionMoveEvent> [cnt];
      stateRefLookups = new Dictionary<int, List<EventStatesAndActions>> [cnt];
      initialCondEvalDone = new Dictionary<ConditionMoveEvent, bool>();
      foreach (EnEventType itemType in Enum.GetValues(typeof(EnEventType)))
      {
        
        if (Constants.CondEventTypes.Contains(itemType))
        {
          evLists[(int)itemType] = new Dictionary<EventStatesAndActions, ConditionMoveEvent>();
          stateRefLookups[(int)itemType] = new Dictionary<int, List<EventStatesAndActions>>();
        }
        else
        {
          evLists[(int)itemType] = null;
          stateRefLookups[(int)itemType] = null;
        }
      }      
    }

    public void Clear()
    {
      this.curStates.Clear();
    }

    public void AddConditionEvent(ConditionMoveEvent addEv)
    {
      if (evLists[(int)addEv.eventData.evType] == null)
      {
        throw new Exception("Event Type " + Enum.GetName(typeof(EnEventType), addEv.eventData.evType) + " has no Condition list set up. StateTracker.cs AddConditionEvent() ");
      }

      evLists[(int)addEv.eventData.evType].Add(addEv.eventStateActions, addEv);
      initialCondEvalDone.Add(addEv, false);

      List<EventStatesAndActions> refs;
      foreach (var stID in addEv.eventStateActions.statesAndActions)
      {
        if (stateRefLookups[(int)addEv.eventData.evType].TryGetValue(stID.Key, out refs))
        {
          refs.Add(addEv.eventStateActions);
        }
        else
        {
          refs = new List<EventStatesAndActions>();
          refs.Add(addEv.eventStateActions);
          stateRefLookups[(int)addEv.eventData.evType].Add(stID.Key, refs);
        }
      }
    }

    
    public bool RemoveMatchingStateItems(int stateID)
    {
      bool retBool = false;
      List<EventStatesAndActions> refs;
      //Go through all the lists for the enum types
      foreach (EnEventType itemType in Enum.GetValues(typeof(EnEventType)))
      { 
        //if the enum type is a Condition we need to see if there are items to remove
        if (Constants.CondEventTypes.Contains(itemType))
        {
          //see if there are any references for this state
          if (stateRefLookups[(int)itemType].TryGetValue(stateID, out refs))
          {
            foreach (EventStatesAndActions key in refs)
            {
              evLists[(int)itemType].Remove(key);
              retBool = true;
            }

            //remove the reference lookup for this state since all were just removed
            stateRefLookups[(int)itemType].Remove(stateID);
          }
        }
      }

      return retBool;
    }

    public List<ConditionMoveEvent> GetMatchedCondMoveEvents(ChangedIDs changedItems, /*Dictionary<int, SimEventType> lastEvTypes,*/ TimeSpan curTime, TimeSpan start3DTime, TimeSpan nextEvTime)
    {
      List<ConditionMoveEvent> retList = new List<ConditionMoveEvent>();
      if (curStates.Count == 0)
      {
        return retList;
      }

      MyBitArray curStatesBS = curStates.bitMap; // curStates.ToBitArray();
      object otherData = null;

      foreach (Dictionary<EventStatesAndActions, ConditionMoveEvent> curList in evLists)
      {
        if (curList != null)
        {
          EnModifiableTypes curIDType;
          foreach (ConditionMoveEvent item in curList.Values)
          {
            switch (item.eventData.evType)
            {
              case EnEventType.et3dSimEv:
                curIDType = EnModifiableTypes.mtVar;
                //otherData = lastEvTypes;
                break;

              case EnEventType.etVarCond:
                curIDType = EnModifiableTypes.mtVar;
                break;

              case EnEventType.etStateCng:
                curIDType =EnModifiableTypes.mtState;
                break;

              case EnEventType.etComponentLogic:
                curIDType =EnModifiableTypes.mtState;
                break;

              default:
                return retList;
            }

            if (initialCondEvalDone.ContainsKey(item)) //initialCondEvalDone[item] == false) //make sure each event is evaluated to start off with, then only if the related items change.
            {
              if ((curIDType == EnModifiableTypes.mtVar) &&
                  (item.eventData as CondBasedEvent).EventTriggered(curStatesBS, otherData, curTime, start3DTime, nextEvTime)) //see if the code is triggered
              {
                retList.Add(item);
              }
              else if ((curIDType == EnModifiableTypes.mtState) &&
                  (curStatesBS.HasCommonBits(item.relatedIDs)) &&
                  (item.eventData as CondBasedEvent).EventTriggered(curStatesBS, otherData, curTime, start3DTime, nextEvTime))
              {
                retList.Add(item);
              }
              initialCondEvalDone.Remove(item); 
            }

            else if ((item.relatedIDs != null) &&(changedItems.HasApplicableItems(curIDType, item.relatedIDs)) &&
               ((item.eventData as CondBasedEvent).EventTriggered(curStatesBS, otherData, curTime, start3DTime, nextEvTime)))
            {
              retList.Add(item);
            }
          }
        }
      }

      //clear the initial eval list so we don't check them again and we have an empty list for the next round.
      initialCondEvalDone.Clear();

      return retList;
    }
  }

  /// <summary>
  /// Time Event Que for items that are in current states
  /// </summary>
  class TimeEventList
  {
    public BTreeDictionary<TimeSpan, TimeMoveEvent> timedEvQue = new BTreeDictionary<TimeSpan, TimeMoveEvent>();
    private Dictionary<int, List<TimeSpan>> stateRefLookup = new Dictionary<int, List<TimeSpan>>(); //lookup of state IDs to a key in TimedEvQue.
    private Dictionary<int, List<TimeSpan>> eventRefLookup = new Dictionary<int, List<TimeSpan>>(); //lookup of event IDs to a key in TimedEvQue.
    private List<TimeMoveEvent> poppedList = new List<TimeMoveEvent>();

    public int cnt { get { return timedEvQue.Count; } }

    public TimeEventList()
    {
      //timedEvQue.AllowDuplicates = true;
      //timedEvQue.SortOrder
    }

    public bool HasEvent(int evID)
    {
      return eventRefLookup.ContainsKey(evID);
    }

    public void Clear()
    {
      this.timedEvQue.Clear();
      this.stateRefLookup.Clear();
      this.eventRefLookup.Clear();
    }

    public void RemoveMatchingStateItems(int stateID)
    {
      //get the indexes for the state. 
      List<TimeSpan> refs;
      if (stateRefLookup.TryGetValue(stateID, out refs))
      {
        foreach (TimeSpan refTime in refs)
        {
          //find the item in timedEvQue with the key of refTime and value that has the correct stateID   
          if (timedEvQue.Search(refTime, true))
          {
            do
            { 
              if (timedEvQue.CurrentValue.eventStateActions.statesAndActions.ContainsKey(stateID))
              {
                if (timedEvQue.CurrentValue.eventStateActions.statesAndActions.Count == 1)
                  timedEvQue.Remove();
                else
                  timedEvQue.CurrentValue.eventStateActions.RemoveStateActions(stateID);
              }
            }
            while (timedEvQue.MoveNext() && timedEvQue.CurrentKey == refTime);
          }
        }

        stateRefLookup.Remove(stateID);
      }
    }

    public List<TimeMoveEvent> PopTimedEvent(TimeSpan curTime)
    {
      List<TimeMoveEvent> retEvs = new List<TimeMoveEvent>();
      if (timedEvQue.Count > 0)
      {
        //get the first item or all items with the same lowest time.
        timedEvQue.MoveFirst();
        TimeSpan firstKey = timedEvQue.CurrentKey;
        while ((timedEvQue.Count > 0) && (timedEvQue.CurrentKey == firstKey))
        {
          TimeMoveEvent tEv = (TimeMoveEvent)timedEvQue.CurrentValue;
          //put the time back to original value in case time is shifted back.
          tEv.time = (curTime - tEv.whenCreated);// + firstKey;
          retEvs.Add(tEv);
          poppedList.Add(tEv);
          timedEvQue.Remove();
          timedEvQue.MoveFirst();
        }
        
        //shift the time for all the other items
        ShiftEvTimes(firstKey);
      }

      return retEvs;
    }

    public void ExternalEvOccurred(String evDispName, SimEvent evData, EmraldModel allLists, TimeSpan curTime, TimeSpan simExtStartTime)
    {
      SimVariable setVar = allLists.allVariables.FindBySim3dId(evData.itemData.nameId);
      VarValueAct act = new VarValueAct(evData.itemData.nameId + "_3D_Assign", setVar, "return " + evData.itemData.value + ";", typeof(double), null);
      ActionList actList = new ActionList();
      actList.Add(act);
      Event nowEv = allLists.allEvents.FindByName("ExtSimEv_", false);
      if (nowEv == null)
      {
        nowEv = new ExtSimEvent("Now");
      }
      EventStatesAndActions key = new EventStatesAndActions(nowEv.id, 0, actList);

      TimeMoveEvent extEv = new TimeMoveEvent(evDispName, key, nowEv, curTime - simExtStartTime, simExtStartTime); //FromMilliseconds just in case the curTime is the same as the RevetToTime
      poppedList.Add(extEv);
      
    }

    public void ShiftEvTimes(TimeSpan adjTime)
    {
      BTreeDictionary<TimeSpan, TimeMoveEvent> newList = new BTreeDictionary<TimeSpan, TimeMoveEvent>();

      stateRefLookup.Clear();
      eventRefLookup.Clear();

      if (timedEvQue.MoveFirst())
      {
        do
        {
          TimeSpan oldKey = timedEvQue.CurrentKey;
          TimeMoveEvent item = (TimeMoveEvent)timedEvQue.CurrentValue;
          TimeSpan newKey = oldKey.Subtract(adjTime);
          item.time = item.time.Subtract(adjTime);
          newList.Add(newKey, item);
          AddIDLookups(item.eventStateActions, newKey);
        }
        while (timedEvQue.MoveNext());
      }
      

      timedEvQue.Clear();
      timedEvQue = newList;
    }

    public TimeMoveEvent LookNextTimedEvent()
    {
      timedEvQue.MoveFirst();
      //TimeSpan firstKey = timedEvQue.CurrentKey;
      TimeMoveEvent retEvent = timedEvQue.CurrentValue;
      return retEvent;
    }

    public void AddTimedEvent(TimeMoveEvent addEvent)
    {
      //see if this event is an event already in there from another state if so don't create a new one use the previous sampled event and time.
      List<TimeSpan> refs;
      if (eventRefLookup.TryGetValue(addEvent.eventStateActions.eventID, out refs))
      { 
        foreach (TimeSpan refTime in refs)
        {
          //find the item in timedEvQue with the key of refTime and value that has the correct stateID   
          if (timedEvQue.Search(refTime, true))
          {
            do
            {
              var firstStActs = addEvent.eventStateActions.statesAndActions.First();
              timedEvQue.CurrentValue.eventStateActions.AddStateEv(firstStActs.Key, (ActionList)firstStActs.Value);
              AddIDLookups(addEvent.eventStateActions, addEvent.time);
              return;
            }
            while (timedEvQue.MoveNext() && timedEvQue.CurrentKey == refTime);
          }
        }
      }

      //if here did not find an event with the same event ID
      timedEvQue.Add(addEvent.time, addEvent);
      AddIDLookups(addEvent.eventStateActions, addEvent.time);     
    }

    public void AddEventStateActions(int evID, int stateID, ActionList actions)
    {
      //see if this event is an event already in there from another state if so don't create a new one use the previous sampled event and time.
      List<TimeSpan> refs;
      if (eventRefLookup.TryGetValue(evID, out refs))
      {
        foreach (TimeSpan refTime in refs)
        {
          //find the item in timedEvQue with the key of refTime and value that has the correct stateID   
          if (timedEvQue.Search(refTime, true))
          {
            do
            {
              timedEvQue.CurrentValue.eventStateActions.AddStateEv(stateID, actions);
              AddStateLookup(stateID, refTime);
              return;
            }
            while (timedEvQue.MoveNext() && timedEvQue.CurrentKey == refTime);
          }
        }
      }
    }

    //public void SaveCurrent(TimeStateVariable curSave, TimeSpan curTime)
    //{
    //  curSave.SaveTimeQue(curTime, timedEvQue, stateRefLookup, poppedList);
    //}

    //public TimeSpan RevertToTime(TimeStateVariable curSave)
    //{
    //  this.timedEvQue.Clear();
    //  foreach (var ev in curSave.timedEvQue)
    //  {
    //    this.timedEvQue.Add(new TimeSpan(ev.Key.Ticks), new TimeMoveEvent(ev.Value));
    //  }

    //  this.stateRefLookup.Clear();
    //  foreach (var sRef in curSave.stateRefLookup)
    //  {
    //    this.stateRefLookup.Add(sRef.Key, new List<TimeSpan>(sRef.Value));
    //  }

    //  this.poppedList.Clear();
    //  //for (int i = 0; i < curSave.poppedList.Count(); i++)
    //  //{
    //  //  this.poppedList.Add(new TimeMoveEvent(curSave.poppedList[i]));
    //  //}

    //  return TimeSpan.FromHours((double)curSave.value);
    //}

    public void RevertToTime(TimeSpan curTime, TimeSpan revertTo)
    {
      //TODO this is not correct because we are missing items that were not popped off but RemoveMatchingStateItems 
      //  from the time we are reverting to, to the current time.  Need to somehow save all the removed items also 
      TimeSpan diffTime = curTime.Subtract(revertTo);

      //remove items added during this duration
      //add time to all the time items in the list
      BTreeDictionary<TimeSpan, TimeMoveEvent> newList = new BTreeDictionary<TimeSpan, TimeMoveEvent>();
      stateRefLookup.Clear();
      eventRefLookup.Clear();

      if (timedEvQue.MoveFirst())
      {
        do
        {
          TimeSpan oldKey = timedEvQue.CurrentKey;
          TimeMoveEvent item = (TimeMoveEvent)timedEvQue.CurrentValue;
          if (item.whenCreated < revertTo)
          {
            TimeSpan newKey = oldKey.Add(diffTime);
            item.time = item.time.Add(diffTime);
            newList.Add(newKey, item);
            AddIDLookups(item.eventStateActions, newKey);
          }
        }
        while (timedEvQue.MoveNext());
      }


      timedEvQue.Clear();
      timedEvQue = newList;

      //put back time events that have passed in this block of time.
      if(poppedList.Count > 0)
      {
        int idx = poppedList.Count-1;
        TimeMoveEvent emEv = poppedList[idx];
        
        while((emEv.whenCreated + emEv.time) > revertTo) //event will happen after the revert to time
        {
          if(emEv.whenCreated <= revertTo) //event was created when or before the revert to time.
          {
            //adjust the time of the event by the current time
            emEv.time = emEv.time - (revertTo - emEv.whenCreated);
            newList.Add(emEv.time, emEv);
            
          }

          poppedList.Remove(emEv);
          --idx;
          emEv = poppedList[idx];
        }        
      }
    }

    private void AddStateLookup(int stID, TimeSpan timeKey)
    {
      List<TimeSpan> times;
      if (stateRefLookup.TryGetValue(stID, out times))
      {
        times.Add(timeKey);
      }
      else
      {
        times = new List<TimeSpan>();
        times.Add(timeKey);
        stateRefLookup.Add(stID, times);
      }
    }

    private void AddIDLookups(EventStatesAndActions stEv, TimeSpan timeKey)
    {
      //look for the stateID in the StateRefLookup
      foreach (var stActs in stEv.statesAndActions)
      {
        AddStateLookup(stActs.Key, timeKey);
      }

      List<TimeSpan> times2;
      if (eventRefLookup.TryGetValue(stEv.eventID, out times2))
      {
        times2.Add(timeKey);
      }
      else
      {
        times2 = new List<TimeSpan>();
        times2.Add(timeKey);
        eventRefLookup.Add(stEv.eventID, times2);
      }
    }
  }

  public class StatePath
  {
    public State state;
    public List<int> path;
    public List<TimeSpan> times;
    public List<string> eventNames;
    public List<string> actionNames;

    public StatePath(State inState, List<int> inPath, List<TimeSpan> inTimes, List<string> eventName, List<string> actionName)
    {
      this.state = inState;
      this.path = inPath;
      this.times = inTimes;
      this.eventNames = eventName;
      this.actionNames = actionName;
    }

    public StatePath(StatePath toCopy)
    {
      this.state = toCopy.state;
      this.path = toCopy.path;
      this.times = toCopy.times;
      this.eventNames = toCopy.eventNames;
      this.actionNames = toCopy.actionNames;
    }
  }

  public class RemovedStateInfo
  {
    public TimeSpan time;
    public StatePath statePath;

    public RemovedStateInfo(TimeSpan inTime, StatePath inStatePath)
    {
      this.time = inTime;
      this.statePath = inStatePath;
    }

    public RemovedStateInfo(RemovedStateInfo toCopy, bool fullCopy = false)
    {
      this.time = toCopy.time;
      if(fullCopy)
        this.statePath = new StatePath(toCopy.statePath);
      else
        this.statePath = toCopy.statePath;
    }

  }
  
  /// <summary>
  /// Dictionary of current states at any given point in the simulation
  /// </summary>
  public class CurrentStates : Dictionary<int, StatePath>
  {
    private NLog.Logger logger = NLog.LogManager.GetLogger("logfile");
    private Dictionary<int, RemovedStateInfo> removedItems = new Dictionary<int, RemovedStateInfo>();
    
    private MyBitArray _bitMap = new MyBitArray(100, false);
    public MyBitArray bitMap { get { return _bitMap; } }
    //public bool trackStateMovement = true;


    public TimeSpan RemoveState(int stateID, TimeSpan curTime)
    {
      TimeSpan timeInIt = new TimeSpan();
      StatePath curStatePath;
      if (this.TryGetValue(stateID, out curStatePath))
      {
        //keep a copy of the state/path so we can copy the path if an added item came from this state
        if (removedItems.ContainsKey(stateID))
        {
          removedItems.Remove(stateID);
        }

        removedItems.Add(stateID, new RemovedStateInfo(curTime, curStatePath));
        timeInIt = curTime - this[stateID].times.Last() ;
        this.Remove(stateID);
      }

      _bitMap.Set(stateID, false);
      return timeInIt;
    }

    public TimeSpan CurTimeInState(int stateID, TimeSpan curTIme)
    {
      TimeSpan timeInIt = new TimeSpan();
      StatePath curStatePath;
      if (this.TryGetValue(stateID, out curStatePath))
      {
        this.Remove(stateID);
      }

      return timeInIt;
    }

    ////public void SaveStateQue(Dictionary<int, RemovedStateInfo> removedItems, MyBitArray curStates)
    //public void SaveCurrent(TimeStateVariable curSave)
    //{
    //  curSave.SaveStateQue(this, removedItems, _bitMap);
    //}

    //public void RevertToGivenTime(TimeStateVariable saved)
    //{
    //  this.Clear();
    //  foreach (var st in saved.curStates)
    //  {
    //    this.Add(st.Key, new StatePath(st.Value));
    //  }

    //  //this.removedItems.Clear();
    //  //foreach (var st in saved.removedItems)
    //  //{
    //  //  this.removedItems.Add(st.Key, new RemovedStateInfo(st.Value));
    //  //}

    //  this._bitMap = new MyStuff.Collections.MyBitArray(saved.curStatesBS);
    //}

    public void RevertToGivenTime(TimeSpan forTime, ConditionEventLists condEvs) //returns states put back in CurrentState list
    {
      List<int> remList = new List<int>();
      foreach(var curState in this.Values)
      {
        int idx = curState.times.Count - 1;
        if (curState.times[idx] > forTime)
        {
          condEvs.RemoveMatchingStateItems(curState.state.id);
          remList.Add(curState.state.id);
        }
      }

      //remove all the items from the list
      foreach(var id in remList)
      {
        this.Remove(id);
        _bitMap.Set(id, false);
      }

      List<RemovedStateInfo> timeSorted = new List<RemovedStateInfo>();
      timeSorted = removedItems.Values.ToList(); 
      timeSorted.Sort((ts1, ts2) => TimeSpan.Compare(ts1.time, ts2.time));

      remList.Clear();
      int i = timeSorted.Count - 1;
      while ((i>= 0) && (timeSorted[i].time > forTime)) //added time is greater than 
      {
        var remState = timeSorted[i];
        if (remState.statePath.times[remState.statePath.times.Count - 1] <= forTime)//state was added after the time we are moving back to.
        {
          State curState = remState.statePath.state;
          //move back to the CurrentStates and put items back in condEvList.
          this.Add(curState.id, remState.statePath);
          _bitMap.Set(curState.id, true);
          remList.Add(curState.id);

          //add all the events to either the TimeEventQue or the CondEventList
          for (int idx = 0; idx < curState.eventCnt; ++idx)
          {
            Event curEv = curState.GetEventIdx(idx);

            if (Constants.CondEventTypes.Contains(curEv.evType))
            {
              //Condition event  
              ConditionMoveEvent addCondEv = new ConditionMoveEvent(curEv.name, new EventStatesAndActions(curEv.id, curState.id, curState.GetEvActionsIdx(idx)), curEv);
              //add it to the condition list, if the condition is already met, it will be handled in the loop.
              condEvs.AddConditionEvent(addCondEv);
            }
            //else - Time based Event time events from the states will be put back in the list
          }
        }
        --i;
      }
      
      foreach(int id in remList)
      {
        removedItems.Remove(id);
        _bitMap.Set(id, true);
      }
    }

    public void Add(State toState, int fromState, TimeSpan curTime, string actName, string evName)
    {
      logger.Info("EnterState: " + toState.name + ", time: " + curTime.ToString() + ", Cause Event: " + evName + ", fromState-Action: " + actName);

      if (this.ContainsKey(toState.id)) //already in the state so don't add, can't be in it twice
      {
        return;
      }

      //get the parent diagram and make sure if it is a single state diagram then other ones are not in the current list already.
      if (toState.diagram is EvalDiagram)
      {
        State inState = toState.diagram.HasAStateInCurrentStates(_bitMap);
        if (inState != null)
#if DEBUG
          throw new Exception("Already in a state for the diagram " + toState.diagram.name + " can't add go into another one.");
          //return;
#else
          return;
#endif
      }

      List<int> addList = new List<int>();
      List<TimeSpan> addTimes = new List<TimeSpan>();
      List<string> eventNames = new List<string>();
      List<string> actionNames = new List<string>();

      //if (trackStateMovement)
      //{
      StatePath curStatePath;
      if ((fromState != -1) && (this.TryGetValue(fromState, out curStatePath)))
      {
        addList.AddRange(curStatePath.path);
        addTimes.AddRange(curStatePath.times);
        eventNames.AddRange(curStatePath.eventNames);
        actionNames.AddRange(curStatePath.actionNames);
        addList.Add(fromState);
        addTimes.Add(curTime);
        eventNames.Add(actName);
        actionNames.Add(evName);
      }
      else
      {
        if (fromState != -1)
        {
          addList.AddRange(removedItems[fromState].statePath.path);
          addTimes.AddRange(removedItems[fromState].statePath.times);
          eventNames.AddRange(removedItems[fromState].statePath.eventNames);
          actionNames.AddRange(removedItems[fromState].statePath.actionNames);
        }

        addList.Add(fromState);
        addTimes.Add(curTime);
        eventNames.Add(actName);
        actionNames.Add(evName);
      }
      //}      
      this.Add(toState.id, new StatePath(toState, addList, addTimes, eventNames, actionNames));

      if (toState.id >= _bitMap.Length)
        _bitMap.Length = toState.id + 50;

      _bitMap.Set(toState.id, true);
    }

    public List<int> GetFinalStateList()
    {
      List<int> finalStates = new List<int>();

      foreach (StatePath curState in this.Values)
      {
        finalStates.Add(curState.state.id);
      }

      return finalStates;
    }

    public List<List<int>> GetKeyStatePaths(AllStates allStates = null, Dictionary<string, SimulationEngine.ResultState> resMap = null)
    {
      List<List<int>> finalStates = new List<List<int>>();

      foreach (StatePath curStatePath in this.Values)
      {
        if (curStatePath.state.stateType == EnStateType.stKeyState)
        {
          if (resMap != null)
          {
            State curFromState = null;
            SimulationEngine.ResultState curState;
            SimulationEngine.Cause curCause;
            if (resMap.ContainsKey(curStatePath.state.name))
            {
              curState = resMap[curStatePath.state.name];
            }
            else
            {
              curState = new SimulationEngine.ResultState(curStatePath.state.name);
              resMap.Add(curStatePath.state.name, curState);
            }
            

            for (int i = curStatePath.path.Count-1; i >= 0; i--)
            {
              curState.times.Add(curStatePath.times[i]);

              if (i > 0)
              {
                curFromState = allStates[curStatePath.path[i]];
                string evName = curStatePath.eventNames[i];
                string actName = curStatePath.actionNames[i];
                string causeKey = curFromState.name + ", " + evName + ", " + actName;
                
                if (curState.causeDict.ContainsKey(causeKey))
                {
                  curCause = curState.causeDict[causeKey];
                }
                else
                {
                  curCause = new SimulationEngine.Cause(evName + " -> " + actName, causeKey);
                  curState.causeDict.Add(causeKey, curCause);
                }

                if (curCause.fromState == null)
                {
                  curCause.fromState = new SimulationEngine.ResultState(curFromState.name);
                }

                curState = curCause.fromState;
              }
            }
          }

          curStatePath.path.Add(curStatePath.state.id);
          finalStates.Add(curStatePath.path);
        }
      }

      return finalStates;
    }

    //public MyBitArray ToBitArray()
    //{
    //  MyBitArray retArray = new MyBitArray(this.Keys.Max() + 1);
    //  foreach (int curKey in this.Keys.ToArray())
    //  {
    //    retArray[curKey] = true;
    //  }

    //  return retArray;
    //}
  }







  /// <summary>
  /// Main solve engine object
  /// </summary>
  public class StateTracker
  {
    /// <summary>
    /// logs events, actions, and state movement for debugging.
    /// </summary>
    //private NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();
    private NLog.Logger logger = NLog.LogManager.GetLogger("logfile");
    /// <summary>
    /// Que of time events, items get added to this list when a state is entered and it has any time based events. Items are removed if the owner state is exited.
    /// </summary>
    private TimeEventList timeEvList = new TimeEventList();
    /// <summary>
    /// list of events that have occurred but are awaiting processing.
    /// </summary>
    private List<EventListData> processEventList = new List<EventListData>();
    /// <summary>
    /// ids of states to process and add to current state list, second int is the ID of the from state, string is the name of the action that brought us to that state
    /// </summary>
    private List<Tuple<int, int, string, string>> nextStateQue = new List<Tuple<int,int, string, string>>(); 
    /// <summary>
    /// bitsets tracking items that have changed, used to determine what events need to be reevaluated.
    /// </summary>
    private ChangedIDs changedItems;
    /// <summary>
    /// list of all current states at a given time in the simulation run. Items are added when a new state is entered and removed if the owner state is exited.
    /// </summary>
    private CurrentStates curStates = new CurrentStates();
    /// <summary>
    /// list of all current conditional events that can occur. Items are added when a new state is entered and removed if the owner state is exited.
    /// </summary>
    private ConditionEventLists condEvList;
    /// <summary>
    /// external simulation server to process external events
    /// </summary>
    private EMRALDMsgServer sim3DServer;
    //todo store these in ExternalSim object and adjust code for multiple simulations
    private bool sim3DRunning = false;
    private bool sim3DStopping = false;
    private bool sim3DStarting = false;
    private bool inProcessingLoop = false;
    private TimeSpan sim3DStartTime;
    //private double sim3DFameRate;
    //private string sim3dPath;
    //private HoudiniSimClient.TLogEvCallBack p_logEvCallBack;
    private bool terminated = false;
    /// <summary>
    /// max time left
    /// </summary>
    private TimeSpan maxTime;
    /// <summary>
    /// current time of the executing simulation.
    /// </summary>
    private TimeSpan curTime; //time incriment counter from the start.
    private bool tempStateCngCheck = false; //see if there was a state change because of an external sim message 
    //public TLogEvCallBack logFunc = null;
    public bool keepExtSimEvs = true;
    //private bool debugLog = false;//todo remove
    //private TimeStateVariable toSave = null;
    //private TimeSpan sim3DStartTime;


    /// <summary>
    /// the main emerald model objects
    /// </summary>
    private EmraldModel allLists;

    public int keyStateCnt { get { return (from cs in curStates where cs.Value.state.stateType == EnStateType.stKeyState select cs).Count(); } }
    

    public StateTracker(
      EmraldModel inLists,
      TimeSpan endTime, //max time allowed for events to occur
      double in3dFrameRate,//todo remove obsolete
      EMRALDMsgServer inSim3DServer
      )
    {
      this.allLists = inLists;
      this.maxTime = endTime;
      this.curTime = new TimeSpan();
      this.sim3DServer = inSim3DServer;
      condEvList = new ConditionEventLists(curStates);
      SingleNextIDs.Instance.ResetTimerIDs();

      changedItems = new ChangedIDs(allLists.allVariables.maxID, allLists.allDiagrams.maxID, allLists.allStates.Keys.Max());

      SimVariable tempVar;
      tempVar = allLists.allVariables.FindByName("CurTime", false);
      if (tempVar == null)
      {

        allLists.allVariables.Add(new SimGlobVariable("CurTime", typeof(double), 0.0));
      }
      else
      {
        tempVar.SetValue(0.0);
      }

      tempVar = allLists.allVariables.FindByName("ExtSimStartTime", false);
      if (tempVar == null)
      {
        allLists.allVariables.Add(new SimGlobVariable("ExtSimStartTime", typeof(double), 0.0));
      }
      else
      {
        tempVar.SetValue(0.0);
      }

      //tempVar = allLists.allVariables.FindByName("Sim3DRunning");
      //if (tempVar == null)
      //{
      //  allLists.allVariables.AddVar(new SimVariable("Sim3DRunning", EnVarType.gtGlobal, 0.0));
      //}
      //else
      //{
      //  tempVar.value = 0.0;
      //}
      

      //set up the compOKList bitset to hold a bit for all components 
      //compOKList = new MyBitArray(inCompData.Keys.Max() + 1);
    }

    public void Reset()
    {
      this.timeEvList.Clear();
      this.processEventList.Clear();
      this.nextStateQue.Clear();
      //this.last3DVarEvType.Clear();
      this.changedItems.Clear();
      this.curStates.Clear();
      this.condEvList.Clear();
      //TODO : 
      //this.sim3D.SendAction(Reset Sim
      this.sim3DRunning = false;
      this.sim3DStarting = false;
      this.inProcessingLoop = false;
      this.terminated = false;
    }
       

    public List<int> StartTracker()
    {
      terminated = false;

      //reset variables that are marked that way
      foreach (var v in this.allLists.allVariables)
      {
        if (v.Value.resetOnRuns)
        {
          v.Value.ReInit();
        }
      }

      //process the Immediate Actions for initial states and load the TimeEventQue and CondEventList with initial data.
      if (!InitializeEventLists())
      {
        //hit terminal state upon initialization. Possible but strange
        return curStates.GetFinalStateList();
      }  


      //in case a 3d simulations starts up in the beginning
      while ((this.sim3DStopping || this.sim3DRunning || this.sim3DStarting) && (this.sim3DServer.ResourceCnt() > 0))
      {
        //Application.DoEvents();
        System.Threading.Thread.Sleep(10);
      }
      
      //do the process while there are still time events in the que and a terminal state is not met
      while (timeEvList.cnt > 0)
      {
        PopNextTimeEvent();

        //run through all the stuff until it needs a new timed event or it hits a terminal state
        if (! ProcessActiveLoop())
        {
          return curStates.GetFinalStateList();
        }

        while (this.sim3DStopping || this.sim3DStarting || this.sim3DRunning || inProcessingLoop)
        {
          //Application.DoEvents();
          System.Threading.Thread.Sleep(10);
        }
      }
      //MessageBox.Show("end sim");
      //logFunc("end sim" + Environment.NewLine);
      List<int> finalStates = curStates.GetFinalStateList();
      foreach(var sID in finalStates)
      {
        //update any accrual variables

        List<AccrualVariable> aVars = null;
        if (allLists.AccrualVars.TryGetValue(sID, out aVars))
        {
          foreach (var v in aVars)
          {
            v.Accrue(curTime, sID);
          }
        }
      }

      return finalStates;
    }
    /// <summary>
    /// An external simulation event occurred so process the event
    /// </summary>
    /// <param name="fromClient">the name of the external simulation where the event came from</param>
    /// <param name="evData">the message packet</param>
    void Sim3DEventOccurred(string fromClient, TMsgWrapper evData)
    {
      
      TimeSpan shiftTimeTo = new TimeSpan();
      bool sendTimers = false;
      int i = 0;
      foreach (var ev in evData.simEvents)
      {
        tempStateCngCheck = false;
        //etWaterContact=0, etWaterSubmerge=1, etTimer=2, etSubSim=3, etSimStarted=4, etEndSim=5
        switch (ev.evType)
        {
          case SimEventType.etEndSim:  //stop the simulation
            this.sim3DStarting = false;
            this.sim3DStopping = false;
            this.sim3DRunning = false;
            return;

          case SimEventType.etTimer: // if the event is a timer then just pop the next time event and let state tracker continue.
            if (this.sim3DStopping || !this.sim3DRunning)
            {
              //stop3DInEv = false;
              return;
            }

            PopNextTimeEvent();// TODO : evData.itemID);
            sendTimers = true;
            break;

          case SimEventType.etSimStarted:
            this.sim3DStartTime = this.curTime;
            sendTimers = true;
            this.sim3DRunning = true;
            this.sim3DStarting = false;
            break;

          //case SimEventType.etSubSim:
          //  //ignore these   
          //  return;

          case SimEventType.etStatus:
            if (ev.status == StatusType.stError)
              throw new Exception("Unhandled client simulation error - " + evData.desc);
            break;

          case SimEventType.etCompEv:
            if (this.sim3DStopping || !this.sim3DRunning)
            {
              return;
            }
            
            shiftTimeTo = (TimeSpan)ev.time; //If checked and passed with schema, this will not be null.
            if (shiftTimeTo == Globals.NowTimeSpan)
              shiftTimeTo = TimeSpan.FromMilliseconds(1) + sim3DStartTime;
            else
              shiftTimeTo = shiftTimeTo + sim3DStartTime;

            SimVariable curVar = allLists.allVariables.FindBySim3dId(ev.itemData.nameId);
            if (curVar != null)
            {
              //Create a extSim time event so it is processed
              //because all timeque events are sent to the simulation as timers, this event must be less than the next time event.
              if (keepExtSimEvs)
                this.timeEvList.ExternalEvOccurred(evData.desc + i.ToString(), ev, allLists, shiftTimeTo, sim3DStartTime);
              this.allLists.allVariables[curVar.id].SetValue(ev.itemData.value);
              this.changedItems.AddChangedID(EnModifiableTypes.mtVar, curVar.id);
            }
            
            break;

          default: //items are 3D variables that were affected
            break;

        }

        ++i;
      }
            

      //wait for state processing to be done.
      while (inProcessingLoop)
      {
        //Application.DoEvents();
        System.Threading.Thread.Sleep(10);
      }

      if (shiftTimeTo > Globals.NowTimeSpan)
      {
        //shift the time of events and set current time.
        this.timeEvList.ShiftEvTimes(shiftTimeTo - this.curTime);

        this.curTime = shiftTimeTo;
        allLists.allVariables.FindByName("CurTime").SetValue(curTime.TotalHours);
        
      }
     
            
      //Look for events that now meet conditions
      ScanCondEvList();
      //start a new round of processing
      if (!ProcessActiveLoop())
      {
        //sim3DServer.SendAction(new TActionPacketData(new TActionData(T3DActionType.atReset))); //let the simulation run.
        TMsgWrapper msg = new TMsgWrapper(MessageType.mtSimAction, "Reset", curTime, "Reset External Sim");
        msg.simAction = new SimAction(SimActionType.atReset);
        sim3DServer.SendMessage(msg, fromClient);
        this.sim3DStopping = true;
      }

      if (!this.sim3DStopping)
      {
        if (sendTimers || tempStateCngCheck)
        {
          Send3DNextEvTimers(fromClient);
        }

        //send the continue event to the 3D simulation
        //sim3DServer.SendAction(new TActionPacketData(new TActionData(T3DActionType.atContinue)));
        TMsgWrapper msg = new TMsgWrapper(MessageType.mtSimAction, "Continue", curTime, "Continue External Sim");
        msg.simAction = new SimAction(SimActionType.atContinue);
        sim3DServer.SendMessage(msg, fromClient);
      }

    }
    /// <summary>
    /// pop the next time event off the queue
    /// </summary>
    /// <param name="idMatch">if not -1 then only pop it off if the ID matches</param>
    private void PopNextTimeEvent(int idMatch = -1)
    {

      //timeEvList.PrintTimes();
      //pop the next time events and add them to the processEventList
      TimeMoveEvent nextItem = timeEvList.LookNextTimedEvent();
      if ((idMatch > -1) && (idMatch != nextItem.id))
      {
        return;
      }

      curTime = curTime + nextItem.time;
      maxTime = maxTime - nextItem.time;

      allLists.allVariables.FindByName("CurTime").SetValue(curTime.TotalHours);

      //debug - make sure none of the fail states are active
      //if (nextItem.name == "IE")
      //{

      //  string failedNames = "";
      //  bool show = false;
      //  foreach (StatePath item in this.curStates.Values)
      //  {
      //    failedNames = failedNames + Environment.NewLine + item.state.name;

      //    string itemName = item.state.name;
      //    if ((itemName == "A_Failed") || (itemName == "B_Failed"))
      //    {
      //      show = true;
      //    }
      //  }

      //  if (show)
      //  {
      //    MessageBox.Show(failedNames);
      //  }
      //}

      processEventList.AddRange(timeEvList.PopTimedEvent(curTime));      
    }

    /// <summary>
    /// /run through all the items/movements/events until we are in a halted state waiting for a time event
    /// </summary>
    /// <returns>returns false if the loop was terminated</returns>
    private bool ProcessActiveLoop()
    {
      inProcessingLoop = true;

      //loop through processing event or states while any are still in the queues, processing one can add to the other.
      while((!terminated) && ((processEventList.Count > 0) || (nextStateQue.Count > 0)))
      {
        //process all the events in the list before processing the next state
        while ((!terminated) && (processEventList.Count > 0))
        {
          ProcessEvent(processEventList[0]);
          processEventList.RemoveAt(0);
        }

        //while there are items in the Next State Queue, process them.
        while ((!terminated) &&(nextStateQue.Count > 0))
        {
          if (! ProcessState(nextStateQue[0])) //was a terminal state so quit;
          {
            inProcessingLoop = false;
            return false;
          }

          nextStateQue.RemoveAt(0);
        }

        //Look for events that now meet conditions
        if (!terminated)
          ScanCondEvList();
      }

      ////see if we need to save the current time and States 
      //if (this.toSave != null)
      //  SaveCurrentTimeState();

      inProcessingLoop = false;
      if (terminated)
        return false;

      return true;
    }
    /// <summary>
    /// run through all the initial states, process them, and do any events/actions that are not time related
    /// </summary>
    /// <returns></returns>
    private bool InitializeEventLists()
    {
      bool hadStartState = false;
      //go through all the states looking for initial states
      foreach (State curState in allLists.allStates.Values)
      {
        //process the initial states 
        if (curState.stateType == EnStateType.stStart)
        {
          hadStartState = true;
          if (! ProcessState(Tuple.Create(curState.id, -1, "", "")))
          {
            return false;
          }
          
        }
      }

      if (!hadStartState)
        throw new Exception("Model missing a start State");
      //make sure we handle any start state event conditions met
      ScanCondEvList();

      //run through all the stuff caused by loading the initial states.
      return ProcessActiveLoop();
    }
    /// <summary>
    /// Do all the actions for the given event if moved from a state remove it from the current state list
    /// </summary>
    /// <param name="curEv">list of an events actions to perform </param>
    private void ProcessEvent(EventListData curEv)
    {
      logger.Debug("DoEvent: " + curEv.name);

      foreach (var stID in curEv.eventStateActions.statesAndActions)
      {
        if (!ProcessActions((ActionList)stID.Value, stID.Key, curEv.eventData))
          return; //return of false means a time jump was done so we can stop processing
        
        if (((ActionList)stID.Value).moveFromCurrent) //leaving this state to go to a different one so remove any other events that also leave this state
        {          
          timeEvList.RemoveMatchingStateItems(stID.Key);
          condEvList.RemoveMatchingStateItems(stID.Key);

          //remove this state from the current list.
          TimeSpan inTime = curStates.RemoveState(stID.Key, curTime);
          //update any accrual variables
          List<AccrualVariable> aVars = null;
          if (allLists.AccrualVars.TryGetValue(stID.Key, out aVars))
          {
            foreach(var v in aVars)
            {
              if(v.Accrue(inTime, stID.Key))
                changedItems.AddChangedID(EnModifiableTypes.mtVar, v.id);
            }
          }

          string stateName = this.allLists.allStates[stID.Key].name;
          logger.Info("ExitState: " + stateName);

          //add the moved from state to the changed list since we moved from it
          changedItems.AddChangedID(EnModifiableTypes.mtState, stID.Key);          
        }
      }
    }

    /// <summary>
    /// process the given state. Execute all the immediate actions and add time or condition events to their lists 
    /// </summary>
    /// <param name="stateID">info of the state to process Tuple(ToState, FromState, action string)/></param>
    /// <returns></returns>
    private bool ProcessState(Tuple<int, int, string, string> stateID) //<ToState, FromState, event name, action name,>
    {
      //lookup the state from the ID
      State curState;
      try
      {
        curState = allLists.allStates[stateID.Item1];
      }
      catch(Exception)
      {
        return false;
      }
      tempStateCngCheck = true;
      //TransitionAct tAct = allLists.allActions.FindByName(stateID.Item3) as TransitionAct;
      curStates.Add(curState, stateID.Item2, this.curTime, stateID.Item3, stateID.Item4);
      changedItems.AddChangedID(EnModifiableTypes.mtState, stateID.Item1);

      //do all the immediate actions for the state
      ProcessActions(curState.GetImmediateActions(), curState.id, null);

      //add all the events to either the TimeEventQue or the CondEventList
      for (int idx = 0; idx < curState.eventCnt; ++idx)
      {
        Event curEv = curState.GetEventIdx(idx);

        if (Constants.CondEventTypes.Contains(curEv.evType))
        {
          //Condition event

          ConditionMoveEvent addCondEv = new ConditionMoveEvent(curEv.name, new EventStatesAndActions(curEv.id, curState.id, curState.GetEvActionsIdx(idx)), curEv);
          //add it to the condition list, if the condition is already met, it will be handled in the loop.
          condEvList.AddConditionEvent(addCondEv);
        }
        else
        {
          //Time based Event
          TimeBasedEvent timeEv = (TimeBasedEvent)curEv;

          if (timeEvList.HasEvent(curEv.id)) //TODO - All time events are common sampling add option for user
            timeEvList.AddEventStateActions(curEv.id, curState.id, curState.GetEvActionsIdx(idx));
          else
          {

            TimeSpan evTime = timeEv.NextTime();
            if (evTime < maxTime)
            {
              TimeMoveEvent addTimeEv = new TimeMoveEvent(curEv.name, new EventStatesAndActions(curEv.id, curState.id, curState.GetEvActionsIdx(idx)), curEv, evTime, curTime);
              if ((evTime == Globals.NowTimeSpan) && !this.sim3DStopping)// || //add the event to be processed immediately
                                                //todo : how to handle if next event is before the first timestep of a simulation 
                                                //if only one simulation you just process the event as an immediate ((this.sim3DRunning || this.sim3DStarting) && ((evTime.TotalSeconds * sim3DFameRate) < 1)))
              {
                processEventList.Add(addTimeEv);
              }
              else //add it to the time list to occur in the correct order.
              {
                timeEvList.AddTimedEvent(addTimeEv);
              }
            }
          }
          //else no need to add the event because it will not occur before the max time is up
        }
      }

      if (curState.stateType == EnStateType.stTerminal)
        terminated = true;

      return (curState.stateType != EnStateType.stTerminal);
    }

    /// <summary>
    /// go through the condition event list and look for events that have their criteria met.
    /// </summary>
    private void ScanCondEvList()
    {
      List<ConditionMoveEvent> matchedEvs = null;
      //Look for events that now meet conditions and add them to the processEventList
      TimeMoveEvent nextItem = timeEvList.LookNextTimedEvent();
      if(nextItem != null)
        //matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, this.last3DVarEvType, curTime, sim3DStartTime, nextItem.time);
        matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, curTime, sim3DStartTime, nextItem.time);
      else
        //matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, this.last3DVarEvType, curTime, sim3DStartTime, TimeSpan.FromHours(0));
        matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, curTime, sim3DStartTime, TimeSpan.FromHours(0));
      this.processEventList.AddRange(matchedEvs);
      changedItems.Clear();
    }

    //private void SaveCurrentTimeState()
    //{
    //  timeEvList.SaveCurrent(toSave, curTime);
    //  curStates.SaveCurrent(toSave);
    //  //(toSave).SaveProcessLists(this.processEventList, this.nextStateQue);
    //  toSave = null;
    //}
    /// <summary>
    /// Process the given actions and necessary steps depending on the action type. 
    /// </summary>
    /// <param name="curActions">action list to process</param>
    /// <param name="ownerStateID">state that actions are being run for</param>
    /// <returns></returns>
    private bool ProcessActions(ActionList curActions, int ownerStateID, Event causeEvent)
    {
      foreach(SimulationDAL.Action curAct in curActions)
      {
        switch (curAct.actType)
        {
          case EnActionType.atTransition:
            logger.Debug("DoTransitionAction: " + curAct.name);
            TransitionAct tCurAct = (curAct as TransitionAct);
                        
            //ProcessTransition((Transition)curAct);
            //add the new state to the NextStateQue
            List<IdxAndStr> toStates = tCurAct.WhichToState();
            foreach(IdxAndStr cur in toStates )
            {
              //only add it if we are currently not going to that state from another action
              if(nextStateQue.Where(t=>t.Item1 == cur.idx).FirstOrDefault() == null)
                nextStateQue.Add(Tuple.Create(cur.idx, ownerStateID, causeEvent == null ? "immediate action" : causeEvent.name, curAct.name));
            }
            break;

          case EnActionType.atCngVarVal:
            logger.Debug("DoChangeVarValueAction: " + curAct.name);
            //change Var values or add states depending on the action.
            SimVariable varItem = null;
            VarValueAct curVarAct = (curAct as VarValueAct);
            try
            {
              varItem = this.allLists.allVariables[curVarAct.varID];
            }
            catch (Exception e)
            {
              throw new Exception("Failed to find " + curVarAct.name + " in variable list.", e);
            }


            //if (curVarAct.isTimeStateVar)
            //{
            //  toSave = (TimeStateVariable)varItem;
            //}
            //else
              curVarAct.SetVal(varItem, this.allLists, curTime, sim3DStartTime);
            //TODO : if this is a 3D var item and we are running a 3D simulation notify the 3D simulator of the change.


            //add the ID to the changed list
            changedItems.AddChangedID(EnModifiableTypes.mtVar, curVarAct.varID);
            break;

          case EnActionType.atJumpToTime:
            logger.Debug("DoJumpToTimeAction: " + curAct.name);
            //change the current time to the result of this action.
            JumpToTimeAct timeJumpAct = (curAct as JumpToTimeAct);

            //TimeStateVariable savedSlot = timeJumpAct.SavedSlot();
            //if (savedSlot != null)
            //{
            //  TimeSpan newTime = TimeSpan.FromHours((double)savedSlot.value);
            //  this.timeEvList.RevertToTime(savedSlot);
            //  this.curStates.RevertToGivenTime(savedSlot);

            //  //make sure the processEventList and processStateQue is empty
            //  processEventList.RemoveRange(1, processEventList.Count - 1);
            //  nextStateQue.RemoveRange(0, nextStateQue.Count);
              
            //  maxTime = maxTime + (curTime - newTime);
            //  this.curTime = newTime;
            //}
            //else
            //{
              double temp = 0.0;
              timeJumpAct.SetVal(ref temp, this.allLists, curTime, sim3DStartTime);
              TimeSpan newTime = TimeSpan.FromHours(temp);

              if (newTime > curTime)
                throw new Exception("Attempted to jump forward in time, this not allowed. CurTime - " + curTime + " NewTime - " + newTime);

              this.timeEvList.RevertToTime(curTime, newTime);
              this.curStates.RevertToGivenTime(newTime, this.condEvList);

              //make sure the processEventList and processStateQue is empty
              processEventList.RemoveRange(1, processEventList.Count - 1);
              nextStateQue.RemoveRange(0, nextStateQue.Count);

              maxTime = maxTime + (curTime - newTime);
              this.curTime = newTime;
            //}

                        
            return false;

          case EnActionType.atRunExtApp:
            logger.Debug("DoRunExtApplicationAction: " + curAct.name);
            //change Var values or add states depending on the action.
            RunExtAppAct curRunExeAct = (curAct as RunExtAppAct);
            List<int> addStates = new List<int>();
            List<int> leaveStates = new List<int>();
            //create a dictionary with just the last state time.
            Dictionary<int, TimeSpan> curStatesTime = this.curStates.Select(i => i).ToDictionary(i => i.Key, i => i.Value.times[i.Value.times.Count - 1]);

            curRunExeAct.RunExtApp(curStatesTime, this.curTime, this.allLists, ref addStates, ref leaveStates);

            foreach (int id in leaveStates)
            {
              //keep the state doing this action if the action list wants it to move out of the state it will take care of it.
              //remove any events linked with this state from the lists
              timeEvList.RemoveMatchingStateItems(id);
              condEvList.RemoveMatchingStateItems(id);

              //remove this state from the current list.
              TimeSpan inTime = curStates.RemoveState(id, curTime);

              //update any accrual variables
              List<AccrualVariable> aVars = null;
              if (allLists.AccrualVars.TryGetValue(id, out aVars))
              {
                foreach (var v in aVars)
                {
                  if (v.Accrue(inTime, id))
                    changedItems.AddChangedID(EnModifiableTypes.mtVar, v.id);
                }
              }

              //add the moved from state to the changed list since we moved from it
              changedItems.AddChangedID(EnModifiableTypes.mtState, id);
              //}
            }

            foreach (int id in addStates)
            {
              var toAdd = Tuple.Create(id, ownerStateID, curAct.name);
              if (nextStateQue.Where(t => t.Item1 == id).FirstOrDefault() == null)
                nextStateQue.Add(Tuple.Create(id, ownerStateID, causeEvent==null ? "immediate action" : causeEvent.name, curAct.name));
            }

            break;

          case EnActionType.at3DSimMsg:
            logger.Debug("DoExternalSimMessageAction: " + curAct.name);
            //Send the message to the 3D simulation
            Sim3DAction cur3DAct = (Sim3DAction)curAct;

            if (cur3DAct.varID == null)
            {
              throw new Exception("No VarID for 3D Action.");
            }

            TMsgWrapper msg;
            switch (cur3DAct.sim3DMessage)
            {
              case SimActionType.atOpenSim:
                //stop3DInEv = false;
                msg = new TMsgWrapper(MessageType.mtSimAction, "OpenSim", curTime, "Start External Sim");
                msg.simAction = new SimAction(new SimInfo(cur3DAct.ModelRef(allLists), cur3DAct.simMaxTime, cur3DAct.ConfigData(allLists)));

                if (sim3DServer == null)
                  throw new Exception("External Simulation not assigned.");

                if(!sim3DServer.GetResources().Contains(cur3DAct.resourceName))
                {
                  throw new Exception("No external client code named - " + cur3DAct.resourceName);
                }

                allLists.allVariables.FindByName("ExtSimStartTime").SetValue(curTime.TotalHours);
                sim3DServer.evCallBackFunc = Sim3DEventOccurred;

                //TActionData startup = new TActionData(T3DActionType.atStartSim);
                //startup.time = (int)(sim3DFameRate * 1500); 
                //startup.itemName = sim3dPath;// "C:\\Program Files2\\INL_FUSimServer\\houdini\\hip\\fu_sim_testRoom_v12.hipnc";
                //if (sim3DServer.SendAction(new TActionPacketData(startup)))  //initialize it
                if (sim3DServer.SendMessage(msg, cur3DAct.resourceName))
                {
                  sim3DStarting = true;  
                  sim3DStopping = false;
                  while (!this.sim3DRunning)
                  {
                    //Application.DoEvents();
                    System.Threading.Thread.Sleep(10);
                  }
                }
                else //already running so set correct params.
                {
                  this.sim3DStartTime = this.curTime;
                  this.sim3DStarting = false;
                  this.sim3DRunning = true;
                  this.sim3DStopping = false;
                }
          
                break;

              case SimActionType.atCompModify:
                logger.Debug("DoComponentModifyAction: " + curAct.name);
                //wait to make sure the 3D sim has started
                while ((!this.sim3DRunning) && (!this.sim3DStopping))
                {
                  if (!this.sim3DStarting)
                  {
                    return true;
                  }

                  //Application.DoEvents();
                  System.Threading.Thread.Sleep(10);
                }

                Sim3DVariable curVar = cur3DAct.simVar;
                                  
                if (curVar == null)
                  throw new Exception("No value to send to the 3D simulation.");
                  
                string itemName = curVar.name;

                string setValue;
                switch (cur3DAct.simVar.dType.Name.ToUpper().Substring(0, 4))
                {
                  case "INT":
                  case "INT3":
                  case "DOUB":
                  case "BOOL":
                  case "TIME":
                    setValue = curVar.dblValue.ToString();   
                    break;
                  case "STRI":
                    setValue =curVar.strValue;
                    break;
                  default:
                    throw new Exception("Invalid Variable type");                    
                }

                msg = new TMsgWrapper(MessageType.mtSimAction, "SetSimValue", curTime, "Adjust External Sim");
                msg.simAction = new SimAction(SimActionType.atCompModify, curTime, new ItemData(cur3DAct.simVar.name, setValue));

                sim3DServer.SendMessage(msg, cur3DAct.resourceName);
                //sim3DServer.SendAction(new TActionPacketData(sendVal));

                break;

              default :
                msg = new TMsgWrapper(MessageType.mtSimAction, cur3DAct.sim3DMessage.ToString(), curTime, "Stop/Continue/ping/status the Simulation");
                msg.simAction = new SimAction(cur3DAct.sim3DMessage);

                if ((cur3DAct.sim3DMessage == SimActionType.atReset) ||
                    (cur3DAct.sim3DMessage == SimActionType.atCancelSim))
                {
                  //debugLog = true; //todo remove
                  if ((this.sim3DRunning) && (!this.sim3DStopping))
                  {
                    this.sim3DStopping = true;
                    sim3DServer.SendMessage(msg, cur3DAct.resourceName); 
                    
                    //while (this.sim3DRunning)
                    //{
                    //  Application.DoEvents();
                    //  System.Threading.Thread.Sleep(10);
                    //}
                    //sim3DServer.Clear();
                  }
                }
                else
                {
                  sim3DServer.SendMessage(msg, cur3DAct.resourceName);
                }
                break;
            }

            //add the ID to the changed list
            changedItems.AddChangedID(EnModifiableTypes.mtVar, (int)cur3DAct.varID);

            break;
        }
      }
      return true;
    }
    
    /// <summary>
    /// Send next event/s to coupled external simulations
    /// </summary>
    /// <param name="toClient"></param>
    private void Send3DNextEvTimers(string toClient)
    {
      if (timeEvList.cnt > 0)
      {
        TimeMoveEvent nextTimeItem = timeEvList.LookNextTimedEvent();
        
        //int nextItemTime = Convert.ToInt32(((nextTimeItem.time + this.curTime) - this.sim3DStartTime).TotalSeconds * sim3DFameRate);
        TimeSpan nextItemTime =(nextTimeItem.time + this.curTime);

        var msg = new TMsgWrapper(MessageType.mtSimAction, "SetCallbackTimer", curTime, "Check back with the EMRALD Simulation");
        msg.simAction = new SimAction(SimActionType.atTimer, nextItemTime, new ItemData(nextTimeItem.name, nextTimeItem.id.ToString()));

        //make sure the 3DSim is fully started before the message is sent.
        while (!this.sim3DRunning)
        {
          //Application.DoEvents();
          System.Threading.Thread.Sleep(500);
        }

        //sim3DServer.SendAction(new TActionPacketData(new TActionData(T3DActionType.atTimer, nextTimeItem.name, nextTimeItem.id, nextItemTime)));
        sim3DServer.SendMessage(msg, toClient);
      }
    }
    
    /// <summary>
    /// Get the paths of movement from start states to the key states for the simulation run
    /// </summary>
    /// <returns></returns>
    public List<List<string>> GetKeyPaths(Dictionary<string, SimulationEngine.ResultState> resMap)
    {
      List<List<string>> retList = new List<List<string>>();

      foreach (List<int> stPath in curStates.GetKeyStatePaths(allLists.allStates, resMap))
      {
        List<string> curList = new List<string>();
        foreach (int id in stPath)
        {
          if(id > 0)
          {
            
            curList.Add(allLists.allStates[id].name);
          }
        }

        retList.Add(curList);
      }

      return retList;
    }

    /// <summary>
    /// get the path from the start state to the given key state.
    /// </summary>
    /// <param name="keyStateName"></param>
    /// <returns>lists of state ids in order from start to each ending key state</returns>
    public List<int> GetStatePath(string keyStateName)
    {
      State findState = this.allLists.allStates.FindByName(keyStateName);
      StatePath sPath = curStates[findState.id];
      return sPath.path;
    }

    /// <summary>
    /// get all the component diagrams that are in the boolean failed condition upon exit of the simulation run
    /// </summary>
    /// <returns>state ids in order from start to key state</returns>
    public StatePath[] GetFailedComponents()
    {
      List<StatePath> retList = new List<StatePath>();

      foreach (StatePath curStateInfo in curStates.Values)
      {
        //Use this instead to get all states
        //retList.Add(curStateInfo.state.id);

        if ((curStateInfo.state.diagram is CompDiagram) && ((CompDiagram)curStateInfo.state.diagram).IsFailedState(curStateInfo.state.id))
        {
          retList.Add(curStateInfo);
        }
      }

      return retList.ToArray();
    }

    /// <summary>
    /// get all the items in the current state list
    /// </summary>
    /// <returns>ids of the current states</returns>
    public int[] GetCurrentStates()
    {
      List<int> retList = new List<int>();

      foreach (StatePath curStateInfo in curStates.Values)
      {
        retList.Add(curStateInfo.state.id);
      }

      return retList.ToArray();
    }

    //public List<Tuple<int, TimeSpan, String>> GetFailedComponentsDetailed()
    //{
    //  List<Tuple<int, TimeSpan, String>> retList = new List<Tuple<int, TimeSpan, String>>();

    //  foreach (StatePath curStateInfo in curStates.Values)
    //  {
    //    if (curStateInfo.state.diagram is CompDiagram)
    //    {
    //      retList.Add(Tuple.Create(curStateInfo.state.diagram.id, curStateInfo.time, curStateInfo.leadingAction));
    //    }
    //  }

    //  return retList;
    //}
  }
}
