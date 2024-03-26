import { useEffect } from 'react';
import emraldData from '../emraldData.json';
import { Upgrade } from '../utils/Upgrades/upgrade';
import { effect, signal } from '@preact/signals-react';
import { EMRALD_Model } from '../types/EMRALD_Model';

const storedData = localStorage.getItem('appData');
const upgrade = new Upgrade(JSON.stringify(emraldData));
upgrade.upgrade(3.0); // upgrade to version 3.0
export const appData = signal<EMRALD_Model>(storedData ? JSON.parse(storedData) : JSON.parse(upgrade.newModelStr));

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