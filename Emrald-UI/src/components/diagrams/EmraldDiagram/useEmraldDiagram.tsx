import type { Action, Event, State } from '../../../types/EMRALD_Model';
import { type MouseEvent, useCallback, useEffect, useState } from 'react';
import {
  type Connection,
  type Edge,
  type Node,
  reconnectEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { EventForm } from '@/components/forms/EventForm/EventForm';
import { EventFormContextProvider } from '@/components/forms/EventForm/EventFormContext';
import { useActionContext } from '../../../contexts/ActionContext';
import {
  emptyDiagram,
  useDiagramContext,
} from '../../../contexts/DiagramContext';
import { useEventContext } from '../../../contexts/EventContext';
import { useStateContext } from '../../../contexts/StateContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import { ActionForm } from '../../forms/ActionForm/ActionForm';
import { ActionFormContextProvider } from '../../forms/ActionForm/ActionFormContext';
import { StateForm } from '../../forms/StateForm/StateForm';
import { getEventActionEdges } from './Edges/EventActionEdge';
import { getImmediateActionEdges } from './Edges/ImmediateActionEdge';
import { EmraldDiagram } from './EmraldDiagram';

export function useEmraldDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [topDiagram, setTopDiagram] = useState(emptyDiagram);
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
  const getEdges = (stateNodes: Node<{ state: State }>[]) => {
    setEdges([]);
    for (const stateNode of stateNodes) {
      const { state } = stateNode.data;
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
    }
  };

  const onEdgeClick = (_event: MouseEvent, edge: Edge) => {
    // Highlight selected edge so its easier to see its connection and label
    setEdges(eds =>
      eds.map(e =>
        e.id === edge.id
          ? {
              ...e,
              style: { ...e.style, stroke: '#e3961c' },
              labelStyle: {
                ...e.labelStyle,
                fill: '#e3961c',
                fontWeight: 'bold',
                transform: 'translateY(-10px)',
              },
            }
          : {
              ...e,
              style: { ...e.style, stroke: '#b1b1b7' },
              labelStyle: { ...e.labelStyle, fill: 'transparent' },
            },
      ),
    );
  };

  const onPaneClick = () => {
    // reset edge color when the user clicks away
    getEdges(nodes);
  };

  // Double Clicks
  const onNodeDoubleClick = (
    _event: MouseEvent,
    node: Node<{ state?: State }>,
  ) => {
    if (node.data.state) {
      addWindow(
        `Edit State: ${node.data.state.name}`,
        <StateForm stateData={node.data.state} />,
      );
    }
  };

  const onEventDoubleClick = (
    e: MouseEvent,
    event: Event | undefined,
    state: State,
  ) => {
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

  const onActionDoubleClick = (e: MouseEvent, action?: Action) => {
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
      const sourceNode = nodes.find(node => node.id === connection.source);
      const targetNode = nodes.find(node => node.id === connection.target);
      const targetState = getStateByStateId(connection.target);
      const currentAction = connection.sourceHandle?.includes('*')
        ? getActionByActionId(connection.sourceHandle.split('*')[1] ?? null)
        : getActionByActionId(connection.sourceHandle);

      if (!sourceNode || !targetNode) {
        return;
      }
      // Prevent a node from connecting to itself
      // if (sourceNode.data.label === targetNode.data.label) {
      //   return;
      // }

      // Check if edge already exists and if so, don't add it.
      const existingEdge = edges.find(
        edge =>
          edge.sourceHandle === connection.sourceHandle
          && edge.target === connection.target,
      );

      if (existingEdge) {
        return;
      }

      // Add new state to action
      addNewStateToAction(currentAction, {
        toState: targetState?.name ?? '',
        prob:
          currentAction?.newStates && currentAction.newStates.length > 0
            ? 0
            : -1, // If only a single newState default to -1
        varProb: null,
        failDesc: '',
      });

      // Add new edge
      setEdges(prevEdges => [
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

  const isValidConnection = () => {
    // Check if source and target nodes are the same
    // if (connection.source === connection.target) { //TODO: This needs to be revisited in the future. Currently, nodes can connect to themselves but its hard to tell with the react flow lines
    //   return false; // Prevent the connection
    // }
    return true; // Allow other connections
  };

  // Adds the ability to update an edge
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const currentAction = getActionByActionId(newConnection.sourceHandle);
      const oldState = getStateByStateId(oldEdge.target);
      const targetState = getStateByStateId(newConnection.target);

      // Prevent a node from connecting to itself
      if (oldEdge.source === newConnection.target) {
        return;
      }

      if (currentAction?.newStates) {
        // Remove the old newStates.toState with the new state we are connecting.
        currentAction.newStates = currentAction.newStates.filter(
          newState => newState.toState !== oldState?.name,
        );
        addNewStateToAction(currentAction, {
          toState: targetState?.name ?? '',
          prob: -1,
          varProb: null,
          failDesc: '',
        });

        setEdges(els => reconnectEdge(oldEdge, newConnection, els));
      }
    },
    [],
  );

  // Update the state node position
  const onNodeDragStop = (_event: MouseEvent, node: Node<{ state: State }>) => {
    updateStatePosition(node.data.state, node.position);
  };

  // Get the new states for an action
  const getActionNewStates = (action?: Action) =>
    action?.newStates?.map((state: { toState: string }) => state.toState) ?? [];

  // topDiagram is a snapshot taken when the window opened, so its `states`
  // array goes stale as states are added/removed. Resolve the current list
  // from the live model by this window's diagram name (names are unique, so
  // multiple open diagrams stay independent).
  const getCurrentDiagramStates = () =>
    getDiagramByDiagramName(topDiagram.name)?.states ?? topDiagram.states;

  // Check if the new states are in this diagram (the one this hook instance
  // is bound to), not whichever diagram last rendered into the shared signal.
  const isStateInCurrentDiagram = (action?: Action) =>
    action
      ? getActionNewStates(action).every(newState =>
          getCurrentDiagramStates().includes(newState),
        )
      : false;

  // Find and open window for diagram that has new states
  const openDiagramFromNewState = (action: Action) => {
    for (const newState of getActionNewStates(action)) {
      const stateDetails = getStateByStateName(newState);
      if (stateDetails) {
        const { diagramName } = stateDetails;
        const diagram = getDiagramByDiagramName(diagramName);
        if (diagram) {
          addWindow(diagramName, <EmraldDiagram diagram={diagram} />, {
            x: 75,
            y: 25,
            width: 1300,
            height: 700,
          });
        }
      }
    }
  };

  // Build the state nodes
  const getStateNodes = () => {
    const stateNodes = getCurrentDiagramStates().map(state => {
      const stateDetails = getStateByStateName(state);
      const { x, y } = {
        x: stateDetails?.geometryInfo?.x ?? 0,
        y: stateDetails?.geometryInfo?.y ?? 0,
      };
      return {
        id: stateDetails?.id ?? '',
        position: { x, y },
        type: 'custom',
        data: {
          label: state,
          state: stateDetails,
        },
      };
    });
    setNodes(stateNodes);
  };

  // Initialize the edges for the state nodes
  useEffect(() => {
    if (!loading) {
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
    onEdgeClick,
    onPaneClick,
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
}
