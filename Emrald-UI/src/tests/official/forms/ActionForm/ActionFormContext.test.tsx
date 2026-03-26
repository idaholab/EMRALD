import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { ActionForm } from '../../../../components/forms/ActionForm/ActionForm';
import { getAction, renderActionForm, save } from '../../../test-utils';
import expected from './ActionFormContext.expected.json';

describe('Action Form Context', () => {
  test('changes action name', async () => {
    const name = 'changes action name';
    renderActionForm(
      <ActionForm
        actionData={{
          objType: 'Action',
          name,
          desc: '',
          mainItem: true,
          actType: 'atTransition',
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter a new action name
    await user.clear(await screen.findByLabelText('Name'));
    await user.type(await screen.findByLabelText('Name'), 'changed action name');

    await save();
    expect(getAction('changed action name')).toEqual(expected[name]);
  });
});
