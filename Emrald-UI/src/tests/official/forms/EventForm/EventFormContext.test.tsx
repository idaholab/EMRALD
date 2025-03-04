import { describe, expect, test } from 'vitest';
import { getEvent, getState, render, save } from '../../../test-utils';
import EventContextProvider from '../../../../contexts/EventContext';
import EventFormContextProvider from '../../../../components/forms/EventForm/EventFormContext';
import EventForm from '../../../../components/forms/EventForm/EventForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './EventFormContext.expected.json';

describe('Event Form Context', () => {
  test('initializes with state', async () => {
    const name = 'initializes with state';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: false,
              evType: 'etTimer',
            }}
            state={{
              objType: 'State',
              name,
              desc: '',
              stateType: 'stStart',
              diagramName: '',
              immediateActions: [],
              events: [name],
              eventActions: [{ actions: [], moveFromCurrent: false }],
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();
    await user.click(await screen.findByText('Save'));
    expect(getState(name)).toEqual(expected[name]);
  });

  test('changes event type', async () => {
    const name = 'changes event type';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: true,
              evType: 'etStateCng',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Confirm that the state change form is displayed
    expect(screen.queryByLabelText('All Items')).not.toBeNull();

    // Switch event type to distribution
    await user.click(await screen.findByLabelText('Type'));
    await user.click(await screen.findByRole('option', { name: 'Distribution' }));

    // Confirm that the distribution form is displayed
    expect(screen.queryByLabelText('Distribution Type')).not.toBeNull();
  });

  test('changes to failure rate', async () => {
    const name = 'changes to failure rate';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: true,
              evType: 'etStateCng',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Switch event type to failure rate
    await user.click(await screen.findByLabelText('Type'));
    await user.click(await screen.findByRole('option', { name: 'Failure Rate' }));

    // Confirm that the failure rate form is displayed
    expect(screen.queryByLabelText('Lambda')).not.toBeNull();

    // Invalid values should be set such that the save button is not clickable without a lambda value
    await expect(
      async () => await user.click(await screen.findByText('Save')),
    ).rejects.toThrowError();
  });

  test('changes event name', async () => {
    const name = 'changes event name';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: true,
              evType: 'etStateCng',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Enter a new event name
    await user.clear(await screen.findByLabelText('Name'));
    await user.type(await screen.findByLabelText('Name'), 'changed event name');

    await save();
    expect(getEvent('changed event name')).toEqual(expected[name]);
  });

  test('creates a new event', async () => {
    const name = 'creates a new event';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Ensure this event does not exist
    expect(() => getEvent(name)).toThrowError();

    // Enter a name for the event
    await user.type(await screen.findByLabelText('Name'), name);

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
