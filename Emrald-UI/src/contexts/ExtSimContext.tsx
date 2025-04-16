import React, { createContext, useContext, useState } from 'react';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { effect, ReadonlySignal, useComputed } from '@preact/signals-react';
import { ExtSim } from '../types/ExtSim';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { DeleteItemAndRefs, updateModelAndReferences } from '../utils/UpdateModel';
import { MainItemTypes } from '../types/ItemTypes';

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
    ),
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

  const createExtSim = async (newExtSim: ExtSim) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      newExtSim,
      MainItemTypes.ExtSim,
    );
    updateAppData(updatedModel);
  };

  const updateExtSim = async (updatedExtSim: ExtSim) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      updatedExtSim,
      MainItemTypes.ExtSim,
    );
    updateAppData(updatedModel);
  };

  const deleteExtSim = async (extSimId: string | undefined) => {
    if (!extSimId) {
      return;
    }
    const extSimToDelete = extSims.find((extSim) => extSim.id === extSimId);
    if (extSimToDelete) {
      var updatedModel: EMRALD_Model = await DeleteItemAndRefs(extSimToDelete);
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
