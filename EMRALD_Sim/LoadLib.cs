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
    public static string LoadModel(ref EmraldModel sim, string path, ref string errorMsg)
    {
      string retStr = "";
      if (!File.Exists(path))
      {
        errorMsg = "File does not exist anymore.";
        return "";
      }

      string modelStr;
      using (StreamReader srFileReader = new StreamReader(path))
      {
        modelStr = srFileReader.ReadToEnd();
      }

      try
      {
        if (sim == null)
        {
          sim = new EmraldModel();
        }
        modelStr  = sim.UpdateModel(modelStr);
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


    public static string ValidateModel(ref EmraldModel sim, string modelText, string modelDir)
    {
      try
      {
        if (sim == null)
        {
          sim = new EmraldModel();
        }
        sim.DeserializeJSON(modelText, Path.GetDirectoryName(modelDir), Path.GetFileNameWithoutExtension(modelDir)); //throws and exception of failed
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

    public static bool SetThreads(string threadCnt)
    {
      int inThreads = 0;
      if (threadCnt == "")
        ConfigData.threads = 1;
      else
      {
        if (!Int32.TryParse(threadCnt, out inThreads))
        {
          Console.Write("invalid data for random number seed, must be an integer - " + threadCnt);
          return false;
        }
        else
        {
          ConfigData.threads = inThreads;
        }
      }

      return true;
    }

    public static void MergeResults(string r1, string r2, string destPath)
    {

    }
  }
}
