import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Variable } from '../types/Variable';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';

interface VariableContextType {
  variables: Variable[];
  createVariable: (Variable: Variable) => void;
  updateVariable: (Variable: Variable) => void;
  deleteVariable: (VariableId: number | string) => void;
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

const VariableContextProvider: React.FC<EmraldContextWrapperProps> = ({ appData, updateAppData, children }) => {
  const [variables, setVariables] = useState<Variable[]>(
    appData.VariableList,
  );

  // Memoize the value of `Variables` to avoid unnecessary re-renders
  // const variables = useMemo(
  //   () => variableList.map(({ Variable }) => Variable) as Variable[],
  //   [variableList],
  // );

  // useEffect(() => {
  //   setVariableList(appData.VariableList as VariableList);
  // }, [appData]);

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

  const deleteVariable = (VariableId: number | string) => {
    const updatedVariableList = variables.filter(
      (item) => item.id !== VariableId,
    );
    setVariables(updatedVariableList);
  };

  // Open New, Merge, and Clear Event List
  const newVariableList = (newVariableList: VariableList) => {
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
