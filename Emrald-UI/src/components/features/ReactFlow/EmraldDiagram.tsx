import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  MarkerType,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Diagram } from '../../../types/Diagram';
import { useStateContext } from '../../../contexts/StateContext';
import { useActionContext } from '../../../contexts/ActionContext';
import StateNode from '../EmraldDiagram/StateNodeComponent';
import { Box } from '@mui/material';

interface EdgeType {
  id: string;
  source: string;
  target: string;
}

interface EventAction {
  moveFromCurrent?: boolean;
  actions?: string[];
}

interface EmraldDiagramProps {
  diagram: Diagram;
}

const EmraldDiagram: React.FC<EmraldDiagramProps> = ({ diagram }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeType[]>([]);
  const [loading, setLoading] = useState(true);
  const { getEventsByStateName, getStateByStateName, updateStatePosition, updateStateEvents, updateStateEventActions, updateStateImmediateActions } = useStateContext();
  const { getNewStatesByActionName, getActionByActionName } = useActionContext();

  const getImmediateActions = (state: Node, immediateActions: string[]) => {
    immediateActions.forEach((action: string) => {
      if (action) {
        const newStates = getNewStatesByActionName(action);
        newStates.forEach((newState) => {
          const moveToState = nodes.find(
            (node) => node.data.label === newState.toState,
          );

          

          if (moveToState) {
            setEdges((prevEdges) => [
              ...prevEdges,
              {
                id: `immediate-action-${prevEdges.length}`,
                source: state.id,
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

  const getEventActions = (state: Node, eventActions: EventAction[]) => {
    eventActions.forEach((action) => {
      if (action.actions) {
        const newStates = getNewStatesByActionName(action.actions[0]);
        const currentAction = getActionByActionName(action.actions[0]);

        newStates.forEach((newState) => {
          const moveToState = nodes.find(
            (node) => node.data.label === newState.toState,
          );

          if (moveToState) {
            setEdges((prevEdges) => [
              ...prevEdges,
              {
                id: `event-action-${prevEdges.length}`,
                source: state.id,
                target: moveToState.id,
                targetHandle: 'event-action-target',
                sourceHandle: `event-action-source-${currentAction?.id}`,
                type: 'smoothstep',
                style: {
                  stroke: `${action.moveFromCurrent ? '' : 'green'}`,
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
      }
    });
  };

  const getEventActionEdges = (stateNodes: Node[]) => {
    stateNodes.forEach((state: Node) => {
      const events = getEventsByStateName(state.data.label);
      getEventActions(state, events.eventActions);
      getImmediateActions(state, events.immediateActions);
    });
  };

  useEffect(() => {
    if (diagram.states) {
      let stateNodes = diagram.states.map((state, index) => {
        let stateDetails = getStateByStateName(state);
        const { x = 0, y = 0 } = stateDetails.geometryInfo || {};
        return {
          id: `state-${String(index)}`,
          position: { x: x, y: y },
          type: 'custom',
          data: {
            diagramStates: diagram.states,
            state: stateDetails,
            updateStateEvents,
            updateStateEventActions,
            updateStateImmediateActions
          }
        };
      });
      setNodes(stateNodes);
      setLoading(false);
    }
  }, [diagram, updateStateEvents, updateStateEventActions, updateStateImmediateActions]);

  useEffect(() => {
    if (nodes) {
      getEventActionEdges(nodes);
    }
  }, [nodes]);

  const nodeTypes = useMemo(() => {
    return { custom: StateNode };
  }, []);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeDragStop = (_event: React.MouseEvent, node: Node) => {
    updateStatePosition(node.data.state, node.position);
  };

  // Conditionally render ReactFlow
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onEdgeDoubleClick={() => console.log(edges)}
          fitView
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      )}
    </Box>
  );
};

export default EmraldDiagram;
