import { describe, expect, test } from 'vitest';
import { ensureVariable, getEvent, renderEventForm } from '../../../../test-utils';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './VarCondition.expected.json';

describe('VarCondition Events', () => {
  test('sets code variables', async () => {
    const name = 'sets code variables';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etVarCond',
        }}
      ></EventForm>,
    );
    const user = userEvent.setup();

    // Add a variable to the model
    await user.click(await screen.findByText('Save'));
    ensureVariable('Test Variable');

    // Check the added variable
    await user.click(await screen.findByLabelText('Test Variable'));

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected[name]);
  });
});
