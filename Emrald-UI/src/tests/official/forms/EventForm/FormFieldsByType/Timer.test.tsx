import { describe, expect, test } from 'vitest';
import { ensureVariable, getEvent, renderEventForm, selectOption } from '../../../../test-utils';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './Timer.expected.json';

describe('Timer Events', () => {
  test('loads event data', async () => {
    const name = 'loads event data';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etTimer',
          time: 'P1DT2H3M4S',
        }}
      />,
    );
    const user = userEvent.setup();

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets duration', async () => {
    const name = 'sets duration';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etTimer',
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter duration
    await user.click(await screen.findByLabelText('Days'));
    await user.type(await screen.findByLabelText('Days'), '1');
    await user.click(await screen.findByLabelText('Hours'));
    await user.type(await screen.findByLabelText('Hours'), '2');
    await user.click(await screen.findByLabelText('Minutes'));
    await user.type(await screen.findByLabelText('Minutes'), '3');
    await user.click(await screen.findByLabelText('Seconds'));
    await user.type(await screen.findByLabelText('Seconds'), '4');

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('uses variable', async () => {
    const name = 'uses variable';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etTimer',
        }}
      />,
    );
    const user = userEvent.setup();

    // Check use variable
    await user.click(await screen.findByLabelText('Use Variable?'));

    // Add a variable to the model
    await user.click(await screen.findByText('Save'));
    ensureVariable('Test Variable');

    // Select the variable as the time span
    await selectOption(user, 'Time Span', 'Test Variable');

    // Select time variable unit
    await selectOption(user, 'Time Variable Unit', 'Hour');

    // Select if variable changes
    await selectOption(user, 'Select', 'Adjust');

    // Check from sim start
    await user.click(await screen.findByLabelText('From Sim Start'));

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
