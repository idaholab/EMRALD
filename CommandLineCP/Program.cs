using System;
using Newtonsoft.Json.Linq;
using SimulationEngine;
using System.IO;
using System.Threading;

namespace CommandLineCP
{
  class Program
  {
    static void Main(string[] args)
    {
      Progress progress = new Progress();
      bool execute = false;
      string model = null;
      JSONRun modelRun = new JSONRun("");
      //JObject optionsJ;
      //SimulationDAL.Globals.simID = 1;
      for (int i = 0; i < args.Length; i++) // Loop through array
      {
        string argument = args[i];
        switch (argument)
        {
          case "-help":
          case "-HELP":
          case "-h":
          case "-H":
          case "help":
          case "HELP":
            Console.WriteLine("-n \"run count\"");
            Console.WriteLine("-i \"input model path.\"");
            Console.WriteLine("-r \"results output file, defaults to JSON_Results.json in run directory\"");
            //Console.WriteLine("-o \"paths output file\"");
            Console.WriteLine("-jsonStats \"If specified, writes path statistics to json output file at specified directory\"");
            Console.WriteLine("-t \"max run time\"");
            Console.WriteLine("-m \"parameter to monitor, use []'s to do multiples, example - [x y z] \"");
            Console.WriteLine("-s \"initial random number seed\"");
            Console.WriteLine("-d \"debug level \"basic\" or \"detailed\", (optional) range [start end]. " + Environment.NewLine +
                              "    Basic - state movement only. Detailed - state movement, actions and events. " + Environment.NewLine +
                              "    Example: -d basic [10 20]");
            Console.WriteLine("-JSON_Params \"JSON file path for parameter to run to the model. (also see -JSON_Help)\"");
            Console.WriteLine("-JSON_Help \"Syntax for running from a JSON file for parameters\"");
            break;

          case "-JSON-Help":
            Console.WriteLine("Syntax for running from a JSON file :" + Environment.NewLine +
                              "{" + Environment.NewLine +
                              "  \"runct\": [integer - Total number of runs]," + Environment.NewLine +
                              "  \"inpfile\": \"[string - path to input model]\"," + Environment.NewLine +
                              "  \"resout\": \"[string - path of where to save basic results file]\"," + Environment.NewLine +
                              "  \"jsonRes\": \"[string - path of where to save JSON results file]\"," + Environment.NewLine +
                              "  \"runtime\": \"[string - Days.hours:min:sec 1.02:03:04]\"," + Environment.NewLine +
                              "  \"seed\": [integer - initial random number seed]," + Environment.NewLine +
                              "  \"debug\": \"[string - debug option \"basic\"\"detailed\"\"off\"]\"," + Environment.NewLine +
                              "  \"debugStartIdx\": [integer - debug start run index]," + Environment.NewLine +
                              "  \"debugEndIdx\": [integer - debug end run index]," + Environment.NewLine +
                              "  \"variables\": [ " + Environment.NewLine +
                              "    \"[string - variable watch name if any]\"," + Environment.NewLine +
                              "    \"[string - ...]\"," + Environment.NewLine +
                              "    \"[string - last variable watch name]\"" + Environment.NewLine +
                              "  ] " + Environment.NewLine +
                              "}");
            break;

          case "-n": //run count            
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


          case "-i": //path to input file            
            try
            {
              modelRun.options.inpfile = args[i + 1];
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -i, must be a string.");
            }

            if (!File.Exists(modelRun.options.inpfile))
            {
              Console.Write("invalid input file path - " + modelRun.options.inpfile);
              return;
            }

            ++i;
            break;

          case "-r": //path to output file
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


          case "-jsonStats": //path to paths and timing output file
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

          case "-t": //max run time  
            try
            {
              modelRun.options.runtime = args[i + 1];
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -jsonStats, must be a string.");
            }

            ++i;
            break;

          case "-m": //monitor

            try
            {
              string curA = args[i + 1];
              if (curA[0] == '[')
              {
                curA = curA.TrimStart('[');
                while (curA[curA.Length - 1] != ']')
                {
                  modelRun.options.variables.Add(curA);
                  ++i;
                  curA = args[i + 1];
                }

                curA = curA.TrimEnd(']');
                modelRun.options.variables.Add(curA);
                ++i;
              }
              else
              {
                modelRun.options.variables.Add(curA);
                ++i;
              }
            }
            catch
            {
              Console.Write("invalid data for monitor parameters, must be a single string or multiple encased in \"[]\", example - [x y z] ");
            }
            break;

          case "-s":
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

          case "-d": //debug the runs
            string strLev = args[i + 1];
            modelRun.options.debug = strLev;
            switch (strLev.ToUpper())
            {
              case "BASIC":
                break;

              case "DETAILED":
                break;

              case "OFF":
                break;

              default:
                Console.Write("invalid option for debug must be \"basic\", \"detailed\", or \"off\". ");
                break;
            }
            ++i;

            string arg = args[i + 1];
            if (arg[0] == '[')
            {
              try
              {
                //get the start index
                arg = arg.TrimStart('[');
                if (arg.EndsWith(","))
                  arg = arg.TrimEnd(',');
                modelRun.options.debugStartIdx = int.Parse(arg);
                ++i;

                //get the end index
                arg = args[i + 1];
                if (!arg.EndsWith("]"))
                {
                  Console.Write("invalid option for debug range. Use [startIndex endIndex]");
                  return;
                }
                arg = arg.TrimEnd(']');
                modelRun.options.debugEndIdx = int.Parse(arg);
                ++i;
              }
              catch
              {
                Console.Write("invalid option for debug range. Use [startIndex endIndex]");
              }

              ++i;
            }

            break;




            //case "-x": //path to Extternal Sims TODO
            //  {
            //    if (File.Exists(args[i+1]))
            //    {
            //      extSims.Add(args[i + 1]);
            //    }
            //    else
            //    {
            //      Console.Write("invalid input external sim path - " + args[i + 1]);
            //      return;
            //    }

            //    string model3DPath = args[i + 1]; 
            //    //cbNeutrino.Checked = true;
            //    ++i;
            //    break;
            //  }


        }
      }

      Console.WriteLine(modelRun.options.runct + " runs of - " + modelRun.options.inpfile);

      string res = modelRun.RunSim(progress);

      if (res != "")
      {
        Console.WriteLine(res);
        Console.WriteLine("run -Help for instructions");
        return;
      }

      while(progress.done == false)
      {
        Console.Write("\r{0}% /", progress.percentDone);
        System.Threading.Thread.Sleep(300);
        Console.Write("\r{0}% -", progress.percentDone);
        System.Threading.Thread.Sleep(300);
        Console.Write("\r{0}% \\" , progress.percentDone);
        System.Threading.Thread.Sleep(300);
        Console.Write("\r{0}% |", progress.percentDone);
        System.Threading.Thread.Sleep(300);
        Console.Write("\r{0}% /", progress.percentDone);
        System.Threading.Thread.Sleep(300);
        Console.Write("\r{0}% -", progress.percentDone);
        System.Threading.Thread.Sleep(300);
        Console.Write("\r{0}% \\", progress.percentDone);
        System.Threading.Thread.Sleep(300);
        Console.Write("\r{0}% |", progress.percentDone);
        System.Threading.Thread.Sleep(300);
      }

      
      if (modelRun.error == "")
      {
        Console.Write("\r{0}%", 100);
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
  }

}
