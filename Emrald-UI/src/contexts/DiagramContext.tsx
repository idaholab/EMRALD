import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { computed, effect } from '@preact/signals';
import { Diagram } from '../types/Diagram';
import { updateModelAndReferences } from '../utils/UpdateModel';
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

    updateModelAndReferences(updatedDiagram, MainItemTypes.Diagram);
    
    // const updatedDiagrams = diagrams.map((item) => {
    //   if (item.id === updatedDiagram.id) {
    //     const previousName = item.name; // Get the previous name
    //     const newName = updatedDiagram.name; // Get the new name from the updatedDiagram object
        
    //     item = updatedDiagram;

    //     // Call updateKeyAndReferences here to update references in the updatedDiagram
    //     updateModelAndReferences(appData.value, MainItemTypes.Diagram,  previousName, newName);
    //     return updatedDiagram;
    //   } else {
    //     return item;
    //   }
    //});
    //appData.value.DiagramList = updatedDiagrams;
    //updateAppData(appData.value);
    setDiagrams(appData.value.DiagramList);
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
