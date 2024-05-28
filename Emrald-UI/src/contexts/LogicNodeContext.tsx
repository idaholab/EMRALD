import React, { createContext, useContext, useEffect, useState } from 'react';
import { LogicNode } from '../types/LogicNode';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { updateModelAndReferences } from '../utils/UpdateModel';
import { MainItemTypes } from '../types/ItemTypes';
import { effect, ReadonlySignal, useComputed } from '@preact/signals-react';

interface LogicNodeContextType {
  logicNodeList: ReadonlySignal<LogicNode[]>;
  logicNodes: LogicNode[];
  createLogicNode: (logicNode: LogicNode) => void;
  updateLogicNode: (logicNode: LogicNode) => void;
  deleteLogicNode: (logicNodeId: string | undefined) => void;
  getLogicNodeByName: (logicNodeName: string | undefined) => LogicNode;
  newLogicNodeList: (newLogicNodeList: LogicNode[]) => void;
  mergeLogicNodeList: (newLogicNodeList: LogicNode[]) => void;
  clearLogicNodeList: () => void;
}

export const emptyLogicNode: LogicNode = {
  id: '',
  name: 'Gate 1',
  desc: '',
  isRoot: false,
  gateType: 'gtAnd',
  compChildren: [],
  gateChildren: [],
};

const LogicNodeContext = createContext<LogicNodeContextType | undefined>(undefined);

export function useLogicNodeContext() {
  const context = useContext(LogicNodeContext);
  if (!context) {
    throw new Error('useLogicNodeContext must be used within a LogicNodeContextProvider');
  }
  return context;
}

const LogicNodeContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [logicNodes, setLogicNodes] = useState<LogicNode[]>(
    appData.value.LogicNodeList.sort((a, b) => a.name.localeCompare(b.name)),
  );
  const logicNodeList = useComputed(() => appData.value.LogicNodeList);

  const createLogicNode = async (newLogicNode: LogicNode) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      newLogicNode,
      MainItemTypes.LogicNode,
    );
    updateAppData(updatedModel);
    setLogicNodes(updatedModel.LogicNodeList);
  };

  const updateLogicNode = async (updatedLogicNode: LogicNode) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      updatedLogicNode,
      MainItemTypes.LogicNode,
    );
    updateAppData(updatedModel);
    setLogicNodes(updatedModel.LogicNodeList);
  };

  const deleteLogicNode = (logicNodeId: string | undefined) => {
    if (!logicNodeId) {
      return;
    }
    const updatedLogicNodes = logicNodeList.value.filter((item) => item.id !== logicNodeId);
    updateAppData({ ...appData.value, LogicNodeList: updatedLogicNodes });
    setLogicNodes(updatedLogicNodes);
  };

  const getLogicNodeByName = (logicNodeName: string | undefined) => {
    return logicNodeList.value.find((node) => node.name === logicNodeName) || emptyLogicNode;
  };

  // Open New, Merge, and Clear Diagram List
  const newLogicNodeList = (newLogicNodeList: LogicNode[]) => {
    setLogicNodes(newLogicNodeList);
  };

  const mergeLogicNodeList = (newLogicNodeList: LogicNode[]) => {
    setLogicNodes([...logicNodes, ...newLogicNodeList]);
  };

  const clearLogicNodeList = () => {
    setLogicNodes([]);
    updateAppData({ ...appData.value, LogicNodeList: [] });
  };

  return (
    <LogicNodeContext.Provider
      value={{
        logicNodeList,
        logicNodes,
        createLogicNode,
        updateLogicNode,
        deleteLogicNode,
        getLogicNodeByName,
        newLogicNodeList,
        mergeLogicNodeList,
        clearLogicNodeList,
      }}
    >
      {children}
    </LogicNodeContext.Provider>
  );
};

export default LogicNodeContextProvider;
