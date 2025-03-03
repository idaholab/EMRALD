import { describe, expect, test } from 'vitest';
import { ensureVariable, getEvent, renderEventForm, selectOption } from '../../../../test-utils';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './FailureRate.expected.json';

describe('FailureRate Events', () => {
  test('loads event data', async () => {
    const name = 'loads event data';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etFailRate',
          lambda: 1,
          lambdaTimeRate: 'P1DT2H3M4S',
        }}
      />,
    );
    const user = userEvent.setup();

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets values', async () => {
    const name = 'sets values';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etFailRate',
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter lambda value
    await user.type(await screen.findByLabelText('Lambda'), '1');

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

  test('uses scientific notation', async () => {
    const name = 'uses scientific notation';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etFailRate',
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter lambda value
    await user.type(await screen.findByLabelText('Lambda'), '1e5');

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

  test('uses variable frequency', async () => {
    const name = 'uses variable frequency';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etFailRate',
        }}
      />,
    );
    const user = userEvent.setup();

    // Check box to use variable lambda/frequency
    await user.click(await screen.findByLabelText('Use Variable Lambda/Frequency?'));

    // Create a variable to select
    await user.click(await screen.findByText('Save'));
    ensureVariable('Test Variable');

    // Select the variable for lambda
    await selectOption(user, 'Lambda', 'Test Variable');

    // Enter duration
    await user.click(await screen.findByLabelText('Days'));
    await user.type(await screen.findByLabelText('Days'), '1');
    await user.click(await screen.findByLabelText('Hours'));
    await user.type(await screen.findByLabelText('Hours'), '2');
    await user.click(await screen.findByLabelText('Minutes'));
    await user.type(await screen.findByLabelText('Minutes'), '3');
    await user.click(await screen.findByLabelText('Seconds'));
    await user.type(await screen.findByLabelText('Seconds'), '4');

    // Select on variable change
    await selectOption(user, 'Select', 'Resample');

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('disallows invalid lambda', async () => {
    const name = 'uses variable frequency';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etFailRate',
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter non-numeric value into lambda field
    await user.type(await screen.findByLabelText('Lambda'), 'abc');

    // Enter duration
    await user.click(await screen.findByLabelText('Days'));
    await user.type(await screen.findByLabelText('Days'), '1');
    await user.click(await screen.findByLabelText('Hours'));
    await user.type(await screen.findByLabelText('Hours'), '2');
    await user.click(await screen.findByLabelText('Minutes'));
    await user.type(await screen.findByLabelText('Minutes'), '3');
    await user.click(await screen.findByLabelText('Seconds'));
    await user.type(await screen.findByLabelText('Seconds'), '4');

    // The Save button should not be clickable
    await expect(
      async () => await user.click(await screen.findByText('Save')),
    ).rejects.toThrowError();
  });
});
