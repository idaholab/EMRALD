/* eslint-disable @typescript-eslint/prefer-for-of */
import 'blob-polyfill';
import { describe, expect, test } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import {
  ensureVariable,
  getAction,
  renderActionForm,
  save,
  selectOption,
} from '../../../../../../../test-utils';
import ActionForm from '../../../../../../../../components/forms/ActionForm/ActionForm';
import userEvent from '@testing-library/user-event';
import { findByRole, screen } from '@testing-library/react';
import expected from './maap.expected.json';

describe('MAAP Form', async () => {
  const TestPAR = new File([await fs.readFile(path.join(__dirname, 'Test.PAR'))], 'Test.PAR', {
    type: 'text/plain',
  });
  const TestINP = new File([await fs.readFile(path.join(__dirname, 'Test.INP'))], 'Test.INP', {
    type: 'text',
  });

  test('loads and parses files', async () => {
    const name = 'loads and parses files';
    renderActionForm(
      <ActionForm
        actionData={{
          name,
          desc: '',
          objType: 'Action',
          mainItem: true,
          actType: 'atRunExtApp',
        }}
      ></ActionForm>,
    );
    const user = userEvent.setup();

    // Load the MAAP form
    await user.click(await screen.findByLabelText('Use Custom Application'));
    await selectOption('Custom Application Type', 'MAAP');

    // Enter file paths
    await user.type(await screen.findByLabelText('MAAP Executable Path'), 'C:\\MAAP.exe');
    await user.type(await screen.findByLabelText('Full Parameter File Path'), 'C:\\Test.PAR');
    await user.type(await screen.findByLabelText('Full Input File Path'), 'C:\\Test.INP');

    // Upload parameter file
    await user.upload(await screen.findByLabelText('Parameter File'), TestPAR);

    // Upload INP file
    await user.upload(await screen.findByLabelText('Input File'), TestINP);

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });

  test('uses variables', async () => {
    const name = 'uses variables';
    renderActionForm(
      <ActionForm
        actionData={{
          name,
          desc: '',
          objType: 'Action',
          mainItem: true,
          actType: 'atRunExtApp',
        }}
      ></ActionForm>,
    );
    const user = userEvent.setup();

    // Load the MAAP form
    await user.click(await screen.findByLabelText('Use Custom Application'));
    await selectOption('Custom Application Type', 'MAAP');

    // Enter file paths
    await user.type(await screen.findByLabelText('MAAP Executable Path'), 'C:\\MAAP.exe');
    await user.type(await screen.findByLabelText('Full Parameter File Path'), 'C:\\Test.PAR');
    await user.type(await screen.findByLabelText('Full Input File Path'), 'C:\\Test.INP');

    // Upload parameter file
    await user.upload(await screen.findByLabelText('Parameter File'), TestPAR);

    // Upload INP file
    await user.upload(await screen.findByLabelText('Input File'), TestINP);

    // Add a variable to the model
    ensureVariable('Test_Variable');

    // Check "use variable" for PARAM1 & select the variable
    await user.click(
      await findByRole((await screen.findAllByLabelText('Use Variable'))[0], 'combobox'),
    );
    await user.click(await screen.findByRole('option', { name: 'Test_Variable' }));

    // Switch to input blocks tab
    await user.click(await screen.findByText('Input Blocks'));

    // Select the variable for the WHEN block condition
    await user.click(
      await findByRole((await screen.findAllByLabelText('Use Variable'))[0], 'combobox'),
    );
    await user.click(await screen.findByRole('option', { name: 'Test_Variable' }));

    // Select the variable in the WHEN block body
    await user.click(
      await findByRole((await screen.findAllByLabelText('Use Variable'))[1], 'combobox'),
    );
    await user.click(await screen.findByRole('option', { name: 'Test_Variable' }));

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });

  test('modifies initiators', async () => {
    const name = 'modifies initiators';
    renderActionForm(
      <ActionForm
        actionData={{
          name,
          desc: '',
          objType: 'Action',
          mainItem: true,
          actType: 'atRunExtApp',
        }}
      ></ActionForm>,
    );
    const user = userEvent.setup();

    // Load the MAAP form
    await user.click(await screen.findByLabelText('Use Custom Application'));
    await selectOption('Custom Application Type', 'MAAP');

    // Enter file paths
    await user.type(await screen.findByLabelText('MAAP Executable Path'), 'C:\\MAAP.exe');
    await user.type(await screen.findByLabelText('Full Parameter File Path'), 'C:\\Test.PAR');
    await user.type(await screen.findByLabelText('Full Input File Path'), 'C:\\Test.INP');

    // Upload parameter file
    await user.upload(await screen.findByLabelText('Parameter File'), TestPAR);

    // Upload INP file
    await user.upload(await screen.findByLabelText('Input File'), TestINP);

    // Switch to initiators tab
    await user.click(await screen.findByText('Initiators'));

    // Add an initiator
    await user.type(await screen.findByLabelText('Add Initiator'), 'P');
    await user.click(await screen.findByRole('option', { name: 'PARAM1' }));

    // Remove an initiator
    await user.click((await screen.findAllByLabelText('Remove Initiator'))[1]);

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });

  test('sets outputs', async () => {
    const name = 'sets output';
    renderActionForm(
      <ActionForm
        actionData={{
          name,
          desc: '',
          objType: 'Action',
          mainItem: true,
          actType: 'atRunExtApp',
        }}
      ></ActionForm>,
    );
    const user = userEvent.setup();

    // Load the MAAP form
    await user.click(await screen.findByLabelText('Use Custom Application'));
    await selectOption('Custom Application Type', 'MAAP');

    // Enter file paths
    await user.type(await screen.findByLabelText('MAAP Executable Path'), 'C:\\MAAP.exe');
    await user.type(await screen.findByLabelText('Full Parameter File Path'), 'C:\\Test.PAR');
    await user.type(await screen.findByLabelText('Full Input File Path'), 'C:\\Test.INP');

    // Upload parameter file
    await user.upload(await screen.findByLabelText('Parameter File'), TestPAR);

    // Upload INP file
    await user.upload(await screen.findByLabelText('Input File'), TestINP);

    // Create a doc link variable
    ensureVariable('Test DocLink Variable', {
      varScope: 'gtDocLink',
    });

    // Switch to outputs tab
    await user.click(await screen.findByText('Outputs'));

    // Add an output
    await user.click(await screen.findByLabelText('Doc Link Variables'));
    await user.click(await screen.findByRole('option', { name: 'Test DocLink Variable' }));
    await user.click(await screen.findByLabelText('Output'));
    await user.click(await screen.findByRole('option', { name: 'Core Uncovery' }));

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });
});
