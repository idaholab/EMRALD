import React from 'react';
import { Edge, Node, MarkerType } from 'reactflow';
import { Action } from '../../../../types/Action';

const getImmediateActionEdges = (
  stateId: string,
  nodes: Node[],
  immediateActions: string[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  getActionByActionName: (actionName: string) => Action | undefined,
  getNewStatesByActionName: (actionName: string) => { toState: string, prob: number }[],
) => {
  immediateActions.forEach((action: string) => {
    if (action) {
      const currentAction = getActionByActionName(action);
      const newStates = getNewStatesByActionName(action);
      newStates.forEach((newState) => {
        const moveToState = nodes.find(
          (node) => node.data.label === newState.toState
        );
        if (moveToState) {
          setEdges((prevEdges: Edge[]) => [
            ...prevEdges,
            {
              id: `immediate-action-${prevEdges.length}`,
              label: newState.prob > 0 && newState.prob !== Number.NEGATIVE_INFINITY ? `${newState.prob * 100}%` : '',
              source: stateId,
              target: moveToState.id,
              targetHandle: 'immediate-action-target',
              sourceHandle: `immediate-action-source-${currentAction?.id}`,
              style: {
                stroke: 'green',
                strokeDasharray: 5
              },
              markerEnd: {
                type: MarkerType.Arrow,
                width: 25,
                height: 25,
                color: 'green',
              },
            },
          ]);
        }
      });
    }
  });
};

export default getImmediateActionEdges;
