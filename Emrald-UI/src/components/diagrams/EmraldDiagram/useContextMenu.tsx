import { useState } from 'react';
import { Edge, Node } from 'reactflow';
import { Event } from '../../../types/Event';
import { State } from '../../../types/State';
import { Action } from '../../../types/Action';
import { Option } from '../../layout/ContextMenu/ContextMenu';
import { useStateContext } from '../../../contexts/StateContext';
import { useEventContext } from '../../../contexts/EventContext';
import { useActionContext } from '../../../contexts/ActionContext';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { currentDiagram } from './EmraldDiagram';
import { useWindowContext } from '../../../contexts/WindowContext';
import StateForm from '../../forms/StateForm/StateForm';
import EventForm from '../../forms/EventForm/EventForm';
import ActionForm from '../../forms/ActionForm/ActionForm';
import DiagramForm from '../../forms/DiagramForm/DiagramForm';
import ActionFormContextProvider from '../../forms/ActionForm/ActionFormContext';

const useContextMenu = (
  getStateNodes?: () => void,
  setEdges?: (edges: Edge[]) => void,
) => {
  // Get state nodes function is needed if deleting or removing a state, set edges function is needed if deleting or removing an edge
  const [menu, setMenu] = useState<{ mouseX: number; mouseY: number } | null>(
    null,
  );
  const [menuOptions, setMenuOptions] = useState<Option[]>();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Event | State | Action>();
  const [stateToModify, setStateToModify] = useState<State | undefined>();
  const [actionTypeToModify, setActionTypeToModify] = useState<string>();
  const { addWindow } = useWindowContext();
  const { updateDiagramDetails } = useDiagramContext();
  const { updateState, deleteState, getStateByStateId } = useStateContext();
  const { deleteEvent } = useEventContext();
  const { updateAction, deleteAction, getActionByActionId } =
    useActionContext();

  // Type guards checks for State, Event, and Action
  function isState(item: Event | State | Action): item is State {
    return (item as State).stateType !== undefined;
  }

  function isEvent(item: Event | State | Action): item is Event {
    return (item as Event).evType !== undefined;
  }

  function isAction(item: Event | State | Action): item is Action {
    return (item as Action).actType !== undefined;
  }

  const closeContextMenu = () => setMenu(null); // Close the context menu

  /**
   **** Context Menus for Emrald Diagram ****
   **/

  // * Context menu for diagram
  const onPaneContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent native context menu from showing
    setMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
    setMenuOptions([
      {
        label: 'New State',
        action: () => {
          addWindow('New State', <StateForm />);
          closeContextMenu();
        },
        isDivider: true,
      },
      {
        label: 'Diagram Properties',
        action: () => {
          addWindow(
            `Edit Properties ${currentDiagram.value.name}`,
            <DiagramForm diagramData={currentDiagram.value} />,
          );
          closeContextMenu();
        },
      },
    ]);
  };

  // * Context menu for state item
  const onNodeContextMenu = (event: React.MouseEvent, node: Node) => {
    const state = node.data.state;
    event.preventDefault(); // Prevent native context menu from showing
    setMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
    setMenuOptions([
      {
        label: 'State Properties',
        action: () => {
          addWindow(state.name, <StateForm stateData={state} />);
          closeContextMenu();
        },
        isDivider: true,
      },
      {
        label: 'Remove State',
        action: () => {
          removeStateItem(state);
          closeContextMenu();
        },
      },
      {
        label: 'Delete State',
        action: () => {
          showDeleteConfirmation(state);
          closeContextMenu();
        },
      },
    ]);
  };

  // * Context menu for edge
  const onEdgeContextMenu = (
    event: React.MouseEvent,
    edge: Edge,
    edges: Edge[],
  ) => {
    event.preventDefault(); // Prevent native context menu from showing
    setMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
    setMenuOptions([
      {
        label: 'Delete Edge',
        action: () => {
          deleteEdge(edge, edges);
          closeContextMenu();
        },
      },
    ]);
  };

  // * Context menu for immediate actions and event actions header
  const onActionsHeaderContextMenu = (
    e: React.MouseEvent,
    type: 'event' | 'immediate',
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });

    const defaultOptions = [
      {
        label: 'New Event',
        action: () => {
          addWindow('New Event', <EventForm />);
          closeContextMenu();
        },
      },
      {
        label: 'New Action',
        action: () => {
          addWindow(
            'New Action',
            <ActionFormContextProvider>
              <ActionForm />
            </ActionFormContextProvider>,
          );
          closeContextMenu();
        },
      },
    ];

    let menuOptions = [...defaultOptions];

    if (type === 'event') {
      menuOptions = menuOptions.filter(
        (option) => option.label !== 'New Action',
      );
    } else {
      menuOptions = menuOptions.filter(
        (option) => option.label !== 'New Event',
      );
    }

    setMenuOptions(menuOptions);
  };

  // * Context menu for event items
  const onEventContextMenu = (
    e: React.MouseEvent,
    state: State,
    event?: Event,
  ) => {
    if (!event) {
      return;
    }
    e.preventDefault(); // Prevent the default context menu
    e.stopPropagation(); // Stop the event from bubbling up
    setMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });

    const defaultOptions = [
      {
        label: 'Event Properties',
        action: () => {
          addWindow(event.name, <EventForm eventData={event} />);
          closeContextMenu();
        },
      },
      {
        label: 'New Action',
        action: () => {
          addWindow(
            'New Action',
            <ActionFormContextProvider>
              <ActionForm />
            </ActionFormContextProvider>,
          );
          closeContextMenu();
        },
        isDivider: true,
      },
      {
        label: 'Move Up',
        action: () => {
          moveEvent(state, event.name, 'up');
          closeContextMenu();
        },
      },
      {
        label: 'Move Down',
        action: () => {
          moveEvent(state, event.name, 'down');
          closeContextMenu();
        },
        isDivider: true,
      },
      {
        label: 'Remove Event',
        action: () => {
          removeEventItem(event, state);
          closeContextMenu();
        },
      },
      {
        label: 'Delete Event',
        action: () => {
          showDeleteConfirmation(event, state);
          closeContextMenu();
        },
      },
    ];

    let menuOptions = [...defaultOptions];

    if (state.events.length === 1) {
      menuOptions = menuOptions.filter(
        (option) => option.label !== 'Move Up' && option.label !== 'Move Down',
      );
    } else if (state.events[0] === event.name) {
      // Remove 'Move Up' action if the item is in the first spot
      menuOptions = menuOptions.filter((option) => option.label !== 'Move Up');
    } else if (state.events[state.events.length - 1] === event.name) {
      // Remove 'Move Down' action if the item is in the last spot
      menuOptions = menuOptions.filter(
        (option) => option.label !== 'Move Down',
      );
    }

    setMenuOptions(menuOptions);
  };

  // * Context menu for action items
  const onActionContextMenu = (
    event: React.MouseEvent,
    state: State,
    action: Action,
    type: 'immediate' | 'event',
  ) => {
    event.preventDefault(); // Prevent native context menu from showing
    event.stopPropagation();
    setMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });

    const defaultOptions = [
      {
        label: 'Action Properties',
        action: () => {
          addWindow(
            action.name,
            <ActionFormContextProvider>
              <ActionForm actionData={action} />
            </ActionFormContextProvider>,
          );
          closeContextMenu();
        },
        isDivider: true,
      },
      {
        label: 'Move Up',
        action: () => {
          moveAction(state, action.name, 'up', type);
          closeContextMenu();
        },
        isDivider: true,
      },
      {
        label: 'Move Down',
        action: () => {
          moveAction(state, action.name, 'down', type);
          closeContextMenu();
        },
        isDivider: true,
      },
      {
        label: 'Remove Action',
        action: () => {
          removeActionItem(action, type, state);
          closeContextMenu();
        },
      },
      {
        label: 'Delete Action',
        action: () => {
          showDeleteConfirmation(action, state, type);
          closeContextMenu();
        },
      },
    ];

    let menuOptions = [...defaultOptions];

    // Show the 'Move Up' and 'Move Down' options if the item is the first or last item or neither if its a single item
    if (type === 'event') {
      state.eventActions.forEach((eventAction) => {
        if (
          eventAction.actions.includes(action.name) &&
          eventAction.actions.length === 1
        ) {
          menuOptions = menuOptions.filter(
            (option) =>
              option.label !== 'Move Up' && option.label !== 'Move Down',
          );
        } else if (eventAction.actions[0] === action.name) {
          // Remove 'Move Up' action if the item is in the first spot
          menuOptions = menuOptions.filter(
            (option) => option.label !== 'Move Up',
          );
        } else if (
          eventAction.actions[eventAction.actions.length - 1] === action.name
        ) {
          // Remove 'Move Down' action if the item is in the last spot
          menuOptions = menuOptions.filter(
            (option) => option.label !== 'Move Down',
          );
        }
      });
    }

    if (type === 'immediate') {
      if (state.immediateActions.length === 1) {
        menuOptions = menuOptions.filter(
          (option) =>
            option.label !== 'Move Up' && option.label !== 'Move Down',
        );
      } else if (state.immediateActions[0] === action.name) {
        // Remove 'Move Up' action if the item is in the first spot
        menuOptions = menuOptions.filter(
          (option) => option.label !== 'Move Up',
        );
      } else if (
        state.immediateActions[state.immediateActions.length - 1] ===
        action.name
      ) {
        // Remove 'Move Down' action if the item is in the last spot
        menuOptions = menuOptions.filter(
          (option) => option.label !== 'Move Down',
        );
      }
    }

    setMenuOptions(menuOptions);
  };

  /**
   **** Move Event and Action functions ****
   **/
  const moveEvent = (
    state: State,
    eventName: string,
    direction: 'up' | 'down',
  ) => {
    if (!eventName) {
      return;
    }
    const index = state.events?.indexOf(eventName);
    if (direction === 'up') {
      if (index > 0) {
        // Moves event and matching eventAction item up
        const temp = state.events[index];
        const tempEventAction = state.eventActions[index];
        state.events[index] = state.events[index - 1];
        state.eventActions[index] = state.eventActions[index - 1];
        state.events[index - 1] = temp;
        state.eventActions[index - 1] = tempEventAction;
      }
    } else if (direction === 'down') {
      if (index < state.events.length - 1) {
        // Moves event and matching eventAction item down
        const temp = state.events[index];
        const tempEventAction = state.eventActions[index];
        state.events[index] = state.events[index + 1];
        state.eventActions[index] = state.eventActions[index + 1];
        state.events[index + 1] = temp;
        state.eventActions[index + 1] = tempEventAction;
      }
    }
    updateState(state);
  };

  const moveAction = (
    state: State,
    actionName: string,
    direction: 'up' | 'down',
    type: 'immediate' | 'event',
  ) => {
    if (type === 'event') {
      const eventActionToUpdate = state.eventActions.find((eventAction) =>
        eventAction.actions.includes(actionName),
      );
      if (!eventActionToUpdate) return;
      const index = eventActionToUpdate?.actions.indexOf(actionName);
      if (direction === 'up') {
        if (index > 0) {
          // Moves action if within eventActions up
          const temp = eventActionToUpdate.actions[index];
          eventActionToUpdate.actions[index] =
            eventActionToUpdate.actions[index - 1];
          eventActionToUpdate.actions[index - 1] = temp;
        }
      } else if (direction === 'down') {
        if (index < eventActionToUpdate.actions.length - 1) {
          // Moves action if within eventActions down
          const temp = eventActionToUpdate.actions[index];
          eventActionToUpdate.actions[index] =
            eventActionToUpdate.actions[index + 1];
          eventActionToUpdate.actions[index + 1] = temp;
        }
      }
    }

    if (type === 'immediate') {
      const index = state.immediateActions.indexOf(actionName);
      if (direction === 'up') {
        if (index > 0) {
          // Moves action if within immediateActions up
          const temp = state.immediateActions[index];
          state.immediateActions[index] = state.immediateActions[index - 1];
          state.immediateActions[index - 1] = temp;
        }
      }
      if (direction === 'down') {
        if (index < state.immediateActions.length - 1) {
          // Moves action if within immediateActions down
          const temp = state.immediateActions[index];
          state.immediateActions[index] = state.immediateActions[index + 1];
          state.immediateActions[index + 1] = temp;
        }
      }
    }
    updateState(state);
  };

  /**
   **** Delete and Remove functions ****
   **/
  // * Removes state from the diagram
  const removeStateItem = (stateToRemove: State) => {
    if (!stateToRemove) {
      return;
    }
    if (stateToRemove.id && getStateNodes) {
      currentDiagram.value.states = currentDiagram.value.states.filter(
        (state) => state !== stateToRemove.name,
      );
      getStateNodes();
      updateDiagramDetails(currentDiagram.value);
    }
  };

  // * Removes event from the diagram
  const removeEventItem = (eventToRemove: Event, state: State) => {
    if (!eventToRemove) {
      return;
    }
    if (eventToRemove && state) {
      const index = state.events.indexOf(eventToRemove.name);
      state.events = state.events.filter(
        (event) => event !== eventToRemove.name,
      );
      state.eventActions.splice(index, 1);
      updateState(state);
    }
  };

  // * Removes action from the diagram
  const removeActionItem = (
    actionToRemove: Action,
    actionType: 'immediate' | 'event',
    state: State,
  ) => {
    if (!actionToRemove) {
      return;
    }
    if (actionToRemove && actionType) {
      if (actionType === 'event') {
        state.eventActions.forEach((eventAction) => {
          if (eventAction.actions.includes(actionToRemove.name)) {
            eventAction.actions = eventAction.actions.filter(
              (action) => action !== actionToRemove.name,
            );
          }
        });
      }
      if (actionType === 'immediate') {
        state.immediateActions = state.immediateActions.filter(
          (action) => action !== actionToRemove.name,
        );
      }
      updateState(state);
    }
  };

  // * Removes the item from the diagram and also deletes it from the project
  const deleteItem = () => {
    if (!itemToDelete) {
      return;
    }

    if (itemToDelete.id && isState(itemToDelete) && getStateNodes) {
      currentDiagram.value.states = currentDiagram.value.states.filter(
        (state) => state !== itemToDelete.name,
      );
      getStateNodes();
      updateDiagramDetails(currentDiagram.value);
      deleteState(itemToDelete.id);
    } else if (itemToDelete.id && stateToModify && isEvent(itemToDelete)) {
      const index = stateToModify.events.indexOf(itemToDelete.name);
      stateToModify.events = stateToModify.events.filter(
        (event) => event !== itemToDelete.name,
      );
      stateToModify.eventActions.splice(index, 1);
      updateState(stateToModify);
      deleteEvent(itemToDelete.id);
    } else if (
      itemToDelete.id &&
      stateToModify &&
      actionTypeToModify &&
      isAction(itemToDelete)
    ) {
      if (actionTypeToModify === 'event') {
        stateToModify.eventActions.forEach((eventAction) => {
          if (eventAction.actions.includes(itemToDelete.name)) {
            eventAction.actions = eventAction.actions.filter(
              (action) => action !== itemToDelete.name,
            );
          }
        });
      }
      if (actionTypeToModify === 'immediate') {
        stateToModify.immediateActions = stateToModify.immediateActions.filter(
          (action) => action !== itemToDelete.name,
        );
      }
      updateState(stateToModify);
      deleteAction(itemToDelete.id);
    }
    setDeleteConfirmation(false);
  };

  // * Removes an edge connection
  const deleteEdge = (edge: Edge, edges: Edge[]) => {
    if (edge && edges && setEdges) {
      const actionToUpdate = getActionByActionId(
        Number(edge.sourceHandle?.split('-')[3]),
      );
      const targetState = getStateByStateId(Number(edge.target?.split('-')[1]));

      if (!actionToUpdate.newStates) {
        return;
      }
      actionToUpdate.newStates = actionToUpdate.newStates.filter(
        (state) => state.toState !== targetState?.name,
      );
      updateAction(actionToUpdate);
      const newEdges = edges.filter(
        (edgeToRemove) => edgeToRemove.id !== edge.id,
      );
      setEdges(newEdges);
    }
  };

  /*
   **** Delete Confirmation  functions ****
   */
  const showDeleteConfirmation = (
    itemToDelete: Event | State | Action,
    state?: State,
    actionType?: 'immediate' | 'event',
  ) => {
    // * Stores details of the item to be deleted
    setDeleteConfirmation(true);
    setItemToDelete(itemToDelete);
    if (state) {
      setStateToModify(state);
    }
    if (actionType) {
      setActionTypeToModify(actionType);
    }
  };

  const closeDeleteConfirmation = () => {
    // * Closes the confirmation dialog and resets the state items
    setDeleteConfirmation(false);
    setItemToDelete(undefined);
    setStateToModify(undefined);
    setActionTypeToModify('');
  };

  return {
    menu,
    menuOptions,
    deleteConfirmation,
    itemToDelete,
    closeDeleteConfirmation,
    deleteItem,
    onPaneContextMenu,
    onNodeContextMenu,
    onEdgeContextMenu,
    onActionsHeaderContextMenu,
    onEventContextMenu,
    onActionContextMenu,
    closeContextMenu,
  };
};

export default useContextMenu;
