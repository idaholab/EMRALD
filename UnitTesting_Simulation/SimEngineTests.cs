// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimulationDAL;
using Xunit;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SimulationEngine;
using MathNet.Numerics;
//using Ewk.Math.Numerics;
using System.Reflection;
using System.Diagnostics;
using NLog;
using NLog.Config;
//using System.Windows.Forms;

namespace UnitTesting_Simulation
{

  //construct each of the types of model objects from JSON and then get the JSON back and compare.
  public class SimEngineTests
  {
    private string RootDir()
    {
      return Directory.GetParent(System.IO.Directory.GetCurrentDirectory()).Parent.Parent.FullName;
    }
    private string MainTestDir()
    {
      return RootDir() + "\\TestingFiles\\";
    }

    private string CompareFilesDir()
    {
      return MainTestDir() + "CompareFiles\\";
    }


    const string testFolder = "EMRALDTests\\";
    const string modelFolder = "Models\\";
    const string pathsName = "_paths.txt";
    const string resName = "_res.txt";
    const string jsonResultsName = "_jsonResults.json";
    const string debugLogger = "uTestLog";

    private string SetupTestDir(string testName)
    {
      //Setup directory for unit test 
      string dir = MainTestDir() + testFolder + testName + "\\";
      if (Directory.Exists(dir))
      {
        var d = new DirectoryInfo(dir);
        d.Delete(true);
      }
      Directory.CreateDirectory(dir);

      //setup the test log file
      var rootDir = RootDir();

      //var s = System.IO.GGetCurrentDirectory()
      LogManager.Configuration = new XmlLoggingConfiguration(rootDir + "\\NLog.config");
      var config = LogManager.Configuration;
      var logfile = new NLog.Targets.FileTarget(debugLogger)
      {
        FileName = MainTestDir() + testFolder + debugLogger + ".txt",
        Layout = "${message}",
        //DeleteOldFileOnStartup = true,
        KeepFileOpen = true,
        OpenFileCacheTimeout = 120,
        ConcurrentWrites = true,
        Name = debugLogger
      };
      config.AddRule(NLog.LogLevel.Debug, NLog.LogLevel.Fatal, logfile, debugLogger);
      NLog.LogManager.Configuration = config;

      return dir;
    }
    public string GetCurrentMethodName()
    {
      var st = new StackTrace();
      var sf = st.GetFrame(1);

      return sf.GetMethod().Name;
    }

    private JObject SetupJSON(string loc, string testName, bool pathResults = false, bool jsonResults = false)
    {
      Options ops = new Options();
      ops.resout = loc + testName + resName;
      if (pathResults)
        ops.pathout = loc + testName + pathsName;
      if (jsonResults)
        ops.jsonRes = loc + testName + jsonResultsName;

      return JObject.FromObject(ops);
    }

    private void Compare(string loc, string testName, JObject jsonSettings)
    {
      var logger = NLog.LogManager.GetLogger(debugLogger);

      void SingleComp(string newPath, string origPath, int[] ignoreLines = null)
      {
        List<string> newFile = File.ReadLines(newPath).ToList();
        if (!File.Exists(origPath))
        {
          logger.Debug("Missing validation file - " + origPath);
          Assert.True(false);
        }
        List<string> origFile = File.ReadAllLines(origPath).ToList();
        //remove invalid comparison lines
        if (ignoreLines != null)
          foreach (var i in ignoreLines)
          {
            newFile.RemoveAt(i);
            origFile.RemoveAt(i);
          }

        List<string> inOrigNotInNew = origFile.Except(newFile).ToList();
        List<string> inNewNotInOrig = newFile.Except(origFile).ToList();
        if ((inOrigNotInNew.Count > 0) || (inNewNotInOrig.Count > 0))
        {
          logger.Debug("Missing lines in tests results:");
          logger.Debug(String.Join(Environment.NewLine, inOrigNotInNew));
          logger.Debug("------");
          logger.Debug("Missing lines in tests results:");
          logger.Debug(String.Join(Environment.NewLine, inNewNotInOrig));
          Assert.True(false);
        }
      }

      //results file
      SingleComp(loc + testName + resName, CompareFilesDir() + testName + resName, new int[] { 1 });
      //Paths file
      if ((string)jsonSettings["pathout"] != null)
        SingleComp((string)jsonSettings["pathout"], CompareFilesDir() + testName + pathsName);
      //Json Results file
      if ((string)jsonSettings["jsonRes"] != null)
        SingleComp((string)jsonSettings["jsonRes"], CompareFilesDir() + testName + jsonResultsName);
    }

    private void CopyToValidated(string loc, string testName, JObject jsonSettings)
    {
      File.Copy((string)jsonSettings["resout"], CompareFilesDir() + testName + resName, true);

      if ((string)jsonSettings["pathout"] != null)
      {
        File.Copy((string)jsonSettings["pathout"], CompareFilesDir() + testName + pathsName, true);
      }

      if ((string)jsonSettings["jsonRes"] != null)
      {
        File.Copy((string)jsonSettings["jsonRes"], CompareFilesDir() + testName + jsonResultsName, true);
      }
    }

    private bool TestRunSim(JSONRun runParams)
    {
      var logger = NLog.LogManager.GetLogger(debugLogger);
      string res = runParams.RunSim();
      if (res != "")
      {
        var st = new StackTrace();
        string callFunc = st.GetFrame(1).GetMethod().Name;
        logger.Debug("[" + callFunc + "] " + res);
        return false;
      }

      return true;
    }

    [Fact]
    public void ActionsTest()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true, true); 
      
      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + modelFolder + testName + ".json";
      optionsJ["runct"] = 10;
      optionsJ["debug"] = "basic";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void Event_1TransitionInOutTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + modelFolder + testName + ".json";
      optionsJ["runct"] = 100;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void NormDistTestFINAL()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + modelFolder + testName + ".json";
      optionsJ["runct"] = 100000;
      optionsJ["debug"] = "basic";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void WeibDistTestFINAL()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + modelFolder + testName + ".json";
      optionsJ["runct"] = 100000;
      optionsJ["debug"] = "basic";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void ExpDistTestFINAL()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + modelFolder + testName + ".json";
      optionsJ["runct"] = 100000;
      optionsJ["debug"] = "basic";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    //Test the timer event using a variable
    public void TestTimerEvVar()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, false, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + modelFolder + testName + ".json";
      optionsJ["runct"] = 10;
      optionsJ["debug"] = "basic";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    //Test the JSON variable 
    public void JsonVarExeTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + modelFolder + testName + ".json";
      
      optionsJ["runct"] = 10;
      optionsJ["debug"] = "basic";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
    
    [Fact]
    //Test the failure rate event using a variable
    public void TestProbEvVar()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + modelFolder + testName + ".json";
      optionsJ["runct"] = 1000;
      optionsJ["debug"] = "basic";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
    
    
  }
}
