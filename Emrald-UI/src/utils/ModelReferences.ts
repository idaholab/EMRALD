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

//Items that reference this type
//Diagrams
const UsingDiagramRefs: Array<[string, MainItemTypes]> = [
  ["$.DiagramList[?(@.name == 'nameRef')].name", MainItemTypes.Diagram],
  ["$.StateList[?(@.diagramName == 'nameRef')].diagramName", MainItemTypes.State],
  ["$.LogicNodeList[*].compChildren[?(@.diagramName == 'nameRef')].diagramName", MainItemTypes.LogicNode]
];

//States
const UsingStateRefs: Array<[string, MainItemTypes]> = [
  ["$.StateList[?(@.name == 'nameRef')].name", MainItemTypes.State],
  ["$.DiagramList[*].states[?(@ == 'nameRef')]", MainItemTypes.Diagram],
  ["$.ActionList[*].newStates[?(@.toState == 'nameRef')].toState", MainItemTypes.Action],
  ["$.EventList[*].triggerStates[?(@ == 'nameRef')]", MainItemTypes.Event],
  ["$.LogicNodeList[*].compChildren[*].stateValues[?(@.stateName == 'nameRef')].stateName", MainItemTypes.LogicNode],
  ["$.VariableList[*].accrualStatesData[?(@.stateName == 'nameRef')]", MainItemTypes.Variable]
];

//Events
const UsingEventRefs: Array<[string, MainItemTypes]> = [
  ["$.EventList[?(@.name == 'nameRef')].name", MainItemTypes.Event],
  ["$.StateList[*].events[?(@ == 'nameRef')]", MainItemTypes.State]
];

//Actions
const UsingActionRefs: Array<[string, MainItemTypes]> = [
  ["$.ActionList[?(@.name == 'nameRef')].name", MainItemTypes.Action],
  ["$.StateList[*].immediateActions[?(@ == 'nameRef')]", MainItemTypes.State],
  ["$.StateList[*].eventActions[*].actions[?(@ == 'nameRef')]", MainItemTypes.State]
];

//Variables
const UsingVariableRefs: Array<[string, MainItemTypes]> = [
  ["$.VariableList[?(@.name == 'nameRef')].name", MainItemTypes.Variable],
  ["$.ActionList[*].newStates[?(@.varProb == 'nameRef')].varProb", MainItemTypes.Action],
  ["$.ActionList[?(@.variableName == 'nameRef')].variableName", MainItemTypes.Action],
  ["$.ActionList[*].codeVariables[?(@ == 'nameRef')]", MainItemTypes.Action],
  ["$.EventList[*].varNames[?(@ == 'nameRef')]", MainItemTypes.Event],
  ["$.EventList[?(@.variable == 'nameRef')].variable", MainItemTypes.Event],
  ["$.EventList[*].parameters[?(@.variable == 'nameRef')].variable", MainItemTypes.Event]
];

//ExtSim
const UsingExtSimRefs: Array<[string, MainItemTypes]> = [
  ["$.ExtSimList[?(@.name == 'nameRef')].name", MainItemTypes.ExtSim],
  ["$.ActionList[?(@.extSim == 'nameRef')].name", MainItemTypes.Action]
];

//LogicNodes
const UsingLogicNodeRefs: Array<[string, MainItemTypes]> = [
  ["$.LogicNodeList[?(@.name == 'nameRef')].name", MainItemTypes.LogicNode],
  ["$.EventList[?(@.logicTop == 'nameRef')].logicTop", MainItemTypes.Event],
  ["$.LogicNodeList[*].gateChildren[?(@ == 'nameRef')]", MainItemTypes.LogicNode]
];



type DiagramRefsArray = Array<[string, MainItemTypes, string | null]>;
//Items referenced by these types [JsonPath, ItemType, Linked array if any] - Last item in array is for 
    //early stop of recursive search, we will remove any undefined references and this indicates if there 
    //is another array that is a logical match to this one. For example State.Events has State.eventActions that must have a 1to1 relationship
//Diagrams
const InDiagramRefs: DiagramRefsArray = [
  ["$.DiagramList[?(@.name == 'nameRef')].states", MainItemTypes.State, null],
];

//States
const InStateRefs: DiagramRefsArray = [
  ["$.StateList[?(@.name == 'nameRef')].diagramName", MainItemTypes.Diagram, null],
  ["$.StateList[?(@.name == 'nameRef')].events", MainItemTypes.Event, "eventActions"],
  ["$.StateList[?(@.name == 'nameRef')].immediateActions", MainItemTypes.Action, null],
  ["$.StateList[?(@.name == 'nameRef')].eventActions[*].actions", MainItemTypes.Action, null],
];

//Events
const InEventRefs: DiagramRefsArray = [
  ["$.EventList[?(@.name == 'nameRef')].triggerStates", MainItemTypes.State, null],
  ["$.EventList[?(@.name == 'nameRef')].varNames", MainItemTypes.Variable, null],
  ["$.EventList[?(@.name == 'nameRef')].logicTop", MainItemTypes.LogicNode, null],
  ["$.EventList[?(@.name == 'nameRef')].triggerStates", MainItemTypes.State, null],
  ["$.EventList[?(@.name == 'nameRef')].variable", MainItemTypes.Variable, null],
  ["$.EventList[?(@.name == 'nameRef')].parameters[*].variable", MainItemTypes.Variable, null],
];

//Actions
const InActionRefs: DiagramRefsArray = [
  ["$.ActionList[?(@.name == 'nameRef')].newStates.toState", MainItemTypes.State, null],
  ["$.ActionList[?(@.name == 'nameRef')].variableName", MainItemTypes.Variable, null],
  ["$.ActionList[?(@.name == 'nameRef')].codeVariables[*]", MainItemTypes.Variable, null],
  ["$.ActionList[?(@.name == 'nameRef')].extSim", MainItemTypes.ExtSim, null],
];

//Variables
const InVariableRefs: DiagramRefsArray = [
  ["$.VariableList[?(@.name == 'nameRef')].accrualStatesData[*].stateName", MainItemTypes.State, null]
];

//ExtSim
const InExtSimRefs: DiagramRefsArray = [ 
];

//LogicNodes
const InLogicNodeRefs: DiagramRefsArray = [
  ["$.LogicNodeList[?(@.name == 'nameRef')].compChildren[*].diagramName", MainItemTypes.Diagram, null],
  ["$.LogicNodeList[?(@.name == 'nameRef')].compChildren[*].stateValues[*].stateName", MainItemTypes.State, null],
  ["$.LogicNodeList[?(@.name == 'nameRef')].gateChildren", MainItemTypes.LogicNode, null],
];

export type MainItemTypeSet = Set<MainItemType>;
const allMainItemTypes: MainItemTypeSet = new Set<MainItemType>([
  "Diagram",
  "State",
  "Action",
  "Event",
  "ExtSim",
  "LogicNode",
  "Variable",
  "EMRALD_Model"
]);

export const GetJSONPathUsingRefs = (itemType: MainItemTypes, lookupName : string): Array<[string, MainItemTypes]> => {
  var retArray : Array<[string, MainItemTypes]>;
  switch (itemType) {
    case MainItemTypes.Diagram:
      retArray = UsingDiagramRefs;
      break;
    case MainItemTypes.State:
      retArray =  UsingStateRefs;
      break;
    case MainItemTypes.Action:
      retArray =  UsingActionRefs;
      break;
    case MainItemTypes.Event:
      retArray =  UsingEventRefs;
      break;
    case MainItemTypes.ExtSim:
      retArray =  UsingExtSimRefs;
      break;
    case MainItemTypes.Variable:
      retArray =  UsingVariableRefs;
      break;
    case MainItemTypes.LogicNode:
      retArray =  UsingLogicNodeRefs;
      break;
    default:
      //error not a valid type
      return [];
  }

  //replace all the 'nameRef' items for the JSON Paths with the given previousName
  return retArray.map((jsonPaths) => {
    return [jsonPaths[0].replace(/nameRef/g, lookupName), jsonPaths[1]];
  });  
};

const GetJSONPathInRefs = (itemType: MainItemTypes, lookupName : string): DiagramRefsArray => {
  var retArray : DiagramRefsArray;
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
 * Retrieves a subset model of items that reference a specific item.
 *
 * @param {string} itemName - The name of the item to get the references for.
 * @param {MainItemTypes} itemType - The type of the item to look for references.
 * @param {boolean} recursive - How many levels up to search. If <1 then the search is recursive.
 * @return {EMRALD_Model} - A subset model of just the referenced items.
 */
export const GetModelItemsReferencing = ( 
  itemName : string, //Name of the item to get the references for
  itemType : MainItemTypes, //This is the type of the item to look for references
  levelsUp : number, //if <1 then the search is recursive
  addToModel? : EMRALD_Model, //if assigned then items are added to this model.
  includeTypes : MainItemTypeSet = allMainItemTypes, //is a set of items to include in the search
) : EMRALD_Model => { //returns a subset model of just the referenced items.
  
  let retRefModel: EMRALD_Model
  if(addToModel){
    retRefModel = addToModel;
  }else{ //use an empty model
    retRefModel = CreateEmptyEMRALDModel();
  }

  GetModelItemsReferencingRecursive([[itemName, itemType]], levelsUp, retRefModel, includeTypes, {});

  return retRefModel;
};

type SearchNameTypePairList = Array<[string, MainItemTypes]>;

const GetModelItemsReferencingRecursive = ( 
  currentSearchItems : SearchNameTypePairList, //list of items on this recursive level to search for
  levelsUp : number, //if <0 then the search is recursive
  addToModel : EMRALD_Model, //if assigned then items are added to this model.
  includeTypes : MainItemTypeSet = allMainItemTypes, //is a set of items to include in the search
  processed : { [key: string]: boolean; } //items already done to prevent looping
)  => { //returns a subset model of just the referenced items.
 
  if(levelsUp == 0){ //-1 is recursive 0 means stop requested levels are done
    return;
  }

  const nextLevelItems: SearchNameTypePairList = []; //add to this list for the next recursive level to search.

  while (currentSearchItems.length > 0) {
    var curItemName : string = currentSearchItems[0][0];
    var curItemType : MainItemTypes = currentSearchItems[0][1];
    currentSearchItems.shift(); //remove the item from the array
    
    var jsonPathRefArray : Array<[string, MainItemTypes]> = GetJSONPathUsingRefs(curItemType, curItemName);

    jsonPathRefArray.forEach((jsonPathSet) => {
      const foundName : string = jsonPathSet[0];
      const foundType : MainItemTypes = jsonPathSet[1];
      jsonpath.paths(appData.value, foundName).forEach((ref: any) => {
        var parentPath = ref.slice(0, -1);
        var parent = jsonpath.value(appData.value, parentPath.join('.'));
        while((parent.id == null) && (parentPath.length > 0))
        {
          parentPath = parentPath.slice(0, -1);
          parent = jsonpath.value(appData.value, parentPath.join('.'));
        }
        if((parent.id != null) && (includeTypes.has(foundType)))
        {
          nextLevelItems.push([foundName, foundType]);

          switch(foundType)
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
      });
    
    });
  }  

  if(levelsUp > 0) //if not fully recursive reduce levels 
    --levelsUp;

  GetModelItemsReferencingRecursive(nextLevelItems, levelsUp, addToModel, includeTypes, processed);

}

export const GetItemByNameType = (
  itemName : string, 
  itemType : MainItemTypes) : Diagram | State | Action | Event | ExtSim | Variable | LogicNode | undefined => {

    var retItem: Diagram | State | Action | Event | ExtSim | Variable | LogicNode | undefined = undefined;

    switch(itemType)
    {
      case MainItemTypes.Action:
        retItem = appData.value.ActionList.find(item => item.name === itemName);
        break;
      case MainItemTypes.Event:
        retItem = appData.value.EventList.find(item => item.name === itemName);
        break;
      case MainItemTypes.ExtSim:
        retItem = appData.value.ExtSimList.find(item => item.name === itemName);
        break;
      case MainItemTypes.Variable:
        retItem = appData.value.VariableList.find(item => item.name === itemName);
        break;
      case MainItemTypes.LogicNode:
        retItem = appData.value.LogicNodeList.find(item => item.name === itemName);
        break;
      case MainItemTypes.State:
        retItem = appData.value.StateList.find(item => item.name === itemName);
        break;
      case MainItemTypes.Diagram:
        retItem = appData.value.DiagramList.find(item => item.name === itemName);
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


export const GetModelItemsReferencedBy = ( 
  itemName : string, //Name of the item looking for references
  itemType : MainItemTypes, //This is the type of the item to look for references
  levels : number = 0, //if < 1, will be recursive and give all levels of references. For copy or template use 1 for all items except Diagrams and 2 for Diagrams.
  includeTypes : MainItemTypeSet = allMainItemTypes, //is a set of items to include in the search 
) : EMRALD_Model => { //returns a subset model of just the referenced items.
  
  var refItems : Array<[string, number, MainItemTypes]> = [[itemName, 0, itemType]];
  var retRefModel: EMRALD_Model = CreateEmptyEMRALDModel();
  //const emraldModel: EMRALD_Model = appData.value;  
  const processed: { [key: string]: boolean; } = { [itemName + '_' + itemType]: true };
  
  while(refItems.length > 0)
  {  
    var curItemName : string = refItems[0][0];
    var curItemLevel : number = refItems[0][1];
    var curItemType : MainItemTypes = refItems[0][2];
    refItems.shift(); //remove the item from the array
    
    var itemObj = GetItemByNameType(curItemName, curItemType);      
    if((itemObj != null) && (itemObj.objType in includeTypes)){ //add to the reference subset model      
      AddItemToModel(itemObj, curItemType, retRefModel);    

      
      //get the json paths for the references depending on the type
      var jsonPathRefArray : DiagramRefsArray = GetJSONPathInRefs(curItemType, curItemName);

      //go through all the references if not at the cutoff level, add
      if((curItemLevel < levels) || (levels < 1)){        
        jsonPathRefArray.forEach((jsonPathSet) => {    
          jsonpath.paths(appData.value, jsonPathSet[0]).forEach((jPath: any) => {
            var childNames = jsonpath.value(appData.value, jPath.join('.'));
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
      else{ //remove references to other items. User will have to fix them.
        jsonPathRefArray.forEach((jsonPathSet) => {    
          jsonpath.paths(retRefModel, jsonPathSet[0]).forEach((jPath: any) => {
            var childNames = jsonpath.value(retRefModel, jPath.join('.'));
            //Keep track if it is an array origionally and then make it an array
            var isArray = Array.isArray(childNames);
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
                      const parentPath = ref.slice(0, -2).join('.'); // Path to the parent array
                      const parentIndex = ref[ref.length - 2];
                      const parentObject = jsonpath.value(retRefModel, parentPath);
                      if (parentObject[parentIndex] && parentObject[parentIndex][jsonPathSet[2]]) {
                        //remove item
                        parentObject[parentIndex][jsonPathSet[2]].splice(arrayIndex, 1);
                      };
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

