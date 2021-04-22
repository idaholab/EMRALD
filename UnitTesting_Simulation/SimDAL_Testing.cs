﻿// Copyright 2021 Battelle Energy Alliance

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

    private void SetupTheTest(string testName)
    {
      // set up the random number generator so it starts with the same key each time.
      ConfigData.seed = 0;
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

      JObject JObj1 = JObject.Parse(jStr1);
      JObject JObj2 = JObject.Parse(jStr2);

      return JToken.DeepEquals(JObj1, JObj2);
    }


    [Fact]
    public void StateCngEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

      StateCngEvent ev = new StateCngEvent();
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

    [Fact]
    public void ComponentLogicEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

      ComponentLogicEvent ev = new ComponentLogicEvent();
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

      //Is there a way to easily test the triggering of the event or other fcns of event
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
      SetupTheTest(testName);

      FailProbEvent ev = new FailProbEvent();
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

    [Fact]
    public void TimerEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

      TimerEvent ev = new TimerEvent();
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

    [Fact]
    public void VarCondEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

      EvalVarEvent ev = new EvalVarEvent();
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

    [Fact]
    public void ExtSimEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

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
      SetupTheTest(testName);

      ExponentialDistEvent ev = new ExponentialDistEvent();
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
      //...\UnitTesting\Models\ExpDistTestFINAL.json

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    public void NormDistEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

      NormalDistEvent ev = new NormalDistEvent();
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
      //...\UnitTesting\Models\NormDistTestFINAL.json

      //make sure the JSON returned for the item is good 
      string retJsonStr = ev.GetJSON(true, mainModel);
      Assert.True(CompareJSON(retJsonStr, jsonModel));
    }

    [Fact]
    public void WeibDistEventTest()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      SetupTheTest(testName);

      WeibullDistEvent ev = new WeibullDistEvent();
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

      LogNormalDistEvent ev = new LogNormalDistEvent();
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
  }
}

