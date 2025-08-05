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
  public class ActionTests : TestingBaseClass
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
    [Description("General test of several actions single option transition action, Change Var value action, and run application action.")]
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
    [Description("Test transition acions that have multiple to states and a variable for one of the %")]
    public void TransitionPercentTest()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      optionsJ["runct"] = 5;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact]
    [Description("Test changing of a variable value using the math library MathNet.Numerics")]
    public void ChangeVarTest()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

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
    [Description("Test changing of a variable value using the math library MathNet.Numerics and Multi threading")]
    public void ChangeVarTestMulti()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 100;
      optionsJ["threads"] = 2;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact(Skip = "DLL Value not fully implmented yet, will allow users to update a variable through a DLL call")]
    [Description("Test the use of executing dll functions with ")]
    public void DllValueTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";

      optionsJ["runct"] = 1;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    // THIS TEST CURRENTLY FAILS
    // Expected : The global variable "Var" to be equal to the run id
    // Current Result: An error, it cannot find the string in the path to MultithreadWrite.txt
    [Fact]
    [Description("Test pathing in the change variable action when running in multi thread")]
    public void MultiThreadVarChange()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 100;
      optionsJ["threads"] = 2;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
    // THIS TEST CURRENTLY FAILS

    [Fact]
    [Description("Test pathing in the change variable action when running in multi thread")]
    public void MultiThreadExeTest()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 100;
      optionsJ["threads"] = 2;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
  }
}
