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

  
  //public class Options_v1
  //{
  //  // Total number of runs
  //  public int runct { get; set; } = 100;
  //  // Input file path
  //  public string inpfile { get; set; } = "";
  //  // Results output file path
  //  public string resout { get; set; } = "BasicResults.txt";
  //  // Result paths JSON output file path
  //  public string jsonRes { get; set; } = "";
  //  //variables to output in the results
  //  public List<string> variables { get; set; } = null;
  //  // Path output file path
  //  public string pathout { get; set; } = null;
  //  // Maximum simulation time
  //  public string runtime { get; set; } = "365.00:00:00";
  //  // Seed for random number generation
  //  public int seed { get; set; } = 0;
  //  // debug level [basic, detailed, off]
  //  public string debug { get; set; } = "off";
  //  // start index for debug if null then from beginning
  //  public int? debugStartIdx { get; set; } = null;
  //  // start index for debug if null then to end
  //  public int? debugEndIdx { get; set; } = null;
  //  // external application XMPP connection
  //  public int pathResultsInterval { get; set; } = -1;
  //  public string xmppPassword { get; set; } = "secret";
  //  public List<List<string>> xmppLinks = new List<List<string>>();
  //}

  public class Options_cur
  {
    //Example JSON for passing in the run options 
    public static string CmdJSON_OptionsExample = "{\n" +
    "  \"opsVer\": 1.01, //version of this options file\n" +
    "  \"runct\": 100, // Total number of runs\n" +
    "  \"inpfile\": \"\", // Input model path\n" +
    "  \"resout\": \"BasicResults.txt\", // Results output file path\n" +
    "  \"jsonRes\": \"c:\\\\temp\\\\PathResults.txt\", // Result paths JSON output file path\n" +
    "  \"variables\": [ // Variables to output in the results\n" +
    "    \"var1\",\n" +
    "    \"var2\"\n" +
    "  ],\n" +
    "  \"initVars\": [ //initialize these variables with new values (if they have the property to reset on every run, it will get this value on each run otherwise behavior is the same)\n" +
    "    {\n" +
    "      \"varName\": \"var1\", //name of the variable\n" +
    "      \"value\": \"5\" //value for the variable, use a string for all the types.\n" +
    "    }\n" +
    "  ],\n" +
    "  \"runtime\": \"365.00:00:00\", // Maximum simulation time\n" +
    "  \"seed\": 0, // Seed for random number generation\n" +
    "  \"debug\": \"off\", // Debug level [basic, detailed, off]\n" +
    "  \"debugStartIdx\": null, // Start index for debug if null then from beginning\n" +
    "  \"debugEndIdx\": null, // End index for debug if null then to end\n" +
    "  \"pathResultsInterval\": -1, // External application XMPP connection path results interval\n" +
    "  \"xmppPassword\": \"secret\", // XMPP password for external application connection\n" +
    "  \"xmppLinks\": [] // List of XMPP links\n" +
    "}";

    //version of the options json
    public double opsVer { get; set; } = 1.01;
    
    // Total number of runs
    public int runct { get; set; } = 100;
    // Input file path
    public string inpfile { get; set; } = "";
    // Results output file path
    public string resout { get; set; } = "BasicResults.txt";
    // Result paths JSON output file path
    public string jsonRes { get; set; } = "";
    //variables to output in the results
    public List<string> variables { get; set; } = null;
    // //initialize these variables with new values (if they have the property to reset on every run, it will get this value on each run othrwise behavior is the same)
    public List<VarInitValue> initVars { get; set; } = new List<VarInitValue>();
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
    // external application XMPP connection
    public int pathResultsInterval { get; set; } = -1;
    public string xmppPassword { get; set; } = "secret";
    public List<List<string>> xmppLinks = new List<List<string>>();
    public int? threads { get; set; } = null; //null is default no threading. Even 1 will use a tread and the temp folders so that you can run multiple instances using the same model, by just changing the name.
  }

  public class VarInitValue
  {
    public string varName { get; set; }
    public string value { get; set; }
  }

  public class JSONRun
  {
    private string _optsJsonStr = "";
    private string _modelJsonStr = "";
    //TProgressCallBack _progressCallBack = null;
    private string _error = "";
    public Options_cur options = new Options_cur();
    private bool _done = false;

    // Create attributes for objects
    private List<ProcessSimBatch> _simRuns = new List<ProcessSimBatch>();
    private EmraldModel _model = null;
    // Create attributes for options (things formerly input on the command line)
    //private string run_count;
    //private TimeSpan maxTime;
    //private string inpfile_path = "";
    //private string outfile_path = "";
    //private int nseed = 0;
    // Create other attributes
    public bool cancel = false;
    public double percentDone = 0;

    public string error { get { return _error; } }

    public JSONRun(string optionsJsonStr, string modelJsonStr = "", TProgressCallBack progressCallBack = null)
    {
      _optsJsonStr = optionsJsonStr;
      _modelJsonStr = modelJsonStr;
      //_progressCallBack = progressCallBack;
    }

    public JSONRun(Options_cur ops, string modelJsonStr = "", TProgressCallBack progressCallBack = null)
    {
      this.options = ops;
      _optsJsonStr = JsonConvert.SerializeObject(ops);
      _modelJsonStr = modelJsonStr;
      //_progressCallBack = progressCallBack;
    }

    public string RunSim()
    {
      percentDone = 0;

      //Load JSON options 
      if (_optsJsonStr != "")
        _error = LoadJson(_optsJsonStr, ref options);
        if (_error != "")
          return "Error Loading JSON run options - " + error;

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
        _modelJsonStr = File.ReadAllText(options.inpfile);
      }
      // If it is not acceptable, fill in the error message
      catch
      {
        _error = "Invalid model file - " + options.inpfile;
        return _error;
      };
      

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
      switch(options.debug.ToUpper())
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


      // Create a new ProcessSimBatch object
      // This is where the maxTime and outfile_path attributes are used
      List<Thread> threads = new List<Thread>();
      _simRuns.Clear();
      int runsDiv = options.runct / (int)ConfigData.threads;
      bool resDone = false; //results done
      int threadCnt = ConfigData.threads == null ? 1 : (int)ConfigData.threads;

      for (int i = 0; i < threadCnt; i++) //if null just run once.
      {
        _simRuns.Add(new ProcessSimBatch(_model, TimeSpan.Parse(options.runtime), options.resout, options.jsonRes, options.pathResultsInterval, ConfigData.threads == null ? null : i));
        if (i == 0) //add extra runs on the first one
          _simRuns[i].SetupBatch(runsDiv + (options.runct % threadCnt), true);
        else
          _simRuns[i].SetupBatch(runsDiv, true);

        foreach(var v in _model.allVariables.Values)
        {
          if(v.monitorInSim)
            _simRuns[i].logVarVals.Add(v.name);
        }
        foreach (var varItem in this.options.variables)
        {
          _simRuns[i].logVarVals.Add(varItem.ToString());
        }

        foreach (var varItem in this.options.initVars)
        {
          _simRuns[i].initVarVals.Add(varItem.varName, varItem.value);
        }

        ThreadStart tStarter = new ThreadStart(_simRuns[i].RunBatch);
        //run this when the thread is done.
        int locIdx = i;
        tStarter += () =>
        {
          try
          {
            if(_simRuns[locIdx].error != "")
              _error += _simRuns[locIdx].error + Environment.NewLine;
          }
          catch (Exception ex)
          {
            // Log the exception
            Console.WriteLine($"Exception in thread completion: {ex.Message}");
          }
        };

        Thread simThread = new Thread(tStarter);
        simThread.Start();
        threads.Add(simThread);
      }

      Task.Run(() =>
      {
        // Wait for all threads to complete
        foreach (var thread in threads)
        {
          thread.Join();
        }

        //compile results if needed
        for (int i = 1; i < _simRuns.Count; i++)
        {
          _simRuns[0].AddOtherBatchResults(_simRuns[i]);
        }
        _simRuns[0].WriteFinalResults(true, threadCnt);
        resDone = true;
      });

      //must wait until done to return
      
      while (!resDone)
      {
        System.Threading.Thread.Sleep(100);
      }
    
      return error;
    }

    public static string LoadJson(string optionsJsonStr, ref Options_cur optionsOut)
    {
      // Create an Options object named options1 by deserializing the json string options_json, this depends on the Newtonsoft.Json package
      try
      {
        optionsOut = JsonConvert.DeserializeObject<Options_cur>(optionsJsonStr);
      }
      catch
      {
        return "Invalid JSON run options, please fix.";
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
        if (optionsOut.inpfile != null) //can be null then must be passed into the run command
        {
          //see if it is a relative path.
          if (!Path.IsPathRooted(optionsOut.inpfile))
          {
            optionsOut.inpfile = System.IO.Directory.GetCurrentDirectory() + optionsOut.inpfile;
          }

          if (!File.Exists(optionsOut.inpfile))
          {
            return "Invalid input file path, please fix.";
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
            optionsOut.resout = System.IO.Directory.GetCurrentDirectory() + optionsOut.resout;
          }

          if (!Directory.Exists(Path.GetDirectoryName(optionsOut.resout)))
          {
            return "Invalid output file path, directory does not exist.";
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
            optionsOut.jsonRes = System.IO.Directory.GetCurrentDirectory() + optionsOut.jsonRes;
          }

          if (!Directory.Exists(Path.GetDirectoryName(optionsOut.jsonRes)))
          {
            return "Invalid json path results file path, directory does not exist.";
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

      if((optionsOut.debugStartIdx == null) || (optionsOut.debugStartIdx < 1) )
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

      if (optionsOut.debugEndIdx < optionsOut.debugStartIdx)
      {
        return "debugEndIdx must be greater than debugStartIdx";
      }

      return "";
    }

   
    private bool ValidateModel()
    {
      // Attempt to deserialize the json string
      try
      {
        // Create a new EmraldModel object called sim
        _model = new EmraldModel();
        // Deserialize the json string into sim
        _model.DeserializeJSON(_modelJsonStr, Path.GetDirectoryName(options.inpfile), Path.GetFileNameWithoutExtension(options.inpfile));
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

    //private void Progress(TimeSpan runTime, int runCnt, bool finalValOnly)
    //{
    //  this.percentDone = runCnt / options.runct;
    //  if (_progressCallBack != null)
    //    _progressCallBack(runTime, runCnt, finalValOnly);//, 0); //no display thread for JSON runs.
    //}
  }
}
