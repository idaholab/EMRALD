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
  public class DigramTests : TestingBaseClass
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
    [Description("Test to verify self loops in a diagram work properly.")]
    public void SelfLoopTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
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
    [Description("Test to verify paths to key states are comming out correct.")]
    public void KeyStatePathTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".json";
      options.runct = 100;
      //options.variables = new List<string>() { "Int_Cnt" };
      // TODO Compare JSON path results options.resout 
      //optionsJ["variables"] = JsonConvert.SerializeObject(args);
      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    [Description("Test to verify single state diagram boolean values are correct.")]
    public void SingleStateDiagramValueTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".json";
      options.runct = 1;
      //options.variables = new List<string>() { "Int_Cnt" };
      //optionsJ["variables"] = JsonConvert.SerializeObject(args);
      JSONRun testRun = new JSONRun(options);
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //TODO add other actiontests.
  }
}