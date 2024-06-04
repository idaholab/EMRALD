import { Action} from './Action';
import { Diagram } from './Diagram';
import { Event } from './Event';
import { LogicNode } from './LogicNode';
import { State } from './State';
import { Variable } from './Variable';

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
  ExtSimList: []
  // Add other item types and their properties as needed
}
