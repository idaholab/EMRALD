// Copyright 2026 Battelle Energy Alliance
// System and regression tests for EMRALD actions including state transitions, variable changes, and external application calls.
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using SimulationEngine;
using Testing;
using WebSocketTestServer;
using Xunit;

namespace SysAndRegressionTesting
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  public class ActionTests : TestingBaseClass
  {
    #region Validation Cases Setup Code
    protected override string CompareFilesDir()
    {
      return MainTestDir() + "CompareFiles" + Path.AltDirectorySeparatorChar;
    }

    protected override string TestFolder()
    {
      return "EMRALDTests" + Path.AltDirectorySeparatorChar;
    }

    protected override string ModelFolder()
    {
      return "Models" + Path.AltDirectorySeparatorChar;
    }
    #endregion


    [Fact]
    [Description("General test of several actions single option transition action, Change Var value action, and run application action.")]
    public async Task ActionsTest()
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
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    [Description("Test transition acions that have multiple to states and a variable for one of the % Starts with 50% for S4 then 25% of remaining to 55")]
    public async Task TransitionPercentTest()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 100;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
     // CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact]
    [Description("Test changing of a variable value using the math library MathNet.Numerics")]
    public async Task ChangeVarTest()
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
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    [Fact]
    [Description("Test changing of a variable value using the math library MathNet.Numerics and Multi threading")]
    public async Task ChangeVarTestMulti()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 100;
      optionsJ["seed"] = 0;
      optionsJ["threads"] = 2;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact(Skip = "DLL Value not fully implmented yet, will allow users to update a variable through a DLL call")]
    [Description("Test the use of executing dll functions with ")]
    public async Task DllValueTest()
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
      Assert.True(await TestRunSim(testRun));

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
    public async Task MultiThreadVarChange()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();
      //Change the default settings as needed for the test seed default set to 0 for testing.
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".emrald";
      options.runct = 10;
      options.threads = 2;
      options.variables = new List<string>() { "Var" };

      JSONRun testRun = new JSONRun(options);
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
    

    [Fact]
    [Description("Test pathing in the change variable action when running in multi thread")]
    public async Task MultiThreadExeTest()
    {

      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName, true);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 20;
      optionsJ["threads"] = 2;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      //Compare(dir, testName, optionsJ);
    }

    [Fact]
    [Description("Test that runApplication acion runs correctuly and uses JSON document variables for input and output ")]
    public async Task JsonVarExeTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";

      optionsJ["runct"] = 10;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(await TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    [Fact]
    [Description("Test a External Simulation linking with the EMRALD model using WebSocketServer")]
    public async Task CoupledSimWebSocketTest()
    {
      string testName = GetCurrentMethodName(); // function name must match the model name

      // Setup directory for unit test 
      string dir = SetupTestDir(testName);
      // initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      SimulationEngine.Options_cur options = optionsJ.ToObject<SimulationEngine.Options_cur>();

      // start the connection server
      using var host = new WebSocketServerHost();
      await host.StartAsync();                // start the server
      await Task.Delay(3000);                 // small buffer for startup (can trim as needed)

      // Change the default settings as needed for the test
      options.inpfile = MainTestDir() + ModelFolder() + testName + ".emrald";
      options.runct = 5;
      options.seed = 1;
      options.variables = new List<string> { "TridiumVal" };
      options.couplingInfo = new CouplingData
      {
        couplingType = CouplingType.WebSocket,
        couplingURL = host.WsUri.ToString(), // e.g., "ws://localhost:52743/"
        timeout = 10,
        logCouplingMsgs = false
      };
      WebSocketTestServer.Program.LogMessages = false;
      options.opsVer = 1.02;

      var testRun = new JSONRun(options);
      Assert.True(await TestRunSim(testRun));

      // Uncomment to update the validation files after they’re verified
      //CopyToValidated(dir, testName, optionsJ);

      // compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
  }
}
