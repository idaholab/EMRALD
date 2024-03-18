import { Action, NewState } from '../types/Action';
import { appData } from '../types/Data';
import { Diagram } from '../types/Diagram';
import { LogicNode } from '../types/LogicNode';
import { State } from '../types/State';
import { Event } from '../types/Event';

interface EventAction {
  actions: string[];
  moveFromCurrent: boolean;
}

export const updateReferences = (
  itemData: appData,
  previousName: string,
  newName: string
): appData => {
  // Clone the original itemData to avoid mutating it directly
  const updatedItemData: appData = { ...itemData };

  // Function to update names within an array of strings
  const updateNamesInArray = (arr: string[] | undefined): string[] => {
    if (!arr) { return []; }
    return arr.map((name) => (name === previousName ? newName : name));
  };

  // Update names in DiagramList
  updatedItemData.DiagramList = itemData.DiagramList.map((diagram: Diagram) => {
    return {
      ...diagram,
      states: updateNamesInArray(diagram.states),
    };
  });

  // Update names in StateList
  updatedItemData.StateList = itemData.StateList.map((state: State) => {
    return {
      ...state,
      diagramName: state.diagramName === previousName ? newName : state.diagramName,
      immediateActions: updateNamesInArray(state.immediateActions),
      events: updateNamesInArray(state.events),
      eventActions: state.eventActions ? state.eventActions.map((eventAction: EventAction) => {
        return {
          ...eventAction,
          actions: updateNamesInArray(eventAction.actions),
        };
      }) : [],
    };
  });

  // Update names in ActionList
  updatedItemData.ActionList = itemData.ActionList.map((action: Action) => {
    return {
      ...action,
      newStates: action.newStates ? action.newStates.map((newState: NewState) => {
        return {
          ...newState,
          toState: newState.toState === previousName ? newName : newState.toState,
        };
      }) : [],
    };
  });

  // Update names in EventList
  updatedItemData.EventList = itemData.EventList.map((event: Event) => {
    return {
      ...event,
      triggerStates: event.triggerStates ? updateNamesInArray(event.triggerStates) : [],
    };
  });

  // Update names in LogicNodeList
  updatedItemData.LogicNodeList = itemData.LogicNodeList.map(
    (logicNode: LogicNode) => {
      return {
        ...logicNode,
        compChildren: updateNamesInArray(logicNode.compChildren),
        gateChildren: updateNamesInArray(logicNode.gateChildren),
      };
    }
  );

  // Return the updated itemData
  return updatedItemData;
}