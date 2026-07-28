import type { EMRALD_Model } from '@/types/EMRALD_Model';
import { describe, expect, test } from 'vitest';
import { EMRALD_SchemaVersion } from '@/types/ModelUtils';
import { repairModelReferences } from '@/utils/ModelRepair';
import { validateModel } from '@/utils/Upgrades/upgrade';

function buildModel(): EMRALD_Model {
  return {
    objType: 'EMRALD_Model',
    emraldVersion: EMRALD_SchemaVersion,
    version: 1,
    versionHistory: [],
    DiagramList: [
      {
        id: 'diagram-id',
        objType: 'Diagram',
        name: 'Diag1',
        desc: '',
        diagramType: 'dtSingle',
        diagramLabel: 'Component',
        states: ['', '', 'OK-U1', 'MissingState', 'OK-U1'],
      },
    ],
    ExtSimList: [],
    StateList: [
      {
        id: 'state-id',
        objType: 'State',
        name: 'OK-U1',
        desc: '',
        stateType: 'stStandard',
        diagramName: '',
        immediateActions: ['', 'ActA', 'MissingAction', 'ActA'],
        events: ['Ev1', 'MissingEvent', 'Ev2'],
        eventActions: [
          { actions: ['ActA', 'MissingAction'], moveFromCurrent: false },
          { actions: ['ActA'], moveFromCurrent: true },
        ],
      },
    ],
    ActionList: [
      {
        id: 'action-id',
        objType: 'Action',
        name: 'ActA',
        desc: '',
        actType: 'atTransition',
        mainItem: true,
        newStates: [
          { toState: 'OK-U1', prob: 1, failDesc: '', varProb: null },
          { toState: 'MissingState', prob: 0, failDesc: '', varProb: null },
        ],
      },
    ],
    EventList: [
      {
        id: 'event-1-id',
        objType: 'Event',
        name: 'Ev1',
        desc: '',
        mainItem: true,
        evType: 'etStateCng',
        triggerStates: ['OK-U1', '', 'MissingState'],
      },
      {
        id: 'event-2-id',
        objType: 'Event',
        name: 'Ev2',
        desc: '',
        mainItem: true,
        evType: 'etTimer',
      },
    ],
    LogicNodeList: [],
    VariableList: [],
  };
}

describe('repairModelReferences', () => {
  test('removes unnamed items before repairing references', () => {
    const model = buildModel();
    model.DiagramList[0]!.name = '';
    model.ActionList[0]!.name = '';

    const repaired = repairModelReferences(model);
    const state = repaired.StateList[0];

    expect(repaired.DiagramList).toEqual([]);
    expect(repaired.ActionList).toEqual([]);
    expect(state?.diagramName).toBe('');
    expect(state?.immediateActions).toEqual([]);
    expect(state?.eventActions[0]?.actions).toEqual([]);
  });

  test('repairs stale diagram state references for named diagrams', () => {
    const repaired = repairModelReferences(buildModel());
    const diagram = repaired.DiagramList[0];
    const state = repaired.StateList[0];

    expect(diagram?.name).toBe('Diag1');
    expect(diagram?.states).toEqual(['OK-U1']);
    expect(state?.diagramName).toBe('Diag1');
  });

  test('splices invalid parallel event/eventActions entries', () => {
    const repaired = repairModelReferences(buildModel());
    const state = repaired.StateList[0];

    expect(state?.immediateActions).toEqual(['ActA']);
    expect(state?.events).toEqual(['Ev1', 'Ev2']);
    expect(state?.eventActions).toEqual([
      { actions: ['ActA'], moveFromCurrent: false },
      { actions: [], moveFromCurrent: false },
    ]);
  });

  test('removes invalid downstream state references', () => {
    const repaired = repairModelReferences(buildModel());
    const action = repaired.ActionList[0];
    const event = repaired.EventList[0];

    expect(action?.newStates).toEqual([
      { toState: 'OK-U1', prob: 1, failDesc: '', varProb: null },
    ]);
    expect(event?.triggerStates).toEqual(['OK-U1']);
  });
});

describe('validateModel semantic checks', () => {
  test('reports empty item names that the schema permits as strings', () => {
    const model = buildModel();
    model.DiagramList[0]!.name = '';
    model.StateList[0]!.name = '';

    const result = validateModel(model);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'DiagramList[0].name: Diagram name must not be empty.',
    );
    expect(result.errors).toContain(
      'StateList[0].name: State name must not be empty.',
    );
  });
});
