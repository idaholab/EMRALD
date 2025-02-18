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
using SimulationDAL;
using JsonDiffPatchDotNet;
using Testing;

//using System.Windows.Forms;

namespace UnitTesting_Simulation
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  //construct each of the types of model objects from JSON and then get the JSON back and compare.
  public class SimDAL_Testing : TestingBaseClass
  {

    //private string RootDir()
    //{
    //  return Directory.GetParent(System.IO.Directory.GetCurrentDirectory()).Parent.Parent.FullName;
    //}
    //private string MainTestDir()
    //{
    //  return RootDir() + Path.DirectorySeparatorChar + "TestingFiles" + Path.DirectorySeparatorChar;
    //}

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

    /// //////////////
    // Event Tests
    //////////////////

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event or other functions of the event
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      TimeSpan s = ev.NextTime(TimeSpan.FromSeconds(0));
      Assert.True(s.TotalMilliseconds == 77730.9248);
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      TimeSpan s = ev.NextTime(TimeSpan.FromSeconds(0));
      Assert.True((s.TotalMilliseconds - 60000) < 1);
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    public void ExpDistEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      ExponentialDistEvent ev = new ExponentialDistEvent();
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      TimeSpan s = ev.NextTime(TimeSpan.FromSeconds(0));
      Assert.True(s.TotalMilliseconds == 2303065.7113);
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }


    [Fact]
    public void NormDistEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      NormalDistEvent ev = new NormalDistEvent();
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      Assert.True(ev.NextTime(TimeSpan.FromSeconds(0)).TotalMilliseconds == 45286473.5153);
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  
      //...\UnitTesting\Models\NormDistTestFINAL.json

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  
      //...\UnitTesting\Models\NormDistTestFINAL.json

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    public void WeibDistEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      WeibullDistEvent ev = new WeibullDistEvent();
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      TimeSpan s = ev.NextTime(TimeSpan.FromSeconds(0));
      Assert.True(s.TotalMilliseconds == 1151532.8556);
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  
      //...\UnitTesting\Models\WeibDistTestFINAL.json

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }


    [Fact]
    public void LogNormDistEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      LogNormalDistEvent ev = new LogNormalDistEvent();
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      Assert.True(ev.NextTime(TimeSpan.FromSeconds(0)).TotalMilliseconds == 29869832.9832);
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    /// //////////////
    // Action Tests
    //////////////////


    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = act.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = act.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test functions of the action
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = act.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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
      string jsonModel = "";//for the Ext Sim Msg action
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = act.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    public void ChangeVarValActTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      VarValueAct act = new VarValueAct();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + ModelFolder() + testName + ".json";
      string fileLoc2 = MainTestDir() + ModelFolder() + testName + "2.json";//for the variable
      string jsonModel = "";//for the Ext Sim Msg action
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

      Assert.True(act.CompileCode(mainModel.allVariables));
     
      //Is there a way to easily test the triggering of the event 
      //test for true
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = act.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    /// //////////////
    // Variable Tests
    //////////////////

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

   

    [Fact]
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

      //Is there a way to easily test the triggering of the event 
      //test for true
      //Assert.True(ev.EventTriggered());
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = var.GetJSON(true, mainModel);
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
      string pathRes1 = "";
     

      string combinedResStr = OverallResults.CombineResultFiles(fileLoc1, fileLoc2);

      //Uncomment to update the validation files after they verified correct
      //CopyToValidated(compRes, combinedResStr);

      string compResStr = "";
      if (File.Exists(compRes))
        compResStr = File.ReadAllText(compRes);
      else
        throw new Exception("Failed to find comparison file for " + testName);

      Assert.True(CompareJSON(compResStr, combinedResStr));
    }

  }
}
