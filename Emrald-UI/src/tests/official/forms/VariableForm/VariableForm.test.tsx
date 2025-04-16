import { describe, expect, test } from 'vitest';
import { drag, ensureState, getVariable, renderVariableForm, save } from '../../../test-utils';
import VariableForm from '../../../../components/forms/VariableForm/VariableForm';
import userEvent from '@testing-library/user-event';
import { findByRole, screen } from '@testing-library/react';
import expected from './VariableForm.expected.json';

describe('Variable Form', () => {
  test('creates a global variable', async () => {
    const name = 'creates_a_global_variable';
    renderVariableForm(<VariableForm></VariableForm>);
    const user = userEvent.setup();

    // Enter name, description, and value
    await user.clear(await screen.findByLabelText('Name'));
    await user.type(await screen.findByLabelText('Name'), name);
    await user.type(await screen.findByLabelText('Description'), 'Desc');
    await user.type(await screen.findByLabelText('Value'), '1');
    await user.click(
      await screen.findByLabelText('Reset to initial value for every simulation run'),
    );

    await save();
    expect(getVariable(name)).toEqual(expected[name]);
  });

  test('accrual variable', async () => {
    const name = 'accrual_variable';
    renderVariableForm(
      <VariableForm
        variableData={{
          objType: 'Variable',
          name,
          desc: '',
          varScope: 'gtAccrual',
          value: 0,
          type: 'double',
        }}
      ></VariableForm>,
    );
    const user = userEvent.setup();

    // Create states in the model
    ensureState('Test State');
    ensureState('Test State 2');

    // Drag the states to the form
    await user.click(await screen.findByText('States'));
    drag(await screen.findByText('Test State'), await screen.findByText('Drop State Items Here'));
    drag(await screen.findByText('Test State 2'), await screen.findByText('Accrual Rate'));

    // Change second state to dynamic
    await user.click((await screen.findAllByLabelText('Dynamic'))[1]);

    // Set multiplication factor and rate for the first state
    await user.type(await screen.findByLabelText('Accrual Multiplication Factor'), '2'); // This actually enters a value of 12 because the 1 is in the text field by default
    await user.click(
      await findByRole((await screen.findAllByLabelText('Multiplication Rate'))[0], 'combobox'),
    );
    await user.click(await screen.findByRole('option', { name: 'Day' }));

    // Add rows to the second state
    await user.click(await screen.findByText('Add Row'));
    await user.click(await screen.findByText('Add Row'));
    await user.type((await screen.findAllByLabelText('Simulation Time'))[0], '1');
    await user.type((await screen.findAllByLabelText('Accrual Rate'))[0], '2');
    await user.type((await screen.findAllByLabelText('Simulation Time'))[1], '3');
    await user.type((await screen.findAllByLabelText('Accrual Rate'))[1], '4');

    await save();
    expect(getVariable(name)).toEqual(expected[name]);
  });

  test('ext sim variable', async () => {
    const name = 'ext_sim_variable';
    renderVariableForm(
      <VariableForm
        variableData={{
          objType: 'Variable',
          name,
          desc: '',
          varScope: 'gt3DSim',
          value: '',
          type: 'string',
        }}
      ></VariableForm>,
    );
    const user = userEvent.setup();

    // Enter values
    await user.type(await screen.findByLabelText('Value'), 'Test');
    await user.type(await screen.findByLabelText('3DSimID'), '1234');

    await save();
    expect(getVariable(name)).toEqual(expected[name]);
  });

  test('doc link variable', async () => {
    const name = 'doc_link_variable';
    renderVariableForm(
      <VariableForm
        variableData={{
          objType: 'Variable',
          name,
          desc: '',
          varScope: 'gtDocLink',
          value: '',
          type: 'string',
        }}
      ></VariableForm>,
    );
    const user = userEvent.setup();

    // Enter values
    await user.click(await findByRole(await screen.findByLabelText('Doc Type'), 'combobox'));
    await user.click(await screen.findByRole('option', { name: 'JSON' }));
    await user.type(await screen.findByLabelText('Doc Path'), 'C:/');
    await user.type(await screen.findByLabelText('Var Link'), 'Test');
    await user.click(await screen.findByLabelText('Doc Path and Var Link must exist on startup'));
    await user.type(await screen.findByLabelText('Default'), 'Default');

    await save();
    expect(getVariable(name)).toEqual(expected[name]);
  });
});
