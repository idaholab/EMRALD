import type { Dispatch, SetStateAction } from 'react';
import type { Action } from '../../../../types/EMRALD_Model';
import { addEdge, type Edge, MarkerType, type Node } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

interface EventAction {
  moveFromCurrent?: boolean;
  actions?: string[];
}

export function showRemainingValues(
  action: Action,
  newState: { toState: string; prob: number },
) {
  const formatProb = (num: number) => {
    const numStr = num.toString();
    const decimalIndex = numStr.indexOf('.');
    const isScientificNotation = /[Ee]/.test(numStr);

    if (
      isScientificNotation
      || (decimalIndex !== -1 && numStr.length - decimalIndex - 1 > 4)
    ) {
      // Convert to scientific notation first, then multiply by 100
      const scientificStr = isScientificNotation ? numStr : num.toExponential();
      const [base, exponent] = scientificStr.split('e');
      const [front, decimal] = (base?.split('.') ?? [0, 0]) as [
        number,
        number | undefined,
      ];
      const adjExponent = Number(exponent) + 2;
      const scientificResult
        = front.toString()
          + (decimal ? '.' + decimal.toString().slice(0, 3) : '')
          + (adjExponent === 0 ? '' : 'e' + adjExponent.toString());
      return `${scientificResult} %`;
    }

    // For numbers with less than 4 decimal places, multiply by 100 then remove any trailing zeros
    const result = (num * 100).toFixed(3).split('.');
    const front = result[0];
    let decimal = result[1];
    for (let i = 2; i >= 0; i--) {
      if (decimal?.[i] !== '0') {
        break;
      }
      decimal = decimal.slice(0, i);
    }
    return `${(front ?? '') + (decimal ? '.' + decimal : '')} %`;
  };

  if (action.newStates && action.newStates.length > 1) {
    return newState.prob === -1 ? 'Remaining' : formatProb(newState.prob);
  } else if (newState.prob > 0 && newState.prob !== Number.NEGATIVE_INFINITY) {
    return formatProb(newState.prob);
  }
}

export function getEventActionEdges(
  stateId: string,
  nodes: Node<{ label: string }>[],
  eventActions: EventAction[],
  events: string[],
  setEdges: Dispatch<SetStateAction<Edge[]>>,
  getActionByActionName: (actionName: string) => Action | undefined,
  getNewStatesByActionName: (
    actionName: string,
  ) => { toState: string; prob: number }[],
) {
  for (const [index, action] of eventActions.entries()) {
    // events and eventActions are 1-to-1 parallel arrays. Older models can
    // carry orphaned eventActions entries (an event was deleted without
    // removing its matching eventActions slot). Skip any entry that has no
    // corresponding event so the edges match what the node actually renders,
    // which loops over events.
    if (index >= events.length) {
      continue;
    }
    if (action.actions) {
      for (const actionName of action.actions) {
        const newStates = getNewStatesByActionName(actionName);
        const currentAction = getActionByActionName(actionName);
        if (!currentAction) {
          continue;
        }
        const eventName = events[index];
        for (const newState of newStates) {
          const moveToState = nodes.find(
            node => node.data.label === newState.toState,
          );

          if (moveToState) {
            const connection = {
              id: uuidv4(),
              source: stateId,
              target: moveToState.id,
              label: showRemainingValues(currentAction, newState),
              targetHandle: 'event-action-target',
              sourceHandle: `${eventName ?? ''}*${currentAction.id ?? ''}`,
              updatable: 'target',
              style: {
                stroke: action.moveFromCurrent ? '#b1b1b7' : 'green',
                strokeDasharray: action.moveFromCurrent ? '' : '5',
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 25,
                height: 25,
                color: action.moveFromCurrent ? '#b1b1b7' : 'green',
              },
            };
            setEdges(prevEdges => addEdge(connection, prevEdges));
          }
        }
      }
    }
  }
}
