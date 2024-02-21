import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Diagram } from '../types/Diagram';
import { updateReferences } from '../utils/UpdateReferences';
import jsonPath from 'jsonpath';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
interface DiagramContextType {
  diagrams: Diagram[];
  createDiagram: (newDiagram: Diagram) => void;
  updateDiagram: (data: any, updatedDiagram: Diagram) => void;
  deleteDiagram: (diagramId: number | string) => void;
  newDiagramList: (newDiagramList: Diagram[]) => void;
  mergeDiagramList: (newDiagramList: Diagram[]) => void;
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

const DiagramContextProvider: React.FC<EmraldContextWrapperProps> = ({ appData, updateAppData, children }) => {
  const [diagrams, setDiagrams] = useState<Diagram[]>(appData.DiagramList);

  // Memoize the value of `diagrams` to avoid unnecessary re-renders
  // const diagrams = useMemo(
  //   () => {
  //     return diagramList.map(({ Diagram }) => Diagram)},
  //   [diagramList],
  // );

  // useEffect(() => {
  //   setDiagrams(appData.DiagramList as Diagram[]);
  // }, [appData]);

  // Create, Delete, Update individual diagrams
  const createDiagram = (newDiagram: Diagram) => {
    const updatedDiagrams = [...diagrams, newDiagram];
    setDiagrams(updatedDiagrams);
  };

  const updateDiagram = (data: any, updatedDiagram: Diagram) => {
    // Rest of your code to update the diagram list
    const updatedDiagrams = diagrams.map((item) => {
      if (item.id === updatedDiagram.id) {
        const previousName = item.name; // Get the previous name
        const newName = updatedDiagram.name; // Get the new name from the updatedDiagram object

        // Update all references to the name in the appData
        const references = jsonPath.paths(appData, `$..[?(@ == "${previousName}")]`);
        references.forEach(ref => {
          const path = ref.join('.');
          const value = jsonPath.value(appData, path);
          if (value === previousName) {
            jsonPath.value(appData, path, newName);
          }
        });

        // Call updateKeyAndReferences here to update references in the updatedDiagram
        const updatedData = updateReferences(data, previousName, newName);
        updateAppData(updatedData);
  
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
