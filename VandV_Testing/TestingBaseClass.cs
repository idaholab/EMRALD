using Newtonsoft.Json.Linq;
using NLog.Config;
using NLog;
using SimulationEngine;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class DescriptionAttribute : Attribute
{
  public string Text { get; }

  public DescriptionAttribute(string text)
  {
    Text = text;
  }
}

namespace Testing
{
  public abstract class TestingBaseClass
  {
    //const string TestFolder() = "EMRALDTests" + Path.DirectorySeparatorChar;
    //const string ModelFolder() = "Models" + Path.DirectorySeparatorChar;
    const string pathsName = "_paths.txt";
    const string resName = "_res.txt";
    const string jsonResultsName = "_jsonResults.json";
    const string debugLogger = "uTestLog";

    protected bool ConfirmManualTest(string testName, string textDesc)
    {
      string currentDirectory = Directory.GetCurrentDirectory();

      try
      {
        // Create ProcessStartInfo to run the batch file
        ProcessStartInfo startInfo = new ProcessStartInfo
        {
          FileName = "ManualTestPrompt.exe",
          Arguments = "\"" + testName + "\" \"" + textDesc + "\"", 
          RedirectStandardError = true,
          RedirectStandardOutput = true,
          UseShellExecute = false,
          CreateNoWindow = false,
          WindowStyle = ProcessWindowStyle.Normal,
        };

        // Start the process
        using (Process process = Process.Start(startInfo))
        {
          process.WaitForExit();

          // Check the exit code to determine if the user confirmed
          return process.ExitCode == 0;
        }
      }
      catch
      {
        return false;
      }

      return false;
    }

    protected string RootDir()
    {
      return Directory.GetParent(Directory.GetCurrentDirectory()).Parent.Parent.FullName;
    }
    protected string MainTestDir()
    {
      return RootDir() + Path.DirectorySeparatorChar + "TestingFiles" + Path.DirectorySeparatorChar;
    }

    protected abstract string CompareFilesDir();

    protected abstract string TestFolder();

    protected abstract string ModelFolder();
    
    protected string SetupTestDir(string testName)
    {
      //Setup directory for unit test 
      string dir = MainTestDir() + TestFolder() + testName + Path.DirectorySeparatorChar;
      if (Directory.Exists(dir))
      {
        var d = new DirectoryInfo(dir);
        d.Delete(true);
      }
      Directory.CreateDirectory(dir);

      //setup the test log file
      var rootDir = RootDir();

      LogManager.Configuration = new XmlLoggingConfiguration(rootDir + Path.DirectorySeparatorChar + "NLog.config");
      var config = LogManager.Configuration;
      var logfile = new NLog.Targets.FileTarget(debugLogger)
      {
        FileName = MainTestDir() + TestFolder() + debugLogger + ".txt",
        Layout = "${message}",
        //DeleteOldFileOnStartup = true,
        KeepFileOpen = true,
        OpenFileCacheTimeout = 120,
        ConcurrentWrites = true,
        Name = debugLogger
      };
      config.AddRule(LogLevel.Debug, LogLevel.Fatal, logfile, debugLogger);
      LogManager.Configuration = config;

      return dir;
    }
    protected string GetCurrentMethodName()
    {
      var st = new StackTrace();
      var sf = st.GetFrame(1);

      return sf.GetMethod().Name;
    }

    protected JObject SetupJSON(string loc, string testName, bool jsonResults = false)
    {
      Options ops = new Options();
      ops.resout = loc + testName + resName;
      if (jsonResults)
        ops.jsonRes = loc + testName + jsonResultsName;

      return JObject.FromObject(ops);
    }

    protected void Compare(string loc, string testName, JObject jsonSettings)
    {
      var logger = NLog.LogManager.GetLogger(debugLogger);

      void SingleComp(string newPath, string origPath, int[] ignoreLines = null)
      {
        List<string> newFile = File.ReadLines(newPath).ToList();
        if (!File.Exists(origPath))
        {
          logger.Debug("Missing validation file - " + origPath);
          Assert.True(false);
        }
        List<string> origFile = File.ReadAllLines(origPath).ToList();
        //remove invalid comparison lines
        if (ignoreLines != null)
          foreach (var i in ignoreLines)
          {
            newFile.RemoveAt(i);
            origFile.RemoveAt(i);
          }

        List<string> inOrigNotInNew = origFile.Except(newFile).ToList();
        List<string> inNewNotInOrig = newFile.Except(origFile).ToList();
        if ((inOrigNotInNew.Count > 0) || (inNewNotInOrig.Count > 0))
        {
          logger.Debug("Missing lines in tests results:");
          logger.Debug(String.Join(Environment.NewLine, inOrigNotInNew));
          logger.Debug("------");
          logger.Debug("Missing lines in tests results:");
          logger.Debug(String.Join(Environment.NewLine, inNewNotInOrig));
          Assert.True(false);
        }
      }

      //results file
      SingleComp(loc + testName + resName, CompareFilesDir() + testName + resName, new int[] { 1 });
      //Paths file
      if ((string)jsonSettings["pathout"] != null)
        SingleComp((string)jsonSettings["pathout"], CompareFilesDir() + testName + pathsName);
      //Json Results file
      if ((string)jsonSettings["jsonRes"] != null)
        if (Directory.Exists((string)jsonSettings["jsonRes"]))
          SingleComp((string)jsonSettings["jsonRes"], CompareFilesDir() + testName + jsonResultsName);
    }

    protected void CopyToValidated(string loc, string testName, JObject jsonSettings)
    {
      File.Copy((string)jsonSettings["resout"], CompareFilesDir() + testName + resName, true);

      if ((string)jsonSettings["pathout"] != null)
      {
        File.Copy((string)jsonSettings["pathout"], CompareFilesDir() + testName + pathsName, true);
      }

      if ((string)jsonSettings["jsonRes"] != null)
      {
        if (Directory.Exists((string)jsonSettings["jsonRes"]))
          File.Copy((string)jsonSettings["jsonRes"], CompareFilesDir() + testName + jsonResultsName, true);
      }
    }

    protected bool TestRunSim(JSONRun runParams)
    {
      var logger = NLog.LogManager.GetLogger(debugLogger);
      string res = runParams.RunSim();
      if (res != "")
      {
        var st = new StackTrace();
        string callFunc = st.GetFrame(1).GetMethod().Name;
        logger.Debug("[" + callFunc + "] " + res);
        return false;
      }

      return true;
    }
  }
}
