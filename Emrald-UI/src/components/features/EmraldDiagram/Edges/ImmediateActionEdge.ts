import React from 'react';
import { Edge, Node, MarkerType } from 'reactflow';
import { Action } from '../../../../types/Action';
import { v4 as uuidv4 } from 'uuid';
import { showRemainingValues } from './EventActionEdge';

const getImmediateActionEdges = (
  stateId: string,
  nodes: Node[],
  immediateActions: string[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  getActionByActionName: (actionName: string) => Action,
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
              id: uuidv4(),
              source: stateId,
              target: moveToState.id,
              label: showRemainingValues(currentAction, newState),
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
