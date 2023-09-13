import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { State, StateList } from '../types/State';
import emraldData from '../emraldData.json';

interface StateContextType {
  states: State[];
  createState: (newState: State) => void;
  updateState: (updatedState: State) => void;
  deleteState: (StateId: number) => void;
  newStateList: (newStateList: StateList) => void;
  mergeStateList: (newStateList: StateList) => void;
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

const StateContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [stateList, setStateList] = useState<StateList>(
    emraldData.StateList as StateList,
  );

  // Memoize the value of `States` to avoid unnecessary re-renders
  const states = useMemo(
    () => stateList.map(({ State }) => State) as State[],
    [stateList],
  );

  // Create, Delete, Update individual States
  const createState = (newState: State) => {
    const updatedStates = [...stateList, { State: newState }];
    setStateList(updatedStates);
  };

  const updateState = (updatedState: State) => {
    const updatedStates = stateList.map((item) =>
      item.State.id === updatedState.id
        ? { State: updatedState }
        : item,
    );
    setStateList(updatedStates);
  };

  const deleteState = (stateId: number) => {
    const updatedStates = stateList.filter(
      (item) => item.State.id !== stateId,
    );
    setStateList(updatedStates);
  };

  // Open New, Merge, and Clear State List
  const newStateList = (newStateList: StateList) => {
    setStateList(newStateList);
  };

  const mergeStateList = (newStateList: StateList) => {
    setStateList([...stateList, ...newStateList]);
  };

  const clearStateList = () => {
    setStateList([]);
  };

  return (
    <StateContext.Provider
      value={{
        states,
        createState,
        updateState,
        deleteState,
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
