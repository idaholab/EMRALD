import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';

interface ModelDetailsContextType {
  id: number;
  name: string;
  desc: string;
  emraldVersion: number;
  version: number;
  updateName: (name: string) => void;
  updateDescription: (desc: string) => void;
  updateEmraldVersion: (version: number) => void;
  updateVersion: (version: number) => void;
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

const ModelDetailsContextProvider: React.FC<EmraldContextWrapperProps> = ({
  appData,
  updateAppData,
  children,
}) => {
  const id = appData.id;
  const [name, setName] = useState(appData.name);
  const [desc, setDesc] = useState(appData.desc);
  const [emraldVersion, setEmraldVersion] = useState(appData.emraldVersion);
  const [version, setVersion] = useState(appData.version);

  const updateName = (updatedName: string) => {
    setName(updatedName);
  };
  const updateDescription = (updatedDesc: string) => {
    setDesc(updatedDesc);
  };
  const updateEmraldVersion = (updatedVersion: number) => {
    setEmraldVersion(updatedVersion);
  };
  const updateVersion = (updatedVersion: number) => {
    setVersion(updatedVersion);
  };

  return (
    <ModelDetailsContext.Provider
      value={{
        id,
        name,
        desc,
        emraldVersion,
        version,
        updateName,
        updateDescription,
        updateEmraldVersion,
        updateVersion,
      }}
    >
      {children}
    </ModelDetailsContext.Provider>
  );
};

export default ModelDetailsContextProvider;
