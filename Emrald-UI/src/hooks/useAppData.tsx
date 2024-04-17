import { useEffect } from 'react';
import emraldData from '../emraldData.json';
import { upgradeModel } from '../utils/Upgrades/upgrade';
import { signal } from '@preact/signals';
import { EMRALD_Model, EMRALD_SchemaVersion, CreateEmptyEMRALDModel } from '../types/EMRALD_Model';

//TODO ask user if they want to restore or use previous model
const storedData = localStorage.getItem('appData');
const upgradedModel : EMRALD_Model | null = upgradeModel(EMRALD_SchemaVersion, JSON.stringify(emraldData));
//use restored model or upgraded model or empty model
export const appData = signal<EMRALD_Model>(storedData ? JSON.parse(storedData) : upgradedModel ? upgradedModel as EMRALD_Model : CreateEmptyEMRALDModel());

//upgrade.upgrade(3.0); // upgrade to version 3.0
//export const appData = signal<EMRALD_Model>(storedData ? JSON.parse(storedData) : JSON.parse(upgrade.newModelStr));
console.log(appData);

export const updateAppData = (newData: any, undoData?: any) => {
  let updatedData;
  const dataHistory = JSON.parse(localStorage.getItem('dataHistory') || '[]');
  
  if (undoData) {
    updatedData = undoData;
  } else {
    updatedData = {
      ...newData,
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
    localStorage.setItem('dataHistory', JSON.stringify(newHistory));
  }
  
  appData.value = updatedData;
  // setAppData(updatedData);
  localStorage.setItem('appData', JSON.stringify(updatedData));
};

export const clearCacheData = () => {
  localStorage.clear();
};



export const useAppData = () => {

  // const updateAppData = (newData: any, undoData?: any) => {
  //   let updatedData;
  //   const dataHistory = JSON.parse(localStorage.getItem('dataHistory') || '[]');
    
  //   if (undoData) {
  //     updatedData = undoData;
  //   } else {
  //     updatedData = {
  //       ...newData,
  //       DiagramList: newData.DiagramList,
  //       StateList: newData.StateList,
  //       VariableList: newData.VariableList,
  //       ActionList: newData.ActionList,
  //       EventList: newData.EventList,
  //       LogicNodeList: newData.LogicNodeList,
  //       ExtSimList: newData.ExtSimList,
  //     };

  //     const newHistory = [...dataHistory, updatedData];
  //     if (newHistory.length >= 5) {
  //       newHistory.shift();
  //     }
  //     localStorage.setItem('dataHistory', JSON.stringify(newHistory));
  //   }
    
  //   appData.value = updatedData;
  //   // setAppData(updatedData);
  //   localStorage.setItem('appData', JSON.stringify(updatedData));
  // };

  useEffect(() => {
    const dataHistory = JSON.parse(localStorage.getItem('dataHistory') || '[]');
    if (dataHistory.length === 0) {
      localStorage.setItem('dataHistory', JSON.stringify([appData.value]));
    }
  }, [])

  return { appData, updateAppData };
};