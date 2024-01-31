// Copyright 2021 Battelle Energy Alliance

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
using System.Threading;
using Matrix.Xmpp.XHtmlIM;
using System.Xml.Linq;

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
    private int _pathResultsInterval = -1;
    private Dictionary<string, List<double>> finalVarValueList = new Dictionary<string, List<double>>();

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

    public ProcessSimBatch(EmraldModel lists, TimeSpan endtime, string resultFile, string jsonResPaths, int pathResultsInterval)
    {
      this._lists = lists;
      this._endTime = endtime;
      this._resultFile = resultFile;
      this._jsonResultPaths = jsonResPaths;
      this._pathResultsInterval = pathResultsInterval;
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
      if (_pathResultsInterval < 1)
        _pathResultsInterval = _numRuns;

      StreamWriter pathOutputFile = null;
      if (!string.IsNullOrEmpty(_keyPathsOutput)) 
        pathOutputFile = new StreamWriter(_keyPathsOutput, append: false);

      //if user defined the seed then reset random so that seed is used.
      if ((ConfigData.seed != null) && (ConfigData.seed >= 0))
        SingleRandom.Reset();

      //make a list of result items for each key state.
      //ResultState[] keyStates = _lists.allStates.Where(i => i.Value.stateType == EnStateType.stKeyState).Select(i => new ResultState(i.Value.name)).ToArray();
      //Dictionary<string, ResultState> keyStateResMap = null;
     
      //progressCallback(stopWatch.Elapsed, 0);
      try
      {
        _lists.allVariables.ReInitAll();
        _lists.curRunIdx = 0;

        SimulationTracking.StateTracker trackSim;
        if (_msgServer == null)
          trackSim = new SimulationTracking.StateTracker(_lists, _endTime, 0, null, _numRuns);
        else
          trackSim = new SimulationTracking.StateTracker(_lists, _endTime, _frameRate, _msgServer, _numRuns);

        for (int i = 1; i <= _numRuns; ++i)
        {
          SetLog(i);

          logger.Info("StartRun: " + i);

          curI = i;
          if (_stop)
            break;          

          //Run the simulation and get final states
          List<int> finalStates = trackSim.StartTracker();

          if (trackSim.keyStateCnt > 0)
          {
            StatePath[] failedComps = null;

            if (_logFailedComps)
              failedComps = trackSim.GetFailedComponents();

            if (pathOutputFile != null)
            {
              pathOutputFile.WriteLine("Run - " + i.ToString());
            }

            //get the key paths
            var curKeyStates = trackSim.GetKeyPaths(keyPaths, otherPaths, logVarVals);

            //for this runs key states, add the failed components
            foreach (var curKeyState in curKeyStates)
            {
              if (_logFailedComps && (failedComps.Length > 0))
              {
                int[] idArray = failedComps.Select(j => j.state.id).ToArray();
                if (!keyFailedItems.ContainsKey(curKeyState.Key))
                  keyFailedItems.Add(curKeyState.Key, new FailedItems());

                keyFailedItems[curKeyState.Key].AddCompFailSet(idArray);
              }
            }

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
            }
          
            foreach (var v in _lists.allVariables.Values)
            {
              //save cumulativeStats for numeric types
              if (v.cumulativeStats && ((v.dType != typeof(string)) || (v.dType != typeof(bool))))
              {
                List<double> values;
                if (!finalVarValueList.TryGetValue(v.name, out values))
                {
                  finalVarValueList.Add(v.name, new List<double> { v.dblValue });
                }
                else
                {
                  values.Add(v.dblValue);
                }
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

          if ((i % _pathResultsInterval) == 0)
          {
            MakePathResults(curI, false);
          }
        }

        //send message to all ext sims to terminate
        trackSim.SendExtSimTerminate();
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

      MakePathResults(curI, true);

      
      

      batchSuccess = retVal;
    }

    //protected virtual bool IsFileLocked(FileInfo file)
    //{
    //  try
    //  {
    //    using (FileStream stream = file.Open(FileMode.Open, FileAccess.Read, FileShare.None))
    //    {
    //      stream.Close();
    //    }
    //  }
    //  catch (IOException)
    //  {
    //    //the file is unavailable because it is:
    //    //still being written to
    //    //or being processed by another thread
    //    //or does not exist (has already been processed)
    //    return true;
    //  }

    //  //file is not locked
    //  return false;
    //}
    private static ReaderWriterLockSlim _readWriteLock = new ReaderWriterLockSlim();

    public void WriteToFileThreadSafe(string path, string text)
    {
      // Set Status to Locked
      _readWriteLock.EnterWriteLock();
      try
      {
        if(File.Exists(path))
        {
          bool deleted = false;
          while (!deleted)
          {
            try
            {
              File.Delete(path);
              deleted = true;
            }
            catch { };
          }

        }
        // Append text to the file
        using (StreamWriter sw = File.AppendText(path))
        {
          sw.WriteLine(text);
          sw.Close();
        }
      }
      finally
      {
        // Release lock
        _readWriteLock.ExitWriteLock();
      }
    }

    private bool MakePathResults(int curIdx, bool makeSankey)
    {
      try
      {
        if (_jsonResultPaths != "")
        {
          OverallResults resultObj = new OverallResults();
          resultObj.name = this._lists.name;
          resultObj.keyStates = keyPaths.Values.ToList();
          resultObj.otherStatePaths = otherPaths.Values.ToList();
          resultObj.numRuns = curIdx;
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

            if (_variableVals.Count > 0) //if there are any being tracked, they should have a value for each key state.
              keyS.watchVariables = _variableVals[keyS.name];
          }

          string output = JsonConvert.SerializeObject(resultObj, Formatting.Indented);
          //if (File.Exists(_jsonResultPaths))
          //{
          //  bool locked = true;
          //  while (locked)
          //  { 
          //    locked = IsFileLocked(new FileInfo(_jsonResultPaths));
          //  }
          //}
          //File.WriteAllText(_jsonResultPaths, output);
          WriteToFileThreadSafe(_jsonResultPaths, output);

          //set up the sankey file to view results
          if (makeSankey)
          {
            string tempLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\\EMRALD_SANKEY\\";
            try
            {
              if (Directory.Exists(tempLoc))
              {
                Directory.Delete(tempLoc, true);
              }
              Directory.CreateDirectory(tempLoc);

              File.WriteAllText(Path.Combine(tempLoc, @"data.js"), @"window.data=" + output);
            }
            catch
            {
              File.WriteAllText(Path.Combine(tempLoc, @"data.js"), @"window.data= ");
            }

            File.Copy(@"./sankey/emrald-sankey-timeline.html", Path.Combine(tempLoc, @"emrald-sankey-timeline.html"));
            File.Copy(@"./sankey/emrald-sankey-timeline.js", Path.Combine(tempLoc, @"emrald-sankey-timeline.js"));
          }
        }
      }
      catch (Exception e)
      {
        _error = "Error writing path results file - " + Environment.NewLine + e.InnerException;
        Console.Write(_error);
        logger.Info(_error);
        return false;
      }
      return true;
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

    public void LogResults(TimeSpan runTime, int runCnt, bool logFailedComps)
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
      using (StreamWriter streamwriter = File.AppendText(_resultFile))
      {
        streamwriter.WriteLine("Runtime = " + runTime.ToString(@"dd\.hh\:mm\:ss") + Environment.NewLine + "Runs = " + runCnt.ToString() + " of " + _numRuns.ToString());
        if (keyPaths.Count > 0)
        {
          var lastItem = keyPaths.Last();
          foreach (var item in keyPaths)
          {
            streamwriter.WriteLine(item.Key + " Occurred " + item.Value.count.ToString() + " times, Rate =" + (item.Value.count / (double)runCnt).ToString() +
              ", MeanTime = " + item.Value.timeMean.ToString(@"dd\.hh\:mm\:ss") + " +/- " + item.Value.timeStdDeviation.ToString(@"dd\.hh\:mm\:ss\.ff"));
            //write the failed components and times.
            if (logFailedComps && keyFailedItems.ContainsKey(item.Key))
            {
              foreach (var cs in keyFailedItems[item.Key].compFailSets)
              {
                int[] ids = cs.Key.Get1sIndexArray();
                List<string> names = new List<String>();
                foreach (int id in ids)
                {
                  names.Add(_lists.allStates[id].name);
                }
                names.Sort();
                double csPercent = ((double)cs.Value / item.Value.count) * 100;

                string csLine = "(" + cs.Value.ToString() + ")[" + csPercent.ToString() + "]" + string.Join(", ", names);

                streamwriter.WriteLine(csLine);
              }
            }
            Dictionary<string, List<string>> varDict;
            if (_variableVals.TryGetValue(item.Key, out varDict))
            {
              streamwriter.WriteLine("- Variable Values - ");
              //write the name of each variable for header
              string varNames = "Run Idx, " + string.Join(", ", varDict.Keys.ToList());
              streamwriter.WriteLine(varNames);

              for (int row = 0; row < runCnt; row++)
              {
                string varValues = (row + 1).ToString();
                foreach (var varValItem in varDict.Values)
                {
                  //get the value for each variable in a row
                  if (varValItem.Count > row)
                  {
                    varValues = varValues + ", " + varValItem[row];
                  }
                  else
                  {
                    varValues = varValues + ", " + "unkown";
                  }
                }
               streamwriter.WriteLine(varValues);
              }
            }
          }
        }
      }
    }

    public List<string> GetVarValues(List<string> varNames, bool finalLog = false)
    {
      List<string> retVals = new List<string>();
      if (finalLog)
      {
        File.AppendAllText(_resultFile, "---------------------------" + Environment.NewLine, Encoding.UTF8);
        File.AppendAllText(_resultFile, "- End Sim Variable Values -" + Environment.NewLine, Encoding.UTF8);
        File.AppendAllText(_resultFile, "---------------------------" + Environment.NewLine, Encoding.UTF8);
      }

      foreach (string name in varNames)
      {
        SimVariable v = _lists.allVariables.FindByName(name);
        
        string val = _lists.allVariables.FindByName(name).strValue;
        retVals.Add(val);

        if (finalLog)
        {
          
          List<double> values;
          if (finalVarValueList.TryGetValue(name, out values))
          {
            //get the sum, average and std dev of the variable.
            double sum = values.Sum();
            double mean = sum / values.Count;
            double std = 0;
            if (values.Count > 0)
            {
              double sumDiffSq = 0; //sum of difference squared;
              foreach (double t in values)
              {
                sumDiffSq += Math.Pow(((t) - mean), 2);
              }

              //calc variance   
              double variance = sumDiffSq / (values.Count - 1);
              std = Math.Sqrt(variance); //return square root of variance
            }

            File.AppendAllText(_resultFile, name + " Total = " + sum.ToString() + Environment.NewLine, Encoding.UTF8);
            File.AppendAllText(_resultFile, name + " Mean = " + mean.ToString() + Environment.NewLine, Encoding.UTF8);
            File.AppendAllText(_resultFile, name + " Standard Deviation = +/- " + std.ToString() + Environment.NewLine, Encoding.UTF8);
          }
          else
          {
            File.AppendAllText(_resultFile, name + " = " + val.ToString() + Environment.NewLine, Encoding.UTF8);
          }
        }
      }



      return retVals;
    }
  }
}