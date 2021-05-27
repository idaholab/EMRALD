// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using NLog;
using SimulationDAL;
using System.Threading;

namespace SimulationEngine
{
  public class Options
  {
    // Total number of runs
    public int runct { get; set; } = 100;
    // Input file path
    public string inpfile { get; set; } = null;
    // Results output file path
    public string resout { get; set; } = null;
    // Result paths JSON output file path
    public string jsonRes { get; set; } = null;
    //variables to output in the results
    public List<string> variables { get; set; } = null;
    // Path output file path
    public string pathout { get; set; } = null;
    // Maximum simulation time
    public string runtime { get; set; } = "365.00:00:00";
    // Seed for random number generation
    public int seed { get; set; } = 0;
    // debug level [basic, detailed, off]
    public string debug { get; set; } = "off";
    // start index for debug if null then from beginning
    public int? debugStartIdx { get; set; } = null;
    // start index for debug if null then to end
    public int? debugEndIdx { get; set; } = null;
    
  }

  public class JSONRun
  {
    private string _optsJsonStr = "";
    private string _modelJsonStr = "";
    TProgressCallBack _progressCallBack = null;
    private string _error = "";
    private Options _options;

    // Create attributes for objects
    private ProcessSimBatch _simRuns = null;
    private EmraldModel _model = null;
    // Create attributes for options (things formerly input on the command line)
    //private string run_count;
    //private TimeSpan maxTime;
    //private string inpfile_path = "";
    //private string outfile_path = "";
    //private string pathout_path = "";
    //private int nseed = 0;
    // Create other attributes
    public bool cancel = false;
    public double percentDone = 0;

    public string error { get { return _error; } }

    public JSONRun(string optionsJsonStr, string modelJsonStr = "", TProgressCallBack progressCallBack = null)
    {
      _optsJsonStr = optionsJsonStr;
      _modelJsonStr = modelJsonStr;
      _progressCallBack = progressCallBack;
    }

    public string RunSim()
    {
      percentDone = 0;

      //Load JSON options 
      if (!LoadJson(_optsJsonStr))
        return "Error Loading JSON run options - " + error;

      if (_modelJsonStr == "")
      {
        if (_options.inpfile == null)
        {
          _error = "No valid model path";
          return _error;
        }

        _modelJsonStr = File.ReadAllText(_options.inpfile);
      }

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
      };
           

      if (!ValidateModel())
      {
        return _error;
      }

      //setup debug options
      switch(_options.debug.ToUpper())
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

      ConfigData.debugRunStart = _options.debugStartIdx;
      ConfigData.debugRunEnd = _options.debugEndIdx;
      ConfigData.seed = _options.seed;


      //TODO put this back with thread.
      //// Create a new ProcessSimBatch object
      //// This is where the maxTime and outfile_path attributes are used
      //_simRuns = new ProcessSimBatch(_model, TimeSpan.Parse(_options.runtime), _options.resout, _options.jsonRes);
      //if(_options.variables != null)
      //  _simRuns.logVarVals.AddRange(_options.variables);
      //// Submit the runs
      //// This is where the runct and pathout attributes are used
      //if (!_simRuns.RunBatch(_options.runct, ref cancel, true, _options.pathout))
      //{
      //  _error = _simRuns.error;
      bool done = false;
      _simRuns = new ProcessSimBatch(_model, TimeSpan.Parse(_options.runtime), _options.resout, _options.jsonRes);
      _simRuns.SetupBatch(_options.runct, true, _options.pathout);
      ThreadStart tStarter = new ThreadStart(_simRuns.RunBatch);
      //run this when the thread is done.
      tStarter += () =>
      {
        _simRuns.GetVarValues(_simRuns.logVarVals, true);
        _error = _simRuns.error;
        done = true;
      };

      Thread simThread = new Thread(tStarter);
      simThread.Start(); 
      //}

      //must wait until done to return
      while(!done)
      {
        System.Threading.Thread.Sleep(100);
      }
      return error;
    }

    private bool LoadJson(string optionsJsonStr)
    {
      // Create an Options object named options1 by deserializing the json string options_json, this depends on the Newtonsoft.Json package
      try
      {
        _options = JsonConvert.DeserializeObject<Options>(optionsJsonStr);
      }
      catch
      {
        _error = "Invalid JSON run options, please fix.";
        return false;
      }


      // Initialize a new TimeSpan object named maxTime, with a value based on the "runtime" json input
      try
      {
        var time = TimeSpan.Parse(_options.runtime);
      }
      catch
      {
        _error = "Invalid Max Simulation Time, please fix.";
        return false;
      }
      // Save the inpfile_path string based on the "inpfile" json input
      try
      {
        if (_options.inpfile != null) //can be null then must be passed into the run command
        {
          //see if it is a relative path.
          if (!Path.IsPathRooted(_options.inpfile))
          {
            _options.inpfile = System.IO.Directory.GetCurrentDirectory() + _options.inpfile;
          }

          if (!File.Exists(_options.inpfile))
          {
            _error = "Invalid input file path, please fix.";
          }
        }
      }
      catch
      {
        _error = "Invalid input file path, please fix.";
        return false;
      }

      // Save the outfile_path string based on the "resout" json input
      try
      {
        if (_options.resout == null)
        {
          _options.resout = "";
        }

        if (_options.resout != "")
        {
          //see if it is a relative path.
          if (!Path.IsPathRooted(_options.resout))
          {
            _options.resout = System.IO.Directory.GetCurrentDirectory() + _options.resout;
          }

          if (!Directory.Exists(Path.GetDirectoryName(_options.resout)))
          {
            _error = "Invalid output file path, directory does not exist.";
            return false;
          }
        }
      }
      catch
      {
        _error = "Invalid results output file path, please fix.";
        return false;
      }

      try
      {
        if (_options.jsonRes == null)
        {
          _options.jsonRes = "";
        }

        if (_options.jsonRes != "")
        {

          //see if it is a relative path.
          if (!Path.IsPathRooted(_options.jsonRes))
          {
            _options.jsonRes = System.IO.Directory.GetCurrentDirectory() + _options.jsonRes;
          }

          if (!Directory.Exists(Path.GetDirectoryName(_options.jsonRes)))
          {
            _error = "Invalid json path results file path, directory does not exist.";
            return false;
          }
        }
      }
      catch
      {
        _error = "Invalid json pat results file path, please fix.";
        return false;
      }

      if (_options.variables == null)
      {
        _options.variables = new List<string>();
      }
      // Save the pathout_path string based on the "pathout" json input
      try
      {
        if (_options.pathout == null)
        {
          _options.pathout = "";
        }

        if (_options.pathout != "")
        {
          //see if it is a relative path.
          if (!Path.IsPathRooted(_options.pathout))
          {
            _options.pathout = System.IO.Directory.GetCurrentDirectory() + _options.pathout;
          }

          if (!Directory.Exists(Path.GetDirectoryName(_options.pathout)))
          {
            _error = "Invalid paths output file path, directory does not exist.";
            return false;
          }
        }
      }
      catch
      {
        _error = "Invalid path output file path, please fix.";
        return false;
      }

      //debug info      
      switch (_options.debug.ToUpper())
      {
        case "BASIC":
          break;
        case "DETAILED":
          break;
        case "OFF":
          break;
        default:
          _error = "Invalid debug options, must be one of the following: \"basic\", \"detailed\", \"off\".";
          return false;
      }

      if((_options.debugStartIdx == null) || (_options.debugStartIdx < 1) )
      {
        _options.debugStartIdx = 1;
      }

      if (_options.debugStartIdx > (_options.runct - 1))
      {
        _error = "debugStartIdx must be less than the # of runs";
        return false;
      }

      if ((_options.debugEndIdx == null) || (_options.debugEndIdx > (_options.runct)))
      {
        _options.debugEndIdx = _options.runct;
      }

      if (_options.debugEndIdx < _options.debugStartIdx)
      {
        _error = "debugEndIdx must be greater than debugStartIdx";
        return false;
      }

      return true;
    }

   
    private bool ValidateModel()
    {
      // Attempt to deserialize the json string
      try
      {
        // Create a new EmraldModel object called sim
        _model = new EmraldModel();
        // Deserialize the json string into sim
        _model.DeserializeJSON(_modelJsonStr, Path.GetDirectoryName(_options.inpfile));
      }
      // If there is an error in deserialization, create an error message
      catch (Exception error)
      {
        _error = "Failed to load model :";
        _error += error.Message;
        if (error.InnerException != null && error.InnerException.Message != "")
        {
          _error += " - " + error.InnerException.Message;
        }
        return false;
      }
      return true;
    }

    private void Progress(TimeSpan runTime, int runCnt, bool finalValOnly)
    {
      this.percentDone = runCnt / _options.runct;
      if (_progressCallBack != null)
        _progressCallBack(runTime, runCnt, finalValOnly);
    }
  }
}
