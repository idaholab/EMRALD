import { describe, expect, test } from 'vitest';
import { getEvent, render, selectOption, updateModel } from '../../../../test-utils';
import EventContextProvider from '../../../../../contexts/EventContext';
import EventFormContextProvider from '../../../../../components/forms/EventForm/EventFormContext';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './ExtSim.expected.json';

describe('ExtSim Events', () => {
  test('selects event type', async () => {
    const name = 'selects event type';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: true,
              evType: 'et3dSimEv',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Select an event type
    await selectOption(user, 'External Event Type', 'Simulation End');

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('selects status event type', async () => {
    const name = 'selects status event type';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: true,
              evType: 'et3dSimEv',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Select an event type
    await selectOption(user, 'External Event Type', 'Ping');

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets variable change', async () => {
    const name = 'sets variable change';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: true,
              evType: 'et3dSimEv',
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Select variable change type
    await selectOption(user, 'External Event Type', 'Variable Change');

    // Add an external sim variable to the model
    await user.click(await screen.findByText('Save'));
    updateModel((model) => {
      model.VariableList.push({
        objType: 'Variable',
        name: 'Test ExtSim Variable',
        varScope: 'gt3DSim',
        value: '',
        type: 'string',
      });
      return model;
    });

    // Select the ext sim variable
    await selectOption(user, 'External Sim Variable', 'Test ExtSim Variable');

    // Type in code
    // TODO: The Monaco editor apparently can't be tested using JSDOM, so the "code" property is currently untested
    //await user.type(await screen.findByRole('code'), 'return "";');

    // Check the ext sim variable as being used in the code
    await user.click(await screen.findByLabelText('Test ExtSim Variable'));

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
