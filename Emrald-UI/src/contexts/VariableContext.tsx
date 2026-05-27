import type { Variable } from '../types/EMRALD_Model';
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
import { appData, updateAppData } from '../hooks/useAppData';
import {
  type ClearedRef,
  DeleteItemAndRefs,
  formatClearedRefsMessage,
  updateModelAndReferences,
} from '../utils/UpdateModel';
import { useAlertContext } from './AlertContext';

interface VariableContextType {
  variables: Variable[];
  variableList: ReadonlySignal<Variable[]>;
  createVariable: (Variable: Variable) => void;
  updateVariable: (Variable: Variable) => void;
  deleteVariable: (VariableId?: string) => void;
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

export const VariableContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [variables, setVariables] = useState(
    structuredClone(
      appData.value.VariableList.toSorted((a, b) =>
        a.name.localeCompare(b.name),
      ),
    ),
  );
  const variableList = useComputed(() => appData.value.VariableList);
  const { showAlert } = useAlertContext();

  effect(() => {
    if (
      JSON.stringify(variables)
      !== JSON.stringify(
        appData.value.VariableList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      )
    ) {
      setVariables(
        appData.value.VariableList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      return;
    }
    return;
  });

  const createVariable = (newVariable: Variable) => {
    updateAppData(updateModelAndReferences(newVariable, 'Variable'));
  };

  const updateVariable = (updatedVariable: Variable) => {
    updateAppData(updateModelAndReferences(updatedVariable, 'Variable'));
  };

  const deleteVariable = (VariableId?: string) => {
    if (!VariableId) {
      return;
    }
    const variableToDelete = variables.find(
      variable => variable.id === VariableId,
    );
    if (variableToDelete) {
      const clearedRefs: ClearedRef[] = [];
      updateAppData(DeleteItemAndRefs(variableToDelete, clearedRefs));
      const msg = formatClearedRefsMessage(
        'Variable',
        variableToDelete.name,
        clearedRefs,
      );
      if (msg) {
        showAlert(msg, 'warning');
      }
    }
  };

  // Open New, Merge, and Clear Event List
  const newVariableList = (newVariableList: Variable[]) => {
    setVariables(newVariableList);
  };

  const clearVariableList = () => {
    updateAppData(structuredClone({ ...appData.value, VariableList: [] }));
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
