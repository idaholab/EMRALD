import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LogicNode, LogicNodeList } from '../types/LogicNode';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';

interface LogicNodeContextType {
  logicNodes: LogicNode[];
  createLogicNode: (logicNode: LogicNode) => void;
  updateLogicNode: (logicNode: LogicNode) => void;
  deleteLogicNode: (logicNodeId: number | string) => void;
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

const LogicNodeContextProvider: React.FC<EmraldContextWrapperProps> = ({
  appData,
  updateAppData,
  children,
}) => {
  const [logicNodeList, setLogicNodeList] = useState<LogicNodeList>(
    appData.LogicNodeList,
  );

  // Memoize the value of `diagrams` to avoid unnecessary re-renders
  const logicNodes = useMemo(
    () => logicNodeList.map(({ LogicNode }) => LogicNode),
    [logicNodeList],
  );

  useEffect(() => {
    setLogicNodeList(appData.LogicNodeList as LogicNodeList);
  }, [appData]);

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

  const deleteLogicNode = (logicNodeId: number | string) => {
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
