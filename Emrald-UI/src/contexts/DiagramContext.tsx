import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { Diagram } from '../types/Diagram';
import { updateModelAndReferences } from '../utils/UpdateModel';
import { MainItemTypes } from '../types/ItemTypes';
import jsonPath from 'jsonpath';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
interface DiagramContextType {
  diagrams: Diagram[];
  createDiagram: (newDiagram: Diagram) => void;
  updateDiagram: (data: any, updatedDiagram: Diagram) => void;
  updateDiagramDetails: (updatedDiagram: Diagram) => void;
  deleteDiagram: (diagramId: number | string) => void;
  getDiagramByDiagramName: (diagramName: string) => Diagram;
  newDiagramList: (newDiagramList: Diagram[]) => void;
  mergeDiagramList: (newDiagramList: Diagram[]) => void;
  clearDiagramList: () => void;
}

export const emptyDiagram: Diagram = {
    id: 0,
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

const DiagramContextProvider: React.FC<EmraldContextWrapperProps> = ({ appData, updateAppData, children }) => {
  const [diagrams, setDiagrams] = useState<Diagram[]>(appData.DiagramList);

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

  const updateDiagram = (data: any, updatedDiagram: Diagram) => {
    // Rest of your code to update the diagram list
    const updatedDiagrams = diagrams.map((item) => {
      if (item.id === updatedDiagram.id) {
        const previousName = item.name; // Get the previous name
        const newName = updatedDiagram.name; // Get the new name from the updatedDiagram object

        // Call updateKeyAndReferences here to update references in the updatedDiagram
        //const updatedData = updateModelAndReferences(data, MainItemTypes.Diagram,  previousName, newName);
  
        return updatedDiagram;
      } else {
        return item;
      }
    });
  
    setDiagrams(updatedDiagrams);
  };

  const deleteDiagram = (diagramId: number | string) => {
    const updatedDiagrams = diagrams.filter(
      (item) => item.id !== diagramId,
    );
    setDiagrams(updatedDiagrams);
  };

  const getDiagramByDiagramName = (diagramName: string) => {
    return diagrams.find((diagram) => diagram.name === diagramName) || emptyDiagram;
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
