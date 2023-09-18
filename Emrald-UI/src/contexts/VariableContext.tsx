import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import emraldData from '../emraldData.json';
import { Variable, VariableList } from '../types/Variable';

interface VariableContextType {
  variables: Variable[];
  createVariable: (Variable: Variable) => void;
  updateVariable: (Variable: Variable) => void;
  deleteVariable: (VariableId: number) => void;
  newVariableList: (newVariableList: VariableList) => void;
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

const VariableContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [variableList, setVariableList] = useState<VariableList>(
    emraldData.VariableList as VariableList,
  );

  // Memoize the value of `Variables` to avoid unnecessary re-renders
  const variables = useMemo(
    () => variableList.map(({ Variable }) => Variable) as Variable[],
    [variableList],
  );

  const createVariable = (newVariable: Variable) => {
    const updatedVariableList = [...variableList, { Variable: newVariable }];
    setVariableList(updatedVariableList);
  };

  const updateVariable = (updatedVariable: Variable) => {
    const updatedVariableList = variableList.map((item) =>
      item.Variable.id === updatedVariable.id
        ? { Variable: updatedVariable }
        : item,
    );
    setVariableList(updatedVariableList);
  };

  const deleteVariable = (VariableId: number) => {
    const updatedVariableList = variableList.filter(
      (item) => item.Variable.id !== VariableId,
    );
    setVariableList(updatedVariableList);
  };

  // Open New, Merge, and Clear Event List
  const newVariableList = (newVariableList: VariableList) => {
    setVariableList(newVariableList);
  };

  const clearVariableList = () => {
    setVariableList([]);

    console.log(variableList);
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
