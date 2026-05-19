import type { EMRALD_Model } from '@/types/EMRALD_Model';
import { v4 as uuid } from 'uuid';
import { beforeEach, describe, expect, test } from 'vitest';
import { appData } from '@/hooks/useAppData';
import { DeleteItemAndRefsInSpecifiedModel } from '@/utils/UpdateModel';

// Builds a fresh model for each test so mutations don't bleed across cases.
function buildModel(): EMRALD_Model {
  return {
    objType: 'EMRALD_Model',
    emraldVersion: 3.2,
    version: 1,
    versionHistory: [],
    DiagramList: [
      {
        id: uuid(),
        objType: 'Diagram',
        name: 'Diag1',
        desc: '',
        diagramType: 'dtSingle',
        diagramLabel: '',
        states: ['StateA', 'StateB', 'StateC'],
      },
    ],
    ExtSimList: [
      { id: uuid(), objType: 'ExtSim', name: 'ExtSim1', resourceName: '' },
    ],
    StateList: [
      {
        id: uuid(),
        objType: 'State',
        name: 'StateA',
        desc: '',
        stateType: 'stStandard',
        diagramName: 'Diag1',
        immediateActions: ['ActA', 'ActB', 'ActC'],
        events: ['Ev1', 'Ev2', 'Ev3'],
        eventActions: [
          { actions: ['ActA'], moveFromCurrent: false },
          { actions: ['ActB', 'ActC'], moveFromCurrent: false },
          { actions: [], moveFromCurrent: false },
        ],
      },
      {
        id: uuid(),
        objType: 'State',
        name: 'StateB',
        desc: '',
        stateType: 'stStandard',
        diagramName: 'Diag1',
        immediateActions: [],
        events: [],
        eventActions: [],
      },
      {
        id: uuid(),
        objType: 'State',
        name: 'StateC',
        desc: '',
        stateType: 'stStandard',
        diagramName: 'Diag1',
        immediateActions: [],
        events: [],
        eventActions: [],
      },
    ],
    ActionList: [
      // Transition action — uses newStates, never codeVariables or scriptCode.
      {
        id: uuid(),
        objType: 'Action',
        name: 'ActA',
        desc: '',
        actType: 'atTransition',
        mainItem: true,
        mutExcl: true,
        newStates: [{ toState: 'StateC', prob: 1, failDesc: '' }],
      },
      // Change-variable-value action — uses scriptCode, variableName (target),
      // and codeVariables (variables referenced by the script).
      {
        id: uuid(),
        objType: 'Action',
        name: 'ActB',
        desc: '',
        actType: 'atCngVarVal',
        mainItem: true,
        scriptCode: 'return Var1 + Var2;',
        variableName: 'Var1',
        codeVariables: ['Var1', 'Var2'],
      },
      // 3D-sim message action — uses sim3DMessage and extSim.
      {
        id: uuid(),
        objType: 'Action',
        name: 'ActC',
        desc: '',
        actType: 'at3DSimMsg',
        mainItem: true,
        sim3DMessage: 'atCompModify',
        extSim: 'ExtSim1',
      },
    ],
    EventList: [
      // State-change event — uses triggerStates. Does not use scripts, so no varNames.
      {
        id: uuid(),
        objType: 'Event',
        name: 'Ev1',
        desc: '',
        evType: 'etStateCng',
        mainItem: true,
        allItems: false,
        ifInState: true,
        triggerStates: ['StateA', 'StateB', 'StateC'],
      },
      // Variable-condition event — script-based, so varNames lists variables used by the script.
      {
        id: uuid(),
        objType: 'Event',
        name: 'Ev2',
        desc: '',
        evType: 'etVarCond',
        mainItem: true,
        code: 'return Var1 > Var2;',
        varNames: ['Var1', 'Var2'],
      },
      // Plain state-change event in the parallel events/eventActions slot.
      {
        id: uuid(),
        objType: 'Event',
        name: 'Ev3',
        desc: '',
        evType: 'etStateCng',
        mainItem: true,
        triggerStates: [],
      },
    ],
    LogicNodeList: [
      {
        id: uuid(),
        objType: 'LogicNode',
        name: 'Top',
        desc: '',
        gateType: 'gtAnd',
        compChildren: [],
        gateChildren: ['LeafA', 'LeafB', 'LeafC'],
        isRoot: true,
      },
      {
        id: uuid(),
        objType: 'LogicNode',
        name: 'LeafA',
        desc: '',
        gateType: 'gtAnd',
        compChildren: [],
        gateChildren: [],
        isRoot: false,
      },
      {
        id: uuid(),
        objType: 'LogicNode',
        name: 'LeafB',
        desc: '',
        gateType: 'gtAnd',
        compChildren: [],
        gateChildren: [],
        isRoot: false,
      },
      {
        id: uuid(),
        objType: 'LogicNode',
        name: 'LeafC',
        desc: '',
        gateType: 'gtAnd',
        compChildren: [],
        gateChildren: [],
        isRoot: false,
      },
    ],
    VariableList: [
      // Accrual variable — accrualStatesData is only valid when varScope is gtAccrual.
      {
        id: uuid(),
        objType: 'Variable',
        name: 'Var1',
        desc: '',
        varScope: 'gtAccrual',
        value: 0,
        type: 'double',
        accrualStatesData: [
          {
            stateName: 'StateA',
            type: 'ctMultiplier',
            accrualMult: 1,
            multRate: 'trHours',
            accrualTable: [],
          },
          {
            stateName: 'StateB',
            type: 'ctMultiplier',
            accrualMult: 1,
            multRate: 'trHours',
            accrualTable: [],
          },
        ],
      },
      // External-sim variable — extSim only applies when varScope is gt3DSim.
      {
        id: uuid(),
        objType: 'Variable',
        name: 'Var2',
        desc: '',
        varScope: 'gt3DSim',
        value: 0,
        type: 'double',
        extSim: 'ExtSim1',
      },
    ],
  };
}

describe('DeleteItemAndRefs — array element references are spliced (not blanked)', () => {
  let model: EMRALD_Model;

  beforeEach(() => {
    model = buildModel();
    // Several branches of DeleteItemAndRefsInSpecifiedModel walk appData.value for the
    // referencing/referenced lookups, so keep it pointed at the test model.
    appData.value = model;
  });

  test('deleting an Action splices it out of state.immediateActions (middle element)', () => {
    const action = model.ActionList.find(a => a.name === 'ActB');
    expect(action).toBeDefined();
    DeleteItemAndRefsInSpecifiedModel(action!, model, false);

    const stateA = model.StateList.find(s => s.name === 'StateA');
    expect(stateA?.immediateActions).toEqual(['ActA', 'ActC']);
  });

  test('deleting an Action splices it out of state.eventActions[*].actions', () => {
    const action = model.ActionList.find(a => a.name === 'ActC');
    DeleteItemAndRefsInSpecifiedModel(action!, model, false);

    const stateA = model.StateList.find(s => s.name === 'StateA');
    expect(stateA?.immediateActions).toEqual(['ActA', 'ActB']);
    expect(stateA?.eventActions[1]?.actions).toEqual(['ActB']);
  });

  test('deleting an Event splices it out of state.events AND drops the parallel eventActions entry', () => {
    const ev = model.EventList.find(e => e.name === 'Ev2');
    DeleteItemAndRefsInSpecifiedModel(ev!, model, false);

    const stateA = model.StateList.find(s => s.name === 'StateA');
    expect(stateA?.events).toEqual(['Ev1', 'Ev3']);
    // The eventActions entry that paired with Ev2 (index 1) must be removed.
    expect(stateA?.eventActions).toHaveLength(2);
    expect(stateA?.eventActions[0]?.actions).toEqual(['ActA']);
    expect(stateA?.eventActions[1]?.actions).toEqual([]);
  });

  test('deleting a State splices it out of diagram.states and event.triggerStates', () => {
    const state = model.StateList.find(s => s.name === 'StateB');
    DeleteItemAndRefsInSpecifiedModel(state!, model, false);

    const diag = model.DiagramList.find(d => d.name === 'Diag1');
    expect(diag?.states).toEqual(['StateA', 'StateC']);

    const ev = model.EventList.find(e => e.name === 'Ev1');
    expect(ev?.triggerStates).toEqual(['StateA', 'StateC']);
  });

  test('deleting a State removes the accrualStatesData entry (object array, not blanked)', () => {
    const state = model.StateList.find(s => s.name === 'StateB');
    DeleteItemAndRefsInSpecifiedModel(state!, model, false);

    const v1 = model.VariableList.find(v => v.name === 'Var1');
    expect(v1?.accrualStatesData).toHaveLength(1);
    expect(v1?.accrualStatesData?.[0]?.stateName).toBe('StateA');
    // The remaining entry must still be a real object, not a stringified blank.
    expect(typeof v1?.accrualStatesData?.[0]).toBe('object');
  });

  test('deleting a Variable splices it from action.codeVariables and event.varNames', () => {
    const v = model.VariableList.find(x => x.name === 'Var1');
    DeleteItemAndRefsInSpecifiedModel(v!, model, false);

    // ActB is an atCngVarVal action — both the target variableName and codeVariables refer to Var1.
    const actB = model.ActionList.find(a => a.name === 'ActB');
    expect(actB?.codeVariables).toEqual(['Var2']);
    expect(actB?.variableName).toBe('');

    // Ev2 is an etVarCond event — varNames lists the variables its script references.
    const ev2 = model.EventList.find(e => e.name === 'Ev2');
    expect(ev2?.varNames).toEqual(['Var2']);
  });

  test('deleting a LogicNode splices it from another gate\'s gateChildren', () => {
    const leaf = model.LogicNodeList.find(n => n.name === 'LeafB');
    DeleteItemAndRefsInSpecifiedModel(leaf!, model, false);

    const top = model.LogicNodeList.find(n => n.name === 'Top');
    expect(top?.gateChildren).toEqual(['LeafA', 'LeafC']);
  });

  test('deleting an ExtSim clears the extSim field (not the host\'s own name)', () => {
    const ext = model.ExtSimList.find(e => e.name === 'ExtSim1');
    DeleteItemAndRefsInSpecifiedModel(ext!, model, false);

    const actC = model.ActionList.find(a => a.name === 'ActC');
    // ActC must still be named ActC; only its extSim reference should be cleared.
    expect(actC).toBeDefined();
    expect(actC?.name).toBe('ActC');
    expect(actC?.extSim).toBe('');

    const v2 = model.VariableList.find(v => v.name === 'Var2');
    expect(v2).toBeDefined();
    expect(v2?.name).toBe('Var2');
    expect(v2?.extSim).toBe('');
  });
});
