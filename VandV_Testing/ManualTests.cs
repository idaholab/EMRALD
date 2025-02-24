using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Testing;

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


    [Fact]
    public void TestWithConsoleInput()
    {
      string testDesc = "ManualTestTest";

      // Check the exit code to determine if the user confirmed
      Assert.True(ConfirmManualTest(GetCurrentMethodName(), testDesc));

    }
  }
}
