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
using Matrix.Xmpp.PubSub;
using Testing;
using Matrix.Xmpp.XData;
//using System.Windows.Forms;

namespace SysAndRegressionTesting 
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  //construct each of the types of model objects from JSON and then get the JSON back and compare.
  public class SimEngineTests : TestingBaseClass
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
    [Description("General test to make sure system defined variables (RunIdx & CurTime) are working correctly.")]
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

    

   

    

    


    //todo [Fact]
    //Test the JSON variable 
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
      CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

   

    


    

  }

    
  }