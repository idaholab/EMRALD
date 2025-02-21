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
    public void Template_ValidationCase_Test() //Name the test 
    {
      //Description 
      //[describe the test]

      //Validation Document
      //[name of validation document in TestingFiles/UserValidationDocs see Template_ValidationCase_Doc.docx]

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald";
      /////////////////////////////////

      /////////////
      ///Use the optionsJ to set the model run settings needed 
      ///please only use the number of runs needed to validate the test so testing can get done quickly
      ///Change the default settings as needed for the test seed default set to 0 for testing.
      optionsJ["runct"] = 1;
      optionsJ["debug"] = "basic";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));


      //If verifying against a different results file use this code, otherwise delete and add the verification asserts 

      //Uncomment on the first run then verify the result file is correct only ever uncomment again if updating the validation results and they are verified
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned, causes an assert if not equiovolent
      Compare(dir, testName, optionsJ);
    }
  }
}
