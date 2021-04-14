// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SimulationDAL;
using NLog;

namespace EMRALD_Sim
{
  public class LoadLib
  {
    public static string LoadModel(string path, ref string errorMsg)
    {
      string retStr = "";
      StreamReader srFileReader = new StreamReader(path);

      string modelStr = srFileReader.ReadToEnd();
      try
      {
        JToken modelJson = JToken.Parse(modelStr);
        retStr = modelJson.ToString(Formatting.Indented);
      }
      catch (Exception ex)
      {
        errorMsg = "Bad model syntax - " + ex.Message;
        retStr = modelStr;
      };

      return retStr;
    }


    public static string ValidateModel(ref EmraldModel sim, string modelText)
    {
      try
      {
        sim = new EmraldModel();
        sim.DeserializeJSON(modelText); //throws and exception of failed
        return "";
      }
      catch (Exception error)
      {
        string retError = "Failed to load model :" + Environment.NewLine;
        retError += error.Message;
        if (error.InnerException != null && error.InnerException.Message != "")
        {
          retError += " - " + error.InnerException.Message;
        }
        return retError;
      }
    }

    //public static void SetLog(LogLevel lev)
    //{
    //  ConfigData.debugLev = lev;
    //  foreach (var rule in LogManager.Configuration.LoggingRules)
    //  {
    //    rule.EnableLoggingForLevel(lev);
    //  }

    //  LogManager.ReconfigExistingLoggers();
    //}

    public static bool SetSeed(string seed)
    {
      int inSeed = 0;
      if (seed == "")
        ConfigData.seed = null;
      else
      {
        if (!Int32.TryParse(seed, out inSeed))
        {
          Console.Write("invalid data for random number seed, must be an integer - " + seed);
          return false;
        }
        else
        {
          ConfigData.seed = inSeed;
        }
      }

      return true;
    }
  }
}
