import { findByRole, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import EventFormContextProvider from '../../../../../components/forms/EventForm/EventFormContext';
import EventContextProvider from '../../../../../contexts/EventContext';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import { getEvent, render, updateModel } from '../../../../test-utils';
import expected from './Distribution.expected.json';

describe('Distribution Events', () => {
  it('sets parameters', async () => {
    const name = 'sets parameters';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
          <EventForm
            eventData={{
              objType: 'Event',
              name,
              desc: '',
              mainItem: true,
              evType: 'etDistribution',
              distType: 'dtNormal',
              parameters: [],
            }}
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Enter values for distribution parameters
    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected['sets parameters']);
  });

  it('sets default time rate', async () => {
    const name = 'sets default time rate';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
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
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Enter values for distribution parameters
    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    // Change default time rate to seconds
    await user.click(await findByRole(await screen.findByLabelText('Default Rate'), 'combobox'));
    await user.click(await screen.findByRole('option', { name: 'Second' }));

    expect(screen.queryAllByText('Save')).not.toBeNull();
    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected['sets default time rate']);
  });

  it('sets individual time rates', async () => {
    const name = 'sets individual time rates';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
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
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
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

    expect(screen.queryAllByText('Save')).not.toBeNull();
    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected['sets individual time rates']);
  });

  it('uses variables', async () => {
    const name = 'uses variables';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
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
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    // Add a variable to the model
    expect(screen.queryAllByText('Save')).not.toBeNull();
    await user.click(await screen.findByText('Save'));
    updateModel((model) => {
      model.VariableList.push({
        objType: 'Variable',
        name: 'Test Variable',
        varScope: 'gtGlobal',
        value: 1,
        type: 'int',
      });
      return model;
    });

    // Set minimum value to use variable
    await user.click((await screen.findAllByLabelText('Use Variable'))[2]);
    await user.click(await findByRole(await screen.findByLabelText('Variable'), 'combobox'));
    expect(screen.queryByRole('option', { name: 'Test Variable' })).not.toBeNull();
    await user.click(await screen.findByRole('option', { name: 'Test Variable' }));
    await user.click(await findByRole(await screen.findByLabelText('Select'), 'combobox'));
    await user.click(await screen.findByRole('option', { name: 'Resample' }));

    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected['uses variables']);
  });

  it('changes distribution type', async () => {
    const name = 'changes distribution type';
    render(
      <EventContextProvider>
        <EventFormContextProvider>
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
          ></EventForm>
        </EventFormContextProvider>
      </EventContextProvider>,
    );
    const user = userEvent.setup();

    // Change type to Weibull distribution
    await user.click(
      await findByRole(await screen.findByLabelText('Distribution Type'), 'combobox'),
    );
    await user.click(await screen.findByRole('option', { name: 'Weibull Distribution' }));

    // Enter values for distribution parameters
    await user.type(await screen.findByLabelText('Shape'), '1');
    await user.type(await screen.findByLabelText('Scale'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    expect(screen.queryAllByText('Save')).not.toBeNull();
    await user.click(await screen.findByText('Save'));
    expect(getEvent(name)).toEqual(expected['changes distribution type']);
  });
});
