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
import { screen } from '@testing-library/react';
import expected from './maap.expected.json';
import { Action } from '../../../../../../../../types/Action';
import { MAAPFormData } from '../../../../../../../../components/forms/ActionForm/FormFieldsByType/RunApplication/CustomForms/MAAP/maap';

/**
 * Removes the dynamically assigned IDs from form data elements for expected comparison.
 */
function removeIds(action: Action) {
  const formData = action.formData as MAAPFormData;
  if (formData) {
    if (formData.initiators) {
      for (let i = 0; i < formData.initiators.length; i += 1) {
        delete formData.initiators[i].id;
      }
    }
    if (formData.inputBlocks) {
      for (let i = 0; i < formData.inputBlocks.length; i += 1) {
        delete formData.inputBlocks[i].id;
      }
    }
    if (formData.parameters) {
      for (let i = 0; i < formData.parameters.length; i += 1) {
        delete formData.parameters[i].id;
      }
    }
    if (formData.sourceElements) {
      for (let i = 0; i < formData.sourceElements.length; i += 1) {
        delete formData.sourceElements[i].id;
      }
    }
  }
  action.formData = formData;
  return action;
}

describe('MAAP Form', () => {
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
    await user.upload(
      await screen.findByLabelText('Parameter File'),
      new File(['test'], 'Test.PAR', {
        type: 'text/plain',
      }),
    );

    // Upload INP file
    await user.upload(
      await screen.findByLabelText('Input File'),
      new File([await fs.readFile(path.join(__dirname, 'Test.INP'))], 'Test.INP', {
        type: 'text',
      }),
    );

    await save();
    expect(removeIds(getAction(name))).toEqual(expected[name]);
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
    await user.upload(
      await screen.findByLabelText('Parameter File'),
      new File(['test'], 'Test.PAR', {
        type: 'text/plain',
      }),
    );

    // Upload INP file
    await user.upload(
      await screen.findByLabelText('Input File'),
      new File([await fs.readFile(path.join(__dirname, 'Test.INP'))], 'Test.INP', {
        type: 'text',
      }),
    );

    // Add a variable to the model
    await ensureVariable('Test Variable');

    // Check "use variable" for PARAM1 & select the variable
    await user.click((await screen.findAllByLabelText('Use Variable'))[0]);
    await selectOption('EMRALD Variable', 'Test Variable');

    // Switch to input blocks tab
    await user.click(await screen.findByText('Input Blocks'));

    // Select the variable for the WHEN block condition
    await selectOption('When Condition Right Hand Side', 'Test Variable');

    // Select the variable in the WHEN block body
    await selectOption('Assignment Right Hand Side', 'Test Variable');

    await save();
    expect(removeIds(getAction(name))).toEqual(expected[name]);
  });
});
