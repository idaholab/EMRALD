import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Event } from '../types/Event';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';

interface EventContextType {
  events: Event[];
  createEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: number | string) => void;
  newEventList: (newEventList: Event[]) => void;
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

const EventContextProvider: React.FC<EmraldContextWrapperProps> = ({ appData, updateAppData, children }) => {
  const [events, setEvents] = useState<Event[]>(
    appData.EventList,
  );
  
  // Memoize the value of `actions` to avoid unnecessary re-renders
  // const events = useMemo(
  //   () => eventList.map(({Event}) => Event) as Event[],
  //   [eventList]
  // );

  // useEffect(() => {
  //   setEventList(appData.EventList as EventList);
  // }, [appData]);

  const createEvent = (newEvent: Event) => {
    const updatedEventList = [...events, newEvent ];
    setEvents(updatedEventList);
  };

  const updateEvent = (updatedEvent: Event) => {
    const updatedEventList = events.map((item) =>
      item.id === updatedEvent.id ? updatedEvent : item,
    );
    setEvents(updatedEventList);
  };

  const deleteEvent = (eventId: number | string) => {
    const updatedEventList = events.filter(
      (item) => item.id !== eventId,
    );
    setEvents(updatedEventList);
  };

    // Open New, Merge, and Clear Event List
    const newEventList = (newEventList: Event[]) => {
      setEvents(newEventList);
    };

  const clearEventList = () => {
    setEvents([]);
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
