import { findByRole, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import {
  ensureVariable,
  getEvent,
  renderEventForm,
  save,
  selectOption,
} from '../../../../test-utils';
import expected from './Distribution.expected.json';

describe('Distribution Events', () => {
  test('sets parameters', async () => {
    const name = 'sets parameters';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etDistribution',
          parameters: [],
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter values for distribution parameters
    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('uses scientific notation', async () => {
    const name = 'uses scientific notation';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etDistribution',
          parameters: [],
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter values for distribution parameters using scientific notation
    await user.type(await screen.findByLabelText('Mean'), '1e1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5e2');
    await user.type(await screen.findByLabelText('Minimum'), '1e3');
    await user.type(await screen.findByLabelText('Maximum'), '1e4');

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets default time rate', async () => {
    const name = 'sets default time rate';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: false,
          evType: 'etDistribution',
          distType: 'dtNormal',
          parameters: [],
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter values for distribution parameters
    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    // Change default time rate to seconds
    await selectOption('Default Rate', 'Second');

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('sets individual time rates', async () => {
    const name = 'sets individual time rates';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: false,
          evType: 'etDistribution',
          distType: 'dtNormal',
          parameters: [],
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter values for distribution parameters
    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    // Change Standard Deviation time rate to seconds
    await user.click(
      await findByRole((await screen.findAllByLabelText('Time Rate'))[1], 'combobox'),
    );
    await user.click(await screen.findByRole('option', { name: 'Second' }));

    // Change Maximum time rate to days
    await user.click(
      await findByRole((await screen.findAllByLabelText('Time Rate'))[3], 'combobox'),
    );
    await user.click(await screen.findByRole('option', { name: 'Day' }));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('clears time rate property', async () => {
    const name = 'clears time rate property';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: false,
          evType: 'etDistribution',
          distType: 'dtNormal',
          parameters: [],
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter values for distribution parameters
    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    // Change Standard Deviation time rate to seconds
    await user.click(
      await findByRole((await screen.findAllByLabelText('Time Rate'))[1], 'combobox'),
    );
    await user.click(await screen.findByRole('option', { name: 'Second' }));

    // Change Standard Deviation time rate back to default
    await user.click(
      await findByRole((await screen.findAllByLabelText('Time Rate'))[1], 'combobox'),
    );
    await user.click(await screen.findByRole('option', { name: 'Default' }));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('uses variables', async () => {
    const name = 'uses variables';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: false,
          evType: 'etDistribution',
          distType: 'dtNormal',
          parameters: [],
        }}
      />,
    );
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    // Add a variable to the model
    expect(screen.queryAllByText('Save')).not.toBeNull();
    ensureVariable('Test Variable');

    // Set minimum value to use variable
    await user.click((await screen.findAllByLabelText('Use Variable'))[2]);
    await selectOption('Variable', 'Test Variable');
    await selectOption('Select', 'Resample');

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('changes distribution type', async () => {
    const name = 'changes distribution type';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: false,
          evType: 'etDistribution',
          distType: 'dtNormal',
          parameters: [],
        }}
      />,
    );
    const user = userEvent.setup();

    // Change type to Weibull distribution
    await selectOption('Distribution Type', 'Weibull Distribution');

    // Enter values for distribution parameters
    expect(screen.queryByLabelText('Shape')).not.toBeNull();
    expect(screen.queryByLabelText('Scale')).not.toBeNull();
    expect(screen.queryByLabelText('Minimum')).not.toBeNull();
    expect(screen.queryByLabelText('Maximum')).not.toBeNull();
    await user.type(await screen.findByLabelText('Shape'), '1');
    await user.type(await screen.findByLabelText('Scale'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    // Trigger blur event to make sure invalid values are updated
    await user.click(await screen.findByLabelText('Shape'));

    await save();
    expect(getEvent(name)).toEqual(expected[name]);
  });

  test('disallows invalid values', async () => {
    const name = 'changes distribution type';
    renderEventForm(
      <EventForm
        eventData={{
          objType: 'Event',
          name,
          desc: '',
          mainItem: false,
          evType: 'etDistribution',
          distType: 'dtNormal',
          parameters: [],
        }}
      />,
    );
    const user = userEvent.setup();

    // Enter values for distribution parameters
    await user.type(await screen.findByLabelText('Mean'), 'abc');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    // The save button should not be clickable because the "user" entered an invalid number for Mean
    await expect(async () => {
      await user.click(await screen.findByText('Save'));
    }).rejects.toThrowError();
  });
});
