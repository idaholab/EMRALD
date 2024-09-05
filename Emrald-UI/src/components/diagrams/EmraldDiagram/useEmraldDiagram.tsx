import { useCallback, useEffect, useState } from 'react';
import { useNodesState, useEdgesState, Edge, Node, Connection, updateEdge } from 'reactflow';
import EmraldDiagram, { currentDiagram } from './EmraldDiagram';
import { v4 as uuidv4 } from 'uuid';
// Edges
import getEventActionEdges from './Edges/EventActionEdge';
import getImmediateActionEdges from './Edges/ImmediateActionEdge';
// Types
import { State } from '../../../types/State';
import { Action } from '../../../types/Action';
import { Event } from '../../../types/Event';
// Contexts
import { emptyDiagram, useDiagramContext } from '../../../contexts/DiagramContext';
import { useStateContext } from '../../../contexts/StateContext';
import { useActionContext } from '../../../contexts/ActionContext';
import { useEventContext } from '../../../contexts/EventContext';
import { useWindowContext } from '../../../contexts/WindowContext';
// Forms
import StateForm from '../../forms/StateForm/StateForm';
import EventForm from '../../forms/EventForm/EventForm';
import ActionForm from '../../forms/ActionForm/ActionForm';
import ActionFormContextProvider from '../../forms/ActionForm/ActionFormContext';
import EventFormContextProvider from '../../forms/EventForm/EventFormContext';
import { Diagram } from '../../../types/Diagram';

const useEmraldDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [topDiagram, setTopDiagram] = useState<Diagram>(emptyDiagram);
  const { diagramList, getDiagramByDiagramName } = useDiagramContext();
  const {
    getActionByActionId,
    getActionByActionName,
    getNewStatesByActionName,
    addNewStateToAction,
  } = useActionContext();
  const { getEventByEventName } = useEventContext();
  const {
    getStateByStateId,
    getStateByStateName,
    updateStatePosition,
    updateStateEvents,
    updateStateEventActions,
    updateStateImmediateActions,
  } = useStateContext();
  const { addWindow } = useWindowContext();

  // Get the edges for the state nodes
  const getEdges = (stateNodes: Node[]) => {
    setEdges([]);
    stateNodes.forEach((stateNode: Node) => {
      const { state }: { state: State } = stateNode.data;
      getEventActionEdges(
        stateNode.id,
        nodes,
        state.eventActions,
        state.events,
        setEdges,
        getActionByActionName,
        getNewStatesByActionName,
      );
      getImmediateActionEdges(
        stateNode.id,
        nodes,
        state.immediateActions,
        setEdges,
        getActionByActionName,
        getNewStatesByActionName,
      );
    });
  };

  // Double Clicks
  const onNodeDoubleClick = (_event: any, node: Node) => {
    if (node.data.state) {
      addWindow(`Edit State: ${node.data.state.name}`, <StateForm stateData={node.data.state} />);
    }
  };

  const onEventDoubleClick = (e: any, event: Event | undefined, state: State) => {
    e.preventDefault();
    e.stopPropagation();
    if (!event) {
      return;
    }
    addWindow(
      `Edit Event: ${event.name}`,
      <EventFormContextProvider>
        <EventForm eventData={event} state={state} />
      </EventFormContextProvider>,
    );
  };

  const onActionDoubleClick = (e: any, action: Action) => {
    e.preventDefault();
    e.stopPropagation();
    if (!action) {
      return;
    }
    addWindow(
      `Edit Action: ${action.name}`,
      <ActionFormContextProvider>
        <ActionForm actionData={action} />
      </ActionFormContextProvider>,
    );
  };

  // Add new edge connection to state
  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);
      const targetState = getStateByStateId(connection.target);
      let currentAction: Action | undefined;
      if (connection.sourceHandle && connection.sourceHandle.includes('*')) {
        currentAction = getActionByActionId(connection.sourceHandle?.split('*')[1]);
      } else {
        currentAction = getActionByActionId(connection.sourceHandle);
      }

      if (!sourceNode || !targetNode) {
        return;
      }
      // Prevent a node from connecting to itself
      // if (sourceNode.data.label === targetNode.data.label) {
      //   return;
      // }

      // Check if edge already exists and if so, don't add it.
      const existingEdge = edges.find(
        (edge) =>
          edge.sourceHandle === connection.sourceHandle && edge.target === connection.target,
      );

      if (existingEdge) {
        return;
      }

      // Add new state to action
      addNewStateToAction(currentAction, {
        toState: targetState?.name,
        prob: -1,
        varProb: null,
        failDesc: '',
      });

      // Add new edge
      setEdges((prevEdges) => [
        ...prevEdges,
        {
          id: uuidv4(),
          source: sourceNode.id,
          target: targetNode.id,
          targetHandle: connection.targetHandle,
          sourceHandle: connection.sourceHandle,
          updatable: 'target',
        },
      ]);
      // Update state nodes
      getStateNodes();
    },
    [edges],
  );

  const isValidConnection = (_connection: Connection) => {
    // Check if source and target nodes are the same
    // if (connection.source === connection.target) { //TODO: This needs to be revisited in the future. Currently, nodes can connect to themselves but its hard to tell with the react flow lines
    //   return false; // Prevent the connection
    // }
    return true; // Allow other connections
  };

  // Adds the ability to update an edge
  const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
    const currentAction = getActionByActionId(newConnection.sourceHandle);
    const oldState = getStateByStateId(oldEdge.target);
    const targetState = getStateByStateId(newConnection.target);

    // Prevent a node from connecting to itself
    if (oldEdge.source === newConnection.target) {
      return;
    }

    if (currentAction && currentAction.newStates) {
      // Remove the old newStates.toState with the new state we are connecting.
      currentAction.newStates = currentAction.newStates.filter(
        (newState) => newState.toState !== oldState.name,
      );
      addNewStateToAction(currentAction, {
        toState: targetState?.name,
        prob: -1,
        varProb: null,
        failDesc: '',
      });

      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }
  }, []);

  // Update the state node position
  const onNodeDragStop = (_event: React.MouseEvent, node: Node) => {
    updateStatePosition(node.data.state, node.position);
  };

  // Get the new states for an action
  const getActionNewStates = (action?: Action) => {
    return action?.newStates?.map((state: { toState: string }) => state.toState) ?? [];
  };

  // Check if the new states are in the current diagram
  const isStateInCurrentDiagram = (action: Action) => {
    if (!action) return false;
    const newStates = getActionNewStates(action);
    return newStates.every((newState) => currentDiagram.value.states.includes(newState));
  };

  // Find and open window for diagram that has new states
  const openDiagramFromNewState = (action: Action) => {
    const newStates = getActionNewStates(action);
    newStates.forEach((newState) => {
      const stateDetails = getStateByStateName(newState);
      const { diagramName } = stateDetails;
      const diagram = getDiagramByDiagramName(diagramName);
      addWindow(diagramName, <EmraldDiagram diagram={diagram} />, {
        x: 75,
        y: 25,
        width: 1300,
        height: 700,
      });
    });
  };

  // Build the state nodes
  const getStateNodes = () => {
    if (topDiagram.states) {
      let stateNodes = topDiagram.states.map((state) => {
        let stateDetails = getStateByStateName(state);
        const { x, y } = {
          x: stateDetails.geometryInfo?.x || 0,
          y: stateDetails.geometryInfo?.y || 0,
        };
        return {
          id: `${stateDetails.id}`,
          position: { x, y },
          type: 'custom',
          data: {
            label: state,
            state: stateDetails,
          },
        };
      });
      setNodes(stateNodes);
    }
  };

  // Initialize the edges for the state nodes
  useEffect(() => {
    if (nodes && !loading) {
      getEdges(nodes); // Only call getEdges when nodes are available and loading is false
    }
  }, [nodes, loading]);

  // Initialize the state nodes
  useEffect(() => {
    getStateNodes();
    setLoading(false);
  }, [topDiagram, diagramList.value]);

  return {
    nodes,
    edges,
    loading,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onEdgeUpdate,
    onConnect,
    onNodeDoubleClick,
    onEventDoubleClick,
    onActionDoubleClick,
    isValidConnection,
    onNodeDragStop,
    isStateInCurrentDiagram,
    openDiagramFromNewState,
    getEventByEventName,
    getActionByActionName,
    getStateNodes,
    getActionNewStates,
    setTopDiagram,
    updateStatePosition,
    updateStateEvents,
    updateStateEventActions,
    updateStateImmediateActions,
  };
};

export default useEmraldDiagram;
