export interface Action {
  id: number | string;
  name: string;
  desc?: string;
  actType?: string;
  mainItem?: boolean;
  mutExcl?: string;
  newStates?: NewState[];
  itemId?: number;
  moveFromCurrent?: boolean;
  time: string;
  evtType: string;
  ifInState: string;
  logicTop: string;
  missionTime: string;
}

export interface NewState {
  toState?: string;
  prob?: number;
  varProb?: string;
  failDesc?: string;
}

export interface ActionListItem {
  Action: Action;
}

export interface ActionList extends Array<ActionListItem> {}
