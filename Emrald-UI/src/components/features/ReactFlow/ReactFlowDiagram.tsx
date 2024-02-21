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
import CustomNode from './CustomNode';
import { EventAction } from '../../../types/State';

interface EdgeType {
  id: string;
  source: string;
  target: string;
}

interface ReactFlowDiagramProps {
  diagram: Diagram;
}

interface ActionEvents {
  events: string[];
  eventActions: EventAction[];
  immediateActions: string[];
}

const ReactFlowDiagram: React.FC<ReactFlowDiagramProps> = ({ diagram }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeType[]>([]);
  const [loading, setLoading] = useState(true);
  const { getEventsByStateName, getStatePosition } = useStateContext();
  const { getNewStatesByActionName } = useActionContext();

  const nodeTypes = useMemo(() => {
    return { custom: CustomNode };
  }, []);

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
                animated: true,
                style: {
                  stroke: 'green',
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
                sourceHandle: 'event-action-source',
                type: 'smoothstep',
                markerEnd: { type: MarkerType.Arrow, width: 25, height: 25 },
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
      const stateNodes = diagram.states.map((state, index) => {
        const statePosition = getStatePosition(state);
        const stateDetails = getEventsByStateName(state);
        return {
          id: `state-${String(index)}`,
          position: { x: statePosition.x, y: statePosition.y },
          type: 'custom',
          data: {
            label: state,
            type: stateDetails.type,
            immediateActions: stateDetails.immediateActions,
            events: stateDetails.events.map((event, index) => ({
              event: {
                name: event,
                evType: 'test'
              },
              actions: stateDetails.eventActions[index].actions,
              moveFromCurrent: stateDetails.eventActions[index].moveFromCurrent
            })),
            eventActions: stateDetails.eventActions,
          }
        };
      });
      setNodes(stateNodes);
      setLoading(false);
    }
  }, [diagram]);

  useEffect(() => {
    if (nodes) {
      getEventActionEdges(nodes);
    }
  }, [nodes]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Conditionally render ReactFlow
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeDoubleClick={() => console.log(edges)}
          fitView
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      )}
    </div>
  );
};

export default ReactFlowDiagram;
