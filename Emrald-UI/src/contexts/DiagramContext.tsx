import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Diagram, DiagramList } from '../types/Diagram';
import emraldData from '../emraldData.json';

interface DiagramContextType {
  diagrams: Diagram[];
  createDiagram: (newDiagram: Diagram) => void;
  updateDiagram: (updatedDiagram: Diagram) => void;
  deleteDiagram: (diagramId: number) => void;
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
    [diagramList]
  );

  const createDiagram = (newDiagram: Diagram) => {
    const updatedDiagrams = [...diagramList, { Diagram: newDiagram }];
    setDiagramList(updatedDiagrams);
  };

  const updateDiagram = (updatedDiagram: Diagram) => {
    const updatedDiagrams = diagramList.map((item) =>
      item.Diagram.id === updatedDiagram.id
        ? { Diagram: updatedDiagram }
        : item,
    );
    setDiagramList(updatedDiagrams);
  };

  const deleteDiagram = (diagramId: number) => {
    const updatedDiagrams = diagramList.filter(
      (item) => item.Diagram.id !== diagramId,
    );
    setDiagramList(updatedDiagrams);
  };

  return (
    <DiagramContext.Provider
      value={{ diagrams, createDiagram, updateDiagram, deleteDiagram }}
    >
      {children}
    </DiagramContext.Provider>
  );
};

export default DiagramContextProvider;
