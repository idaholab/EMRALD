import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { Event } from '../types/Event';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { updateModelAndReferences } from '../utils/UpdateModel';
import { MainItemTypes } from '../types/ItemTypes';

interface EventContextType {
  events: Event[];
  eventsList: ReadonlySignal<Event[]>;
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
  const [events, setEvents] = useState<Event[]>(JSON.parse(JSON.stringify(appData.value.EventList.sort((a,b) => a.name.localeCompare(b.name)))));
  const eventsList = useComputed(() => appData.value.EventList);

  const createEvent = async (newEvent: Event) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      newEvent,
      MainItemTypes.Event,
    );
    updateAppData(updatedModel);
    setEvents(updatedModel.EventList);
  };

  const updateEvent = (updatedEvent: Event) => {
    const updatedEventList = eventsList.value.map((item) =>
      item.id === updatedEvent.id ? updatedEvent : item,
    );
    setEvents(updatedEventList);
  };

  const deleteEvent = (eventId: string | undefined) => {
    if (!eventId) { return; }
    const updatedEventList = eventsList.value.filter(
      (item) => item.id !== eventId,
    );
    setEvents(updatedEventList);
  };

  const getEventByEventName = (eventName: string) => {
    return eventsList.value.find((eventItem) => eventItem.name === eventName);
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
        eventsList,
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
