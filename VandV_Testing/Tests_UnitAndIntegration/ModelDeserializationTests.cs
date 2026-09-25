// Copyright 2026 Battelle Energy Alliance
// Unit tests for whole-model JSON deserialization compatibility behavior.
using System.IO;
using SimulationDAL;
using Xunit;

namespace UnitAndIntegrationTesting
{
  [Collection("Serial")]
  public class ModelDeserializationTests
  {
    [Fact]
    public void DeserializeJSONUsesFileNameWhenRootNameIsMissing()
    {
      string modelJson = """
      {
        "objType": "EMRALD_Model",
        "desc": "",
        "emraldVersion": 3.3,
        "version": 1,
        "versionHistory": [],
        "DiagramList": [],
        "ExtSimList": [],
        "StateList": [],
        "ActionList": [],
        "EventList": [],
        "LogicNodeList": [],
        "VariableList": []
      }
      """;

      EmraldModel model = new EmraldModel();

      bool deserialized = model.DeserializeJSON(modelJson, Path.GetTempPath(), "LegacyModelWithoutRootName");

      Assert.True(deserialized);
      Assert.Equal("LegacyModelWithoutRootName", model.name);
    }
  }
}