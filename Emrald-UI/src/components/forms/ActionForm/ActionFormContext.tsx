import { ChangeEvent, createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Action, NewState } from "../../../types/Action";
import { useWindowContext } from "../../../contexts/WindowContext";
import { emptyAction, useActionContext } from "../../../contexts/ActionContext";
import { useSignal } from "@preact/signals-react";
import { ActionType } from "../../../types/ItemTypes";
import { v4 as uuidv4 } from 'uuid';
import { SelectChangeEvent } from "@mui/material/Select";

export interface NewStateItem {
  id: string;
  toState: string;
  prob: number;
  varProb?: string | null | undefined;
  failDesc?: string;
  remaining: boolean;
  probType: string;
}

interface ActionFormContextType {
  name: string;
  desc: string;
  actType: ActionType;
  newStateItems: NewStateItem[];
  mutuallyExclusive: boolean;
  variableName: string;
  codeVariables: string[];
  scriptCode: string;
  makeInputFileCode: string;
  exePath: string;
  processOutputFileCode: string
  hasError: boolean;
  actionTypeOptions: { value: string; label: string }[];
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  setActType: React.Dispatch<React.SetStateAction<ActionType>>;
  setMutuallyExclusive: React.Dispatch<React.SetStateAction<boolean>>;
  setVariableName: React.Dispatch<React.SetStateAction<string>>;
  setScriptCode: React.Dispatch<React.SetStateAction<string>>;
  addToUsedVariables: (variableName: string) => void;
  setNewStateItems: React.Dispatch<React.SetStateAction<NewStateItem[]>>;
  setMakeInputFileCode: React.Dispatch<React.SetStateAction<string>>;
  setExePath: React.Dispatch<React.SetStateAction<string>>;
  setProcessOutputFileCode: React.Dispatch<React.SetStateAction<string>>;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleSelectChange: (event: SelectChangeEvent, item: NewStateItem) => void;
  handleProbChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, item: NewStateItem) => void;
  handleRemainingChange: (event: React.ChangeEvent<HTMLInputElement>, item: NewStateItem) => void;
  handleProbTypeChange: (event: React.ChangeEvent<HTMLInputElement>, item: NewStateItem) => void;
  handleDeleteToStateItem: (itemToDeleteId: string) => void;
  sortNewStates: (newStateItems: NewStateItem[]) => NewStateItem[];
  initializeForm: (actionData: Action | undefined) => void;
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
  const { updateAction, createAction } = useActionContext();
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

  //runExtApp items
  const [makeInputFileCode, setMakeInputFileCode] = useState<string>('');
  const [exePath, setExePath] = useState<string>('');
  const [processOutputFileCode, setProcessOutputFileCode] = useState<string>('');

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

  const handleSave = () => {
    actionData
      ? updateAction({
          ...action.value,
          name,
          desc,
          actType,
        })
      : createAction({
          ...action.value,
          id: uuidv4(),
          name,
          desc,
          actType,
        });
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
  }

  const addToUsedVariables = (variableName: string) => {
    if (!codeVariables.includes(variableName)) {
      setCodeVariables([...codeVariables, variableName]);
    } else {
      setCodeVariables(codeVariables.filter((item) => item !== variableName));
    }
  }

  const handleSelectChange = (event: SelectChangeEvent, item: NewStateItem) => {
    const updatedItems = newStateItems.map((newItem) => {
      if (newItem === item) {
        return { ...newItem, varProb: event.target.value };
      }
      return newItem;
    });
    setNewStateItems(updatedItems);
  };

  const handleProbChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedItem: NewStateItem) => {
    setNewStateItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === updatedItem.id) {
          return {
            ...item,
            prob: parseFloat(event.target.value),
          };
        }
        return item;
      });
      return updatedItems;
    });
    if (parseFloat(event.target.value) >= 1.0 || parseFloat(event.target.value) <= 0 || isNaN(parseFloat(event.target.value))) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  };

  const handleRemainingChange = (event: React.ChangeEvent<HTMLInputElement>, item: NewStateItem) => {
    const updatedItems = newStateItems.map((newItem) => {
      if (newItem === item) {
        return { ...newItem, remaining: event.target.checked, prob: event.target.checked ? -1 : 0.0 };
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
  }

  const initializeForm = (actionData: Action | undefined) => {
    setActionData(actionData);
    //Main info
    setName(actionData?.name || '');
    setDesc(actionData?.desc || '');
    setActType(actionData?.actType || 'atTransition');
    //transition items
    setMutuallyExclusive(actionData?.mutExcl || true);
    setNewStateItems(actionData?.newStates ? sortNewStates(actionData.newStates.map((state) => ({ 
      ...state, 
      id: uuidv4(),
      remaining: state.prob === -1,
      probType: 'fixed'
    }))) : []);
    //CngVarVal items
    setCodeVariables(actionData?.codeVariables || []);
    setVariableName(actionData?.variableName || '');
    setScriptCode(actionData?.scriptCode || '');

    //run app items
    setMakeInputFileCode(actionData?.makeInputFileCode || '');
    setExePath(actionData?.exePath || '');
    setProcessOutputFileCode(actionData?.processOutputFileCode || '');

    action.value = actionData || emptyAction;
  }

  return (
    <ActionFormContext.Provider value={{ 
      name,
      desc,
      actType,
      newStateItems,
      mutuallyExclusive,
      variableName,
      codeVariables,
      scriptCode,
      makeInputFileCode,
      exePath,
      processOutputFileCode,
      hasError,
      actionTypeOptions,
      setName,
      setDesc,
      setActType,
      setMutuallyExclusive,
      setVariableName,
      setScriptCode,
      addToUsedVariables,
      setNewStateItems,
      setMakeInputFileCode,
      setExePath,
      setProcessOutputFileCode,
      setHasError,
      handleChange,
      handleSave,
      handleSelectChange,
      handleProbChange,
      handleRemainingChange,
      handleProbTypeChange,
      handleDeleteToStateItem,
      sortNewStates,
      initializeForm
    }}>
      {children}
    </ActionFormContext.Provider>
  );
};

export default ActionFormContextProvider;