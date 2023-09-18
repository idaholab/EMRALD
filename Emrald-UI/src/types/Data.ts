import { Action, ActionList } from './Action';
import { Diagram, DiagramList } from './Diagram';
import { Event, EventList } from './Event';
import { LogicNode, LogicNodeList } from './LogicNode';
import { State, StateList } from './State';
import { Variable, VariableList } from './Variable';

export interface appDataRaw {
  id: string;
  name: string;
  desc: string;
  emraldVersion: number;
  version: number;
  DiagramList: DiagramList;
  StateList: StateList;
  VariableList: VariableList;
  ActionList: ActionList;
  EventList: EventList;
  LogicNodeList: LogicNodeList;
  // Add other item types and their properties as needed
}


export interface appData {
  id: string;
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
  // Add other item types and their properties as needed
}
