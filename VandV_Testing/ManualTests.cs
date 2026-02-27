using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestPlatform.Utilities;
using SimulationDAL;
using Testing;
using Xunit;

namespace ManualTests
{
  public class ManualTests : TestingBaseClass
  {

    #region Validation Cases Setup Code
    //not used for manual tests
    protected override string CompareFilesDir()
    {
      throw new NotImplementedException();
    }

    protected override string TestFolder()
    {
      throw new NotImplementedException();
    }

    protected override string ModelFolder()
    {
      throw new NotImplementedException();
    }
    #endregion
    //example manual test to copy
    //[Fact]
    //public void TestSomeManualTest()
    //{
    //  //Do any setup here that can be automated

    //  string testDesc = "Instructions for the tester";

    //  // Check the exit code to determine if the user confirmed
    //  Assert.True(ConfirmManualTest(GetCurrentMethodName(), testDesc));
    //}

    [Fact]
    public void TestModelVisualizationSpeed()
    {
      string testDesc = "Verify that the Plant Diagram - \n Test Digram and Logic Tree - CCS_TOP open within 1 sec.";

      // Check the exit code to determine if the user confirmed
      Assert.True(ConfirmManualTest(GetCurrentMethodName(), testDesc));
    }

    [Fact]
    public void TestResultsJSONResultsViewer()
    {
      string dir = MainTestDir() + "/Other/DemoResultPaths.json";
      string jsonRes = File.ReadAllText(dir);
      string tempLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\EMRALD_SANKEY\";
      try
      {
        if (Directory.Exists(tempLoc))
        {
          Directory.Delete(tempLoc, true);
        }
        Directory.CreateDirectory(tempLoc);

        File.WriteAllText(CommonFunctions.NormalizeCombine(tempLoc, @"data.js"), @"window.data=" + jsonRes);
      }
      catch
      {
        File.WriteAllText(CommonFunctions.NormalizeCombine(tempLoc, @"data.js"), @"window.data= ");
      }

      string exeLoc = Directory.GetParent(Assembly.GetExecutingAssembly().Location).FullName;

      File.Copy(CommonFunctions.NormalizeGetFullPath(CommonFunctions.NormalizeCombine(exeLoc, @"./sankey/emrald-sankey-timeline.html")), Path.Combine(tempLoc, @"emrald-sankey-timeline.html"));
      File.Copy(CommonFunctions.NormalizeGetFullPath(CommonFunctions.NormalizeCombine(exeLoc, @"./sankey/emrald-sankey-timeline.js")), Path.Combine(tempLoc, @"emrald-sankey-timeline.js"));

      System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo(Path.Combine(tempLoc, @"emrald-sankey-timeline.html")) { UseShellExecute = true });


      string testDesc = "Did the Path results show up in a reasonable time?";

      // Check the exit code to determine if the user confirmed
      Assert.True(ConfirmManualTest(GetCurrentMethodName(), testDesc));

    }
  }
}
