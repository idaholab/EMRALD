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
//using System.Windows.Forms;

namespace UnitTesting_Simulation
{

  //construct each of the types of model objects from JSON and then get the JSON back and compare.
  public class SimDAL_Testing
  {

    private string RootDir()
    {
      return Directory.GetParent(System.IO.Directory.GetCurrentDirectory()).Parent.Parent.FullName;
    }
    private string MainTestDir()
    {
      return RootDir() + "\\TestingFiles\\";
    }

    private string CompareFilesDir()
    {
      return MainTestDir() + "CompareFiles\\";
    }


    const string testFolder = "EMRALDTests\\";
    const string itemFolder = "Items\\";

    private void SetupTheTest(string testName, EmraldModel model = null)
    {
      // set up the random number generator so it starts with the same key each time.
      ConfigData.seed = 0;
      if (model != null)
        model.rootPath = MainTestDir() + itemFolder;
    }
    public string GetCurrentMethodName()
    {
      var st = new StackTrace();
      var sf = st.GetFrame(1);

      return sf.GetMethod().Name;
    }

    public bool CompareJSON(string jStr1, string jStr2)
    {
      //Fix any string "True" vs boolean true json issues
      jStr1 = jStr1.Replace("\"True\"", "true").Replace("\"true\"", "true").Replace("\"False\"", "false").Replace("\"false\"", "false");
      jStr2 = jStr2.Replace("\"True\"", "true").Replace("\"true\"", "true").Replace("\"False\"", "false").Replace("\"false\"", "false");

      JObject jObj1 = JObject.Parse(jStr1);
      JObject jObj2 = JObject.Parse(jStr2);

      JsonDiffPatch jdp = new JsonDiffPatch();
      JToken diffObj = jdp.Diff(jObj1, jObj2);
      if (diffObj != null)
      {
        string diffResult = diffObj.ToString();
        //place a breakpoint here to debug or put to a log file
        return false;
      }

      //return JToken.DeepEquals(jObj1, jObj2);
      return true;
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
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
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
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";//for the component logic event
      string fileLoc2 = MainTestDir() + itemFolder + testName + "2.json";//for the logic top
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
      EmraldModel mainModel = new EmraldModel(); //for some items, if the item JSON references other items they will need to be added to the main model
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
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
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
      TimeSpan s = ev.NextTime();
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
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
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
      TimeSpan s = ev.NextTime();
      Assert.True(s.TotalMilliseconds == 60000);
      //test for false
      //Assert.False(ev.EventTriggered());

      //Reference any regression tests in SimEngineTests that covers this.  

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }
    [Fact]
    public void VarTimerEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
      string varFileLoc = MainTestDir() + itemFolder + "VarDoubleTest.json";
      string jsonModel = "";
      string varJsonModel = "";
      if (File.Exists(fileLoc))
      {
        jsonModel = File.ReadAllText(fileLoc);
        varJsonModel = File.ReadAllText(varFileLoc);
      }
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      //for some items, if the item JSON references other items they will need to be added to the main model

      dynamic varJsonObj = JsonConvert.DeserializeObject(varJsonModel);//for the logic top
      SimGlobVariable testVar = new SimGlobVariable();
      testVar.DeserializeDerived(varJsonObj, true, mainModel, false);

      TimerEvent ev = new TimerEvent();
      ev.DeserializeDerived(jsonObj, true, mainModel, false);
      ev.LoadObjLinks(jsonObj, true, mainModel);

      //Is there a way to easily test the triggering of the event 
      //test for true
      TimeSpan s = ev.NextTime();
      Assert.True(s.TotalMilliseconds == 10800);
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
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
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
    public void ExtSimEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      ExtSimEvent ev = new ExtSimEvent("TestExtSimEvent");
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      EmraldModel mainModel = new EmraldModel(); //for some items, if the item JSON references other items they will need to be added to the main model
      ev.DeserializeDerived(jsonObj, true, mainModel, false);
      ev.LoadObjLinks(jsonObj, true, mainModel);

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
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
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
      TimeSpan s = ev.NextTime();
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
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
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
      Assert.True(ev.NextTime().TotalMilliseconds == 45286473.5153);
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
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
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
      TimeSpan s = ev.NextTime();
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
      SetupTheTest(testName);

      LogNormDistEvent ev = new LogNormDistEvent();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      EmraldModel mainModel = new EmraldModel(); //for some items, if the item JSON references other items they will need to be added to the main model
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

    /// //////////////
    // Action Tests
    //////////////////

    [Fact]
    public void TransitionActTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

      TransitionAct act = new TransitionAct();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      EmraldModel mainModel = new EmraldModel(); //for some items, if the item JSON references other items they will need to be added to the main model
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
    public void RunAppActTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

      RunExtAppAct act = new RunExtAppAct();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
      string jsonModel = "";
      if (File.Exists(fileLoc))
        jsonModel = File.ReadAllText(fileLoc);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);
      EmraldModel mainModel = new EmraldModel(); //for some items, if the item JSON references other items they will need to be added to the main model
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
    public void ExtSimMsgActTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

      Sim3DAction act = new Sim3DAction();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
      string fileLoc2 = MainTestDir() + itemFolder + testName + "2.json";//for the 3dsim link
      string fileLoc3 = MainTestDir() + itemFolder + testName + "3.json";//for the 3dsim var
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

      string jsonModel3 = "";//for the 3dsim variable
      if (File.Exists(fileLoc3))
        jsonModel3 = File.ReadAllText(fileLoc3);
      else
        throw new Exception("Failed to find create json file for " + testName);

      dynamic jsonObj = JsonConvert.DeserializeObject(jsonModel);//for the Ext Sim event
      dynamic jsonObj2 = JsonConvert.DeserializeObject(jsonModel2);//for the 3dsim link
      dynamic jsonObj3 = JsonConvert.DeserializeObject(jsonModel3);//for the 3dsim variable

      EmraldModel mainModel = new EmraldModel(); //for some items, if the item JSON references other items they will need to be added to the main model
      ExternalSim externalSimLink = new ExternalSim();//for the 3dsim link
      Sim3DVariable sim3DVariable = new Sim3DVariable();//for the 3dsim variable
      
      sim3DVariable.DeserializeDerived(jsonObj3, true, mainModel, false);
      externalSimLink.DeserializeDerived(jsonObj2, true, mainModel, false);
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
      SetupTheTest(testName);

      VarValueAct act = new VarValueAct();
      //use a sample JSON piece to set the values
      string fileLoc = MainTestDir() + itemFolder + testName + ".json";
      string fileLoc2 = MainTestDir() + itemFolder + testName + "2.json";//for the variable
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

      EmraldModel mainModel = new EmraldModel(); //for some items, if the item JSON references other items they will need to be added to the main model
      SimGlobVariable simGlobVariable = new SimGlobVariable();//for the variable

      simGlobVariable.DeserializeDerived(jsonObj2, true, mainModel, false);
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
  }
}

