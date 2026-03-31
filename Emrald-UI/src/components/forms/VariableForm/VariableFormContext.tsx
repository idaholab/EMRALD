import type {
  AccrualVarTableType,
  Variable,
  VariableType,
} from '@/types/EMRALD_Model';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import { emptyVariable } from '@/contexts/VariableContext';

export interface AccrualStateItem {
  stateName: string;
  type: AccrualVarTableType;
  accrualMult: number;
  multRate: string;
  accrualTable: number[][];
}

interface VariableFormContextType {
  variable: Variable;
  accrualStatesData?: AccrualStateItem[];
  hasError: boolean;
  type: VariableType;
  value: number | string | boolean;
  typeProperties: (keyof Variable)[];
  sync: (values: Partial<Variable>) => void;
  setVariable: Dispatch<SetStateAction<Variable>>;
  setAccrualStatesData: Dispatch<SetStateAction<AccrualStateItem[] | undefined>>;
  setHasError: Dispatch<SetStateAction<boolean>>;
  sortNewStates: (accrualStatesData: AccrualStateItem[]) => AccrualStateItem[];
  setValue: Dispatch<SetStateAction<number | string | boolean>>;
  setType: Dispatch<SetStateAction<VariableType>>;
  setTypeProperties: Dispatch<SetStateAction<(keyof Variable)[]>>;
}

const VariableFormContext = createContext<VariableFormContextType | undefined>(
  undefined,
);

export function useVariableFormContext() {
  const context = useContext(VariableFormContext);
  if (!context) {
    throw new Error(
      'useActionFormContext must be used within an ActionFormContextProvider',
    );
  }
  return context;
}

export const VariableFormContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [variable, setVariable] = useState(emptyVariable);
  const [accrualStatesData, setAccrualStatesData] = useState<AccrualStateItem[]>();
  const [type, setType] = useState<VariableType>('int');
  const [value, setValue] = useState<number | string | boolean>('');
  const [hasError, setHasError] = useState(false);
  const [typeProperties, setTypeProperties] = useState<(keyof Variable)[]>([]);

  const sync = (values: Partial<Variable>) => {
    setVariable(prev => ({ ...prev, ...values }));
  };

  const sortNewStates = (newStateItems: AccrualStateItem[]) =>
    newStateItems.toSorted((a, b) => {
      if (a.stateName && !b.stateName) {
        return 1;
      }
      if (!a.stateName && b.stateName) {
        return -1;
      }
      return 0;
    });

  return (
    <VariableFormContext.Provider
      value={{
        variable,
        accrualStatesData,
        hasError,
        type,
        value,
        typeProperties,
        sync,
        setVariable,
        setAccrualStatesData,
        setHasError,
        sortNewStates,
        setValue,
        setType,
        setTypeProperties,
      }}
    >
      {children}
    </VariableFormContext.Provider>
  );
};
