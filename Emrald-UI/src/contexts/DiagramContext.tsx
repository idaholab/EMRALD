import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import { Diagram, DiagramList } from '../interfaces/Diagram';
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
  const [diagrams] = useState<Diagram[]>(
    emraldData.DiagramList.map(({ Diagram }) => Diagram),
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
