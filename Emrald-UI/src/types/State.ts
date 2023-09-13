export interface State {
  id?: number | string;
  name?: string;
  desc?: string;
  stateType?: string;
  diagramName?: string;
  geometry?: string;
  immediateActions?: string[];
  events?: string[];
  eventActions?: EventAction[];
}

interface EventAction {
  moveFromCurrent?: boolean;
  actions?: string[];
}

export interface StateListItem {
  State: State;
}

export interface StateList extends Array<StateListItem> {}