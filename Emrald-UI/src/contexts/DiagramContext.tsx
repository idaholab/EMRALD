import React, { createContext, useContext, useState } from 'react';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { Diagram } from '../types/Diagram';
import { updateModelAndReferences } from '../utils/UpdateModel';
import { MainItemTypes } from '../types/ItemTypes';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { v4 as uuidv4 } from 'uuid';
import { appData, updateAppData } from '../hooks/useAppData';
interface DiagramContextType {
  diagramList: ReadonlySignal<Diagram[]>;
  diagrams: Diagram[];
  createDiagram: (newDiagram: Diagram) => void;
  updateDiagram: (updatedDiagram: Diagram) => void;
  deleteDiagram: (diagramId: string | undefined) => void;
  getDiagramByDiagramName: (diagramName: string) => Diagram;
  getDiagramById: (diagramId: string) => Diagram;
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
};

const DiagramContext = createContext<DiagramContextType | undefined>(undefined);

export function useDiagramContext() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error(
      'useDiagramContext must be used within a DiagramContextProvider',
    );
  }
  return context;
}

const DiagramContextProvider: React.FC<EmraldContextWrapperProps> = ({
  children,
}) => {
  const [diagrams, setDiagrams] = useState<Diagram[]>(
    appData.value.DiagramList.sort((a, b) => a.name.localeCompare(b.name)),
  );
  const diagramList = useComputed(() => appData.value.DiagramList);

  // Create, Delete, Update individual diagrams
  const createDiagram = (newDiagram: Diagram) => {
    const updatedDiagrams = [...diagrams, newDiagram];
    appData.value.DiagramList = updatedDiagrams;
    updateAppData(appData.value);
    setDiagrams(updatedDiagrams);
  };

  const updateDiagram = async (updatedDiagram: Diagram) => {
    // Rest of your code to update the diagram list
    console.log(updatedDiagram);

    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      updatedDiagram,
      MainItemTypes.Diagram,
    );
    console.log('Calling update app data');
    updateAppData(JSON.parse(JSON.stringify(updatedModel)));
    console.log('Called update app data');
    setDiagrams(updatedModel.DiagramList);
  };

  const deleteDiagram = (diagramId: string | undefined) => {
    if (!diagramId) {
      return;
    }
    const updatedDiagrams = diagrams.filter((item) => item.id !== diagramId);
    updateAppData(
      JSON.parse(
        JSON.stringify({ ...appData.value, DiagramList: updatedDiagrams }),
      ),
    );
    setDiagrams(updatedDiagrams);
  };

  const getDiagramByDiagramName = (diagramName: string) => {
    return (
      diagramList.value.find((diagram) => diagram.name === diagramName) ||
      emptyDiagram
    );
  };

  const getDiagramById = (diagramId: string) => {
    return (
      diagramList.value.find((diagram) => diagram.id === diagramId) ||
      emptyDiagram
    );
  };

  // Open New, Merge, and Clear Diagram List
  const newDiagramList = (newDiagramList: Diagram[]) => {
    setDiagrams(newDiagramList);
  };

  const mergeDiagramList = (newDiagramList: Diagram[]) => {
    setDiagrams([...diagrams, ...newDiagramList]);
  };

  const clearDiagramList = () => {
    setDiagrams([]);
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
