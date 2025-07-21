using System.Collections.Generic;

namespace EMRALD_Sim
{
  public class UISettings
  {
    public LinkedList<ModelSettings> SettingsByModel { get; set; } = new LinkedList<ModelSettings>();

    public class ModelSettings
    {
      public string Filename { get; set; }
      public string RunCount { get; set; } = "1000";
      public string MaxRunTime { get; set; } = "365.00:00:00";
      public string BasicResultsLocation { get; set; } = @"c:\temp\NewSimResults.txt";
      public string PathResultsLocation { get; set; } = @"c:\temp\PathResults.json";
      public string Seed { get; set; } = string.Empty;
      public string DebugLevel { get; set; } = string.Empty;
      public string DebugFromRun { get; set; } = string.Empty;
      public string DebugToRun { get; set; } = string.Empty;
      public List<string> CheckedVars { get; set; } = new List<string>();
    }
  }
}