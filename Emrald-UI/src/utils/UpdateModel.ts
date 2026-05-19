import type {
  Action,
  Diagram,
  EMRALD_Model,
  Event,
  ExtSim,
  LogicNode,
  Main_Model,
  MainItemType,
  State,
  Variable,
} from '../types/EMRALD_Model';
import type { ModelItem } from '../types/ModelUtils';
import jsonpath from 'jsonpath';
import { appData } from '../hooks/useAppData';
import {
  AdjustJsonPathRef,
  allMainItemTypes,
  GetJSONPathInRefs,
  GetJSONPathUsingRefs,
  GetModelItemsReferencing,
  type MainItemTypeSet,
} from './ModelReferences';

/**
 * Update the provided EMRALD model with all the item changed in the model provided and references if the name changes
 * @param item - It is assumed the the EMRALD item passed in has already been udpated with all the object changes
 * @param itemType - the type of the object that was updated
 * @param model - model to update
 * @param useCopy - true - make a copy of the model and return the copy. false - Modify the passed in model directly
 * @returns The updated model.
 */
export function updateSpecifiedModel(
  item:
    | Diagram
    | State
    | Action
    | Event
    | Variable
    | LogicNode
    | ExtSim
    | EMRALD_Model,
  itemType: MainItemType,
  model: EMRALD_Model,
  useCopy: boolean,
) {
  const updatedEMRALDModel = useCopy ? structuredClone(model) : model;

  let itemArray: (ModelItem | Main_Model)[];
  let itemIdx = -1;

  switch (itemType) {
    case 'Diagram': {
      itemArray = updatedEMRALDModel.DiagramList;
      break;
    }
    case 'State': {
      itemArray = updatedEMRALDModel.StateList;
      break;
    }
    case 'Action': {
      itemArray = updatedEMRALDModel.ActionList;
      break;
    }
    case 'Event': {
      itemArray = updatedEMRALDModel.EventList;
      break;
    }
    case 'ExtSim': {
      itemArray = updatedEMRALDModel.ExtSimList;
      break;
    }
    case 'Variable': {
      itemArray = updatedEMRALDModel.VariableList;
      break;
    }
    case 'LogicNode': {
      itemArray = updatedEMRALDModel.LogicNodeList;
      break;
    }
    case 'EMRALD_Model': {
      updatedEMRALDModel.templates = updatedEMRALDModel.templates ?? [];
      itemArray = updatedEMRALDModel.templates;
      break;
    }
    default: {
      // error not a valid type
      console.log('Error: Invalid type for updateModelAndReferences');
      return updatedEMRALDModel;
    }
  }

  // find the index of the item in the array
  itemIdx = itemArray.findIndex(itemInArray => itemInArray.id === item.id);
  if (itemIdx < 0) {
    itemArray.push(item);
    // Resolve with the updated model
    return updatedEMRALDModel;
  }
  const previousName = itemArray[itemIdx]?.name; // old name of the item

  // update the item with the new item data
  itemArray[itemIdx] = item;

  if (item.name !== previousName) {
    // name change so update all the references as well
    for (const jsonPathSet of GetJSONPathUsingRefs(itemType, previousName)) {
      for (const ref of jsonpath.paths(updatedEMRALDModel, jsonPathSet[0] as string)) {
        jsonpath.value(updatedEMRALDModel, ref.join('.'), item.name);
      }
    }
  }

  return updatedEMRALDModel;
}

/**
 * Update the main appData EMRALD model with all the item changed in the model provided and references if the name changes
 * @param item - It is assumed the the EMRALD item passed in has already been udpated with all the object changes
 * @param itemType - This is the type of the object that was updated
 * @returns The updated model.
 */
export function updateModelAndReferences(
  item:
    | Diagram
    | State
    | Action
    | Event
    | Variable
    | LogicNode
    | ExtSim
    | EMRALD_Model,
  itemType: MainItemType,
) {
  const updatedEMRALDModel = structuredClone(appData.value);
  updateSpecifiedModel(item, itemType, updatedEMRALDModel, false);

  return updatedEMRALDModel;
}

/**
 * Remove the item and references to it from the provided EMRALD model
 * @param item - It is assumed the the EMRALD item passed in has already been udpated with all the object changes
 * @param model - model to update
 * @param useCopy - true - make a copy of the model and return the copy. false - Modify the passed in model directly
 * @returns The updated model.
 */
export function DeleteItemAndRefsInSpecifiedModel(
  //
  item:
    | Diagram
    | State
    | Action
    | Event
    | Variable
    | LogicNode
    | ExtSim
    | EMRALD_Model,
  model: EMRALD_Model,
  useCopy: boolean,
) {
  // get all the items that this item uses and save them off as usedByItItems
  // get all the items that reference this item as usesItItems.
  // remove any references to this item
  // depending on the type go through all usedByItItems and usesItItems and determine if they need to be deleted also.
  // Diagrams (Delete)
  // States - all
  // States (Delete)
  // Actions- if not referenced by other events/diagrams, Events- if not referenced by other diagrams
  // Events (Delete)
  // Delete actions if not referenced by another event.

  const updatedEMRALDModel = useCopy ? structuredClone(model) : model;

  let itemArray: ModelItem[];
  let itemIdx = -1;
  let referencingTheToDel_Types: MainItemTypeSet; // types that may need deleted because they are referencing this item
  let referencedByTheToDel_Types: MainItemTypeSet; // types that may need deleted because they are referenced by this item

  switch (item.objType) {
    case 'Diagram': {
      itemArray = updatedEMRALDModel.DiagramList;
      referencedByTheToDel_Types = new Set<MainItemType>(['State']);
      referencingTheToDel_Types = new Set<MainItemType>();
      break;
    }
    case 'State': {
      itemArray = updatedEMRALDModel.StateList;
      referencedByTheToDel_Types = new Set<MainItemType>(['Action', 'Event']);
      referencingTheToDel_Types = new Set<MainItemType>();
      break;
    }
    case 'Action': {
      itemArray = updatedEMRALDModel.ActionList;
      referencedByTheToDel_Types = new Set<MainItemType>();
      referencingTheToDel_Types = new Set<MainItemType>();
      break;
    }
    case 'Event': {
      itemArray = updatedEMRALDModel.EventList;
      referencedByTheToDel_Types = new Set<MainItemType>(['Action']);
      referencingTheToDel_Types = new Set<MainItemType>();
      break;
    }
    case 'ExtSim': {
      itemArray = updatedEMRALDModel.ExtSimList;
      referencedByTheToDel_Types = new Set<MainItemType>();
      referencingTheToDel_Types = new Set<MainItemType>();
      break;
    }
    case 'Variable': {
      itemArray = updatedEMRALDModel.VariableList;
      referencedByTheToDel_Types = new Set<MainItemType>();
      referencingTheToDel_Types = new Set<MainItemType>();
      break;
    }
    case 'LogicNode': {
      itemArray = updatedEMRALDModel.LogicNodeList;
      referencedByTheToDel_Types = new Set<MainItemType>();
      referencingTheToDel_Types = new Set<MainItemType>();
      break;
    }
    default: {
      // error not a valid type
      console.log('Error: Invalid type for updateModelAndReferences');
      return updatedEMRALDModel;
    }
  }

  // find the index of the item in the array
  itemIdx = itemArray.findIndex(itemInArray => itemInArray.id === item.id);
  if (itemIdx < 0) {
    return updatedEMRALDModel;
  }

  // Items that may need deleted.
  const refPossibleDelete: [string, MainItemType][] = [];

  // get all the items that reference this item, remove references and save items that may need deleted
  for (const jsonPathSet of GetJSONPathUsingRefs(
    item.objType as MainItemType,
    item.name,
  )) {
    // Iterate paths in reverse so splicing earlier indices doesn't invalidate later ones
    // when the same parent array has multiple matching entries.
    const refPaths = jsonpath.paths(updatedEMRALDModel, jsonPathSet[0] as string);
    for (let i = refPaths.length - 1; i >= 0; i--) {
      const ref = refPaths[i];
      if (!ref) {
        continue;
      }
      // if there are possible types to delete get all the items that may need to be deleted because they reference this item being deleted
      if (referencingTheToDel_Types.size > 0) {
        let parentPath = [...ref].slice(0, -1);
        let parent = jsonpath.value(
          appData.value,
          parentPath.join('.'),
        ) as ModelItem;
        while (parent.id == null && parentPath.length > 0) {
          parentPath = parentPath.slice(0, -1);
          parent = jsonpath.value(
            appData.value,
            parentPath.join('.'),
          ) as ModelItem;
        }
        if (
          parent.id != null
          && referencingTheToDel_Types.has(parent.objType)
          && !refPossibleDelete.some(
            ([item, type]) => item === parent.name && type === parent.objType,
          )
        ) {
          refPossibleDelete.push([parent.name, parent.objType]);
        }
      }

      // Clear the reference value at that path if it isn't the item we are deleting
      if (item.objType != jsonPathSet[1] || jsonPathSet[1] == 'LogicNode') {
        const lastSeg = ref.at(-1);
        if (typeof lastSeg === 'number') {
          // Reference is an array element — splice it out rather than leaving a blank slot or stringifying an object.
          const parentArr = jsonpath.value(
            updatedEMRALDModel,
            ref.slice(0, -1).join('.'),
          ) as unknown[];
          if (Array.isArray(parentArr)) {
            parentArr.splice(lastSeg, 1);
          }
        } else {
          jsonpath.value(updatedEMRALDModel, ref.join('.'), '');
        }

        if (jsonPathSet[2] != null) {
          // remove linked item data if it exists
          const linkedItemPath = AdjustJsonPathRef(ref, jsonPathSet[2] as string[]);

          // if the last item is a number then remove the linked array entry at that index
          const lastItem = linkedItemPath.at(-1);
          if (typeof lastItem === 'number') {
            linkedItemPath.pop();
            const newArray = jsonpath.value(
              updatedEMRALDModel,
              linkedItemPath.join('.'),
            ) as ModelItem[];
            if (Array.isArray(newArray)) {
              newArray.splice(lastItem, 1);
            }
          } else {
            // remove everything
            jsonpath.value(updatedEMRALDModel, linkedItemPath.join('.'), '');
          }
        }
      }
    }
  }

  // if there are possible types to delete get all the items that may need to be deleted because they are referenced by this item being delete
  if (referencedByTheToDel_Types.size > 0) {
    // Get all the items that this item references.
    for (const jsonPathSet of GetJSONPathInRefs(
      item.objType as MainItemType,
      item.name,
    )) {
      if (referencedByTheToDel_Types.has(jsonPathSet[1] as MainItemType)) {
        for (const jPath of jsonpath.paths(appData.value, jsonPathSet[0] as string)) {
          let childNames = jsonpath.value(appData.value, jPath.join('.')) as (
            | string
            | null
          )[];
          // make sure it is an array
          childNames = Array.isArray(childNames) ? childNames : [childNames];
          for (const childName of childNames) {
            if (
              childName != null
              && !refPossibleDelete.some(
                ([item, type]) => item === childName && type === jsonPathSet[1],
              )
            ) {
              refPossibleDelete.push([childName, jsonPathSet[1] as MainItemType]);
            }
          }
        }
      }
    }
  }

  // remove the item from the model.
  itemArray.splice(itemIdx, 1);

  // delete other items that may need to be deleted
  for (const delNameAndType of refPossibleDelete) {
    let item: State | Event | Action | LogicNode | undefined;
    switch (delNameAndType[1]) {
      case 'State': {
        item = updatedEMRALDModel.StateList.find(
          item => item.name === delNameAndType[0],
        );
        // allways delete states if here because it was from a diagram that was deleted
        break;
      }
      case 'Event': {
        item = updatedEMRALDModel.EventList.find(
          item => item.name === delNameAndType[0],
        );
        // see if should be deleted
        if (
          item
          && !item.mainItem
          && GetModelItemsReferencing(
            item.name,
            item.objType as MainItemType,
            1,
            undefined,
            allMainItemTypes,
            updatedEMRALDModel,
          ).StateList.length > 0
        ) {
          // used by other states so don't delete
          item = undefined;
        }
        break;
      }
      case 'Action': {
        item = updatedEMRALDModel.ActionList.find(
          item => item.name === delNameAndType[0],
        );
        // see if item should be delted
        if (item && !item.mainItem) {
          const refs = GetModelItemsReferencing(
            item.name,
            item.objType as MainItemType,
            1,
            undefined,
            allMainItemTypes,
            updatedEMRALDModel,
          );
          if (refs.StateList.length > 0 || refs.EventList.length > 0) {
            // used by other states or events, so don't delete
            item = undefined;
          }
        }
        break;
      }
    }

    if (item) {
      DeleteItemAndRefsInSpecifiedModel(item, updatedEMRALDModel, false);
    }
  }

  return updatedEMRALDModel;
}

/**
 * Update the main appData EMRALD model with all the item changed in the model provided and references if the name changes
 * @param item - It is assumed the the EMRALD item passed in has already been udpated with all the object changes
 * @returns The updated model
 */
export function DeleteItemAndRefs(
  item:
    | Diagram
    | State
    | Action
    | Event
    | Variable
    | LogicNode
    | ExtSim
    | EMRALD_Model,
) {
  const updatedEMRALDModel = structuredClone(appData.value);
  DeleteItemAndRefsInSpecifiedModel(item, updatedEMRALDModel, false);

  return updatedEMRALDModel;
}
