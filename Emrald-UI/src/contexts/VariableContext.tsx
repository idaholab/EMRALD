import React, { createContext, useContext, useState } from 'react';
import { Variable } from '../types/Variable';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { MainItemTypes } from '../types/ItemTypes';
import { updateModelAndReferences } from '../utils/UpdateModel';
import { EMRALD_Model } from '../types/EMRALD_Model';

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
    ),
  );
  const variableList = useComputed(() => appData.value.VariableList);

  const createVariable = async (newVariable: Variable) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      newVariable,
      MainItemTypes.Variable,
    );
    updateAppData(updatedModel);
    setVariables(updatedModel.VariableList);
  };

  const updateVariable = async (updatedVariable: Variable) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      updatedVariable,
      MainItemTypes.Variable,
    );

    updateAppData(updatedModel);
    setVariables(updatedModel.VariableList);
  };

  const deleteVariable = (VariableId: string | undefined) => {
    if (!VariableId) {
      return;
    }
    const updatedVariableList = variables.filter((item) => item.id !== VariableId);

    updateAppData(
      JSON.parse(JSON.stringify({ ...appData.value, VariableList: updatedVariableList })),
    );
    setVariables(updatedVariableList);
  };

  // Open New, Merge, and Clear Event List
  const newVariableList = (newVariableList: Variable[]) => {
    setVariables(newVariableList);
  };

  const clearVariableList = () => {
    setVariables([]);
    updateAppData(JSON.parse(JSON.stringify({ ...appData.value, VariableList: [] })));
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
