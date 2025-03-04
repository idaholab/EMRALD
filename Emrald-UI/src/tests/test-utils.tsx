import { findByRole, fireEvent, render, RenderOptions, screen } from '@testing-library/react';
import 'jest-extended';
import EmraldContextWrapper from '../contexts/EmraldContextWrapper';
import React, { act } from 'react';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { updateAppData } from '../hooks/useAppData';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import userEvent from '@testing-library/user-event';
import { Variable } from '../types/Variable';
import { State } from '../types/State';
import { LogicNode } from '../types/LogicNode';
import EventContextProvider from '../contexts/EventContext';
import EventFormContextProvider from '../components/forms/EventForm/EventFormContext';
import ActionContextProvider from '../contexts/ActionContext';
import ActionFormContextProvider from '../components/forms/ActionForm/ActionFormContext';
import { ExtSim } from '../types/ExtSim';

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
 * Shortcut function to render the EventForm component with all the required context provider wrappers.
 */
export const renderEventForm = (ui: React.ReactNode, options?: RenderOptions) => {
  customRender(
    <EventContextProvider>
      <EventFormContextProvider>{ui}</EventFormContextProvider>
    </EventContextProvider>,
    options,
  );
};

/**
 * Shortcut function to render the ActionForm component with all the required context provider wrappers.
 */
export const renderActionForm = (ui: React.ReactNode, options?: RenderOptions) => {
  customRender(
    <ActionContextProvider>
      <ActionFormContextProvider>{ui}</ActionFormContextProvider>
    </ActionContextProvider>,
    options,
  );
};

/**
 * Helper function to manually apply a change to the EMRALD model.
 * @param fn - A function to apply the change to the model.
 */
export async function updateModel(fn: (model: EMRALD_Model) => EMRALD_Model) {
  await save();
  const appData = sessionStorage.getItem('appData');
  if (appData) {
    let model = JSON.parse(appData) as EMRALD_Model;
    act(() => updateAppData(fn(model)));
  } else {
    throw new Error('No EMRALD model present in sessionStorage.');
  }
}

/**
 * Helper function to ensure a variable exists in the model.
 * @param name - The name of the variable.
 * @param data - Additional variable data, if necessary.
 */
export async function ensureVariable(name: string, data?: Partial<Variable>) {
  try {
    getVariable(name);
  } catch (err) {
    await updateModel((model) => {
      let v: Variable = {
        objType: 'Variable',
        name,
        varScope: 'gtGlobal',
        value: '',
        type: 'string',
      };
      if (data) {
        v = {
          ...v,
          ...data,
        };
      }
      model.VariableList.push(v);
      return model;
    });
  }
}

/**
 * Helper function to ensure a state exists in the model.
 * @param name - The name of the state.
 * @param data - Additional state data, if necessary.
 */
export async function ensureState(name: string, data?: Partial<State>) {
  try {
    getState(name);
  } catch (err) {
    await updateModel((model) => {
      let s: State = {
        objType: 'State',
        name,
        desc: '',
        stateType: 'stStandard',
        diagramName: '',
        immediateActions: [],
        events: [],
        eventActions: [],
      };
      if (data) {
        s = {
          ...s,
          ...data,
        };
      }
      model.StateList.push(s);
      return model;
    });
  }
}

/**
 * Helper function to ensure a logic node exists in the model.
 * @param name - The name of the logic node.
 * @param data - Additional logic node data, if necessary.
 */
export async function ensureLogicNode(name: string, data?: Partial<LogicNode>) {
  try {
    getLogicNode(name);
  } catch (err) {
    await updateModel((model) => {
      let n: LogicNode = {
        objType: 'LogicNode',
        name,
        desc: '',
        gateType: 'gtAnd',
        compChildren: [],
        gateChildren: [],
        isRoot: true,
      };
      if (data) {
        n = {
          ...n,
          ...data,
        };
      }
      model.LogicNodeList.push(n);
      return model;
    });
  }
}

/**
 * Helper function to ensure an external sim exists in the model.
 * @param name - The name of the external sim.
 * @param data - Additional external sim data, if necessary.
 */
export async function ensureExtSim(name: string, data?: Partial<ExtSim>) {
  try {
    getExtSim(name);
  } catch (err) {
    await updateModel((model) => {
      let e: ExtSim = {
        objType: 'ExtSim',
        name,
        resourceName: '',
      };
      if (data) {
        e = {
          ...e,
          ...data,
        };
      }
      model.ExtSimList.push(e);
      return model;
    });
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
 * Gets an state from the EMRALD model.
 * @param name - The name of the state to get.
 * @returns The most recently added state with the given name, with the ID property removed.
 */
export function getState(name: string) {
  const appData = sessionStorage.getItem('appData');
  if (appData) {
    let model = JSON.parse(appData) as EMRALD_Model;
    const matches = model.StateList.filter((e) => e.name === name);
    if (matches.length === 0) {
      throw new Error(`Could not find state ${name} in model.`);
    }
    const state = matches[matches.length - 1];
    delete state.id;
    return state;
  } else {
    throw new Error('No EMRALD model present in sessionStorage.');
  }
}

/**
 * Gets a variable from the EMRALD model.
 * @param name - The name of the variable to get.
 * @returns The most recently added variable with the given name, with the ID property removed.
 */
export function getVariable(name: string) {
  const appData = sessionStorage.getItem('appData');
  if (appData) {
    let model = JSON.parse(appData) as EMRALD_Model;
    const matches = model.VariableList.filter((e) => e.name === name);
    if (matches.length === 0) {
      throw new Error(`Could not find variable ${name} in model.`);
    }
    const variable = matches[matches.length - 1];
    delete variable.id;
    return variable;
  } else {
    throw new Error('No EMRALD model present in sessionStorage.');
  }
}

/**
 * Gets a logic node from the EMRALD model.
 * @param name - The name of the logic node to get.
 * @returns The most recently added logic node with the given name, with the ID property removed.
 */
export function getLogicNode(name: string) {
  const appData = sessionStorage.getItem('appData');
  if (appData) {
    let model = JSON.parse(appData) as EMRALD_Model;
    const matches = model.LogicNodeList.filter((e) => e.name === name);
    if (matches.length === 0) {
      throw new Error(`Could not find logic node ${name} in model.`);
    }
    const node = matches[matches.length - 1];
    delete node.id;
    return node;
  } else {
    throw new Error('No EMRALD model present in sessionStorage.');
  }
}

/**
 * Gets a diagram from the EMRALD model.
 * @param name - The name of the diagram to get.
 * @returns The most recently added diagram with the given name, with the ID property removed.
 */
export function getDiagram(name: string) {
  const appData = sessionStorage.getItem('appData');
  if (appData) {
    let model = JSON.parse(appData) as EMRALD_Model;
    const matches = model.DiagramList.filter((e) => e.name === name);
    if (matches.length === 0) {
      throw new Error(`Could not find diagram ${name} in model.`);
    }
    const diagram = matches[matches.length - 1];
    delete diagram.id;
    return diagram;
  } else {
    throw new Error('No EMRALD model present in sessionStorage.');
  }
}

/**
 * Gets an external sim from the EMRALD model.
 * @param name - The name of the external sim to get.
 * @returns The most recently added external sim with the given name, with the ID property removed.
 */
export function getExtSim(name: string) {
  const appData = sessionStorage.getItem('appData');
  if (appData) {
    let model = JSON.parse(appData) as EMRALD_Model;
    const matches = model.ExtSimList.filter((e) => e.name === name);
    if (matches.length === 0) {
      throw new Error(`Could not find ext sim ${name} in model.`);
    }
    const extSim = matches[matches.length - 1];
    delete extSim.id;
    return extSim;
  } else {
    throw new Error('No EMRALD model present in sessionStorage.');
  }
}

/**
 * Gets an action from the EMRALD model.
 * @param name - The name of the action to get.
 * @returns The most recently added action with the given name, with the ID property removed.
 */
export function getAction(name: string) {
  const appData = sessionStorage.getItem('appData');
  if (appData) {
    let model = JSON.parse(appData) as EMRALD_Model;
    const matches = model.ActionList.filter((e) => e.name === name);
    if (matches.length === 0) {
      throw new Error(`Could not find action ${name} in model.`);
    }
    const action = matches[matches.length - 1];
    delete action.id;
    return action;
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
 * @param label - The label of the target combobox.
 * @param option - The name of the option to select.
 */
export async function selectOption(label: string, option: string) {
  const user = userEvent.setup();
  await user.click(await findByRole(await screen.findByLabelText(label), 'combobox'));
  await user.click(await screen.findByRole('option', { name: option }));
}

/**
 * Shortcut for saving the model.
 * @param user - The test's user event instance.
 */
export async function save() {
  const user = userEvent.setup();
  await user.click(await screen.findByText('Save'));
}
