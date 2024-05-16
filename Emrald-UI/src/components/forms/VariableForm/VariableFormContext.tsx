import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
import { v4 as uuidv4 } from 'uuid';
import { emptyVariable, useVariableContext } from '../../../contexts/VariableContext';

import { Variable } from '../../../types/Variable';
import { AccrualVarTableType, DocVarType, VariableType, VarScope } from '../../../types/ItemTypes';
import { SelectChangeEvent } from '@mui/material';
import { useSignal } from '@preact/signals-react';

export interface AccrualStateItem {
  stateName: string;
  type: AccrualVarTableType;
  accrualMult: number;
  multRate: string;
  accrualTable: number[][];
}

interface VariableFormContextType {
  accrualStatesData?: AccrualStateItem[];

  name: string;
  namePrefix: string | undefined;
  desc: string;
  type: VariableType;
  varScope: VarScope;
  value: number | string | boolean;
  sim3DId?: string;
  resetOnRuns?: boolean;
  docType?: string;
  docPath?: string;
  docLink?: string;
  pathMustExist?: boolean;
  setAccrualStatesData: React.Dispatch<React.SetStateAction<AccrualStateItem[] | undefined>>;
  sortNewStates: (accrualStatesData: AccrualStateItem[]) => AccrualStateItem[];
  InitializeForm: (variableData?: Variable | undefined) => void;
  setNamePrefix: React.Dispatch<React.SetStateAction<string | undefined>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  handleClose: () => void;
  setValue: React.Dispatch<React.SetStateAction<number | string | boolean>>;
  setType: React.Dispatch<React.SetStateAction<VariableType>>;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  setResetOnRuns: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setDocType: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDocPath: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDocLink: React.Dispatch<React.SetStateAction<string | undefined>>;
  setVarScope: React.Dispatch<React.SetStateAction<VarScope>>;
  setSim3DId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPathMustExist: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  handleTypeChange: (newType: VariableType) => void;
  handleNameChange: (updatedName: string) => void;
  handleSave: (variableData?: Variable) => void;
  handleFloatValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBoolValueChange: (e: SelectChangeEvent<string>) => void;
  handleStringValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VariableFormContext = createContext<VariableFormContextType | undefined>(undefined);

export const useVariableFormContext = (): VariableFormContextType => {
  const context = useContext(VariableFormContext);
  if (!context) {
    throw new Error('useActionFormContext must be used within an ActionFormContextProvider');
  }
  return context;
};

const VariableFormContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [accrualStatesData, setAccrualStatesData] = useState<AccrualStateItem[]>();
  const { handleClose } = useWindowContext();
  const [name, setName] = useState<string>('');
  const [namePrefix, setNamePrefix] = useState<string>();
  const [desc, setDesc] = useState<string>('');
  const [type, setType] = useState<VariableType>('int');
  const [varScope, setVarScope] = useState<VarScope>('gtGlobal');
  const [value, setValue] = useState<number | string | boolean>('');
  const [sim3DId, setSim3DId] = useState<string>();
  const [resetOnRuns, setResetOnRuns] = useState<boolean>();
  const [docType, setDocType] = useState<string>();
  const [docPath, setDocPath] = useState<string>();
  const [docLink, setDocLink] = useState<string>();
  const [pathMustExist, setPathMustExist] = useState<boolean | undefined>();

  const variable = useSignal<Variable>(emptyVariable);
  const { updateVariable, createVariable } = useVariableContext();

  const sortNewStates = (newStateItems: AccrualStateItem[]) => {
    return newStateItems.sort((a, b) => {
      if (a.stateName && !b.stateName) {
        return 1;
      }
      if (!a.stateName && b.stateName) {
        return -1;
      }
      return 0;
    });
  };
  const InitializeForm = (variableData?: Variable | undefined) => {
    if (variableData?.name) {
      setName(variableData.name);
      const prefix: string = variableData.name.split('_')[0] + '_';
      setNamePrefix(prefix);
    } else {
      setNamePrefix('Int_');
    }
    setDesc(variableData?.desc || '');
    setType(variableData?.type || 'int');
    setVarScope(variableData?.varScope || 'gtGlobal');
    variableData?.value && setValue(String(variableData.value));
    variableData?.sim3DId && setSim3DId(variableData.sim3DId);
    variableData?.resetOnRuns && setResetOnRuns(variableData.resetOnRuns);
    variableData?.docType && setDocType(variableData.docType);
    variableData?.docPath && setDocPath(variableData.docPath);
    variableData?.docLink && setDocLink(variableData.docLink);
    variableData?.pathMustExist && setPathMustExist(variableData.pathMustExist);
    variableData?.accrualStatesData && setAccrualStatesData(variableData.accrualStatesData);
  };

  // Maps 'type' values to their corresponding prefixes.
  const PREFIXES: Record<string, string> = {
    string: 'Str_',
    double: 'Dbl_',
    bool: 'Bool_',
    default: 'Int_',
  };

  const handleTypeChange = (newType: VariableType) => {
    const updatedPrefix: string = PREFIXES[newType] || PREFIXES.default;
    setNamePrefix(updatedPrefix);

    const nameWithoutPrefix: string = name ? name.split('_')[1] : '';

    setName(`${updatedPrefix}${nameWithoutPrefix}`);

    if (newType === 'bool') setValue('');
  };

  const handleNameChange = (updatedName: string) => {
    if (namePrefix) {
      const hasPrefix = updatedName.startsWith(namePrefix);

      // Set the name with the appropriate prefix
      setName(hasPrefix ? updatedName : `${namePrefix}${updatedName}`);
    }
  };

  const handleSave = (variableData?: Variable) => {
    variable.value = {
      ...variable.value,
      id: variableData?.id || uuidv4(),
      type,
      name,
      desc,
      varScope,
      sim3DId,
      docType: docType as DocVarType,
      docPath,
      docLink,
      pathMustExist,
      value,
      accrualStatesData,
      resetOnRuns,
    };

    variableData ? updateVariable(variable.value) : createVariable(variable.value);
    handleClose();
  };

  const handleFloatValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(e.target.value); // Convert string to number
    if (!isNaN(parsedValue)) {
      // check if the value is a number
      setValue(parsedValue);
    } else {
      setValue('');
    }
  };
  const handleBoolValueChange = (e: SelectChangeEvent<string>) => {
    const boolValue: boolean = e.target.value === 'true';
    setValue(boolValue);
  };
  const handleStringValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <VariableFormContext.Provider
      value={{
        accrualStatesData,
        name,
        namePrefix,
        desc,
        type,
        varScope,
        value,
        sim3DId,
        resetOnRuns,
        docType,
        docPath,
        docLink,
        pathMustExist,
        setAccrualStatesData,
        sortNewStates,
        InitializeForm,
        setNamePrefix,
        setName,
        handleClose,
        setValue,
        setType,
        setDesc,
        setResetOnRuns,
        setDocType,
        setDocPath,
        setDocLink,
        setVarScope,
        setSim3DId,
        setPathMustExist,
        handleTypeChange,
        handleNameChange,
        handleSave,
        handleFloatValueChange,
        handleBoolValueChange,
        handleStringValueChange,
      }}
    >
      {children}
    </VariableFormContext.Provider>
  );
};

export default VariableFormContextProvider;
