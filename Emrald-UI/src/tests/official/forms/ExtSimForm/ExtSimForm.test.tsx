import { describe, expect, test } from 'vitest';
import { getExtSim, render, save } from '../../../test-utils';
import ExtSimContextProvider from '../../../../contexts/ExtSimContext';
import ExtSimForm from '../../../../components/forms/ExtSimForm/ExtSimForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './ExtSimForm.expected.json';

describe('ExtSim Form', () => {
  test('creates ext sim', async () => {
    const name = 'creates ext sim';
    render(
      <ExtSimContextProvider>
        <ExtSimForm></ExtSimForm>
      </ExtSimContextProvider>,
    );
    const user = userEvent.setup();

    // Enter name and application name
    await user.type(await screen.findByLabelText('Name'), name);
    await user.type(await screen.findByLabelText('Application Name'), 'Application Name');

    await save();
    expect(getExtSim(name)).toEqual(expected[name]);
  });

  test('updates existing', async () => {
    const name = 'updates existing';
    render(
      <ExtSimContextProvider>
        <ExtSimForm
          ExtSimData={{
            objType: 'ExtSim',
            name,
            resourceName: 'Application Name',
          }}
        ></ExtSimForm>
      </ExtSimContextProvider>,
    );
    const user = userEvent.setup();

    // Change name and application name
    await user.clear(await screen.findByLabelText('Name'));
    await user.type(await screen.findByLabelText('Name'), 'changed name');
    await user.clear(await screen.findByLabelText('Application Name'));
    await user.type(await screen.findByLabelText('Application Name'), 'changed app name');

    await save();
    expect(getExtSim('changed name')).toEqual(expected[name]);
  });
});
