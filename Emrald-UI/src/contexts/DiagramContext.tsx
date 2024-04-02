import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { computed, effect, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { Diagram } from '../types/Diagram';
import { updateModelAndReferences } from '../utils/UpdateModel';
import { GetModelItemsReferencedBy, GetModelItemsReferencing } from '../utils/ModelReferences';
import { MainItemTypes } from '../types/ItemTypes';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { v4 as uuidv4 } from 'uuid';
import { appData, updateAppData } from '../hooks/useAppData';
interface DiagramContextType {
  diagrams: Diagram[];
  createDiagram: (newDiagram: Diagram) => void;
  updateDiagram: (updatedDiagram: Diagram) => void;
  updateDiagramDetails: (updatedDiagram: Diagram) => void;
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
    diagramLabel: "",
    states: [],
}

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

const DiagramContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [diagrams, setDiagrams] = useState<Diagram[]>(appData.value.DiagramList);

  // Create, Delete, Update individual diagrams
  const createDiagram = (newDiagram: Diagram) => {
    const updatedDiagrams = [...diagrams, newDiagram];
    setDiagrams(updatedDiagrams);
  };

  const updateDiagramDetails = (updatedDiagram: Diagram) => {
    const updatedDiagrams = diagrams.map((diagram) =>
      diagram.id === updatedDiagram.id
        ? updatedDiagram
        : diagram,
    );
    setDiagrams(updatedDiagrams);
  };

  const updateDiagram = (updatedDiagram: Diagram) => {
    // Rest of your code to update the diagram list
    console.log(updatedDiagram);
    
    var updatedModel : EMRALD_Model = updateModelAndReferences(updatedDiagram, MainItemTypes.Diagram);
    
    updateAppData(updatedModel);

    setDiagrams(updatedModel.DiagramList);
  };

  const deleteDiagram = (diagramId: string | undefined) => {
    if (!diagramId) { return; }
    const updatedDiagrams = diagrams.filter(
      (item) => item.id !== diagramId,
    );
    setDiagrams(updatedDiagrams);
  };

  const getDiagramByDiagramName = (diagramName: string) => {
    return diagrams.find((diagram) => diagram.name === diagramName) || emptyDiagram;
  }

  const getDiagramById = (diagramId: string) => {
    return diagrams.find((diagram) => diagram.id === diagramId) || emptyDiagram;
  }

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
        diagrams,
        createDiagram,
        updateDiagramDetails,
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
