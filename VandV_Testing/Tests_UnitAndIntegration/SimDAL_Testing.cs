// Copyright 2021 Battelle Energy Alliance

using System;
using SimulationDAL;
using Xunit;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SimulationEngine;
//using MathNet.Numerics;
using JsonDiffPatchDotNet;
using Testing;

//using System.Windows.Forms;

namespace UnitAndIntegrationTesting
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  //construct each of the types of model objects from JSON and then get the JSON back and compare.
  public class SimDAL_Testing : TestingBaseClass
  {
    #region Setup Code

    protected override string CompareFilesDir()
    {
      return MainTestDir() + "CompareFiles" + Path.DirectorySeparatorChar;
    }

    protected override string ModelFolder()
    {
      return "UnitTestItems" + Path.DirectorySeparatorChar;
    }

    protected override string TestFolder()
    {
      throw new NotImplementedException();
    }



    private void SetupTheTest(string testName, EmraldModel model = null)
    {
      // Reset IDs and the random number generator so tests don't fail when run together
      SingleNextIDs.Instance.ResetAllIDs();
      SingleRandom.Reset();
      // set up the random number generator so it starts with the same key each time.
      ConfigData.seed = 0;
      if (model != null)
        model.rootPath = MainTestDir() + ModelFolder();
    }
    

    public bool CompareJSON(string jStr1, string jStr2)
    {
      jStr2 = jStr2.Replace("\"True\"", "true").Replace("\"true\"", "true").Replace("\"False\"", "false").Replace("\"false\"", "false");
      JObject jObj2 = JObject.Parse(jStr2);

      
      return CompareJSON(jStr1, jObj2);
    }
    public bool CompareJSON(string origResStr, JObject newJSON)
    {
      //Fix any string "True" vs boolean true json issues
      origResStr = origResStr.Replace("\"True\"", "true").Replace("\"true\"", "true").Replace("\"False\"", "false").Replace("\"false\"", "false");
      
      JObject jObj1 = JObject.Parse(origResStr);
      
      JsonDiffPatch jdp = new JsonDiffPatch();
      
      JToken diffObj = jdp.Diff(jObj1, newJSON);
      if (diffObj != null)
      {
        string diffResult = diffObj.ToString();
        //place a breakpoint here to debug or put to a log file
        return false;
      }

      //return JToken.DeepEquals(jObj1, jObj2);
      return true;
    }

    private void CopyToValidated(string path, string resText)
    {
      
      if (File.Exists(path))
      { 
        File.Delete(path); 
      }

      File.WriteAllText(path, resText);
    }
    #endregion

    /// //////////////
    // Event Tests
    //////////////////

    [Fact]
    [Description("Test to verify that the state change event loads from the model correctly")]
    public void StateCngEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      StateCngEvent ev = new StateCngEvent();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      ev.DeserializeDerived(jsonObj, true, mainModel, false);

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the logic event loads from the model correctly")]
    public void ComponentLogicEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      ComponentLogicEvent ev = new ComponentLogicEvent();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";//for the component logic event
      string fileLoc2 = MainTestDir() + ModelFolder() + testName + "2.json";//for the logic top
      string jsonModel = "";//for the component logic event
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);
      string jsonModel2 = "";//for the logic top
      if (File.Exists(fileLoc2))
        jsonModel2 = File.ReadAllText(fileLoc2);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);//for the component logic event
      dynamic jsonObj2 = JsonConvert.DeserializeObject(jsonModel2);//for the logic top
      //for some items, if the item JSON references other items they will need to be added to the main model
      LogicNode logicTop = new LogicNode();
      logicTop.DeserializeDerived(jsonObj2, true, mainModel, false);
      ev.DeserializeDerived(jsonObj, true, mainModel, false);
      ev.LoadObjLinks(jsonObj, true, mainModel);
           
      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the failure rate event loads from the model correctly")]
    public void FailRateEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      FailProbEvent ev = new FailProbEvent();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      ev.DeserializeDerived(jsonObj, true, mainModel, false);

      
      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the timer event loads from the model correctly")]
    public void TimerEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      TimerEvent ev = new TimerEvent();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      ev.DeserializeDerived(jsonObj, true, mainModel, false);

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the var condition event loads from the model correctly")]
    public void VarCondEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      EvalVarEvent ev = new EvalVarEvent();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      ev.DeserializeDerived(jsonObj, true, mainModel, false);

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the Distribution event loads from the model correctly")]
    public void DistEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

      DistEvent ev = new DistEvent();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      EmraldModel mainModel = new EmraldModel(); //for some items, if the item JSON references other items they will need to be added to the main model
      SimGlobVariable var = new SimGlobVariable();
      string fileLoc2 = MainTestDir() + ModelFolder() + "VarDoubleTest.json";//for the logic top
      string jsonModel2 = File.ReadAllText(fileLoc2);
      dynamic jsonObj2 = JsonConvert.DeserializeObject(jsonModel2);//for the logic top
      var.DeserializeDerived(jsonObj2, true, mainModel, false);
      ev.DeserializeDerived(jsonObj, true, mainModel, false);
      ev.LoadObjLinks(jsonObj, true, mainModel);

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    /// //////////////
    // Action Tests
    //////////////////


    [Fact]
    [Description("Test to verify that the transition action loads from the model correctly")]
    public void TransitionActTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      TransitionAct act = new TransitionAct();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      act.DeserializeDerived(jsonObj, true, mainModel, false);

      //make sure the JSON returned for the item is good 
      string retJsonStr = act.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Another test to verify that the transition action loads from the model correctly")]
    public void TransitionActTest2() //test WhichToState, different probabilities for each test
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      TransitionAct act = new TransitionAct();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";//Transition Action
      string fileLoc1 = MainTestDir() + ModelFolder() + "StateTest1.json";//State1
      string fileLoc2 = MainTestDir() + ModelFolder() + "StateTest2.json";//State2
      string fileLoc3 = MainTestDir() + ModelFolder() + "DiagramTest.json";//Diagram
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string jsonModel1 = "";
      if (File.Exists(fileLoc1))
        jsonModel1 = File.ReadAllText(fileLoc1);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string jsonModel2 = "";
      if (File.Exists(fileLoc2))
        jsonModel2 = File.ReadAllText(fileLoc2);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string jsonModel3 = "";
      if (File.Exists(fileLoc3))
        jsonModel3 = File.ReadAllText(fileLoc3);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      dynamic jsonObj1 = JsonConvert.DeserializeObject(jsonModel1);//State1
      dynamic jsonObj2 = JsonConvert.DeserializeObject(jsonModel2);//State2
      dynamic jsonObj3 = JsonConvert.DeserializeObject(jsonModel3);//Diagram

      //for some items, if the item JSON references other items they will need to be added to the main model
      State state1 = new State();//State1
      State state2 = new State();//State2
      Diagram diagram = new Diagram(EnDiagramType2.dtMulti);//Diagram

      act.DeserializeDerived(jsonObj, true, mainModel, false);
      diagram.DeserializeDerived(jsonObj3, true, mainModel, false);//Diagram
      state1.DeserializeDerived(jsonObj1, true, mainModel, false);//State1
      state2.DeserializeDerived(jsonObj2, true, mainModel, false);//State2
      act.LoadObjLinks(jsonObj, true, mainModel);

      //make sure the JSON returned for the item is good 
      string retJsonStr = act.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the Run exe action loads from the model correctly")]
    public void RunAppActTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);


      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string varFileLoc = MainTestDir() + ModelFolder() + "VarDoubleTest.json";
      string jsonModel = "";
      string varJsonModel = "";
      if (File.Exists(fileLoc))
      {
        jsonModel = File.ReadAllText(fileLoc);
        varJsonModel = File.ReadAllText(varFileLoc);
      }
      else
        throw new Exception("Failed to find create json file for " + testName);


      //for some items, if the item JSON references other items they will need to be added to the main model

      //add the variable used in the code
      dynamic varJsonObj = JsonConvert.DeserializeObject(varJsonModel);//for the logic top
      SimGlobVariable testVar = new SimGlobVariable();
      testVar.DeserializeDerived(varJsonObj, true, mainModel, false);

      //add the action
      RunExtAppAct act = new RunExtAppAct();
      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      act.DeserializeDerived(jsonObj, true, mainModel, false);
      act.LoadObjLinks(jsonObj, true, mainModel);

      Assert.True(act.CompileMakeInputFileCode(mainModel));
      Assert.True(act.CompileProcessOutputFileCode(mainModel));

      //make sure the JSON returned for the item is good 
      string retJsonStr = act.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the Ext Sim action loads from the model correctly")]
    public void ExtSimMsgActTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      Sim3DAction act = new Sim3DAction();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string fileLoc2 = MainTestDir() + ModelFolder() + "ExtSimObjTest.json";//for the 3dsim link
      string fileLoc3 = MainTestDir() + ModelFolder() + "Var3DSimTest.json";//for the 3dsim var
      string jsonModel = "";//for the Ext Sim msg action
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string extSimModel = "";//for the 3dsim link
      if (File.Exists(fileLoc2))
        extSimModel = File.ReadAllText(fileLoc2);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string varSimModel = "";//for the 3dsim variable
      if (File.Exists(fileLoc3))
        varSimModel = File.ReadAllText(fileLoc3);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);//for the Ext Sim event
      dynamic extSimJsonObj = JsonConvert.DeserializeObject(extSimModel);//for the 3dsim link
      dynamic varJsonObj = JsonConvert.DeserializeObject(varSimModel);//for the 3dsim variable

      //for some items, if the item JSON references other items they will need to be added to the main model
      ExternalSim externalSimLink = new ExternalSim();//for the 3dsim link
      Sim3DVariable sim3DVariable = new Sim3DVariable();//for the 3dsim variable

      sim3DVariable.DeserializeDerived(varJsonObj, true, mainModel, false);
      externalSimLink.DeserializeDerived(extSimJsonObj, true, mainModel, false);
      act.DeserializeDerived(jsonObj, true, mainModel, false);
      act.LoadObjLinks(jsonObj, true, mainModel);

      //make sure the JSON returned for the item is good 
      string retJsonStr = act.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the Change Variable Value action loads from the model correctly")]
    public void ChangeVarValActTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      VarValueAct act = new VarValueAct();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string fileLoc2 = MainTestDir() + ModelFolder() + testName + "2.json";//for the variable
      string jsonModel = "";//for the Ext Sim msg action
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string jsonModel2 = "";//for the 3dsim link
      if (File.Exists(fileLoc2))
        jsonModel2 = File.ReadAllText(fileLoc2);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);//for the Ext Sim event
      dynamic jsonObj2 = JsonConvert.DeserializeObject(jsonModel2);//for the variable

      //for some items, if the item JSON references other items they will need to be added to the main model
      SimGlobVariable simGlobVariable = new SimGlobVariable();//for the variable

      simGlobVariable.DeserializeDerived(jsonObj2, true, mainModel, false);
      act.DeserializeDerived(jsonObj, true, mainModel, false);
      act.LoadObjLinks(jsonObj, true, mainModel);

      Assert.True(act.CompileCode(mainModel.allVariables, mainModel.rootPath));

      //make sure the JSON returned for the item is good 
      string retJsonStr = act.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    /// //////////////
    // Variable Tests
    //////////////////

    [Fact]
    [Description("Test to verify that the int variable loads from the model correctly")]
    public void VarIntTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      SimGlobVariable var = new SimGlobVariable();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      var.DeserializeDerived(jsonObj, true, mainModel, false);

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the double variable loads from the model correctly")]
    public void VarDoubleTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      SimGlobVariable var = new SimGlobVariable();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      var.DeserializeDerived(jsonObj, true, mainModel, false);  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the boolean variable loads from the model correctly")]
    public void VarBoolTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      SimGlobVariable var = new SimGlobVariable();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      var.DeserializeDerived(jsonObj, true, mainModel, false); 

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the string variable loads from the model correctly")]
    public void VarStringTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      SimGlobVariable var = new SimGlobVariable();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      var.DeserializeDerived(jsonObj, true, mainModel, false);

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the 3D simulation variable loads from the model correctly")]
    public void Var3DSimTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      Sim3DVariable var = new Sim3DVariable();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      var.DeserializeDerived(jsonObj, true, mainModel, false); 

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the document regular expression variable loads from the model correctly")]
    public void VarDocRegExTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel(); 
      SetupTheTest(testName, mainModel);

      TextRegExVariable var = new TextRegExVariable();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      var.DeserializeDerived(jsonObj, true, mainModel, false);

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the document JSON variable loads from the model correctly")]
    public void VarDocJsonTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      JSONDocVariable var = new JSONDocVariable();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      var.DeserializeDerived(jsonObj, true, mainModel, false);

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the docuement XML variable loads from the model correctly")]
    public void VarDocXmlTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      XmlDocVariable var = new XmlDocVariable();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model
      var.DeserializeDerived(jsonObj, true, mainModel, false);

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    [Description("Test to verify that the accrual variable loads from the model correctly")]
    public void VarAccrTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      AccrualVariable var = new AccrualVariable();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string fileLoc1 = MainTestDir() + ModelFolder() + "StateTest1.json";//State1
      string fileLoc2 = MainTestDir() + ModelFolder() + "StateTest2.json";//State2
      string fileLoc3 = MainTestDir() + ModelFolder() + "DiagramTest.json";//Diagram
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string jsonModel1 = "";
      if (File.Exists(fileLoc1))
        jsonModel1 = File.ReadAllText(fileLoc1);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string jsonModel2 = "";
      if (File.Exists(fileLoc2))
        jsonModel2 = File.ReadAllText(fileLoc2);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string jsonModel3 = "";
      if (File.Exists(fileLoc3))
        jsonModel3 = File.ReadAllText(fileLoc3);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      dynamic jsonObj1 = JsonConvert.DeserializeObject(jsonModel1);//State1
      dynamic jsonObj2 = JsonConvert.DeserializeObject(jsonModel2);//State2
      dynamic jsonObj3 = JsonConvert.DeserializeObject(jsonModel3);//Diagram

      //for some items, if the item JSON references other items they will need to be added to the main model
      State state1 = new State();//State1
      State state2 = new State();//State2
      Diagram diagram = new Diagram(EnDiagramType2.dtMulti);//Diagram

      diagram.DeserializeDerived(jsonObj3, true, mainModel, false);//Diagram
      state1.DeserializeDerived(jsonObj1, true, mainModel, false);//State1
      state2.DeserializeDerived(jsonObj2, true, mainModel, false);//State2
      var.DeserializeDerived(jsonObj, true, mainModel, false);
      var.LoadObjLinks(jsonObj, true, mainModel);

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

   

    [Fact]
    [Description("Test to verify that the accrual static variable loads from the model correctly")]
    public void VarAccrStaticTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      AccrualVariable var = new AccrualVariable();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string fileLoc1 = MainTestDir() + ModelFolder() + "StateTest1.json";//State1
      string fileLoc3 = MainTestDir() + ModelFolder() + "DiagramTest.json";//Diagram
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string jsonModel1 = "";
      if (File.Exists(fileLoc1))
        jsonModel1 = File.ReadAllText(fileLoc1);
      else
        throw new Exception("Failed to find create json file for " + testName);

      string jsonModel3 = "";
      if (File.Exists(fileLoc3))
        jsonModel3 = File.ReadAllText(fileLoc3);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      dynamic jsonObj1 = JsonConvert.DeserializeObject(jsonModel1);//State1
      dynamic jsonObj3 = JsonConvert.DeserializeObject(jsonModel3);//Diagram

      //for some items, if the item JSON references other items they will need to be added to the main model
      State state1 = new State();//State1
      Diagram diagram = new Diagram(EnDiagramType2.dtMulti);//Diagram

      diagram.DeserializeDerived(jsonObj3, true, mainModel, false);//Diagram
      state1.DeserializeDerived(jsonObj1, true, mainModel, false);//State1
      var.DeserializeDerived(jsonObj, true, mainModel, false);
      var.LoadObjLinks(jsonObj, true, mainModel);

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, retJsonStr);

      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    
    public void JoinPathResultsTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      AccrualVariable var = new AccrualVariable();
      //use a sample JSON piece to set the values
      string fileLoc1 = MainTestDir() + ModelFolder() + testName + "1.json";
      string fileLoc2 = MainTestDir() + ModelFolder() + testName + "2.json";
      string compRes = CompareFilesDir() + testName + "_res.json";
      //string pathRes1 = ""; // Notused
     

      string combinedResStr = OverallResults.CombineJsonResultFiles(fileLoc1, fileLoc2);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, combinedResStr);

      string compResStr = "";
      if (File.Exists(compRes))
        compResStr = File.ReadAllText(compRes);
      else
        throw new Exception("Failed to find comparison file for " + testName);

      Assert.True(CompareJSON(compResStr, combinedResStr));
    }

    [Fact]
    [Description("/Make sure StdDev Calculation is working")]
    public void ResultsCalcTest()
    {
       //set up fake result info for testing
      ResultStateBase results = new ResultStateBase("test", true);
      results.AddTime(TimeSpan.FromMinutes(581.1));
      results.AddTime(TimeSpan.FromMinutes(274.2));
      results.AddTime(TimeSpan.FromMinutes(1290.8));
      results.AddTime(TimeSpan.FromMinutes(959.8));
      results.AddTime(TimeSpan.FromMinutes(1295.2));
      results.AddTime(TimeSpan.FromMinutes(152.6));
      results.AddTime(TimeSpan.FromMinutes(533.9));

      results.CalcStats(100);
      double mean = results.timeMean.TotalHours;
      double th5 = results.cRate5th;
      double t95 = results.cRate95th;
      double timeStd = results.GetTimeStdDev().TotalHours;

      Assert.False(Math.Abs(mean - 12.1133333) > 0.00001);
      Assert.False(Math.Abs(th5 + 0.0095) > 0.00001);
      Assert.False(Math.Abs(t95 - 0.0295) > 0.00001);
      Assert.False(Math.Abs(timeStd - 7.72339) > 0.00001);
    }

  }
}
