import { useCallback, useEffect, useState } from 'react';
import {
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  Connection,
} from 'reactflow';
import EmraldDiagram from './EmraldDiagram';
import { useActionContext } from '../../../contexts/ActionContext';
import { useStateContext } from '../../../contexts/StateContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import getEventActionEdges from './Edges/EventActionEdge';
import getImmediateActionEdges from './Edges/ImmediateActionEdge';
import { State } from '../../../types/State';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { Action } from '../../../types/Action';
import { useEventContext } from '../../../contexts/EventContext';
import { currentDiagram } from './EmraldDiagram';



const useEmraldDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const { getDiagramByDiagramName } = useDiagramContext();
  const { getActionByActionId, getActionByActionName, getNewStatesByActionName, addNewStateToAction } = useActionContext();
  const { getEventByEventName } = useEventContext();
  const { getStateByStateId, getStateByStateName, updateStatePosition, updateStateEvents, updateStateEventActions, updateStateImmediateActions } = useStateContext();
  const { addWindow } = useWindowContext();

  // Get the edges for the state nodes
  const getEdges = (stateNodes: Node[]) => {
    stateNodes.forEach((stateNode: Node) => {
      const { state }: { state: State } = stateNode.data;
      getEventActionEdges(stateNode.id, nodes, state.eventActions, setEdges, getActionByActionName, getNewStatesByActionName);
      getImmediateActionEdges(stateNode.id, nodes, state.immediateActions, setEdges, getActionByActionName, getNewStatesByActionName);
    });
  };

  // Add new edge connection to state
  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);
      const type = connection.sourceHandle?.includes('event-action') ? 'event-action' : 'immediate-action';
      const targetState = getStateByStateId(Number(connection.target?.split("-")[1]));
      const currentAction = getActionByActionId(Number(connection.sourceHandle?.split("-")[3]));

      addNewStateToAction(currentAction, { toState: targetState?.name, prob: 0, varProb: null, failDesc: "" });

      if (!sourceNode || !targetNode) {
        return;
      }

      setEdges((prevEdges) => [
        ...prevEdges,
        {
          id: `${type}-${prevEdges.length}`,
          source: sourceNode.id,
          target: targetNode.id,
          targetHandle: connection.targetHandle,
          sourceHandle: connection.sourceHandle,
        },
      ]);
      getEdges(nodes);  
    },
    [nodes]
  );

  // Update the state node position
  const onNodeDragStop = (_event: React.MouseEvent, node: Node) => {
    updateStatePosition(node.data.state, node.position);
  };

  // Get the new states for an action
  const getActionNewStates = (action?: Action) => {
    return action?.newStates?.map((state: { toState: string }) => state.toState) ?? [];
  }

  // Check if the new states are in the current diagram
  const isStateInCurrentDiagram = (action: Action) => {
    if (!action) return false;
    const newStates = getActionNewStates(action);
    return newStates.every((newState) => currentDiagram.value.states?.includes(newState));
  };

  // Find and open window for diagram that has new states
  const openDiagramFromNewState = (action: Action) => {
    const newStates = getActionNewStates(action)
    newStates.forEach((newState) => {
      const stateDetails = getStateByStateName(newState);
      const { diagramName } = stateDetails;
      const diagram = getDiagramByDiagramName(diagramName);
      addWindow(diagramName, <EmraldDiagram diagram={diagram} />, { x: 75, y: 25, width: 1300, height: 700 });
    });
  };

  // Build the state nodes
  const getStateNodes = () => {
    if (currentDiagram.value.states) {
      let stateNodes = currentDiagram.value.states.map((state) => {
        let stateDetails = getStateByStateName(state);
        const { x, y } = stateDetails.geometryInfo || { x: 0, y: 0 };
        return {
          id: `state-${stateDetails.id}`,
          position: { x, y },
          type: 'custom',
          data: {
            label: state,
            diagram: currentDiagram.value,
            state: stateDetails,
            nodes: nodes
          }
        };
      });
      setNodes(stateNodes);

    }
  }

  // Initialize the edges for the state nodes
  useEffect(() => {
    if (nodes) {
      getEdges(nodes);
    }
  }, [nodes]);

  // Initialize the state nodes
  useEffect(() => {
    getStateNodes();
    setLoading(false);
  }, [currentDiagram.value]);
  

  return {
    nodes,
    edges,
    loading,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
    getActionNewStates,
    isStateInCurrentDiagram,
    openDiagramFromNewState,
    updateStatePosition,
    updateStateEvents,
    updateStateEventActions,
    updateStateImmediateActions,
    getEventByEventName,
    getActionByActionName,
    getStateNodes
  };
};

export default useEmraldDiagram;