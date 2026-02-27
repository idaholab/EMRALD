import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
import { emptyLogicNode, useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { useSignal } from '@preact/signals-react';
import type {
  CompChild,
  CompChildItems,
  LogicNode,
  Diagram,
  GateType,
  StateEvalValue,
} from '../../../types/EMRALD_Model';
import { v4 as uuidv4 } from 'uuid';
import type { ComponentStateValue } from './StateValuesTable';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { GetModelItemsReferencing } from '../../../utils/ModelReferences';

interface LogicNodeFormContextType {
  name: string;
  desc: string;
  isRoot: boolean;
  currentNode: CompChildItems | undefined;
  leafNodeType: string | undefined;
  compDiagram: string;
  componentDiagrams: Diagram[];
  defaultValues: boolean;
  gateTypeValue: GateType;
  gateTypeOptions: {
    label: string;
    value: string;
  }[];
  hasError: boolean;
  reqPropsFilled: boolean;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  setGateTypeValue: React.Dispatch<React.SetStateAction<GateType>>;
  setIsRoot: React.Dispatch<React.SetStateAction<boolean>>;
  setLeafNodeType: React.Dispatch<React.SetStateAction<string | undefined>>;
  setCompDiagram: React.Dispatch<React.SetStateAction<string>>;
  setNewCompChild: React.Dispatch<
    React.SetStateAction<
      | {
          diagramName: string;
          stateValues?: { stateName: string; stateValue: StateEvalValue }[];
        }
      | undefined
    >
  >;
  setDefaultValues: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentNodeStateValues: React.Dispatch<React.SetStateAction<ComponentStateValue[]>>;
  handleSave: () => void;
  handleClose: () => void;
  handleNameChange: (newName: string) => void;
  checkForDuplicateNames: () => boolean;
  availableAsTopOrSubtree: () => boolean | undefined;
  initializeForm: (
    logicNodeData: LogicNode | undefined,
    editing: boolean | undefined,
    component?: string,
    parentNodeName?: string,
    nodeType?: 'gate' | 'comp',
    gateType?: GateType,
  ) => void;
}

const LogicNodeFormContext = createContext<LogicNodeFormContextType | undefined>(undefined);

export const useLogicNodeFormContext = (): LogicNodeFormContextType => {
  const context = useContext(LogicNodeFormContext);
  if (!context) {
    throw new Error('useLogicNodeFormContext must be used within a LogicNodeFormContextProvider');
  }
  return context;
};

const LogicNodeFormContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { handleClose, updateTitle } = useWindowContext();
  const { logicNodeList, createLogicNode, updateLogicNode } = useLogicNodeContext();
  const { diagrams } = useDiagramContext();
  // Signals
  const logicNode = useSignal<LogicNode>(structuredClone(emptyLogicNode));
  const compChildren = useSignal<CompChild>([]);
  // States
  const [logicNodeData, setLogicNodeData] = useState<LogicNode | undefined>(undefined);
  const [editing, setEditing] = useState<boolean>();
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [parentNode, setParentNode] = useState<LogicNode | undefined>();
  const [componentDiagrams, setComponentDiagrams] = useState<Diagram[]>([]);
  const [currentNode, setCurrentNode] = useState<CompChildItems | undefined>();
  const [currentNodeStateValues, setCurrentNodeStateValues] = useState<ComponentStateValue[]>([]);
  const [leafNodeType, setLeafNodeType] = useState<string | undefined>();
  const [compDiagram, setCompDiagram] = useState<string>('');
  const [defaultValues, setDefaultValues] = useState<boolean>(false);
  const [newCompChild, setNewCompChild] = useState<
    | {
        diagramName: string;
        stateValues?: { stateName: string; stateValue: StateEvalValue }[];
      }
    | undefined
  >();
  const [gateTypeValue, setGateTypeValue] = useState<GateType>('gtAnd' as GateType);
  const [originalName, setOriginalName] = useState<string | undefined>();
  const [isRoot, setIsRoot] = useState<boolean>(false);
  const [reqPropsFilled, setReqPropsFilled] = useState<boolean>(false);

  useEffect(() => {
    setReqPropsFilled(!!name && !!gateTypeValue);
  }, [name, gateTypeValue]);

  const gateTypeOptions = [
    { label: 'And', value: 'gtAnd' },
    { label: 'Or', value: 'gtOr' },
    { label: 'Not', value: 'gtNot' },
  ];

  const initializeForm = (
    logicNodeInfo: LogicNode | undefined,
    editing: boolean | undefined,
    component?: string,
    parentNodeName?: string,
    nodeType?: 'gate' | 'comp',
    gateType?: GateType,
  ) => {
    setLogicNodeData(logicNodeInfo);
    setEditing(editing);

    if (logicNodeInfo) {
      logicNode.value = logicNodeInfo;
    }

    //Main info
    setName(logicNodeInfo?.name ?? '');
    setOriginalName(logicNodeInfo?.name);
    setDesc(logicNodeInfo?.desc ?? '');
    setGateTypeValue(logicNodeInfo?.gateType ?? ('gtAnd' as GateType));
    setIsRoot(logicNodeInfo?.isRoot ?? false);

    compChildren.value = logicNodeInfo?.compChildren ?? [];
    setComponentDiagrams(
      editing && component
        ? diagrams.filter(
            (diagram) => diagram.diagramType === 'dtSingle' && diagram.name === component,
          )
        : diagrams.filter(
            (diagram) =>
              diagram.diagramType === 'dtSingle' &&
              !logicNode.value.compChildren.find((child) => child.diagramName === diagram.name),
          ),
    );
    const parent = logicNodeList.value.find((node) => node.name === parentNodeName);
    if (nodeType === 'comp' && parent) {
      logicNode.value = parent;
    }
    setParentNode(parent);
    const current = logicNode.value.compChildren.find((child) => child.diagramName === component);
    setCurrentNode(current);
    setCurrentNodeStateValues(current?.stateValues ?? []);
    setLeafNodeType(nodeType);
    setCompDiagram(component ?? '');
    setDefaultValues(current?.stateValues && current.stateValues.length > 0 ? false : true);
    setGateTypeValue(gateType ?? ('gtAnd' as GateType));
  };

  const availableAsTopOrSubtree = () => {
    const currentReferences = GetModelItemsReferencing(logicNode.value.name, 'LogicNode', 1);
    if (currentReferences.LogicNodeList.length >= 1) {
      return false;
    }
    if (logicNode.value.isRoot && parentNode === undefined) {
      return true;
    }
  };

  // Add new comp child
  const handleAddNewCompChild = () => {
    if (newCompChild) {
      const newCompChildren = [...logicNode.value.compChildren, newCompChild];
      compChildren.value = newCompChildren;
      setNewCompChild(undefined);
    }
  };

  const handleNameChange = (newName: string) => {
    const trimmedName = newName.trim();
    const nameExists = logicNodeList.value
      .filter((logicNode) => logicNode.name !== originalName)
      .some((node) => node.name === trimmedName); // Check for invalid characters (allowing spaces, hyphens, and underscores)
    const hasInvalidChars = /[^a-zA-Z0-9-_ ]/.test(trimmedName);
    setHasError(nameExists || hasInvalidChars);
    setName(newName);
  };

  const checkForDuplicateNames = () => {
    const nameExists = logicNodeList.value
      .filter((node) => node.name !== originalName)
      .some((node) => node.name === name.trim());
    return nameExists;
  };

  // Save logic node
  const handleSave = () => {
    handleAddNewCompChild();
    logicNode.value.isRoot = isRoot || false;
    // Reset the stateValues if the defaultValues checkbox is checked
    if (defaultValues && currentNode) {
      currentNode.stateValues = [];
    } else if (currentNode?.stateValues && !defaultValues) {
      currentNode.stateValues = currentNodeStateValues;
    }

    logicNode.value = {
      ...logicNode.value,
      ...(leafNodeType !== 'comp' && {
        id: logicNodeData?.id ?? uuidv4(),
        name: name.trim(),
        desc,
        gateType: gateTypeValue,
      }),
      compChildren: compChildren.value,
    };

    if (logicNodeData?.isRoot) {
      updateTitle(logicNodeData.name, name);
    }

    if (editing || leafNodeType === 'comp') {
      updateLogicNode(logicNode.value);
    } else if (leafNodeType === 'gate' && parentNode?.name) {
      createLogicNode(logicNode.value);
      parentNode.gateChildren = [...parentNode.gateChildren, logicNode.value.name];
      updateLogicNode(parentNode);
    } else {
      createLogicNode(logicNode.value);
    }
    handleClose();
  };

  return (
    <LogicNodeFormContext.Provider
      value={{
        name,
        desc,
        leafNodeType,
        compDiagram,
        componentDiagrams,
        defaultValues,
        currentNode,
        gateTypeValue,
        gateTypeOptions,
        isRoot,
        hasError,
        reqPropsFilled,
        setDesc,
        setGateTypeValue,
        setLeafNodeType,
        setCompDiagram,
        setNewCompChild,
        setDefaultValues,
        setCurrentNodeStateValues,
        setIsRoot,
        handleNameChange,
        handleSave,
        handleClose,
        checkForDuplicateNames,
        availableAsTopOrSubtree,
        initializeForm,
      }}
    >
      {children}
    </LogicNodeFormContext.Provider>
  );
};

export default LogicNodeFormContextProvider;
