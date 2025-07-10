import React, { createContext, useContext, useState } from 'react';
import type { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { effect, type ReadonlySignal, useComputed } from '@preact/signals-react';
import type { ExtSim } from '../types/EMRALD_Model';
import { DeleteItemAndRefs, updateModelAndReferences } from '../utils/UpdateModel';

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
  id: '',
  name: '',
  resourceName: '',
  objType: 'ExtSim',
};

const ExtSimContext = createContext<ExtSimContextType | undefined>(undefined);

export function useExtSimContext() {
  const context = useContext(ExtSimContext);
  if (!context) {
    throw new Error('useExtSimContext must be used within an ExtSimContextProvider');
  }
  return context;
}

const ExtSimContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [extSims, setExtSims] = useState<ExtSim[]>(
    JSON.parse(
      JSON.stringify(appData.value.ExtSimList.sort((a, b) => a.name.localeCompare(b.name))),
    ) as ExtSim[],
  );
  const extSimList = useComputed(() => appData.value.ExtSimList);

  effect(() => {
    if (
      JSON.stringify(extSims) !==
      JSON.stringify(appData.value.ExtSimList.sort((a, b) => a.name.localeCompare(b.name)))
    ) {
      setExtSims(appData.value.ExtSimList.sort((a, b) => a.name.localeCompare(b.name)));
    }
    return;
  });

  const createExtSim = (newExtSim: ExtSim) => {
    const updatedModel = updateModelAndReferences(
      newExtSim,
      'ExtSim',
    );
    updateAppData(updatedModel);
  };

  const updateExtSim = (updatedExtSim: ExtSim) => {
    const updatedModel = updateModelAndReferences(
      updatedExtSim,
      'ExtSim',
    );
    updateAppData(updatedModel);
  };

  const deleteExtSim = (extSimId: string | undefined) => {
    if (!extSimId) {
      return;
    }
    const extSimToDelete = extSims.find((extSim) => extSim.id === extSimId);
    if (extSimToDelete) {
      const updatedModel = DeleteItemAndRefs(extSimToDelete);
      updateAppData(updatedModel);
    }
    //todo else error, no event to delete
  };

  // Open New, Merge, and Clear Event List
  const newExtSimList = (newExtSimList: ExtSim[]) => {
    setExtSims(newExtSimList);
  };

  const clearExtSimList = () => {
    updateAppData({ ...appData.value, ExtSimList: [] });
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
