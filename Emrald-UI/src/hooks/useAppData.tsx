import emraldData from '../emraldData.json';
import { upgradeModel } from '../utils/Upgrades/upgrade';
import { signal } from '@preact/signals-react';
import type { EMRALD_Model } from '../types/EMRALD_Model';

const storedData = sessionStorage.getItem('appData');
const upgrade = upgradeModel(JSON.stringify(emraldData)); 

export const appData = signal<EMRALD_Model>(storedData ? JSON.parse(storedData) as EMRALD_Model : upgrade);

export const updateAppData = (newData: EMRALD_Model, undoData?: any) => {
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
