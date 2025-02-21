// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using System.IO;
using Newtonsoft.Json.Linq;
using SimulationEngine;
using System.Diagnostics;
using NLog;
using NLog.Config;
using Testing;

//////////////////////////////////////////
///See the readMe for adding 
////////////////////////////////////////////


namespace UserTesting
{
    [Collection("Serial")]
    public class UserValidationTests : TestingBaseClass
  {
    #region Validation Cases Setup Code
    protected override string CompareFilesDir()
    {
      return MainTestDir() + "UserVerifiedCompareFiles" + Path.DirectorySeparatorChar;
    }

    protected override string TestFolder()
    {
      return "UserValidationRuns" + Path.DirectorySeparatorChar;
    }

    protected override string ModelFolder()
    {
      return "UserValidationModels" + Path.DirectorySeparatorChar;
    }
    #endregion


    [Fact]// (Skip = "This is a template only. Do not skip actual tests.")]
        public void Template_ValidationCase_Test()
        {
            string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

            //Setup directory for unit test 
            string dir = SetupTestDir(testName);
            //initial options, and optional results to save/test
            JObject optionsJ = SetupJSON(dir, testName);

            //Change the default settings as needed for the test seed default set to 0 for testing.
            optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
            optionsJ["runct"] = 1;
            optionsJ["debug"] = "basic";
            JSONRun testRun = new JSONRun(optionsJ.ToString());
            Assert.True(TestRunSim(testRun));

            //Uncomment to update the validation files after they verified correct
            //CopyToValidated(dir, testName, optionsJ);

            //compare the test result and optionally the paths and json if assigned
            Compare(dir, testName, optionsJ);
        }
    }

      [Fact]// (Skip = "This is a template only. Do not skip actual tests.")]
    public void Template_ValidationCase_Test2()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.

      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);

      //Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      optionsJ["runct"] = 1;
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
