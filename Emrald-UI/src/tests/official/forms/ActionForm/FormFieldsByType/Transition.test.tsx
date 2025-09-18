import { describe, expect, test } from 'vitest';
import {
  drag,
  ensureState,
  ensureVariable,
  getAction,
  renderActionForm,
  save,
  selectOption,
} from '../../../../test-utils';
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
    ensureState('Test State 1');
    ensureState('Test State 2');

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

  test('uses scientific notation', async () => {
    const name = 'uses scientific notation';
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
    ensureState('Test State 1');

    // Drag the states to the form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State 1'), await screen.findByText('Drop State Items Here'));

    // Enter probability for state 1
    await user.type((await screen.findAllByLabelText('Probability'))[0], '2e-5');

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });

  test('disallows invalid probabilities', async () => {
    const name = 'disallows invalid probabilities';
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
    ensureState('Test State 1');

    // Drag the states to the form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State 1'), await screen.findByText('Drop State Items Here'));

    // Try to click save with an empty probability
    await user.clear((await screen.findAllByLabelText('Probability'))[0]);
    await save(); // TODO: not sure why it needs to save before checking if the save button is disabled...
    await expect(async () => await user.click(await screen.findByText("Save"))).rejects.toThrowError();

    // Enter a probability greater than 1 for state 1
    await user.type((await screen.findAllByLabelText('Probability'))[0], '2');
    await save();
    await expect(async () => await user.click(await screen.findByText("Save"))).rejects.toThrowError();
  });

  test('uses remaining probability', async () => {
    const name = 'uses remaining probability';
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
    ensureState('Test State 1');
    ensureState('Test State 2');

    // Drag the states to the form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State 1'), await screen.findByText('Drop State Items Here'));
    drag(
      await screen.findByText('Test State 2'),
      await screen.findByText('Fixed Value or Variable'),
    );

    // Check mutually exclusive
    await user.click(
      await screen.findByLabelText(
        'Mutually Exclusive (Transitions to one and only one of the states)',
      ),
    );

    // Enter probability for state 1
    await user.type((await screen.findAllByLabelText('Probability'))[0], '0.4');

    // Check remaining for state 2
    await user.click((await screen.findAllByLabelText('Remaining'))[1]);

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });

  test('uses variables', async () => {
    const name = 'uses variables';
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
    ensureState('Test State 1');

    // Drag the states to the form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State 1'), await screen.findByText('Drop State Items Here'));

    // Add a variable to the model
    ensureVariable('Test Variable');

    // Select variable probability
    await user.click(await screen.findByLabelText("Variable"));

    // Select the variable
    await selectOption('Select Variable', 'Test Variable');

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });

  test('unchecks mutually exclusive', async () => {
    const name = 'unchecks mutually exclusive';
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
    ensureState('Test State 1');
    ensureState('Test State 2');

    // Drag the states to the form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State 1'), await screen.findByText('Drop State Items Here'));
    drag(
      await screen.findByText('Test State 2'),
      await screen.findByText('Fixed Value or Variable'),
    );

    // Check mutually exclusive
    await user.click(
      await screen.findByLabelText(
        'Mutually Exclusive (Transitions to one and only one of the states)',
      ),
    );

    // Enter probability for state 1
    await user.type((await screen.findAllByLabelText('Probability'))[0], '0.4');

    // Check remaining for state 2
    await user.click((await screen.findAllByLabelText('Remaining'))[1]);

    // Un-check mutually exclusive
    await user.click(
      await screen.findByLabelText(
        'Mutually Exclusive (Transitions to one and only one of the states)',
      ),
    );

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });

  test('removes a state', async () => {
    const name = 'removes a state';
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
    ensureState('Test State 1');
    ensureState('Test State 2');

    // Drag the states to the form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State 1'), await screen.findByText('Drop State Items Here'));
    drag(
      await screen.findByText('Test State 2'),
      await screen.findByText('Fixed Value or Variable'),
    );

    // Remove state 1
    await user.click((await screen.findAllByLabelText("Delete Row"))[0]);

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });
});
