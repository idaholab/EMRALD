import React, { createContext, useContext, useState } from 'react';
import type { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { effect, type ReadonlySignal, useComputed } from '@preact/signals-react';
import type { EMRALD_Model, Event, State } from '../types/EMRALD_Model';
import { DeleteItemAndRefs, updateModelAndReferences, updateSpecifiedModel } from '../utils/UpdateModel';

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
  objType: 'Event',
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
    ) as Event[],
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

  const createEvent = (newEvent: Event, state?: State, moveFromCurrent = false) => {
    const updatedModel = updateModelAndReferences(newEvent, 'Event');
    updateAppData(updatedModel);
    if (state) {
      state.events.push(newEvent.name);
      state.eventActions.push({ moveFromCurrent, actions: [] });
      const updatedModel = updateModelAndReferences(state, 'State');
      updateAppData(updatedModel);
    }
  };

  const updateEvent = (updatedEvent: Event, state?: State, moveFromCurrent = false) => {
    let updatedModel = updateModelAndReferences(updatedEvent, 'Event');

    //update the state "moveFromCurrent" boolean
    if (state) {
      const updatedState = updatedModel.StateList.find(s => s.id === state.id);
      const eventStateIndex = updatedState?.events.indexOf(updatedEvent.name);
      if (updatedState && eventStateIndex !== undefined && eventStateIndex >= 0) {
        updatedState.eventActions[eventStateIndex].moveFromCurrent = moveFromCurrent;
        updatedModel = updateSpecifiedModel(updatedState, 'State', updatedModel, false);
      }
    }
    updateAppData(updatedModel);
  };

  const deleteEvent = (eventId: string | undefined) => {
    if (!eventId) {
      return;
    }
    const eventToDelete = eventsList.value.find((eventItem) => eventItem.id === eventId);
    if (eventToDelete) {
      const updatedModel = DeleteItemAndRefs(eventToDelete);
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
    updateAppData(JSON.parse(JSON.stringify({ ...appData.value, EventList: [] })) as EMRALD_Model);
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
