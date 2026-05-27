import type { ExtSim } from '../types/EMRALD_Model';
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

interface ExtSimContextType {
  extSims: ExtSim[];
  extSimList: ReadonlySignal<ExtSim[]>;
  createExtSim: (newExtSim: ExtSim) => void;
  updateExtSim: (ExtSim: ExtSim) => void;
  deleteExtSim: (ExtSimId?: string) => void;
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
    throw new Error(
      'useExtSimContext must be used within an ExtSimContextProvider',
    );
  }
  return context;
}

export const ExtSimContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [extSims, setExtSims] = useState(
    structuredClone(
      appData.value.ExtSimList.toSorted((a, b) => a.name.localeCompare(b.name)),
    ),
  );
  const extSimList = useComputed(() => appData.value.ExtSimList);
  const { showAlert } = useAlertContext();

  effect(() => {
    if (
      JSON.stringify(extSims)
      !== JSON.stringify(
        appData.value.ExtSimList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      )
    ) {
      setExtSims(
        appData.value.ExtSimList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
    }
    return;
  });

  const createExtSim = (newExtSim: ExtSim) => {
    updateAppData(updateModelAndReferences(newExtSim, 'ExtSim'));
  };

  const updateExtSim = (updatedExtSim: ExtSim) => {
    updateAppData(updateModelAndReferences(updatedExtSim, 'ExtSim'));
  };

  const deleteExtSim = (extSimId?: string) => {
    if (!extSimId) {
      return;
    }
    const extSimToDelete = extSims.find(extSim => extSim.id === extSimId);
    if (extSimToDelete) {
      const clearedRefs: ClearedRef[] = [];
      updateAppData(DeleteItemAndRefs(extSimToDelete, clearedRefs));
      const msg = formatClearedRefsMessage(
        'ExtSim',
        extSimToDelete.name,
        clearedRefs,
      );
      if (msg) {
        showAlert(msg, 'warning');
      }
    }
    // todo else error, no event to delete
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
