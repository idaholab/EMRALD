import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { ensureLogicNode, getEvent, renderEventForm, save, selectOption } from '../../../../test-utils';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import expected from './ComponentLogic.expected.json';

describe('Component Logic Events', () => {
  test('sets default values', async () => {
    const name = 'sets default values';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etComponentLogic',
        }}
      />,
    );

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets on success', async () => {
    const name = 'sets on success';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etComponentLogic',
        }}
      />,
    );
    const user = userEvent.setup();

    // Select "Success Tree"
    await user.click(await screen.findByLabelText('Success Tree'));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets trigger on false', async () => {
    const name = 'sets trigger on false';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etComponentLogic',
        }}
      />,
    );
    const user = userEvent.setup();

    // Select "Trigger on False"
    await user.click(await screen.findByLabelText('Trigger on False'));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets logic top', async () => {
    const name = 'sets logic top';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etComponentLogic',
        }}
      />,
    );

    // Add a logic node to the model
    await ensureLogicNode('Test Logic Node');

    // Select the logic node
    await selectOption('LogicTop', 'Test Logic Node');

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
