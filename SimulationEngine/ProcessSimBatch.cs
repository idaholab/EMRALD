﻿// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using MyStuff.Collections;
using System.IO;
using SimulationTracking;
//using System.Windows.Forms;
using XmppMessageServer;
using NLog;
using SimulationDAL;
using Newtonsoft.Json;
using MathNet.Numerics.Statistics;

namespace SimulationEngine
{
  public class Progress
  {
    public int percentDone = 0;
    public TimeSpan runTime = TimeSpan.Zero;
    public int curRun = 0;
    public bool done = false;
  }

  public delegate void TProgressCallBack(TimeSpan runTime, int runCnt, bool finalValOnly);
    
  public class FailedItems 
  {
    public Dictionary<MyBitArray, int> compFailSets = new Dictionary<MyBitArray, int>();
    public List<TimeSpan> failTimes = new List<TimeSpan>();


    public FailedItems()
    {
    }

    public void AddCompFailSet(int[] compList)
    {
      MyBitArray addSet = new MyBitArray(compList);
      int val;
      if (compFailSets.TryGetValue(addSet, out val))
      {
        compFailSets[addSet] = val + 1;
      }
      else
      {
        compFailSets.Add(addSet, 1);
      }
    }

    public List<Tuple<int[], int>> GetCompFailSets()
    {
      List<Tuple<int[], int>> retList = new List<Tuple<int[], int>>();

      foreach(KeyValuePair<MyBitArray, int> curSet in compFailSets)
      {
        int[] idList = new int[curSet.Key.Count];
        
        curSet.Key.CopyTo(idList, curSet.Key.Length);

        retList.Add(Tuple.Create(idList, curSet.Value));
      }

      return retList;
    }
  }

  public class ProcessSimBatch
  {
    private NLog.Logger logger = NLog.LogManager.GetLogger("logfile");
    private EmraldModel _lists;
    private TimeSpan _endTime;
    //private HoudiniSimClient _sim3DHandler = null;
    private EMRALDMsgServer _msgServer;
    private double _frameRate = 30;
    private string _sim3DPath = "";
    //private HoudiniSimClient.TLogEvCallBack _viewNotifications = null;
    private string _resultFile;
    private int _numRuns;
    private string _jsonResultPaths;
    private volatile bool _stop = false;
    private bool _logFailedComps = false;
    private string _keyPathsOutput = "";
    public bool batchSuccess = false;
    private Progress _progress = null;

    //public Dictionary<string, double> variableVals { get { return _variableVals; } }
    public Dictionary<string, FailedItems> keyFailedItems = new Dictionary<string, FailedItems>(); //key = StateName, value = cut sets
    public Dictionary<string, KeyStateResult> keyPaths = new Dictionary<string, KeyStateResult>();
    public Dictionary<string, ResultState> otherPaths = new Dictionary<string, ResultState>();
    private Dictionary<string, Dictionary<string, List<string>>> _variableVals = new Dictionary<string, Dictionary<string, List<string>>>();
    public TProgressCallBack progressCallback;
    public List<string> logVarVals = new List<string>();

    //public List<Tuple<string, double>> 
    public TimeSpan runtime = TimeSpan.FromMilliseconds(0);
    private string _error = "";
    public string error { get { return _error; } }

    public ProcessSimBatch(EmraldModel lists, TimeSpan endtime, string resultFile, string jsonResPaths)
    {
      this._lists = lists;
      this._endTime = endtime;
      this._resultFile = resultFile;
      this._jsonResultPaths = jsonResPaths;
      this.progressCallback = LogResults;
    }

    //public void Add3DSimulationData(HoudiniSimClient sim3DHandler, double frameRate, string sim3DPath)//, HoudiniSimClient.TLogEvCallBack viewNotifications)
    public void AddExtSimulationData(EMRALDMsgServer msgServer, double frameRate, string sim3DPath, string password)//, HoudiniSimClient.TLogEvCallBack viewNotifications)
    {
      _msgServer = msgServer;
      _frameRate = frameRate;
      _sim3DPath = sim3DPath;
      //_viewNotifications = viewNotifications;
    }

    public bool AutoConnectExtSim()
    {
      if (_lists.allExtSims.Count < 1)
        return true;

      DateTime timer = DateTime.Now;
      bool allConnected = false;
      while (!allConnected)
      {
        var extConnections = _msgServer.GetResources();
        allConnected = true;
        foreach (var extSim in _lists.allExtSims.Values)
        {
          extSim.verified = extConnections.Contains(extSim.resourceName);

          if (!extSim.verified)
          {
            allConnected = false;
            if (extSim.timeout < (DateTime.Now - timer).TotalSeconds)
              return false;   
          }
        }
      }

      return true;
    }

    private void SetLog(int runIdx)
    {
      if (ConfigData.debugLev == LogLevel.Off)
        return;

      if ((runIdx != 1) && ((ConfigData.debugRunStart == null) || (ConfigData.debugRunEnd == null)))
        return;

      if (((runIdx == 1) && (ConfigData.debugRunStart == null)) || (runIdx == ConfigData.debugRunStart))
      {
        foreach (var rule in LogManager.Configuration.LoggingRules)
        {
          if (rule.LoggerNamePattern != "uTestLog")
          {
            rule.EnableLoggingForLevel(ConfigData.debugLev);
            if (ConfigData.debugLev == LogLevel.Debug)
              rule.EnableLoggingForLevel(LogLevel.Info);
          }
        }
        LogManager.ReconfigExistingLoggers();
        return;
      }

      if (runIdx == (ConfigData.debugRunEnd+1))
      {
        foreach (var rule in LogManager.Configuration.LoggingRules)
        {
          if (rule.LoggerNamePattern != "uTestLog")
          {
            rule.DisableLoggingForLevel(LogLevel.Info);
            rule.DisableLoggingForLevel(LogLevel.Debug);
          }
        }
        LogManager.ReconfigExistingLoggers();
      }     
    }

    public void SetupBatch(int numRuns, bool logFailedComps = false, string keyPathsOutput = "")
    {
      _numRuns = numRuns;
      _logFailedComps = logFailedComps;
      _keyPathsOutput = keyPathsOutput;
    }

    public void AssignProgress(Progress progress)
    {
      _progress = progress;
    }

    public void StopSims()
    {
      _stop = true;
    }

    public void RunBatch()
    {
      //if there were any xmpp connections specified in the perams not set by the user, connect here
      if (!AutoConnectExtSim())
      {
        this._error = "Failed to connect to external simulation.";
        logger.Error(this.error); 
      }


      batchSuccess = false;
      _stop = false;
      bool retVal = true;
      Stopwatch stopWatch = new Stopwatch();
      stopWatch.Start();
      TimeSpan resTime = stopWatch.Elapsed;
      int actRuns = 0;
      int curI = 0;

      StreamWriter pathOutputFile = null;
      if (!string.IsNullOrEmpty(_keyPathsOutput)) 
        pathOutputFile = new StreamWriter(_keyPathsOutput, append: false);

      //if user defined the seed then reset random so that seed is used.
      if (ConfigData.seed != null)
        SingleRandom.Reset();

      //make a list of result items for each key state.
      //ResultState[] keyStates = _lists.allStates.Where(i => i.Value.stateType == EnStateType.stKeyState).Select(i => new ResultState(i.Value.name)).ToArray();
      //Dictionary<string, ResultState> keyStateResMap = null;
     
      //progressCallback(stopWatch.Elapsed, 0);
      try
      {
        _lists.allVariables.ReInitAll();

        for (int i = 1; i <= _numRuns; ++i)
        {
          SetLog(i);

          logger.Info("StartRun: " + i);

          curI = i;
          if (_stop)
            break;

          SimulationTracking.StateTracker trackSim;

          if (_msgServer == null)
            trackSim = new SimulationTracking.StateTracker(_lists, _endTime, 0, null);
          else
            trackSim = new SimulationTracking.StateTracker(_lists, _endTime, _frameRate, _msgServer);

          //trackSim.logFunc = logFunc;

          //logFunc("Run " + i.ToString() + Environment.NewLine);
          List<int> finalStates = trackSim.StartTracker();
          //logFunc("Run " + i.ToString() + " done" + Environment.NewLine);

          if (trackSim.keyStateCnt > 0)
          {
            StatePath[] failedComps = null;

            if (_logFailedComps)
              failedComps = trackSim.GetFailedComponents();

            //if (failedComps.Length == 0)
            //  failedComps = trackSim.GetCurrentStates();
            if (pathOutputFile != null)
            {
              pathOutputFile.WriteLine("Run - " + i.ToString());
            }

            trackSim.GetKeyPaths(keyPaths, otherPaths);
            
            foreach (SimulationEngine.ResultStateBase path in keyPaths.Values)
            {
              string keyStateName = path.name;

              if (logVarVals.Count > 0)
              {
                Dictionary<string, List<string>> varDict;
                if (!_variableVals.TryGetValue(keyStateName, out varDict))
                {
                  varDict = new Dictionary<string, List<string>>();
                  _variableVals.Add(keyStateName, varDict);
                }

                List<string> varVals;

                foreach (string varName in logVarVals)
                {
                  SimVariable curVar = _lists.allVariables.FindByName(varName);
                  if (curVar == null)
                  {
                    this._error = "No variable found named - " + varName;
                    logger.Error(this.error);
                  }

                  if (!varDict.TryGetValue(varName, out varVals))
                  {
                    varVals = new List<string>();
                    varDict.Add(varName, varVals);
                  }

                  varVals.Add(curVar.strValue);
                }
              }

              if (_logFailedComps && (failedComps.Length > 0))
              {
                int[] idArray = failedComps.Select(j => j.state.id).ToArray();
                if (!keyFailedItems.ContainsKey(keyStateName))
                  keyFailedItems.Add(keyStateName, new FailedItems());

                keyFailedItems[keyStateName].AddCompFailSet(idArray);
              }
            }
          }

          if (((stopWatch.Elapsed - resTime) > TimeSpan.FromSeconds(1)) && (i > 0))
          {
            stopWatch.Stop();
            progressCallback(stopWatch.Elapsed, i, _logFailedComps);
            stopWatch.Start();
            resTime = stopWatch.Elapsed;
          }

          actRuns = i;

          logger.Info("EndOfRun: " + i);
        }
      }
      catch(Exception e)
      {        
        _error = "Exception - " + e.Message;
        if (e.InnerException != null)
        {
          _error = _error + Environment.NewLine + e.InnerException;
        }

//#if DEBUG
//        throw e;
//#else

        logger.Info(_error);
//#endif
        retVal = false;
      }

      stopWatch.Stop();      
      if(pathOutputFile != null)
        pathOutputFile.Close();
      progressCallback(stopWatch.Elapsed, actRuns, _logFailedComps);

      if (_jsonResultPaths != "")
      { 
        OverallResults resultObj = new OverallResults();
        resultObj.name = this._lists.name;
        resultObj.keyStates = keyPaths.Values.ToList();
        resultObj.otherStatePaths = otherPaths.Values.ToList();
        resultObj.numRuns = curI;
        resultObj.CalcStats();
        Dictionary<string, int> inStateCnts = new Dictionary<string, int>();
        //foreach (var keyS in resultObj.keyStates)
        //{
        //  Dictionary<string, int> depth = new Dictionary<string, int>();
        //  StateCounts(keyS, inStateCnts, depth);
        //}
        foreach (var keyS in resultObj.keyStates)
        {
          // Dictionary<string, int> depth = new Dictionary<string, int>();
          //SetResultStatsRec(keyS, inStateCnts, curI);//, depth);

          if(_variableVals.Count > 0) //if there are any being tracked, they should have a value for each key state.
            keyS.watchVariables = _variableVals[keyS.name];
        }
     
        string output = JsonConvert.SerializeObject(resultObj, Formatting.Indented);
        File.WriteAllText(_jsonResultPaths, output);
      }
      batchSuccess = retVal;
    }

    /// <summary>
    /// Recursive function to determine how many times each state is entered
    /// </summary>
    /// <param name="curRes"></param>
    /// <param name="cnts"></param>
    //private void StateCounts(ResultState curRes, Dictionary<string, int> cnts, Dictionary<string, int> depths)
    //{
    //  if (depths.ContainsKey(curRes.name) && (depths[curRes.name] > 0))
    //  {
    //    int depth = depths[curRes.name];
    //    cnts[curRes.name +"_"+ (depth+1).ToString()] = curRes.times.Count();
    //    depths[curRes.name] = depth + 1;
    //  }
    //  else
    //  {
    //    if (cnts.ContainsKey(curRes.name))
    //    {
    //      cnts[curRes.name] += curRes.times.Count();
    //    }
    //    else
    //    {
    //      cnts[curRes.name] = curRes.times.Count();
    //    }

    //    //add depth for recursive function
    //    depths[curRes.name] = 1;
    //  }

    //  foreach (var i in curRes.causeDict.Values)
    //  {
    //    if (i.fromState != null)
    //      StateCounts(i.fromState, cnts, depths);
    //  }

    //  //remove on exit of recursive function
    //  depths[curRes.name] -= 1;
    //}

    /// <summary>
    /// Calculate the stats for each state 
    /// </summary>
    /// <param name="curRes"></param>
    /// <param name="inStateCnts"></param>
    /// <param name="totCnt"></param>
    //private void SetResultStatsRec(ResultState curRes, Dictionary<string, int> inStateCnts, int totCnt)//, Dictionary<string, int> depths)
    //{ 
    //  foreach (var i in curRes.enterDict.Values)
    //  {
    //    if (i.otherState != null)
    //      SetResultStatsRec(i.otherState, inStateCnts, curRes.count);//, depths); //key states use total runs for count, other states use total times in the state.
    //  }

    //  //decrement depth for recursive call
    //  //depths[curRes.name] -= 1;
    //}

    public void LogResults(TimeSpan runTime, int runCnt, bool finalValOnly)
    {
      if (_progress != null)
      { 
        _progress.runTime = runTime;
        _progress.percentDone = (runCnt * 100) / this._numRuns;
        _progress.curRun = runCnt;
      }

      if (_resultFile == null)
        return;

      System.IO.File.WriteAllText(_resultFile, "Simulation = " + this._lists.name + Environment.NewLine);
      File.AppendAllText(_resultFile, "Runtime = " + runTime.ToString(@"dd\.hh\:mm\:ss") + Environment.NewLine + "Runs = " + runCnt.ToString() + " of " + _numRuns.ToString()  + Environment.NewLine);

      if (keyPaths.Count > 0)
      {
        var lastItem = keyPaths.Last();
        foreach (var item in keyPaths)
        {
          File.AppendAllText(_resultFile, item.Key + " Occurred " + item.Value.count.ToString() + " times, Rate =" + (item.Value.count / (double)runCnt).ToString() + 
            ", MeanTime = " + item.Value.timeMean.ToString(@"dd\.hh\:mm\:ss") + " +/- " + item.Value.timeStdDeviation.ToString(@"dd\.hh\:mm\:ss\.ff") + Environment.NewLine, Encoding.UTF8);
          //todo write the failed components and times.
          if (keyFailedItems.ContainsKey(item.Key))
          {
            foreach (var cs in keyFailedItems[item.Key].compFailSets)
            {
              int[] ids = cs.Key.Get1sIndexArray();
              List<string> names = new List<String>();
              foreach (int id in ids)
              {
                //if(ids.Length > 3)
                //  names.Add(lists.allStates[id].name + "[" + id.ToString() + "]");
                //else
                names.Add(_lists.allStates[id].name);
              }
              names.Sort();
              double csPercent = ((double)cs.Value / item.Value.count) * 100;

              string csLine = "(" + cs.Value.ToString() + ")[" + csPercent.ToString() + "]" + string.Join(", ", names);

              File.AppendAllText(_resultFile, csLine + Environment.NewLine, Encoding.UTF8);

            }
          }

          Dictionary<string, List<string>> varDict;
          if (_variableVals.TryGetValue(item.Key, out varDict))
          {
            //List<double> varVals;
            File.AppendAllText(_resultFile, "- Variable Values - " + Environment.NewLine, Encoding.UTF8);
            if (!finalValOnly || (item.Value == lastItem.Value))
            {
              foreach (var varValItem in varDict)
              {
                string varName = varValItem.Key;
                string varValues = "";
                if (finalValOnly)
                  varValues = varValItem.Value.Last<string>().ToString();
                else
                  varValues = string.Join(",", varValItem.Value);
                File.AppendAllText(_resultFile, varName + " = " + varValues + Environment.NewLine, Encoding.UTF8);
              }
            }
          }
        }
      }
    }

    public List<string> GetVarValues(List<string> varNames, bool log = false)
    {
      List<string> retVals = new List<string>();
      foreach(string name in varNames)
      {
        string val = _lists.allVariables.FindByName(name).strValue;
        retVals.Add(val);

        if (log)
        {
          File.AppendAllText(_resultFile, name + " - " + val.ToString()  + Environment.NewLine, Encoding.UTF8);
        }
      }

      

      return retVals;
    }
  }
}