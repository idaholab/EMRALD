using MyStuff.Collections;
using Newtonsoft.Json.Schema.Generation;
using SimulationDAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Markup;

namespace SimulationTracking
{
  public class StatePath
  {
    public State state;
    public List<int> path;
    public List<TimeSpan> times;
    public List<string> eventNames;
    public List<string> actionNames;
    public Dictionary<string, List<Object>> varValues; //variable values for each of the items in the path at time of entry to the state.

    public StatePath(State inState, List<int> inPath, List<TimeSpan> inTimes, List<string> eventName, List<string> actionName, Dictionary<string, List<Object>> varValues)
    {
      this.state = inState;
      this.path = inPath;
      this.times = inTimes;
      this.eventNames = eventName;
      this.actionNames = actionName;
      this.varValues = varValues;
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
      if (fullCopy)
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

    public void Clear()
    {
      base.Clear();
      this._bitMap = new MyBitArray(_bitMap.Length);
      removedItems.Clear();
    }

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
        timeInIt = curTime - this[stateID].times.Last();
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
      foreach (var curState in this.Values)
      {
        int idx = curState.times.Count - 1;
        if (curState.times[idx] > forTime)
        {
          condEvs.RemoveMatchingStateItems(curState.state.id);
          remList.Add(curState.state.id);
        }
      }

      //remove all the items from the list
      foreach (var id in remList)
      {
        this.Remove(id);
        _bitMap.Set(id, false);
      }

      List<RemovedStateInfo> timeSorted = new List<RemovedStateInfo>();
      timeSorted = removedItems.Values.ToList();
      timeSorted.Sort((ts1, ts2) => TimeSpan.Compare(ts1.time, ts2.time));

      remList.Clear();
      int i = timeSorted.Count - 1;
      while ((i >= 0) && (timeSorted[i].time > forTime)) //added time is greater than 
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

      foreach (int id in remList)
      {
        removedItems.Remove(id);
        _bitMap.Set(id, true);
      }
    }

    public void Add(EmraldModel model, State toState, int fromState, TimeSpan curTime, string actName, string evName)
    {
      logger.Info("EnterState: " + toState.name + ", time: " + curTime.ToString(@"d\.hh\:mm\:ss\.f") + ", Cause Event: " + evName + ", fromState-Action: " + actName);

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
          logger.Info("Already in a state for the diagram " + toState.diagram.name + " can't add go into another one.");
          return;
#endif
      }

      List<int> addList = new List<int>();
      List<TimeSpan> addTimes = new List<TimeSpan>();
      List<string> eventNames = new List<string>();
      List<string> actionNames = new List<string>();
      Dictionary<string, List<object>> varVals = new Dictionary<string, List<object>>();
      foreach (var v in model.allVariables.Values)
      {
        varVals.Add(v.name, new List<object>());
      }

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

        //copy the variable value change over time
        foreach (var v in model.allVariables.Values)
        {
          varVals[v.name].AddRange(curStatePath.varValues[v.name]);
          varVals[v.name].Add(v.value);
        }
        
        
      }
      else
      {
        if (fromState != -1)
        {
          addList.AddRange(removedItems[fromState].statePath.path);
          addTimes.AddRange(removedItems[fromState].statePath.times);
          eventNames.AddRange(removedItems[fromState].statePath.eventNames);
          actionNames.AddRange(removedItems[fromState].statePath.actionNames);

          //copy the variable value change over time
          foreach (var v in model.allVariables.Values)
          {
            varVals[v.name].AddRange(removedItems[fromState].statePath.varValues[v.name]);
          }
        }
        

        addList.Add(fromState);
        addTimes.Add(curTime);
        eventNames.Add(actName);
        actionNames.Add(evName);
        foreach (var v in model.allVariables.Values)
        {
          varVals[v.name].Add(v.value);
        }
      }
      //}
      
      ////get all the current variable values
      //Dictionary<string, List<object>> varVals = new Dictionary<string, List<object>>();
      //foreach(var v in model.allVariables.Values)
      //{
      //  if()
      //  varVals.Add(v.name, v.value);
      //}

      this.Add(toState.id, new StatePath(toState, addList, addTimes, eventNames, actionNames, varVals));

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

    //return key state results, but add to all combined results and non key state results
    public Dictionary<string, TimeSpan> GetKeyStatePaths(EmraldModel model, Dictionary<string, SimulationEngine.KeyStateResult> keyResMap, Dictionary<string, SimulationEngine.ResultState> otherResMap, List<string> watchVars, int curRunIdx)
    {
      Dictionary<string, TimeSpan> retStateResults = new Dictionary<string, TimeSpan>();

      foreach (StatePath curStatePath in this.Values)
      {
        bool isKeyPath = (curStatePath.state.stateType == EnStateType.stKeyState);

        //get the paths for both key states and standard states
        if ((isKeyPath && (keyResMap != null)) ||
           ((curStatePath.state.stateType == EnStateType.stStandard) && (otherResMap != null)))
        {
          //make a new results item which will capture any looping items.
          Dictionary<string, SimulationEngine.ResultState> curResDict = new Dictionary<string, SimulationEngine.ResultState>();

          State curState = null;
          State prevState = null;
          State nextState = null;

          //bellow items declared here for efficiency
          SimulationEngine.ResultState curResState = null;
          SimulationEngine.EnterExitCause curCause = null;
          SimulationEngine.ResultState updateItem = null;
          string causeKey = "";
          string evName = "";
          string actName = "";

          //this runs from the first to last item
          for (int i = 0; i <= curStatePath.path.Count - 1; i++)
          {
            if (nextState != null)
              curState = nextState;
            else
              curState = model.allStates[curStatePath.path[i + 1]];

            if (i < (curStatePath.path.Count - 2))
              nextState = model.allStates[curStatePath.path[i + 2]];
            else if (i == (curStatePath.path.Count - 2))
              nextState = curStatePath.state;
            else
              nextState = null;

            
            //see if the item is already in the current result dictionary
            if (!curResDict.TryGetValue(curState.name, out curResState))
            {
              curResState = new SimulationEngine.ResultState(curState.name, isKeyPath);
              curResDict.Add(curResState.name, curResState);
            }

            //add the variable values
            foreach (string vName in watchVars)
            {
              //this is one run so always just save one variable value in the first array slot overwriting if it looped through, the arrays is for data from multiple runs.
              if (!curResState.watchVariables.ContainsKey(vName))
              {
                //create initial unknown value
                curResState.watchVariables.Add(vName, new Dictionary<string, string>());
              }

              if (curStatePath.varValues.ContainsKey(vName))
              {
                //assign to most current variable value for that state
                if (curResState.watchVariables[vName].ContainsKey(curRunIdx.ToString()))
                  curResState.watchVariables[vName][curRunIdx.ToString()] = Convert.ToString(curStatePath.varValues[vName][i]);
                else
                  curResState.watchVariables[vName].Add(curRunIdx.ToString(),  Convert.ToString(curStatePath.varValues[vName][i]));
              }                
            }

            SimulationEngine.EnterExitCause foundCause = null;
            curResState.AddTime(curStatePath.times[i]);
            //add where came from. if not at the beginning
            if (prevState != null)
            {
              evName = curStatePath.eventNames[i];
              actName = curStatePath.actionNames[i];
              SimulationDAL.Action act = model.allActions.FindByName(actName);
              SimulationDAL.Event ev = null;
              if (evName != "immediate action")
                ev = model.allEvents.FindByName(evName);

              curCause = new SimulationEngine.EnterExitCause(prevState.name, ev, act, true);
              // if exist use it
              if (curResState.enterDict.TryGetValue(curCause.key, out foundCause))
              {
                curCause = foundCause;
              }
              else //if it doesn't exit then add it
              {
                curResState.enterDict.Add(curCause.key, curCause);
              }

              curCause.cnt++;
            }

            //add where going to, if not at the end
            if (nextState != null)
            {
              evName = curStatePath.eventNames[i + 1];
              actName = curStatePath.actionNames[i + 1];
              SimulationDAL.Action act = model.allActions.FindByName(actName);
              SimulationDAL.Event ev = null;
              if (evName != "immediate action")
                ev = model.allEvents.FindByName(evName);

              curCause = new SimulationEngine.EnterExitCause(nextState.name, ev, act, false);
              // if exist use it
              if (curResState.exitDict.TryGetValue(curCause.key, out foundCause))
              {
                curCause = foundCause;
              }
              else //if it doesn't exit then add it
              {
                curResState.exitDict.Add(curCause.key, curCause);
              }

              curCause.cnt++;
            }

            //prep for the next round
            prevState = curState;

          }

          //collapse all the stats for this path 
          foreach (var item in curResDict.Values)
            item.Collapse();

          //add cur run to either other results map or the key state results map
          Dictionary<string, SimulationEngine.ResultState> addToRes = otherResMap;
          if (curStatePath.state.stateType == EnStateType.stKeyState)
          {
            if (!keyResMap.ContainsKey(curStatePath.state.name))
              keyResMap.Add(curStatePath.state.name, new SimulationEngine.KeyStateResult(curStatePath.state.name));

            addToRes = keyResMap[curStatePath.state.name].pathsLookup;
            //add the time for the key state overall result
            //keyResMap[curStatePath.state.name].AddTime(curStatePath.times[curStatePath.times.Count - 1]);

            retStateResults.Add(curStatePath.state.name, curStatePath.times[curStatePath.times.Count - 1]);
          }

          foreach (var item in curResDict.Values)
          {
            if (!addToRes.TryGetValue(item.name, out updateItem))
              addToRes.Add(item.name, item);
            else
              updateItem.Combine(item);

          }
        }

        //update the key reault item with the values from that state in the list
        if(isKeyPath)
        {
          keyResMap[curStatePath.state.name].AssignResults();
        }
      }

      return retStateResults;
    }
  }




}
