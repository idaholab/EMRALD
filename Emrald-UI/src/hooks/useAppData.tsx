import { useState, useEffect } from 'react';
import emraldData from '../emraldData.json';

export const useAppData = () => {
  const [appData, setAppData] = useState(() => {
    const storedData = localStorage.getItem('appData');
    return storedData ? JSON.parse(storedData) : emraldData;
  });

  const transformList = (list: any, itemType: string) => {
    return list ? list.map((item: any) => ({ [itemType]: item })) : [];
  };

  const updateAppData = (newData: any, undoData?: any) => {
    let updatedData;
    const dataHistory = JSON.parse(localStorage.getItem('dataHistory') || '[]');
    
    if (undoData) {
      updatedData = undoData;
    } else {
      updatedData = {
        ...newData,
        DiagramList: transformList(newData.DiagramList, 'Diagram'),
        StateList: transformList(newData.StateList, 'State'),
        VariableList: transformList(newData.VariableList, 'Variable'),
        ActionList: transformList(newData.ActionList, 'Action'),
        EventList: transformList(newData.EventList, 'Event'),
        LogicNodeList: transformList(newData.LogicNodeList, 'LogicNode'),
        ExtSimList: transformList(newData.ExtSimList, 'ExtSim'),
      };

      const newHistory = [...dataHistory, updatedData];
      if (newHistory.length >= 5) {
        newHistory.shift();
      }
      localStorage.setItem('dataHistory', JSON.stringify(newHistory));
    }
    
    setAppData(updatedData);
    localStorage.setItem('appData', JSON.stringify(updatedData));
  };

  useEffect(() => {
    const dataHistory = JSON.parse(localStorage.getItem('dataHistory') || '[]');
    if (dataHistory.length === 0) {
      localStorage.setItem('dataHistory', JSON.stringify([emraldData]));
    }
  }, [])

  return { appData, updateAppData };
};