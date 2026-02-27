import type { Action, Diagram, Event, LogicNode, State, Variable } from './EMRALD_Model';

export interface appData {
  id: number;
  name: string;
  desc: string;
  emraldVersion: number;
  version: number;
  DiagramList: Diagram[];
  StateList: State[];
  VariableList: Variable[];
  ActionList: Action[];
  EventList: Event[];
  LogicNodeList: LogicNode[];
  ExtSimList: [];
  // Add other item types and their properties as needed
}
