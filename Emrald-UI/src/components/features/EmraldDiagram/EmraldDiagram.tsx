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
import { Box } from '@mui/material';
import StateNode from '../EmraldDiagram/StateNodeComponent';
import { Diagram } from '../../../types/Diagram';
import { State } from '../../../types/State';
import { useStateContext } from '../../../contexts/StateContext';
import { useActionContext } from '../../../contexts/ActionContext';

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
  const { getStateByStateName, updateStatePosition, updateStateEvents, updateStateEventActions, updateStateImmediateActions } = useStateContext();
  const { getNewStatesByActionName, getActionByActionName } = useActionContext();

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

  const getImmediateActionEdges = (stateNode: Node, immediateActions: string[]) => {
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
                source: stateNode.id,
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

  const getEventActionEdges = (stateNode: Node, eventActions: EventAction[]) => {
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
                source: stateNode.id,
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

  const getEdges = (stateNodes: Node[]) => {
    stateNodes.forEach((stateNode: Node) => {
      const { state }: { state: State } = stateNode.data;
      getEventActionEdges(stateNode, state.eventActions);
      getImmediateActionEdges(stateNode, state.immediateActions);
    });
  };

  useEffect(() => {
    if (nodes) {
      getEdges(nodes);
    }
  }, [nodes]);

  useEffect(() => {
    if (diagram.states) {
      let stateNodes = diagram.states.map((state, index) => {
        let stateDetails = getStateByStateName(state);
        const { x, y } = stateDetails.geometryInfo || { x: 0, y: 0 };
        return {
          id: `state-${String(index)}`,
          position: { x, y },
          type: 'custom',
          data: {
            label: state,
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
          onEdgeDoubleClick={(_event: React.MouseEvent, edge: Edge) => console.log(edge)}
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
