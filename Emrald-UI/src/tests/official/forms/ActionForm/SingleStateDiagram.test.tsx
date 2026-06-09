import type {
  Diagram,
  DiagramType,
  Event,
  State,
} from '../../../../types/EMRALD_Model';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { ActionForm } from '../../../../components/forms/ActionForm/ActionForm';
import { renderActionForm, updateModel } from '../../../test-utils';

/**
 * Adds a diagram of the given type to the model so that
 * getDiagramByDiagramName can resolve a state's owning diagram type.
 */
function ensureDiagram(name: string, diagramType: DiagramType) {
  updateModel(model => {
    if (!model.DiagramList.some(d => d.name === name)) {
      const diagram: Diagram = {
        objType: 'Diagram',
        name,
        desc: '',
        diagramType,
        diagramLabel: diagramType === 'dtSingle' ? 'Component' : 'Plant',
        states: [],
        required: false,
      };
      model.DiagramList.push(diagram);
    }
    return model;
  });
}

function makeState(diagramName: string): State {
  return {
    objType: 'State',
    name: 'Test State',
    desc: '',
    stateType: 'stStandard',
    diagramName,
    immediateActions: [],
    events: [],
    eventActions: [],
  };
}

const testEvent: Event = {
  objType: 'Event',
  name: 'Test Event',
  desc: '',
  evType: 'etStateCng',
  mainItem: true,
};

/** Opens the action Type dropdown and returns the Transition option element. */
async function openTransitionOption() {
  const user = userEvent.setup();
  await user.click(await screen.findByLabelText('Type'));
  return screen.findByRole('option', { name: 'Transition' });
}

describe('ActionForm single-state diagram transition restriction', () => {
  test('disables the Transition type for a new immediate action in a single-state diagram', async () => {
    ensureDiagram('Single Diagram', 'dtSingle');
    renderActionForm(<ActionForm state={makeState('Single Diagram')} />);

    // Transition is greyed out / unselectable.
    expect(await openTransitionOption()).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    // The form does not default to the disabled Transition type, so the
    // transition-specific sub-form is not rendered.
    expect(
      screen.queryByText(/To add a new destination state/),
    ).not.toBeInTheDocument();
  });

  test('allows the Transition type for a new immediate action in a multi-state diagram', async () => {
    ensureDiagram('Multi Diagram', 'dtMulti');
    renderActionForm(<ActionForm state={makeState('Multi Diagram')} />);

    expect(await openTransitionOption()).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  test('allows the Transition type for an event action even in a single-state diagram', async () => {
    ensureDiagram('Single Diagram', 'dtSingle');
    renderActionForm(
      <ActionForm event={testEvent} state={makeState('Single Diagram')} />,
    );

    expect(await openTransitionOption()).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});
