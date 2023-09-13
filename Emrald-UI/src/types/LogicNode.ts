export interface LogicNode {
  id: number | string;
  name: string;
  desc: string;
  gateType: string;
  rootName?: string;
  compChildren?: string[];
  gateChildren?: string[];
}

export interface LogicNodeListItem {
  LogicNode: LogicNode;
}

export interface LogicNodeList extends Array<LogicNodeListItem> {}
