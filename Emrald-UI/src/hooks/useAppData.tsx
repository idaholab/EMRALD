import emraldData from '../emraldData.json';
import { upgradeModel } from '../utils/Upgrades/upgrade';
import { signal } from '@preact/signals-react';
import { EMRALD_Model } from '../types/EMRALD_Model';

const storedData = sessionStorage.getItem('appData');
//const upgrade = upgradeModel(JSON.stringify(emraldData)); //should still be able do this, but the debugger gets stuck here when using a v3 model and still trying to upgrade it.

export const appData = signal<EMRALD_Model>(storedData ? JSON.parse(storedData) : emraldData);

export const updateAppData = (newData: any, undoData?: any) => {
  let updatedData;
  const dataHistory = JSON.parse(sessionStorage.getItem('dataHistory') || '[]');

  if (undoData) {
    updatedData = undoData;
  } else {
    updatedData = {
      ...newData,
      name: newData.name,
      desc: newData.desc,
      version: newData.version,
      DiagramList: newData.DiagramList,
      StateList: newData.StateList,
      VariableList: newData.VariableList,
      ActionList: newData.ActionList,
      EventList: newData.EventList,
      LogicNodeList: newData.LogicNodeList,
      ExtSimList: newData.ExtSimList,
    };

    const newHistory = [...dataHistory, updatedData];
    if (newHistory.length >= 5) {
      newHistory.shift();
    }
    sessionStorage.setItem('dataHistory', JSON.stringify(newHistory));
  }

  appData.value = updatedData;
  sessionStorage.setItem('appData', JSON.stringify(updatedData));
};

export const clearCacheData = () => {
  sessionStorage.clear();
  localStorage.clear();
};
