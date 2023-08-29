import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import emraldData from '../emraldData.json';
import { Event, EventList } from '../interfaces/Event';

interface EventContextType {
  events: Event[];
  createEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: number) => void;
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

  const events = emraldData.EventList.map((item) => item.Event) as Event[];

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

  return (
    <EventContext.Provider
      value={{
        events,
        createEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventContextProvider;
