import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { ExtSim } from '../types/ExtSim';

interface ExtSimContextType {
  extSims: ExtSim[];
  extSimList: ReadonlySignal<ExtSim[]>;
  createExtSim: (newExtSim: ExtSim) => void;
  updateExtSim: (ExtSim: ExtSim) => void;
  deleteExtSim: (ExtSimId: string | undefined) => void;
  newExtSimList: (newExtSimList: ExtSim[]) => void;
  clearExtSimList: () => void;
}

export const emptyExtSim: ExtSim = {
  id: "",
  name: '',
  resourceName: '',
};

const ExtSimContext = createContext<ExtSimContextType | undefined>(
  undefined,
);

export function useExtSimContext() {
  const context = useContext(ExtSimContext);
  if (!context) {
    throw new Error(
      'useExtSimContext must be used within an ExtSimContextProvider',
    );
  }
  return context;
}

const ExtSimContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [extSims, setExtSims] = useState<ExtSim[]>(JSON.parse(JSON.stringify(appData.value.ExtSimList.sort((a,b) => a.name.localeCompare(b.name)))));
  const extSimList = useComputed(() => appData.value.ExtSimList);

  const createExtSim = (newExtSim: ExtSim) => {
    const updatedExtSimList = [...extSims, newExtSim];
    appData.value.ExtSimList = updatedExtSimList;
    updateAppData(appData.value);
    setExtSims(updatedExtSimList);
  };

  const updateExtSim = (updatedExtSim: ExtSim) => {
    const updatedExtSimList = extSimList.value.map((item) =>
      item.id === updatedExtSim.id
        ? updatedExtSim
        : item,
    );
    setExtSims(updatedExtSimList);
  };

  const deleteExtSim = (extSimId: string | undefined) => {
    if (!extSimId) { return; }
    const updatedExtSimList = extSimList.value.filter(
      (item) => item.id !== extSimId,
    );
    setExtSims(updatedExtSimList);
  };

  // Open New, Merge, and Clear Event List
  const newExtSimList = (newExtSimList: ExtSim[]) => {
    setExtSims(newExtSimList);
  };

  const clearExtSimList = () => {
    setExtSims([]);

    console.log(extSims);
  };

  return (
    <ExtSimContext.Provider
      value={{
        extSims,
        extSimList,
        createExtSim,
        updateExtSim,
        deleteExtSim,
        newExtSimList,
        clearExtSimList,
      }}
    >
      {children}
    </ExtSimContext.Provider>
  );
};

export default ExtSimContextProvider;
