import { describe, expect, test } from 'vitest';
import { ensureVariable, getEvent, renderEventForm, selectOption } from '../../../../test-utils';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './ExtSim.expected.json';

describe('ExtSim Events', () => {
  test('selects event type', async () => {
    const name = 'selects event type';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'et3dSimEv',
        }}
      />,
    );
    const user = userEvent.setup();

    // Select an event type
    await selectOption(user, 'External Event Type', 'Simulation End');

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('selects status event type', async () => {
    const name = 'selects status event type';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'et3dSimEv',
        }}
      />,
    );
    const user = userEvent.setup();

    // Select an event type
    await selectOption(user, 'External Event Type', 'Ping');

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets variable change', async () => {
    const name = 'sets variable change';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'et3dSimEv',
        }}
      />,
    );
    const user = userEvent.setup();

    // Select variable change type
    await selectOption(user, 'External Event Type', 'Variable Change');

    // Add an external sim variable to the model
    await user.click(await screen.findByText('Save'));
    ensureVariable('Test ExtSim Variable', {
      varScope: 'gt3DSim',
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

  test('removes code variable', async () => {
    const name = 'removes code variable';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'et3dSimEv',
        }}
      />,
    );
    const user = userEvent.setup();

    // Select variable change type
    await selectOption(user, 'External Event Type', 'Variable Change');

    // Add an external sim variable to the model
    await user.click(await screen.findByText('Save'));
    ensureVariable('Test ExtSim Variable', {
      varScope: 'gt3DSim',
    });

    // Select the ext sim variable
    await selectOption(user, 'External Sim Variable', 'Test ExtSim Variable');

    // Type in code
    // TODO: The Monaco editor apparently can't be tested using JSDOM, so the "code" property is currently untested
    //await user.type(await screen.findByRole('code'), 'return "";');

    // Check the ext sim variable as being used in the code
    await user.click(await screen.findByLabelText('Test ExtSim Variable'));

    // Now un-check the ext sim variable
    await user.click(await screen.findByLabelText('Test ExtSim Variable'));

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
