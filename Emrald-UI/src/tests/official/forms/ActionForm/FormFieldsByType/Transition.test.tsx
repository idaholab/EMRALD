import { describe, expect, test } from 'vitest';
import { drag, ensureState, getAction, renderActionForm, save } from '../../../../test-utils';
import ActionForm from '../../../../../components/forms/ActionForm/ActionForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './Transition.expected.json';

describe('Transition Actions', () => {
  test('sets values', async () => {
    const name = 'sets values';
    renderActionForm(
      <ActionForm
        actionData={{
          objType: 'Action',
          name,
          desc: '',
          actType: 'atTransition',
          mainItem: true,
        }}
      ></ActionForm>,
    );
    const user = userEvent.setup();

    // Add states to the model
    await ensureState('Test State 1');
    await ensureState('Test State 2');

    // Drag the states to the form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State 1'), await screen.findByText('Drop State Items Here'));
    drag(
      await screen.findByText('Test State 2'),
      await screen.findByText('Fixed Value or Variable'),
    );

    // Enter probability for state 1
    await user.type((await screen.findAllByLabelText('Probability'))[0], '0.4');

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });
});
