import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { ActionForm } from '../../../../../components/forms/ActionForm/ActionForm';
import {
  ensureVariable,
  getAction,
  renderActionForm,
  save,
  selectOption,
} from '../../../../test-utils';
import expected from './ChangeVarValue.expected.json';

// Require a variable to be set to close the form

describe('Change Var Value Actions', () => {
  test('selects variables', async () => {
    const name = 'selects variables';
    renderActionForm(
      <ActionForm
        actionData={{
          objType: 'Action',
          name,
          desc: '',
          actType: 'atCngVarVal',
          mainItem: true,
        }}
      />,
    );
    const user = userEvent.setup();

    // Add a variable to the model
    ensureVariable('Test Variable');

    // Select the variable
    await selectOption('Variable', 'Test Variable');

    // Check the variable as used in code
    await user.click(await screen.findByLabelText('Test Variable'));

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });

  test('deselects variables', async () => {
    const name = 'deselects variables';
    renderActionForm(
      <ActionForm
        actionData={{
          objType: 'Action',
          name,
          desc: '',
          actType: 'atCngVarVal',
          mainItem: true,
        }}
      />,
    );
    const user = userEvent.setup();

    // Add a variable to the model
    ensureVariable('Test Variable');

    // Select the variable
    await selectOption('Variable', 'Test Variable');

    // Check the variable as used in code
    await user.click(await screen.findByLabelText('Test Variable'));

    // Un-check the variable as being used in the code
    await user.click(await screen.findByLabelText('Test Variable'));

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });
});
