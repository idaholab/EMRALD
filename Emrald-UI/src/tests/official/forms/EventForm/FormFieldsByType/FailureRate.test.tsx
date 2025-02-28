import { describe, expect, test } from 'vitest';
import { getEvent, render, updateModel } from '../../../../test-utils';
import EventContextProvider from '../../../../../contexts/EventContext';
import EventFormContextProvider from '../../../../../components/forms/EventForm/EventFormContext';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import userEvent from '@testing-library/user-event';
import { findByRole, screen } from '@testing-library/react';
import expected from './FailureRate.expected.json';

describe('FailureRate Events', () => {
  test('sets values', async () => {
    const name = 'sets values';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: true,
              evType: 'etFailRate',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
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
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: true,
              evType: 'etFailRate',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
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
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: true,
              evType: 'etFailRate',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Check box to use variable lambda/frequency
    await user.click(await screen.findByLabelText('Use Variable Lambda/Frequency?'));

    // Create a variable to select
    await user.click(await screen.findByText('Save'));
    updateModel((model) => {
      model.VariableList.push({
        objType: 'Variable',
        name: 'Test Variable',
        varScope: 'gt3DSim',
        value: '',
        type: 'string',
      });
      return model;
    });

    // Select the variable for lambda
    await user.click(await findByRole(await screen.findByLabelText('Lambda'), 'combobox'));
    await user.click(await screen.findByRole('option', { name: 'Test Variable' }));

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
    await user.click(await findByRole(await screen.findByLabelText('Select'), 'combobox'));
    await user.click(await screen.findByRole('option', { name: 'Resample' }));

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
