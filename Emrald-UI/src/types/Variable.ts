export interface Variable {
  id: number | string;
  name: string;
  desc: string;
  varScope: string;
  value: number;
  canMonitor: boolean;
  monitorInSim: boolean;
  cumulativeStats: boolean;
  resetOnRuns: boolean;
  type: string;
}

export interface VariableListItem {
  Variable: Variable;
}

export interface VariableList extends Array<VariableListItem> {}