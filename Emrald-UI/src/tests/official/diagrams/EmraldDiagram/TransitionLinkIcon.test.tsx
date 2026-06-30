import type { Action, Diagram, Event, State } from '@/types/EMRALD_Model';
import { screen } from '@testing-library/react';
import { ReactFlowProvider } from 'reactflow';
import { beforeEach, describe, expect, test } from 'vitest';
import { EventActions } from '@/components/diagrams/EmraldDiagram/StateDisplayControllers/StateItems/EventActions';
import { ImmediateActions } from '@/components/diagrams/EmraldDiagram/StateDisplayControllers/StateItems/ImmediateActions';
import { render, updateModel } from '@/tests/test-utils';

const sourceDiagramName = 'Source Diagram';
const otherDiagramName = 'Other Diagram';
const sourceStateName = 'Source State';
const sameDiagramTargetName = 'Same Diagram Target';
const otherDiagramTargetName = 'Other Diagram Target';
const eventName = 'Transition Event';

function makeTransitionAction(name: string, toState: string): Action {
  return {
    id: name,
    objType: 'Action',
    name,
    desc: '',
    actType: 'atTransition',
    mainItem: false,
    newStates: [
      {
        toState,
        prob: -1,
        failDesc: '',
        varProb: null,
      },
    ],
  };
}

function makeDiagram(name: string, states: string[]): Diagram {
  return {
    objType: 'Diagram',
    name,
    desc: '',
    diagramType: 'dtMulti',
    diagramLabel: 'Component',
    states,
  };
}

function makeState(name: string, diagramName: string): State {
  return {
    objType: 'State',
    name,
    desc: '',
    stateType: 'stStandard',
    diagramName,
    immediateActions: [],
    events: [],
    eventActions: [],
  };
}

function seedTransitionModel(action: Action): State {
  const sourceState: State = {
    ...makeState(sourceStateName, sourceDiagramName),
    immediateActions: [action.name],
    events: [eventName],
    eventActions: [{ actions: [action.name], moveFromCurrent: false }],
  };
  const event: Event = {
    objType: 'Event',
    name: eventName,
    desc: '',
    mainItem: false,
    evType: 'etStateCng',
  };

  updateModel(model => {
    model.DiagramList = [
      makeDiagram(sourceDiagramName, [sourceStateName, sameDiagramTargetName]),
      makeDiagram(otherDiagramName, [otherDiagramTargetName]),
    ];
    model.StateList = [
      sourceState,
      makeState(sameDiagramTargetName, sourceDiagramName),
      makeState(otherDiagramTargetName, otherDiagramName),
    ];
    model.ActionList = [action];
    model.EventList = [event];
    return model;
  });

  return sourceState;
}

function renderActionRows(state: State) {
  render(
    <ReactFlowProvider>
      <ImmediateActions state={state} />
      <EventActions state={state} />
    </ReactFlowProvider>,
  );
}

describe('transition diagram link icon', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('does not show the diagram link icon for transitions to states in the same diagram', () => {
    const sourceState = seedTransitionModel(
      makeTransitionAction('Same Diagram Transition', sameDiagramTargetName),
    );

    renderActionRows(sourceState);

    expect(screen.queryAllByTestId('diagram-link-icon')).toHaveLength(0);
  });

  test('shows the diagram link icon for transitions to states in another diagram', () => {
    const sourceState = seedTransitionModel(
      makeTransitionAction('Other Diagram Transition', otherDiagramTargetName),
    );

    renderActionRows(sourceState);

    expect(screen.getAllByTestId('diagram-link-icon')).toHaveLength(2);
  });
});
