import { describe, expect, test } from 'vitest';
import {
  ensureVariable,
  getAction,
  renderActionForm,
  save,
  selectOption,
} from '../../../../test-utils';
import ActionForm from '../../../../../components/forms/ActionForm/ActionForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './ChangeVarValue.expected.json';

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
      ></ActionForm>,
    );
    const user = userEvent.setup();

    // Add a variable to the model
    await ensureVariable('Test Variable');

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
      ></ActionForm>,
    );
    const user = userEvent.setup();

    // Add a variable to the model
    await ensureVariable('Test Variable');

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
