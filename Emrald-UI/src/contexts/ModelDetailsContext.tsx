import React, { createContext, useContext, useState } from 'react';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData } from '../hooks/useAppData';

interface ModelDetailsContextType {
  id: string | undefined;
  name: string;
  desc: string;
  emraldVersion: number;
  version: number;
  fileName: string;
  updateFileName: (fileName: string) => void;
  updateName: (name: string) => void;
  updateDescription: (desc: string) => void;
  updateEmraldVersion: (version: number) => void;
  updateVersion: (version: number) => void;
  clearFileName: () => void;
}

const ModelDetailsContext = createContext<ModelDetailsContextType | undefined>(undefined);

export function useModelDetailsContext() {
  const context = useContext(ModelDetailsContext);
  if (!context) {
    throw new Error('useModelDetailsContext must be used within a ModelDetailsContextProvider');
  }
  return context;
}

const ModelDetailsContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const id = appData.value.id;
  const [name, setName] = useState(appData.value.name);
  const [desc, setDesc] = useState(appData.value.desc);
  const [emraldVersion, setEmraldVersion] = useState(appData.value.emraldVersion || 0);
  const [version, setVersion] = useState(appData.value.version);
  const [fileName, setFileName] = useState<string>('');

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
  const updateFileName = (updatedName: string) => {
    setFileName(updatedName);
  };
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
        updateFileName,
        updateName,
        updateDescription,
        updateEmraldVersion,
        updateVersion,
        clearFileName,
      }}
    >
      {children}
    </ModelDetailsContext.Provider>
  );
};

export default ModelDetailsContextProvider;
