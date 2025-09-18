import { describe, expect, test } from 'vitest';
import { getState, render, save } from '../../../test-utils';
import StateForm from '../../../../components/forms/StateForm/StateForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './StateForm.expected.json';

describe('State Form', () => {
  test('sets logic tree eval', async () => {
    const name = 'sets logic tree eval';
    render(
      <StateForm
        stateData={{
          objType: 'State',
          name,
          desc: '',
          stateType: 'stStart',
          diagramName: '',
          immediateActions: [],
          events: [],
          eventActions: [],
        }}
      ></StateForm>,
    );
    const user = userEvent.setup();

    // Set default logic tree evaluation value
    await user.click(await screen.findByLabelText('False'));

    await save();
    expect(getState(name)).toEqual(expected[name]);
  });
});
