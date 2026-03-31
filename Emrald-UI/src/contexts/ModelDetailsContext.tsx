import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import { appData } from '../hooks/useAppData';

interface ModelDetailsContextType {
  id?: string;
  name?: string;
  desc?: string;
  emraldVersion: number;
  version?: number;
  fileName?: string;
  setFileName: Dispatch<SetStateAction<string | undefined>>;
  setName: Dispatch<SetStateAction<string | undefined>>;
  setDesc: Dispatch<SetStateAction<string | undefined>>;
  setEmraldVersion: Dispatch<SetStateAction<number>>;
  setVersion: Dispatch<SetStateAction<number>>;
  clearFileName: () => void;
}

const ModelDetailsContext = createContext<ModelDetailsContextType | undefined>(
  undefined,
);

export function useModelDetailsContext() {
  const context = useContext(ModelDetailsContext);
  if (!context) {
    throw new Error(
      'useModelDetailsContext must be used within a ModelDetailsContextProvider',
    );
  }
  return context;
}

export const ModelDetailsContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const id = appData.value.id;
  const [name, setName] = useState(appData.value.name);
  const [desc, setDesc] = useState(appData.value.desc);
  const [emraldVersion, setEmraldVersion] = useState(
    appData.value.emraldVersion,
  );
  const [version, setVersion] = useState(appData.value.version);
  const [fileName, setFileName] = useState<string>();

  const clearFileName = () => {
    setFileName('');
  };

  return (
    <ModelDetailsContext.Provider
      value={{
        id,
        name,
        desc,
        emraldVersion,
        version,
        fileName,
        setFileName,
        setName,
        setDesc,
        setEmraldVersion,
        setVersion,
        clearFileName,
      }}
    >
      {children}
    </ModelDetailsContext.Provider>
  );
};
