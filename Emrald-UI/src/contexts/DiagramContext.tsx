import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Diagram, DiagramList } from '../types/Diagram';
import emraldData from '../emraldData.json';
import { updateReferences } from '../utils/UpdateReferences';

interface DiagramContextType {
  diagrams: Diagram[];
  createDiagram: (newDiagram: Diagram) => void;
  updateDiagram: (data: any, updatedDiagram: Diagram) => void;
  deleteDiagram: (diagramId: number | string) => void;
  newDiagramList: (newDiagramList: DiagramList) => void;
  mergeDiagramList: (newDiagramList: DiagramList) => void;
  clearDiagramList: () => void;
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

const DiagramContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [diagramList, setDiagramList] = useState<DiagramList>(
    emraldData.DiagramList,
  );

  // Memoize the value of `diagrams` to avoid unnecessary re-renders
  const diagrams = useMemo(
    () => diagramList.map(({ Diagram }) => Diagram),
    [diagramList],
  );

  // Create, Delete, Update individual diagrams
  const createDiagram = (newDiagram: Diagram) => {
    const updatedDiagrams = [...diagramList, { Diagram: newDiagram }];
    setDiagramList(updatedDiagrams);
  };

  // const updateDiagram = (data: any, updatedDiagram: Diagram) => {
  //   const updatedDiagrams = diagramList.map((item) =>
  //     item.Diagram.id === updatedDiagram.id
  //       ? { Diagram: updatedDiagram }
  //       : item,
  //   );
  //   setDiagramList(updatedDiagrams);
  // };

  const updateDiagram = (data: any, updatedDiagram: Diagram) => {
    // Rest of your code to update the diagram list
    const updatedDiagrams = diagramList.map((item) => {
      if (item.Diagram.id === updatedDiagram.id) {
        const previousName = item.Diagram.name; // Get the previous name
        const newName = updatedDiagram.name; // Get the new name from the updatedDiagram object
  
        // Call updateKeyAndReferences here to update references in the updatedDiagram
        const updatedData = updateReferences(data, previousName, newName);
        console.log(updatedData);
  
        return { Diagram: updatedDiagram };
      } else {
        return item;
      }
    });
  
    setDiagramList(updatedDiagrams);
  };

  const deleteDiagram = (diagramId: number | string) => {
    const updatedDiagrams = diagramList.filter(
      (item) => item.Diagram.id !== diagramId,
    );
    setDiagramList(updatedDiagrams);
  };

  // Open New, Merge, and Clear Diagram List
  const newDiagramList = (newDiagramList: DiagramList) => {
    setDiagramList(newDiagramList);
  };

  const mergeDiagramList = (newDiagramList: DiagramList) => {
    setDiagramList([...diagramList, ...newDiagramList]);
  };

  const clearDiagramList = () => {
    setDiagramList([]);
  };

  return (
    <DiagramContext.Provider
      value={{
        diagrams,
        createDiagram,
        updateDiagram,
        deleteDiagram,
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
