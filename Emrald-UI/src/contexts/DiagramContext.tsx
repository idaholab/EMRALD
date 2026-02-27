import React, { createContext, useContext, useState } from 'react';
import { effect, type ReadonlySignal, useComputed } from '@preact/signals-react';
import type { EMRALD_Model, Diagram } from '../types/EMRALD_Model';
import { DeleteItemAndRefs, updateModelAndReferences } from '../utils/UpdateModel';
import type { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { v4 as uuidv4 } from 'uuid';
import { appData, updateAppData } from '../hooks/useAppData';

interface DiagramContextType {
  diagramList: ReadonlySignal<Diagram[]>;
  diagrams: Diagram[];
  createDiagram: (newDiagram: Diagram) => void;
  updateDiagram: (updatedDiagram: Diagram) => void;
  deleteDiagram: (diagramId: string | undefined) => void;
  getDiagramByDiagramName: (diagramName: string) => Diagram | undefined;
  getDiagramById: (diagramId: string) => Diagram | undefined;
  newDiagramList: (newDiagramList: Diagram[]) => void;
  mergeDiagramList: (newDiagramList: Diagram[]) => void;
  clearDiagramList: () => void;
}

export const emptyDiagram: Diagram = {
  id: uuidv4(),
  name: '',
  desc: '',
  diagramType: 'dtSingle',
  diagramLabel: 'Component',
  states: [],
  required: false,
  objType: 'Diagram',
};

const DiagramContext = createContext<DiagramContextType | undefined>(undefined);

export function useDiagramContext() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error('useDiagramContext must be used within a DiagramContextProvider');
  }
  return context;
}

const DiagramContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [diagrams, setDiagrams] = useState<Diagram[]>(
    appData.value.DiagramList.sort((a, b) => a.name.localeCompare(b.name)),
  );
  const diagramList = useComputed(() => appData.value.DiagramList);

  effect(() => {
    if (
      JSON.stringify(diagrams) !==
      JSON.stringify(appData.value.DiagramList.sort((a, b) => a.name.localeCompare(b.name)))
    ) {
      setDiagrams(appData.value.DiagramList.sort((a, b) => a.name.localeCompare(b.name)));
      return;
    }
    return;
  });

  // Create, Delete, Update individual diagrams
  const createDiagram = (newDiagram: Diagram) => {
    const updatedModel = updateModelAndReferences(
      newDiagram,
      'Diagram',
    );
    updateAppData(updatedModel);
  };

  const updateDiagram = (updatedDiagram: Diagram) => {
    const updatedModel = updateModelAndReferences(
      updatedDiagram,
      'Diagram',
    );
    updateAppData(updatedModel);
  };

  const deleteDiagram = (diagramId: string | undefined) => {
    if (!diagramId) {
      return;
    }
    const diagramToDelete = getDiagramById(diagramId);
    if (diagramToDelete) {
      const updatedModel = DeleteItemAndRefs(diagramToDelete);
      updateAppData(updatedModel);
    }
    //todo else error, not diagram to delete
  };

  const getDiagramByDiagramName = (diagramName: string) => {
    return diagramList.value.find((diagram) => diagram.name === diagramName);
  };

  const getDiagramById = (diagramId: string) => {
    return diagramList.value.find((diagram) => diagram.id === diagramId);
  };

  // Open New, Merge, and Clear Diagram List
  const newDiagramList = (newDiagramList: Diagram[]) => {
    setDiagrams(newDiagramList);
  };

  const mergeDiagramList = (newDiagramList: Diagram[]) => {
    setDiagrams([...diagrams, ...newDiagramList]);
  };

  const clearDiagramList = () => {
    updateAppData(JSON.parse(JSON.stringify({ ...appData.value, DiagramList: [] })) as EMRALD_Model);
  };

  return (
    <DiagramContext.Provider
      value={{
        diagramList,
        diagrams,
        createDiagram,
        updateDiagram,
        deleteDiagram,
        getDiagramByDiagramName,
        getDiagramById,
        newDiagramList,
        mergeDiagramList,
        clearDiagramList,
      }}
    >
      {children}
    </DiagramContext.Provider>
  );
};

export default DiagramContextProvider;
