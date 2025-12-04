using System;
using System.IO;
using System.Threading;
using Matrix.Xmpp.PubSub;
using MessageDefLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NLog;
using SimulationDAL;
using SimulationEngine;

namespace CommandLineCP
{
  public class ConsoleMessageOutput : IMessageDispHandling
  {
    private readonly object _consoleLock = new object();
    private bool _clearOnMsg = false; // equivalent to chkClearOnMsg.Checked

    // Optional: allow configuration
    public bool ClearOnMessage
    {
      get { return _clearOnMsg; }
      set { _clearOnMsg = value; }
    }

    public void IncomingEMRALDMsg(string sender, TMsgWrapper msg)
    {
      lock (_consoleLock)
      {
        if (_clearOnMsg)
        {
          Console.Clear();
        }

        Console.WriteLine("From : " + sender);
        Console.WriteLine("JSON String:");
        Console.WriteLine(JsonConvert.SerializeObject(msg, Formatting.Indented));
        Console.WriteLine();
      }
    }

    public void IncomingOtherMsg(string sender, string msg)
    {
      lock (_consoleLock)
      {
        Console.WriteLine("Unidentified Message");
        Console.WriteLine("From : " + sender);
        Console.WriteLine("Raw String:");
        Console.WriteLine(msg);
        Console.WriteLine();
      }
    }

    public void OnConnectCng()
    {
      lock (_consoleLock)
      {
        Console.WriteLine("Connection status changed");
        Console.WriteLine();
        // In console, we can't maintain a list UI, but we could optionally
        // request and display resources if needed
      }
    }

    public void Clear()
    {
      if (_clearOnMsg)
      {
        Console.Clear();
      }
    }
  }

  class Program
  {
    static int[] threadRunCnt; // runs each thread has done
    static int numRuns = 0; // total runs to do
    static bool done = false;
    static int numThreads = 1; // number of threads being used
    static object lockObj = new object(); // for thread-safe console updates

    static void Main(string[] args)
    {
      bool execute = false;
      string model = null;
      JSONRun modelRun = new JSONRun("", "", DispResults);

      // Check if first argument is a JSON file
      if (args.Length > 0)
      {
        string firstArg = args[0];
        bool isJSON = false;
        try
        {
          isJSON = Path.GetExtension(firstArg).Equals(".json", StringComparison.OrdinalIgnoreCase);
        }
        catch { }

        if (isJSON)
        {
          if (!File.Exists(firstArg))
          {
            Console.WriteLine("Invalid path for JSON options file: " + firstArg);
            return;
          }

          string optionsJsonStr = File.ReadAllText(firstArg);
          JSONRun simRun = new JSONRun(optionsJsonStr);
          if (simRun.error != "")
          {
            Console.Write(simRun.error);
          }
          else
          {
            string jsonResult = simRun.RunSim();
            if (jsonResult != "")
            {
              Console.WriteLine(jsonResult);
              Console.WriteLine("run -Help for instructions");
              return;
            }
          }         

          // Initialize thread tracking from JSON options
          numRuns = modelRun.options.runct;
          numThreads = modelRun.options.threads.HasValue && modelRun.options.threads.Value > 0
                       ? modelRun.options.threads.Value
                       : 1;
          threadRunCnt = new int[numThreads];

          for (int i = 0; i < numThreads; i++)
          {
            threadRunCnt[i] = 0;
          }

          if (modelRun.options.threads > 0)
          {
            Console.WriteLine("Using " + modelRun.options.threads + " threads.");
          }

          Console.WriteLine(modelRun.options.runct + " runs of - " + modelRun.options.inpfile);

          // Wait for completion
          while (!done)
          {
            System.Threading.Thread.Sleep(300);
          }

          if (modelRun.error == "")
          {
            Console.Write("\r{0}%   ", 100);
            Console.WriteLine("");
          }
          else
          {
            Console.WriteLine("");
            Console.WriteLine(modelRun.error);
            Console.WriteLine("run -Help for instructions");
            return;
          }

          Console.WriteLine("done");
          return;
        }
      }

      // Process command-line arguments
      for (int i = 0; i < args.Length; i++)
      {
        string argument = args[i].ToLower();
        switch (argument)
        {
          case "-help":
          case "-h":
          case "-H":
          case "-HELP":
            Console.WriteLine("Pass in a Options JSON file or use the following command line options.");
            Console.WriteLine("-n \"run count\"");
            Console.WriteLine("-i \"input model path\"");
            Console.WriteLine("-r \"results output file\"");
            Console.WriteLine("-o \"paths output file\"");
            Console.WriteLine("-jsonStats \"write path statistics to json output file at specified directory\"");
            Console.WriteLine("-t \"max run time\"");
            Console.WriteLine("-e \"execute\"");
            Console.WriteLine("-m \"parameter to monitor, use []'s to do multiples, example - [x y z] \"");
            Console.WriteLine("-s \"initial random number seed\"");
            Console.WriteLine("-threads \"number of threads to use for parallel execution\"");
            Console.WriteLine("-d \"debug level \"basic\" or \"detailed\", (optional) range [start end]. " + Environment.NewLine +
                              "    Basic - state movement only. Detailed - state movement, actions and events. " + Environment.NewLine +
                              "    Example: -d basic [10 20]");
            Console.WriteLine("-rIntrv \"how often to save the path results, every X number of runs. No value or <1 will result in saving only after all runs are complete.\"");
            Console.WriteLine("Options JSON file - ");
            Console.WriteLine(Options_cur.CmdJSON_OptionsExample);
            Environment.Exit(0);
            break;

          case "-json-help":
            Console.WriteLine("Syntax for running from a JSON file :" + Environment.NewLine +
                              "{" + Environment.NewLine +
                              "  \"runct\": [integer - Total number of runs]," + Environment.NewLine +
                              "  \"inpfile\": \"[string - path to input model]\"," + Environment.NewLine +
                              "  \"resout\": \"[string - path of where to save basic results file]\"," + Environment.NewLine +
                              "  \"jsonRes\": \"[string - path of where to save JSON results file]\"," + Environment.NewLine +
                              "  \"runtime\": \"[string - Days.hours:min:sec 1.02:03:04]\"," + Environment.NewLine +
                              "  \"seed\": [integer - initial random number seed]," + Environment.NewLine +
                              "  \"threads\": [integer - number of threads to use]," + Environment.NewLine +
                              "  \"debug\": \"[string - debug option \"basic\"\"detailed\"\"off\"]\"," + Environment.NewLine +
                              "  \"debugStartIdx\": [integer - debug start run index]," + Environment.NewLine +
                              "  \"debugEndIdx\": [integer - debug end run index]," + Environment.NewLine +
                              "  \"pathResultsInterval\": [integer - how often to save path results]," + Environment.NewLine +
                              "  \"variables\": [ " + Environment.NewLine +
                              "    \"[string - variable watch name if any]\"," + Environment.NewLine +
                              "    \"[string - ...]\"," + Environment.NewLine +
                              "    \"[string - last variable watch name]\"" + Environment.NewLine +
                              "  ] " + Environment.NewLine +
                              "}");
            Environment.Exit(0);
            break;

          case "-n": // run count            
            try
            {
              modelRun.options.runct = Int32.Parse(args[i + 1]);
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -n, must be an integer.");
            }
            ++i;
            break;

          case "-i": // path to input file            
            try
            {
              string filePath = args[i + 1];
              if (!File.Exists(filePath))
              {
                Console.Write("invalid input file path - " + filePath);
                return;
              }
              else
              {
                modelRun.options.inpfile = filePath;
                model = filePath;
              }
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -i, must be a string.");
            }
            ++i;
            break;

          case "-r": // path to output file
            try
            {
              modelRun.options.resout = args[i + 1];
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -r, must be a string.");
            }
            ++i;
            break;

          case "-o": // path to paths and timing output file (alternate to -jsonStats)
            try
            {
              modelRun.options.jsonRes = args[i + 1];
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -o, must be a string.");
            }
            ++i;
            break;

          case "-jsonstats": // path to paths and timing output file
            try
            {
              modelRun.options.jsonRes = args[i + 1];
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -jsonStats, must be a string.");
            }
            ++i;
            break;

          case "-t": // max run time  
            try
            {
              modelRun.options.runtime = args[i + 1];
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -t, must be a string.");
            }
            ++i;
            break;

          case "-e": // execute
            execute = true;
            break;

          case "-threads": // number of threads
            try
            {
              modelRun.options.threads = Int32.Parse(args[i + 1]);
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -threads, must be an integer.");
            }
            ++i;
            break;

          case "-rintrv": // results interval
            try
            {
              modelRun.options.pathResultsInterval = int.Parse(args[i + 1]);
            }
            catch
            {
              Console.WriteLine("-rIntrv option must be a valid integer number");
            }
            ++i;
            break;

          case "-m": // monitor
            try
            {
              string arg = args[i + 1];
              if (arg[0] == '[')
              {
                arg = arg.TrimStart('[');
                while (arg[arg.Length - 1] != ']')
                {
                  modelRun.options.variables.Add(arg);
                  ++i;
                  arg = args[i + 1];
                }
                arg = arg.TrimEnd(']');
                modelRun.options.variables.Add(arg);
                ++i;
              }
              else
              {
                modelRun.options.variables.Add(arg);
                ++i;
              }
            }
            catch
            {
              Console.Write("invalid data for monitor parameters, must be a single string or multiple encased in \"[]\", example - [x y z] ");
            }
            break;

          case "-s": // seed
            try
            {
              modelRun.options.seed = Int32.Parse(args[i + 1]);
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -s, must be an integer.");
            }
            ++i;
            break;

          case "-d": // debug the runs
            string strLev = args[i + 1];
            modelRun.options.debug = strLev;
            switch (strLev.ToLower())
            {
              case "basic":
                ConfigData.debugLev = LogLevel.Info;
                break;
              case "detailed":
                ConfigData.debugLev = LogLevel.Debug;
                break;
              case "off":
                ConfigData.debugLev = LogLevel.Off;
                break;
              default:
                Console.Write("invalid option for debug must be \"basic\", \"detailed\", or \"off\". ");
                break;
            }
            ++i;

            if (i + 1 < args.Length)
            {
              string arg = args[i + 1];
              if (arg[0] == '[')
              {
                try
                {
                  // get the start index
                  arg = arg.TrimStart('[');
                  if (arg.EndsWith(","))
                    arg = arg.TrimEnd(',');
                  modelRun.options.debugStartIdx = int.Parse(arg);
                  ConfigData.debugRunStart = modelRun.options.debugStartIdx;
                  ++i;

                  // get the end index
                  arg = args[i + 1];
                  if (!arg.EndsWith("]"))
                  {
                    Console.Write("invalid option for debug range. Use [startIndex endIndex]");
                    return;
                  }
                  arg = arg.TrimEnd(']');
                  modelRun.options.debugEndIdx = int.Parse(arg);
                  ConfigData.debugRunEnd = modelRun.options.debugEndIdx;
                  ++i;
                }
                catch
                {
                  Console.Write("invalid option for debug range. Use [startIndex endIndex]");
                }
              }
            }
            break;
        }
      }

      // Initialize thread tracking
      numRuns = modelRun.options.runct;
      numThreads = modelRun.options.threads.HasValue && modelRun.options.threads.Value > 0
                   ? modelRun.options.threads.Value
                   : 1;
      threadRunCnt = new int[numThreads];

      // Initialize all thread counts to 0
      for (int i = 0; i < numThreads; i++)
      {
        threadRunCnt[i] = 0;
      }

      if (modelRun.options.threads > 0)
      {
        Console.WriteLine("Using " + modelRun.options.threads + " threads.");
      }

      Console.WriteLine(modelRun.options.runct + " runs of - " + modelRun.options.inpfile);

      string res = modelRun.RunSim();

      if (res != "")
      {
        Console.WriteLine(res);
        Console.WriteLine("run -Help for instructions");
        return;
      }

      while (!done)
      {
        System.Threading.Thread.Sleep(300);
      }

      if (modelRun.error == "")
      {
        Console.Write("\r{0}%   ", 100);
        Console.WriteLine("");
      }
      else
      {
        Console.WriteLine("");
        Console.WriteLine(modelRun.error);
        Console.WriteLine("run -Help for instructions");
        return;
      }

      Console.WriteLine("done");
    }

    public static void DispResults(TimeSpan runTime, int runCnt, bool logFailedComps, int? threadNum)
    {
      lock (lockObj)
      {
        // Assign the runs done for this thread
        int tNum = threadNum ?? 0; // Use 0 if threadNum is null
        if (tNum < threadRunCnt.Length)
        {
          threadRunCnt[tNum] = runCnt;
        }

        // Sum all the runs from each thread
        int totDoneRuns = 0;
        for (int i = 0; i < threadRunCnt.Length; i++)
        {
          totDoneRuns += threadRunCnt[i];
        }

        // Calculate percentage
        double percentComplete = numRuns > 0 ? (totDoneRuns * 100.0 / numRuns) : 0;

        // Rewrite console line with progress
        Console.Write("\rProgress: {0:F1}% ({1}/{2} runs) - Runtime: {3:hh\\:mm\\:ss}   ",
                      percentComplete, totDoneRuns, numRuns, runTime);

        // Check if all runs are complete
        if (totDoneRuns >= numRuns)
        {
          done = true;
        }
      }
    }
  }
}