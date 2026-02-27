import React, { createContext, useContext, useState } from 'react';
import type { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { effect, type ReadonlySignal, useComputed } from '@preact/signals-react';
import { DeleteItemAndRefs, updateModelAndReferences } from '../utils/UpdateModel';
import type { EMRALD_Model, Variable } from '../types/EMRALD_Model';

interface VariableContextType {
  variables: Variable[];
  variableList: ReadonlySignal<Variable[]>;
  createVariable: (Variable: Variable) => void;
  updateVariable: (Variable: Variable) => void;
  deleteVariable: (VariableId: string | undefined) => void;
  newVariableList: (newVariableList: Variable[]) => void;
  clearVariableList: () => void;
}

export const emptyVariable: Variable = {
  name: '',
  varScope: 'gtGlobal',
  value: '',
  type: 'int',
  objType: 'Variable',
};

const VariableContext = createContext<VariableContextType | undefined>(undefined);

export function useVariableContext() {
  const context = useContext(VariableContext);
  if (!context) {
    throw new Error('useVariableContext must be used within an VariableContextProvider');
  }
  return context;
}

const VariableContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [variables, setVariables] = useState<Variable[]>(
    JSON.parse(
      JSON.stringify(appData.value.VariableList.sort((a, b) => a.name.localeCompare(b.name))),
    ) as Variable[],
  );
  const variableList = useComputed(() => appData.value.VariableList);

  effect(() => {
    if (
      JSON.stringify(variables) !==
      JSON.stringify(appData.value.VariableList.sort((a, b) => a.name.localeCompare(b.name)))
    ) {
      setVariables(appData.value.VariableList.sort((a, b) => a.name.localeCompare(b.name)));
      return;
    }
    return;
  });

  const createVariable = (newVariable: Variable) => {
    const updatedModel = updateModelAndReferences(newVariable, 'Variable');
    updateAppData(updatedModel);
  };

  const updateVariable = (updatedVariable: Variable) => {
    const updatedModel = updateModelAndReferences(updatedVariable, 'Variable');
    updateAppData(updatedModel);
  };

  const deleteVariable = (VariableId: string | undefined) => {
    if (!VariableId) {
      return;
    }
    const variableToDelete = variables.find((variable) => variable.id === VariableId);
    if (variableToDelete) {
      const updatedModel = DeleteItemAndRefs(variableToDelete);
      updateAppData(updatedModel);
    }
  };

  // Open New, Merge, and Clear Event List
  const newVariableList = (newVariableList: Variable[]) => {
    setVariables(newVariableList);
  };

  const clearVariableList = () => {
    updateAppData(
      JSON.parse(JSON.stringify({ ...appData.value, VariableList: [] })) as EMRALD_Model,
    );
  };

  return (
    <VariableContext.Provider
      value={{
        variables,
        variableList,
        createVariable,
        updateVariable,
        deleteVariable,
        newVariableList,
        clearVariableList,
      }}
    >
      {children}
    </VariableContext.Provider>
  );
};

export default VariableContextProvider;
