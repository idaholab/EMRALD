import { findByRole, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EventFormContextProvider from '../../../../../components/forms/EventForm/EventFormContext';
import EventContextProvider from '../../../../../contexts/EventContext';
import EventForm from '../../../../../components/forms/EventForm/EventForm';
import { render } from '../../../../test-utils';
import { EMRALD_Model } from '../../../../../types/EMRALD_Model';
import { Event } from '../../../../../types/Event';

describe('Distributions', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.clearAllMocks();
  });

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

    expect(screen.queryByLabelText('Mean')).not.toBeNull();
    expect(screen.queryByLabelText('Standard Deviation')).not.toBeNull();
    expect(screen.queryByLabelText('Minimum')).not.toBeNull();
    expect(screen.queryByLabelText('Maximum')).not.toBeNull();

    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    expect(screen.queryAllByText('Save')).not.toBeNull();
    await user.click(await screen.findByText('Save'));
    const appData = sessionStorage.getItem('appData');
    expect(appData).not.toBeNull();
    if (appData) {
      const model = JSON.parse(appData) as EMRALD_Model;
      const event = model.EventList.find((e) => e.name === name);
      expect(event).not.toBeUndefined();
      if (event) {
        const expected: Event = {
          id: event.id,
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etDistribution',
          distType: 'dtNormal',
          dfltTimeRate: 'trHours',
          required: false,
          parameters: [
            {
              name: 'Mean',
              value: 1,
              useVariable: false,
            },
            {
              name: 'Standard Deviation',
              value: 5,
              useVariable: false,
            },
            {
              name: 'Minimum',
              value: 0,
              useVariable: false,
            },
            {
              name: 'Maximum',
              value: 100,
              useVariable: false,
            },
          ],
        };
        expect(event).toEqual(expected);
      }
    }
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

    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    // Change default time rate to seconds
    await user.click(await findByRole(await screen.findByLabelText('Default Rate'), 'combobox'));
    await user.click(await screen.findByRole('option', { name: 'Second' }));

    expect(screen.queryAllByText('Save')).not.toBeNull();
    await user.click(await screen.findByText('Save'));
    const appData = sessionStorage.getItem('appData');
    expect(appData).not.toBeNull();
    if (appData) {
      const model = JSON.parse(appData) as EMRALD_Model;
      const event = model.EventList.find((e) => e.name === name);
      expect(event).not.toBeUndefined();
      if (event) {
        const expected: Event = {
          id: event.id,
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etDistribution',
          distType: 'dtNormal',
          dfltTimeRate: 'trSeconds',
          required: false,
          parameters: [
            {
              name: 'Mean',
              value: 1,
              useVariable: false,
            },
            {
              name: 'Standard Deviation',
              value: 5,
              useVariable: false,
            },
            {
              name: 'Minimum',
              value: 0,
              useVariable: false,
            },
            {
              name: 'Maximum',
              value: 100,
              useVariable: false,
            },
          ],
        };
        expect(event).toEqual(expected);
      }
    }
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

    await user.type(await screen.findByLabelText('Mean'), '1');
    await user.type(await screen.findByLabelText('Standard Deviation'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    // Change Standard Deviation time rate to seconds
    await user.click(await findByRole((await screen.findAllByLabelText('Time Rate'))[1], 'combobox'));
    await user.click(await screen.findByRole('option', { name: 'Second' }));

    // Change Maximum time rate to days
    await user.click(await findByRole((await screen.findAllByLabelText('Time Rate'))[3], 'combobox'));
    await user.click(await screen.findByRole('option', { name: 'Day' }));

    expect(screen.queryAllByText('Save')).not.toBeNull();
    await user.click(await screen.findByText('Save'));
    const appData = sessionStorage.getItem('appData');
    expect(appData).not.toBeNull();
    if (appData) {
      const model = JSON.parse(appData) as EMRALD_Model;
      const event = model.EventList.find((e) => e.name === name);
      expect(event).not.toBeUndefined();
      if (event) {
        const expected: Event = {
          id: event.id,
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etDistribution',
          distType: 'dtNormal',
          dfltTimeRate: 'trHours',
          required: false,
          parameters: [
            {
              name: 'Mean',
              value: 1,
              useVariable: false,
            },
            {
              name: 'Standard Deviation',
              timeRate: 'trSeconds',
              value: 5,
              useVariable: false,
            },
            {
              name: 'Minimum',
              value: 0,
              useVariable: false,
            },
            {
              name: 'Maximum',
              timeRate: 'trDays',
              value: 100,
              useVariable: false,
            },
          ],
        };
        expect(event).toEqual(expected);
      }
    }
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
    await user.click(await findByRole(await screen.findByLabelText('Distribution Type'), 'combobox'));
    await user.click(await screen.findByRole('option', { name: 'Weibull Distribution' }));
    
    await user.type(await screen.findByLabelText('Shape'), '1');
    await user.type(await screen.findByLabelText('Scale'), '5');
    await user.type(await screen.findByLabelText('Minimum'), '0');
    await user.type(await screen.findByLabelText('Maximum'), '100');

    expect(screen.queryAllByText('Save')).not.toBeNull();
    await user.click(await screen.findByText('Save'));
    const appData = sessionStorage.getItem('appData');
    expect(appData).not.toBeNull();
    if (appData) {
      const model = JSON.parse(appData) as EMRALD_Model;
      const event = model.EventList.find((e) => e.name === name);
      expect(event).not.toBeUndefined();
      if (event) {
        const expected: Event = {
          id: event.id,
          objType: 'Event',
          name,
          desc: '',
          mainItem: true,
          evType: 'etDistribution',
          distType: 'dtWeibull',
          dfltTimeRate: 'trHours',
          required: false,
          parameters: [
            {
              name: 'Shape',
              value: 1,
              useVariable: false,
            },
            {
              name: 'Scale',
              value: 5,
              useVariable: false,
            },
            {
              name: 'Minimum',
              value: 0,
              useVariable: false,
            },
            {
              name: 'Maximum',
              value: 100,
              useVariable: false,
            },
          ],
        };
        expect(event).toEqual(expected);
      }
    }
  });
});
