import { useCallback, useEffect, useState } from 'react';
import {
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  Connection,
  MarkerType,
} from 'reactflow';
import EmraldDiagram from './EmraldDiagram';
import { Diagram } from '../../../types/Diagram';
import { useActionContext } from '../../../contexts/ActionContext';
import { useStateContext } from '../../../contexts/StateContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import getEventActionEdges from './Edges/EventActionEdge';
import getImmediateActionEdges from './Edges/ImmediateActionEdge';
import { Event } from '../../../types/Event';
import { State } from '../../../types/State';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { Action } from '../../../types/Action';
import { useEventContext } from '../../../contexts/EventContext';
import { Option } from '../../layout/ContextMenu/ContextMenu';

const useEmraldDiagram = (diagram: Diagram) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<{ mouseX: number; mouseY: number; } | null>(null);
  const [menuOptions, setMenuOptions] = useState<Option[]>();
  const { getDiagramByDiagramName } = useDiagramContext();
  const { getActionByActionId, getActionByActionName, getNewStatesByActionName, addNewStateToAction } = useActionContext();
  const { getEventByEventName } = useEventContext();
  const { getStateByStateId, getStateByStateName, updateStatePosition, updateStateEvents, updateStateEventActions, updateStateImmediateActions, updateState } = useStateContext();
  const { addWindow } = useWindowContext();

  // Get the edges for the state nodes
  const getEdges = (stateNodes: Node[]) => {
    stateNodes.forEach((stateNode: Node) => {
      const { state }: { state: State } = stateNode.data;
      getEventActionEdges(stateNode.id, nodes, state.eventActions, setEdges, getActionByActionName, getNewStatesByActionName);
      getImmediateActionEdges(stateNode.id, nodes, state.immediateActions, setEdges, getNewStatesByActionName);
    });
  };

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
          type: 'smoothstep',
          style: {
            stroke: 'green',
            strokeWidth: 2,
            strokeDasharray: 5
          },
          markerEnd: { 
            type: MarkerType.Arrow, 
            width: 25, 
            height: 25, 
            color: 'green'
          },
        },
      ]);
    },
    [nodes]
  );

  const onNodeDragStop = (_event: React.MouseEvent, node: Node) => {
    updateStatePosition(node.data.state, node.position);
  };

  // Get the new states for an action
  const getActionNewStates = (action?: Action) => {
    return action?.newStates?.map((state: { toState: string }) => state.toState) ?? [];
  }

  const closeContextMenu = () => setMenu(null); // Close the context menu
  
  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault(); // Prevent native context menu from showing
    setMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
    setMenuOptions([
      { label: 'New State', action: () => {console.log('Create new state'); closeContextMenu();}, isDivider: true },
      { label: 'Diagram Properties', action: () => {console.log('Edit diagram properties'); closeContextMenu();} },
    ])
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, _node: Node) => {
    console.log(event);
    event.preventDefault(); // Prevent native context menu from showing
    setMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
    setMenuOptions([
      { label: 'State Properties', action: () => {console.log('State Properties'); closeContextMenu();}, isDivider: true },
      { label: 'Delete State', action: () => {console.log('Delete State'); closeContextMenu();} },
    ])
  }, []);

  const onEventContextMenu = useCallback((e: React.MouseEvent, state: State, event?: Event) => {
    if (!event) { return; }
    e.preventDefault(); // Prevent the default context menu
    e.stopPropagation(); // Stop the event from bubbling up
    setMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });

    const defaultOptions = [
      { label: 'Action Properties', action: () => { console.log('Action Properties'); closeContextMenu(); }, isDivider: true },
      { label: 'Move Up', action: () => {moveEvent(state, event.name, 'up'); closeContextMenu();}, isDivider: true },
      { label: 'Move Down', action: () => {moveEvent(state, event.name, 'down'); closeContextMenu();}, isDivider: true },
      { label: 'Remove Action', action: () => { console.log('Remove Action'); closeContextMenu(); } },
      { label: 'Delete Action', action: () => { console.log('Delete Action'); closeContextMenu(); } },
    ];

    let menuOptions = [...defaultOptions];

    if (state.events.length === 1) {
      menuOptions = menuOptions.filter(option => option.label !== 'Move Up' && option.label !== 'Move Down');
    } else if (state.events[0] === event.name) {
      // Remove 'Move Up' action if the item is in the first spot
      menuOptions = menuOptions.filter(option => option.label !== 'Move Up');
    } else if (state.events[state.events.length - 1] === event.name) {
      // Remove 'Move Down' action if the item is in the last spot
      menuOptions = menuOptions.filter(option => option.label !== 'Move Down');
    }
  
    setMenuOptions(menuOptions);
  }, []);

  const onActionContextMenu = useCallback((event: React.MouseEvent, state: State, action: Action, type: 'immediate' | 'event') => {
    event.preventDefault(); // Prevent native context menu from showing
    event.stopPropagation();
    setMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  
    const defaultOptions = [
      { label: 'Action Properties', action: () => { console.log('Action Properties'); closeContextMenu(); }, isDivider: true },
      { label: 'Move Up', action: () => {moveAction(state, action.name, 'up', type); closeContextMenu();}, isDivider: true },
      { label: 'Move Down', action: () => {moveAction(state, action.name, 'down', type); closeContextMenu();}, isDivider: true },
      { label: 'Remove Action', action: () => { console.log('Remove Action'); closeContextMenu(); } },
      { label: 'Delete Action', action: () => { console.log('Delete Action'); closeContextMenu(); } },
    ];
  
    let menuOptions = [...defaultOptions];
  
    // Show the 'Move Up' and 'Move Down' options if the item is the first or last item or neither if its a single item
    if (type === 'event') {
      state.eventActions.forEach((eventAction) => {
        if (eventAction.actions.includes(action.name) && eventAction.actions.length === 1) {
          menuOptions = menuOptions.filter(option => option.label !== 'Move Up' && option.label !== 'Move Down');
        } else if (eventAction.actions[0] === action.name) {
          // Remove 'Move Up' action if the item is in the first spot
          menuOptions = menuOptions.filter(option => option.label !== 'Move Up');
        } else if (eventAction.actions[eventAction.actions.length - 1] === action.name) {
          // Remove 'Move Down' action if the item is in the last spot
          menuOptions = menuOptions.filter(option => option.label !== 'Move Down');
        }
      });
    }
  
    if (type === 'immediate') {
      if (state.immediateActions.length === 1) {
        menuOptions = menuOptions.filter(option => option.label !== 'Move Up' && option.label !== 'Move Down');
      } else if (state.immediateActions[0] === action.name) {
        // Remove 'Move Up' action if the item is in the first spot
        menuOptions = menuOptions.filter(option => option.label !== 'Move Up');
      } else if (state.immediateActions[state.immediateActions.length - 1] === action.name) {
        // Remove 'Move Down' action if the item is in the last spot
        menuOptions = menuOptions.filter(option => option.label !== 'Move Down');
      }
    }
  
    setMenuOptions(menuOptions);
  }, []);

  const moveEvent = (state: State, eventName: string, direction: 'up' | 'down') => {
    if (!eventName) { return; }
      const index = state.events?.indexOf(eventName);
      if (direction === 'up') {
        if (index > 0) {
          // Swap positions with the item above it in the array
          const temp = state.events[index];
          const tempEventAction = state.eventActions[index];
          state.events[index] = state.events[index - 1];
          state.eventActions[index] = state.eventActions[index - 1];
          state.events[index - 1] = temp;
          state.eventActions[index - 1] = tempEventAction;
        }
      } else if (direction === 'down') {
        if (index < state.events.length - 1) {
          // Swap positions with the item below it in the array
          const temp = state.events[index];
          const tempEventAction = state.eventActions[index];
          state.events[index] = state.events[index + 1];
          state.eventActions[index] = state.eventActions[index + 1];
          state.events[index + 1] = temp;
          state.eventActions[index + 1] = tempEventAction;
        }
      }  
    updateState(state);
  }

  const moveAction = (state: State, actionName: string, direction: 'up' | 'down', type: 'immediate' | 'event') => {
    if (type === 'event') {
      const eventActionToUpdate = state.eventActions.find((eventAction) => eventAction.actions.includes(actionName));
      if (!eventActionToUpdate) return;
      const index = eventActionToUpdate?.actions.indexOf(actionName);
      // const index = state.eventActions.findIndex((eventAction) => eventAction.actions.includes(actionName));
      if (direction === 'up') {
        if (index > 0) {
          // Swap positions with the item above it in the array
          const temp = eventActionToUpdate.actions[index];
          eventActionToUpdate.actions[index] = eventActionToUpdate.actions[index - 1];
          eventActionToUpdate.actions[index - 1] = temp;
        }
      } else if (direction === 'down') {
        if (index < eventActionToUpdate.actions.length - 1) {
          // Swap positions with the item below it in the array
          const temp = eventActionToUpdate.actions[index];
          eventActionToUpdate.actions[index] = eventActionToUpdate.actions[index + 1];
          eventActionToUpdate.actions[index + 1] = temp;
        }
      }
    }

    if (type === 'immediate') {
      const index = state.immediateActions.indexOf(actionName);
      if (direction === 'up') {
        if (index > 0) {
          // Swap positions with the item above it in the array
          const temp = state.immediateActions[index];
          state.immediateActions[index] = state.immediateActions[index - 1];
          state.immediateActions[index - 1] = temp;
        }
      }
      if (direction === 'down') {
        if (index < state.immediateActions.length - 1) {
          // Swap positions with the item below it in the array
          const temp = state.immediateActions[index];
          state.immediateActions[index] = state.immediateActions[index + 1];
          state.immediateActions[index + 1] = temp;
        }
      }
    }
    updateState(state);
  }

  // Check if the new states are in the current diagram
  const isStateInCurrentDiagram = (action: Action) => {
    if (!action) return false;
    const newStates = getActionNewStates(action);
    return newStates.every((newState) => diagram.states?.includes(newState));
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

  // Initialize the edges for the state nodes
  useEffect(() => {
    if (nodes) {
      getEdges(nodes);
    }
  }, [nodes]);

  // Initialize the state nodes
  useEffect(() => {
    if (diagram.states) {
      let stateNodes = diagram.states.map((state, index) => {
        let stateDetails = getStateByStateName(state);
        const { x, y } = stateDetails.geometryInfo || { x: 0, y: 0 };
        return {
          id: `state-${stateDetails.id}`,
          position: { x, y },
          type: 'custom',
          data: {
            label: state,
            diagram: diagram,
            state: stateDetails,
            nodes: nodes
          }
        };
      });
      setNodes(stateNodes);
      setLoading(false);
    }
  }, [diagram]);

  return {
    nodes,
    edges,
    loading,
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
    menu,
    menuOptions,
    onNodeContextMenu,
    onPaneContextMenu,
    onEventContextMenu,
    onActionContextMenu,
    closeContextMenu
  };
};

export default useEmraldDiagram;