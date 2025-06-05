/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UpgradeReturn } from '../v1_x/UpgradeV1_x';
import type {
  EMRALD_Model as EMRALD_ModelV1_1,
  Event as EventV1_1,
} from '../v1_x/AllModelInterfacesV1_x';
//import { EMRALD_Model as EMRALD_ModelV1_1} from '../v1_1/AllPieces'
import type {
  Event,
  EMRALD_Model,
  EventType,
  DistributionType,
  Action,
  Diagram,
  State,
  Variable,
} from './AllModelInterfacesV2_4';

export function UpgradeV2_4(modelTxt: string): UpgradeReturn {
  //first fix random issues that don't match the schema, extra parameters that didn't get removed in a version upgrade
  const oldModel = JSON.parse(modelTxt) as EMRALD_ModelV1_1;
  const newModel: EMRALD_Model = {
    ...oldModel,
    ActionList: oldModel.ActionList.map((a) => {
      const action = a.Action;
      if (typeof action.mutExcl === 'string') {
        action.mutExcl = action.mutExcl.toUpperCase() === 'TRUE';
      }
      delete action.required;
      return { Action: action as Action };
    }),
    DiagramList: oldModel.DiagramList.map((d) => {
      const diagram = d.Diagram;
      delete diagram.required;
      delete diagram.diagramLabels;
      return { Diagram: diagram as Diagram };
    }),
    StateList: oldModel.StateList.map((s) => {
      const state = s.State;
      delete state.required;
      return { State: state as State };
    }),
    VariableList: oldModel.VariableList.map((v) => {
      const variable = v.Variable;
      delete variable.required;
      return { Variable: variable as Variable };
    }),
    EventList: oldModel.EventList.map((e) => {
      const event = e.Event;
      delete event.missionTime;
      event.mainItem ??= false;
      if (event.evtType !== undefined) {
        event.evType ??= event.evtType;
        delete event.evtType;
      }
      if (event.stdv !== undefined) {
        event.std ??= event.stdv;
        delete event.stdv;
      }
      delete event.Code;
      delete event.sim3dID;
      delete event.ndMean;
      delete event.ndStdDev;
      delete event.ndMin;
      delete event.ndMax;
      delete event.evalCurOnInitial;
      delete event.required;
      return { Event: mapEvent(event) };
    }),
  };

  function mapEvent(oldEv: EventV1_1): Event {
    const allItems: boolean | undefined =
      oldEv.allItems != null
        ? typeof oldEv.allItems === 'string'
          ? oldEv.allItems.toUpperCase() === 'TRUE'
          : oldEv.allItems
        : undefined;
    const onSuccess: boolean | undefined =
      oldEv.onSuccess != null
        ? typeof oldEv.onSuccess === 'string'
          ? oldEv.onSuccess.toUpperCase() === 'TRUE'
          : oldEv.onSuccess
        : undefined;
    const ifInState: boolean | undefined =
      oldEv.ifInState != null
        ? typeof oldEv.ifInState === 'string'
          ? oldEv.ifInState.toUpperCase() === 'TRUE'
          : oldEv.ifInState
        : undefined;

    if (
      oldEv.evType &&
      ['etNormalDist', 'etLogNormalDist', 'etExponentialDist', 'etWeibullDist'].includes(
        oldEv.evType,
      )
    ) {
      const removedOldEv: EventV1_1 = oldEv;
      const {
        moveFromCurrent,
        rate,
        timeRate,
        mean,
        std,
        min,
        max,
        meanTimeRate,
        stdTimeRate,
        minTimeRate,
        maxTimeRate,
        ...rest
      } = removedOldEv;
      const evType: EventType = 'etDistribution';
      let distType: DistributionType = 'dtNormal';
      switch (oldEv.evType) {
        case 'etNormalDist':
          distType = 'dtNormal';
          break;
        case 'etLogNormalDist':
          distType = 'dtLogNormal';
          break;
        case 'etExponentialDist':
          distType = 'dtExponential';
          break;
        case 'etWeibullDist':
          distType = 'dtWeibull';
          break;
        default:
          break;
      }

      const updatedEv: Event = {
        ...rest,
        evType,
        distType,
        allItems,
        onSuccess,
        ifInState,
      };

      switch (oldEv.evType) {
        case 'etNormalDist':
        case 'etLogNormalDist':
          updatedEv.parameters = [
            {
              name: 'Mean',
              timeRate: oldEv.meanTimeRate,
              useVariable: false,
              value: oldEv.mean,
            },
            {
              name: 'Standard Deviation',
              timeRate: oldEv.stdTimeRate,
              useVariable: false,
              value: oldEv.std,
            },
            {
              name: 'Minimum',
              timeRate: oldEv.minTimeRate,
              useVariable: false,
              value: oldEv.min,
            },
            {
              name: 'Maximum',
              timeRate: oldEv.maxTimeRate,
              useVariable: false,
              value: oldEv.max,
            },
          ];
          updatedEv.dfltTimeRate = 'trHours';
          break;
        case 'etExponentialDist':
          updatedEv.parameters = [
            {
              name: 'Rate',
              timeRate: oldEv.timeRate,
              useVariable: false,
              value: oldEv.rate,
            },
            {
              name: 'Minimum',
              timeRate: 'trHours',
              useVariable: false,
              value: 0,
            },
            {
              name: 'Maximum',
              timeRate: 'trYears',
              useVariable: false,
              value: 1000,
            },
          ];
          updatedEv.dfltTimeRate = 'trHours';
          break;
        case 'etWeibullDist':
          updatedEv.parameters = [
            {
              name: 'Shape',
              useVariable: false,
              value: oldEv.shape,
            },
            {
              name: 'Scale',
              timeRate: oldEv.timeRate,
              useVariable: false,
              value: oldEv.scale,
            },
            {
              name: 'Minimum',
              timeRate: 'trHours',
              useVariable: false,
              value: 0,
            },
            {
              name: 'Maximum',
              timeRate: 'trYears',
              useVariable: false,
              value: 1000,
            },
          ];
          updatedEv.dfltTimeRate = oldEv.timeRate;
          break;
        default:
      }

      return updatedEv;
    }
    // else { // no need to change it so just add it back to the ev list
    //     return oldEv as Event;
    // }
    else {
      // no need to change it so just add it back to the ev list

      const {
        rate,
        timeRate,
        moveFromCurrent,
        mean,
        std,
        min,
        max,
        meanTimeRate,
        stdTimeRate,
        minTimeRate,
        maxTimeRate,
        ...rest
      } = oldEv;
      const evType: EventType = oldEv.evType as EventType;

      return {
        ...rest,
        evType,
        allItems,
        onSuccess,
        ifInState,
      };
    }
  }

  newModel.version = 2.4;
  const retModel: UpgradeReturn = { newModel: JSON.stringify(newModel), errors: [] };

  // //to validate the new version against the schema
  // const schemaPath = './src/Upgrades/v3_0/EMRALD_JsonSchemaV3_0.json';
  // const schemaTxt = fs.readFileSync(schemaPath, 'utf-8').trim();

  // const schema = JSON.parse(schemaTxt);
  // const validator = new Validator();
  // const validationResult = validator.validate(newModel, schema);
  // if(validationResult.valid === false){
  //     validationResult.errors.forEach(error => {
  //         retModel.errors.push(error.instance + " - " + error.message + " : " + JSON.stringify(error.argument))
  //     });
  // }

  return retModel;
}
