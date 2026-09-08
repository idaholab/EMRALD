// Copyright 2026 Battelle Energy Alliance
// Unit tests for logic gate evaluation, verifying each gate type returns the correct
// true/false/unknown value directly from LogicNode.Evaluate.

using System;
using System.Collections.Generic;
using SimulationDAL;
using Xunit;
using System.IO;
using Newtonsoft.Json;
using MyStuff.Collections;
using Testing;

namespace UnitAndIntegrationTesting
{
  // Do not run multiple test classes in parallel, as it can cause some tests to fail: https://tsuyoshiushio.medium.com/controlling-the-serial-and-parallel-test-on-xunit-6174326da196
  [Collection("Serial")]
  // Build a minimal logic tree in memory and evaluate it directly, so gate math is
  // tested without depending on a full simulation run reaching the gate.
  public class LogicGate_Testing : TestingBaseClass
  {
    #region Setup Code

    protected override string CompareFilesDir()
    {
      return MainTestDir() + "CompareFiles" + Path.AltDirectorySeparatorChar;
    }

    protected override string ModelFolder()
    {
      return "UnitTestItems" + Path.AltDirectorySeparatorChar;
    }

    protected override string TestFolder()
    {
      throw new NotImplementedException();
    }

    private void SetupTheTest()
    {
      // Reset IDs so tests do not fail when run together
      SingleNextIDs.Instance.ResetAllIDs();
      SingleRandom.Reset(0);
      ConfigData.seed = 0;
    }

    #endregion

    /// <summary>
    /// The three states of the single "Comp" diagram used by every test below. The name
    /// says what the state value evaluates to, not whether it is a failure.
    /// </summary>
    private enum EnChildVal { cvTrue, cvFalse, cvUnknown };

    /// <summary>
    /// Build a model with one single state diagram "Comp" holding a true, a false and an
    /// ignored state, then hand back the bit array marking which one is current.
    /// </summary>
    private EmraldModel MakeModel(EnChildVal childVal, out MyBitArray curStates)
    {
      EmraldModel model = new EmraldModel();

      EvalDiagram comp = new EvalDiagram("Comp");
      // dfltStateValue: 1 = true, 0 = false, -1 = unknown/ignore
      State trueState = new State("Comp_True", EnStateType.stStandard, comp, 1);
      State falseState = new State("Comp_False", EnStateType.stStandard, comp, 0);
      State ignoreState = new State("Comp_Ignore", EnStateType.stStart, comp, -1);
      comp.AddState(trueState);
      comp.AddState(falseState);
      comp.AddState(ignoreState);

      model.allDiagrams.Add(comp);
      model.allStates.Add(trueState);
      model.allStates.Add(falseState);
      model.allStates.Add(ignoreState);

      State curState = childVal switch
      {
        EnChildVal.cvTrue => trueState,
        EnChildVal.cvFalse => falseState,
        _ => ignoreState,
      };

      // Size the array past the largest state id so every id is addressable.
      curStates = new MyBitArray(ignoreState.id + 2);
      curStates[curState.id] = true;

      return model;
    }

    /// <summary>
    /// Add a gate to the model. _compChildren has no public setter, so the component child
    /// is attached the same way the engine does it, through JSON deserialization.
    /// </summary>
    private LogicNode AddGate(EmraldModel model, string name, EnGateType gateType,
                              bool useComp, List<string> gateChildren = null,
                              object[] stateValues = null)
    {
      var json = new
      {
        id = name,
        name = name,
        desc = "",
        gateType = gateType.ToString(),
        isRoot = gateChildren != null,
        rootName = name,
        compChildren = useComp
          ? new object[] { new { diagramName = "Comp", stateValues = stateValues ?? new object[0] } }
          : new object[0],
        gateChildren = (object)(gateChildren ?? new List<string>()),
      };

      dynamic jsonObj = JsonConvert.DeserializeObject(JsonConvert.SerializeObject(json));
      LogicNode gate = new LogicNode();
      Assert.True(gate.DeserializeDerived(jsonObj, false, model, false));
      Assert.True(gate.LoadObjLinks(jsonObj, false, model));
      return gate;
    }

    [Fact]
    [Description("Test that a NOT gate inverts the value of its single child component.")]
    public void NotGateEvaluateTest()
    {
      SetupTheTest();

      // A true child must make the NOT gate false.
      EmraldModel model = MakeModel(EnChildVal.cvTrue, out MyBitArray curStates);
      LogicNode notGate = AddGate(model, "Not", EnGateType.gtNot, true);
      Assert.Equal(0, notGate.Evaluate(curStates, true));

      // A false child must make the NOT gate true.
      SetupTheTest();
      model = MakeModel(EnChildVal.cvFalse, out curStates);
      notGate = AddGate(model, "Not", EnGateType.gtNot, true);
      Assert.Equal(1, notGate.Evaluate(curStates, true));

      // An ignored child leaves the NOT gate unknown, it must not invert to a value.
      SetupTheTest();
      model = MakeModel(EnChildVal.cvUnknown, out curStates);
      notGate = AddGate(model, "Not", EnGateType.gtNot, true);
      Assert.Equal(-1, notGate.Evaluate(curStates, true));
    }

    [Fact]
    [Description("Test that a NOT gate does not behave like an OR gate, the regression that made NOT a pass through.")]
    public void NotGateIsNotPassThroughTest()
    {
      // Same child, same tree shape, only the gate type differs. A NOT that passed its
      // child through would return the same value as the OR and this would fail.
      SetupTheTest();
      EmraldModel notModel = MakeModel(EnChildVal.cvTrue, out MyBitArray notStates);
      LogicNode notGate = AddGate(notModel, "Not", EnGateType.gtNot, true);
      int notResult = notGate.Evaluate(notStates, true);

      SetupTheTest();
      EmraldModel orModel = MakeModel(EnChildVal.cvTrue, out MyBitArray orStates);
      LogicNode orGate = AddGate(orModel, "Or", EnGateType.gtOr, true);
      int orResult = orGate.Evaluate(orStates, true);

      Assert.Equal(1, orResult);
      Assert.NotEqual(orResult, notResult);
    }

    [Fact]
    [Description("Test that a NOT gate nested under an AND gate contributes its inverted value.")]
    public void NotGateUnderAndEvaluateTest()
    {
      // AND(NOT(true)) is false. The AND short circuits on the NOT returning 0.
      SetupTheTest();
      EmraldModel model = MakeModel(EnChildVal.cvTrue, out MyBitArray curStates);
      AddGate(model, "Not", EnGateType.gtNot, true);
      LogicNode andTop = AddGate(model, "AndTop", EnGateType.gtAnd, false, new List<string> { "Not" });
      Assert.Equal(0, andTop.Evaluate(curStates, true));

      // AND(NOT(false)) is true.
      SetupTheTest();
      model = MakeModel(EnChildVal.cvFalse, out curStates);
      AddGate(model, "Not", EnGateType.gtNot, true);
      andTop = AddGate(model, "AndTop", EnGateType.gtAnd, false, new List<string> { "Not" });
      Assert.Equal(1, andTop.Evaluate(curStates, true));

      // AND(NOT(ignore)) stays unknown.
      SetupTheTest();
      model = MakeModel(EnChildVal.cvUnknown, out curStates);
      AddGate(model, "Not", EnGateType.gtNot, true);
      andTop = AddGate(model, "AndTop", EnGateType.gtAnd, false, new List<string> { "Not" });
      Assert.Equal(-1, andTop.Evaluate(curStates, true));
    }

    /// <summary>
    /// Build one stateValues override entry as it appears in the model JSON.
    /// stateValue matches the StateEvalValue schema enum: True, False or Ignore.
    /// </summary>
    private object Override(string stateName, string stateValue)
    {
      return new { stateName = stateName, stateValue = stateValue };
    }

    [Fact]
    [Description("Test that a stateValues override on the current state replaces that states default evaluation value.")]
    public void StateValueOverrideTest()
    {
      // Simulation is in Comp_True, whose default value is 1. Overriding it to False
      // must make the gate evaluate 0 instead of 1.
      SetupTheTest();
      EmraldModel model = MakeModel(EnChildVal.cvTrue, out MyBitArray curStates);
      LogicNode gate = AddGate(model, "Or", EnGateType.gtOr, true, null,
                               new object[] { Override("Comp_True", "False") });
      Assert.Equal(0, gate.Evaluate(curStates, true));

      // Same shape the other way round: in Comp_False, default 0, overridden to True.
      SetupTheTest();
      model = MakeModel(EnChildVal.cvFalse, out curStates);
      gate = AddGate(model, "Or", EnGateType.gtOr, true, null,
                     new object[] { Override("Comp_False", "True") });
      Assert.Equal(1, gate.Evaluate(curStates, true));

      // Overriding the ignored start state gives it a real value instead of unknown.
      SetupTheTest();
      model = MakeModel(EnChildVal.cvUnknown, out curStates);
      gate = AddGate(model, "Or", EnGateType.gtOr, true, null,
                     new object[] { Override("Comp_Ignore", "True") });
      Assert.Equal(1, gate.Evaluate(curStates, true));
    }

    [Fact]
    [Description("Test that a stateValues override on a state the simulation is not in does not change the evaluation.")]
    public void StateValueOverrideOtherStateTest()
    {
      // In Comp_True (default 1) but the override targets Comp_False, so it must not apply.
      SetupTheTest();
      EmraldModel model = MakeModel(EnChildVal.cvTrue, out MyBitArray curStates);
      LogicNode gate = AddGate(model, "Or", EnGateType.gtOr, true, null,
                               new object[] { Override("Comp_False", "False") });
      Assert.Equal(1, gate.Evaluate(curStates, true));

      // An override list covering several states must still only apply the current one.
      SetupTheTest();
      model = MakeModel(EnChildVal.cvFalse, out curStates);
      gate = AddGate(model, "Or", EnGateType.gtOr, true, null,
                     new object[] { Override("Comp_True", "False"), Override("Comp_False", "True") });
      Assert.Equal(1, gate.Evaluate(curStates, true));
    }

    [Fact]
    [Description("Test that a stateValues override of Ignore removes the current state from the logic calculation.")]
    public void StateValueOverrideIgnoreTest()
    {
      // Comp_True defaults to 1, but overriding it to Ignore must drop it from the
      // calculation, leaving the single child gate unknown rather than true or false.
      SetupTheTest();
      EmraldModel model = MakeModel(EnChildVal.cvTrue, out MyBitArray curStates);
      LogicNode gate = AddGate(model, "Or", EnGateType.gtOr, true, null,
                               new object[] { Override("Comp_True", "Ignore") });
      Assert.Equal(-1, gate.Evaluate(curStates, true));
    }

    [Fact]
    [Description("Test that a stateValues override is applied before the onFailure inversion, not instead of it.")]
    public void StateValueOverrideOnFailureTest()
    {
      // Evaluating for failure inverts the value. In Comp_True overridden to False the
      // override gives 0, which the failure inversion then turns into 1.
      SetupTheTest();
      EmraldModel model = MakeModel(EnChildVal.cvTrue, out MyBitArray curStates);
      LogicNode gate = AddGate(model, "Or", EnGateType.gtOr, true, null,
                               new object[] { Override("Comp_True", "False") });
      Assert.Equal(1, gate.Evaluate(curStates, false));

      // An ignored value has nothing to invert and stays unknown.
      SetupTheTest();
      model = MakeModel(EnChildVal.cvTrue, out curStates);
      gate = AddGate(model, "Or", EnGateType.gtOr, true, null,
                     new object[] { Override("Comp_True", "Ignore") });
      Assert.Equal(-1, gate.Evaluate(curStates, false));
    }

    [Fact]
    [Description("Test that a stateValues override feeding a NOT gate is inverted by that gate.")]
    public void StateValueOverrideUnderNotTest()
    {
      // Comp_True defaults to 1, overridden to False gives 0, and the NOT inverts it to 1.
      // Guards both the override plumbing and the gate math in one place.
      SetupTheTest();
      EmraldModel model = MakeModel(EnChildVal.cvTrue, out MyBitArray curStates);
      LogicNode notGate = AddGate(model, "Not", EnGateType.gtNot, true, null,
                                  new object[] { Override("Comp_True", "False") });
      Assert.Equal(1, notGate.Evaluate(curStates, true));
    }

    [Fact]
    [Description("Test that AND and OR gates evaluate a single child correctly, the baseline the NOT gate is compared against.")]
    public void AndOrGateEvaluateTest()
    {
      SetupTheTest();
      EmraldModel model = MakeModel(EnChildVal.cvTrue, out MyBitArray curStates);
      LogicNode andGate = AddGate(model, "And", EnGateType.gtAnd, true);
      Assert.Equal(1, andGate.Evaluate(curStates, true));

      SetupTheTest();
      model = MakeModel(EnChildVal.cvFalse, out curStates);
      andGate = AddGate(model, "And", EnGateType.gtAnd, true);
      Assert.Equal(0, andGate.Evaluate(curStates, true));

      SetupTheTest();
      model = MakeModel(EnChildVal.cvFalse, out curStates);
      LogicNode orGate = AddGate(model, "Or", EnGateType.gtOr, true);
      Assert.Equal(0, orGate.Evaluate(curStates, true));
    }
  }
}
