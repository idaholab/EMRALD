import type { EMRALD_Model } from '@/types/EMRALD_Model';
import { v4 as uuid } from 'uuid';
import { describe, expect, test } from 'vitest';
import {
  allMainItemTypes,
  GetModelItemsReferencing,
} from '@/utils/ModelReferences';

const model: EMRALD_Model = {
  objType: 'EMRALD_Model',
  emraldVersion: 3.2,
  version: 1,
  versionHistory: [],
  DiagramList: [
    {
      name: 'TestDiagram',
      objType: 'Diagram',
      desc: '',
      diagramType: 'dtSingle',
      diagramLabel: '',
      states: ['State1'],
      id: uuid(),
    },
  ],
  ExtSimList: [
    {
      name: 'ExtSim1',
      objType: 'ExtSim',
      resourceName: '',
      id: uuid(),
    },
  ],
  StateList: [
    {
      name: 'State1',
      objType: 'State',
      desc: '',
      stateType: 'stStandard',
      diagramName: 'TestDiagram',
      immediateActions: ['Action1'],
      events: ['Event1'],
      eventActions: [],
      id: uuid(),
    },
    {
      name: 'State2',
      objType: 'State',
      desc: '',
      stateType: 'stStandard',
      diagramName: 'OtherDiagram',
      immediateActions: [],
      events: ['Event1'],
      eventActions: [{ actions: ['Action1'], moveFromCurrent: true }],
      id: uuid(),
    },
  ],
  ActionList: [
    {
      objType: 'Action',
      name: 'Action1',
      desc: '',
      actType: 'at3DSimMsg',
      mainItem: false,
      id: uuid(),
      newStates: [
        { toState: 'State1', prob: 1, failDesc: '', varProb: 'Var1' },
      ],
    },
    {
      objType: 'Action',
      name: 'Action2',
      desc: '',
      actType: 'at3DSimMsg',
      mainItem: false,
      id: uuid(),
      variableName: 'Var1',
      extSim: 'ExtSim1',
    },
    {
      objType: 'Action',
      name: 'Action3',
      desc: '',
      actType: 'at3DSimMsg',
      mainItem: false,
      id: uuid(),
      codeVariables: ['Var1'],
    },
  ],
  EventList: [
    {
      objType: 'Event',
      name: 'Event1',
      desc: '',
      evType: 'etStateCng',
      mainItem: false,
      id: uuid(),
      triggerStates: ['State1'],
      varNames: ['Var1'],
    },
    {
      objType: 'Event',
      name: 'Event2',
      desc: '',
      evType: 'etStateCng',
      mainItem: false,
      id: uuid(),
      variable: 'Var1',
      logicTop: 'LogicNode1',
    },
    {
      objType: 'Event',
      name: 'Event3',
      desc: '',
      evType: 'etStateCng',
      mainItem: false,
      id: uuid(),
      parameters: [
        {
          variable: 'Var1',
        },
      ],
    },
    {
      objType: 'Event',
      name: 'Event4',
      desc: '',
      evType: 'etStateCng',
      mainItem: false,
      id: uuid(),
    },
  ],
  LogicNodeList: [
    {
      objType: 'LogicNode',
      name: 'LogicNode1',
      desc: '',
      gateType: 'gtAnd',
      compChildren: [
        {
          diagramName: 'TestDiagram',
          stateValues: [{ stateName: 'State1', stateValue: 'Ignore' }],
        },
      ],
      gateChildren: [],
      isRoot: false,
      id: uuid(),
    },
    {
      objType: 'LogicNode',
      name: 'LogicNode2',
      desc: '',
      gateType: 'gtAnd',
      compChildren: [],
      gateChildren: ['LogicNode1'],
      isRoot: true,
      id: uuid(),
    },
  ],
  VariableList: [
    {
      objType: 'Variable',
      name: 'Var1',
      desc: '',
      varScope: 'gt3DSim',
      value: 0,
      type: 'int',
      id: uuid(),
      accrualStatesData: [
        {
          stateName: 'State1',
          type: 'ctMultiplier',
          accrualMult: 0,
          multRate: '',
          accrualTable: [],
        },
      ],
      extSim: 'ExtSim1',
    },
  ],
};

describe('Model References', () => {
  test('get items referencing diagram', () => {
    const refs = GetModelItemsReferencing(
      'TestDiagram',
      'Diagram',
      1,
      undefined,
      allMainItemTypes,
      model,
    );
    expect(refs.StateList.length).toBe(1);
    expect(refs.StateList[0]?.name).toBe('State1');
    expect(refs.LogicNodeList.length).toBe(1);
    expect(refs.LogicNodeList[0]?.name).toBe('LogicNode1');
  });

  test('get items referencing state', () => {
    const refs = GetModelItemsReferencing(
      'State1',
      'State',
      2,
      undefined,
      allMainItemTypes,
      model,
    );
    expect(refs.DiagramList.length).toBe(1);
    expect(refs.DiagramList[0]?.name).toBe('TestDiagram');
    expect(refs.ActionList.length).toBe(3);
    expect(refs.ActionList[0]?.name).toBe('Action1');
    expect(refs.EventList.length).toBe(3);
    expect(refs.EventList[0]?.name).toBe('Event1');
    expect(refs.LogicNodeList.length).toBe(2);
    expect(refs.LogicNodeList[0]?.name).toBe('LogicNode1');
    expect(refs.VariableList.length).toBe(1);
    expect(refs.VariableList[0]?.name).toBe('Var1');
  });

  test('get items referencing event', () => {
    const refs = GetModelItemsReferencing(
      'Event1',
      'Event',
      -1,
      undefined,
      allMainItemTypes,
      model,
    );
    expect(refs.StateList.length).toBe(2);
    expect(refs.StateList[0]?.name).toBe('State1');
    expect(refs.StateList[1]?.name).toBe('State2');
  });

  test('get items referencing action', () => {
    const refs = GetModelItemsReferencing(
      'Action1',
      'Action',
      -1,
      undefined,
      allMainItemTypes,
      model,
    );
    expect(refs.StateList.length).toBe(2);
    expect(refs.StateList[0]?.name).toBe('State1');
    expect(refs.StateList[1]?.name).toBe('State2');
  });

  test('get items referencing variable', () => {
    const refs = GetModelItemsReferencing(
      'Var1',
      'Variable',
      -1,
      undefined,
      allMainItemTypes,
      model,
    );
    expect(refs.ActionList.length).toBe(3);
    expect(refs.ActionList[0]?.name).toBe('Action1');
    expect(refs.ActionList[1]?.name).toBe('Action2');
    expect(refs.ActionList[2]?.name).toBe('Action3');
    expect(refs.EventList.length).toBe(3);
    expect(refs.EventList[0]?.name).toBe('Event1');
    expect(refs.EventList[1]?.name).toBe('Event2');
    expect(refs.EventList[2]?.name).toBe('Event3');
  });

  test('get items referencing ext sim', () => {
    const refs = GetModelItemsReferencing(
      'ExtSim1',
      'ExtSim',
      1,
      undefined,
      allMainItemTypes,
      model,
    );
    expect(refs.ActionList.length).toBe(1);
    expect(refs.ActionList[0]?.name).toBe('Action2');
    expect(refs.VariableList.length).toBe(1);
    expect(refs.VariableList[0]?.name).toBe('Var1');
  });

  test('get items referencing logic node', () => {
    const refs = GetModelItemsReferencing(
      'LogicNode1',
      'LogicNode',
      -1,
      undefined,
      allMainItemTypes,
      model,
    );
    expect(refs.EventList.length).toBe(1);
    expect(refs.EventList[0]?.name).toBe('Event2');
    expect(refs.LogicNodeList.length).toBe(1);
    expect(refs.LogicNodeList[0]?.name).toBe('LogicNode2');
  });
});
