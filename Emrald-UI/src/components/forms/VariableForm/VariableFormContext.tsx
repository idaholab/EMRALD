import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';

import { Variable } from '../../../types/Variable';
import {
  AccrualVarTableType,
  VariableType,
  VarScope,
} from '../../../types/ItemTypes';

export interface AccrualStateItem {
  stateName: string;
  type: AccrualVarTableType;
  accrualMult: number;
  multRate: string;
  accrualTable: number[][];
}

interface VariableFormContextType {
  accrualStatesData?: AccrualStateItem[];
  setAccrualStatesData: React.Dispatch<
    React.SetStateAction<AccrualStateItem[] | undefined>
  >;
  sortNewStates: (accrualStatesData: AccrualStateItem[]) => AccrualStateItem[];
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
}

const VariableFormContext = createContext<VariableFormContextType | undefined>(
  undefined,
);

export const useVariableFormContext = (): VariableFormContextType => {
  const context = useContext(VariableFormContext);
  if (!context) {
    throw new Error(
      'useActionFormContext must be used within an ActionFormContextProvider',
    );
  }
  return context;
};

const VariableFormContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [accrualStatesData, setAccrualStatesData] =
    useState<AccrualStateItem[]>();
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
    variableData?.accrualStatesData &&
      setAccrualStatesData(variableData.accrualStatesData);
  };

  return (
    <VariableFormContext.Provider
      value={{
        accrualStatesData,
        setAccrualStatesData,
        sortNewStates,
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
      }}
    >
      {children}
    </VariableFormContext.Provider>
  );
};

export default VariableFormContextProvider;
