// Copyright 2021 Battelle Energy Alliance

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
using SimulationEngineHelper;

namespace SimulationEngine
{

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
    private List<Tuple<int, int, string, string>> nextStateQue = new List<Tuple<int, int, string, string>>();
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

      allLists.allEvents.Reset();

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
      this.allLists.curRunIdx++;

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
        if (!ProcessActiveLoop())
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
      foreach (var sID in finalStates)
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
      bool change = true;
      //loop through processing event or states while any are still in the queues, processing one can add to the other.
      while (change && (!terminated) && ((processEventList.Count > 0) || (nextStateQue.Count > 0)))
      {
        change = false;
        //process all the events in the list before processing the next state
        while ((!terminated) && (processEventList.Count > 0))
        {
          ProcessEvent(processEventList[0]);
          processEventList.RemoveAt(0);
          change = changedItems.HasChange();
        }

        //while there are items in the Next State Queue, process them.
        while ((!terminated) && (nextStateQue.Count > 0))
        {
          if (!ProcessState(nextStateQue[0])) //was a terminal state so quit;
          {
            inProcessingLoop = false;
            return false;
          }

          nextStateQue.RemoveAt(0);
          change = true;
        }

        //Look for events that now meet conditions
        if (change && !terminated)
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
          if (!ProcessState(Tuple.Create(curState.id, -1, "", "")))
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
    private bool ProcessState(Tuple<int, int, string, string> stateID) //<ToState, FromState, event name, action name,>
    {
      //lookup the state from the ID
      State curState;
      try
      {
        curState = allLists.allStates[stateID.Item1];
      }
      catch (Exception)
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

            TimeSpan evTime = timeEv.NextTime(curTime, this.curStates.bitMap);
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
      if (nextItem != null)
        //matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, this.last3DVarEvType, curTime, sim3DStartTime, nextItem.time);
        matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, curTime, sim3DStartTime, nextItem.time, this.allLists.curRunIdx);
      else
        //matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, this.last3DVarEvType, curTime, sim3DStartTime, TimeSpan.FromHours(0));
        matchedEvs = condEvList.GetMatchedCondMoveEvents(this.changedItems, curTime, sim3DStartTime, TimeSpan.FromHours(0), this.allLists.curRunIdx);
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
      foreach (SimulationDAL.Action curAct in curActions)
      {
        switch (curAct.actType)
        {
          case EnActionType.atTransition:
            logger.Debug("DoTransitionAction: " + curAct.name);
            TransitionAct tCurAct = (curAct as TransitionAct);

            //ProcessTransition((Transition)curAct);
            //add the new state to the NextStateQue
            List<IdxAndStr> toStates = tCurAct.WhichToState();
            foreach (IdxAndStr cur in toStates)
            {
              //only add it if we are currently not going to that state from another action and not already in the state
              if (curStates.ContainsKey(cur.idx))
                logger.Debug("No Transition, already in state: " + curAct.name);
              else if (nextStateQue.Where(t => t.Item1 == cur.idx).FirstOrDefault() == null)
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
              throw new Exception("Failed to find variable for" + curVarAct.name + " in variable list.", e);
            }

            curVarAct.SetVal(varItem, this.allLists, curTime, sim3DStartTime, this.allLists.curRunIdx);
            //TODO : if this is a 3D var item and we are running a 3D simulation notify the 3D simulator of the change.


            try
            {
              //see if there are any events that use this if so we need to update
              foreach (var ev in timeEvList.timedEvQue)
              {
                TimeBasedEvent curTimeEv = (TimeBasedEvent)ev.Value.eventData;
                if (curTimeEv.relatedIDs.Contains(varItem.id))
                {
                  //get a new time for the event.

                  TimeSpan lastSampledTime = ev.Key;
                  //if (lastSampledTime < (TimeSpan.MaxValue - curTime))
                  //{
                  //  lastSampledTime = lastSampledTime + curTime;
                  //}

                  TimeSpan regotTime = curTimeEv.RedoNextTime(ev.Value.whenCreated, curTime, lastSampledTime, curStates.bitMap);
                  if (regotTime < TimeSpan.Zero) 
                    regotTime = TimeSpan.Zero;

                  timeEvList.ChangeEventTime(regotTime, ev.Value.eventStateActions.eventID);
                }
              }
            }
            catch (Exception e)
            {
              throw new Exception("Failed to adjust event time for changes to " + curVarAct.name, e);
            }

            

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
            timeJumpAct.SetVal(ref temp, this.allLists, curTime, sim3DStartTime, this.allLists.curRunIdx);
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
                nextStateQue.Add(Tuple.Create(id, ownerStateID, causeEvent == null ? "immediate action" : causeEvent.name, curAct.name));
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
                msg.simAction = new SimAction(new SimInfo(cur3DAct.ModelRef(allLists), cur3DAct.simMaxTime, cur3DAct.ConfigData(allLists)));

                if (sim3DServer == null)
                  throw new Exception("External Simulation not assigned.");

                if (!sim3DServer.GetResources().Contains(cur3DAct.resourceName))
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
                    setValue = curVar.strValue;
                    break;
                  default:
                    throw new Exception("Invalid Variable type");
                }

                msg = new TMsgWrapper(MessageType.mtSimAction, "SetSimValue", curTime, "Adjust External Sim");
                msg.simAction = new SimAction(SimActionType.atCompModify, curTime, new ItemData(cur3DAct.simVar.name, setValue));

                sim3DServer.SendMessage(msg, cur3DAct.resourceName);
                //sim3DServer.SendAction(new TActionPacketData(sendVal));

                break;

              default:
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
        TimeSpan nextItemTime = (nextTimeItem.time + this.curTime);

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
    public void GetKeyPaths(Dictionary<string, SimulationEngine.KeyStateResult> resMap, Dictionary<string, SimulationEngine.ResultState> otherResMap)
    {
      curStates.GetKeyStatePaths(allLists.allStates, resMap, otherResMap);
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
