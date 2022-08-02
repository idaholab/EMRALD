namespace EMRALD {
  export interface Action {
    Action: {
      mainItem: boolean;
      mutExcl: boolean;
    };
  }

  export type EventType =
    | 'etVarCond'
    | 'etStateCng'
    | 'etComponentLogic'
    | 'etTimer'
    | 'etFailRate'
    | 'et3dSimEv'
    | 'etDistribution';
  export type DistType =
    | 'dtNormal'
    | 'dtLogNormal'
    | 'dtExponential'
    | 'dtWeibull';
  export type TimeRate =
    | 'trYears'
    | 'trDays'
    | 'trHours'
    | 'trMinutes'
    | 'trSeconds';

  export interface Event {
    Event: {
      dfltTimeRate: TimeRate;
      distType: DistType;
      evType: EventType;
      mainItem: boolean;
      parameters: {
        name: string;
        timeRate?: TimeRate;
        useVariable: boolean;
        value: number;
      }[];
    };
  }

  export interface LogicNode {
    LogicNode: {
      isRoot: boolean;
      name: string;
    };
  }

  export interface Model {
    ActionList: Action[];
    EventList: Event[];
    LogicNodeList: LogicNode[];
    version: number;
  }
}
