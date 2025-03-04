import {
  ChangeEvent,
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Action, NewState } from '../../../types/Action';
import { useWindowContext } from '../../../contexts/WindowContext';
import { emptyAction, useActionContext } from '../../../contexts/ActionContext';
import { useSignal } from '@preact/signals-react';
import { ActionType } from '../../../types/ItemTypes';
import { v4 as uuidv4 } from 'uuid';
import { SelectChangeEvent } from '@mui/material/Select';
import { State } from '../../../types/State';
import { Event } from '../../../types/Event';
import { useVariableContext } from '../../../contexts/VariableContext';
import { appData } from '../../../hooks/useAppData';

export interface NewStateItem {
  id: string;
  toState: string;
  prob: number | string | null | undefined;
  varProb?: string | null | undefined;
  failDesc?: string;
  remaining: boolean;
  probType: string;
}

export type sim3DMessageType = 'atCompModify' | 'atOpenSim' | 'atCancelSim' | 'atPing';

export type ReturnProcessType = 'rtVar' | 'rtNone' | 'rtStateList';

interface ActionFormContextType {
  name: string;
  desc: string;
  actType: ActionType;
  newStateItems?: NewStateItem[];
  mutuallyExclusive?: boolean;
  variableName?: string;
  codeVariables?: string[];
  scriptCode?: string;
  sim3DMessage?: sim3DMessageType;
  extSim?: string;
  sim3DId: string;
  sim3DConfigData?: string;
  sim3DModelRef?: string;
  simEndTime?: string;
  openSimVarParams?: boolean;
  makeInputFileCode?: string;
  exePath?: string;
  processOutputFileCode?: string;
  formData: any;
  hasError: boolean;
  errorMessage: string;
  actionTypeOptions: { value: string; label: string }[];
  raType?: string;
  returnProcess?: ReturnProcessType;
  reqPropsFilled: boolean;
  errorItemIds: Set<string>;
  setReqPropsFilled: React.Dispatch<React.SetStateAction<boolean>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  setActType: React.Dispatch<React.SetStateAction<ActionType>>;
  setMutuallyExclusive: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setVariableName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setScriptCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSim3DMessage: React.Dispatch<React.SetStateAction<sim3DMessageType | undefined>>;
  setExtSim: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSim3DId: React.Dispatch<React.SetStateAction<string>>;
  setSim3DConfigData: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSim3DModelRef: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSimEndTime: React.Dispatch<React.SetStateAction<string | undefined>>;
  setOpenSimVarParams: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  addToUsedVariables: (variableName: string) => void;
  setCodeVariables: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setNewStateItems: React.Dispatch<React.SetStateAction<NewStateItem[] | undefined>>;
  setMakeInputFileCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  setExePath: React.Dispatch<React.SetStateAction<string | undefined>>;
  setProcessOutputFileCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  checkForDuplicateNames: () => boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameChange: (newName: string) => void;
  handleSave: (event?: Event, state?: State) => void;
  handleSelectChange: (event: SelectChangeEvent, item: NewStateItem) => void;
  handleProbChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    item: NewStateItem,
  ) => void;
  handleProbBlur: (item: NewStateItem) => void;
  handleRemainingChange: (event: React.ChangeEvent<HTMLInputElement>, item: NewStateItem) => void;
  handleProbTypeChange: (event: React.ChangeEvent<HTMLInputElement>, item: NewStateItem) => void;
  handleMutuallyExclusiveChange: (value: boolean) => void;
  handleDeleteToStateItem: (itemToDeleteId: string) => void;
  sortNewStates: (newStateItems?: NewStateItem[]) => NewStateItem[] | undefined;
  initializeForm: (actionData: Action | undefined) => void;
  reset: () => void;
  setRaType: React.Dispatch<React.SetStateAction<string | undefined>>;
  setReturnProcess: React.Dispatch<React.SetStateAction<ReturnProcessType | undefined>>;
}

const ActionFormContext = createContext<ActionFormContextType | undefined>(undefined);

export const useActionFormContext = (): ActionFormContextType => {
  const context = useContext(ActionFormContext);
  if (!context) {
    throw new Error('useActionFormContext must be used within an ActionFormContextProvider');
  }
  return context;
};

const ActionFormContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { handleClose } = useWindowContext();
  const { actionsList, updateAction, createAction } = useActionContext();
  const [actionData, setActionData] = useState<Action | undefined>(undefined);
  const action = useSignal<Action>(emptyAction);
  //main items
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [actType, setActType] = useState<ActionType>('atTransition');
  //transition items
  const [mutuallyExclusive, setMutuallyExclusive] = useState<boolean | undefined>();
  const [newStateItems, setNewStateItems] = useState<NewStateItem[] | undefined>();
  //cngVarVal items
  const [codeVariables, setCodeVariables] = useState<string[] | undefined>();
  const [variableName, setVariableName] = useState<string | undefined>();
  const [scriptCode, setScriptCode] = useState<string | undefined>();
  //extSimMsg items
  const [sim3DMessage, setSim3DMessage] = useState<sim3DMessageType | undefined>();
  const [extSim, setExtSim] = useState<string | undefined>();
  const [sim3DId, setSim3DId] = useState<string>('');
  const [sim3DConfigData, setSim3DConfigData] = useState<string | undefined>();
  const [sim3DModelRef, setSim3DModelRef] = useState<string | undefined>();
  const [openSimVarParams, setOpenSimVarParams] = useState<boolean | undefined>();
  const [simEndTime, setSimEndTime] = useState<string | undefined>();
  //runExtApp items
  const [makeInputFileCode, setMakeInputFileCode] = useState<string | undefined>();
  const [processOutputFileCode, setProcessOutputFileCode] = useState<string | undefined>();
  const [formData, setFormData] = useState<any>();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [raType, setRaType] = useState<string | undefined>();
  const [reqPropsFilled, setReqPropsFilled] = useState<boolean>(false);
  const [originalName, setOriginalName] = useState<string>();
  const [exePath, setExePath] = useState<string | undefined>(formData?.exePath);
  const { updateVariable, createVariable } = useVariableContext();
  const [returnProcess, setReturnProcess] = useState<ReturnProcessType | undefined>();
  // const [errorItemIds, setErrorIds] = useState<string[]>([]);
  const [errorItemIds, setErrorIds] = useState<Set<string>>(new Set());

  const actionTypeOptions = [
    { value: 'atTransition', label: 'Transition' },
    { value: 'atCngVarVal', label: 'Change Var Value' },
    { value: 'at3DSimMsg', label: 'Ext. Sim Message' },
    { value: 'atRunExtApp', label: 'Run Application' },
  ];

  useEffect(() => {
    setReqPropsFilled(!!name && !!actType);
  }, [name, actType]);

  const handleMutuallyExclusiveChange = (value: boolean) => {
    newStateItems?.forEach((newStateItem) => {
      checkProbability(newStateItem, newStateItems, value);
      if (value === false) {
        if (newStateItem.prob === -1) {
          newStateItem.remaining = false;
          newStateItem.prob = 0;
        }
      }
    });
    setMutuallyExclusive(value);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMutuallyExclusive(event.target.checked);
  };

  const handleNameChange = (newName: string) => {
    const trimmedName = newName.trim();
    const nameExists = actionsList.value
      .filter((action) => action.name !== originalName)
      .some((node) => node.name === trimmedName); // Check for invalid characters (allowing spaces, hyphens, and underscores)
    const hasInvalidChars = /[^a-zA-Z0-9-_ ]/.test(trimmedName);
    setHasError(nameExists || hasInvalidChars);
    setName(newName);
  };

  const checkForDuplicateNames = () => {
    const nameExists = actionsList.value
      .filter((action) => action.name !== originalName)
      .some((node) => node.name === name.trim());
    return nameExists;
  };

  const checkProbability = (
    updatedItem: NewStateItem,
    updateItems?: NewStateItem[],
    updatedMutuallyExclusive?: boolean,
    updatedRemaining?: boolean | undefined,
  ) => {
    if (!updatedItem.prob) {
      setErrorIds((prevErrorItemIds) => new Set([...prevErrorItemIds, updatedItem.id]));
      setErrorMessage('Must contain a value');
      setHasError(true);
    }

    if (updatedMutuallyExclusive !== undefined ? updatedMutuallyExclusive : mutuallyExclusive) {
      const totalProb = updateItems?.reduce((acc, item) => {
        return item.prob === -1 ? acc : acc + Number(item.prob);
      }, 0) || 0;
      let remainingProb: number;

      const hasRemainingTrue = updateItems?.some((item) => item.remaining === true);

      if ((updatedRemaining !== undefined && updatedRemaining === true) || hasRemainingTrue) {
        remainingProb = 1 - totalProb;
      } else {
        remainingProb = 0;
      }

      if (totalProb !== 1 && remainingProb + totalProb !== 1) {
        setErrorIds((prevErrorItemIds) => new Set([...prevErrorItemIds, updatedItem.id]));
        setErrorMessage('Combined mutually exclusive probabilities must equal 1');
        setHasError(true);
      } else {
        setErrorIds(
          (prevErrorItemIds) =>
            new Set([...prevErrorItemIds].filter((id) => id !== updatedItem.id)),
        );
        setHasError(false);
        setErrorMessage('');
      }
    } else {
      const probValue = Number(updatedItem.prob);
      if (probValue > 1) {
        setErrorIds((prevErrorItemIds) => new Set([...prevErrorItemIds, updatedItem.id]));
        setErrorMessage('Probabilities must be greater than 0 and not exceed 1');
        setHasError(true);
      } else {
        setErrorIds(
          (prevErrorItemIds) =>
            new Set([...prevErrorItemIds].filter((id) => id !== updatedItem.id)),
        );
        setErrorMessage('');
        setHasError(false);
      }
    }
  };

  const handleSave = async (event?: Event, state?: State) => {
    action.value = {
      ...action.value,
      id: actionData?.id || uuidv4(),
      name: name.trim(),
      desc,
      actType,
      newStates: newStateItems
        ? newStateItems.map((newStateItem): NewState => {
            return {
              toState: newStateItem.toState,
              prob: Number(newStateItem.prob),
              failDesc: newStateItem.failDesc || '',
              varProb: newStateItem.varProb,
            };
          })
        : undefined,
      mutExcl: mutuallyExclusive,
      codeVariables,
      variableName,
      scriptCode,
      sim3DMessage,
      extSim,
      sim3DConfigData,
      sim3DModelRef,
      simEndTime,
      makeInputFileCode,
      exePath,
      processOutputFileCode,
      openSimVarParams,
      mainItem: true,
      formData,
      raType,
      returnProcess,
    };
    await checkFormData();

    actionData ? updateAction(action.value) : createAction(action.value, event, state);
    handleClose();
  };

  const checkFormData = async () => {
    return new Promise<void>(async (resolve) => {
      if (formData && formData.docLinkVariable !== undefined) {
        let variableList = structuredClone(appData.value.VariableList);
        let docLinkVariables = variableList.filter(({ varScope }) => varScope === 'gtDocLink');
        if (docLinkVariables.map(({ name }) => name).includes(formData.docLinkVariable)) {
          let variable = docLinkVariables.find(({ name }) => name === formData.docLinkVariable);
          if (variable) {
            variable.docType = 'dtTextRegEx';
            variable.docLink = 'CORE UNCOVERY';
            variable.pathMustExist = false;
            variable.numChars = 11;
            variable.begPosition = 28;
            variable.regExpLine = 0;
            //update app data with the new variable information
            await updateVariable(variable);
          }
        } else {
          //create a new variable with the new information
          if (!variableList.find(({ name }) => name === formData.docLinkVariable)) {
            await createVariable({
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
      resolve();
    });
  };

  const sortNewStates = (newStateItems?: NewStateItem[]) => {
    return newStateItems?.sort((a, b) => {
      if (a.remaining && !b.remaining) {
        return 1;
      }
      if (!a.remaining && b.remaining) {
        return -1;
      }
      return 0;
    });
  };

  const addToUsedVariables = (variableName: string) => {
    if (codeVariables && !codeVariables?.includes(variableName)) {
      setCodeVariables([...codeVariables, variableName]);
    } else {
      setCodeVariables(codeVariables?.filter((item) => item !== variableName));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent, item: NewStateItem) => {
    const updatedItems = newStateItems?.map((newItem) => {
      if (newItem === item) {
        return { ...newItem, varProb: event.target.value };
      }
      return newItem;
    });
    setNewStateItems(updatedItems);
  };

  const handleProbChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    updatedItem: NewStateItem,
  ) => {
    setHasError(false);
    setNewStateItems((prevItems) => {
      const updatedItems = prevItems?.map((item) => {
        if (item.id === updatedItem.id) {
          return {
            ...item,
            prob: Number(event.target.value) < 0 ? 0 : event.target.value,
          };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleProbBlur = (updatedItem: NewStateItem) => {
    const value = updatedItem.prob?.toString();
    const validInputRegex = /^[+\-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+\-]?\d+)?$/;

    if (value && validInputRegex.test(value)) {
      setHasError(false);

      // Check if the value is in scientific notation
      const isScientificNotation = /[Ee]/.test(value);
      let numericValue;
      if (isScientificNotation) {
        console.log('value is in scientific notation: ', value);
        numericValue = parseFloat(value);
        const [_, exponentPart] = value.split(/[Ee]/);
        const exponent = Math.abs(Number(exponentPart));
        if (exponent >= 4) {
          // If it has 4 or more decimal places, keep it in scientific notation
          numericValue = value;
        }
      } else {
        numericValue = parseFloat(value);
      }

      setNewStateItems((prevItems) => {
        const updatedItems = prevItems?.map((item) => {
          if (item.id === updatedItem.id) {
            return {
              ...item,
              prob: numericValue,
            };
          }
          return item;
        });

        checkProbability(updatedItem, updatedItems);
        return updatedItems;
      });
    } else {
      setErrorIds((prevErrorItemIds) => new Set([...prevErrorItemIds, updatedItem.id]));
      setErrorMessage('Must contain a value');
      setHasError(true);
    }
  };

  const handleRemainingChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    item: NewStateItem,
  ) => {
    const updatedItems = newStateItems?.map((newItem) => {
      if (newItem === item) {
        return {
          ...newItem,
          remaining: event.target.checked,
          prob: event.target.checked ? -1 : 0.0,
        };
      }
      return newItem;
    });
    setNewStateItems(sortNewStates(updatedItems));
    checkProbability(
      {
        ...item,
        remaining: event.target.checked,
        prob: event.target.checked ? -1 : 0.0,
      },
      updatedItems,
    );
  };

  const handleProbTypeChange = (event: React.ChangeEvent<HTMLInputElement>, item: NewStateItem) => {
    const updatedItems = newStateItems?.map((newItem: NewStateItem) => {
      if (newItem === item) {
        return { ...newItem, probType: event.target.value };
      }
      return newItem;
    });
    setNewStateItems(updatedItems);
  };

  const handleDeleteToStateItem = (itemToDeleteId: string) => {
    const updatedItems = newStateItems?.filter((item) => item.id !== itemToDeleteId);
    setNewStateItems(updatedItems);
  };
  
  const reset = () => {
    setMutuallyExclusive(undefined);
    setNewStateItems(undefined);
    setCodeVariables(undefined);
    setVariableName(undefined);
    setScriptCode(undefined);
    setSim3DMessage(undefined);
    setExtSim(undefined);
    setSim3DId('');
    setSim3DConfigData(undefined);
    setSim3DModelRef(undefined);
    setOpenSimVarParams(undefined);
    setSimEndTime(undefined);
    setMakeInputFileCode(undefined);
    setExePath(undefined);
    setProcessOutputFileCode(undefined);
    setFormData(undefined); // Assuming formData can be undefined
    setHasError(false); // Default value for hasError
    setRaType(undefined);
  };

  const toScientificIfNeeded = (num: number) => {
    const numStr = num.toString();
    const decimalIndex = numStr.indexOf('.');

    if (decimalIndex !== -1 && numStr.length - decimalIndex - 1 >= 4) {
      return num.toExponential();
    }
    return num;
  };

  const initializeForm = (actionData: Action | undefined) => {
    setActionData(actionData);
    //Main info
    setName(actionData?.name || '');
    setOriginalName(actionData?.name);
    setDesc(actionData?.desc || '');
    setActType(actionData?.actType || 'atTransition');
    //transition items
    setMutuallyExclusive(actionData?.mutExcl);
    setNewStateItems(
      actionData?.newStates
        ? sortNewStates(
            actionData.newStates.map((state) => ({
              ...state,
              id: uuidv4(),
              remaining: state.prob === -1,
              probType: state.varProb ? 'variable' : 'fixed',
              prob: toScientificIfNeeded(state.prob),
            })),
          )
        : undefined,
    );
    //CngVarVal items
    setCodeVariables(actionData?.codeVariables);
    setVariableName(actionData?.variableName);
    setScriptCode(actionData?.scriptCode);

    //ExtSim items
    setSim3DMessage((actionData?.sim3DMessage as sim3DMessageType) || undefined);
    setExtSim(actionData?.extSim);
    setOpenSimVarParams(actionData?.openSimVarParams);
    setSim3DModelRef(actionData?.sim3DModelRef);
    setSim3DConfigData(actionData?.sim3DConfigData);
    setSimEndTime(actionData?.simEndTime);

    //run app items
    setMakeInputFileCode(actionData?.makeInputFileCode);
    setExePath(actionData?.exePath);
    setProcessOutputFileCode(actionData?.processOutputFileCode);
    setFormData(actionData?.formData);
    setRaType(actionData?.raType);
    setReturnProcess((actionData?.returnProcess as ReturnProcessType) || undefined);
    action.value = actionData || emptyAction;
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
        sim3DMessage,
        extSim,
        sim3DId,
        openSimVarParams,
        sim3DModelRef,
        sim3DConfigData,
        simEndTime,
        makeInputFileCode,
        exePath,
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
        setProcessOutputFileCode,
        setFormData,
        setHasError,
        checkForDuplicateNames,
        handleChange,
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

export default ActionFormContextProvider;
