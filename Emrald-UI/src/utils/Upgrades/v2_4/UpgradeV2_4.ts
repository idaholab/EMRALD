import { UpgradeReturn } from '../v1_x/UpgradeV1_x'
import { EMRALD_Model as EMRALD_ModelV1_1} from '../v1_x/AllModelIterfacesV1_x'
import { Event as EventV1_1} from '../v1_x/AllModelIterfacesV1_x'
//import { EMRALD_Model as EMRALD_ModelV1_1} from '../v1_1/AllPieces'
import { Event } from './AllModelInterfacesV2_4'
import { EMRALD_Model } from './AllModelInterfacesV2_4'
import { EventType } from './AllModelInterfacesV2_4'
import { DistributionType } from './AllModelInterfacesV2_4'


export function UpgradeV2_4( modelTxt : string) : UpgradeReturn
{
    //first fix random issues that don't match the schema, extra parameters that didn't get removed in a version upgrade
    var tempModel : any = JSON.parse(modelTxt);  
    if(tempModel.ActionList != undefined){
      tempModel.ActionList.forEach((a: { Action: any; }) => {
        const action = a.Action;
        if (typeof action.mutExcl === 'string') {
            action.mutExcl = action.mutExcl.toUpperCase() === 'TRUE';
        }
        if (action.hasOwnProperty('required')) {
          delete action.required; 
        }
      });
    }

    if(tempModel.DiagramList != undefined){
      tempModel.DiagramList.forEach((d: { Diagram: any; }) => {
        const diagram = d.Diagram;
        if (diagram.hasOwnProperty('required')) {
          delete diagram.required; 
        }
        if (diagram.hasOwnProperty('diagramLabels')) {
          delete diagram.diagramLabels; 
        }
      });
    }

    if(tempModel.StateList != undefined){
      tempModel.StateList.forEach((s: { State: any; }) => {
        const state = s.State;
        if (state.hasOwnProperty('required')) {
          delete state.required; 
        }
      });
    }

    if(tempModel.VariableList != undefined){
      tempModel.VariableList.forEach((v: { Variable: any; }) => {
        const variable = v.Variable;
        if (variable.hasOwnProperty('required')) {
          delete variable.required; 
        }
      });
    }
    

    if(tempModel.EventList != undefined){
      tempModel.EventList.forEach((e: { Event: any; }) => {
      const event = e.Event;
        if (event.hasOwnProperty('missionTime')) {
          delete event.missionTime; 
        }
        if (event.mainItem === undefined)
          event.mainItem = false;
        if (event.hasOwnProperty('evtType')) {
          if(!event.hasOwnProperty('evtType'))
            event.evType = event.evtType; 
          delete event.evtType;
        }
        if (event.hasOwnProperty('stdv')) {
          if(!event.hasOwnProperty('stdev'))
            event.std = event.stdv; 
          delete event.stdv;
        }
        if (event.hasOwnProperty('Code')) {
          delete event.Code;
        }
        if (event.hasOwnProperty('sim3dID')) {
          delete event.sim3dID;
        }
        if (event.hasOwnProperty('ndMean')) {
          delete event.ndMean; 
        }
        if (event.hasOwnProperty('ndStdDev')) {
          delete event.ndStdDev; 
        }
        if (event.hasOwnProperty('ndMin')) {
          delete event.ndMin; 
        }
        if (event.hasOwnProperty('ndMax')) {
          delete event.ndMax; 
        }
        if (event.hasOwnProperty('evalCurOnInitial')) {
          delete event.evalCurOnInitial; 
        }
        if (event.hasOwnProperty('required')) {
          delete event.required; 
        }
      });
    }

    
    //Do schema update stuff

    var oldModel : EMRALD_ModelV1_1 = JSON.parse(JSON.stringify(tempModel));
       
    //do upgrade steps for version change 1.2 to 2_4. Convert old distribution events

    const newModel: EMRALD_Model = {
      ...oldModel,
      EventList: oldModel.EventList ? oldModel.EventList.map(({ Event }) => ({ Event: mapEvent(Event) })) : [],
      templates: oldModel.templates ? (oldModel.templates as unknown as EMRALD_Model[]) : undefined,
    };


    function mapEvent(oldEv: EventV1_1): Event {
      
      var allItems: boolean | undefined = oldEv.allItems != null ?
          (typeof oldEv.allItems === 'string' ? oldEv.allItems.toUpperCase() === 'TRUE' : oldEv.allItems) :
          undefined;
      var onSuccess: boolean | undefined = oldEv.onSuccess != null ?
        (typeof oldEv.onSuccess === 'string' ? oldEv.onSuccess.toUpperCase() === 'TRUE' : oldEv.onSuccess) :
        undefined;
      var ifInState : boolean | undefined = oldEv.ifInState != null ?
        (typeof oldEv.ifInState === 'string' ? oldEv.ifInState.toUpperCase() === 'TRUE' : oldEv.ifInState) :
        undefined;

      if([
        'etNormalDist',
        'etLogNormalDist',
        'etExponentialDist',
        'etWeibullDist',
      ].indexOf(oldEv.evType) > -1) {
        const removedOldEv : EventV1_1 = oldEv;
        const { moveFromCurrent, rate, timeRate, mean, std, min, max, meanTimeRate, stdTimeRate, minTimeRate, maxTimeRate, ...rest } = removedOldEv;
        const evType : EventType = 'etDistribution';
        var distType : DistributionType = 'dtNormal';
        switch (oldEv.evType) {
          case 'etNormalDist':
            distType = 'dtNormal';
            break;
          case "etLogNormalDist":
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
               
        
        const updatedEv :Event = {
          ...rest,
          evType,
          distType,
          allItems,
          onSuccess,
          ifInState
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
    else { // no need to change it so just add it back to the ev list
      
      const {rate, timeRate, moveFromCurrent, mean, std, min, max, meanTimeRate, stdTimeRate, minTimeRate, maxTimeRate, ...rest } = oldEv;
      var evType : EventType = oldEv.evType as EventType;
      
      
      return {
        ...rest,
        evType,
        allItems,
        onSuccess,
        ifInState
      }
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