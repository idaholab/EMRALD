import React, { createContext, useContext, useState } from 'react';
import { Event } from '../types/Event';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { effect, ReadonlySignal, useComputed } from '@preact/signals-react';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { DeleteItemAndRefs, updateModelAndReferences } from '../utils/UpdateModel';
import { MainItemTypes } from '../types/ItemTypes';
import { State } from '../types/State';

interface EventContextType {
  events: Event[];
  eventsList: ReadonlySignal<Event[]>;
  createEvent: (event: Event, state?: State, moveFromCurrent?: boolean) => void;
  updateEvent: (event: Event, state?: State, moveFromCurrent?: boolean) => void;
  deleteEvent: (eventId: string | undefined) => void;
  getEventByEventName: (eventName: string) => Event | undefined;
  newEventList: (newEventList: Event[]) => void;
  clearEventList: () => void;
}

export const emptyEvent: Event = {
  id: '',
  name: '',
  desc: '',
  evType: 'etStateCng',
  mainItem: false,
  required: false,
  objType: MainItemTypes.Event,
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventContextProvider');
  }
  return context;
}

const EventContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(
    JSON.parse(
      JSON.stringify(appData.value.EventList.sort((a, b) => a.name.localeCompare(b.name))),
    ),
  );
  const eventsList = useComputed(() => appData.value.EventList);

  effect(() => {
    if (
      JSON.stringify(events) !==
      JSON.stringify(appData.value.EventList.sort((a, b) => a.name.localeCompare(b.name)))
    ) {
      setEvents(appData.value.EventList.sort((a, b) => a.name.localeCompare(b.name)));
      return;
    }
    return;
  });

  const createEvent = async (newEvent: Event, state?: State, moveFromCurrent: boolean = false) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(newEvent, MainItemTypes.Event);
    updateAppData(updatedModel);
    if (state) {
      state.events.push(newEvent.name);
      state.eventActions.push({ moveFromCurrent, actions: [] });
      var updatedModel: EMRALD_Model = await updateModelAndReferences(state, MainItemTypes.State);
      updateAppData(updatedModel);
    }
  };

  const updateEvent = async (
    updatedEvent: Event,
    state?: State,
    moveFromCurrent: boolean = false,
  ) => {
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      updatedEvent,
      MainItemTypes.Event,
    );
    updateAppData(updatedModel);

    //update the state "moveFromCurrent" boolean
    if (state) {
      const eventStateIndex = state.events.indexOf(updatedEvent.name);
      state.eventActions[eventStateIndex].moveFromCurrent = moveFromCurrent;
      var updatedModel: EMRALD_Model = await updateModelAndReferences(state, MainItemTypes.State);
      updateAppData(updatedModel);
    }
  };

  const deleteEvent = async (eventId: string | undefined) => {
    if (!eventId) {
      return;
    }
    const eventToDelete = eventsList.value.find((eventItem) => eventItem.id === eventId);
    if (eventToDelete) {
      var updatedModel: EMRALD_Model = await DeleteItemAndRefs(eventToDelete);
      updateAppData(updatedModel);
    }
    //todo else error, no event to delete
  };

  const getEventByEventName = (eventName: string) => {
    return eventsList.value.find((eventItem) => eventItem.name === eventName);
  };

  // Open New, Merge, and Clear Event List
  const newEventList = (newEventList: Event[]) => {
    setEvents(newEventList);
  };

  const clearEventList = () => {
    updateAppData(JSON.parse(JSON.stringify({ ...appData.value, EventList: [] })));
  };

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
        clearEventList,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventContextProvider;
