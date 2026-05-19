// Copyright 2026 Battelle Energy Alliance
// Shared command-line help text for EMRALD_Sim and CommandLineCP entry points.
using System;

namespace SimulationEngine
{
  public static class CmdLineHelp
  {
    public static void PrintIntro()
    {
      Console.WriteLine("Pass in a Options JSON file or use the following command line options.");
    }

    public static void PrintCommonOptions()
    {
      Console.WriteLine("-h, -help \"show this help\"");
      Console.WriteLine("-n \"run count\"");
      Console.WriteLine("-i \"input model path\"");
      Console.WriteLine("-r \"basic/text results output file\"");
      Console.WriteLine("-o \"JSON path-results output file\"");
      Console.WriteLine("-threads \"number of threads to use for parallel execution\"");
      Console.WriteLine("-t \"max run time\"");
      Console.WriteLine("-e \"execute\"");
      Console.WriteLine("-m \"parameter to monitor, use []'s to do multiples, example - [x y z] \"");
      Console.WriteLine("-s \"initial random number seed\"");
      Console.WriteLine("-d \"debug level \"basic\" or \"detailed\", (optional) range [start end].");
      Console.WriteLine("    Basic - state movement only. Detailed - state movement, actions and events.");
      Console.WriteLine("    Example: -d basic [10 20]");
      Console.WriteLine("-rIntrv \"how often to save the path results, every X number of runs. No value or <1 will result in saving only after all runs are complete.\"");
    }

    public static void PrintMergeResults()
    {
      Console.WriteLine("-mergeResults \"merge two json path result files into one. Estimates the 5th and 95th. Example: -mergeResults c:/temp/PathResultsBatch1.json c:/temp/PathResultsBatch2.json c:/temp/PathResultsCombined.json\"");
    }

    public static void PrintJsonHelpFlag()
    {
      Console.WriteLine("-json-help \"print the JSON options file syntax and exit\"");
    }

    public static void PrintJsonExample()
    {
      Console.WriteLine("Options JSON file - ");
      Console.WriteLine(Options_cur.CmdJSON_OptionsExample);
    }
  }
}
