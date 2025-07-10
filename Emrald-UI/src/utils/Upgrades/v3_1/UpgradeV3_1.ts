import type { UpgradeReturn } from '../v1_x/UpgradeV1_x';
import type { EMRALD_Model as EMRALD_ModelV3_0 } from '../v3_0/AllModelInterfacesV3_0';
import type {
  Action,
  Diagram,
  EMRALD_Model,
  ExtSim,
  State,
  Event,
  LogicNode,
  Variable,
  Main_Model,
} from './AllModelInterfacesV3_1';

export function UpgradeV3_1(modelTxt: string): UpgradeReturn {
  return {
    newModel: JSON.stringify(UpgradeV3_1_Recursive(JSON.parse(modelTxt) as EMRALD_ModelV3_0)),
    errors: [],
  };
}

function UpgradeV3_1_Recursive(oldModel: EMRALD_ModelV3_0): EMRALD_Model {
  // TODO: Possible MAAP upgrades

  // Note: The reassignment of the objType properties here is just to make TypeScript happy

  function upgradeModel(oldModel: EMRALD_ModelV3_0): Main_Model {
    return {
      ...oldModel,
      DiagramList: oldModel.DiagramList.map((diagram) => {
        const newDiagram: Diagram = {
          ...diagram,
          objType: 'Diagram',
        };
        return newDiagram;
      }),
      ExtSimList: oldModel.ExtSimList.map((extsim) => {
        const newExtSim: ExtSim = {
          ...extsim,
          objType: 'ExtSim',
        };
        return newExtSim;
      }),
      StateList: oldModel.StateList.map((state) => {
        const newState: State = {
          ...state,
          objType: 'State',
        };
        return newState;
      }),
      ActionList: oldModel.ActionList.map((action) => {
        const newAction: Action = {
          ...action,
          objType: 'Action',
          // Forces the required caType property to exist
          // For this update, the only possible value is the MAAP form
          formData: action.formData ? { ...action.formData, caType: 'MAAP' } : undefined,
        };
        return newAction;
      }),
      EventList: oldModel.EventList.map((event) => {
        const newEvent: Event = {
          ...event,
          objType: 'Event',
        };
        return newEvent;
      }),
      LogicNodeList: oldModel.LogicNodeList.map((ln) => {
        const newLn: LogicNode = {
          ...ln,
          objType: 'LogicNode',
        };
        return newLn;
      }),
      VariableList: oldModel.VariableList.map((v) => {
        const newVar: Variable = {
          ...v,
          objType: 'Variable',
        };
        return newVar;
      }),
      versionHistory: [],
      emraldVersion: 3.1,
    };
  }

  return {
    ...upgradeModel(oldModel),
    templates: oldModel.templates?.map((template) => {
      return upgradeModel(template);
    }),
  };
}
