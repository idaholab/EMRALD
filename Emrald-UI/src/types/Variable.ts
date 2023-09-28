export interface Variable {
  id: number | string;
  name: string;
  desc: string;
  varScope?: string;
  value?: number;
  sim3DId?: string;
  canMonitor?: boolean;
  monitorInSim?: boolean;
  cumulativeStats?: boolean;
  resetOnRuns?: boolean;
  docType?: string;
  docPath?: string;
  docLink?: string;
  pathMustExist?: boolean;
  type: string;
}

export interface VariableListItem {
  Variable: Variable;
}

export interface VariableList extends Array<VariableListItem> {}