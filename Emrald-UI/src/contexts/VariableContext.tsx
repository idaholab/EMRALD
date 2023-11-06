import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Variable, VariableList } from '../types/Variable';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';

interface VariableContextType {
  variables: Variable[];
  createVariable: (Variable: Variable) => void;
  updateVariable: (Variable: Variable) => void;
  deleteVariable: (VariableId: number | string) => void;
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

const VariableContextProvider: React.FC<EmraldContextWrapperProps> = ({ appData, updateAppData, children }) => {
  const [variableList, setVariableList] = useState<VariableList>(
    appData.VariableList as VariableList,
  );

  // Memoize the value of `Variables` to avoid unnecessary re-renders
  const variables = useMemo(
    () => variableList.map(({ Variable }) => Variable) as Variable[],
    [variableList],
  );

  useEffect(() => {
    setVariableList(appData.VariableList as VariableList);
  }, [appData]);

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

  const deleteVariable = (VariableId: number | string) => {
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
