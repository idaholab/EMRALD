import type { SelectChangeEvent } from '@mui/material/Select';
import type {
  Action,
  ActionType,
  DistributionType,
  Event,
  EventDistributionParameter,
  MAAPFormData,
  NewState,
  State,
} from '../../../types/EMRALD_Model';
import { useSignal } from '@preact/signals-react';
import {
  type ChangeEvent,
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { emptyAction, useActionContext } from '../../../contexts/ActionContext';
import { useVariableContext } from '../../../contexts/VariableContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import { appData } from '../../../hooks/useAppData';

export interface NewStateItem {
  id: string;
  toState: string;
  prob?: number | string | null;
  varProb?: string | null;
  failDesc?: string;
  remaining: boolean;
  probType: string;
}

export type sim3DMessageType =
  | 'atCompModify'
  | 'atOpenSim'
  | 'atCancelSim'
  | 'atPing';

export type ReturnProcessType = 'rtVar' | 'rtNone' | 'rtStateList';

interface ActionFormContextType {
  name: string;
  desc: string;
  actType: ActionType;
  newStateItems?: NewStateItem[];
  mutuallyExclusive?: boolean;
  variableName?: string;
  codeVariables: string[];
  scriptCode?: string;
  useDistribution?: boolean;
  distType?: DistributionType;
  distParameters?: EventDistributionParameter[];
  sim3DMessage?: sim3DMessageType;
  extSim?: string;
  sim3DId: string;
  sim3DConfigData?: string;
  sim3DModelRef?: string;
  simEndTime?: string;
  openSimVarParams?: boolean;
  makeInputFileCode?: string;
  exePath?: string;
  exeFromPreCode: boolean;
  processOutputFileCode?: string;
  formData?: MAAPFormData;
  hasError: boolean;
  errorMessage: string;
  actionTypeOptions: { value: string; label: string }[];
  raType?: string;
  returnProcess?: ReturnProcessType;
  reqPropsFilled: boolean;
  errorItemIds: Set<string>;
  setReqPropsFilled: Dispatch<SetStateAction<boolean>>;
  setName: Dispatch<SetStateAction<string>>;
  setDesc: Dispatch<SetStateAction<string>>;
  setActType: Dispatch<SetStateAction<ActionType>>;
  setMutuallyExclusive: Dispatch<SetStateAction<boolean | undefined>>;
  setVariableName: Dispatch<SetStateAction<string | undefined>>;
  setScriptCode: Dispatch<SetStateAction<string | undefined>>;
  setUseDistribution: Dispatch<SetStateAction<boolean | undefined>>;
  setDistType: Dispatch<SetStateAction<DistributionType | undefined>>;
  setDistParameters: Dispatch<
    SetStateAction<EventDistributionParameter[] | undefined>
  >;
  setSim3DMessage: Dispatch<SetStateAction<sim3DMessageType | undefined>>;
  setExtSim: Dispatch<SetStateAction<string | undefined>>;
  setSim3DId: Dispatch<SetStateAction<string>>;
  setSim3DConfigData: Dispatch<SetStateAction<string | undefined>>;
  setSim3DModelRef: Dispatch<SetStateAction<string | undefined>>;
  setSimEndTime: Dispatch<SetStateAction<string | undefined>>;
  setOpenSimVarParams: Dispatch<SetStateAction<boolean | undefined>>;
  addToUsedVariables: (variableName: string) => void;
  setCodeVariables: Dispatch<SetStateAction<string[]>>;
  setNewStateItems: Dispatch<SetStateAction<NewStateItem[] | undefined>>;
  setMakeInputFileCode: Dispatch<SetStateAction<string | undefined>>;
  setExePath: Dispatch<SetStateAction<string | undefined>>;
  setExeFromPreCode: Dispatch<SetStateAction<boolean>>;
  setProcessOutputFileCode: Dispatch<SetStateAction<string | undefined>>;
  setFormData: Dispatch<SetStateAction<MAAPFormData | undefined>>;
  setHasError: Dispatch<SetStateAction<boolean>>;
  checkForDuplicateNames: () => boolean;
  handleNameChange: (newName: string) => void;
  handleSave: (event?: Event, state?: State) => void;
  handleSelectChange: (event: SelectChangeEvent, item: NewStateItem) => void;
  handleProbChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    item: NewStateItem,
  ) => void;
  handleProbBlur: (item: NewStateItem) => void;
  handleRemainingChange: (
    event: ChangeEvent<HTMLInputElement>,
    item: NewStateItem,
  ) => void;
  handleProbTypeChange: (
    event: ChangeEvent<HTMLInputElement>,
    item: NewStateItem,
  ) => void;
  handleMutuallyExclusiveChange: (value: boolean) => void;
  handleDeleteToStateItem: (itemToDeleteId: string) => void;
  sortNewStates: (newStateItems?: NewStateItem[]) => NewStateItem[] | undefined;
  initializeForm: (actionData?: Action) => void;
  reset: () => void;
  setRaType: Dispatch<SetStateAction<string | undefined>>;
  setReturnProcess: Dispatch<SetStateAction<ReturnProcessType | undefined>>;
}

const ActionFormContext = createContext<ActionFormContextType | undefined>(
  undefined,
);

export function useActionFormContext(): ActionFormContextType {
  const context = useContext(ActionFormContext);
  if (!context) {
    throw new Error(
      'useActionFormContext must be used within an ActionFormContextProvider',
    );
  }
  return context;
}
export const ActionFormContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { handleClose } = useWindowContext();
  const { actionsList, updateAction, createAction } = useActionContext();
  const [actionData, setActionData] = useState<Action | undefined>(undefined);
  const action = useSignal(emptyAction);
  // main items
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [actType, setActType] = useState<ActionType>('atTransition');
  // transition items
  const [mutuallyExclusive, setMutuallyExclusive] = useState<
    boolean | undefined
  >(true);
  const [newStateItems, setNewStateItems] = useState<
    NewStateItem[] | undefined
  >();
  // cngVarVal items
  const [codeVariables, setCodeVariables] = useState<string[]>([]);
  const [variableName, setVariableName] = useState<string | undefined>();
  const [scriptCode, setScriptCode] = useState<string | undefined>();
  const [useDistribution, setUseDistribution] = useState<boolean | undefined>();
  const [distType, setDistType] = useState<DistributionType | undefined>();
  const [distParameters, setDistParameters] = useState<
    EventDistributionParameter[] | undefined
  >();
  // extSimMsg items
  const [sim3DMessage, setSim3DMessage] = useState<
    sim3DMessageType | undefined
  >();
  const [extSim, setExtSim] = useState<string | undefined>();
  const [sim3DId, setSim3DId] = useState('');
  const [sim3DConfigData, setSim3DConfigData] = useState<string | undefined>();
  const [sim3DModelRef, setSim3DModelRef] = useState<string | undefined>();
  const [openSimVarParams, setOpenSimVarParams] = useState<
    boolean | undefined
  >();
  const [simEndTime, setSimEndTime] = useState<string | undefined>();
  // runExtApp items
  const [makeInputFileCode, setMakeInputFileCode] = useState<
    string | undefined
  >();
  const [processOutputFileCode, setProcessOutputFileCode] = useState<
    string | undefined
  >();
  const [formData, setFormData] = useState<MAAPFormData>();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [raType, setRaType] = useState<string | undefined>();
  const [reqPropsFilled, setReqPropsFilled] = useState<boolean>(false);
  const [originalName, setOriginalName] = useState<string>();
  const [exePath, setExePath] = useState(formData?.exePath);
  const [exeFromPreCode, setExeFromPreCode] = useState(false);
  const { updateVariable, createVariable } = useVariableContext();
  const [returnProcess, setReturnProcess] = useState<
    ReturnProcessType | undefined
  >();
  const [errorItemIds, setErrorIds] = useState<Set<string>>(new Set());

  const actionTypeOptions = [
    { value: 'atTransition', label: 'Transition' },
    { value: 'atCngVarVal', label: 'Change Var Value' },
    { value: 'at3DSimMsg', label: 'Ext. Sim Message' },
    { value: 'atRunExtApp', label: 'Run Application' },
  ];

  const isRemainingProbability = (prob?: number | string | null) =>
    Number(prob) === -1;

  useEffect(() => {
    setReqPropsFilled(!!name && !!actType);
  }, [name, actType]);

  const handleMutuallyExclusiveChange = (value: boolean) => {
    if (newStateItems) {
      const updatedItems = newStateItems.map(newStateItem =>
        !value && isRemainingProbability(newStateItem.prob)
          ? { ...newStateItem, remaining: false, prob: '1.0' }
          : !value
            ? { ...newStateItem, remaining: false }
            : newStateItem,
      );

      for (const newStateItem of updatedItems) {
        checkProbability(newStateItem, updatedItems, value);
      }
      setNewStateItems(updatedItems);
    }
    setMutuallyExclusive(value);
  };

  const handleNameChange = (newName: string) => {
    const trimmedName = newName.trim();
    setHasError(
      actionsList.value
        .filter(action => action.name !== originalName)
        .some(node => node.name === trimmedName)
        || /[^a-zA-Z0-9-_ ]/.test(trimmedName),
    );
    setName(newName);
  };

  const checkForDuplicateNames = () =>
    actionsList.value
      .filter(action => action.name !== originalName)
      .some(node => node.name === name.trim());

  const checkProbability = (
    updatedItem: NewStateItem,
    updateItems?: NewStateItem[],
    updatedMutuallyExclusive?: boolean,
    updatedRemaining?: boolean,
  ) => {
    if (!updatedItem.prob) {
      setErrorIds(
        prevErrorItemIds => new Set([...prevErrorItemIds, updatedItem.id]),
      );
      setErrorMessage('Must contain a value');
      setHasError(true);
    }

    if (updatedMutuallyExclusive ?? mutuallyExclusive) {
      const totalProb =
        updateItems?.reduce(
          (acc, item) =>
            isRemainingProbability(item.prob) ? acc : acc + Number(item.prob),
          0,
        ) ?? 0;
      const hasRemaining =
        updatedRemaining === true || updateItems?.some(item => item.remaining);
      const normalizedTotal = (hasRemaining ? 1 - totalProb : 0) + totalProb;

      if (totalProb !== 1 && normalizedTotal !== 1) {
        setErrorIds(
          prevErrorItemIds => new Set([...prevErrorItemIds, updatedItem.id]),
        );
        setErrorMessage(
          'Combined mutually exclusive probabilities must equal 1',
        );
        setHasError(true);
      } else {
        setErrorIds(
          prevErrorItemIds =>
            new Set([...prevErrorItemIds].filter(id => id !== updatedItem.id)),
        );
        setHasError(false);
        setErrorMessage('');
      }
    } else {
      const probValue = Number(updatedItem.prob);
      if (probValue > 1) {
        setErrorIds(
          prevErrorItemIds => new Set([...prevErrorItemIds, updatedItem.id]),
        );
        setErrorMessage(
          'Probabilities must be greater than 0 and not exceed 1',
        );
        setHasError(true);
      } else {
        setErrorIds(
          prevErrorItemIds =>
            new Set([...prevErrorItemIds].filter(id => id !== updatedItem.id)),
        );
        setErrorMessage('');
        setHasError(false);
      }
    }
  };

  const handleSave = (event?: Event, state?: State) => {
    const savedMutuallyExclusive = mutuallyExclusive ?? true;
    const shouldSaveMutuallyExclusive =
      actionData?.mutExcl !== undefined || !savedMutuallyExclusive;
    const getSavedProbability = (newStateItem: NewStateItem) => {
      const probability = Number(newStateItem.prob);
      return !savedMutuallyExclusive && isRemainingProbability(probability)
        ? 1.0
        : probability;
    };

    action.value = {
      ...action.value,
      id: actionData?.id ?? uuidv4(),
      name: name.trim(),
      desc,
      actType,
      newStates: newStateItems
        ? newStateItems.map(
            (newStateItem): NewState =>
              newStateItem.probType === 'fixed'
                ? {
                    toState: newStateItem.toState,
                    prob: getSavedProbability(newStateItem),
                    failDesc: newStateItem.failDesc ?? '',
                  }
                : {
                    toState: newStateItem.toState,
                    prob: getSavedProbability(newStateItem),
                    failDesc: newStateItem.failDesc ?? '',
                    varProb: newStateItem.varProb,
                  },
          )
        : undefined,
      mutExcl: shouldSaveMutuallyExclusive ? savedMutuallyExclusive : undefined,
      codeVariables: ['atCngVarVal', 'atRunExtApp'].includes(actType)
        ? codeVariables
        : undefined,
      variableName,
      scriptCode:
        actType === 'atCngVarVal' && useDistribution ? undefined : scriptCode,
      useDistribution:
        actType === 'atCngVarVal' && useDistribution ? true : undefined,
      distType:
        actType === 'atCngVarVal' && useDistribution ? distType : undefined,
      parameters:
        actType === 'atCngVarVal' && useDistribution
          ? distParameters?.map(p => {
              // atCngVarVal distribution mode treats variable values as raw numbers,
              // so strip any timeRate that may have been left over from the schema's
              // shared EventDistributionParameter shape.
              const { timeRate: _ignored, ...rest } = p;
              return rest;
            })
          : undefined,
      sim3DMessage,
      extSim,
      sim3DConfigData,
      sim3DModelRef,
      simEndTime,
      makeInputFileCode,
      exePath,
      ...(actType === 'atRunExtApp' ? { ExeFromPreCode: exeFromPreCode } : {}),
      processOutputFileCode,
      openSimVarParams,
      mainItem: true,
      formData,
      raType,
      returnProcess,
    };
    checkFormData();

    actionData
      ? updateAction(action.value)
      : createAction(action.value, event, state);
    handleClose();
  };

  const checkFormData = () => {
    if (formData?.docLinkVariable !== undefined) {
      const variableList = structuredClone(appData.value.VariableList);
      const docLinkVariables = variableList.filter(
        ({ varScope }) => varScope === 'gtDocLink',
      );
      if (
        docLinkVariables
          .map(({ name }) => name)
          .includes(formData.docLinkVariable)
      ) {
        const variable = docLinkVariables.find(
          ({ name }) => name === formData.docLinkVariable,
        );
        if (variable) {
          variable.docType = 'dtTextRegEx';
          variable.docLink = 'CORE UNCOVERY';
          variable.pathMustExist = false;
          variable.numChars = 11;
          variable.begPosition = 28;
          variable.regExpLine = 0;
          // update app data with the new variable information
          updateVariable(variable);
        }
      } else {
        // create a new variable with the new information
        if (
          !variableList.some(({ name }) => name === formData.docLinkVariable)
        ) {
          createVariable({
            name: formData.docLinkVariable || 'maapDocLink',
            desc: 'Link to CoreUncoveryTime from MAAP (hours)',
            id: uuidv4(),
            docType: 'dtTextRegEx',
            objType: 'Variable',
            varScope: 'gtDocLink',
            docPath: 'C:/testSimanij_FLEX/temp.log',
            value: 0,
            type: 'double',
            docLink: 'CORE UNCOVERY',
            pathMustExist: false,
            numChars: 11,
            begPosition: 28,
            regExpLine: 0,
          });
        }
        formData.docLinkVariable = formData.docLinkVariable || 'maapDocLink';
      }
    }
  };

  const sortNewStates = (newStateItems?: NewStateItem[]) =>
    newStateItems?.toSorted((a, b) => {
      if (a.remaining && !b.remaining) {
        return 1;
      }
      if (!a.remaining && b.remaining) {
        return -1;
      }
      return 0;
    });

  const addToUsedVariables = (variableName: string) => {
    if (codeVariables.includes(variableName)) {
      setCodeVariables(codeVariables.filter(item => item !== variableName));
    } else {
      setCodeVariables([...codeVariables, variableName]);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent, item: NewStateItem) => {
    setNewStateItems(
      newStateItems?.map(newItem =>
        newItem === item
          ? { ...newItem, varProb: event.target.value }
          : newItem,
      ),
    );
  };

  const handleProbChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    updatedItem: NewStateItem,
  ) => {
    setHasError(false);
    setNewStateItems(prevItems =>
      prevItems?.map(item =>
        item.id === updatedItem.id
          ? {
              ...item,
              prob: Number(event.target.value) < 0 ? 0 : event.target.value,
            }
          : item,
      ),
    );
  };

  const handleProbBlur = (updatedItem: NewStateItem) => {
    const value = updatedItem.prob?.toString();
    if (
      value
      && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?$/.test(value)
    ) {
      setHasError(false);

      let numericValue;
      // Check if the value is in scientific notation
      if (/[Ee]/.test(value)) {
        numericValue = Number.parseFloat(value);
        if (Math.abs(Number(value.split(/[Ee]/)[1])) >= 4) {
          // If it has 4 or more decimal places, keep it in scientific notation
          numericValue = value;
        }
      } else {
        numericValue = Number.parseFloat(value);
      }

      setNewStateItems(prevItems => {
        const updatedItems = prevItems?.map(item =>
          item.id === updatedItem.id
            ? {
                ...item,
                prob: numericValue,
              }
            : item,
        );

        checkProbability(updatedItem, updatedItems);
        return updatedItems;
      });
    } else {
      setErrorIds(
        prevErrorItemIds => new Set([...prevErrorItemIds, updatedItem.id]),
      );
      setErrorMessage('Must contain a value');
      setHasError(true);
    }
  };

  const handleRemainingChange = (
    event: ChangeEvent<HTMLInputElement>,
    item: NewStateItem,
  ) => {
    const checked = event.target.checked;
    const nextRemaining = (mutuallyExclusive ?? true) && checked;
    const nextProb = nextRemaining ? -1 : checked ? '1.0' : 0;

    const updatedItems = newStateItems?.map(newItem =>
      newItem === item
        ? {
            ...newItem,
            remaining: nextRemaining,
            prob: nextProb,
          }
        : newItem,
    );
    setNewStateItems(sortNewStates(updatedItems));
    checkProbability(
      {
        ...item,
        remaining: nextRemaining,
        prob: nextProb,
      },
      updatedItems,
    );
  };

  const handleProbTypeChange = (
    event: ChangeEvent<HTMLInputElement>,
    item: NewStateItem,
  ) => {
    setNewStateItems(
      newStateItems?.map(newItem =>
        newItem === item
          ? { ...newItem, probType: event.target.value }
          : newItem,
      ),
    );
  };

  const handleDeleteToStateItem = (itemToDeleteId: string) => {
    setNewStateItems(newStateItems?.filter(item => item.id !== itemToDeleteId));
  };

  const reset = () => {
    setMutuallyExclusive(true);
    setNewStateItems(undefined);
    setCodeVariables([]);
    setVariableName(undefined);
    setScriptCode(undefined);
    setUseDistribution(undefined);
    setDistType(undefined);
    setDistParameters(undefined);
    setSim3DMessage(undefined);
    setExtSim(undefined);
    setSim3DId('');
    setSim3DConfigData(undefined);
    setSim3DModelRef(undefined);
    setOpenSimVarParams(undefined);
    setSimEndTime(undefined);
    setMakeInputFileCode(undefined);
    setExePath(undefined);
    setExeFromPreCode(false);
    setProcessOutputFileCode(undefined);
    setFormData(undefined); // Assuming formData can be undefined
    setHasError(false); // Default value for hasError
    setRaType(undefined);
  };

  const toScientificIfNeeded = (num: number) => {
    const numStr = num.toString();
    const decimalIndex = numStr.indexOf('.');

    return decimalIndex !== -1 && numStr.length - decimalIndex - 1 >= 4
      ? num.toExponential()
      : num;
  };

  const initializeForm = (actionData?: Action) => {
    setActionData(actionData);
    // Main info
    setName(actionData?.name ?? '');
    setOriginalName(actionData?.name);
    setDesc(actionData?.desc ?? '');
    setActType(actionData?.actType ?? 'atTransition');
    // transition items
    const initialMutuallyExclusive =
      actionData?.mutExcl === undefined ? true : actionData.mutExcl;
    setMutuallyExclusive(initialMutuallyExclusive);
    setNewStateItems(
      actionData?.newStates
        ? sortNewStates(
            actionData.newStates.map(state => ({
              ...state,
              id: uuidv4(),
              remaining:
                initialMutuallyExclusive && isRemainingProbability(state.prob),
              probType: state.varProb ? 'variable' : 'fixed',
              prob:
                !initialMutuallyExclusive && isRemainingProbability(state.prob)
                  ? '1.0'
                  : toScientificIfNeeded(state.prob),
            })),
          )
        : undefined,
    );
    // CngVarVal items
    setCodeVariables(actionData?.codeVariables ?? []);
    setVariableName(actionData?.variableName);
    setScriptCode(actionData?.scriptCode);
    setUseDistribution(actionData?.useDistribution);
    setDistType(actionData?.distType);
    setDistParameters(actionData?.parameters);

    // ExtSim items
    setSim3DMessage(actionData?.sim3DMessage as sim3DMessageType);
    setExtSim(actionData?.extSim);
    setOpenSimVarParams(actionData?.openSimVarParams);
    setSim3DModelRef(actionData?.sim3DModelRef);
    setSim3DConfigData(actionData?.sim3DConfigData);
    setSimEndTime(actionData?.simEndTime);

    // run app items
    setMakeInputFileCode(actionData?.makeInputFileCode);
    setExePath(actionData?.exePath);
    setExeFromPreCode(actionData?.ExeFromPreCode ?? false);
    setProcessOutputFileCode(actionData?.processOutputFileCode);
    setFormData(actionData?.formData);
    setRaType(actionData?.raType);
    setReturnProcess(actionData?.returnProcess as ReturnProcessType);
    action.value = actionData ?? emptyAction;
  };

  return (
    <ActionFormContext.Provider
      value={{
        name,
        desc,
        actType,
        newStateItems,
        mutuallyExclusive,
        variableName,
        codeVariables,
        scriptCode,
        useDistribution,
        distType,
        distParameters,
        sim3DMessage,
        extSim,
        sim3DId,
        openSimVarParams,
        sim3DModelRef,
        sim3DConfigData,
        simEndTime,
        makeInputFileCode,
        exePath,
        exeFromPreCode,
        processOutputFileCode,
        formData,
        hasError,
        errorMessage,
        actionTypeOptions,
        raType,
        returnProcess,
        reqPropsFilled,
        errorItemIds,
        setReqPropsFilled,
        reset,
        setName,
        setDesc,
        setActType,
        setMutuallyExclusive,
        setVariableName,
        setCodeVariables,
        setScriptCode,
        setUseDistribution,
        setDistType,
        setDistParameters,
        setSim3DMessage,
        setExtSim,
        setSim3DId,
        setOpenSimVarParams,
        setSim3DModelRef,
        setSim3DConfigData,
        setSimEndTime,
        addToUsedVariables,
        setNewStateItems,
        setMakeInputFileCode,
        setExePath,
        setExeFromPreCode,
        setProcessOutputFileCode,
        setFormData,
        setHasError,
        checkForDuplicateNames,
        handleNameChange,
        handleSave,
        handleSelectChange,
        handleProbChange,
        handleProbBlur,
        handleRemainingChange,
        handleProbTypeChange,
        handleDeleteToStateItem,
        handleMutuallyExclusiveChange,
        sortNewStates,
        initializeForm,
        setRaType,
        setReturnProcess,
      }}
    >
      {children}
    </ActionFormContext.Provider>
  );
};
