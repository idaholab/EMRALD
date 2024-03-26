import { MainItemTypes } from '../types/ItemTypes.ts';
import jsonpath from 'jsonpath';
import { appData } from '../hooks/useAppData';
import { EMRALD_Model, emptyEMRALDModel} from '../types/EMRALD_Model.ts';
import { EmbedHTMLAttributes } from 'react';

//Items that reference this type
//Diagrams
export const UsingDiagramRefs: Array<[string, MainItemTypes]> = [
  ["$.DiagramList[?(@.name == 'nameRef')].name", MainItemTypes.Diagram],
  ["$.StateList[?(@.diagramName == 'nameRef')].diagramName", MainItemTypes.State],
  ["$.LogicNodeList[*].compChildren[?(@.diagramName == 'nameRef')].diagramName", MainItemTypes.LogicNode]
];

//States
export const UsingStateRefs: Array<[string, MainItemTypes]> = [
  ["$.StateList[?(@.name == 'nameRef')].name", MainItemTypes.State],
  ["$.DiagramList[*].states[?(@ == 'nameRef')]", MainItemTypes.Diagram],
  ["$.ActionList[*].newStates[?(@.toState == 'nameRef')].toState", MainItemTypes.Action],
  ["$.EventList[*].triggerStates[?(@ == 'nameRef')]", MainItemTypes.Event],
  ["$.LogicNodeList[*].compChildren[*].stateValues[?(@.stateName == 'nameRef')].stateName", MainItemTypes.LogicNode],
  ["$.VariableList[*].accrualStatesData[?(@.stateName == 'nameRef')]", MainItemTypes.Variable]
];

//Events
export const UsingEventRefs: Array<[string, MainItemTypes]> = [
  ["$.EventList[?(@.name == 'nameRef')].name", MainItemTypes.Event],
  ["$.StateList[*].events[?(@ == 'nameRef')]", MainItemTypes.State]
];

//Actions
export const UsingActionRefs: Array<[string, MainItemTypes]> = [
  ["$.ActionList[?(@.name == 'nameRef')].name", MainItemTypes.Action],
  ["$.StateList[*].immediateActions[?(@ == 'nameRef')]", MainItemTypes.State],
  ["$.StateList[*].eventActions[*].actions[?(@ == 'nameRef')]", MainItemTypes.State]
];

//Variables
export const UsingVariableRefs: Array<[string, MainItemTypes]> = [
  ["$.VariableList[?(@.name == 'nameRef')].name", MainItemTypes.Variable],
  ["$.ActionList[*].newStates[?(@.varProb == 'nameRef')].varProb", MainItemTypes.Action],
  ["$.ActionList[?(@.variableName == 'nameRef')].variableName", MainItemTypes.Action],
  ["$.ActionList[*].codeVariables[?(@ == 'nameRef')]", MainItemTypes.Action],
  ["$.EventList[*].varNames[?(@ == 'nameRef')]", MainItemTypes.Event],
  ["$.EventList[?(@.variable == 'nameRef')].variable", MainItemTypes.Event],
  ["$.EventList[*].parameters[?(@.variable == 'nameRef')].variable", MainItemTypes.Event]
];

//ExtSim
export const UsingExtSimRefs: Array<[string, MainItemTypes]> = [
  ["$.ExtSimList[?(@.name == 'nameRef')].name", MainItemTypes.ExtSim],
  ["$.ActionList[?(@.extSim == 'nameRef')].name", MainItemTypes.Action]
];

//LogicNodes
export const UsingLogicNodeRefs: Array<[string, MainItemTypes]> = [
  ["$.LogicNodeList[?(@.name == 'nameRef')].name", MainItemTypes.LogicNode],
  ["$.EventList[?(@.logicTop == 'nameRef')].logicTop", MainItemTypes.Event],
  ["$.LogicNodeList[*].gateChildren[?(@ == 'nameRef')]", MainItemTypes.LogicNode]
];



//Items referenced by these types
//Diagrams
export const InDiagramRefs: Array<[string, MainItemTypes]> = [
  ["$.DiagramList[?(@.name == 'nameRef')].states", MainItemTypes.State],
];

//States
export const InStateRefs: Array<[string, MainItemTypes]> = [
  ["$.StateList[?(@.name == 'nameRef')].diagramName", MainItemTypes.Diagram],
  ["$.StateList[?(@.name == 'Start_Systems')].events", MainItemTypes.Event],
  ["$.StateList[?(@.name == 'Start_Systems')].immediateActions", MainItemTypes.Action],
  ["$.StateList[?(@.name == 'C-CKV-A_Standby')].eventActions[*].actions", MainItemTypes.Action],
];

//Events
export const InEventRefs: Array<[string, MainItemTypes]> = [
  ["$.EventList[?(@.name == 'C-MOV-A_Stop')].triggerStates", MainItemTypes.State],
  ["$.EventList[?(@.name == 'C-MOV-A_Stop')].varNames", MainItemTypes.Variable],
  ["$.EventList[?(@.name == 'C-MOV-A_Stop')].logicTop", MainItemTypes.LogicNode],
  ["$.EventList[?(@.name == 'C-MOV-A_Stop')].triggerStates", MainItemTypes.State],
  ["$.EventList[?(@.name == 'C-MOV-A_Stop')].variable", MainItemTypes.Variable],
  ["$.EventList[?(@.name == 'C-MOV-A_Stop')].parameters[*].variable", MainItemTypes.Variable],
];

//Actions
export const InActionRefs: Array<[string, MainItemTypes]> = [
  ["$.ActionList[?(@.name == 'nameRef')].newStates.toState", MainItemTypes.State],
  ["$.ActionList[?(@.name == 'nameRef')].variableName", MainItemTypes.Variable],
  ["$.ActionList[?(@.name == 'nameRef')].codeVariables[*]", MainItemTypes.Variable],
  ["$.ActionList[?(@.name == 'nameRef')].extSim", MainItemTypes.ExtSim],
];

//Variables
export const InVariableRefs: Array<[string, MainItemTypes]> = [
  ["$.VariableList[?(@.name == 'nameRef')].accrualStatesData[*].stateName", MainItemTypes.Variable]
];

//ExtSim
export const InExtSimRefs: Array<[string, MainItemTypes]> = [ 
];

//LogicNodes
export const InLogicNodeRefs: Array<[string, MainItemTypes]> = [
  ["$.LogicNodeList[?(@.name == 'nameRef')].compChildren[*].diagramName", MainItemTypes.Diagram],
  ["$.LogicNodeList[?(@.name == 'nameRef')].compChildren[*].stateValues[*].stateName", MainItemTypes.State],
  ["$.LogicNodeList[?(@.name == 'nameRef')].gateChildren", MainItemTypes.State],
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
  return retArray.map((jsonPaths, index) => {
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
  return retArray.map((jsonPaths, index) => {
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
    var retRefModel: EMRALD_Model = { ...(emptyEMRALDModel as EMRALD_Model) };
  }

  const emraldModel: EMRALD_Model = appData.value;  
  var jsonPathRefArray : Array<[string, MainItemTypes]> = GetJSONPathUsingRefs(itemType, itemName);

  jsonPathRefArray.forEach((jsonPathSet) => {
    jsonpath.paths(appData.value, jsonPathSet[0]).forEach((ref: any) => {
      var parentPath = ref.slice(0, -1);
      var parent = jsonpath.value(emraldModel, parentPath.join('.'));
      while((parent.id == null) && (parentPath.length > 0))
      {
        parentPath = parentPath.slice(0, -1);
        parent = jsonpath.value(emraldModel, parentPath.join('.'));
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


export const GetModelItemsReferencedBy = ( 
  itemName : string, //Name of the item looking for references
  itemType : MainItemTypes, //This is the type of the item to look for references
  recursive : boolean, //if true, will include references of the found references
) : EMRALD_Model => { //returns a subset model of just the referenced items.
  
  var refItems : Array<[string, MainItemTypes]> = [[itemName, itemType]];
  var retRefModel: EMRALD_Model = { ...(emptyEMRALDModel as EMRALD_Model) };
  const emraldModel: EMRALD_Model = appData.value;  
  const processed: { [key: string]: boolean; } = { [itemName + '_' + itemType]: true };

  while(refItems.length > 0)
  {  
    var jsonPathRefArray : Array<[string, MainItemTypes]> = GetJSONPathInRefs(itemType, refItems[0][0]);
    refItems.shift(); //remove the item from the array
    jsonpath.paths(appData.value, jsonPathRefArray[0][0]).forEach((ref: any) => {
      ref.forEach((item: any) => {
        var i = item;
      })
    });

    jsonPathRefArray.forEach((jsonPathSet) => {
      const jPath = jsonPathSet[0]
      jsonpath.paths(emraldModel, jPath).forEach((ref: any) => {
        const path = ref.join('.');
        var items = jsonpath.value(emraldModel, path);

        items.forEach((item: any) => {
          GetModelItemsReferencing(item, jsonPathSet[1], retRefModel);
        })
      });
    });    
  }

  return retRefModel;
}

