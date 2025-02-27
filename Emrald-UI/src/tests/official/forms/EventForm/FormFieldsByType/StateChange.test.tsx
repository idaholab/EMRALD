import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { drag, getEvent, render, updateModel } from '../../../../test-utils';
import EventContextProvider from '../../../../../contexts/EventContext';
import EventFormContextProvider from '../../../../../components/forms/EventForm/EventFormContext';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import expected from './StateChange.expected.json';

describe('StateChange Events', () => {
  test('sets default values', async () => {
    const name = 'sets default values';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              name,
              objType: 'Event',
              desc: '',
              mainItem: true,
              evType: 'etStateCng',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Add a state to the model
    await user.click(await screen.findByText('Save'));
    updateModel((model) => {
      model.StateList.push({
        name: 'Test State',
        objType: 'State',
        desc: '',
        stateType: 'stStandard',
        diagramName: 'Test Diagram',
        immediateActions: [],
        events: [],
        eventActions: [],
      });
      return model;
    });

    // Drag the state to the event form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State'), await screen.findByText('Drop State Items Here'));

    await user.click(await screen.findByText("Save"));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets all items', async () => {
    const name = 'sets all items';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              name,
              objType: 'Event',
              desc: '',
              mainItem: true,
              evType: 'etStateCng',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Drag the state to the event form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State'), await screen.findByText('Drop State Items Here'));

    // Check "All Items"
    await user.click(await screen.findByLabelText('All Items'));

    await user.click(await screen.findByText("Save"));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets if in state', async () => {
    const name = 'sets if in state';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              name,
              objType: 'Event',
              desc: '',
              mainItem: true,
              evType: 'etStateCng',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Drag the state to the event form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State'), await screen.findByText('Drop State Items Here'));

    // Select "On Enter States"
    await user.click(await screen.findByLabelText('On Enter State/s'));

    await user.click(await screen.findByText("Save"));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('removes a state', async () => {
    const name = 'removes a state';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              name,
              objType: 'Event',
              desc: '',
              mainItem: true,
              evType: 'etStateCng',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Drag the state to the event form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State'), await screen.findByText('Drop State Items Here'));

    // Delete the state that was just added
    await user.click(await screen.findByLabelText('Delete Row'));

    await user.click(await screen.findByText("Save"));
    expect(getEvent(name)).toEqual(expected[name]);
  })
});
