import { Action, Diagram, EMRALD_Model, ExtSim, LogicNode, State, Variable } from "./EMRALD_Model";

export const EMRALD_SchemaVersion: number = 3.0;

export function CreateEmptyEMRALDModel(): EMRALD_Model {
  return {
    objType: 'EMRALD_Model',
    name: '',
    desc: '',
    version: 1.0,
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
