using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimulationDAL;
using MyStuff.Collections;
using MultiKeyDict;
using Sop.Collections.Generic.BTree;
using MessageDefLib;

namespace SimulationEngineHelper
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

  public class ConditionMoveEvent : EventListData
  {
    public ConditionMoveEvent(String name, EventStatesAndActions inStEvID, Event inEventData)
      : base(name, inStEvID, inEventData)
    { }

    //placeholder for any extra info for condition events;
  }


  /// <summary>
  /// Conditional events list and method to evaluate if events are triggered
  /// </summary>
  public class ConditionEventLists
  {
    private CurrentStates curStates;
    private Dictionary<EventStatesAndActions, ConditionMoveEvent>[] evLists; //lists to hold the different kind of condition, array by eventtype
    private Dictionary<int, List<EventStatesAndActions>>[] stateRefLookups; //lookup keys for all condition events from the same state.
    private Dictionary<ConditionMoveEvent, bool> initialCondEvalDone; //make sure all events are returned at least after fist added even if no related items have changed.




    public ConditionEventLists(CurrentStates curStates)
    {
      this.curStates = curStates;
      int cnt = (int)Enum.GetValues(typeof(EnEventType)).Cast<EnEventType>().Last() + 1;
      evLists = new Dictionary<EventStatesAndActions, ConditionMoveEvent>[cnt];
      stateRefLookups = new Dictionary<int, List<EventStatesAndActions>>[cnt];
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

    public List<ConditionMoveEvent> GetMatchedCondMoveEvents(ChangedIDs changedItems, /*Dictionary<int, SimEventType> lastEvTypes,*/ TimeSpan curTime, TimeSpan start3DTime, TimeSpan nextEvTime, int runIdx)
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
                curIDType = EnModifiableTypes.mtState;
                otherData = changedItems;
                break;

              case EnEventType.etComponentLogic:
                curIDType = EnModifiableTypes.mtState;
                break;

              default:
                return retList;
            }

            if (initialCondEvalDone.ContainsKey(item)) //initialCondEvalDone[item] == false) //make sure each event is evaluated to start off with, then only if the related items change.
            {
              if ((curIDType == EnModifiableTypes.mtVar) &&
                  (item.eventData as CondBasedEvent).EventTriggered(curStatesBS, otherData, curTime, start3DTime, nextEvTime, runIdx)) //see if the code is triggered
              {
                retList.Add(item);
              }
              else if ((curIDType == EnModifiableTypes.mtState) &&
                  (curStatesBS.HasCommonBits(item.eventData.relatedIDsBitSet) || !(item.eventData as StateCngEvent).ifInState) && //in cur states or not wanting in current states
                  (item.eventData as CondBasedEvent).EventTriggered(curStatesBS, otherData, curTime, start3DTime, nextEvTime, runIdx))
              {
                retList.Add(item);
              }
              initialCondEvalDone.Remove(item);
            }

            else if ((item.eventData.relatedIDsBitSet != null) && (changedItems.HasApplicableItems(curIDType, item.eventData.relatedIDsBitSet)) &&
               ((item.eventData as CondBasedEvent).EventTriggered(curStatesBS, otherData, curTime, start3DTime, nextEvTime, runIdx)))
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
    { }
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

    public void ChangeEventTime(TimeSpan newTime, int evID)
    {
      //change the time for the event and move in que

      List<TimeSpan> refs;
      if (eventRefLookup.TryGetValue(evID, out refs))
      {
        TimeMoveEvent cngItem = null;
        foreach (TimeSpan refTime in refs)
        {
          //find the item in timedEvQue with the key of refTime and value that has the correct evID   
          if (timedEvQue.Search(refTime, true))
          {
            do
            {
              if (timedEvQue.CurrentValue.eventStateActions.eventID == evID)
              {
                //remove the event, it has a bad key/time
                cngItem = (TimeMoveEvent)timedEvQue.CurrentValue;
                timedEvQue.Remove();
                break;
              }
            }
            while (timedEvQue.MoveNext() && timedEvQue.CurrentKey == refTime);
          }
        }

        //put the event back with the new time
        if (cngItem != null)
        {
          cngItem.time = newTime;
          timedEvQue.Add(newTime, cngItem);
        }
      }
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
      if (poppedList.Count > 0)
      {
        int idx = poppedList.Count - 1;
        TimeMoveEvent emEv = poppedList[idx];

        while ((emEv.whenCreated + emEv.time) > revertTo) //event will happen after the revert to time
        {
          if (emEv.whenCreated <= revertTo) //event was created when or before the revert to time.
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




}
