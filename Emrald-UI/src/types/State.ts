export interface State {
  id: number | string;
  name: string;
  desc?: string;
  stateType?: 'stStandard' | 'stStart' | 'stKeyState' | 'stTerminal';
  diagramName?: string;
  geometry?: string;
  immediateActions?: string[];
  events?: string[];
  eventActions?: EventAction[];
}

export interface EventAction {
  moveFromCurrent?: boolean;
  actions?: string[];
}

export interface StateListItem {
  State: State;
}

export interface StateList extends Array<StateListItem> {}