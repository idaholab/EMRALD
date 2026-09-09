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
    /// Build a model with one single state diagram per entry in vals, named Comp0, Comp1 and so
    /// on, each sitting in the state that gives it that entry value. The N of M tests need several
    /// children whose values can be set independently.
    /// </summary>
    private EmraldModel MakeMultiModel(EnChildVal[] vals, out MyBitArray curStates,
                                       out string[] compNames)
    {
      EmraldModel model = new EmraldModel();
      compNames = new string[vals.Length];
      List<State> current = new List<State>();
      int maxID = 0;

      for (int i = 0; i < vals.Length; ++i)
      {
        string compName = "Comp" + i.ToString();
        compNames[i] = compName;

        EvalDiagram comp = new EvalDiagram(compName);
        // dfltStateValue: 1 = true, 0 = false, -1 = unknown/ignore
        State trueState = new State(compName + "_True", EnStateType.stStandard, comp, 1);
        State falseState = new State(compName + "_False", EnStateType.stStandard, comp, 0);
        State ignoreState = new State(compName + "_Ignore", EnStateType.stStart, comp, -1);
        comp.AddState(trueState);
        comp.AddState(falseState);
        comp.AddState(ignoreState);

        model.allDiagrams.Add(comp);
        model.allStates.Add(trueState);
        model.allStates.Add(falseState);
        model.allStates.Add(ignoreState);

        current.Add(vals[i] switch
        {
          EnChildVal.cvTrue => trueState,
          EnChildVal.cvFalse => falseState,
          _ => ignoreState,
        });

        maxID = Math.Max(maxID, ignoreState.id);
      }

      // Size the array past the largest state id so every id is addressable.
      curStates = new MyBitArray(maxID + 2);
      foreach (State s in current)
      {
        curStates[s.id] = true;
      }

      return model;
    }

    /// <summary>
    /// Add a gate to the model. _compChildren has no public setter, so the component child
    /// is attached the same way the engine does it, through JSON deserialization.
    /// </summary>
    private LogicNode AddGate(EmraldModel model, string name, EnGateType gateType,
                              bool useComp, List<string> gateChildren = null,
                              object[] stateValues = null, int val1 = 0,
                              string[] compNames = null)
    {
      // Default to the single "Comp" diagram MakeModel builds. The N of M tests pass the several
      // diagram names MakeMultiModel builds instead. stateValues only applies to the first one.
      string[] comps = useComp ? (compNames ?? new string[] { "Comp" }) : new string[0];
      var compChildren = new object[comps.Length];
      for (int i = 0; i < comps.Length; ++i)
      {
        compChildren[i] = new
        {
          diagramName = comps[i],
          stateValues = (i == 0 ? stateValues : null) ?? new object[0],
        };
      }

      var json = new
      {
        id = name,
        name = name,
        desc = "",
        gateType = gateType.ToString(),
        val1 = val1,
        isRoot = gateChildren != null,
        rootName = name,
        compChildren = compChildren,
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

    [Fact]
    [Description("Test that an N of M gate is true when at least N of its children are true.")]
    public void NofMGateEvaluateTest()
    {
      // 2 of 3 with all three true is more than enough.
      SetupTheTest();
      EmraldModel model = MakeMultiModel(
        new[] { EnChildVal.cvTrue, EnChildVal.cvTrue, EnChildVal.cvTrue },
        out MyBitArray curStates, out string[] comps);
      LogicNode gate = AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 2, comps);
      Assert.Equal(1, gate.Evaluate(curStates, true));

      // One true out of three does not reach 2 of 3.
      SetupTheTest();
      model = MakeMultiModel(new[] { EnChildVal.cvTrue, EnChildVal.cvFalse, EnChildVal.cvFalse },
                             out curStates, out comps);
      gate = AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 2, comps);
      Assert.Equal(0, gate.Evaluate(curStates, true));

      // No child true is false.
      SetupTheTest();
      model = MakeMultiModel(new[] { EnChildVal.cvFalse, EnChildVal.cvFalse, EnChildVal.cvFalse },
                             out curStates, out comps);
      gate = AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 2, comps);
      Assert.Equal(0, gate.Evaluate(curStates, true));
    }

    [Fact]
    [Description("Test that an N of M gate is true when exactly N children are true, the off by one that made it require N plus one.")]
    public void NofMGateExactCountTest()
    {
      // Exactly 2 of 3 true. This is the case the greater than comparison got wrong, it needed 3.
      SetupTheTest();
      EmraldModel model = MakeMultiModel(
        new[] { EnChildVal.cvTrue, EnChildVal.cvTrue, EnChildVal.cvFalse },
        out MyBitArray curStates, out string[] comps);
      LogicNode gate = AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 2, comps);
      Assert.Equal(1, gate.Evaluate(curStates, true));

      // 1 of 2 with one true, an N of M standing in for an OR.
      SetupTheTest();
      model = MakeMultiModel(new[] { EnChildVal.cvTrue, EnChildVal.cvFalse }, out curStates, out comps);
      gate = AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 1, comps);
      Assert.Equal(1, gate.Evaluate(curStates, true));

      // 2 of 2 with both true, an N of M standing in for an AND.
      SetupTheTest();
      model = MakeMultiModel(new[] { EnChildVal.cvTrue, EnChildVal.cvTrue }, out curStates, out comps);
      gate = AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 2, comps);
      Assert.Equal(1, gate.Evaluate(curStates, true));
    }

    [Fact]
    [Description("Test that an ignored child is left out of the N of M count rather than counting as true or false.")]
    public void NofMGateUnknownChildTest()
    {
      // Two true and one ignored satisfies 2 of 3, the ignored child is simply not counted.
      SetupTheTest();
      EmraldModel model = MakeMultiModel(
        new[] { EnChildVal.cvTrue, EnChildVal.cvTrue, EnChildVal.cvUnknown },
        out MyBitArray curStates, out string[] comps);
      LogicNode gate = AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 2, comps);
      Assert.Equal(1, gate.Evaluate(curStates, true));

      // One true, one ignored and one false does not reach 2, an ignored child does not count
      // toward N. Leaving it out makes the gate harder to satisfy, the same as it is for an OR.
      SetupTheTest();
      model = MakeMultiModel(new[] { EnChildVal.cvTrue, EnChildVal.cvUnknown, EnChildVal.cvFalse },
                             out curStates, out comps);
      gate = AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 2, comps);
      Assert.Equal(0, gate.Evaluate(curStates, true));

      // Every child ignored leaves the gate unknown rather than counting zero against N.
      SetupTheTest();
      model = MakeMultiModel(new[] { EnChildVal.cvUnknown, EnChildVal.cvUnknown },
                             out curStates, out comps);
      gate = AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 1, comps);
      Assert.Equal(-1, gate.Evaluate(curStates, true));
    }

    [Fact]
    [Description("Test that an N of M gate with an N that cannot be used is rejected when the model is loaded.")]
    public void NofMGateVal1ValidationTest()
    {
      // An N of 0 would make the gate true whenever any child evaluated, so loading must fail.
      // Models written before val1 existed have no value for it and land here.
      SetupTheTest();
      EmraldModel model = MakeMultiModel(new[] { EnChildVal.cvTrue, EnChildVal.cvFalse },
                                         out MyBitArray curStates, out string[] comps);
      Assert.Throws<Exception>(() => { AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 0, comps); });

      // An N above the number of children could never be true, so loading must fail as well.
      SetupTheTest();
      model = MakeMultiModel(new[] { EnChildVal.cvTrue, EnChildVal.cvFalse }, out curStates, out comps);
      Assert.Throws<Exception>(() => { AddGate(model, "NofM", EnGateType.gtNofM, true, null, null, 3, comps); });

      // The other gate types do not use val1, so a 0 must not be rejected for them.
      SetupTheTest();
      model = MakeMultiModel(new[] { EnChildVal.cvTrue, EnChildVal.cvFalse }, out curStates, out comps);
      LogicNode orGate = AddGate(model, "Or", EnGateType.gtOr, true, null, null, 0, comps);
      Assert.Equal(1, orGate.Evaluate(curStates, true));
    }
  }
}
