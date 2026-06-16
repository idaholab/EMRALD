// Copyright 2021 Battelle Energy Alliance
// Entry point for running an EMRALD simulation from JSON options and model data, coordinating simulation batches and messaging.

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using MessageDefLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NLog;
using SimulationDAL;
using XmppMessageServer;
using CouplingWebSocket;
using XmppServer;

namespace SimulationEngine
{
  public class VarInitValue
  {
    public string varName { get; set; }
    public string value { get; set; }
  }

  public class JSONRun
  {
    private string _optsJsonStr = "";
    private string _modelJsonStr = "";
    private string _optionsFilePath = ""; // path to the options JSON file, used to resolve relative inpfile paths
    TProgressCallBack _progressCallBack = null;
    private string _error = "";
    public Options_cur options = new Options_cur();
    //private bool _done = false;
    private ISimMessaging _msgCoupler = null;
    
    // Create attributes for objects
    private List<ProcessSimBatch> _simRuns = new List<ProcessSimBatch>();
    private EmraldModel _model = null;
    
    // Create other attributes
    public bool cancel = false;
    public double percentDone = 0;

    public string error { get { return _error; } }
    public List<ProcessSimBatch> simRuns { get {return _simRuns;} }
    public EmraldModel model { get { return _model; } }


    public JSONRun(string optionsJsonStr, string modelJsonStr = "", TProgressCallBack progressCallBack = null, string optionsFilePath = "")
    {
      // Set model text first so LoadJson can skip the inpfile-on-disk check when the model is supplied in-memory.
      _modelJsonStr = modelJsonStr;
      _optsJsonStr = optionsJsonStr;
      _optionsFilePath = optionsFilePath;
      //Load JSON options
      if (_optsJsonStr != "")
        _error = LoadJson(_optsJsonStr, ref options);
      if (_error != "")
        throw new Exception("Error Loading JSON run options - " + error);
      _progressCallBack = progressCallBack;
    }

    public JSONRun(Options_cur ops, string modelJsonStr = "", TProgressCallBack progressCallBack = null, string optionsFilePath = "")
    {
      // Set model text first so LoadJson can skip the inpfile-on-disk check when the model is supplied in-memory.
      _modelJsonStr = modelJsonStr;
      _optionsFilePath = optionsFilePath;
      this.options = ops;
      _optsJsonStr = JsonConvert.SerializeObject(ops);
      _error = LoadJson(_optsJsonStr, ref options);
      if (_error != "")
        throw new Exception("Error Loading JSON run options - " + error);
      _progressCallBack = progressCallBack;
    }

    public async Task<string> RunSim()
    {
      percentDone = 0;

      if (_modelJsonStr != "")
      {
        if (options.inpfile == null)
        {
          _error = "No valid model path";
          return _error;
        }
      }

      try
      {
        if (_modelJsonStr == "")
          _modelJsonStr = File.ReadAllText(options.inpfile);
      }
      // If it is not acceptable, fill in the error message
      catch (Exception ex)
      {
        _error = "Invalid model file " + ex.Message + " - " + options.inpfile;
        return _error;
      }
      ;

      // Check that the json string syntax is acceptable, validate model uses a dynamic object, so it doesn't check the json syntax right away.
      try
      {
        JObject modelJson = JObject.Parse(_modelJsonStr);
      }
      // If it is not acceptable, fill in the error message
      catch (Exception ex)
      {
        _error = "Bad model JSON syntax - " + ex.Message;
        return _error;
      }
      ;

      if (!ValidateModel())
      {
        return _error;
      }

      //Warn if options reference variables that aren't in the loaded model
      string varIssues = CheckOptionsVariablesAgainstModel();
      if (!string.IsNullOrEmpty(varIssues))
      {
        Console.WriteLine(varIssues);
      }

      //setup debug options
      switch (options.debug.ToUpper())
      {
        case "BASIC":
          ConfigData.debugLev = LogLevel.Info;
          break;
        case "DETAILED":
          ConfigData.debugLev = LogLevel.Debug;
          break;
        case "OFF":
          ConfigData.debugLev = LogLevel.Off;
          break;
      }

      ConfigData.debugRunStart = options.debugStartIdx;
      ConfigData.debugRunEnd = options.debugEndIdx;
      ConfigData.seed = options.seed;
      ConfigData.threads = options.threads;
      ConfigData.threads = ConfigData.threads != 0 ? ConfigData.threads : null; //don't allow 0 for threads.
     
      //Assign any coupling data from JSON file
      //start connectons needed
      if (options.couplingInfo != null)
      {
        //Set coupling connection stuff
        if (options.couplingInfo.couplingPassword != null)
          _msgCoupler.connectionPassword = options.couplingInfo.couplingPassword;

        if (options.couplingInfo.couplingType == CouplingType.WebSocket)
        {
          Dictionary<string, List<String>> appVars = new Dictionary<string, List<String>>();
          foreach (var v in _model.allVariables.Values)
          {
            if (v is Sim3DVariable)
            {
              string appName = (v as Sim3DVariable).resourceName;
              if (!appVars.ContainsKey(appName))
                appVars[appName] = new List<string>();

              appVars[appName].Add((v as Sim3DVariable).sim3DNameId);
            }
          }
          foreach (var extSim in _model.allExtSims.Values)
          {
            Guid conID;
            if (appVars.ContainsKey(extSim.resourceName))
              conID = (_msgCoupler as WebApiCoupling).StartupApp(extSim.resourceName, appVars[extSim.resourceName]).Result;
            else
              conID = (_msgCoupler as WebApiCoupling).StartupApp(extSim.resourceName, new List<string>()).Result;

            extSim.connectionID = conID.ToString();
          }
        }
      }
      //set the time limits for any ext Apps
      foreach (var extSim in _model.allExtSims.Values)
      {
        extSim.simMaxTime = TimeSpan.Parse(options.runtime);
      }

      // Create a new ProcessSimBatch object
      // This is where the maxTime and outfile_path attributes are used
      List<Task> tasks = new List<Task>();
      _simRuns.Clear();
      int threadCnt = ConfigData.threads == null ? 1 : (int)ConfigData.threads;
      int runsDiv = options.runct / threadCnt;

      for (int i = 0; i < threadCnt; i++) //if null just run once.
      {
        int threadIndex = i;  // <-- CAPTURE i's current value immediately
        _simRuns.Add(new ProcessSimBatch(_model, TimeSpan.Parse(options.runtime), options.resout, options.jsonRes, options.pathResultsInterval, ConfigData.threads == null ? null : i));

        if (_msgCoupler != null)
        {
          _simRuns[threadIndex].AddExtSimulationData(_msgCoupler);
        }

        if (_progressCallBack != null)
          _simRuns[threadIndex].progressCallback = _progressCallBack;

        if (threadIndex == 0) //add extra runs on the first one
          _simRuns[threadIndex].SetupBatch(runsDiv + (options.runct % threadCnt), true);
        else
          _simRuns[threadIndex].SetupBatch(runsDiv, true);

        foreach (var v in _model.allVariables.Values)
        {
          if (v.monitorInSim)
            _simRuns[threadIndex].logVarVals.Add(v.name);
        }
        if (this.options.variables is not null)
        {
          foreach (var varItem in this.options.variables)
          {
            string varName = varItem.ToString();
            if (!_simRuns[threadIndex].logVarVals.Contains(varName))
              _simRuns[threadIndex].logVarVals.Add(varName);
          }
        }

        foreach (var varItem in this.options.initVars)
        {
          _simRuns[threadIndex].initVarVals.Add(varItem.varName, varItem.value);
        }

        if (threadIndex == 0)
        {
          // Start the first thread immediately so it can set up the files needed by the others
          var task = Task.Factory.StartNew(() =>
          {
            if (ConfigData.seed != null)
              SingleRandom.Reset((int)ConfigData.seed + threadIndex);

            _simRuns[threadIndex].RunBatch();
            if (_simRuns[threadIndex].error != "")
              _error += _simRuns[threadIndex].error + Environment.NewLine;
            else
              _simRuns[threadIndex].GetVarValues(_simRuns[threadIndex].logVarVals, true);
          }, CancellationToken.None, TaskCreationOptions.LongRunning, TaskScheduler.Default);
          tasks.Add(task);
        }
        else
        {
          // Delay the start of all but first thread so that it has time to write so others have time to copy data
          var task = Task.Factory.StartNew(() =>
          {
            if (ConfigData.seed != null)
              SingleRandom.Reset((int)ConfigData.seed + threadIndex);

            //wait until first thread is done writing temp tread files.
            while (!_simRuns[0].tempThreadFilesWriten)
              Thread.Sleep(10);  // Adjust the delay as needed

            _simRuns[threadIndex].RunBatch();
            if (_simRuns[threadIndex].error != "")
              _error += _simRuns[threadIndex].error + Environment.NewLine;
            else
              _simRuns[threadIndex].GetVarValues(_simRuns[threadIndex].logVarVals, true);
          }, CancellationToken.None, TaskCreationOptions.LongRunning, TaskScheduler.Default);
          tasks.Add(task);
        }
      }

      // Wait for all tasks to complete asynchronously
      await Task.WhenAll(tasks);

      //compile results if needed
      for (int i = 1; i < _simRuns.Count; i++)
      {
        _simRuns[0].AddOtherBatchResults(_simRuns[i]);
      }
      _simRuns[0].WriteFinalResults(true, threadCnt);

      if (options.clearThreadTemps)
        foreach (var simRun in _simRuns)
          simRun.ClearTempThreadData();

      return error;
    }

    public void StopSims()
    {
      foreach (var simRun in _simRuns)
      {
        simRun.StopSims();
      }
    }

    public string LoadJson(string optionsJsonStr, ref Options_cur optionsOut)
    {

      //upgrade from 1.01 to 1.02 if older

      try
      {
        // Parse JSON to check version
        var jsonObject = JObject.Parse(optionsJsonStr);
        double version = jsonObject.Value<double?>("opsVer") ?? 1.0;

        // Upgrade from 1.01 (or older) to 1.02 if needed
        if (version < 1.02)
        {
          optionsJsonStr = Options_cur.ConvertOptionsJsonTo1_02(optionsJsonStr);
        }

        // Deserialize the (possibly upgraded) JSON
        optionsOut = JsonConvert.DeserializeObject<Options_cur>(optionsJsonStr);
      }
      catch (JsonException)
      {
        return "Invalid JSON run options, please fix.";
      }
      catch (Exception ex)
      {
        return $"Error loading options: {ex.Message}";
      }


      // Initialize a new TimeSpan object named maxTime, with a value based on the "runtime" json input
      try
      {
        var time = TimeSpan.Parse(optionsOut.runtime);
      }
      catch
      {
        return "Invalid Max Simulation Time, please fix.";
      }
      // Save the inpfile_path string based on the "inpfile" json input
      try
      {
        if (!string.IsNullOrEmpty(optionsOut.inpfile)) //can be empty/null then must be passed into the run command
        {
          //A relative path resolves against the current/run directory first, then falls back to the
          //options JSON file's directory when the model isn't found there.
          optionsOut.inpfile = CommonFunctions.ResolveInputPath(optionsOut.inpfile, _optionsFilePath);

          // Only require the file on disk when we don't already have the model text in memory.
          if (string.IsNullOrEmpty(_modelJsonStr) && !File.Exists(optionsOut.inpfile))
          {
            return "Invalid input EMRALD file path, please fix.";
          }
        }
      }
      catch
      {
        return "Invalid input file path, please fix.";
      }

      // Save the outfile_path string based on the "resout" json input
      try
      {
        if (optionsOut.resout != "")
        {
          //see if it is a relative path.
          if (!Path.IsPathRooted(optionsOut.resout))
          {
            optionsOut.resout = CommonFunctions.NormalizeGetFullPath(Path.Combine(System.IO.Directory.GetCurrentDirectory(), optionsOut.resout));
          }

          string resoutDir = Path.GetDirectoryName(optionsOut.resout);
          if (!string.IsNullOrEmpty(resoutDir) && !Directory.Exists(resoutDir))
          {
            Directory.CreateDirectory(resoutDir);
          }
        }
      }
      catch
      {
        return "Invalid results output file path, please fix.";
      }

      try
      {
        if (optionsOut.jsonRes != "")
        {

          //see if it is a relative path.
          if (!Path.IsPathRooted(optionsOut.jsonRes))
          {
            optionsOut.jsonRes = CommonFunctions.NormalizeGetFullPath(Path.Combine(System.IO.Directory.GetCurrentDirectory(), optionsOut.jsonRes));
          }

          string jsonResDir = Path.GetDirectoryName(optionsOut.jsonRes);
          if (!string.IsNullOrEmpty(jsonResDir) && !Directory.Exists(jsonResDir))
          {
            Directory.CreateDirectory(jsonResDir);
          }
        }
      }
      catch
      {
        return "Invalid json pat results file path, please fix.";
      }

      if (optionsOut.variables == null)
      {
        optionsOut.variables = new List<string>();
      }

      //debug info      
      switch (optionsOut.debug.ToUpper())
      {
        case "BASIC":
          break;
        case "DETAILED":
          break;
        case "OFF":
          break;
        default:
          return "Invalid debug options, must be one of the following: \"basic\", \"detailed\", \"off\".";
      }

      if ((optionsOut.debugStartIdx == null) || (optionsOut.debugStartIdx < 1))
      {
        optionsOut.debugStartIdx = 1;
      }

      if (optionsOut.debugStartIdx > (optionsOut.runct))
      {
        return "debugStartIdx must be less than the # of runs";
      }

      if ((optionsOut.debugEndIdx == null) || (optionsOut.debugEndIdx > (optionsOut.runct)))
      {
        optionsOut.debugEndIdx = optionsOut.runct;
      }

      if ((optionsOut.debug.ToUpper() != "OFF") && (optionsOut.debugEndIdx < optionsOut.debugStartIdx))
      {
        return "debugEndIdx must be greater than debugStartIdx";
      }

      if ((optionsOut.couplingInfo != null) &&
          (optionsOut.couplingInfo.couplingType == CouplingType.WebSocket) &&
          (optionsOut.couplingInfo.couplingURL == null))
      {
        return "If using WebSocket coupling, a couplingURL must be provided.";
      }

      

      if (optionsOut.couplingInfo != null)
      {
        CouplingWebSocket.WebSocketClient.LogMessages = optionsOut.couplingInfo.logCouplingMsgs;

        switch (optionsOut.couplingInfo.couplingType)
        {
          case CouplingType.WebSocket:
            _msgCoupler = new WebApiCoupling(optionsOut.couplingInfo.couplingURL);
            break;
          case CouplingType.XMPP:
            _msgCoupler = new EMRALDMsgServer(optionsOut.couplingInfo.couplingPassword);
            break;
          default:
            throw new Exception("Coupling Type not implemeted");
        }
      }

      return "";
    }


    // Check that names in options.variables and options.initVars exist in the loaded model.
    // Returns an empty string when everything checks out, or a multi-line message describing issues.
    public string CheckOptionsVariablesAgainstModel()
    {
      if (_model == null || options == null)
        return "";

      var missingMonitor = new List<string>();
      var notMonitorable = new List<string>();
      var missingInit = new List<string>();

      if (options.variables != null)
      {
        foreach (var name in options.variables)
        {
          var v = _model.allVariables.FindByName(name, false);
          if (v == null)
            missingMonitor.Add(name);
          else if (!v.canMonitorSim)
            notMonitorable.Add(name);
        }
      }

      if (options.initVars != null)
      {
        foreach (var iv in options.initVars)
        {
          if (_model.allVariables.FindByName(iv.varName, false) == null)
            missingInit.Add(iv.varName);
        }
      }

      if (missingMonitor.Count == 0 && notMonitorable.Count == 0 && missingInit.Count == 0)
        return "";

      var sb = new StringBuilder();
      sb.AppendLine("Options JSON variable check found issues:");
      if (missingMonitor.Count > 0)
        sb.AppendLine("  'variables' not found in model: " + string.Join(", ", missingMonitor));
      if (notMonitorable.Count > 0)
        sb.AppendLine("  'variables' exist but are not monitorable: " + string.Join(", ", notMonitorable));
      if (missingInit.Count > 0)
        sb.AppendLine("  'initVars' not found in model: " + string.Join(", ", missingInit));

      return sb.ToString().TrimEnd();
    }

    private bool ValidateModel()
    {
      // Attempt to deserialize the json string
      try
      {
        // Create a new EmraldModel object called sim
        _model = new EmraldModel();
        // Deserialize the json string into sim
        _model.DeserializeJSON(_modelJsonStr, CommonFunctions.NormalizeGetDirectoryName(options.inpfile), Path.GetFileNameWithoutExtension(options.inpfile));
      }
      // If there is an error in deserialization, create an error message
      catch (Exception error)
      {
        _error = "Failed to Deserialize EMRALD JSON model :" + options.inpfile;
        _error += error.Message;
        if (error.InnerException != null && error.InnerException.Message != "")
        {
          _error += " - " + error.InnerException.Message;
        }
        return false;
      }
      return true;
    }
  }
}
