import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { Event } from '../types/Event';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData } from '../hooks/useAppData';

interface EventContextType {
  events: Event[];
  createEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string | undefined) => void;
  getEventByEventName: (eventName: string) => Event | undefined;
  newEventList: (newEventList: Event[]) => void;
  clearEventList: () => void;
}

export const emptyEvent: Event = {
  id: "",
  name: '',
  desc: '',
  evType: 'etStateCng',
  mainItem: false,
};

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

const EventContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(JSON.parse(JSON.stringify(appData.value.EventList)));

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

  const deleteEvent = (eventId: string | undefined) => {
    if (!eventId) { return; }
    const updatedEventList = events.filter(
      (item) => item.id !== eventId,
    );
    setEvents(updatedEventList);
  };

  const getEventByEventName = (eventName: string) => {
    return events.find((eventItem) => eventItem.name === eventName);
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
        getEventByEventName,
        newEventList,
        clearEventList
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventContextProvider;
