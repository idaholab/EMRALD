// Copyright 2026 Battelle Energy Alliance
// Abstract base class providing shared setup, directory management, and comparison utilities for EMRALD simulation tests.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using NLog;
using NLog.Config;
using SimulationDAL;
using SimulationEngine;
using Xunit;

// Ensures all tests in the "Serial" collection run sequentially, never in parallel
[Xunit.CollectionDefinition("Serial", DisableParallelization = true)]
public class SerialCollectionDefinition { }

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
      string currentDirectory = CommonFunctions.NormalizeGetCurrentDirectory();

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
    }

    protected string RootDir()
    {
      string currentPath = CommonFunctions.NormalizeGetDirectoryName(Assembly.GetExecutingAssembly().Location);

      while (true)
      {
        if (Path.GetFileName(currentPath) == "VandV_Testing")
        {
          return currentPath;
        }
        else if (Directory.GetParent(currentPath) == null) // Root directory reached
        {
          throw new DirectoryNotFoundException("Folder 'VandV_Testing' not found in the directory tree.");
        }
        else
        {
          currentPath = CommonFunctions.NormalizeGetParent(currentPath);
        }
      }
    }
    protected string MainTestDir()
    {
      return RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
          ? (RootDir() + Path.AltDirectorySeparatorChar + "TestingFiles" + Path.AltDirectorySeparatorChar).Replace('\\', '/')
          : (RootDir() + Path.AltDirectorySeparatorChar + "TestingFiles" + Path.AltDirectorySeparatorChar);
    }

    protected abstract string CompareFilesDir();

    protected abstract string TestFolder();

    protected abstract string ModelFolder();
    
    protected string SetupTestDir(string testName)
    {
      //Setup directory for unit test 
      string dir = MainTestDir() + TestFolder() + testName + Path.AltDirectorySeparatorChar;
      if (Directory.Exists(dir))
      {
        var d = new DirectoryInfo(dir);
        d.Delete(true);
      }
      Directory.CreateDirectory(dir);

      //setup the test log file
      var rootDir = RootDir();

      LogManager.Configuration = new XmlLoggingConfiguration(rootDir + Path.AltDirectorySeparatorChar + "NLog.config");
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
      var method = sf.GetMethod();

      // Check if we're in a compiler-generated async method (MoveNext)
      if (method.Name == "MoveNext" && method.DeclaringType != null)
      {
        var declaringType = method.DeclaringType.Name;

        // Async methods are in types named like "<MethodName>d__##"
        if (declaringType.Contains("<") && declaringType.Contains(">"))
        {
          var start = declaringType.IndexOf('<') + 1;
          var end = declaringType.IndexOf('>');
          return declaringType.Substring(start, end - start);
        }
      }

      // Regular (non-async) method
      return method.Name;
    }

    protected JObject SetupJSON(string loc, string testName, bool jsonResults = false)
    {
      Options_cur ops = new Options_cur();
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

    protected async Task<bool> TestRunSim(JSONRun runParams)
    {
      var logger = NLog.LogManager.GetLogger(debugLogger);
      string res = await runParams.RunSim();  // Add await here
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
