import React from 'react';
import { Edge, Node, MarkerType } from 'reactflow';

const getImmediateActionEdges = (
  stateId: string,
  nodes: Node[],
  immediateActions: string[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  getNewStatesByActionName: (actionName: string) => { toState: string }[],
) => {
  immediateActions.forEach((action: string) => {
    if (action) {
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
              source: stateId,
              target: moveToState.id,
              type: 'smoothstep',
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
