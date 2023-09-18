import { Action } from "../types/Action";
import { appData } from "../types/Data";
import { Diagram } from "../types/Diagram";
import { Event } from "../types/Event";
import { LogicNode } from "../types/LogicNode";
import { State } from "../types/State";


// Function to get an item by its UUID
export const getItemByUUID = (
  itemData: appData | null,
  uuid: string
): Diagram | State | Action | Event | LogicNode | null => {
  if (!itemData) return null;

  const diagram = itemData.DiagramList.find((item) => item.id === uuid);
  if (diagram) return diagram;

  const state = itemData.StateList.find((item) => item.id === uuid);
  if (state) return state;

  const action = itemData.ActionList.find((item) => item.id === uuid);
  if (action) return action;

  const event = itemData.EventList.find((item) => item.id === uuid);
  if (event) return event;

  const logicNode = itemData.LogicNodeList.find((item) => item.id === uuid);
  if (logicNode) return logicNode;

  // Handle other item types as needed
  return null;
};

// Function to get the name of an item by its UUID
export const getNameByUUID = (itemData: appData | null, uuid: string): string | null => {
  if (!itemData) return null;

  const diagram = itemData.DiagramList.find(item => item.id === uuid);
  if (diagram) return diagram.name;

  const state = itemData.StateList.find(item => item.id === uuid);
  if (state) return state.name;

  const action = itemData.ActionList.find(item => item.id === uuid);
  if (action) return action.name;

  const event = itemData.EventList.find(item => item.id === uuid);
  if (event) return event.name;

  const logicNode = itemData.LogicNodeList.find(item => item.id === uuid);
  if (logicNode) return logicNode.name;

  // Handle other item types as needed
  return null;
};

// Function to get names from a list of UUIDs
export const getNamesFromUUIDList = (itemData: appData | null, uuidList: string[]): string[] => {
  const names: string[] = [];
  uuidList.forEach(uuid => {
    const name = getNameByUUID(itemData, uuid);
    if (name) names.push(name);
  });
  return names;
};