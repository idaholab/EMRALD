// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using MathNet.Numerics.Statistics;
using Matrix.Xmpp.AdHocCommands;
using Matrix.Xmpp.PubSub;
using Matrix.Xmpp.StreamInitiation;
using Matrix.Xmpp.XHtmlIM;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using MyStuff.Collections;
using Newtonsoft.Json;
using NLog;
using SimulationDAL;
using SimulationTracking;
//using System.Windows.Forms;
using XmppMessageServer;

namespace SimulationEngine
{
  //public class Progress
  //{
  //  public int percentDone = 0;
  //  public TimeSpan runTime = TimeSpan.Zero;
  //  public int curRun = 0;
  //  public bool done = false;
  //}

  public delegate void TProgressCallBack(TimeSpan runTime, int runCnt, bool finalValOnly, int? threadNum);
    
  public class FailedItems 
  {
    public Dictionary<MyBitArray, int> compFailSets = new Dictionary<MyBitArray, int>();


    public FailedItems()
    {
    }

    public void AddCompFailSet(int[] compList)
    {
      MyBitArray addSet = new MyBitArray(compList);
      AddCompFailBitSet(addSet);
    }

    public void AddCompFailBitSet(MyBitArray addSet)
    {
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

    public void CombineFailSet(FailedItems addSet)
    {
      foreach(var bs in addSet.compFailSets)
      {
        if(this.compFailSets.ContainsKey(bs.Key))
          compFailSets[bs.Key] = compFailSets[bs.Key] + bs.Value;
        else
          compFailSets.Add(bs.Key, bs.Value);
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
    private string _resultFile; //same as _origionalResutsFile unless multi threded then it is in the temp file path location
    private static readonly object _fileLock = new object();
    private string _origionalResutsFile; //user specified results location;
    private int _numRuns;
    private string _jsonResultPaths; //same as _origionalJsonResutsFile unless multi threded then it is in the temp file path location
    private string _origionalJsonResutsFile; //user specified results location;
    private TimeSpan _totRunTime = TimeSpan.Zero;
    private volatile bool _stop = false;
    private bool _logFailedComps = false;
    public bool batchSuccess = false;
    private int _pathResultsInterval = -1; //how often to save the path results to the file
    private Dictionary<string, List<double>> finalVarValueList = new Dictionary<string, List<double>>();
    private int? _threadNum = 0;
    protected string modelTxt = ""; //JSON text of the model
    protected string origionalRootPath = ""; //Origonal path to the model file
    protected string origionalFileName = ""; //origional file Name
    protected bool _tempThreadFilesWriten = false;
    


    //public Dictionary<string, double> variableVals { get { return _variableVals; } }
    public Dictionary<string, FailedItems> keyFailedItems = new Dictionary<string, FailedItems>(); //key = StateName, value = cut sets
    public Dictionary<string, KeyStateResult> keyPaths = new Dictionary<string, KeyStateResult>();
    public Dictionary<string, ResultState> otherPaths = new Dictionary<string, ResultState>();
    private Dictionary<string, Dictionary<string, Dictionary<string, string>>> _variableVals = new Dictionary<string, Dictionary<string, Dictionary<string, string>>>();
    public TProgressCallBack progressCallback;
    public List<string> logVarVals = new List<string>();
    public Dictionary<string, string> initVarVals = new Dictionary<string, string>();

    //public List<Tuple<string, double>> 
    public TimeSpan runtime = TimeSpan.FromMilliseconds(0);
    private string _error = "";
    public string error { get { return _error; } }
    public int? threadNum { get { return _threadNum; } }
    public int numRuns { get { return _numRuns; } }
    public bool tempThreadFilesWriten { get {  return _tempThreadFilesWriten; } }
    //public string resultFile { get { return _resultFile; } }
    //public string jsonResultsPaths { get { return _jsonResultPaths; } }

    public ProcessSimBatch(EmraldModel origModel, TimeSpan endtime, string resultFile, string jsonResPaths, int pathResultsInterval, int? threadNum = null)
    {
      //don't deserialize model here because the singletions for numbering are by thread and the tread has not been assigned yet if multitheading
      modelTxt = origModel.modelTxt;
      origionalRootPath = origModel.rootPath;
      origionalFileName = origModel.fileName;
      this._threadNum = threadNum;
      this._endTime = endtime;
      this._pathResultsInterval = pathResultsInterval;
      this.progressCallback = null;
      this._origionalJsonResutsFile = jsonResPaths;
      this._origionalResutsFile = resultFile;



      this._resultFile = resultFile;
      this._jsonResultPaths = jsonResPaths;
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

    public void SetupBatch(int numRuns, bool logFailedComps = false)
    {
      _numRuns = numRuns;
      _logFailedComps = logFailedComps;
    }

    public void StopSims()
    {
      _stop = true;
    }

    public void RunBatch()
    {
      //make a new model so that we don't have issues if they run multiple batches or for mutli thraded must do in the thread function
      _tempThreadFilesWriten = false;
      this._lists = new EmraldModel();
      this._lists.DeserializeJSON(modelTxt, origionalRootPath, origionalFileName, threadNum); //this will update any references automatically if the threadNum != null
      _tempThreadFilesWriten = true;

      //if this is mutithreaded then it needs a temp work area for the model and results.
      if (threadNum != null)
      {
        try
        {
          // Set the file paths with the rootPath
          lock (_fileLock)
          {
            this._resultFile = Path.Combine(this._lists.rootPath, Path.GetFileName(_resultFile));
            this._jsonResultPaths = Path.Combine(this._lists.rootPath, Path.GetFileName(_jsonResultPaths));
          }
        }
        catch (Exception e)
        {
          _error = "Failed to prep for Multi Threading: " + e.Message;
        }
      }
      

      //if there were any xmpp connections specified in the perams not set by the user, connect here
      if (!AutoConnectExtSim())
      {
        this._error = "Failed to connect to external simulation.";
        logger.Error(this.error); 
      }

      //Reassign any initial variable values specified by the user.
      foreach(var v in initVarVals)
      {
        var varItem = this._lists.allVariables.FindByName(v.Key);
        if (varItem == null)
        {
          this._error = "User wanted to assign inital value to variable " + v.Key + " but it doesn't exist in the model";
          logger.Error(this.error);
          return;
        }

        varItem.InitValue(v.Value);
      }

      keyFailedItems.Clear();
      keyPaths.Clear();
      otherPaths.Clear();
      _variableVals.Clear();



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

      //if user defined the seed then reset random so that seed is used.
      if ((ConfigData.seed != null) && (ConfigData.seed >= 0))
        SingleRandom.Reset();
     
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

            //add all of the variable values for each run to the _variableVals results if in the curKeyState for that run
            foreach (SimulationEngine.ResultStateBase path in keyPaths.Values)
            {
              string keyStateName = path.name;

              if (logVarVals.Count > 0)
              {
                Dictionary<string, Dictionary<string, string>> varDict;
                if (!_variableVals.TryGetValue(keyStateName, out varDict))
                {
                  varDict = new Dictionary<string, Dictionary<string, string>>();
                  _variableVals.Add(keyStateName, varDict);
                }

                Dictionary<string, string> varVals;

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
                    varVals = new Dictionary<string, string>();
                    varDict.Add(varName, varVals);
                  }

                  //if the state is in the current Key states then add the variable value
                  if (curKeyStates.ContainsKey(keyStateName))
                    varVals.Add(i.ToString(), curVar.strValue);
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

          
          //When to write results so user gets and update every second. 
          if (((stopWatch.Elapsed - resTime) > TimeSpan.FromSeconds(1)) && (i > 0))
          {
            stopWatch.Stop();
            LogResults(stopWatch.Elapsed, i, _logFailedComps);
            if(progressCallback != null)
              progressCallback(stopWatch.Elapsed, i, _logFailedComps, _lists.threadNum);
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
      this._totRunTime = stopWatch.Elapsed;

      WriteFinalResults();

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

    //if this is the final results of a mutli thread pass in ignoreThreadPath and the threadCnt 
    public void WriteFinalResults(bool ignoreThreadPath = false, int threadCnt = 1)
    {
      if ((threadNum != null) && ignoreThreadPath)
      {
        // reset the file paths without the temp path info
        this._resultFile = _origionalResutsFile;
        this._jsonResultPaths = _origionalJsonResutsFile;
      }

      LogResults(_totRunTime, _numRuns, _logFailedComps, threadCnt);
      MakePathResults(_numRuns, true);
      GetVarValues(logVarVals, true);

      if (progressCallback != null)
        progressCallback(_totRunTime, _numRuns, _logFailedComps, _lists.threadNum);
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

          //set up the sankey file to view results if not a thread one.
          if (!this._threadNum.HasValue && makeSankey)
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

    

    private void LogResults(TimeSpan runTime, int runCnt, bool logFailedComps, int threadCnt = 1) //set maxThreadNum if loging combined thread results
    {
      //if (_progress != null) //this updates .
      //{ 
      //  _progress.runTime = runTime;
      //  _progress.percentDone = (runCnt * 100) / this._numRuns;
      //  _progress.curRun = runCnt;
      //}

      if (_resultFile == null)
        return;

      System.IO.File.WriteAllText(_resultFile, "Simulation = " + this._lists.name + Environment.NewLine);
      lock (_fileLock)
      {
        using (StreamWriter streamwriter = File.AppendText(_resultFile))
        {
          streamwriter.WriteLine("Runtime = " + runTime.ToString(@"dd\.hh\:mm\:ss") + Environment.NewLine + "Runs = " + runCnt.ToString() + " of " + _numRuns.ToString());
          if (keyPaths.Count > 0)
          {
            foreach (var item in keyPaths)
            {
              streamwriter.WriteLine(Environment.NewLine + item.Key + " Occurred " + item.Value.count.ToString() + " times, Probability =" + (item.Value.count / (double)runCnt).ToString() +
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

                  string csLine = "(" + cs.Value.ToString() + ")[" + csPercent.ToString("N3") + "%]" + string.Join(", ", names);

                  streamwriter.WriteLine(csLine);
                }
              }
              Dictionary<string, Dictionary<string, string>> varDict;
              if (_variableVals.TryGetValue(item.Key, out varDict))
              {
                streamwriter.WriteLine("- Variable Values - ");
                //write the name of each variable for header
                string varNames = "Run Idx, " + string.Join(", ", varDict.Keys.ToList());
                streamwriter.WriteLine(varNames);

                for (int row = 1; row <= runCnt; row++) //start number at 1
                {
                  //look for added results from other threads in X.x or RunNum.thread syntax
                  for (int threadNum = 0; threadNum < threadCnt; threadNum++)
                  {

                    string key = (row).ToString();

                    //thread output is normal output of 1,2,3,4, other threads are 1.1, 2.1, 3.1 ... 1.2, 2.2, 3.2 ...
                    if (threadNum > 0)
                      key = key + "." + (threadNum).ToString();

                    bool hasRunValue = false;
                    string varValues = key;
                    foreach (var varValItem in varDict.Values)
                    {
                      //get the value for each variable in a row if has a value
                      if (varValItem.ContainsKey(key))
                      {
                        varValues = varValues + ", " + varValItem[key];
                        hasRunValue = true;
                      }
                    }

                    if (hasRunValue)
                      streamwriter.WriteLine(varValues);
                  }
                }
              }
            }
          }
        }
      }
    }

    public List<string> GetVarValues(List<string> varNames, bool finalLog = false)
    {
      List<string> retVals = new List<string>();
      lock (_fileLock) //lock for threading
      {
        
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
      }
      return retVals;
    }

    public void AddOtherBatchResults(ProcessSimBatch toAddBatch)
    {
      //go through all the key paths and add them to the one in this batch.
      //public Dictionary<string, KeyStateResult> keyPaths = new Dictionary<string, KeyStateResult>();
      foreach (var keyPath in toAddBatch.keyPaths)
      {
        if (!this.keyPaths.ContainsKey(keyPath.Key))
          this.keyPaths.Add(keyPath.Value.name, keyPath.Value);
        else
        {
          KeyStateResult addToRes = this.keyPaths[keyPath.Key];
          addToRes.Merge(keyPath.Value, this._numRuns, this._numRuns + toAddBatch._numRuns);
        }

        this.keyPaths[keyPath.Key].AssignResults();
      }

      //todo add in the other paths
      //public Dictionary<string, ResultState> otherPaths = new Dictionary<string, ResultState>();
      foreach (var otherPath in toAddBatch.otherPaths)
      {
        if (!this.otherPaths.ContainsKey(otherPath.Key))
          this.otherPaths.Add(otherPath.Value.name, otherPath.Value);
        else
          otherPath.Value.Combine(otherPath.Value);
      }

      //add in keyFailedItems
      //public Dictionary<string, FailedItems> keyFailedItems = new Dictionary<string, FailedItems>(); //key = StateName, value = cut sets
      foreach (var failedItem in toAddBatch.keyFailedItems)
      {
        if (!this.keyFailedItems.ContainsKey(failedItem.Key))
          this.keyFailedItems.Add(failedItem.Key, failedItem.Value);
        else
        {
          this.keyFailedItems[failedItem.Key].CombineFailSet(failedItem.Value);
        }
      }

      ////add in variable values //already done when doing addToRes.Merge 
      ////private Dictionary<string, Dictionary<string, Dictionary<string, string>>> _variableVals = new Dictionary<string, Dictionary<string, Dictionary<string, string>>>();
      //foreach (var variableCategory in toAddBatch._variableVals)
      //{
      //  if (!this._variableVals.ContainsKey(variableCategory.Key))
      //    this._variableVals.Add(variableCategory.Key, new Dictionary<string, Dictionary<string, string>>(variableCategory.Value));
      //  else
      //  {
      //    foreach (var variableSubCategory in variableCategory.Value)
      //    {
      //      if (!this._variableVals[variableCategory.Key].ContainsKey(variableSubCategory.Key))
      //        this._variableVals[variableCategory.Key].Add(variableSubCategory.Key, new Dictionary<string, string>(variableSubCategory.Value));
      //      else
      //      {
      //        foreach (var variable in variableSubCategory.Value)
      //        {
      //          //add to list not update???
      //          if (!this._variableVals[variableCategory.Key][variableSubCategory.Key].ContainsKey(variable.Key))
      //            this._variableVals[variableCategory.Key][variableSubCategory.Key].Add(variable.Key, variable.Value);
      //          else
      //            this._variableVals[variableCategory.Key][variableSubCategory.Key][variable.Key] = variable.Value; // Update with the new value
      //        }
      //      }
      //    }
      //  }
      //}

      this._totRunTime += toAddBatch._totRunTime;
      this._numRuns += toAddBatch._numRuns;
    }

    public void ClearTempThreadData()
    {
      this._lists.ClearMultiThreadData();
    }
  }
}