export interface UpgradeReturn { newModel : string, errors : string[]}

export function UpgradeV1_x( modelTxt : string) : UpgradeReturn
{
    
    var newModel : any = JSON.parse(modelTxt);    

    if((newModel.version == undefined) || (newModel.version <= 1.2))
    {
      // newModel.ActionList.forEach((a : { Action: { mainItem?: string, mutExcl?: string } }) => {
      //   a.Action.mainItem = !!(a.Action.mainItem !== undefined) ? (a.Action.mainItem.toUpperCase() === "TRUE") : false;
      //   a.Action.mutExcl = !!(a.Action.mutExcl !== undefined) ? (a.Action.mutExcl.toUpperCase() === "TRUE") : false;
      // });
      // newModel.ActionList.forEach((a: { Action: { mainItem?: string | boolean, mutExcl?: string | boolean } }) => {
      //   a.Action.mainItem = !!a.Action.mainItem && a.Action.mainItem.toUpperCase() === "TRUE";
      //   a.Action.mutExcl = !!a.Action.mutExcl && a.Action.mutExcl.toUpperCase() === "TRUE";
      // });
      if(newModel.ActionList != undefined){
        newModel.ActionList.forEach((a: { Action: any; }) => {
          const action = a.Action;
          if (action.mainItem === undefined)
            action.mainItem = false;
          if (typeof action.mainItem === 'string') {
              action.mainItem = action.mainItem.toUpperCase() === 'TRUE';
          }
          if (typeof action.mutExcl === 'string') {
              action.mutExcl = action.mutExcl.toUpperCase() === 'TRUE';
          }
          if (action.hasOwnProperty('simEndtime')) {
            delete action.simEndtime;
          }
        });
      }

      if(newModel.EventList != undefined){
        newModel.EventList.forEach((e: { Event: any; }) => {
          const event = e.Event;
          if (event.mainItem === undefined)
          event.mainItem = false;
          if (typeof event.mainItem === 'string') {
              event.mainItem = event.mainItem.toUpperCase() === 'TRUE';
          }
          if (typeof event.allItems === 'string') {
            event.allItems = event.allItems.toUpperCase() === 'TRUE';
          }
          if (typeof event.onSuccess === 'string') {
            event.onSuccess = event.onSuccess.toUpperCase() === 'TRUE';
          }
          // Check if the `Code` property exists and delete it
          if (event.hasOwnProperty('Code')) {
            delete event.Code;
          }
          if (event.hasOwnProperty('sim3dID')) {
            delete event.sim3dID;
          }
          if (event.hasOwnProperty('tempLogicTopList')) {
            delete event.tempLogicTopList;
          }
          if (event.hasOwnProperty('tempVariableList')) {
            delete event.tempVariableList;
          }
          if (event.hasOwnProperty('missionTime')) {
            delete event.missionTime;
          }
          if (event.hasOwnProperty('evtType')) {
            delete event.evtType;
          }
          // if (event.hasOwnProperty('shape')) {
          //   delete event.shape;
          // }
          // if (event.hasOwnProperty('scale')) {
          //   delete event.scale;
          // }
          if (event.hasOwnProperty('ndMean')) {
            event.mean = event.ndMean;
            delete event.ndMean;
          }
          if (event.hasOwnProperty('ndStdDev')) {
            event.std = event.ndStdDev;
            delete event.ndStdDev;
          }
          if (event.hasOwnProperty('ndMin')) {
            event.min = event.ndMin;
            delete event.ndMin;
          }
          if (event.hasOwnProperty('ndMax')) {
            event.max = event.ndMax;
            delete event.ndMax;
          }
          
        });
      }
    }

    newModel.version = 1.2;
    

  const retModel: UpgradeReturn = { newModel: JSON.stringify(newModel), errors: [] };


  return retModel;
}