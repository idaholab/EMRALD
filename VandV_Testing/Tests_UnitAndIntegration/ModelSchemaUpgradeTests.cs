// Copyright 2026 Battelle Energy Alliance
// Validates checked-in model fixtures against the current EMRALD UI schema after SimulationDAL upgrade.
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using SimulationDAL;
using Xunit;

namespace UnitAndIntegrationTesting
{
  [Collection("Serial")]
  public class ModelSchemaUpgradeTests
  {
    private static readonly ISet<string> ExcludedModelFiles = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
      "DllValueTest.json"
    };

    private static readonly ISet<string> ExpectedValidationFailureModelFiles = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
      "Event_1TransitionInOutTest.json"
    };

    private static readonly Lazy<JSchema> CurrentUiSchema = new Lazy<JSchema>(() =>
      JSchema.Parse(File.ReadAllText(GetCurrentUiSchemaPath())));

    public static IEnumerable<object[]> ModelFiles()
    {
      string modelsDir = Path.Combine(FindRepoRoot(), "VandV_Testing", "TestingFiles", "Models");

      return Directory
        .EnumerateFiles(modelsDir, "*", SearchOption.TopDirectoryOnly)
        .Where(path => !ExcludedModelFiles.Contains(Path.GetFileName(path)))
        .OrderBy(path => Path.GetFileName(path), StringComparer.OrdinalIgnoreCase)
        .Select(path => new object[] { path });
    }

    [Theory]
    [MemberData(nameof(ModelFiles))]
    public void Testing_model_upgrades_and_validates_against_current_ui_schema(string modelPath)
    {
      string originalJson = File.ReadAllText(modelPath);
      string upgradedJson = new EmraldModel().UpdateModel(originalJson);

      Assert.False(
        string.IsNullOrWhiteSpace(upgradedJson),
        $"Upgrade produced empty JSON for {modelPath}");

      JObject upgradedModel = JObject.Parse(upgradedJson);
      Assert.Equal(EmraldModel.SCHEMA_VERSION, upgradedModel.Value<double>("emraldVersion"));

      bool valid = upgradedModel.IsValid(CurrentUiSchema.Value, out IList<ValidationError> errors);
      string modelFileName = Path.GetFileName(modelPath);

      if (ExpectedValidationFailureModelFiles.Contains(modelFileName))
      {
        Assert.False(
          valid,
          $"{modelPath} is listed as an expected schema validation failure, but it validated successfully. Remove it from {nameof(ExpectedValidationFailureModelFiles)} if that is now correct.");

        return;
      }

      Assert.True(
        valid,
        $"{modelPath} failed current UI schema validation:{Environment.NewLine}{FormatErrors(errors)}");
    }

    private static string FormatErrors(IEnumerable<ValidationError> errors)
    {
      List<string> lines = new List<string>();

      foreach (ValidationError error in errors)
        AddValidationError(lines, error, 0);

      return string.Join(Environment.NewLine, lines);
    }

    private static void AddValidationError(ICollection<string> lines, ValidationError error, int depth)
    {
      string indent = new string(' ', depth * 2);
      string path = string.IsNullOrEmpty(error.Path) ? "<root>" : error.Path;
      lines.Add($"{indent}{path}: {error.Message}");

      foreach (ValidationError childError in error.ChildErrors)
        AddValidationError(lines, childError, depth + 1);
    }

    private static string GetCurrentUiSchemaPath()
    {
      string repoRoot = FindRepoRoot();
      string modelTypesPath = Path.Combine(repoRoot, "Emrald-UI", "src", "types", "EMRALD_Model.ts");
      string modelTypes = File.ReadAllText(modelTypesPath);

      Match match = Regex.Match(
        modelTypes,
        @"export\s+\{\s*default\s+as\s+EMRALD_JsonSchema\s*\}\s+from\s+['""](?<path>[^'""]+)['""]");

      Assert.True(
        match.Success,
        $"Could not find EMRALD_JsonSchema export in {modelTypesPath}");

      string modelTypesDir = Path.GetDirectoryName(modelTypesPath);
      string schemaRelativePath = match.Groups["path"].Value.Replace('/', Path.DirectorySeparatorChar);
      string schemaPath = Path.GetFullPath(Path.Combine(modelTypesDir, schemaRelativePath));

      Assert.True(File.Exists(schemaPath), $"Current UI schema file not found: {schemaPath}");

      return schemaPath;
    }

    private static string FindRepoRoot()
    {
      DirectoryInfo dir = new DirectoryInfo(AppContext.BaseDirectory);

      while (dir != null)
      {
        bool hasVandV = File.Exists(Path.Combine(dir.FullName, "VandV_Testing", "Testing.csproj"));
        bool hasUiSchemaExport = File.Exists(Path.Combine(dir.FullName, "Emrald-UI", "src", "types", "EMRALD_Model.ts"));

        if (hasVandV && hasUiSchemaExport)
          return dir.FullName;

        dir = dir.Parent;
      }

      throw new DirectoryNotFoundException("Could not find repository root.");
    }
  }
}
