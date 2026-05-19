import type { Action, Event, NewState, State } from '../types/EMRALD_Model';
import {
  effect,
  type ReadonlySignal,
  useComputed,
} from '@preact/signals-react';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { appData, updateAppData } from '../hooks/useAppData';
import {
  type ClearedRef,
  DeleteItemAndRefs,
  formatClearedRefsMessage,
  updateModelAndReferences,
} from '../utils/UpdateModel';
import { useAlertContext } from './AlertContext';

interface ActionContextType {
  actions: Action[];
  actionsList: ReadonlySignal<Action[]>;
  createAction: (action: Action, event?: Event, state?: State) => void;
  updateAction: (action: Action) => void;
  deleteAction: (actionId?: string) => void;
  getActionByActionName: (actionName: string) => Action | undefined;
  getActionByActionId: (actionId: string | null) => Action | undefined;
  getNewStatesByActionName: (actionName: string) => NewState[];
  addNewStateToAction: (action?: Action, newState?: NewState) => void;
  newActionList: (newActionList: Action[]) => void;
  clearActionList: () => void;
}

export const emptyAction: Action = {
  id: '',
  name: '',
  desc: '',
  actType: 'atTransition',
  mainItem: false,
  objType: 'Action',
  required: false,
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

export const ActionContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [actions, setActions] = useState(
    structuredClone(
      appData.value.ActionList.toSorted((a, b) => a.name.localeCompare(b.name)),
    ),
  );
  const actionsList = useComputed(() => appData.value.ActionList);
  const { showAlert } = useAlertContext();

  effect(() => {
    if (
      JSON.stringify(actions)
      !== JSON.stringify(
        appData.value.ActionList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      )
    ) {
      setActions(
        appData.value.ActionList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      return;
    }
    return;
  });

  const createAction = (newAction: Action, event?: Event, state?: State) => {
    updateAppData(updateModelAndReferences(newAction, 'Action'));
    if (event && state) {
      state.eventActions[state.events.indexOf(event.name)]?.actions.push(
        newAction.name,
      );
      updateAppData(updateModelAndReferences(state, 'State'));
    } else if (state) {
      state.immediateActions.push(newAction.name);
      updateAppData(updateModelAndReferences(state, 'State'));
    }
  };

  const updateAction = (updatedAction: Action) => {
    updateAppData(
      structuredClone(updateModelAndReferences(updatedAction, 'Action')),
    );
  };

  const deleteAction = (actionId?: string) => {
    if (!actionId) {
      return;
    }
    const actionToDelete = actionsList.value.find(
      action => action.id === actionId,
    );
    if (actionToDelete) {
      const clearedRefs: ClearedRef[] = [];
      updateAppData(DeleteItemAndRefs(actionToDelete, clearedRefs));
      const msg = formatClearedRefsMessage(
        'Action',
        actionToDelete.name,
        clearedRefs,
      );
      if (msg) {
        showAlert(msg, 'warning');
      }
    }
    // todo else error, no action to delete
  };

  const getActionByActionId = (actionId: string | null) =>
    actionsList.value.find(action => action.id === actionId);
  const getActionByActionName = (actionName: string) =>
    actionsList.value.find(action => action.name === actionName);

  const addNewStateToAction = (action?: Action, newState?: NewState) => {
    if (!action || !newState) {
      return;
    } // If the action doesn't exist, do nothing
    if (action.newStates?.includes(newState)) {
      return;
    } // Don't add the state if it already exists
    action.newStates = [...(action.newStates ?? []), newState];
    updateAction(action);
  };

  const getNewStatesByActionName = (actionName: string) => {
    const action = actionsList.value.find(action => action.name === actionName);
    return action?.newStates ?? [];
  };

  // Open New, Merge, and Clear Diagram List
  const newActionList = (newActionList: Action[]) => {
    setActions(newActionList);
  };

  const clearActionList = () => {
    setActions([]);
    updateAppData(structuredClone({ ...appData.value, ActionList: [] }));
  };

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
        clearActionList,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};
