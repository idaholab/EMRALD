import type { Diagram } from '../types/EMRALD_Model';
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
import { v4 as uuidv4 } from 'uuid';
import { appData, updateAppData } from '../hooks/useAppData';
import {
  DeleteItemAndRefs,
  updateModelAndReferences,
} from '../utils/UpdateModel';

interface DiagramContextType {
  diagramList: ReadonlySignal<Diagram[]>;
  diagrams: Diagram[];
  createDiagram: (newDiagram: Diagram) => void;
  updateDiagram: (updatedDiagram: Diagram) => void;
  deleteDiagram: (diagramId?: string) => void;
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
    throw new Error(
      'useDiagramContext must be used within a DiagramContextProvider',
    );
  }
  return context;
}

export const DiagramContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [diagrams, setDiagrams] = useState(
    appData.value.DiagramList.toSorted((a, b) => a.name.localeCompare(b.name)),
  );
  const diagramList = useComputed(() => appData.value.DiagramList);

  effect(() => {
    if (
      JSON.stringify(diagrams)
      !== JSON.stringify(
        appData.value.DiagramList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      )
    ) {
      setDiagrams(
        appData.value.DiagramList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      return;
    }
    return;
  });

  // Create, Delete, Update individual diagrams
  const createDiagram = (newDiagram: Diagram) => {
    updateAppData(updateModelAndReferences(newDiagram, 'Diagram'));
  };

  const updateDiagram = (updatedDiagram: Diagram) => {
    updateAppData(updateModelAndReferences(updatedDiagram, 'Diagram'));
  };

  const deleteDiagram = (diagramId?: string) => {
    if (!diagramId) {
      return;
    }
    const diagramToDelete = getDiagramById(diagramId);
    if (diagramToDelete) {
      updateAppData(DeleteItemAndRefs(diagramToDelete));
    }
    // todo else error, not diagram to delete
  };

  const getDiagramByDiagramName = (diagramName: string) =>
    diagramList.value.find(diagram => diagram.name === diagramName);

  const getDiagramById = (diagramId: string) =>
    diagramList.value.find(diagram => diagram.id === diagramId);

  // Open New, Merge, and Clear Diagram List
  const newDiagramList = (newDiagramList: Diagram[]) => {
    setDiagrams(newDiagramList);
  };

  const mergeDiagramList = (newDiagramList: Diagram[]) => {
    setDiagrams([...diagrams, ...newDiagramList]);
  };

  const clearDiagramList = () => {
    updateAppData(structuredClone({ ...appData.value, DiagramList: [] }));
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
