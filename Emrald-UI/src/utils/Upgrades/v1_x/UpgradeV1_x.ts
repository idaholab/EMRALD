import type { EMRALD_Model as EMRALD_ModelV0 } from "./AllModelInterfacesV0";

export interface UpgradeReturn {
  newModel: string;
  errors: string[];
}

export function UpgradeV1_x(modelTxt: string): UpgradeReturn {
  const newModel = JSON.parse(modelTxt) as EMRALD_ModelV0;

  if (newModel.version == undefined || newModel.version <= 1.2) {
    // newModel.ActionList.forEach((a : { Action: { mainItem?: string, mutExcl?: string } }) => {
    //   a.Action.mainItem = !!(a.Action.mainItem !== undefined) ? (a.Action.mainItem.toUpperCase() === "TRUE") : false;
    //   a.Action.mutExcl = !!(a.Action.mutExcl !== undefined) ? (a.Action.mutExcl.toUpperCase() === "TRUE") : false;
    // });
    // newModel.ActionList.forEach((a: { Action: { mainItem?: string | boolean, mutExcl?: string | boolean } }) => {
    //   a.Action.mainItem = !!a.Action.mainItem && a.Action.mainItem.toUpperCase() === "TRUE";
    //   a.Action.mutExcl = !!a.Action.mutExcl && a.Action.mutExcl.toUpperCase() === "TRUE";
    // });
    if (newModel.ActionList != undefined) {
      newModel.ActionList.forEach((a) => {
        const action = a.Action;
        action.mainItem ??= false;
        if (typeof action.mainItem === 'string') {
          action.mainItem = action.mainItem.toUpperCase() === 'TRUE';
        }
        if (typeof action.mutExcl === 'string') {
          action.mutExcl = action.mutExcl.toUpperCase() === 'TRUE';
        }
        delete action.simEndtime;
      });
    }

    if (newModel.EventList != undefined) {
      newModel.EventList.forEach((e) => {
        const event = e.Event;
        event.mainItem ??= false;
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
        delete event.Code;
        delete event.sim3dID;
        delete event.tempLogicTopList;
        delete event.tempVariableList;
        delete event.missionTime;
        delete event.evtType;
        event.mean = event.ndMean;
        delete event.ndMean;
        event.std = event.ndStdDev;
        delete event.ndStdDev;
        event.min = event.ndMin;
        delete event.ndMin;
        event.max = event.ndMax;
        delete event.ndMax;
      });
    }
  }

  newModel.version = 1.2;

  const retModel: UpgradeReturn = { newModel: JSON.stringify(newModel), errors: [] };

  return retModel;
}
