import type { Event, State } from '../types/EMRALD_Model';
import {
  effect,
  type ReadonlySignal,
  useComputed,
} from '@preact/signals-react';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { appData, updateAppData } from '../hooks/useAppData';
import {
  type ClearedRef,
  DeleteItemAndRefs,
  formatClearedRefsMessage,
  updateModelAndReferences,
  updateSpecifiedModel,
} from '../utils/UpdateModel';
import { useAlertContext } from './AlertContext';

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
    throw new Error(
      'useEventContext must be used within an EventContextProvider',
    );
  }
  return context;
}

export const EventContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [events, setEvents] = useState(
    structuredClone(
      appData.value.EventList.toSorted((a, b) => a.name.localeCompare(b.name)),
    ),
  );
  const eventsList = useComputed(() => appData.value.EventList);
  const { showAlert } = useAlertContext();

  effect(() => {
    if (
      JSON.stringify(events)
      !== JSON.stringify(
        appData.value.EventList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      )
    ) {
      setEvents(
        appData.value.EventList.toSorted((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      return;
    }
    return;
  });

  const createEvent = (
    newEvent: Event,
    state?: State,
    moveFromCurrent = false,
  ) => {
    updateAppData(updateModelAndReferences(newEvent, 'Event'));
    if (state) {
      state.events.push(newEvent.name);
      state.eventActions.push({ moveFromCurrent, actions: [] });
      updateAppData(updateModelAndReferences(state, 'State'));
    }
  };

  const updateEvent = (
    updatedEvent: Event,
    state?: State,
    moveFromCurrent = false,
  ) => {
    let updatedModel = updateModelAndReferences(updatedEvent, 'Event');

    // update the state "moveFromCurrent" boolean
    if (state) {
      const updatedState = updatedModel.StateList.find(s => s.id === state.id);
      const eventStateIndex = updatedState?.events.indexOf(updatedEvent.name);
      if (
        updatedState
        && eventStateIndex !== undefined
        && eventStateIndex >= 0
      ) {
        if (updatedState.eventActions[eventStateIndex]) {
          updatedState.eventActions[eventStateIndex].moveFromCurrent
            = moveFromCurrent;
        }
        updatedModel = updateSpecifiedModel(
          updatedState,
          'State',
          updatedModel,
          false,
        );
      }
    }
    updateAppData(updatedModel);
  };

  const deleteEvent = (eventId?: string) => {
    if (!eventId) {
      return;
    }
    const eventToDelete = eventsList.value.find(
      eventItem => eventItem.id === eventId,
    );
    if (eventToDelete) {
      const clearedRefs: ClearedRef[] = [];
      updateAppData(DeleteItemAndRefs(eventToDelete, clearedRefs));
      const msg = formatClearedRefsMessage(
        'Event',
        eventToDelete.name,
        clearedRefs,
      );
      if (msg) {
        showAlert(msg, 'warning');
      }
    }
    // todo else error, no event to delete
  };

  const getEventByEventName = (eventName: string) =>
    eventsList.value.find(eventItem => eventItem.name === eventName);

  // Open New, Merge, and Clear Event List
  const newEventList = (newEventList: Event[]) => {
    setEvents(newEventList);
  };

  const clearEventList = () => {
    updateAppData(structuredClone({ ...appData.value, EventList: [] }));
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
