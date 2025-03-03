import { findByRole, fireEvent, render, RenderOptions, screen } from '@testing-library/react';
import 'jest-extended';
import EmraldContextWrapper from '../contexts/EmraldContextWrapper';
import React, { act } from 'react';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { updateAppData } from '../hooks/useAppData';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import { UserEvent } from '@testing-library/user-event';

const customRender = (ui: React.ReactNode, options?: RenderOptions) => {
  render(
    <EmraldContextWrapper>
      <Sidebar />
      {ui}
    </EmraldContextWrapper>,
    {
      ...options,
    },
  );
};

export { customRender as render };

/**
 * Helper function to manually apply a change to the EMRALD model.
 * @param fn - A function to apply the change to the model.
 */
export function updateModel(fn: (model: EMRALD_Model) => EMRALD_Model) {
  const appData = sessionStorage.getItem('appData');
  if (appData) {
    let model = JSON.parse(appData) as EMRALD_Model;
    act(() => updateAppData(fn(model)));
  } else {
    throw new Error('No EMRALD model present in sessionStorage.');
  }
}

/**
 * Gets an event from the EMRALD model.
 * @param name - The name of the event to get.
 * @returns The most recently added event with the given name, with the ID property removed.
 */
export function getEvent(name: string) {
  const appData = sessionStorage.getItem('appData');
  if (appData) {
    let model = JSON.parse(appData) as EMRALD_Model;
    const matches = model.EventList.filter((e) => e.name === name);
    if (matches.length === 0) {
      throw new Error(`Could not find event ${name} in model.`);
    }
    const event = matches[matches.length - 1];
    delete event.id;
    return event;
  } else {
    throw new Error('No EMRALD model present in sessionStorage.');
  }
}

/**
 * Helper function for simulating dragging and dropping.
 * @param from - The element to start dragging from.
 * @param to - The element to drop to.
 */
export function drag(from: HTMLElement, to: HTMLElement) {
  fireEvent.dragStart(from);
  fireEvent.dragEnter(from);
  fireEvent.dragOver(from);
  fireEvent.drop(to, from);
}

/**
 * Helper function for selecting options in MUI's combobox components.
 * @param user - The test's user event instance.
 * @param label - The label of the target combobox.
 * @param option - The name of the option to select.
 */
export async function selectOption(user: UserEvent, label: string, option: string) {
  await user.click(await findByRole(await screen.findByLabelText(label), 'combobox'));
  await user.click(await screen.findByRole('option', { name: option }));
}
