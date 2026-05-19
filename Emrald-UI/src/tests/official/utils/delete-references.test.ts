import type { EMRALD_Model } from '@/types/EMRALD_Model';
import { v4 as uuid } from 'uuid';
import { beforeEach, describe, expect, test } from 'vitest';
import { appData } from '@/hooks/useAppData';
import {
  type ClearedRef,
  ClearIncomingRefsExceptTypes,
  DeleteItemAndRefs,
  DeleteItemAndRefsInSpecifiedModel,
  formatClearedRefsMessage,
} from '@/utils/UpdateModel';

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
      // Component-logic event — logicTop references the LogicNode tree-top 'Top'.
      {
        id: uuid(),
        objType: 'Event',
        name: 'Ev4',
        desc: '',
        evType: 'etComponentLogic',
        mainItem: true,
        logicTop: 'Top',
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

  test('deleting a LogicNode via the core path also clears event.logicTop on etComponentLogic events', () => {
    const top = model.LogicNodeList.find(n => n.name === 'Top');
    DeleteItemAndRefsInSpecifiedModel(top!, model, false);

    const ev4 = model.EventList.find(e => e.name === 'Ev4');
    expect(ev4).toBeDefined();
    expect(ev4?.evType).toBe('etComponentLogic');
    expect(ev4?.logicTop).toBe('');
  });
});

describe('ClearIncomingRefsExceptTypes — selective cleanup for custom-recursive deletes', () => {
  let model: EMRALD_Model;

  beforeEach(() => {
    model = buildModel();
    appData.value = model;
  });

  test('clears event.logicTop but leaves gateChildren intact when LogicNode is skipped', () => {
    const top = model.LogicNodeList.find(n => n.name === 'Top');
    const { model: updated, clearedRefs } = ClearIncomingRefsExceptTypes(
      top!,
      ['LogicNode'],
      model,
      false,
    );

    // event.logicTop got cleared.
    const ev4 = updated.EventList.find(e => e.name === 'Ev4');
    expect(ev4?.logicTop).toBe('');

    // The LogicNode → LogicNode gateChildren row was skipped — 'Top' wasn't in any
    // other gate's gateChildren in this fixture, but the explicit guarantee is that
    // the helper didn't touch any LogicNode-targeting reference paths. Verify the
    // node itself is still in the list and other LogicNode arrays are untouched.
    expect(updated.LogicNodeList.find(n => n.name === 'Top')).toBeDefined();
    const leafGateChildren = updated.LogicNodeList.find(
      n => n.name === 'Top',
    )?.gateChildren;
    expect(leafGateChildren).toEqual(['LeafA', 'LeafB', 'LeafC']);

    // Reports the broken event so the caller can surface it to the user.
    expect(clearedRefs).toHaveLength(1);
    expect(clearedRefs[0]).toMatchObject({
      itemName: 'Ev4',
      itemType: 'Event',
      fieldPath: 'logicTop',
    });
    expect(clearedRefs[0]?.itemId).toBeTruthy();
  });

  test('reports every cleared scalar reference (one entry per affected item)', () => {
    // Add a second etComponentLogic event pointing at the same tree-top so we get two
    // scalar clears in one pass.
    model.EventList.push({
      id: 'ev5-id',
      objType: 'Event',
      name: 'Ev5',
      desc: '',
      evType: 'etComponentLogic',
      mainItem: true,
      logicTop: 'Top',
    });

    const top = model.LogicNodeList.find(n => n.name === 'Top');
    const { clearedRefs } = ClearIncomingRefsExceptTypes(
      top!,
      ['LogicNode'],
      model,
      false,
    );

    const reportedNames = clearedRefs
      .filter(r => r.itemType === 'Event' && r.fieldPath === 'logicTop')
      .map(r => r.itemName)
      .toSorted();
    expect(reportedNames).toEqual(['Ev4', 'Ev5']);
  });
});

describe('DeleteItemAndRefs clearedRefs accumulator — broken-reference reporting', () => {
  let model: EMRALD_Model;

  beforeEach(() => {
    model = buildModel();
    appData.value = model;
  });

  test('reports scalar clears on Event when deleting a Variable referenced by .variable / .variableName', () => {
    // Add an event whose .variable points at Var1 so the scalar-clear path fires.
    model.EventList.push({
      id: 'ev-var-id',
      objType: 'Event',
      name: 'EvVar',
      desc: '',
      evType: 'et3dSimEv',
      mainItem: true,
      variable: 'Var1',
    });

    const clearedRefs: ClearedRef[] = [];
    const v = model.VariableList.find(x => x.name === 'Var1');
    DeleteItemAndRefsInSpecifiedModel(v!, model, false, clearedRefs);

    // ActB.variableName (scalar) -> should be reported
    expect(
      clearedRefs.some(
        r =>
          r.itemType === 'Action'
          && r.itemName === 'ActB'
          && r.fieldPath === 'variableName',
      ),
    ).toBe(true);

    // EvVar.variable (scalar) -> should be reported
    expect(
      clearedRefs.some(
        r =>
          r.itemType === 'Event'
          && r.itemName === 'EvVar'
          && r.fieldPath === 'variable',
      ),
    ).toBe(true);

    // codeVariables / varNames are array splices — no scalar clear, no report.
    expect(
      clearedRefs.some(r => r.fieldPath === 'codeVariables' || r.fieldPath === 'varNames'),
    ).toBe(false);
  });

  test('cascade-deleted items are pruned from the final clearedRefs (DeleteItemAndRefs wrapper)', () => {
    // Wire a setup where deleting a State scalar-clears a field on an item, and that
    // same item then gets cascade-deleted in a later step. The final list must NOT
    // include the cascade-deleted item.
    //
    // Setup: StateB will be deleted. StateB.events references an Event "EvOnlyB" which
    // also has triggerStates ['StateB']. The Event is not a mainItem and is only used
    // by StateB, so the cascade decides to delete it. Before the cascade, the State
    // delete clears EvOnlyB.triggerStates (array splice, NOT reported anyway) — but
    // we want to verify that if a scalar clear hits something that later gets deleted,
    // it doesn't end up in the final report.
    //
    // To exercise pruning of a scalar clear: give Action ActA a newState pointing at
    // StateB. The toState scalar gets cleared by the State delete. ActA is NOT
    // cascade-deleted (it's a mainItem and referenced by StateA.immediateActions),
    // so the entry SHOULD survive.
    //
    // Then add a non-mainItem Action used only by an event of StateB that ALSO has
    // a newState.toState pointing at StateB — that action will be cascade-deleted,
    // so its scalar-clear entry must be pruned.
    const stateB = model.StateList.find(s => s.name === 'StateB');

    // ActA (mainItem) — survives. Give it a newState to StateB so toState clears.
    const actA = model.ActionList.find(a => a.name === 'ActA');
    actA!.newStates = [
      ...(actA!.newStates ?? []),
      { toState: 'StateB', prob: 0.5, failDesc: '' },
    ];

    // ActDoomed — not mainItem, only referenced by an event of StateB → cascade-deleted.
    const evOnlyB = {
      id: 'ev-onlyb-id',
      objType: 'Event' as const,
      name: 'EvOnlyB',
      desc: '',
      evType: 'etStateCng' as const,
      mainItem: false,
      triggerStates: ['StateB'],
    };
    model.EventList.push(evOnlyB);

    const actDoomed = {
      id: 'act-doomed-id',
      objType: 'Action' as const,
      name: 'ActDoomed',
      desc: '',
      actType: 'atTransition' as const,
      mainItem: false,
      newStates: [{ toState: 'StateB', prob: 1, failDesc: '' }],
    };
    model.ActionList.push(actDoomed);

    // Hook ActDoomed and EvOnlyB into StateB so the cascade decides to delete them.
    stateB!.events = ['EvOnlyB'];
    stateB!.eventActions = [{ actions: ['ActDoomed'], moveFromCurrent: false }];

    const clearedRefs: ClearedRef[] = [];
    // Use DeleteItemAndRefs so pruning runs at the outer wrapper.
    DeleteItemAndRefs(stateB!, clearedRefs);

    // ActA survives → its toState clear is reported.
    expect(
      clearedRefs.some(
        r =>
          r.itemType === 'Action'
          && r.itemName === 'ActA'
          && r.fieldPath === 'toState',
      ),
    ).toBe(true);

    // ActDoomed was cascade-deleted → its toState clear must be pruned.
    expect(clearedRefs.some(r => r.itemName === 'ActDoomed')).toBe(false);
  });

  test('formatClearedRefsMessage returns null for an empty list and otherwise lists each item', () => {
    expect(formatClearedRefsMessage('Action', 'ActA', [])).toBeNull();

    const refs: ClearedRef[] = [
      {
        itemId: 'id-1',
        itemName: 'Ev4',
        itemType: 'Event',
        fieldPath: 'logicTop',
      },
      {
        itemId: 'id-2',
        itemName: 'ActA',
        itemType: 'Action',
        fieldPath: 'variableName',
      },
    ];
    const msg = formatClearedRefsMessage('LogicNode', 'Top', refs);
    expect(msg).toContain('Deleted LogicNode "Top"');
    expect(msg).toContain('Event "Ev4" (logicTop)');
    expect(msg).toContain('Action "ActA" (variableName)');
  });
});
