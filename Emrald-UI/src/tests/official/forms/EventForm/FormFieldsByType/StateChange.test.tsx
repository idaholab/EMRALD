import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { drag, ensureState, getEvent, renderEventForm, save } from '../../../../test-utils';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import expected from './StateChange.expected.json';

describe('StateChange Events', () => {
  test('loads event data', async () => {
    const name = 'loads event data';
    renderEventForm(
      <EventForm
        eventData={{
          name,
          objType: 'Event',
          desc: '',
          mainItem: true,
          evType: 'etStateCng',
          allItems: true,
        }}
      />,
    );
    
    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets default values', async () => {
    const name = 'sets default values';
    renderEventForm(
      <EventForm
        eventData={{
          name,
          objType: 'Event',
          desc: '',
          mainItem: true,
          evType: 'etStateCng',
        }}
      />,
    );
    const user = userEvent.setup();

    // Add two states to the model
    await ensureState('Test State');
    await ensureState('Test State 2');

    // Drag the first state to the event form
    await user.click(await screen.findByText('States'));
    const dropArea = (await screen.findByText('Drop State Items Here')).parentElement;
    expect(dropArea).not.toBeNull();
    if (dropArea) {
      drag(await screen.findByText('Test State'), dropArea);

      // Drag the second state to the event form
      drag(await screen.findByText('Test State 2'), dropArea);

      await save();
      expect(getEvent(name)).toEqual(expected[name]);
    }
  });

  test('sets all items', async () => {
    const name = 'sets all items';
    renderEventForm(
      <EventForm
        eventData={{
          name,
          objType: 'Event',
          desc: '',
          mainItem: true,
          evType: 'etStateCng',
        }}
      />,
    );
    const user = userEvent.setup();

    // Drag the state to the event form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State'), await screen.findByText('Drop State Items Here'));

    // Check "All Items"
    await user.click(await screen.findByLabelText('All Items'));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets if in state', async () => {
    const name = 'sets if in state';
    renderEventForm(
      <EventForm
        eventData={{
          name,
          objType: 'Event',
          desc: '',
          mainItem: true,
          evType: 'etStateCng',
        }}
      />,
    );
    const user = userEvent.setup();

    // Drag the state to the event form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State'), await screen.findByText('Drop State Items Here'));

    // Select "On Enter States"
    await user.click(await screen.findByLabelText('On Enter State/s'));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('unsets if in state', async () => {
    const name = 'unsets if in state';
    renderEventForm(
      <EventForm
        eventData={{
          name,
          objType: 'Event',
          desc: '',
          mainItem: true,
          evType: 'etStateCng',
        }}
      />,
    );
    const user = userEvent.setup();

    // Drag the state to the event form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State'), await screen.findByText('Drop State Items Here'));

    // Select "On Enter States"
    await user.click(await screen.findByLabelText('On Enter State/s'));

    // Change back to "On Exit States"
    await user.click(await screen.findByLabelText('On Exit State/s'));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('removes a state', async () => {
    const name = 'removes a state';
    renderEventForm(
      <EventForm
        eventData={{
          name,
          objType: 'Event',
          desc: '',
          mainItem: true,
          evType: 'etStateCng',
        }}
      />,
    );
    const user = userEvent.setup();

    // Drag the state to the event form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State'), await screen.findByText('Drop State Items Here'));

    // Delete the state that was just added
    await user.click(await screen.findByLabelText('Delete Row'));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
