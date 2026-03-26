import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { LogicNodeForm } from '../../../../components/forms/LogicNodeForm/LogicNodeForm';
import { LogicNodeFormContextProvider } from '../../../../components/forms/LogicNodeForm/LogicNodeFormContext';
import { LogicNodeContextProvider } from '../../../../contexts/LogicNodeContext';
import { getLogicNode, render, save } from '../../../test-utils';
import expected from './LogicNodeForm.expected.json';

describe('Logic Node Form', () => {
  test('creates a logic node', async () => {
    const name = 'creates a logic node';
    render(
      <LogicNodeContextProvider>
        <LogicNodeFormContextProvider>
          <LogicNodeForm />
        </LogicNodeFormContextProvider>
      </LogicNodeContextProvider>,
    );
    const user = userEvent.setup();

    // Select gate type
    await user.click(await screen.findByLabelText('Type'));
    await user.click(await screen.findByRole('option', { name: 'Or' }));

    // Enter name & description
    await user.type(await screen.findByLabelText('Name'), name);
    await user.type(await screen.findByLabelText('Description'), 'Desc');

    // Check top node
    await user.click(
      await screen.findByLabelText('Make available as Top or Subtree'),
    );

    await save();
    expect(getLogicNode(name)).toEqual(expected[name]);
  });
});
