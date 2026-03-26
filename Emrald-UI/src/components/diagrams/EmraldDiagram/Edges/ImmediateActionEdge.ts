import type { Action } from '../../../../types/EMRALD_Model';
import { type Edge, MarkerType, type Node } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { showRemainingValues } from './EventActionEdge';

export function getImmediateActionEdges(
  stateId: string,
  nodes: Node<{ label: string }>[],
  immediateActions: string[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  getActionByActionName: (actionName: string) => Action | undefined,
  getNewStatesByActionName: (
    actionName: string,
  ) => { toState: string; prob: number }[],
) {
  for (const action of immediateActions) {
    if (action) {
      const currentAction = getActionByActionName(action);
      if (!currentAction) {
        continue;
      }
      for (const newState of getNewStatesByActionName(action)) {
        const moveToState = nodes.find(
          node => node.data.label === newState.toState,
        );
        if (moveToState) {
          setEdges(prevEdges => [
            ...prevEdges,
            {
              id: uuidv4(),
              source: stateId,
              target: moveToState.id,
              label: showRemainingValues(currentAction, newState),
              targetHandle: 'immediate-action-target',
              sourceHandle: currentAction.id ?? '',
              updatable: 'target',
              style: {
                stroke: 'green',
                strokeDasharray: 5,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 25,
                height: 25,
                color: 'green',
              },
            },
          ]);
        }
      }
    }
  }
}
