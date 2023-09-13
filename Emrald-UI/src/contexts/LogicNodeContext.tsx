import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import emraldData from '../emraldData.json';
import { LogicNode, LogicNodeList } from '../types/LogicNode';

interface LogicNodeContextType {
  logicNodes: LogicNode[];
  createLogicNode: (logicNode: LogicNode) => void;
  updateLogicNode: (logicNode: LogicNode) => void;
  deleteLogicNode: (logicNodeId: number) => void;
  newLogicNodeList: (newLogicNodeList: LogicNodeList) => void;
  mergeLogicNodeList: (newLogicNodeList: LogicNodeList) => void;
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

const LogicNodeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [logicNodeList, setLogicNodeList] = useState<LogicNodeList>(
    emraldData.LogicNodeList,
  );

  // Memoize the value of `diagrams` to avoid unnecessary re-renders
  const logicNodes = useMemo(
    () => logicNodeList.map(({ LogicNode }) => LogicNode),
    [logicNodeList],
  );

  const createLogicNode = (newLogicNode: LogicNode) => {
    const updatedLogicNodes = [...logicNodeList, { LogicNode: newLogicNode }];
    setLogicNodeList(updatedLogicNodes);
  };

  const updateLogicNode = (updatedLogicNode: LogicNode) => {
    const updatedLogicNodes = logicNodeList.map((item) =>
      item.LogicNode.id === updatedLogicNode.id
        ? { LogicNode: updatedLogicNode }
        : item,
    );
    setLogicNodeList(updatedLogicNodes);
  };

  const deleteLogicNode = (logicNodeId: number) => {
    const updatedLogicNodes = logicNodeList.filter(
      (item) => item.LogicNode.id !== logicNodeId,
    );
    setLogicNodeList(updatedLogicNodes);
  };

  // Open New, Merge, and Clear Diagram List
  const newLogicNodeList = (newLogicNodeList: LogicNodeList) => {
    setLogicNodeList(newLogicNodeList);
  };

  const mergeLogicNodeList = (newLogicNodeList: LogicNodeList) => {
    setLogicNodeList([...logicNodeList, ...newLogicNodeList]);
  };

  const clearLogicNodeList = () => {
    setLogicNodeList([]);
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
