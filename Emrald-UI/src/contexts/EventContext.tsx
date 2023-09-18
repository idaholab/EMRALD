import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import emraldData from '../emraldData.json';
import { Event, EventList } from '../types/Event';

interface EventContextType {
  events: Event[];
  createEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: number) => void;
  newEventList: (newEventList: EventList) => void;
  clearEventList: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error(
      'useEventContext must be used within an EventContextProvider',
    );
  }
  return context;
}

const EventContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [eventList, setEventList] = useState<EventList>(
    emraldData.EventList as EventList,
  );
  
  // Memoize the value of `actions` to avoid unnecessary re-renders
  const events = useMemo(
    () => eventList.map(({Event}) => Event) as Event[],
    [eventList]
  );

  const createEvent = (newEvent: Event) => {
    const updatedEventList = [...eventList, { Event: newEvent }];
    setEventList(updatedEventList);
  };

  const updateEvent = (updatedEvent: Event) => {
    const updatedEventList = eventList.map((item) =>
      item.Event.id === updatedEvent.id ? { Event: updatedEvent } : item,
    );
    setEventList(updatedEventList);
  };

  const deleteEvent = (eventId: number) => {
    const updatedEventList = eventList.filter(
      (item) => item.Event.id !== eventId,
    );
    setEventList(updatedEventList);
  };

    // Open New, Merge, and Clear Event List
    const newEventList = (newEventList: EventList) => {
      setEventList(newEventList);
    };

  const clearEventList = () => {
    setEventList([]);
  }

  return (
    <EventContext.Provider
      value={{
        events,
        createEvent,
        updateEvent,
        deleteEvent,
        newEventList,
        clearEventList
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventContextProvider;
