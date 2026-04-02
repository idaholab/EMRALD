import type {
  Action,
  Diagram,
  EMRALD_Model,
  Event,
  ExtSim,
  LogicNode,
  State,
  Variable,
} from './EMRALD_Model';

export const EMRALD_SchemaVersion = 3.2;

export function CreateEmptyEMRALDModel(): EMRALD_Model {
  return {
    objType: 'EMRALD_Model',
    name: undefined,
    desc: undefined,
    version: 1,
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

export type ModelItem
  = | Diagram
    | LogicNode
    | ExtSim
    | Action
    | Event
    | State
    | Variable;
