import { describe, expect, test } from 'vitest';
import {
  ensureExtSim,
  ensureVariable,
  getAction,
  renderActionForm,
  save,
  selectOption,
} from '../../../../test-utils';
import ActionForm from '../../../../../components/forms/ActionForm/ActionForm';
import expected from './ExtSimulation.expected.json';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

describe('Ext. Sim Message Actions', () => {
  test('sets external sim', async () => {
    const name = 'sets external sim';
    renderActionForm(
      <ActionForm
        actionData={{
          objType: 'Action',
          name,
          desc: '',
          mainItem: true,
          actType: 'at3DSimMsg',
        }}
      ></ActionForm>,
    );

    // Set sim action to "cancel sim"
    await selectOption('Sim Action', 'Cancel Sim');

    // Create an external sim in the model
    ensureExtSim('Test ExtSim');

    // Select the external sim
    await selectOption('External Sim', 'Test ExtSim');

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });

  test('sets open sim action', async () => {
    const name = 'sets open sim action';
    renderActionForm(
      <ActionForm
        actionData={{
          objType: 'Action',
          name,
          desc: '',
          mainItem: true,
          actType: 'at3DSimMsg',
        }}
      ></ActionForm>,
    );
    const user = userEvent.setup();

    // Set sim action to "cancel sim"
    await selectOption('Sim Action', 'Open Sim');

    // Create an external sim in the model
    ensureExtSim('Test ExtSim');

    // Select the external sim
    await selectOption('External Sim', 'Test ExtSim');

    // Enter a duration
    await user.click(await screen.findByLabelText('Days'));
    await user.type(await screen.findByLabelText('Days'), '1');
    await user.click(await screen.findByLabelText('Hours'));
    await user.type(await screen.findByLabelText('Hours'), '2');
    await user.click(await screen.findByLabelText('Minutes'));
    await user.type(await screen.findByLabelText('Minutes'), '3');
    await user.click(await screen.findByLabelText('Seconds'));
    await user.type(await screen.findByLabelText('Seconds'), '4');

    // Enter a model reference
    await user.type(await screen.findByLabelText('Model Reference (Optional)'), 'ModelRef');

    // Enter config data
    await user.type(await screen.findByLabelText('Config Data (Optional)'), 'ConfigData');

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
          mainItem: true,
          actType: 'at3DSimMsg',
        }}
      ></ActionForm>,
    );
    const user = userEvent.setup();

    // Set sim action to "cancel sim"
    await selectOption('Sim Action', 'Open Sim');

    // Create an external sim in the model
    ensureExtSim('Test ExtSim');

    // Select the external sim
    await selectOption('External Sim', 'Test ExtSim');

    // Enter a duration
    await user.click(await screen.findByLabelText('Days'));
    await user.type(await screen.findByLabelText('Days'), '1');
    await user.click(await screen.findByLabelText('Hours'));
    await user.type(await screen.findByLabelText('Hours'), '2');
    await user.click(await screen.findByLabelText('Minutes'));
    await user.type(await screen.findByLabelText('Minutes'), '3');
    await user.click(await screen.findByLabelText('Seconds'));
    await user.type(await screen.findByLabelText('Seconds'), '4');

    // Check box to use variables
    await user.click(await screen.findByLabelText('Use variable for items below'));

    // Add a variable to the model
    ensureVariable('Test ExtSim Variable', {
      varScope: 'gt3DSim'
    });

    // Select the variable
    await selectOption('Model Reference (Optional)', 'Test ExtSim Variable');
    await selectOption('Config Data (Optional)', 'Test ExtSim Variable');

    await save();
    expect(getAction(name)).toEqual(expected[name]);
  });
});
