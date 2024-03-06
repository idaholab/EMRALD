import { Edge, Node, MarkerType } from 'reactflow';
import { Action } from '../../../../types/Action';

interface EventAction {
  moveFromCurrent?: boolean;
  actions?: string[];
}

const getEventActionEdges = (
  stateId: string,
  nodes: Node[],
  eventActions: EventAction[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  getActionByActionName: (actionName: string) => Action | undefined,
  getNewStatesByActionName: (actionName: string) => { toState: string }[],
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
              id: `event-action-${prevEdges.length}`,
              source: stateId,
              target: moveToState.id,
              targetHandle: 'event-action-target',
              sourceHandle: `event-action-source-${currentAction?.id}`,
              type: 'smoothstep',
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
