import { EMRALD_Model } from '../types/EMRALD_Model.ts';
import jsonpath from 'jsonpath';
import { MainItemType, MainItemTypes } from '../types/ItemTypes.ts';
import {
  AdjustJsonPathRef,
  allMainItemTypes,
  GetModelItemsReferencing,
  MainItemTypeSet,
  ItemReferencesArray,
  GetJSONPathInRefs,
  GetJSONPathUsingRefs,
} from './ModelReferences.ts';
import { appData } from '../hooks/useAppData';
import { Diagram } from '../types/Diagram.ts';
import { State } from '../types/State.ts';
import { Action } from '../types/Action.ts';
import { Event } from '../types/Event.ts';
import { Variable } from '../types/Variable.ts';
import { LogicNode } from '../types/LogicNode.ts';
import { ExtSim } from '../types/ExtSim.ts';

export const updateSpecifiedModel = async (
  //Update the provided EMRALD model with all the item changed in the model provided and references if the name changes
  item: Diagram | State | Action | Event | Variable | LogicNode | ExtSim | EMRALD_Model, //It is assumed the the EMRALD item passed in has already been udpated with all the object changes
  itemType: MainItemTypes, //This is the type of the object that was updated
  model: EMRALD_Model, //model to update
  useCopy: boolean, //true - make a copy of the model and return the copy. false - Modify the passed in model directly
): Promise<EMRALD_Model> => {
  let updatedEMRALDModel: EMRALD_Model;
  if (useCopy) updatedEMRALDModel = JSON.parse(JSON.stringify(model));
  else updatedEMRALDModel = model;

  var itemArray: any[];
  var itemIdx = -1;

  switch (itemType) {
    case MainItemTypes.Diagram:
      itemArray = updatedEMRALDModel.DiagramList;
      break;
    case MainItemTypes.State:
      itemArray = updatedEMRALDModel.StateList;
      break;
    case MainItemTypes.Action:
      itemArray = updatedEMRALDModel.ActionList;
      break;
    case MainItemTypes.Event:
      itemArray = updatedEMRALDModel.EventList;
      break;
    case MainItemTypes.ExtSim:
      itemArray = updatedEMRALDModel.ExtSimList;
      break;
    case MainItemTypes.Variable:
      itemArray = updatedEMRALDModel.VariableList;
      break;
    case MainItemTypes.LogicNode:
      itemArray = updatedEMRALDModel.LogicNodeList;
      break;
    case MainItemTypes.EMRALD_Model:
      updatedEMRALDModel.templates =
        updatedEMRALDModel.templates !== undefined ? updatedEMRALDModel.templates : [];
      itemArray = updatedEMRALDModel.templates;
      break;
    default:
      //error not a valid type
      console.log('Error: Invalid type for updateModelAndReferences');
      return updatedEMRALDModel;
      break;
  }

  //find the index of the item in the array
  itemIdx = itemArray.findIndex((itemInArray) => itemInArray.id === item.id);
  if (itemIdx < 0) {
    itemArray.push(item);
    // Resolve with the updated model
    return updatedEMRALDModel;
  }
  var previousName: string = itemArray[itemIdx].name; //old name of the item

  //update the item with the new item data
  itemArray[itemIdx] = item;

  if (item.name !== previousName) {
    //name change so update all the references as well
    var jsonPathRefArray: ItemReferencesArray = GetJSONPathUsingRefs(itemType, previousName);

    jsonPathRefArray.forEach((jsonPathSet) => {
      const jPath = jsonPathSet[0];
      jsonpath.paths(updatedEMRALDModel, jPath).forEach((ref: any) => {
        const path = ref.join('.');
        jsonpath.value(updatedEMRALDModel, path, item.name);
      });
    });
  }

  return updatedEMRALDModel;
};

export const updateModelAndReferences = async (
  //Update the main appData EMRALD model with all the item changed in the model provided and references if the name changes
  item: Diagram | State | Action | Event | Variable | LogicNode | ExtSim | EMRALD_Model, //It is assumed the the EMRALD item passed in has already been udpated with all the object changes
  itemType: MainItemTypes, //This is the type of the object that was updated
): Promise<EMRALD_Model> => {
  const updatedEMRALDModel: EMRALD_Model = JSON.parse(JSON.stringify(appData.value));
  updateSpecifiedModel(item, itemType, updatedEMRALDModel, false);

  return updatedEMRALDModel;
};

export const DeleteItemAndRefsInSpecifiedModel = async (
  //remove the item and references to it from the provided EMRALD model
  item: Diagram | State | Action | Event | Variable | LogicNode | ExtSim | EMRALD_Model, //It is assumed the the EMRALD item passed in has already been udpated with all the object changes
  model: EMRALD_Model, //model to update
  useCopy: boolean, //true - make a copy of the model and return the copy. false - Modify the passed in model directly
): Promise<EMRALD_Model> => {
  //get all the items that this item uses and save them off as usedByItItems
  //get all the items that reference this item as usesItItems.
  //remove any references to this item
  //depending on the type go through all usedByItItems and usesItItems and determine if they need to be deleted also.
  //Diagrams (Delete)
  //States - all
  //States (Delete)
  //Actions- if not referenced by other events/diagrams, Events- if not referenced by other diagrams
  //Events (Delete)
  //Delete actions if not referenced by another event.

  let updatedEMRALDModel: EMRALD_Model;
  if (useCopy) updatedEMRALDModel = JSON.parse(JSON.stringify(model));
  else updatedEMRALDModel = model;

  let itemArray: any[];
  let itemIdx = -1;
  let referencingTheToDel_Types: MainItemTypeSet; //types that may need deleted because they are referencing this item
  let referencedByTheToDel_Types: MainItemTypeSet; //types that may need deleted because they are referenced by this item

  switch (item.objType) {
    case MainItemTypes.Diagram:
      itemArray = updatedEMRALDModel.DiagramList;
      referencedByTheToDel_Types = new Set<MainItemType>([MainItemTypes.State]);
      referencingTheToDel_Types = new Set<MainItemType>([]);
      break;
    case MainItemTypes.State:
      itemArray = updatedEMRALDModel.StateList;
      referencedByTheToDel_Types = new Set<MainItemType>([
        MainItemTypes.Action,
        MainItemTypes.Event,
      ]);
      referencingTheToDel_Types = new Set<MainItemType>([]);
      break;
    case MainItemTypes.Action:
      itemArray = updatedEMRALDModel.ActionList;
      referencedByTheToDel_Types = new Set<MainItemType>([]);
      referencingTheToDel_Types = new Set<MainItemType>([]);
      break;
    case MainItemTypes.Event:
      itemArray = updatedEMRALDModel.EventList;
      referencedByTheToDel_Types = new Set<MainItemType>([MainItemTypes.Action]);
      referencingTheToDel_Types = new Set<MainItemType>([]);
      break;
    case MainItemTypes.ExtSim:
      itemArray = updatedEMRALDModel.ExtSimList;
      referencedByTheToDel_Types = new Set<MainItemType>([]);
      referencingTheToDel_Types = new Set<MainItemType>([]);
      break;
    case MainItemTypes.Variable:
      itemArray = updatedEMRALDModel.VariableList;
      referencedByTheToDel_Types = new Set<MainItemType>([]);
      referencingTheToDel_Types = new Set<MainItemType>([]);
      break;
    case MainItemTypes.LogicNode:
      itemArray = updatedEMRALDModel.LogicNodeList;
      referencedByTheToDel_Types = new Set<MainItemType>([]);
      referencingTheToDel_Types = new Set<MainItemType>([]);
      break;
    default:
      //error not a valid type
      console.log('Error: Invalid type for updateModelAndReferences');
      return updatedEMRALDModel;
  }

  //find the index of the item in the array
  itemIdx = itemArray.findIndex((itemInArray) => itemInArray.id === item.id);
  if (itemIdx < 0) {
    return updatedEMRALDModel;
  }

  //Items that may need deleted.
  let refPossibleDelete: Array<[string, MainItemTypes]> = [];

  //get all the items that reference this item, remove references and save items that may need deleted
  var jsonPathUsesRefArray: ItemReferencesArray = GetJSONPathUsingRefs(
    item.objType as MainItemTypes,
    item.name,
  );
  jsonPathUsesRefArray.forEach((jsonPathSet) => {
    const jPath = jsonPathSet[0];
    jsonpath.paths(updatedEMRALDModel, jPath).forEach((ref: any) => {
      //if there are possible types to delete get all the items that may need to be deleted because they reference this item being deleted
      if (referencingTheToDel_Types.size > 0) {
        let parentPath = [...ref].slice(0, -1);
        let parent = jsonpath.value(appData.value, parentPath.join('.'));
        while (parent.id == null && parentPath.length > 0) {
          parentPath = parentPath.slice(0, -1);
          parent = jsonpath.value(appData.value, parentPath.join('.'));
        }
        if (parent.id != null && referencingTheToDel_Types.has(parent.objType)) {
          const exists = refPossibleDelete.some(
            ([item, type]) => item === parent.name && type === parent.objType,
          );

          if (!exists) {
            refPossibleDelete.push([parent.name, parent.objType]);
          }
        }
      }

      // Clear the reference value at that path if it isn't the item we are deleting
      if (item.objType != jsonPathSet[1] || jsonPathSet[1] == MainItemTypes.LogicNode) {
        const path = ref.join('.');
        jsonpath.value(updatedEMRALDModel, path, '');

        if (jsonPathSet[2] != null) {
          //remove linked item data if it exists
          const linkedItemPath = AdjustJsonPathRef(ref, jsonPathSet[2] || []);

          //if the last item is a number then remove the array item
          const lastItem = linkedItemPath[linkedItemPath.length - 1];
          if (typeof lastItem === 'number') {
            linkedItemPath.pop();
            const newArray = jsonpath.value(updatedEMRALDModel, linkedItemPath.join('.'));
            //remove array item
            newArray.splice(lastItem, 1);
            jsonpath.value(updatedEMRALDModel, linkedItemPath.join('.'), newArray);
          } else {
            //remove everything
            jsonpath.value(updatedEMRALDModel, linkedItemPath.join('.'), '');
          }
        }
      }
    });
  });

  //if there are possible types to delete get all the items that may need to be deleted because they are referenced by this item being delete
  if (referencedByTheToDel_Types.size > 0) {
    //Get all the items that this item references.
    let jsonPathRefArray: ItemReferencesArray = GetJSONPathInRefs(
      item.objType as MainItemTypes,
      item.name,
    );

    jsonPathRefArray.forEach((jsonPathSet) => {
      if (referencedByTheToDel_Types.has(jsonPathSet[1])) {
        jsonpath.paths(appData.value, jsonPathSet[0]).forEach((jPath: any) => {
          let childNames = jsonpath.value(appData.value, jPath.join('.'));
          //make sure it is an array
          childNames = Array.isArray(childNames) ? childNames : [childNames];
          childNames.forEach((childName: any) => {
            if (childName != null) {
              const exists = refPossibleDelete.some(
                ([item, type]) => item === childName && type === jsonPathSet[1],
              );

              if (!exists) {
                refPossibleDelete.push([childName, jsonPathSet[1]]);
              }
            }
          });
        });
      }
    });
  }

  //remove the item from the model.
  itemArray.splice(itemIdx, 1);

  //delete other items that may need to be deleted
  refPossibleDelete.forEach((delNameAndType) => {
    let item: State | Event | Action | LogicNode | undefined;
    switch (delNameAndType[1]) {
      case MainItemTypes.State:
        item = updatedEMRALDModel.StateList.find((item) => item.name === delNameAndType[0]);
        //allways delete states if here because it was from a diagram that was deleted
        break;
      case MainItemTypes.Event:
        item = updatedEMRALDModel.EventList.find((item) => item.name === delNameAndType[0]);
        //see if should be deleted
        if (item && item.mainItem == false) {
          let refs = GetModelItemsReferencing(
            item.name,
            item.objType as MainItemTypes,
            1,
            undefined,
            allMainItemTypes,
            updatedEMRALDModel,
          );
          if (refs.StateList.length != 0) {
            //used by other states so don't delete
            item = undefined;
          }
        }
        break;
      case MainItemTypes.Action:
        item = updatedEMRALDModel.ActionList.find((item) => item.name === delNameAndType[0]);
        //see if item should be delted
        if (item && item.mainItem == false) {
          let refs = GetModelItemsReferencing(
            item.name,
            item.objType as MainItemTypes,
            1,
            undefined,
            allMainItemTypes,
            updatedEMRALDModel,
          );
          if (refs.StateList.length != 0 || refs.EventList.length != 0) {
            //used by other states or events, so don't delete
            item = undefined;
          }
        }
        break;
    }

    if (item) {
      DeleteItemAndRefsInSpecifiedModel(item, updatedEMRALDModel, false);
    }
  });

  return updatedEMRALDModel;
};

// export const DeleteItemAndRefsInSpecifiedModel = ( //remove the item and references to it from the provided EMRALD model
//     item: Diagram | State | Action | Event | Variable | LogicNode | ExtSim | EMRALD_Model, //It is assumed the the EMRALD item passed in has already been udpated with all the object changes
//     model: EMRALD_Model, //model to update
//     useCopy: boolean //true - make a copy of the model and return the copy. false - Modify the passed in model directly
// ): Promise<EMRALD_Model> => {
//     return new Promise((resolve) => {

//         let updatedEMRALDModel: EMRALD_Model;
//         if (useCopy)
//             updatedEMRALDModel = JSON.parse(JSON.stringify(model));
//         else
//             updatedEMRALDModel = model;

//         var itemArray: any[];
//         var itemIdx = -1;

//         switch (item.objType) {
//             case MainItemTypes.Diagram:
//                 itemArray = updatedEMRALDModel.DiagramList;
//                 break;
//             case MainItemTypes.State:
//                 itemArray = updatedEMRALDModel.StateList;
//                 break;
//             case MainItemTypes.Action:
//                 itemArray = updatedEMRALDModel.ActionList;
//                 break;
//             case MainItemTypes.Event:
//                 itemArray = updatedEMRALDModel.EventList;
//                 break;
//             case MainItemTypes.ExtSim:
//                 itemArray = updatedEMRALDModel.ExtSimList;
//                 break;
//             case MainItemTypes.Variable:
//                 itemArray = updatedEMRALDModel.VariableList;
//                 break;
//             case MainItemTypes.LogicNode:
//                 itemArray = updatedEMRALDModel.LogicNodeList;
//                 break;
//             case MainItemTypes.EMRALD_Model:
//                 updatedEMRALDModel.templates = updatedEMRALDModel.templates !== undefined ? updatedEMRALDModel.templates : [];
//                 itemArray = updatedEMRALDModel.templates;
//                 break;
//             default:
//                 //error not a valid type
//                 console.log("Error: Invalid type for updateModelAndReferences");
//                 return updatedEMRALDModel;
//                 break;
//         }

//         //find the index of the item in the array
//         itemIdx = itemArray.findIndex(itemInArray => itemInArray.id === item.id);
//         if (itemIdx < 0) {
//             itemArray.push(item)
//             // Resolve with the updated model
//             resolve(updatedEMRALDModel);
//             return;
//         }
//         var previousName: string = itemArray[itemIdx].name; //old name of the item

//         const mainItemTypesEnumValue = MainItemTypes[item.objType as keyof typeof MainItemTypes];

//         // Find the paths of the items to be removed
//         let jsonPathRefArray : DiagramRefsArray = GetJSONPathInRefs(mainItemTypesEnumValue, previousName);

//         jsonPathRefArray.forEach((ref: any) => {
//             // Find the parent array
//             const itemPath = ref[0];
//             const itemArray = jsonpath.value(updatedEMRALDModel, itemPath); //! this line breaks

//             if (Array.isArray(itemArray)) {
//                 const arrayIndex = itemArray.indexOf(previousName);
//                 // Remove the item from the array
//                 itemArray.splice(arrayIndex, 1);
//             }

//             if (ref[2] != null) //remove linked array data if it exists
//             {
//                 const parentPath = ref.slice(0, -2).join('.'); // Path to the parent array
//                 const parentIndex = ref[ref.length - 2];
//                 const parentObject = jsonpath.value(updatedEMRALDModel, parentPath);
//                 if (parentObject[parentIndex] && parentObject[parentIndex][ref[2]]) {
//                     //remove item
//                     parentObject[parentIndex][ref[2]].splice(arrayIndex, 1);
//                 };
//             }
//         });

//         resolve(updatedEMRALDModel);
//     })
// }

//TODO call DeleteItemAndRefsInSpecifiedModel from the main delete and pass in the appData.value
//const updatedEMRALDModel: EMRALD_Model = JSON.parse(JSON.stringify(appData.value));
//DeleteItemAndRefsInSpecifiedModel(item, updatedEMRALDModel, false);

export const DeleteItemAndRefs = async (
  //Update the main appData EMRALD model with all the item changed in the model provided and references if the name changes
  item: Diagram | State | Action | Event | Variable | LogicNode | ExtSim | EMRALD_Model, //It is assumed the the EMRALD item passed in has already been udpated with all the object changes
): Promise<EMRALD_Model> => {
  const updatedEMRALDModel: EMRALD_Model = JSON.parse(JSON.stringify(appData.value));
  DeleteItemAndRefsInSpecifiedModel(item, updatedEMRALDModel, false);

  return updatedEMRALDModel;
};
