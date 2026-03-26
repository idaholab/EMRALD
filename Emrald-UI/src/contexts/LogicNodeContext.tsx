import type { LogicNode } from '../types/EMRALD_Model';
import {
  effect,
  type ReadonlySignal,
  useComputed,
} from '@preact/signals-react';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { appData, updateAppData } from '../hooks/useAppData';
import { updateModelAndReferences } from '../utils/UpdateModel';

interface LogicNodeContextType {
  logicNodeList: ReadonlySignal<LogicNode[]>;
  logicNodes: LogicNode[];
  createLogicNode: (logicNode: LogicNode) => void;
  updateLogicNode: (logicNode: LogicNode) => void;
  deleteLogicNode: (logicNodeId?: string) => void;
  getLogicNodeByName: (logicNodeName?: string) => LogicNode | undefined;
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

export const LogicNodeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [logicNodes, setLogicNodes] = useState(
    structuredClone(
      appData.value.LogicNodeList.toSorted((a, b) =>
        a.name.localeCompare(b.name),
      ),
    ),
  );
  const logicNodeList = useComputed(() => appData.value.LogicNodeList);

  effect(() => {
    if (
      JSON.stringify(logicNodes)
      !== JSON.stringify(
        appData.value.LogicNodeList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      )
    ) {
      setLogicNodes(
        appData.value.LogicNodeList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      return;
    }
    return;
  });

  const createLogicNode = (newLogicNode: LogicNode) => {
    updateAppData(updateModelAndReferences(newLogicNode, 'LogicNode'));
  };

  const updateLogicNode = (updatedLogicNode: LogicNode) => {
    updateAppData(updateModelAndReferences(updatedLogicNode, 'LogicNode'));
  };

  const deleteLogicNode = (logicNodeId?: string) => {
    const nodeToDelete = logicNodeList.value.find(
      node => node.id === logicNodeId,
    );
    const updatedLogicNodes = logicNodeList.value.filter(
      item => item.id !== logicNodeId,
    );
    if (nodeToDelete) {
      for (const node of updatedLogicNodes) {
        if (node.gateChildren.includes(nodeToDelete.name)) {
          node.gateChildren = node.gateChildren.filter(
            name => name !== nodeToDelete.name,
          );
        }
      }

      // there is nothing referencing nodes except other nodes and the this takes care of that, so no need to call DeleteItemAndRefs
    }
    updateAppData(
      structuredClone({ ...appData.value, LogicNodeList: updatedLogicNodes }),
    );

    setLogicNodes(logicNodeList.value);
  };

  const getLogicNodeByName = (logicNodeName?: string) =>
    logicNodeList.value.find(node => node.name === logicNodeName);

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
