import { MainItemTypes } from '../types/ItemTypes.ts';
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



//Items referenced by these types
//Diagrams
const InDiagramRefs: Array<[string, MainItemTypes]> = [
  ["$.DiagramList[?(@.name == 'nameRef')].states", MainItemTypes.State],
];

//States
const InStateRefs: Array<[string, MainItemTypes]> = [
  ["$.StateList[?(@.name == 'nameRef')].diagramName", MainItemTypes.Diagram],
  ["$.StateList[?(@.name == 'nameRef')].events", MainItemTypes.Event],
  ["$.StateList[?(@.name == 'nameRef')].immediateActions", MainItemTypes.Action],
  ["$.StateList[?(@.name == 'nameRef')].eventActions[*].actions", MainItemTypes.Action],
];

//Events
const InEventRefs: Array<[string, MainItemTypes]> = [
  ["$.EventList[?(@.name == 'nameRef')].triggerStates", MainItemTypes.State],
  ["$.EventList[?(@.name == 'nameRef')].varNames", MainItemTypes.Variable],
  ["$.EventList[?(@.name == 'nameRef')].logicTop", MainItemTypes.LogicNode],
  ["$.EventList[?(@.name == 'nameRef')].triggerStates", MainItemTypes.State],
  ["$.EventList[?(@.name == 'nameRef')].variable", MainItemTypes.Variable],
  ["$.EventList[?(@.name == 'nameRef')].parameters[*].variable", MainItemTypes.Variable],
];

//Actions
const InActionRefs: Array<[string, MainItemTypes]> = [
  ["$.ActionList[?(@.name == 'nameRef')].newStates.toState", MainItemTypes.State],
  ["$.ActionList[?(@.name == 'nameRef')].variableName", MainItemTypes.Variable],
  ["$.ActionList[?(@.name == 'nameRef')].codeVariables[*]", MainItemTypes.Variable],
  ["$.ActionList[?(@.name == 'nameRef')].extSim", MainItemTypes.ExtSim],
];

//Variables
const InVariableRefs: Array<[string, MainItemTypes]> = [
  ["$.VariableList[?(@.name == 'nameRef')].accrualStatesData[*].stateName", MainItemTypes.State]
];

//ExtSim
const InExtSimRefs: Array<[string, MainItemTypes]> = [ 
];

//LogicNodes
const InLogicNodeRefs: Array<[string, MainItemTypes]> = [
  ["$.LogicNodeList[?(@.name == 'nameRef')].compChildren[*].diagramName", MainItemTypes.Diagram],
  ["$.LogicNodeList[?(@.name == 'nameRef')].compChildren[*].stateValues[*].stateName", MainItemTypes.State],
  ["$.LogicNodeList[?(@.name == 'nameRef')].gateChildren", MainItemTypes.LogicNode],
];

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

export const GetJSONPathInRefs = (itemType: MainItemTypes, lookupName : string): Array<[string, MainItemTypes]> => {
  var retArray : Array<[string, MainItemTypes]>;
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
    return [jsonPaths[0].replace(/nameRef/g, lookupName), jsonPaths[1]];
  });  
};

/**
 * Retrieves a subset model of items that reference a specific item.
 *
 * @param {string} itemName - The name of the item to get the references for.
 * @param {MainItemTypes} itemType - The type of the item to look for references.
 * @return {EMRALD_Model} - A subset model of just the referenced items.
 */
export const GetModelItemsReferencing = ( 
  itemName : string, //Name of the item to get the references for
  itemType : MainItemTypes, //This is the type of the item to look for references
  addToModel? : EMRALD_Model, //if assigned then items are added to this model.
) : EMRALD_Model => { //returns a subset model of just the referenced items.

  var retRefModel: EMRALD_Model
  if(addToModel){
    retRefModel = addToModel;
  }else{ //use an empty model
    var retRefModel: EMRALD_Model = CreateEmptyEMRALDModel();
  }

  var jsonPathRefArray : Array<[string, MainItemTypes]> = GetJSONPathUsingRefs(itemType, itemName);

  jsonPathRefArray.forEach((jsonPathSet) => {
    jsonpath.paths(appData.value, jsonPathSet[0]).forEach((ref: any) => {
      var parentPath = ref.slice(0, -1);
      var parent = jsonpath.value(appData.value, parentPath.join('.'));
      while((parent.id == null) && (parentPath.length > 0))
      {
        parentPath = parentPath.slice(0, -1);
        parent = jsonpath.value(appData.value, parentPath.join('.'));
      }
      if(parent.id != null)
      {
        switch(jsonPathSet[1])
        {
          case MainItemTypes.Action:
            retRefModel.ActionList.push(parent);
            break;
          case MainItemTypes.Event:
            retRefModel.EventList.push(parent);
            break;
          case MainItemTypes.ExtSim:
            retRefModel.ExtSimList.push(parent);
            break;
          case MainItemTypes.Variable:
            retRefModel.VariableList.push(parent);
            break;
          case MainItemTypes.LogicNode:
            retRefModel.LogicNodeList.push(parent);
            break;
          case MainItemTypes.State:
            retRefModel.StateList.push(parent);
            break;
          case MainItemTypes.Diagram:
            retRefModel.DiagramList.push(parent);
            break;
          default:
            //todo error not a valid type
            break;
        }
      }
    });
  });

  return retRefModel;
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

export const AddItemToModel = (
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
  recursive : boolean, //if true, will include references of the found references
) : EMRALD_Model => { //returns a subset model of just the referenced items.
  
  var refItems : Array<[string, MainItemTypes]> = [[itemName, itemType]];
  var retRefModel: EMRALD_Model = CreateEmptyEMRALDModel();
  //const emraldModel: EMRALD_Model = appData.value;  
  const processed: { [key: string]: boolean; } = { [itemName + '_' + itemType]: true };
  var firstRound = true; //use to just get the first round of references if not recursive

  while(refItems.length > 0)
  {  
    var curItemName : string = refItems[0][0];
    var curItemType : MainItemTypes = refItems[0][1];
    refItems.shift(); //remove the item from the array
    
    var itemObj = GetItemByNameType(curItemName, curItemType);      
    if(itemObj != null){ //add to the reference subset model      
      AddItemToModel(itemObj, curItemType, retRefModel);    

      //get all the references
      if(firstRound || recursive)
      {
        //get the json paths for the references depending on the type
        var jsonPathRefArray : Array<[string, MainItemTypes]> = GetJSONPathInRefs(curItemType, curItemName);
        
        jsonPathRefArray.forEach((jsonPathSet) => {    
          jsonpath.paths(appData.value, jsonPathSet[0]).forEach((jPath: any) => {
            var childNames = jsonpath.value(appData.value, jPath.join('.'));
            //make sur eit is an array
            childNames = Array.isArray(childNames) ? childNames : [childNames];
            childNames.forEach((childName: any) => {
              if(!processed[childName + '_' + jsonPathSet[1]])
              {
                refItems.push([childName, jsonPathSet[1]]);
                processed[childName + '_' + jsonPathSet[1]] = true; //mark as processed
              }
            })
          });
        });
      }
    }
  }

  return retRefModel;
}

