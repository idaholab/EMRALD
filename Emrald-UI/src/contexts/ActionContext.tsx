import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import emraldData from '../emraldData.json';
import { Action, ActionList } from '../interfaces/Action';

interface ActionContextType {
  actions: Action[];
  createAction: (action: Action) => void;
  updateAction: (action: Action) => void;
  deleteAction: (actionId: number) => void;
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

const ActionContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [actionList, setActionList] = useState<ActionList>(
    emraldData.ActionList as ActionList,
  );

  const actions = emraldData.ActionList.map((item) => item.Action) as Action[];

  const createAction = (newAction: Action) => {
    const updatedActionList = [...actionList, { Action: newAction }];
    setActionList(updatedActionList);
  };

  const updateAction = (updatedAction: Action) => {
    const updatedActionList = actionList.map((item) =>
      item.Action.id === updatedAction.id ? { Action: updatedAction } : item,
    );
    setActionList(updatedActionList);
  };

  const deleteAction = (actionId: number) => {
    const updatedActionList = actionList.filter(
      (item) => item.Action.id !== actionId,
    );
    setActionList(updatedActionList);
  };

  return (
    <ActionContext.Provider
      value={{
        actions,
        createAction,
        updateAction,
        deleteAction,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export default ActionContextProvider;
