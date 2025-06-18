import React, { createContext, useContext, useState } from 'react';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { effect, ReadonlySignal, useComputed } from '@preact/signals-react';
import { EMRALD_Model, State, Event, Action } from '../types/EMRALD_Model';
import { DeleteItemAndRefs, updateModelAndReferences } from '../utils/UpdateModel';

interface StateContextType {
  states: State[];
  statesList: ReadonlySignal<State[]>;
  createState: (newState: State) => Promise<void>;
  updateState: (updatedState: State) => Promise<void>;
  updateStateEvents: (stateName: string, event: Event) => void;
  updateStateEventActions: (stateName: string, eventName: string, action: Action) => void;
  updateStateImmediateActions: (stateName: string, action: Action) => void;
  updateStatePosition: (state: State, position: { x: number; y: number }) => void;
  deleteState: (StateId: string | undefined) => Promise<void>;
  getEventsByStateName: (stateName: string) => {
    events: string[];
    type: string;
    eventActions: EventAction[];
    immediateActions: string[];
    geometryInfo: { x: number; y: number; width: number; height: number };
  };
  getStateByStateName: (stateName: string) => State;
  getStateByStateId: (stateId: string | null) => State;
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
    throw new Error('useStateContext must be used within a StateContextProvider');
  }
  return context;
}

const StateContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [states, setStates] = useState<State[]>(
    JSON.parse(
      JSON.stringify(appData.value.StateList.sort((a, b) => a.name.localeCompare(b.name))),
    ),
  );
  const statesList = useComputed(() => appData.value.StateList);
  const defaultGeometryInfo = { x: 0, y: 0, width: 0, height: 0 };

  effect(() => {
    if (
      JSON.stringify(states) !==
      JSON.stringify(appData.value.StateList.sort((a, b) => a.name.localeCompare(b.name)))
    ) {
      setStates(appData.value.StateList.sort((a, b) => a.name.localeCompare(b.name)));
      return;
    }
    return;
  });

  // Create, Delete, Update individual States
  const createState = async (newState: State) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(newState, 'State');
    updateAppData(updatedModel);
  };

  const updateState = async (updatedState: State) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      updatedState,
      'State',
    );
    updateAppData(updatedModel);
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

  const updateStateEventActions = (stateName: string, eventName: string, action: Action) => {
    const stateToUpdate = getStateByStateName(stateName);
    if (stateToUpdate) {
      const eventIndex = stateToUpdate?.events.indexOf(eventName);
      if (!stateToUpdate.eventActions[eventIndex]) {
        stateToUpdate.eventActions.push({
          moveFromCurrent: false,
          actions: [action.name],
        });
      } else {
        if (stateToUpdate.eventActions[eventIndex].actions.includes(action.name)) {
          return;
        }
        stateToUpdate.eventActions[eventIndex].actions.push(action.name);
      }

      updateState(stateToUpdate);
    }
  };

  const updateStateImmediateActions = (stateName: string, action: Action) => {
    const stateToUpdate = getStateByStateName(stateName);
    if (stateToUpdate) {
      if (stateToUpdate.immediateActions.includes(action.name)) {
        return;
      }
      stateToUpdate.immediateActions = [...stateToUpdate.immediateActions, action.name];
      updateState(stateToUpdate);
    }
  };

  const deleteState = async (stateId: string | undefined) => {
    if (!stateId) {
      throw new Error('No stateId provided');
    }
    const stateToDelete = getStateByStateId(stateId);
    if (!stateToDelete) {
      throw new Error('State not found');
    }
    var updatedModel: EMRALD_Model = await DeleteItemAndRefs(stateToDelete);
    updateAppData(updatedModel);
  };

  const getStateByStateId = (stateId: string | null): State => {
    const state = statesList.value.find((stateItem) => stateItem.id === stateId);
    return state || emptyState;
  };

  const getStateByStateName = (stateName: string): State => {
    const state = statesList.value.find((stateItem) => stateItem.name === stateName);
    return state || emptyState;
  };

  const getEventsByStateName = (stateName: string) => {
    const state = getStateByStateName(stateName);
    if (state) {
      return {
        type: state.stateType || '',
        events: state.events || [],
        eventActions: state.eventActions || [],
        immediateActions: state.immediateActions || [],
        geometryInfo: {
          x: state.geometryInfo?.x ?? defaultGeometryInfo.x,
          y: state.geometryInfo?.y ?? defaultGeometryInfo.y,
          width: state.geometryInfo?.width ?? defaultGeometryInfo.width,
          height: state.geometryInfo?.height ?? defaultGeometryInfo.height,
        },
      };
    }
    return {
      type: '',
      events: [],
      eventActions: [],
      immediateActions: [],
      geometryInfo: { x: 0, y: 0, width: 0, height: 0 },
    };
  };

  const updateStatePosition = (state: State, position: { x: number; y: number }) => {
    if (state?.geometryInfo) {
      try {
        state.geometryInfo.x = position.x;
        state.geometryInfo.y = position.y;
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
    updateAppData(JSON.parse(JSON.stringify({ ...appData.value, StateList: [] })));
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

export default StateContextProvider;
