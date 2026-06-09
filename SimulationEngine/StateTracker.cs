// Copyright 2021 Battelle Energy Alliance
// Tracks the active event queue and current state assignments for a single simulation run, driving state transitions over time.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using Matrix.Xmpp.XHtmlIM;
using MessageDefLib;
using MultiKeyDict;
//using System.Windows.Forms;
using MyStuff.Collections;
using Newtonsoft.Json;
using SimulationDAL;
using Sop.Collections.Generic.BTree;
using XmppMessageServer;

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
  }

  public class TimeMoveEvent : EventListData
  {
    public TimeSpan time; //absolute simulation time the event will occur (also used as the queue key)
    public TimeSpan whenCreated; //absolute simulation time the item was created
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

  public class StateTransition
  {
    public int StateId { get; set; }
    public int FromStateId { get; set; }
    public string ActionName { get; set; }
    public string AdditionalInfo { get; set; }

    public StateTransition(int stateId, int fromStateId, string actionName, string additionalInfo)
    {
      StateId = stateId;
      FromStateId = fromStateId;
      ActionName = actionName;
      AdditionalInfo = additionalInfo;
    }
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
    // Cached once — Enum.GetValues allocates a new array on every call, and the hot paths
    // (Clear, RemoveMatchingStateItems, GetMatchedCondMoveEvents prep) all iterate it.
    private static readonly EnEventType[] AllEventTypes = Enum.GetValues<EnEventType>();

    private CurrentStates curStates;
    private Dictionary<EventStatesAndActions, ConditionMoveEvent>[] evLists; //lists to hold the different kind of condition, array by eventtype
    private Dictionary<int, List<EventStatesAndActions>>[] stateRefLookups; //lookup keys for all condition events from the same state.
    private Dictionary<ConditionMoveEvent, bool> initialCondEvalNotDone; //make sure all events are returned at least after fist added even if no related items have changed.




    public ConditionEventLists(CurrentStates curStates)
    {
      this.curStates = curStates;
      int cnt = (int)AllEventTypes[^1] + 1;
      evLists = new Dictionary<EventStatesAndActions, ConditionMoveEvent>[cnt];
      stateRefLookups = new Dictionary<int, List<EventStatesAndActions>>[cnt];
      initialCondEvalNotDone = new Dictionary<ConditionMoveEvent, bool>();
      foreach (EnEventType itemType in AllEventTypes)
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
      initialCondEvalNotDone.Clear();
      foreach (EnEventType itemType in AllEventTypes)
      {

        if (evLists[(int)itemType] != null)
        {
          evLists[(int)itemType].Clear();
        }
        if (stateRefLookups[(int)itemType] != null)
        {
          stateRefLookups[(int)itemType].Clear();
        }
      }

    }

    public void AddConditionEvent(ConditionMoveEvent addEv)
    {
      if (evLists[(int)addEv.eventData.evType] == null)
      {
        throw new Exception("Event Type " + Enum.GetName(typeof(EnEventType), addEv.eventData.evType) + " has no Condition list set up. StateTracker.cs AddConditionEvent() ");
      }

      evLists[(int)addEv.eventData.evType].Add(addEv.eventStateActions, addEv);
      initialCondEvalNotDone.Add(addEv, true);

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
      foreach (EnEventType itemType in AllEventTypes)
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

    public List<ConditionMoveEvent> GetMatchedCondMoveEvents(ChangedIDs changedItems, Dictionary<string, SimEventType> lastExtEvTypes, TimeSpan curTime, TimeSpan start3DTime, TimeSpan nextEvTime, int runIdx, MyBitArray toStates)
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
            // Cache the cast once per item — the inner branches use it 1-2 times each
            // and the cast isn't free (type check + reference assignment per call).
            CondBasedEvent condEv = item.eventData as CondBasedEvent;

            switch (item.eventData.evType)
            {
              case EnEventType.et3dSimEv:
                curIDType = EnModifiableTypes.mtExtEv;
                otherData = lastExtEvTypes;
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
                otherData = item.eventStateActions.statesAndActions.Keys.First();
                break;

              default:
                return retList;
            }

            if (initialCondEvalNotDone.ContainsKey(item)) //make sure each event is evaluated to start off with, then only if the related items change.
            {
              switch (curIDType)
              {
                //only evaluate these event types when initially entering a state
                case EnModifiableTypes.mtExtEv:
                case EnModifiableTypes.mtVar: //don't check if there are related IDs for these
                  if (condEv.EventTriggered(curStatesBS, otherData, curTime, start3DTime, nextEvTime, true, runIdx)) //see if the code is triggered)
                    retList.Add(item);
                  break;
                case EnModifiableTypes.mtState:
                  if ((curStatesBS.HasCommonBits(item.eventData.relatedIDsBitSet) || ((item.eventData is StateCngEvent) && !(item.eventData as StateCngEvent).ifInState)) && //in cur states or not wanting in current states
                      condEv.EventTriggered(curStatesBS, otherData, curTime, start3DTime, nextEvTime, true, runIdx))
                    retList.Add(item);
                  break;
                default:
                  break;
              }
              initialCondEvalNotDone.Remove(item);
            }
            else
            {
              switch (curIDType)
              {
                //only evaluate these event types when initially entering a state
                case EnModifiableTypes.mtExtEv:
                  if ((changedItems.HasApplicableItems(curIDType, item.eventData.relatedIDsBitSet)) &&
                     (condEv.EventTriggered(curStatesBS, otherData, curTime, start3DTime, nextEvTime, false, runIdx)))
                    retList.Add(item);
                  break;

                default:
                  //if logic we need to make sure if we not evauating if we are about to move into a new state that is in the logic tree component evaluation
                  if ((item.eventData.evType != EnEventType.etComponentLogic) || (item.eventData.relatedIDsBitSet.And(toStates).BitCount() == 0))
                  {
                    if ((item.eventData.relatedIDsBitSet != null) && (changedItems.HasApplicableItems(curIDType, item.eventData.relatedIDsBitSet)) &&
                          (condEv.EventTriggered(curStatesBS, otherData, curTime, start3DTime, nextEvTime, false, runIdx)))
                      retList.Add(item);
                  }

                  break;
              }
            }
          }
        }
      }

      //clear the initial eval list so we don't check them again and we have an empty list for the next round.
      initialCondEvalNotDone.Clear();

      return retList;
    }
  }

  /// <summary>
  /// Time Event Que for items that are in current states
  /// </summary>
  class TimeEventList
  {
    //Queue of timed events keyed by their ABSOLUTE occurrence time (sim time the event will fire).
    //Because keys are absolute, advancing the clock never requires re-keying the queue.
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
                EventStatesAndActions rem = timedEvQue.CurrentValue.eventStateActions;
                List<TimeSpan> times2;
                if (eventRefLookup.TryGetValue(rem.eventID, out times2))
                {
                  if (times2.Count > 1)
                  {
                    times2.Remove(refTime);
                  }
                  else
                  {
                    eventRefLookup.Remove(rem.eventID);
                  }
                }
                if (rem.statesAndActions.Count == 1)
                {
                  timedEvQue.Remove();
                }

                else
                  rem.RemoveStateActions(stateID);
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
        //get the first item or all items with the same lowest (absolute) occurrence time.
        timedEvQue.MoveFirst();
        TimeSpan firstKey = timedEvQue.CurrentKey;
        while ((timedEvQue.Count > 0) && (timedEvQue.CurrentKey == firstKey))
        {
          TimeMoveEvent tEv = (TimeMoveEvent)timedEvQue.CurrentValue;
          //tEv.time already holds the absolute occurrence time (== firstKey), no adjustment needed.
          retEvs.Add(tEv);
          poppedList.Add(tEv);
          timedEvQue.Remove();
          timedEvQue.MoveFirst();
        }

        //Rebuild the ID lookups from the remaining queue. The old design did this inside ShiftEvTimes
        //on every pop; doing it here preserves that behavior (lookups are refreshed each pop and may be
        //momentarily stale between a ChangeEventTime and the next pop) without re-keying the whole queue.
        RebuildLookups();
      }

      return retEvs;
    }

    public void ExternalEvOccurred(String evDispName, SimEvent evData, EmraldModel allLists, TimeSpan curTime, TimeSpan simExtStartTime)
    {
      if (evData.evType == SimEventType.etCompEv)
      {
        SimVariable setVar = allLists.allVariables.FindBySim3dId(evData.itemData.nameId);
        VarValueAct act = new VarValueAct(evData.itemData.nameId + "_3D_Assign", setVar, "return " + evData.itemData.value + ";", typeof(double), null);
        ActionList actList = new ActionList();
        actList.Add(act);
        Event nowEv = allLists.allEvents.FindByName("ExtSimEv_", false);
        if (nowEv == null)
        {
          nowEv = new ExtSimEventPlaceholder("Now");
        }
        EventStatesAndActions key = new EventStatesAndActions(nowEv.id, 0, actList);

        //occurs "now" so the absolute occurrence time is the current sim time.
        TimeMoveEvent extEv = new TimeMoveEvent(evDispName, key, nowEv, curTime, simExtStartTime);
        poppedList.Add(extEv);
      }
      else
      {
        Event nowEv = new ExtSimEventPlaceholder("Now");
        EventStatesAndActions key = new EventStatesAndActions(nowEv.id, 0, new ActionList());
        TimeMoveEvent extEv = new TimeMoveEvent(evDispName, key, nowEv, curTime, simExtStartTime);
        AddTimedEvent(extEv);
      }

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
      //change the absolute occurrence time for the event and move it in the que.
      //NOTE: the ID lookups are intentionally NOT updated here; they are refreshed on the next pop
      //(see RebuildLookups in PopTimedEvent). This matches the original behavior where lookups could be
      //momentarily stale between a time change and the next time event.

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

    public void RevertToTime(TimeSpan curTime, TimeSpan revertTo)
    {
      //TODO this is not correct because we are missing items that were not popped off but RemoveMatchingStateItems
      //  from the time we are reverting to, to the current time.  Need to somehow save all the removed items also

      //Because keys are absolute occurrence times, queued events keep their key when time rewinds.
      //We only drop events that were created at or after the revert-to time (they shouldn't exist yet).
      BTreeDictionary<TimeSpan, TimeMoveEvent> newList = new BTreeDictionary<TimeSpan, TimeMoveEvent>();
      stateRefLookup.Clear();
      eventRefLookup.Clear();

      if (timedEvQue.MoveFirst())
      {
        do
        {
          TimeSpan key = timedEvQue.CurrentKey;
          TimeMoveEvent item = (TimeMoveEvent)timedEvQue.CurrentValue;
          if (item.whenCreated < revertTo)
          {
            newList.Add(key, item);
            AddIDLookups(item.eventStateActions, key);
          }
        }
        while (timedEvQue.MoveNext());
      }


      timedEvQue.Clear();
      timedEvQue = newList;

      //put back time events that were popped during this block of time but occur after the revert to time.
      if (poppedList.Count > 0)
      {
        int idx = poppedList.Count - 1;
        TimeMoveEvent emEv = poppedList[idx];

        while (emEv.time > revertTo) //event (absolute occurrence time) will happen after the revert to time
        {
          if (emEv.whenCreated <= revertTo) //event was created when or before the revert to time.
          {
            //occurrence time is absolute so no adjustment is needed, just re-queue it.
            timedEvQue.Add(emEv.time, emEv);
            AddIDLookups(emEv.eventStateActions, emEv.time);
          }

          poppedList.Remove(emEv);
          --idx;
          if ((idx >= 0) && (poppedList.Count > idx))
            emEv = poppedList[idx];
          else
            break;
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

    /// <summary>
    /// Rebuild the state/event ID lookups from the current contents of the queue. Called after popping
    /// time events (the old design did this within ShiftEvTimes). With absolute-time keys the queue itself
    /// never needs re-keying, but the lookups still need refreshing to match the current keys.
    /// </summary>
    public void RebuildLookups()
    {
      stateRefLookup.Clear();
      eventRefLookup.Clear();

      if (timedEvQue.MoveFirst())
      {
        do
        {
          AddIDLookups(timedEvQue.CurrentValue.eventStateActions, timedEvQue.CurrentKey);
        }
        while (timedEvQue.MoveNext());
      }
    }
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
    private Queue<EventListData> processEventList = new Queue<EventListData>();
    /// <summary>
    /// ids of states to process and add to current state list, second int is the ID of the from state, string is the name of the action that brought us to that state
    /// </summary>
    private Queue<StateTransition> nextStateQue = new Queue<StateTransition>();
    /// <summary>
    /// Shadow set of StateIds currently in nextStateQue, kept in sync with enqueue/dequeue.
    /// Used for O(1) "is this state already queued?" checks that previously did a linear scan via LINQ.
    /// </summary>
    private HashSet<int> nextStateIds = new HashSet<int>();
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
    private ISimMessaging sim3DServer;
    //todo store these in ExternalSim object and adjust code for multiple simulations
    private volatile bool extSimRunning = false;
    private volatile bool emraldStopping3D = false;
    private volatile bool extSimStarting = false;
    private StatusType prevExtSimState = StatusType.stIdle;
    private StatusType curExtSimState = StatusType.stIdle;
    private List<string> stopped3DSims = new List<string>();
    private bool inProcessingLoop = false;
    private TimeSpan sim3DStartTime;
    private bool terminated = false;
    private TimeSpan settingsMaxTime;
    /// <summary>
    /// max time left
    /// </summary>
    private TimeSpan maxTime;
    /// <summary>
    /// current time of the executing simulation.
    /// </summary>
    private TimeSpan curTime; //time incriment counter from the start.
    public bool keepExtSimEvs = true;

    //keep track of last external events so that we can trigger internal events if needed
    Dictionary<string, SimEventType> lastExtEvTypes = new Dictionary<string, SimEventType>();

    //Save Persistent events so they only get resampled if past the sampled time. 
    private Dictionary<string, TimeMoveEvent> PersistentEvs = new Dictionary<string, TimeMoveEvent>();

    //private bool debugLog = false;//todo remove
    //private TimeStateVariable toSave = null;
    //private TimeSpan sim3DStartTime;


    /// <summary>
    /// the main emerald model objects
    /// </summary>
    private EmraldModel allLists;

    // Cached subsets of allLists.allVariables. Each was previously found by re-scanning the full
    // variable dictionary on every simulation run (resetOnRunsVars in StartTracker) or every time
    // a RunExtApp action completed (docLinkVariables in ProcessActions).
    private List<SimVariable> docLinkVariables;
    private List<SimVariable> resetOnRunsVars;
    // Cached reference to the CurTime SimVariable so PopNextTimeEvent doesn't FindByName per pop.
    private SimVariable curTimeVar;

    public int keyStateCnt { get { return (from cs in curStates where cs.Value.state.stateType == EnStateType.stKeyState select cs).Count(); } }


    public StateTracker(
      EmraldModel inLists,
      TimeSpan endTime, //max time allowed for events to occur
      ISimMessaging inSim3DServer,
      int desiredRuns
      )
    {
      this.allLists = inLists;
      this.settingsMaxTime = endTime;
      this.sim3DServer = inSim3DServer;
      this.allLists.totRunsReq = desiredRuns;
      condEvList = new ConditionEventLists(curStates);

      changedItems = new ChangedIDs(allLists.allVariables.maxID, allLists.allDiagrams.maxID, allLists.allStates.Keys.Max());

      // Pre-compute the variable subsets used in the simulation hot paths so we don't have to
      // scan allVariables on every run (resetOnRunsVars) or after every external-app launch
      // (docLinkVariables).
      docLinkVariables = new List<SimVariable>();
      resetOnRunsVars = new List<SimVariable>();
      foreach (SimVariable v in allLists.allVariables.Values)
      {
        if (v == null) continue;
        if (v.varScope == EnVarScope.gtDocLink)
          docLinkVariables.Add(v);
        if (v.resetOnRuns)
          resetOnRunsVars.Add(v);
      }
    }

    public void Reset()
    {
      this.timeEvList.Clear();
      this.processEventList.Clear();
      this.nextStateQue.Clear();
      this.nextStateIds.Clear();
      this.lastExtEvTypes.Clear();
      this.changedItems.Clear();
      this.curStates.Clear();
      this.condEvList.Clear();
      this.stopped3DSims.Clear();
      this.curTime = new TimeSpan();
      this.PersistentEvs.Clear();

      //TODO : 
      //this.sim3D.SendAction(Reset Sim
      this.extSimRunning = false;
      this.extSimStarting = false;
      this.inProcessingLoop = false;
      this.terminated = false;
      this.maxTime = settingsMaxTime;

      SimVariable tempVar;
      tempVar = allLists.allVariables.FindByName("CurTime", false);
      if (tempVar == null)
      {
        tempVar = new SimGlobVariable("CurTime", typeof(double), 0.0);
        allLists.allVariables.Add(tempVar);
      }
      else
      {
        tempVar.SetValue(0.0);
      }
      curTimeVar = tempVar; // cache for PopNextTimeEvent's per-event SetValue call

      tempVar = allLists.allVariables.FindByName("ExtSimStartTime", false);
      if (tempVar == null)
      {
        allLists.allVariables.Add(new SimGlobVariable("ExtSimStartTime", typeof(double), 0.0));
      }
      else
      {
        tempVar.SetValue(0.0);
      }

      SingleNextIDs.Instance.ResetTimerIDs();

      allLists.allEvents.Reset();
    }


    public List<int> StartTracker()
    {
      this.Reset();

      terminated = false;
      this.allLists.curRunIdx++;
      List<int> retResults = null;

      //reset variables that are marked that way (cached subset, avoids full-variable scan per run)
      foreach (var v in resetOnRunsVars)
      {
        v.ReInit();
      }

      //process the Immediate Actions for initial states and load the TimeEventQue and CondEventList with initial data.
      if (!InitializeEventLists())
      {
        //hit terminal state upon initialization. Possible but strange
        retResults = curStates.GetFinalStateList();
        terminated = true;
      }

      bool ranXMPPSim = false;
      //in case a 3d simulations starts up in the beginning
      while ((this.emraldStopping3D || this.extSimRunning || this.extSimStarting) && (this.sim3DServer.ResourceCnt() > 0))
      {
        //Application.DoEvents();
        ranXMPPSim = true;
        System.Threading.Thread.Sleep(10);
      }

      //do the process while there are still time events in the que and a terminal state is not met
      while ((timeEvList.cnt > 0) && !terminated)
      {
        if (PopNextTimeEvent())
        {

          //run through all the stuff until it needs a new timed event or it hits a terminal state
          if (!ProcessActiveLoop())
          {
            retResults = curStates.GetFinalStateList();
            terminated = true;
          }

          ranXMPPSim = false;
          while (!terminated && (this.emraldStopping3D || this.extSimStarting || this.extSimRunning || inProcessingLoop))
          {
            //Application.DoEvents();
            ranXMPPSim = true;
            System.Threading.Thread.Sleep(10);
          }
        }
      }

      if (!terminated)
        curTime = settingsMaxTime;

      if (ranXMPPSim) //for all the XMPP simulations that ran send a final continue now that all other processing is done
      {
        TMsgWrapper msg2 = new TMsgWrapper(MessageType.mtSimAction, "Continue", curTime, "Current EMRALD run done, continue ext Sim");
        foreach (var name in stopped3DSims)
        {
          msg2.simAction = new SimAction(SimActionType.atContinue);

          sim3DServer.SendMessage(msg2, name);
        }

      }

      //MessageBox.Show("end sim");
      //logFunc("end sim" + Environment.NewLine);
      List<int> finalStates = curStates.GetFinalStateList();
      foreach (var sID in finalStates)
      {
        //update any accrual variables

        List<AccrualVariable> aVars = null;
        if (allLists.AccrualVars.TryGetValue(sID, out aVars))
        {
          foreach (var v in aVars)
          {
            var timeInIt = curTime - curStates[sID].times.Last();
            v.Accrue(timeInIt, sID);
          }
        }
      }

      return finalStates;
    }

    public void SendExtSimTerminate()
    {
      //send message to all ext sims to terminate
      TMsgWrapper msg = new TMsgWrapper(MessageType.mtSimAction, "Done", curTime, "Terminating all");
      msg.simAction = new SimAction(SimActionType.atTerminate);
      msg.simAction.status = StatusType.stDone;
      foreach (var name in stopped3DSims)
      {
        sim3DServer.SendMessage(msg, name);
      }
    }

    /// <summary>
    /// An external simulation event occurred so process the event
    /// </summary>
    /// <param name="fromClient">the name of the external simulation where the event came from</param>
    /// <param name="evData">the message packet</param>
    void Sim3DEventOccurred(string fromClient, TMsgWrapper evData)
    {

      TimeSpan shiftTimeTo = new TimeSpan();

      int i = 0;
      //clear the tracking of last events recieved
      lastExtEvTypes.Clear();
      bool doProcessLoop = false;

      foreach (var ev in evData.simEvents)
      {
        string lastEvKey = fromClient + "-" + ev.evType.ToString();
        if (ev.itemData != null)
        {
          lastEvKey += "_" + ev.itemData.nameId;
          if (ev.itemData.value != null)
          {
            lastEvKey += "_" + ev.itemData.value.ToString();
          }
        }

        if (lastExtEvTypes.ContainsKey(lastEvKey))
        {
          logger.Info("Duplicate external event - " + JsonConvert.SerializeObject(ev));
        }
        else
        {
          //etWaterContact=0, etWaterSubmerge=1, etTimer=2, etSubSim=3, etSimStarted=4, etEndSim=5
          switch (ev.evType)
          {
            case SimEventType.etEndSim:  //stop the simulation
              lastExtEvTypes.Add(lastEvKey, ev.evType);
              ScanCondEvList();
              this.timeEvList.ExternalEvOccurred(evData.desc + i.ToString(), ev, allLists, curTime, sim3DStartTime);
              stopped3DSims.Add(fromClient);
              this.extSimStarting = false;
              this.emraldStopping3D = false; //Stopping call from EMRALD processed by ext sim now. 
              this.extSimRunning = false;

              // Track status change from event
              prevExtSimState = curExtSimState;
              curExtSimState = ev.status;

              return;

            case SimEventType.etTimer: // if the event is a timer then just pop the next time event and let state tracker continue.
              if (this.emraldStopping3D || !this.extSimRunning)
              {
                //stop3DInEv = false;
                return;
              }

              PopNextTimeEvent();// TODO : evData.itemID);
                                 //sendTimers = true;
              doProcessLoop = true;
              break;

            case SimEventType.etSimLoaded:
              this.sim3DStartTime = this.curTime;
              //sendTimers = true;
              this.extSimRunning = true;
              this.extSimStarting = false;

              // Track status change from event
              prevExtSimState = curExtSimState;
              curExtSimState = ev.status;

              break;

            case SimEventType.etPing:
              lastExtEvTypes.Add(lastEvKey, ev.evType);
              logger.Info("Ping: from " + fromClient + ", time: " + curTime.ToString(@"d\.hh\:mm\:ss\.f"));

              //TODO proper responce to a ping?
              //TMsgWrapper msg = new TMsgWrapper(MessageType.mtOther, "GotPing");
              //msg.simAction = new SimAction(SimActionType.?);
              ////TODO if waiting for external sim put as stWaiting
              //msg.simAction.status = StatusType.stRunning;
              //sim3DServer.SendMessage(msg, fromClient);
              return;

            case SimEventType.etStatus:
              // Track status change
              prevExtSimState = curExtSimState;
              curExtSimState = ev.status;

              if (ev.status == StatusType.stError)
              {
                logger.Info("Coupled App XMPP Error: " + evData.desc + ", time: " + curTime.ToString(@"d\.hh\:mm\:ss\.f"));
                TMsgWrapper msg2 = new TMsgWrapper(MessageType.mtSimAction, "GotError", curTime, "Terminating all");
                msg2.simAction = new SimAction(SimActionType.atTerminate);
                msg2.simAction.status = StatusType.stDone;
                sim3DServer.SendMessage(msg2, fromClient);
                throw new Exception("Unhandled client simulation error - " + evData.desc);
              }
              if (!this.extSimRunning)
                return;
              break;

            case SimEventType.etCompEv:
              if (this.emraldStopping3D || !this.extSimRunning)
              {
                return;
              }
              lastExtEvTypes.Add(lastEvKey, ev.evType);
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
              doProcessLoop = true;
              break;

            default: //items are 3D variables that were affected
              break;

          }
        }

        ++i;
      }


      //wait for state processing to be done.
      while (inProcessingLoop)
      {
        //Application.DoEvents(); //this is required for the main processing of the simulation while 
        System.Threading.Thread.Sleep(10);
      }

      if (shiftTimeTo > Globals.NowTimeSpan)
      {
        //advance the current time. Event keys are absolute occurrence times so the queue needs no
        //re-keying; refresh the ID lookups to match (the old design did this within ShiftEvTimes).
        this.curTime = shiftTimeTo;
        this.timeEvList.RebuildLookups();
        curTimeVar.SetValue(curTime.TotalHours);

      }


      if (this.curExtSimState == StatusType.stRunning)
      {
        //Look for events that now meet conditions
        ScanCondEvList();
      
        lastExtEvTypes.Clear();
        //start a new round of processing
        if (doProcessLoop && !ProcessActiveLoop())
        {
          //sim3DServer.SendAction(new TActionPacketData(new TActionData(T3DActionType.atReset))); //let the simulation run.
          TMsgWrapper msg = new TMsgWrapper(MessageType.mtSimAction, "Reset", curTime, "Reset External Sim");
          msg.simAction = new SimAction(SimActionType.atCancelSim);
          sim3DServer.SendMessage(msg, fromClient);
          this.emraldStopping3D = true;  //telling ext sim to stop
        }
      }



      if (!this.emraldStopping3D)
      {
        if (curExtSimState == StatusType.stWaiting)
        {
          Send3DNextEvTimers(fromClient);
        }

        //send the continue event to the 3D simulation if in waiting state or done, 
        if ((curExtSimState == StatusType.stWaiting) ||
            ((curExtSimState == StatusType.stDone) && (this.allLists.curRunIdx < this.allLists.totRunsReq)))
        {
          TMsgWrapper msg = new TMsgWrapper(MessageType.mtSimAction, "Continue", curTime, "Continue External Sim");
          msg.simAction = new SimAction(SimActionType.atContinue);
          sim3DServer.SendMessage(msg, fromClient);
        }
      }

    }

    /// <summary>
    /// pop the next time event off the queue
    /// </summary>
    /// <param name="idMatch">if not -1 then only pop it off if the ID matches</param>
    /// <returns>bool if there is a next time event processed</returns>
    private bool PopNextTimeEvent(int idMatch = -1)
    {

      //timeEvList.PrintTimes();
      //pop the next time events and add them to the processEventList
      TimeMoveEvent nextItem = timeEvList.LookNextTimedEvent();
      if (nextItem == null)
        return false;

      if ((idMatch > -1) && (idMatch != nextItem.id))
      {
        return false;
      }
      //nextItem.time is the absolute occurrence time; compute the remaining time until it occurs.
      TimeSpan timeToOccur = nextItem.time - curTime;
      //if item is greater then max time then done and clear out rest of the items
      if (timeToOccur > maxTime)
      {
        timeEvList.Clear();
        return false;
      }

      curTime = nextItem.time;
      maxTime = maxTime - timeToOccur;

      curTimeVar.SetValue(curTime.TotalHours);

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

      foreach (var ev in timeEvList.PopTimedEvent(curTime))
        processEventList.Enqueue(ev);
      return true;
    }

    /// <summary>
    /// /run through all the items/movements/events until we are in a halted state waiting for a time event
    /// </summary>
    /// <returns>returns false if the loop was terminated</returns>
    private bool ProcessActiveLoop()
    {
      inProcessingLoop = true;
      bool change = true;
      //loop through processing event or states while any are still in the queues, processing one can add to the other.
      while (change && (!terminated) && ((processEventList.Count > 0) || (nextStateQue.Count > 0)))
      {
        change = false;
        //process all the events in the list before processing the next state

        while ((!terminated) && (processEventList.Count > 0))
        {
          //process the event list in batches
          while ((!terminated) && (processEventList.Count > 0))
          {
            ProcessEvent(processEventList.Dequeue());
            change = change || changedItems.HasChange();
            //See if any new events occured because of this events actions.
          }

          //get the next batch of condition events to process
          ScanCondEvList();
        }

        //while there are items in the Next State Queue, process them.
        while ((!terminated) && (nextStateQue.Count > 0))
        {
          StateTransition nextSt = nextStateQue.Peek();
          if (!ProcessState(nextSt)) //was a terminal state so quit;
          {
            inProcessingLoop = false;
            return false;
          }

          nextStateQue.Dequeue();
          nextStateIds.Remove(nextSt.StateId);
          change = true;
        }

        //Look for events that now meet conditions
        if (change && !terminated)
          ScanCondEvList();
      }

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
          if (!ProcessState(new StateTransition(curState.id, -1, "", "")))
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
      logger.Debug("DoEvent: " + curEv.name + ", time: " + curTime.ToString(@"d\.hh\:mm\:ss\.f"));

      foreach (var stID in curEv.eventStateActions.statesAndActions)
      {
        bool movingOut = ((ActionList)stID.Value).moveFromCurrent;
        if (!ProcessActions((ActionList)stID.Value, stID.Key, curEv.eventData, movingOut))
          return; //return of false means a time jump was done so we can stop processing

        if (movingOut) //leaving this state to go to a different one so remove any other events that also leave this state
        {
          timeEvList.RemoveMatchingStateItems(stID.Key);
          condEvList.RemoveMatchingStateItems(stID.Key);

          //remove this state from the current list.
          TimeSpan inTime = curStates.RemoveState(stID.Key, curTime);
          //update any accrual variables
          List<AccrualVariable> aVars = null;
          if (allLists.AccrualVars.TryGetValue(stID.Key, out aVars))
          {
            foreach (var v in aVars)
            {
              if (v.Accrue(inTime, stID.Key))
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
    private bool ProcessState(StateTransition stateID) //<ToState, FromState, event name, action name,>
    {
      //lookup the state from the ID
      State curState;
      try
      {
        curState = allLists.allStates[stateID.StateId];
      }
      catch (Exception)
      {
        return false;
      }

      //since we are entering the state fresh reset any data for events incase we have already been in the state
      curState.ResetEventCriteria();

      //TransitionAct tAct = allLists.allActions.FindByName(stateID.Item3) as TransitionAct;
      curStates.Add(this.allLists, curState, stateID.FromStateId, this.curTime, stateID.ActionName, stateID.AdditionalInfo);
      changedItems.AddChangedID(EnModifiableTypes.mtState, stateID.StateId);

      //do all the immediate actions for the state
      ProcessActions(curState.GetImmediateActions(), curState.id, null, false);

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

            TimeSpan evTime;     //relative time until the event occurs (used for the max time and "now" checks)
            TimeSpan absOccur;   //absolute occurrence time stored as the queue key
            TimeSpan createTime;

            //default get a new time if persistent and not expired then it will be fixed
            bool savePersistent = true;
            evTime = timeEv.NextTime(curTime);
            absOccur = Globals.AddClamped(curTime, evTime);
            createTime = curTime;

            //if persistent and time not expired then reuse the saved TimeMoveEvent info.
            //Persistent snapshots keep the legacy (whenCreated, relative-time) convention so they are
            //independent of the absolute-time queue; the absolute occurrence is whenCreated + time.
            if (this.PersistentEvs.ContainsKey(curEv.name))
            {
              //get the added time if not over max
              bool overMaxTime = (PersistentEvs[curEv.name].whenCreated.TotalDays + PersistentEvs[curEv.name].time.TotalDays) > TimeSpan.MaxValue.TotalDays;
              TimeSpan persistOccur = overMaxTime
                ? TimeSpan.MaxValue
                : (PersistentEvs[curEv.name].whenCreated + PersistentEvs[curEv.name].time);

              if (persistOccur >= curTime)
              {
                savePersistent = false; //saved here so dont do the save later.
                absOccur = persistOccur;
                if (!overMaxTime)
                  evTime = persistOccur - curTime;
                else //over max time so keep the max time.
                  evTime = TimeSpan.MaxValue;

                createTime = PersistentEvs[curEv.name].whenCreated;
              }
            }


            if ((evTime < maxTime) || (timeEv.UsesVariables()))//if using variables we still need to add incase those variables change
            {
              TimeMoveEvent addTimeEv = new TimeMoveEvent(curEv.name, new EventStatesAndActions(curEv.id, curState.id, curState.GetEvActionsIdx(idx)), curEv, absOccur, createTime);
              if ((evTime == Globals.NowTimeSpan) && !this.emraldStopping3D)// || //add the event to be processed immediately
                                                                            //todo : how to handle if next event is before the first timestep of a simulation
                                                                            //  if only one simulation you just process the event as an immediate ((this.sim3DRunning || this.sim3DStarting) && ((evTime.TotalSeconds * sim3DFameRate) < 1)))
              {
                processEventList.Enqueue(addTimeEv);
              }
              else //add it to the time list to occur in the correct order.
              {
                timeEvList.AddTimedEvent(addTimeEv);
              }

              if (((TimeBasedEvent)curEv).persistent)
              {
                //store the snapshot with time RELATIVE to whenCreated (legacy convention) so the saved
                //sample isn't affected by the absolute-time queue; occurrence is whenCreated + time.
                TimeMoveEvent persistCopy = new TimeMoveEvent(addTimeEv); //copy it so that the time doesn't get adjusted as the simulation progresses
                persistCopy.time = (addTimeEv.time == TimeSpan.MaxValue)
                  ? TimeSpan.MaxValue
                  : addTimeEv.time - addTimeEv.whenCreated;

                if (!this.PersistentEvs.ContainsKey(curEv.name))
                {
                  this.PersistentEvs.Add(curEv.name, persistCopy);
                }
                else if (savePersistent) //new sample so replace it
                {
                  this.PersistentEvs[curEv.name] = persistCopy;
                }
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
      MyBitArray toStateIDsBS = new MyBitArray(32);
      if (nextStateQue.Count > 0)
      {
        // Plain loop, avoids the LINQ Max + delegate allocation that happened every call.
        int maxID = 0;
        foreach (var st in nextStateQue)
          if (st.StateId > maxID) maxID = st.StateId;
        toStateIDsBS = new MyBitArray(maxID + 1); // store a bitset of the items that will be transitioned into
        foreach (var st in nextStateQue)
          toStateIDsBS.Set(st.StateId, true);
      }

      List<ConditionMoveEvent> matchedEvs = null;
      //Look for events that now meet conditions and add them to the processEventList
      TimeMoveEvent nextItem = timeEvList.LookNextTimedEvent();
      if (nextItem != null)
        //nextItem.time is an absolute occurrence time; pass the RELATIVE time-to-occur so the user-facing
        //NextEvTime variable (and coupled simulations) keep the same meaning as before.
        matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, this.lastExtEvTypes, curTime, sim3DStartTime, nextItem.time - curTime, this.allLists.curRunIdx, toStateIDsBS);
      //matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, curTime, sim3DStartTime, nextItem.time, this.allLists.curRunIdx);
      else
        matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, this.lastExtEvTypes, curTime, sim3DStartTime, TimeSpan.FromHours(0), this.allLists.curRunIdx, toStateIDsBS);
      //matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, curTime, sim3DStartTime, TimeSpan.FromHours(0), this.allLists.curRunIdx);
      foreach (var ev in matchedEvs)
        this.processEventList.Enqueue(ev);
      changedItems.Clear();
    }

    
    /// <summary>
    /// Process the given actions and necessary steps depending on the action type. 
    /// </summary>
    /// <param name="curActions">action list to process</param>
    /// <param name="ownerStateID">state that actions are being run for</param>
    /// <returns></returns>
    private bool ProcessActions(ActionList curActions, int ownerStateID, Event causeEvent, bool exiting)
    {
      foreach (SimulationDAL.Action curAct in curActions)
      {
        switch (curAct.actType)
        {
          case EnActionType.atTransition:
            TransitionAct tCurAct = (curAct as TransitionAct);

            //ProcessTransition((Transition)curAct);
            //add the new state to the NextStateQue
            List<IdxAndStr> toStates = tCurAct.WhichToState();
            foreach (IdxAndStr cur in toStates)
            {
              State curState = this.allLists.allStates[cur.idx];
              logger.Debug("DoTransitionAction: " + curAct.name + " - " + curState.name);
              //only add it if we are currently not going to that state from another action and not already in the state
              bool inStateAlready = curStates.ContainsKey(cur.idx);
              if ((inStateAlready && !exiting) ||
                 (inStateAlready && (ownerStateID != cur.idx)))
                // if(curStates.ContainsKey(cur.idx))
                logger.Debug("No Transition, already in state: " + curState.name);
              else if (nextStateIds.Add(cur.idx))
                nextStateQue.Enqueue(new StateTransition(cur.idx, ownerStateID, causeEvent == null ? "immediate action" : causeEvent.name, curAct.name));
            }
            break;

          case EnActionType.atCngVarDll:
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
              throw new Exception("Failed to find variable for" + curVarAct.name + " in variable list.", e);
            }

            curVarAct.SetVal(varItem, this.allLists, curTime, sim3DStartTime, this.allLists.curRunIdx);

            //if it is an external sim variable then send a message
            if (varItem is Sim3DVariable)
            {
              try
              {
                logger.Debug("DoExternalSimMessageAction.ComponentModifyAction: " + varItem.name);
                //wait to make sure the 3D sim has started
                while ((!this.extSimRunning) && (!this.emraldStopping3D))
                {
                  if (!this.extSimStarting)
                  {
                    logger.Debug("Ext Sim not running and trying to send message.");
                    throw new Exception("Ext Sim not running and trying to send message.");
                  }

                  System.Threading.Thread.Sleep(10);
                }

                Sim3DVariable simVar = varItem as Sim3DVariable;

                string setValue;
                switch (simVar.dType.Name.ToUpper().Substring(0, 4))
                {
                  case "INT":
                  case "INT3":
                  case "DOUB":
                  case "BOOL":
                  case "TIME":
                    setValue = simVar.dblValue.ToString();
                    break;
                  case "STRI":
                    setValue = simVar.strValue;
                    break;
                  default:
                    throw new Exception("Invalid Variable type");
                }

                var varMsg = new TMsgWrapper(MessageType.mtSimAction, "SetSimValue", curTime, "Adjust External Sim");
                varMsg.simAction = new SimAction(SimActionType.atCompModify, curTime, new ItemData(simVar.sim3DNameId, setValue));

                sim3DServer.SendMessage(varMsg, simVar.resourceName);

                break;
              }
              catch (Exception)
              {
                logger.Debug("Failed to send external Sim message for modifying variable with action: " + curAct.name);
              }
            }

            try
            {
              //see if there are any events that use this if so we need to update
              foreach (var ev in timeEvList.timedEvQue)
              {
                TimeBasedEvent curTimeEv = (TimeBasedEvent)ev.Value.eventData;
                if (curTimeEv.relatedIDs.Contains(varItem.id))
                {
                  //get a new absolute occurrence time for the event (ev.Key is the current absolute occurrence time).
                  TimeSpan oldOccurTime = ev.Key;

                  TimeSpan regotTime = curTimeEv.RedoNextTime(ev.Value.whenCreated, curTime, oldOccurTime);
                  if (regotTime < curTime) //cannot occur in the past, so make it occur now.
                    regotTime = curTime;

                  timeEvList.ChangeEventTime(regotTime, ev.Value.eventStateActions.eventID);

                  //adjust the saved persistent event time also if there is one.
                  //snapshots keep time relative to whenCreated, so store the relative remaining time.
                  if (this.PersistentEvs.ContainsKey(ev.Value.name))
                    this.PersistentEvs[ev.Value.name].time = regotTime - curTime;
                }
              }
            }
            catch (Exception e)
            {
              throw new Exception("Failed to adjust event time for changes to " + curAct.name, e);
            }

            //see if there are any persistent not in the time event list to update
            foreach (var persEvItem in this.PersistentEvs.Values)
            {
              TimeBasedEvent curTimeEv = (TimeBasedEvent)persEvItem.eventData;
              if (!timeEvList.HasEvent(curTimeEv.id))
              {

                if (curTimeEv.relatedIDs.Contains(varItem.id))
                {
                  if (curTimeEv.onVarChangeEnum == EnOnChangeTask.ocAdjust)
                  {
                    throw new Exception("Tried to adjust Persistent Event [" + curTimeEv.name + "], not currently in a state. Don't use Persistent events with events that can be adjusted for variable changes!");
                  }

                  //RedoNextTime works in absolute time; the snapshot stores time relative to whenCreated,
                  //so pass the absolute occurrence (curTime + relative) in and store the relative remaining back.
                  TimeSpan regotTime = curTimeEv.RedoNextTime(persEvItem.whenCreated, curTime, curTime + persEvItem.time);
                  if (regotTime < curTime) //cannot occur in the past, so make it occur now.
                    regotTime = curTime;

                  //adjust the saved persistent event time (relative to whenCreated)
                  persEvItem.time = regotTime - curTime;
                }
              }
            }




            //add the ID to the changed list
            changedItems.AddChangedID(EnModifiableTypes.mtVar, varItem.id);
            break;

          case EnActionType.atJumpToTime:
            logger.Debug("DoJumpToTimeAction: " + curAct.name);
            //change the current time to the result of this action.
            JumpToTimeAct timeJumpAct = (curAct as JumpToTimeAct);

            
            double temp = 0.0;
            timeJumpAct.SetVal(ref temp, this.allLists, curTime, sim3DStartTime, this.allLists.curRunIdx);
            TimeSpan newTime = TimeSpan.FromHours(temp);

            if (newTime > curTime)
              throw new Exception("Attempted to jump forward in time, this not allowed. CurTime - " + curTime + " NewTime - " + newTime);

            this.timeEvList.RevertToTime(curTime, newTime);
            this.curStates.RevertToGivenTime(newTime, this.condEvList);

            //make sure the processEventList has only the current event (the one being processed)
            //and the nextStateQue is empty
            if (processEventList.Count > 1)
            {
              EventListData currentEv = processEventList.Dequeue();
              processEventList.Clear();
              processEventList.Enqueue(currentEv);
            }
            nextStateQue.Clear();
            nextStateIds.Clear();

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

            curRunExeAct.RunExtApp(curStatesTime, this.curTime, this.allLists, ref addStates, ref leaveStates, this.allLists.threadNum == null ? false : true);

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
              if (nextStateIds.Add(id))
                nextStateQue.Enqueue(new StateTransition(id, ownerStateID, causeEvent == null ? "immediate action" : causeEvent.name, curAct.name));
            }


            //update any doc variables now that code is executed so they try to update if needed.
            //Iterate the cached doc-link subset rather than every variable in the model.
            foreach (SimVariable curVar in docLinkVariables)
            {
              object o1 = curVar.NoUpdateValue;
              object o2 = curVar.GetValue(true);
              if (!object.Equals(o1, o2))
                changedItems.AddChangedID(EnModifiableTypes.mtVar, curVar.id);
            }

            //if it is modifying a variable then mark that as changed
            if (curRunExeAct.assignVariable != null)
            {
              changedItems.AddChangedID(EnModifiableTypes.mtVar, curRunExeAct.assignVariable.id);
            }

            //update any doc variables that were marked as used now that code is executed.
            foreach (string varName in curRunExeAct.codeVariables)
            {
              SimVariable curVar = allLists.allVariables.FindByName(varName);
              if ((curVar != null) && (curVar.varScope == EnVarScope.gtDocLink))
              {
                changedItems.AddChangedID(EnModifiableTypes.mtVar, curVar.id);
              }
            }

            //if it is modifying a variable then mark that as changed
            if (curRunExeAct.assignVariable != null)
            {
              changedItems.AddChangedID(EnModifiableTypes.mtVar, curRunExeAct.assignVariable.id);
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
                msg.simAction = new SimAction(new SimInfo(cur3DAct.ModelRef(allLists), cur3DAct.simMaxTime, cur3DAct.ConfigData(allLists), SingleRandom.Instance.Next(), this.allLists.totRunsReq, this.allLists.curRunIdx), curTime);

                if (sim3DServer == null)
                  throw new Exception("External Simulation not assigned.");

                bool hasConnection = false;
                int conCnt = 0;
                while (!hasConnection)
                {
                  ++conCnt;
                  if (!sim3DServer.GetResources().Contains(cur3DAct.resourceName))
                  {
                    logger.Error("Lost coupling connection");

                    if (conCnt > 60)
                    {
                      logger.Error("End wait for coupling reconnection");
                      throw new Exception("No external client code named - " + cur3DAct.resourceName);
                    }

                    //give time to establish a new connection
                    System.Threading.Thread.Sleep(1000);
                  }
                  else
                  {
                    hasConnection = true;
                  }
                }

                allLists.allVariables.FindByName("ExtSimStartTime").SetValue(curTime.TotalHours);
                sim3DServer.evCallBackFunc = Sim3DEventOccurred;

                if (sim3DServer.SendMessage(msg, cur3DAct.resourceName))
                {
                  extSimStarting = true;
                  emraldStopping3D = false;
                  while (!this.extSimRunning)
                  {
                    //Application.DoEvents();
                    System.Threading.Thread.Sleep(10);
                  }
                }
                else //already running so set correct params.
                {
                  this.sim3DStartTime = this.curTime;
                  this.extSimStarting = false;
                  this.extSimRunning = true;
                  this.emraldStopping3D = false;
                }

                break;

              case SimActionType.atCompModify:
                logger.Debug("DoComponentModifyAction: " + curAct.name);
                //wait to make sure the 3D sim has started
                while ((!this.extSimRunning) && (!this.emraldStopping3D))
                {
                  if (!this.extSimStarting)
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
                    setValue = curVar.strValue;
                    break;
                  default:
                    throw new Exception("Invalid Variable type");
                }

                msg = new TMsgWrapper(MessageType.mtSimAction, "SetSimValue", curTime, "Adjust External Sim");
                msg.simAction = new SimAction(SimActionType.atCompModify, curTime, new ItemData(cur3DAct.simVar.sim3DNameId, setValue));

                sim3DServer.SendMessage(msg, cur3DAct.resourceName);
                //sim3DServer.SendAction(new TActionPacketData(sendVal));

                break;

              default:
                msg = new TMsgWrapper(MessageType.mtSimAction, cur3DAct.sim3DMessage.ToString(), curTime, "Stop/Continue/ping/status the Simulation");
                msg.simAction = new SimAction(cur3DAct.sim3DMessage);

                if (cur3DAct.sim3DMessage == SimActionType.atCancelSim)
                {
                  //debugLog = true; //todo remove
                  if ((this.extSimRunning) && (!this.emraldStopping3D))
                  {
                    this.emraldStopping3D = true; //Stopping call from EMRALD not processed by ext sim yet. 
                    sim3DServer.SendMessage(msg, cur3DAct.resourceName);

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
      var msg = new TMsgWrapper(MessageType.mtSimAction, "SetCallbackTimer", curTime, "Check back with the EMRALD Simulation");

      if (timeEvList.cnt > 0)
      {
        TimeMoveEvent nextTimeItem = timeEvList.LookNextTimedEvent();

        //nextTimeItem.time is already the absolute occurrence time (same value sent to the coupled sim before).
        TimeSpan nextItemTime = nextTimeItem.time;
        msg.simAction = new SimAction(SimActionType.atTimer, nextItemTime, new ItemData(nextTimeItem.name, nextTimeItem.id.ToString()));
      }
      else
      {
        msg.simAction = new SimAction(SimActionType.atTimer, maxTime, new ItemData("MaxSimTime", "0"));
      }

      //make sure the 3DSim is fully started before the message is sent.
      while (!this.extSimRunning)
      {
        //Application.DoEvents();
        System.Threading.Thread.Sleep(500);
      }

      //sim3DServer.SendAction(new TActionPacketData(new TActionData(T3DActionType.atTimer, nextTimeItem.name, nextTimeItem.id, nextItemTime)));
      sim3DServer.SendMessage(msg, toClient);

    }

    /// <summary>
    /// Add the paths of movement from start states to the key states for the simulation run to the overall results map
    /// </summary>
    /// <returns>return the key paths for the current simulation run</returns>
    public Dictionary<string, TimeSpan> GetKeyPaths(Dictionary<string, SimulationEngine.KeyStateResult> resMap, Dictionary<string, SimulationEngine.ResultState> otherResMap, List<string> watchVars)
    {
      return curStates.GetKeyStatePaths(allLists, resMap, otherResMap, watchVars, this.allLists.curRunIdx);
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

        if ((curStateInfo.state.diagram is EvalDiagram) && ((EvalDiagram)curStateInfo.state.diagram).IsFailedState(curStateInfo.state.id))
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
  }
}
