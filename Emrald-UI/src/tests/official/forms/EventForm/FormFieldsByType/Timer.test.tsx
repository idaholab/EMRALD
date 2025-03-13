import { describe, expect, test } from 'vitest';
import { ensureVariable, getEvent, renderEventForm, save, selectOption } from '../../../../test-utils';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './Timer.expected.json';

// Check saving default values

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
    
    await save();
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

    await save();
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
    ensureVariable('Test Variable');

    // Select the variable as the time span
    await selectOption('Time Span', 'Test Variable');

    // Select time variable unit
    await selectOption('Time Variable Unit', 'Hour');

    // Select if variable changes
    await selectOption('Select', 'Adjust');

    // Check from sim start
    await user.click(await screen.findByLabelText('From Sim Start'));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
