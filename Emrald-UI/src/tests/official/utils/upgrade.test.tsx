import type { EMRALD_Model } from '@/types/EMRALD_Model';
import type { EMRALD_Model as ModelV2_4 } from '@/utils/Upgrades/v2_4/AllModelInterfacesV2_4';
import { describe, expect, test } from 'vitest';
import { upgradeModel } from '@/utils/Upgrades/upgrade';
import expected from './upgrade.expected.json';

function removeIds(model: EMRALD_Model) {
  for (let i = 0; i < model.ActionList.length; i += 1) {
    delete model.ActionList[i]?.id;
  }
  for (let i = 0; i < model.EventList.length; i += 1) {
    delete model.EventList[i]?.id;
  }
  for (let i = 0; i < model.StateList.length; i += 1) {
    delete model.StateList[i]?.id;
  }
  for (let i = 0; i < model.VariableList.length; i += 1) {
    delete model.VariableList[i]?.id;
  }
  for (let i = 0; i < model.DiagramList.length; i += 1) {
    delete model.DiagramList[i]?.id;
  }
  for (let i = 0; i < model.ExtSimList.length; i += 1) {
    delete model.ExtSimList[i]?.id;
  }
  for (let i = 0; i < model.LogicNodeList.length; i += 1) {
    delete model.LogicNodeList[i]?.id;
  }
  return model;
}

describe('Model Upgrade', () => {
  test('upgrade v1.2', () => {
    const name = 'upgrade v1.2';
    const model = {
      name,
      desc: '',
      DiagramList: [],
      ExtSimList: [],
      StateList: [],
      ActionList: [
        {
          Action: {
            name: 'Action1',
            desc: '',
            actType: 'atCngVarVal',
            mutExcl: 'true',
            simEndtime: 'test',
            required: true,
          },
        },
        {
          Action: {
            name: 'Action2',
            desc: '',
            actType: 'atCngVarVal',
            mainItem: 'true',
          },
        },
      ],
      EventList: [
        {
          Event: {
            name: 'Event1',
            desc: '',
            evType: 'et3dSimEv',
            allItems: 'true',
            onSuccess: 'true',
            Code: '',
            sim3dID: '',
            tempLogicTopList: '',
            tempVariableList: '',
            missionTime: '',
            evtType: '',
            ndMean: '00:00:01',
            ndStdDev: '00:00:01',
            ndMin: '00:00:01',
            ndMax: '00:00:01',
          },
        },
        {
          Event: {
            name: 'Event2',
            desc: '',
            evType: 'et3dSimEv',
            mainItem: 'true',
          },
        },
      ],
      LogicNodeList: [],
      VariableList: [],
    };
    const upgraded = upgradeModel(JSON.stringify(model), 3);
    expect(upgraded).not.toBeNull();
    if (upgraded) {
      expect(removeIds(upgraded)).toEqual(expected[name]);
    }
  });

  test('upgrade v2.4', () => {
    const name = 'upgrade v2.4';
    const model = {
      name,
      desc: '',
      version: 2.3,
      DiagramList: [
        {
          Diagram: {
            name: 'Diagram1',
            desc: '',
            diagramType: 'dtComponent',
            diagramLabel: 'Component',
            states: [],
            required: false,
            diagramLabels: [],
          },
        },
      ],
      ExtSimList: [],
      StateList: [
        {
          State: {
            name: 'State1',
            desc: '',
            stateType: 'stKeyState',
            diagramName: 'Diagram1',
            immediateActions: [],
            events: [],
            eventActions: [],
            geometry: '{x:1,y:2}',
            required: true,
          },
        },
      ],
      ActionList: [
        {
          Action: {
            name: 'Action1',
            desc: '',
            actType: 'atCngVarVal',
            mutExcl: 'true',
          },
        },
      ],
      EventList: [
        {
          Event: {
            name: 'Event1',
            desc: '',
            evType: 'etNormalDist',
            allItems: 'true',
            onSuccess: 'true',
            ifInState: 'true',
            Code: '',
            sim3dID: '',
            missionTime: '',
            evtType: '',
            ndMean: '00:00:01',
            ndStdDev: '00:00:01',
            ndMin: '00:00:01',
            ndMax: '00:00:01',
            evalCurOnInitial: true,
            required: true,
            mean: 1,
            std: 2,
            min: 3,
            max: 4,
          },
        },
      ],
      LogicNodeList: [],
      VariableList: [
        {
          Variable: {
            name: 'Variable1',
            varScope: 'gtGlobal',
            value: 1,
            type: 'int',
            required: true,
          },
        },
      ],
    };
    const upgraded = upgradeModel(JSON.stringify(model), 3);
    expect(upgraded).not.toBeNull();
    if (upgraded) {
      expect(removeIds(upgraded)).toEqual(expected[name]);
    }
  });

  test('upgrade v3.0', () => {
    const name = 'upgrade v3.0';
    const model: ModelV2_4 = {
      version: 2.4,
      name,
      desc: '',
      DiagramList: [
        {
          Diagram: {
            name: 'Diagram1',
            desc: '',
            diagramType: 'dtComponent',
            diagramLabel: 'Component',
            states: [],
          },
        },
      ],
      ExtSimList: [
        {
          ExtSim: {
            name: 'ExtSim1',
            resourceName: '',
          },
        },
      ],
      StateList: [
        {
          State: {
            name: 'State1',
            desc: '',
            stateType: 'stKeyState',
            diagramName: 'Diagram1',
            immediateActions: [],
            events: [],
            eventActions: [],
            geometry: '{x:1,y:2}',
          },
        },
      ],
      EventList: [
        {
          Event: {
            name: 'Event1',
            desc: '',
            evType: 'et3dSimEv',
            mainItem: true,
            ifInState: 'true',
          },
        },
      ],
      VariableList: [
        {
          Variable: {
            name: 'Variable1',
            varScope: 'gtGlobal',
            value: 1,
            type: 'int',
            regExpLine: '1',
            begPosition: '1',
            accrualStatesData: [
              {
                stateName: 'State1',
                type: 'ctMultiplier',
                accrualMult: 1,
                multRate: '1',
                accrualTable: [[1, 2]],
                $$hashKey: {
                  key: 'value',
                },
              },
            ],
          },
        },
      ],
      ActionList: [
        {
          Action: {
            name: 'Action1',
            desc: '',
            actType: 'atCngVarVal',
          },
        },
      ],
      LogicNodeList: [
        {
          LogicNode: {
            name: 'LogicNode1',
            desc: '',
            gateType: 'gtAnd',
            gateChildren: [],
            compChildren: [],
            isRoot: true,
          },
        },
      ],
    };
    const upgraded = upgradeModel(JSON.stringify(model), 3);
    expect(upgraded).not.toBeNull();
    if (upgraded) {
      expect(removeIds(upgraded)).toEqual(expected[name]);
    }
  });
  test('upgrade v3.2 removes legacy state geometry', () => {
    const model = {
      objType: 'EMRALD_Model',
      name: 'upgrade v3.2 removes legacy state geometry',
      desc: '',
      emraldVersion: 3.2,
      version: 1,
      versionHistory: [],
      DiagramList: [],
      ExtSimList: [],
      StateList: [
        {
          objType: 'State',
          name: 'State1',
          desc: '',
          stateType: 'stStandard',
          diagramName: 'Diagram1',
          immediateActions: [],
          events: [],
          eventActions: [],
          geometry: '{ x: 20, y: 90, width: 200, height: 130 }',
          geometryInfo: { x: 20, y: 90, width: 200, height: 130 },
        },
      ],
      ActionList: [],
      EventList: [],
      LogicNodeList: [],
      VariableList: [],
      templates: [
        {
          objType: 'EMRALD_Model',
          name: 'template with legacy geometry',
          desc: '',
          emraldVersion: 3.2,
          version: 1,
          versionHistory: [],
          DiagramList: [],
          ExtSimList: [],
          StateList: [
            {
              objType: 'State',
              name: 'TemplateState1',
              desc: '',
              stateType: 'stStandard',
              diagramName: 'Diagram1',
              immediateActions: [],
              events: [],
              eventActions: [],
              geometry: '{ x: 1, y: 2 }',
              geometryInfo: { x: 1, y: 2 },
            },
          ],
          ActionList: [],
          EventList: [],
          LogicNodeList: [],
          VariableList: [],
        },
      ],
    };

    const upgraded = upgradeModel(JSON.stringify(model), 3.3);

    expect(upgraded).not.toBeNull();
    if (upgraded) {
      expect(upgraded.emraldVersion).toBe(3.3);
      expect(upgraded.StateList[0]).toHaveProperty('geometryInfo');
      expect(upgraded.StateList[0]).not.toHaveProperty('geometry');
      expect(upgraded.templates?.[0]?.StateList[0]).toHaveProperty('geometryInfo');
      expect(upgraded.templates?.[0]?.StateList[0]).not.toHaveProperty('geometry');
    }
  });
  test('upgrade v3.2 removes legacy logic rootName', () => {
    const model = {
      objType: 'EMRALD_Model',
      name: 'upgrade v3.2 removes legacy logic rootName',
      desc: '',
      emraldVersion: 3.2,
      version: 1,
      versionHistory: [],
      DiagramList: [],
      ExtSimList: [],
      StateList: [],
      ActionList: [],
      EventList: [],
      LogicNodeList: [
        {
          objType: 'LogicNode',
          name: 'RootLogic',
          desc: '',
          gateType: 'gtAnd',
          compChildren: [],
          gateChildren: [],
          rootName: 'RootLogic',
        },
        {
          objType: 'LogicNode',
          name: 'ChildLogic',
          desc: '',
          gateType: 'gtOr',
          compChildren: [],
          gateChildren: [],
          isRoot: false,
          rootName: 'RootLogic',
        },
        {
          objType: 'LogicNode',
          name: 'ExistingRootLogic',
          desc: '',
          gateType: 'gtOr',
          compChildren: [],
          gateChildren: [],
          isRoot: true,
          rootName: 'OtherRoot',
        },
      ],
      VariableList: [],
      templates: [
        {
          objType: 'EMRALD_Model',
          name: 'template with legacy rootName',
          desc: '',
          emraldVersion: 3.2,
          version: 1,
          versionHistory: [],
          DiagramList: [],
          ExtSimList: [],
          StateList: [],
          ActionList: [],
          EventList: [],
          LogicNodeList: [
            {
              objType: 'LogicNode',
              name: 'TemplateRoot',
              desc: '',
              gateType: 'gtAnd',
              compChildren: [],
              gateChildren: [],
              isRoot: false,
              rootName: 'TemplateRoot',
            },
          ],
          VariableList: [],
        },
      ],
    };

    const upgraded = upgradeModel(JSON.stringify(model), 3.3);

    expect(upgraded).not.toBeNull();
    if (upgraded) {
      expect(upgraded.LogicNodeList[0]).not.toHaveProperty('rootName');
      expect(upgraded.LogicNodeList[0]?.isRoot).toBe(true);
      expect(upgraded.LogicNodeList[1]).not.toHaveProperty('rootName');
      expect(upgraded.LogicNodeList[1]?.isRoot).toBe(false);
      expect(upgraded.LogicNodeList[2]).not.toHaveProperty('rootName');
      expect(upgraded.LogicNodeList[2]?.isRoot).toBe(true);
      expect(upgraded.templates?.[0]?.LogicNodeList[0]).not.toHaveProperty('rootName');
      expect(upgraded.templates?.[0]?.LogicNodeList[0]?.isRoot).toBe(true);
    }
  });
});
