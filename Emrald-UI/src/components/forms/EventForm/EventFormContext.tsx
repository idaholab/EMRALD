import type { Event } from '@/types/EMRALD_Model';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import { emptyEvent } from '@/contexts/EventContext';

interface EventFormContextType {
  event: Event;
  hasError: boolean;
  codeVariables?: Event['varNames'];
  scriptCode?: Event['code'];
  invalidValues: Set<string>;
  typeProperties: (keyof Event)[];
  addToUsedVariables: (variableName: string) => void;
  sync: (values: Partial<Event>) => void;
  setEvent: Dispatch<SetStateAction<Event>>;
  setHasError: Dispatch<SetStateAction<boolean>>;
  setCodeVariables: Dispatch<SetStateAction<Event['varNames']>>;
  setScriptCode: Dispatch<SetStateAction<Event['code']>>;
  setInvalidValues: Dispatch<SetStateAction<Set<string>>>;
  setTypeProperties: Dispatch<SetStateAction<(keyof Event)[]>>;
}

const EventFormContext = createContext<EventFormContextType | undefined>(
  undefined,
);

export function useEventFormContext() {
  const context = useContext(EventFormContext);
  if (!context) {
    throw new Error(
      'useEventFormContext must be used within an EventFormContextProvider',
    );
  }
  return context;
}

export const EventFormContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [event, setEvent] = useState(emptyEvent);
  const [codeVariables, setCodeVariables] = useState<string[] | undefined>();
  const [scriptCode, setScriptCode] = useState<string>();
  const [hasError, setHasError] = useState(false);
  const [invalidValues, setInvalidValues] = useState(new Set<string>());
  const [typeProperties, setTypeProperties] = useState<(keyof Event)[]>([]);

  const addToUsedVariables = (variableName: string) => {
    setCodeVariables(prevVariables =>
      prevVariables?.includes(variableName)
        ? prevVariables.filter(variable => variable !== variableName)
        : [...(prevVariables ?? []), variableName],
    );
  };

  const sync = (values: Partial<Event>) => {
    setEvent(prev => ({ ...prev, ...values }));
  };

  return (
    <EventFormContext.Provider
      value={{
        event,
        hasError,
        codeVariables,
        scriptCode,
        invalidValues,
        typeProperties,
        addToUsedVariables,
        sync,
        setEvent,
        setHasError,
        setCodeVariables,
        setScriptCode,
        setInvalidValues,
        setTypeProperties,
      }}
    >
      {children}
    </EventFormContext.Provider>
  );
};
