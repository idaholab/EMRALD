import { useState } from 'react';
import emraldData from '../emraldData.json';

export const useAppData = () => {
  const [appData, setAppData] = useState(emraldData);

  const transformList = (list: any, itemType: any) => {
    return list ? list.map((item: any) => ({ [itemType]: item })) : [];
  };

  const updateAppData = (newData: any) => {
    const transformedData = {
      ...newData,
      DiagramList: transformList(newData.DiagramList, 'Diagram'),
      StateList: transformList(newData.StateList, 'State'),
      VariableList: transformList(newData.VariableList, 'Variable'),
      ActionList: transformList(newData.ActionList, 'Action'),
      EventList: transformList(newData.EventList, 'Event'),
      LogicNodeList: transformList(newData.LogicNodeList, 'LogicNode'),
      ExtSimList: transformList(newData.ExtSimList, 'ExtSim'),
      // Add other list types and their transformations as needed
    };  
    setAppData(transformedData);
  };

  return { appData, updateAppData };
};