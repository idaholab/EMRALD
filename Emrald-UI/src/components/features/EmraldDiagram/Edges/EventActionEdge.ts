import { Edge, Node, MarkerType } from 'reactflow';
import { Action } from '../../../../types/Action';
import { v4 as uuidv4 } from 'uuid';

interface EventAction {
  moveFromCurrent?: boolean;
  actions?: string[];
}

export const showRemainingValues = (action: Action, newState: { toState: string, prob: number }) => {
  if (action.newStates && action.newStates.length > 1) {
    if (newState.prob === -1) {
      return 'Remaining';
    }
    else {
      return `${newState.prob * 100}%`;
    }
  } else {
    if (newState.prob > 0 && newState.prob !== Number.NEGATIVE_INFINITY) {
      return `${newState.prob * 100}%`;
    }
  }
};

const getEventActionEdges = (
  stateId: string,
  nodes: Node[],
  eventActions: EventAction[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  getActionByActionName: (actionName: string) => Action,
  getNewStatesByActionName: (actionName: string) => { toState: string, prob: number }[],
) => {
  eventActions.forEach((action) => {
    if (action.actions) {
      action.actions.forEach((actionName: string) => {
      const newStates = getNewStatesByActionName(actionName);
      const currentAction = getActionByActionName(actionName);

      newStates.forEach((newState) => {
        const moveToState = nodes.find(
          (node) => node.data.label === newState.toState,
        );

        if (moveToState) {
          setEdges((prevEdges) => [
            ...prevEdges,
            {
              id: uuidv4(),
              source: stateId,
              target: moveToState.id,
              label: showRemainingValues(currentAction, newState),
              targetHandle: 'event-action-target',
              sourceHandle: `event-action-source-${currentAction?.id}`,
              style: {
                stroke: `${action.moveFromCurrent ? '#b1b1b7' : 'green'}`,
                strokeDasharray: `${action.moveFromCurrent ? '' : 5}`
              },
              markerEnd: { 
                type: MarkerType.Arrow, 
                width: 25, 
                height: 25, 
                color: `${action.moveFromCurrent ? '#b1b1b7' : 'green'}` 
              },
            },
          ]);
        }
      });
      })
      
    }
  });
};

export default getEventActionEdges;
