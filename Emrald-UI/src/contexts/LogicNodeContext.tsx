import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LogicNode } from '../types/LogicNode';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { v4 as uuidv4 } from 'uuid';
import { appData, updateAppData } from '../hooks/useAppData';

interface LogicNodeContextType {
  logicNodes: LogicNode[];
  createLogicNode: (logicNode: LogicNode) => void;
  updateLogicNode: (logicNode: LogicNode) => void;
  deleteLogicNode: (logicNodeId: string | undefined) => void;
  getLogicNodeByName: (logicNodeName: string) => LogicNode;
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
  const [logicNodes, setLogicNodes] = useState<LogicNode[]>(appData.value.LogicNodeList);

  const createLogicNode = (newLogicNode: LogicNode) => {
    const updatedLogicNodes = [...logicNodes, newLogicNode];
    setLogicNodes(updatedLogicNodes);
  };

  const updateLogicNode = (updatedLogicNode: LogicNode) => {
    const updatedLogicNodes = logicNodes.map((item) =>
      item.id === updatedLogicNode.id
        ? updatedLogicNode
        : item,
    );
    setLogicNodes(updatedLogicNodes);
  };

  const deleteLogicNode = (logicNodeId: string | undefined) => {
    if (!logicNodeId) { return; }
    const updatedLogicNodes = logicNodes.filter(
      (item) => item.id !== logicNodeId,
    );
    updateAppData(appData.value);
    setLogicNodes(updatedLogicNodes);
  };

  const getLogicNodeByName = (logicNodeName: string) => {
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
