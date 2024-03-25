import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { Action, NewState } from '../types/Action';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData } from '../hooks/useAppData';

interface ActionContextType {
  actions: Action[];
  createAction: (action: Action) => void;
  updateAction: (action: Action) => void;
  deleteAction: (actionId: string | undefined) => void;
  getActionByActionName: (actionName: string) => Action;
  getActionByActionId: (actionId: string | null) => Action;
  getNewStatesByActionName: (actionName: string) => NewState[];
  addNewStateToAction: (action: Action, newState: NewState) => void;
  clearActionList: () => void;
}

const emptyAction: Action = {
  id: 0,
  name: '',
  desc: '',
  actType: 'atTransition',
  mainItem: false,
};

const ActionContext = createContext<ActionContextType | undefined>(undefined);

export function useActionContext() {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error(
      'useActionContext must be used within an ActionContextProvider',
    );
  }
  return context;
}

const ActionContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [actions, setActions] = useState<Action[]>(
    appData.value.ActionList
  );
  
  const createAction = (newAction: Action) => {
    const updatedActionList = [...actions, newAction ];
    setActions(updatedActionList);
  };

  const updateAction = (updatedAction: Action) => {
    const updatedActionList = actions.map((item) =>
      item.id === updatedAction.id ? updatedAction : item,
    );
    setActions(updatedActionList);
  };

  const deleteAction = (actionId: string | undefined) => {
    if (!actionId) { return; }
    const updatedActionList = actions.filter(
      (item) => item.id !== actionId,
    );
    setActions(updatedActionList);
  };

  const getActionByActionId = (actionId: string | null) => {
    return actions.find((action) => action.id === actionId) || emptyAction;
  };
  const getActionByActionName = (actionName: string) => {
    return actions.find((action) => action.name === actionName) || emptyAction;
  };

  const addNewStateToAction = (action: Action, newState: NewState) => {
    if (!action) { return } // If the action doesn't exist, do nothing
    if (action.newStates?.includes(newState)) { return }; // Don't add the state if it already exists
    action.newStates = [...(action.newStates || []), newState];
    updateAction(action);
  }

  const getNewStatesByActionName = (actionName: string) => {
    const action = actions.find((action) => action.name === actionName);
    if (action) {
      return action.newStates || [];
    }
    return [];
  };

  const clearActionList = () => {
    setActions([]);
  }

  return (
    <ActionContext.Provider
      value={{
        actions,
        createAction,
        updateAction,
        deleteAction,
        getActionByActionName,
        getActionByActionId,
        getNewStatesByActionName,
        addNewStateToAction,
        clearActionList
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export default ActionContextProvider;
