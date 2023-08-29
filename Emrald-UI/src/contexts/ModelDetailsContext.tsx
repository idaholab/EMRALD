import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import emraldData from '../emraldData.json';

interface ModelDetailsContextType {
  id: number;
  name: string;
  desc: string;
  version: number;
  updateName: (name: string) => void;
  updateDescription: (desc: string) => void;
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

const ModelDetailsContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const id = emraldData.id;
  const [name, setName] = useState(emraldData.name);
  const [desc, setDesc] = useState(emraldData.desc);
  const [version, setVersion] = useState(emraldData.version);

  const updateName = (updatedName: string) => {
    setName(updatedName);
  };
  const updateDescription = (updatedDesc: string) => {
    setDesc(updatedDesc);
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
        version,
        updateName,
        updateDescription,
        updateVersion,
      }}
    >
      {children}
    </ModelDetailsContext.Provider>
  );
};

export default ModelDetailsContextProvider;
