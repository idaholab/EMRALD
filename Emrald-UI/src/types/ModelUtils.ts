import type {
  Action,
  Diagram,
  EMRALD_Model,
  ExtSim,
  LogicNode,
  State,
  Variable,
  Event,
} from './EMRALD_Model';

export const EMRALD_SchemaVersion = 3.1;

export function CreateEmptyEMRALDModel(): EMRALD_Model {
  return {
    objType: 'EMRALD_Model',
    name: '',
    desc: '',
    version: 1.0,
    versionHistory: [],
    emraldVersion: EMRALD_SchemaVersion,
    DiagramList: [],
    ExtSimList: [],
    StateList: [],
    ActionList: [],
    EventList: [],
    LogicNodeList: [],
    VariableList: [],
  };
}

export type ModelItem = Diagram | LogicNode | ExtSim | Action | Event | State | Variable;
