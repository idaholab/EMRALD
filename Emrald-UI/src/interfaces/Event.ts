export interface Event {
  id?: number;
  name?: string;
  desc?: string;
  mainItem?: boolean;
  evType?: string;
  time?: string;
  ifInState?: string;
  allItems?: string;
  triggerStates?: string[];
  lambda?: string;
  lambdaTimeRate?: string;
  evtType?: string;
  ndMean?: number;
  ndStdDev?: number;
  ndMin?: number;
  ndMax?: number;
  onSuccess: string;
  logicTop: string;
  itemId?: number;
  actType?: string;
  mutExcl?: string;
  missionTime?: string;
}

export interface EventListItem {
  Event: Event;
}

export interface EventList extends Array<EventListItem> {}
