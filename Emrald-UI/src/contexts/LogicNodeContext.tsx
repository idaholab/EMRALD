import React, { createContext, useContext, useState } from 'react';
import type { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import type { EMRALD_Model, LogicNode } from '../types/EMRALD_Model';
import { updateModelAndReferences } from '../utils/UpdateModel';
import { effect, type ReadonlySignal, useComputed } from '@preact/signals-react';
import { v4 as uuidv4 } from 'uuid';

interface LogicNodeContextType {
  logicNodeList: ReadonlySignal<LogicNode[]>;
  logicNodes: LogicNode[];
  createLogicNode: (logicNode: LogicNode) => void;
  updateLogicNode: (logicNode: LogicNode) => void;
  deleteLogicNode: (logicNodeId: string | undefined) => void;
  getLogicNodeByName: (logicNodeName: string | undefined) => LogicNode | undefined;
  newLogicNodeList: (newLogicNodeList: LogicNode[]) => void;
  mergeLogicNodeList: (newLogicNodeList: LogicNode[]) => void;
  clearLogicNodeList: () => void;
}

export const emptyLogicNode: LogicNode = {
  id: uuidv4(),
  name: '',
  desc: '',
  isRoot: false,
  gateType: 'gtAnd',
  compChildren: [],
  gateChildren: [],
  objType: 'LogicNode',
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
    JSON.parse(
      JSON.stringify(appData.value.LogicNodeList.sort((a, b) => a.name.localeCompare(b.name))),
    ) as LogicNode[],
  );
  const logicNodeList = useComputed(() => appData.value.LogicNodeList);

  effect(() => {
    if (
      JSON.stringify(logicNodes) !==
      JSON.stringify(appData.value.LogicNodeList.sort((a, b) => a.name.localeCompare(b.name)))
    ) {
      setLogicNodes(appData.value.LogicNodeList.sort((a, b) => a.name.localeCompare(b.name)));
      return;
    }
    return;
  });

  const createLogicNode = (newLogicNode: LogicNode) => {
    const updatedModel = updateModelAndReferences(newLogicNode, 'LogicNode');
    updateAppData(updatedModel);
  };

  const updateLogicNode = (updatedLogicNode: LogicNode) => {
    const updatedModel = updateModelAndReferences(updatedLogicNode, 'LogicNode');
    updateAppData(updatedModel);
  };

  const deleteLogicNode = (logicNodeId: string | undefined) => {
    const nodeToDelete = logicNodeList.value.find((node) => node.id === logicNodeId);
    const updatedLogicNodes = logicNodeList.value.filter((item) => item.id !== logicNodeId);
    if (nodeToDelete) {
      updatedLogicNodes.forEach((node) => {
        if (node.gateChildren.includes(nodeToDelete.name)) {
          node.gateChildren = node.gateChildren.filter((name) => name !== nodeToDelete.name);
        }
      });

      //there is nothing referencing nodes except other nodes and the this takes care of that, so no need to call DeleteItemAndRefs
    }
    updateAppData(
      JSON.parse(
        JSON.stringify({ ...appData.value, LogicNodeList: updatedLogicNodes }),
      ) as EMRALD_Model,
    );

    setLogicNodes(logicNodeList.value);
  };

  const getLogicNodeByName = (logicNodeName: string | undefined) => {
    return logicNodeList.value.find((node) => node.name === logicNodeName);
  };

  // Open New, Merge, and Clear Diagram List
  const newLogicNodeList = (newLogicNodeList: LogicNode[]) => {
    setLogicNodes(newLogicNodeList);
  };

  const mergeLogicNodeList = (newLogicNodeList: LogicNode[]) => {
    setLogicNodes([...logicNodes, ...newLogicNodeList]);
  };

  const clearLogicNodeList = () => {
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
