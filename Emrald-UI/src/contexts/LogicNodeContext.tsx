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
import {
  ClearIncomingRefsExceptTypes,
  formatClearedRefsMessage,
  updateModelAndReferences,
} from '../utils/UpdateModel';
import { useAlertContext } from './AlertContext';

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
  const { showAlert } = useAlertContext();

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
    if (!logicNodeId) {
      return;
    }
    const nodeToDelete = logicNodeList.value.find(
      node => node.id === logicNodeId,
    );
    if (!nodeToDelete) {
      return;
    }

    // Clear incoming references whose target type isn't LogicNode (e.g. event.logicTop).
    // LogicNode → LogicNode gateChildren cleanup is owned by the recursive cascade in
    // useLogicTreeDiagram (which decides which children to delete vs. unlink based on
    // isRoot / shared-ness), so skip that row here to avoid a competing splice.
    const { model: clearedModel, clearedRefs } = ClearIncomingRefsExceptTypes(
      nodeToDelete,
      ['LogicNode'],
      appData.value,
    );

    // Preserve existing manual gateChildren cleanup + node removal.
    const updatedLogicNodes = clearedModel.LogicNodeList.filter(
      item => item.id !== logicNodeId,
    );
    for (const node of updatedLogicNodes) {
      if (node.gateChildren.includes(nodeToDelete.name)) {
        node.gateChildren = node.gateChildren.filter(
          name => name !== nodeToDelete.name,
        );
      }
    }

    updateAppData(
      structuredClone({ ...clearedModel, LogicNodeList: updatedLogicNodes }),
    );

    setLogicNodes(logicNodeList.value);

    const msg = formatClearedRefsMessage(
      'LogicNode',
      nodeToDelete.name,
      clearedRefs,
    );
    if (msg) {
      showAlert(msg, 'warning');
    }
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
