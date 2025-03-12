import { describe, expect, test } from 'vitest';
import { ensureVariable, getEvent, renderEventForm, save, selectOption } from '../../../../test-utils';
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
    
    // Select an event type
    await selectOption('External Event Type', 'Simulation End');

    await save();
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

    // Select an event type
    await selectOption('External Event Type', 'Ping');

    await save();
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
    await selectOption('External Event Type', 'Variable Change');

    // Add an external sim variable to the model
    await ensureVariable('Test ExtSim Variable', {
      varScope: 'gt3DSim',
    });

    // Select the ext sim variable
    console.log((await screen.findByLabelText('External Sim Variable')).children);
    await selectOption('External Sim Variable', 'Test ExtSim Variable');

    // Type in code
    // TODO: The Monaco editor apparently can't be tested using JSDOM, so the "code" property is currently untested
    //await user.type(await screen.findByRole('code'), 'return "";');

    // Check the ext sim variable as being used in the code
    await user.click(await screen.findByLabelText('Test ExtSim Variable'));

    await save();
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
    await selectOption('External Event Type', 'Variable Change');

    // Add an external sim variable to the model
    await ensureVariable('Test ExtSim Variable', {
      varScope: 'gt3DSim',
    });

    // Select the ext sim variable
    await selectOption('External Sim Variable', 'Test ExtSim Variable');

    // Type in code
    // TODO: The Monaco editor apparently can't be tested using JSDOM, so the "code" property is currently untested
    //await user.type(await screen.findByRole('code'), 'return "";');

    // Check the ext sim variable as being used in the code
    await user.click(await screen.findByLabelText('Test ExtSim Variable'));

    // Now un-check the ext sim variable
    await user.click(await screen.findByLabelText('Test ExtSim Variable'));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
