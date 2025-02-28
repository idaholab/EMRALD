import { MainItemType, MainItemTypes } from '../types/ItemTypes.ts';
import jsonpath from 'jsonpath';
import { appData } from '../hooks/useAppData';
import { EMRALD_Model, CreateEmptyEMRALDModel} from '../types/EMRALD_Model.ts';
import { Diagram } from '../types/Diagram.ts';
import { State } from '../types/State.ts';
import { Action } from '../types/Action.ts';
import { Event } from '../types/Event.ts';
import { Variable } from '../types/Variable.ts';
import { LogicNode } from '../types/LogicNode.ts';
import { ExtSim } from '../types/ExtSim.ts';
import { forEach } from 'lodash';


export type ItemReferencesArray = Array<[string, MainItemTypes, string[] | null]>;
// Items referenced by the specified item [JsonPath, ItemType, Linked array if any]
    //First item in array is the JsonPath
    //Second item in array is the types returned and used for early stop of recursive search.
    //The 3rd array item is indicates if there is another array that is a logical match to this one so that if you are doing something like removing it you need to remove this reference as well. 
      //For example State.Events has State.eventActions that must have a 1to1 relationship, if null then this is a refference and can be removed.
      //This is a relative path to the item. Use '^' to indicate up a level, use . to indicate a child item (TODO if ever needed) use '[n]' to indicate a specific array item
      //example [".", "eventActions"] would move the to the eventActions item. 
      //example ["^", ".", "eventActions"] would move up one level and look at the eventActions array.
      //example ["^"] would just move up one level to the parent item.
//Diagrams (items the specified diagram uses)


/////
//Items referencing the specified item. "nameRef" needs to be replaced with the item name.
/////

//Diagrams (items using specified diagram)
const RefsToDiagramItem: ItemReferencesArray = [
  ["$.DiagramList[?(@.name == 'nameRef')].name", MainItemTypes.Diagram, null],
  ["$.StateList[?(@.diagramName == 'nameRef')].diagramName", MainItemTypes.State, null],
  ["$.LogicNodeList[*].compChildren[?(@.diagramName == 'nameRef')].diagramName", MainItemTypes.LogicNode, ["^"]]
];

//States (items using specified state)
const RefsToStateItem: ItemReferencesArray = [
  ["$.StateList[?(@.name == 'nameRef')].name", MainItemTypes.State, null],
  ["$.DiagramList[*].states[?(@ == 'nameRef')]", MainItemTypes.Diagram, null],
  ["$.ActionList[*].newStates[?(@.toState == 'nameRef')].toState", MainItemTypes.Action, null],
  ["$.EventList[*].triggerStates[?(@ == 'nameRef')]", MainItemTypes.Event, null],
  ["$.LogicNodeList[*].compChildren[*].stateValues[?(@.stateName == 'nameRef')].stateName", MainItemTypes.LogicNode, null],
  ["$.VariableList[*].accrualStatesData[?(@.stateName == 'nameRef')]", MainItemTypes.Variable, null]
];

//Events (items using specified event)
const RefsToEventItem: ItemReferencesArray = [
  ["$.EventList[?(@.name == 'nameRef')].name", MainItemTypes.Event, null],
  ["$.StateList[*].events[?(@ == 'nameRef')]", MainItemTypes.State, null]
];

//Actions (items using specified action)
const RefsToActionItem: ItemReferencesArray = [
  ["$.ActionList[?(@.name == 'nameRef')].name", MainItemTypes.Action, null],
  ["$.StateList[*].immediateActions[?(@ == 'nameRef')]", MainItemTypes.State, null],
  ["$.StateList[*].eventActions[*].actions[?(@ == 'nameRef')]", MainItemTypes.State, null]
];

//Variables (items using specified variable)
const RefsToVariableItem: ItemReferencesArray = [
  ["$.VariableList[?(@.name == 'nameRef')].name", MainItemTypes.Variable, null],
  ["$.ActionList[*].newStates[?(@.varProb == 'nameRef')].varProb", MainItemTypes.Action, null],
  ["$.ActionList[?(@.variableName == 'nameRef')].variableName", MainItemTypes.Action, null],
  ["$.ActionList[*].codeVariables[?(@ == 'nameRef')]", MainItemTypes.Action, null],
  ["$.EventList[*].varNames[?(@ == 'nameRef')]", MainItemTypes.Event, null],
  ["$.EventList[?(@.variable == 'nameRef')].variable", MainItemTypes.Event, null],
  ["$.EventList[*].parameters[?(@.variable == 'nameRef')].variable", MainItemTypes.Event, null]
];

//ExtSim (items using specified ExtSim)
const RefsToExtSimItem: ItemReferencesArray = [
  ["$.ExtSimList[?(@.name == 'nameRef')].name", MainItemTypes.ExtSim, null],
  ["$.ActionList[?(@.extSim == 'nameRef')].name", MainItemTypes.Action, null]
];

//LogicNodes (items using specified LogicNode)
const RefsToLogicNodeItem: ItemReferencesArray = [
  ["$.LogicNodeList[?(@.name == 'nameRef')].name", MainItemTypes.LogicNode, null],
  ["$.EventList[?(@.logicTop == 'nameRef')].logicTop", MainItemTypes.Event, null],
  ["$.LogicNodeList[*].gateChildren[?(@ == 'nameRef')]", MainItemTypes.LogicNode, null],
  ["$.LogicNodeList[?(@.rootName == 'nameRef')].rootName", MainItemTypes.LogicNode, null]
];



/////
//Items that are referenced by the specified item."nameRef" needs to be replaced with the item name.
/////

//Diagrams (items the specified diagram uses)
const InDiagramRefs: ItemReferencesArray = [
  ["$.DiagramList[?(@.name == 'nameRef')].states", MainItemTypes.State, null],
];

//States (items the specified state uses)
const InStateRefs: ItemReferencesArray = [
  ["$.StateList[?(@.name == 'nameRef')].diagramName", MainItemTypes.Diagram, null],
  ["$.StateList[?(@.name == 'nameRef')].events", MainItemTypes.Event, [".", "eventActions"]],
  ["$.StateList[?(@.name == 'nameRef')].immediateActions", MainItemTypes.Action, null],
  ["$.StateList[?(@.name == 'nameRef')].eventActions[*].actions", MainItemTypes.Action, null],
];

//Events (items the specified event uses)
const InEventRefs: ItemReferencesArray = [
  ["$.EventList[?(@.name == 'nameRef')].triggerStates", MainItemTypes.State, null],
  ["$.EventList[?(@.name == 'nameRef')].varNames", MainItemTypes.Variable, null],
  ["$.EventList[?(@.name == 'nameRef')].logicTop", MainItemTypes.LogicNode, null],
  ["$.EventList[?(@.name == 'nameRef')].triggerStates", MainItemTypes.State, null],
  ["$.EventList[?(@.name == 'nameRef')].variable", MainItemTypes.Variable, null],
  ["$.EventList[?(@.name == 'nameRef')].parameters[*].variable", MainItemTypes.Variable, null],
];

//Actions (items the specified action uses)
const InActionRefs: ItemReferencesArray = [
  ["$.ActionList[?(@.name == 'nameRef')].newStates.toState", MainItemTypes.State, null],
  ["$.ActionList[?(@.name == 'nameRef')].variableName", MainItemTypes.Variable, null],
  ["$.ActionList[?(@.name == 'nameRef')].codeVariables", MainItemTypes.Variable, null],
  ["$.ActionList[?(@.name == 'nameRef')].extSim", MainItemTypes.ExtSim, null],
];

//Variables (items the specified variable uses)
const InVariableRefs: ItemReferencesArray = [
  ["$.VariableList[?(@.name == 'nameRef')].accrualStatesData[*].stateName", MainItemTypes.State, null]
];

//ExtSim (items the specified extSim uses)
const InExtSimRefs: ItemReferencesArray = [ 
];

//LogicNodes (items the specified logicNode uses)
const InLogicNodeRefs: ItemReferencesArray = [
  ["$.LogicNodeList[?(@.name == 'nameRef')].compChildren[*].diagramName", MainItemTypes.Diagram, null],
  ["$.LogicNodeList[?(@.name == 'nameRef')].compChildren[*].stateValues[*].stateName", MainItemTypes.State, null],
  ["$.LogicNodeList[?(@.name == 'nameRef')].gateChildren", MainItemTypes.LogicNode, null],
];

export type MainItemTypeSet = Set<MainItemType>;
export const allMainItemTypes: MainItemTypeSet = new Set<MainItemType>([
  MainItemTypes.Diagram,
  MainItemTypes.State,
  MainItemTypes.Action,
  MainItemTypes.Event,
  MainItemTypes.ExtSim,
  MainItemTypes.LogicNode,
  MainItemTypes.Variable,
  MainItemTypes.EMRALD_Model
]);

export const GetJSONPathUsingRefs = (itemType: MainItemTypes, lookupName : string): ItemReferencesArray => {
  var retArray : ItemReferencesArray;
  switch (itemType) {
    case MainItemTypes.Diagram:
      retArray = RefsToDiagramItem;
      break;
    case MainItemTypes.State:
      retArray =  RefsToStateItem;
      break;
    case MainItemTypes.Action:
      retArray =  RefsToActionItem;
      break;
    case MainItemTypes.Event:
      retArray =  RefsToEventItem;
      break;
    case MainItemTypes.ExtSim:
      retArray =  RefsToExtSimItem;
      break;
    case MainItemTypes.Variable:
      retArray =  RefsToVariableItem;
      break;
    case MainItemTypes.LogicNode:
      retArray =  RefsToLogicNodeItem;
      break;
    default:
      //error not a valid type
      return [];
  }

  //replace all the 'nameRef' items for the JSON Paths with the given previousName
  return retArray.map((jsonPaths) => {
    return [jsonPaths[0].replace(/nameRef/g, lookupName), jsonPaths[1], jsonPaths[2]];
  });  
};

export const GetJSONPathInRefs = (itemType: MainItemTypes, lookupName : string): ItemReferencesArray => {
  var retArray : ItemReferencesArray;
  switch (itemType) {
    case MainItemTypes.Diagram:
      retArray = InDiagramRefs;
      break;
    case MainItemTypes.State:
      retArray =  InStateRefs;
      break;
    case MainItemTypes.Action:
      retArray =  InActionRefs;
      break;
    case MainItemTypes.Event:
      retArray =  InEventRefs;
      break;
    case MainItemTypes.ExtSim:
      retArray =  InExtSimRefs;
      break;
    case MainItemTypes.Variable:
      retArray =  InVariableRefs;
      break;
    case MainItemTypes.LogicNode:
      retArray =  InLogicNodeRefs;
      break;
    default:
      //error not a valid type
      return [];
  }

  //replace all the 'nameRef' items for the JSON Paths with the given previousName
  return retArray.map((jsonPaths) => {
    return [jsonPaths[0].replace(/nameRef/g, lookupName), jsonPaths[1], jsonPaths[2]];
  });  
};


/**
 * Retrieves a subset model of items that reference the item specific item name and type. Result does NOT include the item itself. Can be recursive.
 *
 * @param {string} itemName - The name of the item to get the references for.
 * @param {MainItemTypes} itemType - The type of the item to look for references.
 * @param {boolean} levelsUp - How many levels up to search. If <1 then the search is recursive.
 * @param <{EMRALD_Model}> addToModel - If assigned then items are added to this model.
 * @includeTypes {MainItemTypeSet} - is a set of items to include in the search
 * @param {EMRALD_Model} searchModel - The model to search if not assigned appdata.value is used.
 * @return {EMRALD_Model} - A subset model of just the referenced items.
 */
export const GetModelItemsReferencing = ( 
  itemName : string, //Name of the item to get the references for
  itemType : MainItemTypes, //This is the type of the item to look for references
  levelsUp : number, //if <1 then the search is recursive
  addToModel? : EMRALD_Model, //if assigned then items are added to this model.
  includeTypes : MainItemTypeSet = allMainItemTypes, //is a set of items to include in the search
  searchModel : EMRALD_Model = appData.value, //the model to search if not assigned appdata.value is used
) : EMRALD_Model => { //returns a subset model of just the referenced items.
  
  let retRefModel: EMRALD_Model
  if(addToModel){
    retRefModel = addToModel;
  }else{ //use an empty model
    retRefModel = CreateEmptyEMRALDModel();
  }

  GetModelItemsReferencingRecursive([[itemName, itemType]], levelsUp, retRefModel, includeTypes, searchModel, {[itemName + "_" + itemType]: true});

  return retRefModel;
};

type SearchNameTypePairList = Array<[string, MainItemTypes]>;


const GetModelItemsReferencingRecursive = ( 
  currentSearchItems : SearchNameTypePairList, //list of items on this recursive level to search for
  levelsUp : number, //if <0 then the search is recursive
  addToModel : EMRALD_Model, //if assigned then items are added to this model.
  includeTypes : MainItemTypeSet = allMainItemTypes, //is a set of items to include in the search
  searchModel : EMRALD_Model,
  processed : { [key: string]: boolean; } //items already done to prevent looping
)  => { //returns a subset model of just the referenced items.
 
  if((levelsUp == 0) || (currentSearchItems.length == 0)){ //-1 is recursive 0 means stop requested levels are done
    return;
  }

  const nextLevelItems: SearchNameTypePairList = []; //add to this list for the next recursive level to search.

  while (currentSearchItems.length > 0) {
    let curItemName : string = currentSearchItems[0][0];
    let curItemType : MainItemTypes = currentSearchItems[0][1];
    currentSearchItems.shift(); //remove the item from the array
        
      let jsonPathRefArray : ItemReferencesArray = GetJSONPathUsingRefs(curItemType, curItemName);

      jsonPathRefArray.forEach((jsonPathSet) => {
        jsonpath.paths(searchModel, jsonPathSet[0]).forEach((ref: any) => {
          let parentPath = ref.slice(0, -1);
          let parent = jsonpath.value(searchModel, parentPath.join('.'));
          while((parent.id == null) && (parentPath.length > 0))
          {
            parentPath = parentPath.slice(0, -1);
            parent = jsonpath.value(searchModel, parentPath.join('.'));
          }
          if((parent.id != null) && (includeTypes.has(parent.objType)))
          {
            if(!processed[parent.name + '_' + parent.objType]){
              processed[parent.name + '_' + parent.objType] = true;
              nextLevelItems.push([parent.name, parent.objType]);

              switch(parent.objType)
              {
                case MainItemTypes.Action:
                  addToModel.ActionList.push(parent);
                  break;
                case MainItemTypes.Event:
                  addToModel.EventList.push(parent);
                  break;
                case MainItemTypes.ExtSim:
                  addToModel.ExtSimList.push(parent);
                  break;
                case MainItemTypes.Variable:
                  addToModel.VariableList.push(parent);
                  break;
                case MainItemTypes.LogicNode:
                  addToModel.LogicNodeList.push(parent);
                  break;
                case MainItemTypes.State:
                  addToModel.StateList.push(parent);
                  break;
                case MainItemTypes.Diagram:
                  addToModel.DiagramList.push(parent);
                  break;
                default:
                  //todo error not a valid type
                  break;
              }
            }
          }
        });
      
      });
  //}
  }  

  if(levelsUp > 0) //if not fully recursive reduce levels 
    --levelsUp;

  GetModelItemsReferencingRecursive(nextLevelItems, levelsUp, addToModel, includeTypes, searchModel, processed);

}

export const AdjustJsonPathRef = (
  jsonPathArray: string[],
  adjustment: string[]
): string[] => {  
  let retArray = [...jsonPathArray];
  
  while (adjustment.length > 0) {
    const current = adjustment.shift(); // Get the first element and remove it from the array
    
    if (current === '.') {
      const next = adjustment.shift(); // Get the next item
      if (next !== undefined) {
        retArray.pop();
        retArray.push(next); // Only push if `next` is not undefined
      }
    } else if (current === '^') {
      retArray.pop();
    }
  }

  return retArray;
};

export const GetItemByNameType = (
  itemName : string, 
  itemType : MainItemTypes,
  searchModel? : EMRALD_Model, //if not assigned appData.value is used
  ) : Diagram | State | Action | Event | ExtSim | Variable | LogicNode | undefined => {

    if(searchModel == undefined)
      searchModel = structuredClone(appData.value);

    var retItem: Diagram | State | Action | Event | ExtSim | Variable | LogicNode | undefined = undefined;

    switch(itemType)
    {
      case MainItemTypes.Action:
        retItem = searchModel.ActionList.find(item => item.name === itemName);
        break;
      case MainItemTypes.Event:
        retItem = searchModel.EventList.find(item => item.name === itemName);
        break;
      case MainItemTypes.ExtSim:
        retItem = searchModel.ExtSimList.find(item => item.name === itemName);
        break;
      case MainItemTypes.Variable:
        retItem = searchModel.VariableList.find(item => item.name === itemName);
        break;
      case MainItemTypes.LogicNode:
        retItem = searchModel.LogicNodeList.find(item => item.name === itemName);
        break;
      case MainItemTypes.State:
        retItem = searchModel.StateList.find(item => item.name === itemName);
        break;
      case MainItemTypes.Diagram:
        retItem = searchModel.DiagramList.find(item => item.name === itemName);
        break;
      default:
        retItem = undefined;
        break;
    }

    return retItem;
}

const AddItemToModel = (
  itemObj : Diagram | State | Action | Event | ExtSim | Variable | LogicNode, 
  itemType : MainItemTypes,
  model : EMRALD_Model) => {
    switch(itemType)
    {
      case MainItemTypes.Action:
        model.ActionList.push(itemObj as Action);
        break;
      case MainItemTypes.Event:
        model.EventList.push(itemObj as Event);
        break;
      case MainItemTypes.ExtSim:
        model.ExtSimList.push(itemObj as ExtSim);
        break;
      case MainItemTypes.Variable:
        model.VariableList.push(itemObj as Variable);
        break;
      case MainItemTypes.LogicNode:
        model.LogicNodeList.push(itemObj as LogicNode);
        break;
      case MainItemTypes.State:
        model.StateList.push(itemObj as State);
        break;
      case MainItemTypes.Diagram:
        model.DiagramList.push(itemObj as Diagram);
        break;
      default:
        //todo error not a valid type
        break;
    }
}


/**
 * Retrieves a subset model of items that the given item uses/references. It can be recursive or limited to specific types. The subset model includes the provided item.
 *
 * @param {string} itemName - The name of the item to get the references for.
 * @param {MainItemTypes} itemType - The type of the item to look for references.
 * @param {number} levels - How many levels up to search. If <1 then the search is recursive.
 * @includeTypes {MainItemTypeSet} - is a set of items to include in the search
 * @removeNotIncludedRefs {boolean} - if true then referenceds that are not included in the model are removed.
 * @return {EMRALD_Model} - A subset model of just the referenced items. 
 */
export const GetModelItemsReferencedBy = ( 
  itemName : string, //Name of the item looking for references
  itemType : MainItemTypes, //This is the type of the item to look for references
  levels : number = 0, //if < 1, will be recursive and give all levels of references. For copy or template use 1 for all items except Diagrams and 2 for Diagrams.
  includeTypes : MainItemTypeSet = allMainItemTypes, //is a set of items to include in the search 
  removeNotIncludedRefs : boolean = true, //if true then references that are not included in the model are removed.
  searchModel : EMRALD_Model = appData.value, //if not assigned appData.value is used
) : EMRALD_Model => { //returns a subset model of just the referenced items.
  
  let refItems : Array<[string, number, MainItemTypes]> = [[itemName, 0, itemType]];
  let retRefModel: EMRALD_Model = CreateEmptyEMRALDModel();
  const processed: { [key: string]: boolean; } = { [itemName + '_' + itemType]: true };
  
  while(refItems.length > 0)
  {  
    let curItemName : string = refItems[0][0];
    let curItemLevel : number = refItems[0][1];
    let curItemType : MainItemTypes = refItems[0][2];
    refItems.shift(); //remove the item from the array
    
    let itemObj = GetItemByNameType(curItemName, curItemType);      
    if((itemObj != null) && (includeTypes.has(itemObj.objType))){ //add to the reference subset model      
      AddItemToModel(itemObj, curItemType, retRefModel);    

      
      //get the json paths for the references depending on the type
      let jsonPathRefArray : ItemReferencesArray = GetJSONPathInRefs(curItemType, curItemName);

      //go through all the references if not at the cutoff level, add
      if((curItemLevel < levels) || (levels < 1)){        
        jsonPathRefArray.forEach((jsonPathSet) => {    
          jsonpath.paths(searchModel, jsonPathSet[0]).forEach((jPath: any) => {
            let childNames = jsonpath.value(searchModel, jPath.join('.'));
            //make sure it is an array
            childNames = Array.isArray(childNames) ? childNames : [childNames];
            childNames.forEach((childName: any) => {
              if(!processed[childName + '_' + jsonPathSet[1]])
              {
                refItems.push([childName, curItemLevel + 1, jsonPathSet[1]]);
                processed[childName + '_' + jsonPathSet[1]] = true; //mark as processed
              }
            })
          });
        });
      }
      else if (removeNotIncludedRefs){ //remove references to other items for things like copy or template. User will have to fix any errors.
        jsonPathRefArray.forEach((jsonPathSet) => {    
          jsonpath.paths(retRefModel, jsonPathSet[0]).forEach((jPath: any) => {
            let childNames = jsonpath.value(retRefModel, jPath.join('.'));
            //Keep track if it is an array origionally and then make it an array
            let isArray = Array.isArray(childNames);
            childNames = Array.isArray(childNames) ? childNames : [childNames];
            childNames.forEach((childName: any) => {
              if(!processed[childName + '_' + jsonPathSet[1]])
              {
                //get everything after the last. to use for criteria
                const lastDotIndex = jsonPathSet[0].lastIndexOf('.');
                const childItemSearchName = jsonPathSet[0].substring(lastDotIndex + 1);

                // Find the position to insert the new condition
                let insertPosition = jsonPathSet[0].indexOf(curItemName) + curItemName.length + 1;
                // Insert the new condition at the correct position
                let updatedJsonPath = [
                  jsonPathSet[0].slice(0, insertPosition),
                  " && @." + childItemSearchName + ".indexOf('" + childName + "') != -1",
                  jsonPathSet[0].slice(insertPosition)
                ].join('');


                if(!isArray){
                  //just set the item to empty string.
                  jsonpath.paths(retRefModel, updatedJsonPath).forEach((ref: any) => {
                    const path = ref.join('.');
                    jsonpath.value(retRefModel, path, "");
                  });
                }
                else{
                  // Find the paths of the items to be removed
                  const pathsToRemove = jsonpath.paths(retRefModel, updatedJsonPath);

                  pathsToRemove.forEach((ref: any) => {
                    // Find the parent array
                    const itemPath = ref.join('.');
                    const arrayIndex = ref[ref.length - 1];
                    const itemArray = jsonpath.value(retRefModel, itemPath);
                    
                    if (Array.isArray(itemArray)) {
                      // Remove the item from the parent array
                      itemArray.splice(arrayIndex, 1);
                    }

                    if(jsonPathSet[2] != null) //remove linked array data if it exists
                    {
                      const linkedItemPath = AdjustJsonPathRef(ref, jsonPathSet[2] || []);
                        
                      // Retrieve the value using JSONPath
                      const value = jsonpath.value(retRefModel, linkedItemPath.join('.'));

                      // Check if the value is an array
                      if (Array.isArray(value)) {
                        jsonpath.value(retRefModel, linkedItemPath.join('.'), []);
                      } else {
                        jsonpath.value(retRefModel, linkedItemPath.join('.'), "");
                      }
                    }
                  });                  
                }
              }
            })
          });
        });
      }
    }
  }

  return retRefModel;
}
