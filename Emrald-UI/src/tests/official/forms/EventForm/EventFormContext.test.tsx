import { describe, expect, test } from 'vitest';
import { getEvent, renderEventForm, save } from '../../../test-utils';
import EventForm from '../../../../components/forms/EventForm/EventForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './EventFormContext.expected.json';

describe('Event Form Context', () => {
  test('changes event type', async () => {
    const name = 'changes event type';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etStateCng',
        }}
      ></EventForm>,
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
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etStateCng',
        }}
      ></EventForm>,
    );
    const user = userEvent.setup();

    // Switch event type to failure rate
    await user.click(await screen.findByLabelText('Type'));
    await user.click(await screen.findByRole('option', { name: 'Failure Rate' }));

    // Confirm that the failure rate form is displayed
    expect(screen.queryByLabelText('Lambda')).not.toBeNull();

    // Invalid values should be set such that the save button is not clickable without a lambda value
    await expect(
      async () => { await user.click(await screen.findByText('Save')); },
    ).rejects.toThrowError();
  });

  test('changes event name', async () => {
    const name = 'changes event name';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etStateCng',
        }}
      ></EventForm>,
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
    renderEventForm(<EventForm></EventForm>);
    const user = userEvent.setup();

    // Ensure this event does not exist
    expect(() => getEvent(name)).toThrowError();

    // Enter a name for the event
    await user.type(await screen.findByLabelText('Name'), name);

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
