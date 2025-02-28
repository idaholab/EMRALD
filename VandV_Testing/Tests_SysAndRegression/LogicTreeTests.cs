using Newtonsoft.Json.Linq;
using SimulationEngine;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Testing;

namespace SysAndRegressionTesting
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  public class LogicTreeTests : TestingBaseClass
  {
    #region Validation Cases Setup Code
    protected override string CompareFilesDir()
    {
      return MainTestDir() + "CompareFiles" + Path.DirectorySeparatorChar;
    }

    protected override string TestFolder()
    {
      return "EMRALDTests" + Path.DirectorySeparatorChar;
    }

    protected override string ModelFolder()
    {
      return "Models" + Path.DirectorySeparatorChar;
    }
    #endregion

    //TODO add other actiontests.
  }
}