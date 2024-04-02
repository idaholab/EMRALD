import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { LogicNode } from '../types/LogicNode';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';

interface LogicNodeContextType {
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

const LogicNodeContext = createContext<LogicNodeContextType | undefined>(
  undefined,
);

export function useLogicNodeContext() {
  const context = useContext(LogicNodeContext);
  if (!context) {
    throw new Error(
      'useLogicNodeContext must be used within a LogicNodeContextProvider',
    );
  }
  return context;
}

const LogicNodeContextProvider: React.FC<EmraldContextWrapperProps> = ({
  children,
}) => {
  const [logicNodes, setLogicNodes] = useState<LogicNode[]>(JSON.parse(JSON.stringify(appData.value.LogicNodeList)));

  const createLogicNode = (newLogicNode: LogicNode) => {
    const updatedLogicNodes = [...appData.value.LogicNodeList, newLogicNode];
    appData.value.LogicNodeList = updatedLogicNodes;
    updateAppData(appData.value);
    setLogicNodes(updatedLogicNodes);
  };

  const updateLogicNode = (updatedLogicNode: LogicNode) => {
    let newLogicNodeList = JSON.parse(JSON.stringify(appData.value.LogicNodeList));
    let index = newLogicNodeList.findIndex((item: LogicNode) => item.id === updatedLogicNode.id);
    if (index === -1) { return; }
    newLogicNodeList[index] = updatedLogicNode;
    updateAppData({...appData.value, LogicNodeList: newLogicNodeList});
    setLogicNodes(newLogicNodeList);
};

  const deleteLogicNode = (logicNodeId: string | undefined) => {
    if (!logicNodeId) { return; }
    const updatedLogicNodes = logicNodes.filter(
      (item) => item.id !== logicNodeId,
    );
    updateAppData(appData.value);
    setLogicNodes(updatedLogicNodes);
  };

  const getLogicNodeByName = (logicNodeName: string | undefined) => {
    return logicNodes.find((node) => node.name === logicNodeName) || emptyLogicNode;
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
  };

  return (
    <LogicNodeContext.Provider
      value={{
        logicNodes,
        createLogicNode,
        updateLogicNode,
        deleteLogicNode,
        getLogicNodeByName,
        newLogicNodeList,
        mergeLogicNodeList,
        clearLogicNodeList
      }}
    >
      {children}
    </LogicNodeContext.Provider>
  );
};

export default LogicNodeContextProvider;
