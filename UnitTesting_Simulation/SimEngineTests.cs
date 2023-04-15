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
using JsonDiffPatchDotNet;
//using System.Windows.Forms;

namespace UnitTesting_Simulation
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  //construct each of the types of model objects from JSON and then get the JSON back and compare.
  public class SimEngineTests
  {
    private string RootDir()
    {
      return Directory.GetParent(System.IO.Directory.GetCurrentDirectory()).Parent.Parent.FullName;
    }
    private string MainTestDir()
    {
      return RootDir() + Path.DirectorySeparatorChar + "TestingFiles" + Path.DirectorySeparatorChar;
    }

    private string CompareFilesDir()
    {
      return MainTestDir() + "CompareFiles" + Path.DirectorySeparatorChar;
    }

    private string TestFolder()
    {
      return "EMRALDTests" + Path.DirectorySeparatorChar;
    }

    private string ModelFolder()
    {
      return "Models" + Path.DirectorySeparatorChar;
    }

    //const string TestFolder() = "EMRALDTests" + Path.DirectorySeparatorChar;
    //const string ModelFolder() = "Models" + Path.DirectorySeparatorChar;
    const string pathsName = "_paths.txt";
    const string resName = "_res.txt";
    const string jsonResultsName = "_jsonResults.json";
    const string debugLogger = "uTestLog";

    private string SetupTestDir(string testName)
    {
      //Setup directory for unit test 
      string dir = MainTestDir() + TestFolder() + testName + Path.DirectorySeparatorChar;
      if (Directory.Exists(dir))
      {
        var d = new DirectoryInfo(dir);
        d.Delete(true);
      }
      Directory.CreateDirectory(dir);

      //setup the test log file
      var rootDir = RootDir();

      //var s = System.IO.GGetCurrentDirectory()
      LogManager.Configuration = new XmlLoggingConfiguration(rootDir + Path.DirectorySeparatorChar + "NLog.config");
      var config = LogManager.Configuration;
      var logfile = new NLog.Targets.FileTarget(debugLogger)
      {
        FileName = MainTestDir() + TestFolder() + debugLogger + ".txt",
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

    private JObject SetupJSON(string loc, string testName, bool jsonResults = false)
    {
      SimulationEngine.Options ops = new SimulationEngine.Options();
      ops.resout = loc + testName + resName;
      //path results depricated, all info in json results
      //if (pathResults)
      //  ops.pathout = loc + testName + pathsName;
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
      
      //Json Results file
      if ((string)jsonSettings["jsonRes"] != null)
        if(File.Exists((string)jsonSettings["jsonRes"]))
          SingleComp((string)jsonSettings["jsonRes"], CompareFilesDir() + testName + jsonResultsName);
    }

    private void CopyToValidated(string loc, string testName, JObject jsonSettings)
    {
      File.Copy((string)jsonSettings["resout"], CompareFilesDir() + testName + resName, true);

      //if ((string)jsonSettings["pathout"] != null)
      //{
      //  File.Copy((string)jsonSettings["pathout"], CompareFilesDir() + testName + pathsName, true);
      //}

      if ((string)jsonSettings["jsonRes"] != null)
      {
        if (File.Exists((string)jsonSettings["jsonRes"]))
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
      JObject optionsJ = SetupJSON(dir, testName, true); 
      
      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 10;
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
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
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
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 100000;
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
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 100000;
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
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 100000;
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
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 10;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void FromStartTimerTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 1;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      CopyToValidated(dir, testName, optionsJ);

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
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      
      optionsJ["runct"] = 10;
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
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 1000;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    //Test the failure rate event using a variable
    public void TestLogicTreeVsStateChk()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 10000;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void DistEvent_Normal()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 100000;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void DistEvent_Normal_Vars()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 100000;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void DistEvent_LogNormal()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 100000;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void DistEvent_LogNormal_Vars()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 100000;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void DefaultVarsTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 10;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void VarTimeCngTest()
    {
      //make sure that a distribution using a variable correctly adds the event if it is resampled and inside the mission time

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 10;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void SelfLoopTest()
    {
      //make sure that a distribution using a variable correctly adds the event if it is resampled and inside the mission time

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      SimulationEngine.Options options = optionsJ.ToObject<SimulationEngine.Options>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".json";
      options.runct = 1;
      options.variables = new List<string>() { "Int_Cnt" };
      //optionsJ["variables"] = JsonConvert.SerializeObject(args);
      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    public void HRATestHunter1()
    {
      //simple model to test the HRA hunter model 

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      SimulationEngine.Options options = optionsJ.ToObject<SimulationEngine.Options>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".json";
      options.runct = 100;
      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    //[Fact]
    //public void DistEvent_Exponential()
    //{
    //  string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

    //  //Setup directory for unit test 
    //  string dir = SetupTestDir(testName);
    //  //initial options, and optional results to save/test
    //  JObject optionsJ = SetupJSON(dir, testName, true);

    //  //Change the default settings as needed for the test seed default set to 0 for testing.
    //  optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
    //  optionsJ["runct"] = 100000;
    //  JSONRun testRun = new JSONRun(optionsJ.ToString());
    //  Assert.True(TestRunSim(testRun));

    //  //Uncomment to update the validation files after they verified correct
    //  //CopyToValidated(dir, testName, optionsJ);

    //  //compare the test result and optionally the paths and json if assigned
    //  Compare(dir, testName, optionsJ);
    //}

    //[Fact]
    //public void DistEvent_Exponential_Vars()
    //{
    //  string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

    //  //Setup directory for unit test 
    //  string dir = SetupTestDir(testName);
    //  //initial options, and optional results to save/test
    //  JObject optionsJ = SetupJSON(dir, testName, true);

    //  //Change the default settings as needed for the test seed default set to 0 for testing.
    //  optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
    //  optionsJ["runct"] = 100000;
    //  JSONRun testRun = new JSONRun(optionsJ.ToString());
    //  Assert.True(TestRunSim(testRun));

    //  //Uncomment to update the validation files after they verified correct
    //  //CopyToValidated(dir, testName, optionsJ);

    //  //compare the test result and optionally the paths and json if assigned
    //  Compare(dir, testName, optionsJ);
    //}

  }
}