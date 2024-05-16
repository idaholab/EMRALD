import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { Action, NewState } from '../types/Action';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { MainItemTypes } from '../types/ItemTypes';
import { updateModelAndReferences } from '../utils/UpdateModel';

interface ActionContextType {
  actions: Action[];
  actionsList: ReadonlySignal<Action[]>;
  createAction: (action: Action) => void;
  updateAction: (action: Action) => void;
  deleteAction: (actionId: string | undefined) => void;
  getActionByActionName: (actionName: string) => Action;
  getActionByActionId: (actionId: string | null) => Action;
  getNewStatesByActionName: (actionName: string) => NewState[];
  addNewStateToAction: (action: Action, newState: NewState) => void;
  newActionList: (newActionList: Action[]) => void;
  clearActionList: () => void;
}

export const emptyAction: Action = {
  id: "",
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
  const [actions, setActions] = useState<Action[]>(JSON.parse(JSON.stringify(appData.value.ActionList.sort((a,b) => a.name.localeCompare(b.name)))));
  const actionsList = useComputed(() => appData.value.ActionList);
  
  const createAction = async (newAction: Action) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      newAction,
      MainItemTypes.Action,
    );
    updateAppData(updatedModel);
    setActions(updatedModel.ActionList);
  };

  const updateAction = async (updatedAction: Action) => {
    // const updatedActionList = actionsList.value.map((item) =>
    //   item.id === updatedAction.id ? updatedAction : item,
    // );

    var updatedModel : EMRALD_Model = await updateModelAndReferences(updatedAction, MainItemTypes.Action);
    updateAppData(JSON.parse(JSON.stringify(updatedModel)));
    setActions(updatedModel.ActionList);
  };

  const deleteAction = (actionId: string | undefined) => {
    if (!actionId) { return; }
    const updatedActionList = actionsList.value.filter(
      (item) => item.id !== actionId,
    );
    setActions(updatedActionList);
  };

  const getActionByActionId = (actionId: string | null) => {
    return actionsList.value.find((action) => action.id === actionId) || emptyAction;
  };
  const getActionByActionName = (actionName: string) => {
    return actionsList.value.find((action) => action.name === actionName) || emptyAction;
  };

  const addNewStateToAction = (action: Action, newState: NewState) => {
    if (!action) { return } // If the action doesn't exist, do nothing
    if (action.newStates?.includes(newState)) { return }; // Don't add the state if it already exists
    action.newStates = [...(action.newStates || []), newState];
    updateAction(action);
  }

  const getNewStatesByActionName = (actionName: string) => {
    const action = actionsList.value.find((action) => action.name === actionName);
    if (action) {
      return action.newStates || [];
    }
    return [];
  };

  // Open New, Merge, and Clear Diagram List
  const newActionList = (newActionList: Action[]) => {
    setActions(newActionList);
  };

  const clearActionList = () => {
    setActions([]);
  }

  return (
    <ActionContext.Provider
      value={{
        actions,
        actionsList,
        createAction,
        updateAction,
        deleteAction,
        getActionByActionName,
        getActionByActionId,
        getNewStatesByActionName,
        addNewStateToAction,
        newActionList,
        clearActionList
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export default ActionContextProvider;
