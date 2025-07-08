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
using Matrix.Xmpp.Jingle;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Newtonsoft.Json;

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



    //[Fact]// (Skip = "This is a template only. Do not skip actual tests.")]
    //public void Template_ValidationCase_Test() //Name the test 
    //{
    //  //Description 
    //  //[describe the test]

    //  //Validation Document
    //  //[name of validation document in TestingFiles/UserValidationDocs see Template_ValidationCase_Doc.docx]

    //  //////////////////////////////
    //  ///Don't change the following
    //  //////////////////////////////
    //  string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
    //  //Sets up directory for unit test 
    //  string dir = SetupTestDir(testName);
    //  //initial options, and optional results to save/test
    //  JObject optionsJ = SetupJSON(dir, testName);
    //  optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".emrald"; //or .json
    //  /////////////////////////////////

    //  /////////////
    //  ///Use the optionsJ to set the model run settings needed 
    //  ///please only use the number of runs needed to validate the test so testing can get done quickly
    //  ///Change the default settings as needed for the test seed default set to 0 for testing.
    //  optionsJ["runct"] = 1;
    //  optionsJ["debug"] = "basic";
    //  JSONRun testRun = new JSONRun(optionsJ.ToString());
    //  Assert.True(TestRunSim(testRun));


    //  //If verifying against a different results file use this code, otherwise delete and add the verification asserts 

    //  //Uncomment on the first run then verify the result file is correct only ever uncomment again if updating the validation results and they are verified
    //  //CopyToValidated(dir, testName, optionsJ);

    //  //compare the test result and optionally the paths and json if assigned, causes an assert if not equiovolent
    //  Compare(dir, testName, optionsJ);
    //}

    //2.2.1 T2
    [Fact]
    public void Single_component_failure()
    {
      //Description 
      //test the failure probability of a single component given the mission time and failure rate

      //Validation Document
      //TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.2.1 Single Component Failure, Test 2]

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 100000;
      optionsJ["runtime"] = "365.00:00:00";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //2.2.2 T1
    [Fact] 
    public void Single_Component_Repair()
    {
      //Description 
      //test the failure and repair of a single component given the failure rate, repair rate or time, and mission time

      //Validation Document
      //TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.2.2 Single Component Failure and Repair Test 1]

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Setup directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 100000;
      optionsJ["runtime"] = "365.00:00:00";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //2.2.2 T2
    [Fact]
    public void Single_Component_Repair_With_Timer()
    {
      //Description 
      //test the failure and repair of a single component given the failure rate, repair rate or time, and mission time.

      //Validation Document
      //TestingFiles/UserValidationDocs see NumaricalCases.docx, 2.2.2 Single Component Failure and Repair, Test 2]

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 100000;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    //2.2.3 T1
    [Fact]
    public void Two_Components_Fail_in_Parallel()
    {
      //Description 
      //test the rate and MTTF of two identical components in parallel for rate of 1/10 days Mission time 100 days

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.2.3 Two Identical Components in Parallel Configuration, Test 1

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 100000;
      optionsJ["runtime"] = "100.00:00:00";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //2.2.3 t3
    [Fact]
    public void Two_Components_Fail_in_Parallel_Rate()
    {
      //Description 
      //test the failure probability of two identical components in parallel

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.2.3 Two Identical Components in Parallel Configuration, Test 3

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 100000;
      optionsJ["runtime"] = "10000.00:00:00";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //2.2.4 t1
    [Fact]
    public void Two_Components_Fail_in_Series()
    {
      //Description 
      //test the failure probability of two identical components in series in EMRALD, as shown in Figure 9, we can use SAPHIRE as shown in Figure 10 and analytical calculations as given in Equation  (4). 

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.2.4	Two Identical Components in Series Configuration, Test 1

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 100000;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //2.2.4 t3
    [Fact]
    public void Two_Components_Fail_in_Series_Rate()
    {
      //Description 
      //test the MTTF of two identical components in series in EMRALD, as shown in Figure 9, we can use SAPHIRE as shown in Figure 10 and analytical calculations as given in Equation  (4). 

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.2.4	Two Identical Components in Series Configuration, Test 3

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 100000;
      optionsJ["runtime"] = "10000.00:00:00";
      //optionsJ["resout"] = "c:\\temp\\BasicResults.txt"; 

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //2.2.5
    [Fact]
    public void CCF()
    {
      //Description 
      //calculate the failure probability of two components in parallel with common cause failure using the equation of the beta factor model

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.2.5	Two Identical Components in Parallel Configuration with Common Cause Failure, test 1

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 100000;
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //2.2.6
    [Fact]
    public void Basic_Event_Tree()
    {
      //Description 
      //verify the results of an event tree model, with one component as the engineering safety feature, in EMRALD

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.2.6	Initiating Event with One Engineering Safety Feature, Test 1

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 1000000;
      optionsJ["runtime"] = "365.00:00:00";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //2.2.7
    [Fact]
    public void Basic_Event_Tree_With_Two_Components_In_Parallel()
    {
      //Description 
      //verify the results of an event tree model with an engineering safety feature that has two component sin parallel, in EMRALD

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.2.7	Initiating Event with Engineering Safety Feature 1, Test 1

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 10000;
      optionsJ["runtime"] = "365.00:00:00";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //2.2.8
    [Fact]
    public void Basic_Event_Tree_With_Two_Components_In_Series()
    {
      //Description 
      //verify the results of an event tree model with an engineering safety feature that has two components in series, in EMRALD

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 1.1.1 Initiating Event with Engineering Safety Feature 2

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 10000;
      optionsJ["runtime"] = "1000.00:00:00";
      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }



    //2.3.1
    [Fact]
    public void Two_Components_Fail_In_Parallel_And_Undergo_Repair()
    {
      //Description 
      //Two Identical Components in Active Parallel Fail and Get Repaired: One Repairperson Available

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.3.1	Two Identical Components in Active Parallel Fail and Get Repaired, Test 2

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 1000;
      optionsJ["runtime"] = "2000.00:00:00";
      JArray variablesArray = new JArray();
      variablesArray.Add("Unavail_PerHour");
      optionsJ["variables"] = variablesArray;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }

    //2.3.2
    [Fact]
    public void Two_Components_Fail_In_Parallel_And_Undergo_2Repair()
    {
      //Description 
      //Two Identical Components in Active Parallel Fail and Get Repaired: Two Repairperson Available

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.3.2	Two Identical Components in Active Parallel Fail and Get Repaired, Test 2

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 1000;
      optionsJ["runtime"] = "2000.00:00:00";
      JArray variablesArray = new JArray();
      variablesArray.Add("Unavail_PerHour");
      optionsJ["variables"] = variablesArray;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }


    //2.3.3
    [Fact]
    public void Two_Components_Active_And_Standby_Fail_And_Undergo_Repair()
    {
      //Description 
      //Two Identical Components, One Active and One in Standby, Fail and Get Repaired, One Repairperson Available

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.3.3	Two Identical Components, One Active and One in Standby, Fail and Get Repaired, One Repairperson Available

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 1000;
      optionsJ["runtime"] = "2000.00:00:00";
      JArray variablesArray = new JArray();
      variablesArray.Add("TimeUnavail");
      optionsJ["variables"] = variablesArray;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
    //2.3.4
    [Fact]
    public void Two_Components_Active_And_Standby_Fail_And_Undergo_2Repair()
    {
      //Description 
      //Two Identical Components, One Active and One in Standby, Fail and Get Repaired, Two Repairpersons Available

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.3.4	Two Identical Components, One Active and One in Standby, Fail and Get Repaired, Two Repairpersons Available

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 1000;
      optionsJ["runtime"] = "2000.00:00:00";
      JArray variablesArray = new JArray();
      variablesArray.Add("TimeUnavail");
      optionsJ["variables"] = variablesArray;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
    //2.3.5 
    [Fact]
    public void Two_Components_Series_Fail_And_Undergo_Repair()
    {
      //Description 
      //Two Identical Components in Series Fail and Get Repaired, One Repairperson Available

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.3.5	Two Identical Components in Series Fail and Get Repaired, One Repairperson Available

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 1000;
      optionsJ["runtime"] = "2000.00:00:00";
      JArray variablesArray = new JArray();
      variablesArray.Add("TimeUnavail");
      optionsJ["variables"] = variablesArray;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }
    //2.3.6
    [Fact]
    public void Two_Components_Series_Fail_And_Undergo_2Repair()
    {
      //Description 
      //Two Identical Components in Series Fail and Get Repaired, Two Repairpersons Available

      //Validation Document
      //in TestingFiles/UserValidationDocs see Numaricalcases.docx, 2.3.6	Two Identical Components in Series Fail and Get Repaired, Two Repairpersons Available

      //////////////////////////////
      ///Don't change the following
      //////////////////////////////
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      //Sets up directory for unit test 
      string dir = SetupTestDir(testName);
      //initial options, and optional results to save/test
      JObject optionsJ = SetupJSON(dir, testName);
      optionsJ["inpfile"] = MainTestDir() + ModelFolder() + testName + ".json";
      /////////////////////////////////

      /////////////
      optionsJ["runct"] = 1000;
      optionsJ["runtime"] = "2000.00:00:00";
      JArray variablesArray = new JArray();
      variablesArray.Add("TimeUnavail");
      optionsJ["variables"] = variablesArray;

      JSONRun testRun = new JSONRun(optionsJ.ToString());
      Assert.True(TestRunSim(testRun));

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(dir, testName, optionsJ);

      //compare the test result and optionally the paths and json if assigned
      Compare(dir, testName, optionsJ);
    }









  }
}
