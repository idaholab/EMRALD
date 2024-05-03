import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Variable } from '../types/Variable';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData } from '../hooks/useAppData';
import { ReadonlySignal, useComputed } from '@preact/signals-react';

interface VariableContextType {
  variables: Variable[];
  variableList: ReadonlySignal<Variable[]>;
  createVariable: (Variable: Variable) => void;
  updateVariable: (Variable: Variable) => void;
  deleteVariable: (VariableId: string | undefined) => void;
  newVariableList: (newVariableList: Variable[]) => void;
  clearVariableList: () => void;
}

const VariableContext = createContext<VariableContextType | undefined>(
  undefined,
);

export function useVariableContext() {
  const context = useContext(VariableContext);
  if (!context) {
    throw new Error(
      'useVariableContext must be used within an VariableContextProvider',
    );
  }
  return context;
}

const VariableContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [variables, setVariables] = useState<Variable[]>(JSON.parse(JSON.stringify(appData.value.VariableList.sort((a,b) => a.name.localeCompare(b.name)))));
  const variableList = useComputed(() => appData.value.VariableList);

  const createVariable = (newVariable: Variable) => {
    const updatedVariableList = [...variables, newVariable];
    setVariables(updatedVariableList);
  };

  const updateVariable = (updatedVariable: Variable) => {
    const updatedVariableList = variables.map((item) =>
      item.id === updatedVariable.id
        ? updatedVariable
        : item,
    );
    setVariables(updatedVariableList);
  };

  const deleteVariable = (VariableId: string | undefined) => {
    if (!VariableId) { return; }
    const updatedVariableList = variables.filter(
      (item) => item.id !== VariableId,
    );
    setVariables(updatedVariableList);
  };

  // Open New, Merge, and Clear Event List
  const newVariableList = (newVariableList: Variable[]) => {
    setVariables(newVariableList);
  };

  const clearVariableList = () => {
    setVariables([]);

    console.log(variables);
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
