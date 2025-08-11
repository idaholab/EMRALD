using Newtonsoft.Json.Linq;
using SimulationEngine;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Testing;

namespace SysAndRegressionTesting
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  public class VariableTests : TestingBaseClass
  {
    #region Validation Cases Setup Code
    protected override string CompareFilesDir()
    {
      return MainTestDir() + "CompareFiles" + Path.DirectorySeparatorChar;
    }

    protected override string TestFolder()
    {
      return "EMRALDTests" + Path.DirectorySeparatorChar;
    }

    protected override string ModelFolder()
    {
      return "Models" + Path.DirectorySeparatorChar;
    }
    #endregion
    
    [Fact]
    [Description("Test that a failure rate event using a variable correctly adds the event if it is resampled and inside the mission time")]

    public void VarTimeCngTest()
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
    [Description("Make sure the accrual variable stats are correct")]

    public void StatVarTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".json";
      options.runct = 100;
      //options.variables = new List<string>() { "SumCurTime", "Accrual_Save" };

      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    [Description("Make sure the accrual variable stats are correct using multi threaded")]
    public void StatVarTestMulti()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".emrald";
      options.runct = 100;
      options.threads = 2;
      //options.variables = new List<string>() { "SumCurTime", "Accrual_Save" };

      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    [Description("Simple accrual variable test with two accrual variables")]
    public void VarAccruTest()
    {
      //Make sure accru variable is working 

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, false);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".json";
      options.runct = 1;
      options.runtime = "0.01:00:00";
      options.variables = new List<string>() { "State1", "state2" };
      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    [Description("Test XML document Link variable to make sure it is reading an writing correctly")]
    public void XMLDocLinkTest()
    {
      //FYI - model must have the XML document using relative path to ..\..\..\VandV_Testing\TestingFiles\Other\
      //Save the XML document in that folder
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, false);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".json";
      options.runct = 1;
      options.runtime = "0.01:00:00";
      //todo set variables to watch initial doc link var value and then after it is set.
      //options.variables = new List<string>() { "State1", "state2" };
      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    

    [Fact]
    [Description("Test JSON document Link variable to make sure it is reading an writing correctly")]
    public void RegExDocLinkTest()
    {
      //FYI - model must have the Text document for the RegEx using relative path to ..\..\..\VandV_Testing\TestingFiles\Other\
      //Save the text document in that folder

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, false);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".json";
      options.runct = 1;
      options.runtime = "0.01:00:00";
      //todo set variables to watch initial RegEx link var value and then after it is set.
      //options.variables = new List<string>() { "State1", "state2" };
      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact]
    [Description("Test the ability to assign initial variable values from the options file")]
    public void SimRunVarInitTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, false);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".EMRALD";
      options.runct = 1;
      options.runtime = "0.01:00:00";
      options.initVars.Add(new VarInitValue { varName = "Int_TestV", value = "2" });

      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact]
    [Description("Tests pathing in JSON document Link variable during multithreading")]
    public void MultiThreadDocVar()
    {
      //FYI - model must have the Text document for the RegEx using relative path to ..\..\..\VandV_Testing\TestingFiles\Other\
      //Save the text document in that folder

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, false);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".emrald";
      options.runct = 10;
      options.threads = 2;
      options.variables = new List<string>() { "DocVar" };
      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
  }
}
