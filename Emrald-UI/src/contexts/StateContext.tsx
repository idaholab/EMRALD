import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { EventAction, State } from '../types/State';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';

interface StateContextType {
  states: State[];
  createState: (newState: State) => void;
  updateState: (updatedState: State) => void;
  deleteState: (StateId: number | string) => void;
  getEventsByStateName: (stateName: string) => {events: String[]; type: string; eventActions: EventAction[]; immediateActions: string[]};
  getStatePosition: (stateName: string) => {x: number; y: number};
  newStateList: (newStateList: State[]) => void;
  mergeStateList: (newStateList: State[]) => void;
  clearStateList: () => void;
}

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

const StateContextProvider: React.FC<EmraldContextWrapperProps> = ({ appData, updateAppData, children }) => {
  const [states, setStates] = useState<State[]>(
    appData.StateList,
  );

  // Memoize the value of `States` to avoid unnecessary re-renders
  // const states = useMemo(
  //   () => stateList.map(({ State }) => State) as State[],
  //   [stateList],
  // );

  // useEffect(() => {
  //   setStateList(appData.StateList as StateList);
  // }, [appData]);

  // Create, Delete, Update individual States
  const createState = (newState: State) => {
    const updatedStates = [...states, newState];
    setStates(updatedStates);
  };

  const updateState = (updatedState: State) => {
    const updatedStates = states.map((item) =>
      item.id === updatedState.id
        ? updatedState
        : item,
    );
    setStates(updatedStates);
  };

  const deleteState = (stateId: number | string) => {
    const updatedStates = states.filter(
      (item) => item.id !== stateId,
    );
    setStates(updatedStates);
  };

  const getEventsByStateName = (stateName: string) => {
    const state = states.find((state) => state.name === stateName);
    if (state) {
      return {
        type: state.stateType || '',
        events: state.events || [],
        eventActions: state.eventActions || [],
        immediateActions: state.immediateActions || [],
      };
    }
    return { type: '', events: [], eventActions: [], immediateActions: [] };
  };

  const getStatePosition = (stateName: string) => {
    const state = states.find((state) => state.name === stateName);
    if (state?.geometry) {
      try {
        const correctedString = state.geometry
        .replace(/([a-zA-Z0-9]+)\s*:/g, '"$1":') // Replace property names with double quotes
        .replace(/'/g, '"'); // Replace single quotes with double quotes
        const parsedGeometry = JSON.parse(correctedString);
        return parsedGeometry || { x: 0, y: 0 };
      } catch (error) {
        console.error('Error parsing geometry:', error);
      }
    }
    return { x: 0, y: 0 };
  };

  // Open New, Merge, and Clear State List
  const newStateList = (newStateList: State[]) => {
    setStates(newStateList);
  };

  const mergeStateList = (newStateList: State[]) => {
    setStates([...states, ...newStateList]);
  };

  const clearStateList = () => {
    setStates([]);
  };

  return (
    <StateContext.Provider
      value={{
        states,
        createState,
        updateState,
        deleteState,
        getEventsByStateName,
        getStatePosition,
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
