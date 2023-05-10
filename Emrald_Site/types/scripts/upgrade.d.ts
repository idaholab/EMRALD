/**
 * Overrides the correct EMRALD types with types from deprecated model versions.
 * This keeps the deprecated properties out of the type definitions used everywhere else.
 */
interface DeprecatedModel extends EMRALD.Model {
  ActionList: {
    Action: Exclude<'mainItem', EMRALD.Action['Action']> & {
      mainItem: string;
      mutExcl: string;
    };
  }[];
  EventList: {
    Event: Exclude<'evType' | 'mainItem', EMRALD.Event['Event']> & {
      evType:
        | 'etNormalDist'
        | 'etLogNormalDist'
        | 'etExponentialDist'
        | 'etWeibullDist';
      mainItem: string;
      max: number;
      maxTimeRate: EMRALD.TimeRate;
      mean: number;
      meanTimeRate: EMRALD.TimeRate;
      min: number;
      minTimeRate: EMRALD.TimeRate;
      rate: number;
      scale: number;
      shape: number;
      std: number;
      stdTimeRate: EMRALD.TimeRate;
      timeRate: EMRALD.TimeRate;
    };
  }[];
  LogicNodeList: {
    LogicNode: EMRALD.LogicNode['LogicNode'] & {
      rootName: string;
    };
  }[];
}
