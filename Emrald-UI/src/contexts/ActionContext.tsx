import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Action, NewState } from '../types/Action';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';

interface ActionContextType {
  actions: Action[];
  createAction: (action: Action) => void;
  updateAction: (action: Action) => void;
  deleteAction: (actionId: number | string) => void;
  getActionByActionName: (actionName: string) => Action | undefined;
  getNewStatesByActionName: (actionName: string) => NewState[];
  clearActionList: () => void;
}

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

const ActionContextProvider: React.FC<EmraldContextWrapperProps> = ({ appData, updateAppData, children }) => {
  const [actions, setActions] = useState<Action[]>(
    appData.ActionList
  );

  // Memoize the value of `actions` to avoid unnecessary re-renders
  // const actions = useMemo(
  //   () => actionList.map(({Action}) => Action) as Action[],
  //   [actionList, appData]
  // );

  // useEffect(() => {
  //   setActionList(appData.ActionList as ActionList);
  // }, [appData]);
  
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

  const deleteAction = (actionId: number | string) => {
    const updatedActionList = actions.filter(
      (item) => item.id !== actionId,
    );
    setActions(updatedActionList);
  };

  const getActionByActionName = (actionName: string) => {
    return actions.find((action) => action.name === actionName);
  };

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
        getNewStatesByActionName,
        clearActionList
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export default ActionContextProvider;
