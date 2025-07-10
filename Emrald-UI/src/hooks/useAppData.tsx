import emraldData from '../emraldData.json';
import { upgradeModel } from '../utils/Upgrades/upgrade';
import { signal } from '@preact/signals-react';
import type { EMRALD_Model } from '../types/EMRALD_Model';
import { CreateEmptyEMRALDModel } from '../types/ModelUtils';

const storedData = sessionStorage.getItem('appData');

export const appData = signal<EMRALD_Model>(CreateEmptyEMRALDModel());

// Try to parse & upgrade the stored model
try {
  if (storedData !== null) {
    const upgraded = upgradeModel(storedData);
    if (upgraded === null) {
      // The user has a model in their local storage, but it failed to upgrade
      // TODO: This needs an actual notification in the UI
      console.error('Could not upgrade local model');
    } else {
      appData.value = upgraded;
    }
  }
} catch {
  // Load & upgrades the default model
  const upgraded = upgradeModel(JSON.stringify(emraldData));
  if (upgraded) {
    appData.value = upgraded;
  } else {
    // Something has gone really wrong and the default model failed to upgrade
    // TODO: This needs an actual notification in the UI
    console.error('Could not upgrade default model!');
  }
}

export const updateAppData = (newData: EMRALD_Model, undoData?: EMRALD_Model) => {
  let updatedData;
  const dataHistory = JSON.parse(sessionStorage.getItem('dataHistory') ?? '[]') as EMRALD_Model[];

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
