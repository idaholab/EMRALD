import type { Action, Event, State } from '../types/EMRALD_Model';
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
import { SINGLE_STATE_EXIT_FLAG_MESSAGE } from '../utils/util-functions';
import { useAlertContext } from './AlertContext';

interface StateContextType {
  states: State[];
  statesList: ReadonlySignal<State[]>;
  createState: (newState: State) => void;
  updateState: (updatedState: State) => void;
  updateStateEvents: (stateName: string, event: Event) => void;
  updateStateEventActions: (
    stateName: string,
    eventName: string,
    action: Action,
  ) => void;
  updateStateImmediateActions: (stateName: string, action: Action) => void;
  updateStatePosition: (
    state: State,
    position: { x: number; y: number },
  ) => void;
  deleteState: (StateId?: string) => void;
  getEventsByStateName: (stateName: string) => {
    events: string[];
    type: string;
    eventActions: EventAction[];
    immediateActions: string[];
    geometryInfo: { x: number; y: number; width: number; height: number };
  };
  getStateByStateName: (stateName: string) => State | undefined;
  getStateByStateId: (stateId: string | null) => State | undefined;
  newStateList: (newStateList: State[]) => void;
  mergeStateList: (newStateList: State[]) => void;
  clearStateList: () => void;
}

interface EventAction {
  moveFromCurrent?: boolean;
  actions?: string[];
}

export const emptyState: State = {
  id: '',
  name: '',
  desc: '',
  diagramName: '',
  stateType: 'stStandard',
  events: [],
  eventActions: [],
  immediateActions: [],
  geometryInfo: { x: 0, y: 0, width: 0, height: 0 },
  required: false,
  objType: 'State',
};

const StateContext = createContext<StateContextType | undefined>(undefined);

export function useStateContext() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error(
      'useStateContext must be used within a StateContextProvider',
    );
  }
  return context;
}

export const StateContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [states, setStates] = useState(
    structuredClone(
      appData.value.StateList.toSorted((a, b) => a.name.localeCompare(b.name)),
    ),
  );
  const statesList = useComputed(() => appData.value.StateList);
  const { showAlert } = useAlertContext();
  const defaultGeometryInfo = { x: 0, y: 0, width: 0, height: 0 };

  effect(() => {
    if (
      JSON.stringify(states)
      !== JSON.stringify(
        appData.value.StateList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      )
    ) {
      setStates(
        appData.value.StateList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      return;
    }
    return;
  });

  // Create, Delete, Update individual States
  const createState = (newState: State) => {
    updateAppData(updateModelAndReferences(newState, 'State'));
  };

  const updateState = (updatedState: State) => {
    updateAppData(updateModelAndReferences(updatedState, 'State'));
  };

  const updateStateEvents = (stateName: string, event: Event) => {
    const stateToUpdate = getStateByStateName(stateName);
    if (stateToUpdate) {
      if (stateToUpdate.events.includes(event.name)) {
        return;
      } else {
        stateToUpdate.events = [...stateToUpdate.events, event.name];
        stateToUpdate.eventActions.push({
          moveFromCurrent: false,
          actions: [],
        });
        updateState(stateToUpdate);
      }
    }
  };

  // A single-state diagram (dtSingle) can only be in one state at a time, so a
  // transition action must always exit the current state. Look the diagram up
  // by the state's owning diagram name.
  const isSingleStateDiagram = (state: State) =>
    appData.value.DiagramList.find(d => d.name === state.diagramName)
      ?.diagramType === 'dtSingle';

  const updateStateEventActions = (
    stateName: string,
    eventName: string,
    action: Action,
  ) => {
    const stateToUpdate = getStateByStateName(stateName);
    if (stateToUpdate) {
      const eventIndex = stateToUpdate.events.indexOf(eventName);
      if (stateToUpdate.eventActions[eventIndex]) {
        if (
          stateToUpdate.eventActions[eventIndex].actions.includes(action.name)
        ) {
          return;
        }
        stateToUpdate.eventActions[eventIndex].actions.push(action.name);
        // In a single-state diagram a transition must exit the state, so set
        // the event's "exit state" flag if it isn't already set.
        if (
          action.actType === 'atTransition'
          && isSingleStateDiagram(stateToUpdate)
          && !stateToUpdate.eventActions[eventIndex].moveFromCurrent
        ) {
          stateToUpdate.eventActions[eventIndex].moveFromCurrent = true;
          showAlert(SINGLE_STATE_EXIT_FLAG_MESSAGE, 'info');
        }
      } else {
        stateToUpdate.eventActions.push({
          moveFromCurrent: false,
          actions: [action.name],
        });
      }

      updateState(stateToUpdate);
    }
  };

  const updateStateImmediateActions = (stateName: string, action: Action) => {
    const stateToUpdate = getStateByStateName(stateName);
    if (stateToUpdate) {
      // Transition actions are not allowed as immediate actions in a
      // single-state diagram (there is no event/exit-state flag to make the
      // transition valid).
      if (
        action.actType === 'atTransition'
        && isSingleStateDiagram(stateToUpdate)
      ) {
        showAlert(
          'Transition actions are not allowed in the immediate actions of a single state diagram.',
          'warning',
        );
        return;
      }
      if (stateToUpdate.immediateActions.includes(action.name)) {
        return;
      }
      stateToUpdate.immediateActions = [
        ...stateToUpdate.immediateActions,
        action.name,
      ];
      updateState(stateToUpdate);
    }
  };

  const deleteState = (stateId?: string) => {
    if (!stateId) {
      throw new Error('No stateId provided');
    }
    const stateToDelete = getStateByStateId(stateId);
    if (!stateToDelete) {
      throw new Error('State not found');
    }
    const clearedRefs: ClearedRef[] = [];
    updateAppData(DeleteItemAndRefs(stateToDelete, clearedRefs));
    const msg = formatClearedRefsMessage(
      'State',
      stateToDelete.name,
      clearedRefs,
    );
    if (msg) {
      showAlert(msg, 'warning');
    }
  };

  const getStateByStateId = (stateId: string | null) =>
    statesList.value.find(stateItem => stateItem.id === stateId);

  const getStateByStateName = (stateName: string) =>
    statesList.value.find(stateItem => stateItem.name === stateName);

  const getEventsByStateName = (stateName: string) => {
    const state = getStateByStateName(stateName);
    return state
      ? {
          type: state.stateType,
          events: state.events,
          eventActions: state.eventActions,
          immediateActions: state.immediateActions,
          geometryInfo: {
            x: state.geometryInfo?.x ?? defaultGeometryInfo.x,
            y: state.geometryInfo?.y ?? defaultGeometryInfo.y,
            width: state.geometryInfo?.width ?? defaultGeometryInfo.width,
            height: state.geometryInfo?.height ?? defaultGeometryInfo.height,
          },
        }
      : {
          type: '',
          events: [],
          eventActions: [],
          immediateActions: [],
          geometryInfo: { x: 0, y: 0, width: 0, height: 0 },
        };
  };

  const updateStatePosition = (
    state?: State,
    position?: { x: number; y: number },
  ) => {
    if (state?.geometryInfo) {
      try {
        state.geometryInfo.x = position?.x;
        state.geometryInfo.y = position?.y;
        updateState(state);
      } catch (error) {
        console.error('Error updating geometryInfo:', error);
      }
    }
    return;
  };

  // Open New, Merge, and Clear State List
  const newStateList = (newStateList: State[]) => {
    setStates(newStateList);
  };

  const mergeStateList = (newStateList: State[]) => {
    setStates([...states, ...newStateList]);
  };

  const clearStateList = () => {
    updateAppData(structuredClone({ ...appData.value, StateList: [] }));
  };

  return (
    <StateContext.Provider
      value={{
        states,
        statesList,
        createState,
        updateState,
        updateStateEvents,
        updateStateEventActions,
        updateStateImmediateActions,
        updateStatePosition,
        deleteState,
        getEventsByStateName,
        getStateByStateName,
        getStateByStateId,
        newStateList,
        mergeStateList,
        clearStateList,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
