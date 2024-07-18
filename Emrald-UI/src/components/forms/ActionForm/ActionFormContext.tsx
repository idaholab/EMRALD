import { ChangeEvent, createContext, PropsWithChildren, useContext, useState } from 'react';
import { Action, NewState } from '../../../types/Action';
import { useWindowContext } from '../../../contexts/WindowContext';
import { emptyAction, useActionContext } from '../../../contexts/ActionContext';
import { useSignal } from '@preact/signals-react';
import { ActionType } from '../../../types/ItemTypes';
import { v4 as uuidv4 } from 'uuid';
import { SelectChangeEvent } from '@mui/material/Select';
import { State } from '../../../types/State';
import { Event } from '../../../types/Event';

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

interface ActionFormContextType {
  name: string;
  desc: string;
  actType: ActionType;
  newStateItems: NewStateItem[];
  mutuallyExclusive: boolean;
  variableName: string;
  codeVariables: string[];
  scriptCode: string;
  sim3DMessage: sim3DMessageType;
  extSim: string;
  sim3DId: string;
  sim3DConfigData: string;
  sim3DModelRef: string;
  simEndTime: string;
  openSimVarParams: boolean;
  makeInputFileCode: string;
  exePath: string;
  processOutputFileCode: string;
  formData: any;
  hasError: boolean;
  actionTypeOptions: { value: string; label: string }[];
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  setActType: React.Dispatch<React.SetStateAction<ActionType>>;
  setMutuallyExclusive: React.Dispatch<React.SetStateAction<boolean>>;
  setVariableName: React.Dispatch<React.SetStateAction<string>>;
  setScriptCode: React.Dispatch<React.SetStateAction<string>>;
  setSim3DMessage: React.Dispatch<React.SetStateAction<sim3DMessageType>>;
  setExtSim: React.Dispatch<React.SetStateAction<string>>;
  setSim3DId: React.Dispatch<React.SetStateAction<string>>;
  setSim3DConfigData: React.Dispatch<React.SetStateAction<string>>;
  setSim3DModelRef: React.Dispatch<React.SetStateAction<string>>;
  setSimEndTime: React.Dispatch<React.SetStateAction<string>>;
  setOpenSimVarParams: React.Dispatch<React.SetStateAction<boolean>>;
  addToUsedVariables: (variableName: string) => void;
  setCodeVariables: React.Dispatch<React.SetStateAction<string[]>>;
  setNewStateItems: React.Dispatch<React.SetStateAction<NewStateItem[]>>;
  setMakeInputFileCode: React.Dispatch<React.SetStateAction<string>>;
  setExePath: React.Dispatch<React.SetStateAction<string>>;
  setProcessOutputFileCode: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
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
  handleDeleteToStateItem: (itemToDeleteId: string) => void;
  sortNewStates: (newStateItems: NewStateItem[]) => NewStateItem[];
  initializeForm: (actionData: Action | undefined) => void;
  reset: () => void;
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
  const [mutuallyExclusive, setMutuallyExclusive] = useState(false);
  const [newStateItems, setNewStateItems] = useState<NewStateItem[]>([]);
  //cngVarVal items
  const [codeVariables, setCodeVariables] = useState<string[]>([]);
  const [variableName, setVariableName] = useState<string>('');
  const [scriptCode, setScriptCode] = useState<string>('');
  //extSimMsg items
  const [sim3DMessage, setSim3DMessage] = useState<sim3DMessageType>('atCompModify');
  const [extSim, setExtSim] = useState<string>('');
  const [sim3DId, setSim3DId] = useState<string>('');
  const [sim3DConfigData, setSim3DConfigData] = useState<string>('');
  const [sim3DModelRef, setSim3DModelRef] = useState<string>('');
  const [openSimVarParams, setOpenSimVarParams] = useState<boolean>(false);
  const [simEndTime, setSimEndTime] = useState<string>('');
  //runExtApp items
  const [makeInputFileCode, setMakeInputFileCode] = useState<string>('');
  const [exePath, setExePath] = useState<string>('');
  const [processOutputFileCode, setProcessOutputFileCode] = useState<string>('');
  const [formData, setFormData] = useState<any>();
  const [hasError, setHasError] = useState(false);

  const actionTypeOptions = [
    { value: 'atTransition', label: 'Transition' },
    { value: 'atCngVarVal', label: 'Change Var Value' },
    { value: 'at3DSimMsg', label: 'Ext. Sim Message' },
    { value: 'atRunExtApp', label: 'Run Application' },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMutuallyExclusive(event.target.checked);
  };

  const handleNameChange = (newName: string) => {
    const trimmedName = newName.trim();
    const nameExists = actionsList.value.some((node) => node.name === trimmedName); // Check for invalid characters (allowing spaces, hyphens, and underscores)
    const hasInvalidChars = /[^a-zA-Z0-9-_ ]/.test(trimmedName);
    setHasError(nameExists || hasInvalidChars);
    setName(newName);
  };

  const handleSave = (event?: Event, state?: State) => {
    const newStates: NewState[] = newStateItems.map((newStateItem): NewState => {
      return {
        toState: newStateItem.toState,
        prob: Number(newStateItem.prob),
        failDesc: newStateItem.failDesc || '',
        varProb: newStateItem.varProb,
      };
    });
    action.value = {
      ...action.value,
      id: actionData?.id || uuidv4(),
      name: name.trim(),
      desc,
      actType,
      newStates,
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
    };

    actionData ? updateAction(action.value) : createAction(action.value, event, state);
    handleClose();
  };

  const sortNewStates = (newStateItems: NewStateItem[]) => {
    return newStateItems.sort((a, b) => {
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
    if (!codeVariables.includes(variableName)) {
      setCodeVariables([...codeVariables, variableName]);
    } else {
      setCodeVariables(codeVariables.filter((item) => item !== variableName));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent, item: NewStateItem) => {
    const updatedItems = newStateItems.map((newItem) => {
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
      const updatedItems = prevItems.map((item) => {
        if (item.id === updatedItem.id) {
          return {
            ...item,
            prob: event.target.value,
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

      if (isNaN(Number(numericValue)) || Number(numericValue) > 1.0 || Number(numericValue) < 0) {
        console.log('Invalid probability value: ', Number(numericValue));
        setHasError(true);
      }

      setNewStateItems((prevItems) => {
        const updatedItems = prevItems.map((item) => {
          if (item.id === updatedItem.id) {
            return {
              ...item,
              prob: numericValue,
            };
          }
          return item;
        });
        return updatedItems;
      });
    } else {
      console.log('Invalid probability value: ', value);
      setHasError(true);
    }
  };

  const handleRemainingChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: NewStateItem,
  ) => {
    const updatedItems = newStateItems.map((newItem) => {
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
  };

  const handleProbTypeChange = (event: React.ChangeEvent<HTMLInputElement>, item: NewStateItem) => {
    const updatedItems = newStateItems.map((newItem: NewStateItem) => {
      if (newItem === item) {
        return { ...newItem, probType: event.target.value };
      }
      return newItem;
    });
    setNewStateItems(updatedItems);
  };

  const handleDeleteToStateItem = (itemToDeleteId: string) => {
    const updatedItems = newStateItems.filter((item) => item.id !== itemToDeleteId);
    setNewStateItems(updatedItems);
  };
  const reset = () => {
    setMutuallyExclusive(false); // Default value for mutuallyExclusive
    setNewStateItems([]); // Default value for newStateItems
    setCodeVariables([]); // Default value for codeVariables
    setVariableName('');
    setScriptCode('');
    setSim3DMessage('atCompModify'); // Default value for sim3DMessage
    setExtSim('');
    setSim3DId('');
    setSim3DConfigData('');
    setSim3DModelRef('');
    setOpenSimVarParams(false); // Default value for openSimVarParams
    setSimEndTime('');
    setMakeInputFileCode('');
    setExePath('');
    setProcessOutputFileCode('');
    setFormData(undefined); // Assuming formData can be undefined
    setHasError(false); // Default value for hasError
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
    setDesc(actionData?.desc || '');
    setActType(actionData?.actType || 'atTransition');
    //transition items
    setMutuallyExclusive(actionData?.mutExcl || true);
    setNewStateItems(
      actionData?.newStates
        ? sortNewStates(
            actionData.newStates.map((state) => ({
              ...state,
              id: uuidv4(),
              remaining: state.prob === -1,
              probType: 'fixed',
              prob: toScientificIfNeeded(state.prob),
            })),
          )
        : [],
    );
    //CngVarVal items
    setCodeVariables(actionData?.codeVariables || []);
    setVariableName(actionData?.variableName || '');
    setScriptCode(actionData?.scriptCode || '');

    //ExtSim items
    setSim3DMessage((actionData?.sim3DMessage as sim3DMessageType) || 'atCompModify');
    setExtSim(actionData?.extSim || '');
    setOpenSimVarParams(actionData?.openSimVarParams || false);
    setSim3DModelRef(actionData?.sim3DModelRef || '');
    setSim3DConfigData(actionData?.sim3DConfigData || '');
    setSimEndTime(actionData?.simEndTime || '');

    //run app items
    setMakeInputFileCode(actionData?.makeInputFileCode || '');
    setExePath(actionData?.exePath || '');
    setProcessOutputFileCode(actionData?.processOutputFileCode || '');
    setFormData(actionData?.formData || undefined);

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
        actionTypeOptions,
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
        handleChange,
        handleNameChange,
        handleSave,
        handleSelectChange,
        handleProbChange,
        handleProbBlur,
        handleRemainingChange,
        handleProbTypeChange,
        handleDeleteToStateItem,
        sortNewStates,
        initializeForm,
      }}
    >
      {children}
    </ActionFormContext.Provider>
  );
};

export default ActionFormContextProvider;
