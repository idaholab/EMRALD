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

namespace UnitAndIntegrationTesting
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  //construct each of the types of model objects from JSON and then get the JSON back and compare.
  public class ItemValue_Testing : TestingBaseClass
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
       
    #endregion

    /////////////////
    // Event Tests
    //////////////////

    [Fact]
    [Description("Tests to verify that the failure rate event samples as expected.")]
    public void FailRateEventValue()
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

      //test for correct value, known because of key used in random
      TimeSpan s = ev.NextTime(TimeSpan.FromSeconds(0));
      Assert.True(s.TotalMilliseconds == 77730.9248);
    }

    [Fact]
    [Description("Tests to verify that the timer event samples as expected.")]
    public void TimerEventValue()
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

      //test for correct value, known because of key used in random
      TimeSpan s = ev.NextTime(TimeSpan.FromSeconds(0));
      Assert.True((s.TotalMilliseconds - 300000) < 1);
    }

    [Fact]
    [Description("Tests to verify that the exponential distribution rate event samples as expected.")]
    public void ExpDistEventValue()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      DistEvent ev = new DistEvent();
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

      //test for correct value, known because of key used in random
      TimeSpan s = ev.NextTime(TimeSpan.FromSeconds(0));
      Assert.True(s.TotalMilliseconds == 276367885.3593);
      
    }


    [Fact]
    [Description("Tests to verify that the normal distribution rate event samples as expected.")]
    public void NormDistEventValue()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      DistEvent ev = new DistEvent();
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

      //test for correct value, known because of key used in random
      Assert.True(ev.NextTime(TimeSpan.FromSeconds(0)).TotalMilliseconds == 45286473.5153);
    }

    [Fact]
    [Description("Tests to verify that the Weibul distribution event samples as expected.")]
    public void WeibDistEventValue()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      DistEvent ev = new DistEvent();
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

      //test for correct value, known because of key used in random
      TimeSpan s = ev.NextTime(TimeSpan.FromSeconds(0));
      Assert.True(s.TotalMilliseconds == 2036054.5867);
    }


    [Fact]
    [Description("Tests to verify that the log normal event samples as expected.")]
    public void LogNormDistEventValue()
    {
      string testName = GetCurrentMethodName(); //function name must match the name of the test model and saved in the models folder.
      EmraldModel mainModel = new EmraldModel();
      SetupTheTest(testName, mainModel);

      DistEvent ev = new DistEvent();
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

      //test for correct value, known because of key used in random
      Assert.True(ev.NextTime(TimeSpan.FromSeconds(0)).TotalMilliseconds == 2592841926.2083);
    }

  }
}
