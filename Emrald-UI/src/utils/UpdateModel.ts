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
  clearedRefs?: ClearedRef[],
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

          // Record this scalar clear so the user can be told what's now broken.
          // (Cascade-deleted items get pruned out at the top-level wrapper.)
          if (clearedRefs) {
            let scalarParentPath = ref.slice(0, -1);
            let scalarParent = jsonpath.value(
              updatedEMRALDModel,
              scalarParentPath.join('.'),
            ) as ModelItem | undefined;
            while (
              scalarParent
              && scalarParent.id == null
              && scalarParentPath.length > 0
            ) {
              scalarParentPath = scalarParentPath.slice(0, -1);
              scalarParent = jsonpath.value(
                updatedEMRALDModel,
                scalarParentPath.join('.'),
              ) as ModelItem | undefined;
            }
            if (scalarParent?.id != null) {
              clearedRefs.push({
                itemId: scalarParent.id,
                itemName: scalarParent.name,
                itemType: scalarParent.objType,
                fieldPath: String(lastSeg),
              });
            }
          }
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
      DeleteItemAndRefsInSpecifiedModel(
        item,
        updatedEMRALDModel,
        false,
        clearedRefs,
      );
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
  clearedRefs?: ClearedRef[],
) {
  const updatedEMRALDModel = structuredClone(appData.value);
  DeleteItemAndRefsInSpecifiedModel(
    item,
    updatedEMRALDModel,
    false,
    clearedRefs,
  );
  // Prune at the top-level wrapper only — recursive cascade calls share the same
  // accumulator, and we want to drop entries pointing at items that ended up deleted.
  if (clearedRefs) {
    pruneClearedRefs(updatedEMRALDModel, clearedRefs);
  }

  return updatedEMRALDModel;
}

/**
 * Describes a single item that had a scalar reference field cleared to ''.
 * Array-element references that were spliced are NOT reported here — they just disappear
 * cleanly. Only scalar clears leave an item in a potentially-broken state the user may
 * want to fix manually.
 *
 * `itemId` is kept so callers can prune entries that point at items which were themselves
 * deleted later in the cascade (the user only cares about items still in the final model).
 */
export interface ClearedRef {
  itemId: string;
  itemName: string;
  itemType: MainItemType;
  fieldPath: string;
}

/**
 * Returns the list-on-the-model for a given item type, or undefined if the type isn't list-backed.
 */
function getListForType(
  model: EMRALD_Model,
  type: MainItemType,
): ModelItem[] | undefined {
  switch (type) {
    case 'Diagram': {
      return model.DiagramList;
    }
    case 'State': {
      return model.StateList;
    }
    case 'Action': {
      return model.ActionList;
    }
    case 'Event': {
      return model.EventList;
    }
    case 'ExtSim': {
      return model.ExtSimList;
    }
    case 'Variable': {
      return model.VariableList;
    }
    case 'LogicNode': {
      return model.LogicNodeList;
    }
    default: {
      return undefined;
    }
  }
}

/**
 * Removes ClearedRef entries whose target item is no longer in the final model — those
 * items were cascade-deleted, so a "broken reference" warning would be misleading.
 * Mutates `clearedRefs` in place so callers that hold the same array see the pruned list.
 */
function pruneClearedRefs(
  finalModel: EMRALD_Model,
  clearedRefs: ClearedRef[],
): void {
  const surviving = clearedRefs.filter(ref => {
    const list = getListForType(finalModel, ref.itemType);
    return list?.some(it => it.id === ref.itemId) ?? false;
  });
  clearedRefs.length = 0;
  clearedRefs.push(...surviving);
}

/**
 * Builds a one-line user-facing warning describing every item that ended up with an
 * empty reference field after the delete. Returns null when there's nothing to warn about.
 */
export function formatClearedRefsMessage(
  deletedItemType: MainItemType,
  deletedItemName: string,
  clearedRefs: ClearedRef[],
): string | null {
  if (clearedRefs.length === 0) {
    return null;
  }
  const detail = clearedRefs
    .map(r => `${r.itemType} "${r.itemName}" (${r.fieldPath})`)
    .join(', ');
  return `Deleted ${deletedItemType} "${deletedItemName}". The following items now have an empty reference and may need to be fixed: ${detail}.`;
}

/**
 * Clears incoming references to `item` from `model`, but only for reference-table rows whose
 * target type is NOT in `skipTargetTypes`. Use this when some reference categories are managed
 * by custom logic (e.g. LogicNode → LogicNode gateChildren are owned by the recursive cascade
 * in useLogicTreeDiagram) and the remaining reference categories should still be cleared
 * through the central reference table.
 *
 * Returns the (possibly cloned) model along with a list of items whose scalar reference field
 * was cleared to '' — these are the ones a caller may want to surface to the user as
 * "now-broken, needs fixing".
 */
export function ClearIncomingRefsExceptTypes(
  item:
    | Diagram
    | State
    | Action
    | Event
    | Variable
    | LogicNode
    | ExtSim,
  skipTargetTypes: MainItemType[],
  model: EMRALD_Model,
  useCopy = true,
): { model: EMRALD_Model; clearedRefs: ClearedRef[] } {
  const updated = useCopy ? structuredClone(model) : model;
  const skip = new Set<MainItemType>(skipTargetTypes);
  const clearedRefs: ClearedRef[] = [];

  for (const jsonPathSet of GetJSONPathUsingRefs(
    item.objType as MainItemType,
    item.name,
  )) {
    const targetType = jsonPathSet[1] as MainItemType;
    if (skip.has(targetType)) {
      continue;
    }
    // Skip the self-reference row (path resolves to the item itself, which the caller
    // is responsible for removing from its own list).
    if (targetType === item.objType) {
      continue;
    }

    const refPaths = jsonpath.paths(updated, jsonPathSet[0] as string);
    for (let i = refPaths.length - 1; i >= 0; i--) {
      const ref = refPaths[i];
      if (!ref) {
        continue;
      }
      const lastSeg = ref.at(-1);
      if (typeof lastSeg === 'number') {
        // Array-element ref — splice it out, no user notification needed.
        const parentArr = jsonpath.value(
          updated,
          ref.slice(0, -1).join('.'),
        ) as unknown[];
        if (Array.isArray(parentArr)) {
          parentArr.splice(lastSeg, 1);
        }
      } else {
        // Scalar field — clearing to '' may leave the owning item partially-valid;
        // walk up to the nearest item with an id so the user can be told what to fix.
        jsonpath.value(updated, ref.join('.'), '');

        let parentPath = ref.slice(0, -1);
        let parent = jsonpath.value(
          updated,
          parentPath.join('.'),
        ) as ModelItem | undefined;
        while (parent && parent.id == null && parentPath.length > 0) {
          parentPath = parentPath.slice(0, -1);
          parent = jsonpath.value(
            updated,
            parentPath.join('.'),
          ) as ModelItem | undefined;
        }
        if (parent?.id != null) {
          clearedRefs.push({
            itemId: parent.id,
            itemName: parent.name,
            itemType: parent.objType,
            fieldPath: String(lastSeg),
          });
        }
      }
    }
  }

  return { model: updated, clearedRefs };
}
