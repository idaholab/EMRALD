import React, { createContext, useContext, useState } from 'react';
import { Variable } from '../types/Variable';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { effect, ReadonlySignal, useComputed } from '@preact/signals-react';
import { MainItemTypes } from '../types/ItemTypes';
import { DeleteItemAndRefs, updateModelAndReferences } from '../utils/UpdateModel';
import { EMRALD_Model } from '../types/EMRALD_Model';

interface VariableContextType {
  variables: Variable[];
  variableList: ReadonlySignal<Variable[]>;
  createVariable: (Variable: Variable) => Promise<void>;
  updateVariable: (Variable: Variable) => Promise<void>;
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
    ),
  );
  const variableList = useComputed(() => appData.value.VariableList);
  
  effect(() => {
    if (JSON.stringify(variables) !== JSON.stringify(appData.value.VariableList.sort((a, b) => a.name.localeCompare(b.name)))) {
      setVariables(appData.value.VariableList.sort((a, b) => a.name.localeCompare(b.name)));
      return;
    }
    return;
  });

  const createVariable = async (newVariable: Variable) => {
    return new Promise<void>(async (resolve) => {
      var updatedModel: EMRALD_Model = await updateModelAndReferences(
        newVariable,
        MainItemTypes.Variable,
      );
      updateAppData(updatedModel);
      setVariables(updatedModel.VariableList);
      resolve();
    });
  };

  const updateVariable = async (updatedVariable: Variable) => {
    return new Promise<void>(async (resolve) => {
      var updatedModel: EMRALD_Model = await updateModelAndReferences(
        updatedVariable,
        MainItemTypes.Variable,
      );
      updateAppData(updatedModel);
      setVariables(updatedModel.VariableList);
      resolve();
    });
  };

  const deleteVariable = (VariableId: string | undefined) => {
    if (!VariableId) {
      return;
    }
    const variableToDelete = variables.find((variable) => variable.id === VariableId);
    
    if (variableToDelete) {
      const updatedEMRALDModel: EMRALD_Model = JSON.parse(JSON.stringify(appData.value));
      if (variableToDelete) {
        return new Promise<void>(async (resolve) => {
          var updatedModel: EMRALD_Model = await DeleteItemAndRefs(variableToDelete);
        
          updateAppData(updatedModel);
          setVariables(updatedModel.VariableList);
        });
      }
      //todo else error, no variable to delete
    }
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
