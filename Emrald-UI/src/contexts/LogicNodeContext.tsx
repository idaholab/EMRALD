import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LogicNode } from '../types/LogicNode';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';

interface LogicNodeContextType {
  logicNodes: LogicNode[];
  createLogicNode: (logicNode: LogicNode) => void;
  updateLogicNode: (logicNode: LogicNode) => void;
  deleteLogicNode: (logicNodeId: number | string) => void;
  newLogicNodeList: (newLogicNodeList: LogicNode[]) => void;
  mergeLogicNodeList: (newLogicNodeList: LogicNode[]) => void;
  clearLogicNodeList: () => void;
}

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
  appData,
  updateAppData,
  children,
}) => {
  const [logicNodes, setLogicNodes] = useState<LogicNode[]>(appData.LogicNodeList);

  // Memoize the value of `diagrams` to avoid unnecessary re-renders
  // const logicNodes = useMemo(
  //   () => logicNodeList.map(({ LogicNode }) => LogicNode),
  //   [logicNodeList],
  // );

  // useEffect(() => {
  //   setLogicNodes(appData.LogicNodeList as LogicNodeList);
  // }, [appData]);

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

  const deleteLogicNode = (logicNodeId: number | string) => {
    const updatedLogicNodes = logicNodes.filter(
      (item) => item.id !== logicNodeId,
    );
    setLogicNodes(updatedLogicNodes);
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
