import { EMRALD_Model, } from '../types/EMRALD_Model.ts';
import jsonpath from 'jsonpath';
import { MainItemTypes } from '../types/ItemTypes.ts';
import { GetJSONPathUsingRefs, GetModelItemsReferencing, GetModelItemsReferencedBy } from './ModelReferences.ts';
import { appData } from '../hooks/useAppData';
import { Diagram } from '../types/Diagram.ts';
import { State } from '../types/State.ts';
import { Action } from '../types/Action.ts';
import { Event } from '../types/Event.ts';
import { Variable } from '../types/Variable.ts';
import { LogicNode } from '../types/LogicNode.ts';
import { ExtSim } from '../types/ExtSim.ts';


export const updateModelAndReferences = ( //Update the main appData EMRALD model with all the item changed in the model provided and references if the name changes
  item : Diagram | State | Action | Event | Variable | LogicNode | ExtSim, //It is assumed the the EMRALD model passed in has already been udpated with all the object changes
  itemType : MainItemTypes, //This is the type of the object that was updated
  //previousName: string, //old name of the item
  //newName: string //new name of the item
) : EMRALD_Model => {

  const updatedEMRALDModel: EMRALD_Model = appData.value;
  
  var jsonPathRefArray : Array<[string, MainItemTypes]> = GetJSONPathUsingRefs(itemType, item.name);
  var itemArray: any[];
  var itemIdx = -1;

  switch (itemType) {
    case MainItemTypes.Diagram:
      itemArray = appData.value.DiagramList;
      break;
    case MainItemTypes.State:
      itemArray = appData.value.StateList;
      break;
    case MainItemTypes.Action:
      itemArray = appData.value.ActionList;
      break;
    case MainItemTypes.Event:
      itemArray = appData.value.EventList;
      break;
    case MainItemTypes.ExtSim:
      itemArray = appData.value.ExtSimList;
      break;
    case MainItemTypes.Variable:
      itemArray = appData.value.VariableList;
      break;
    case MainItemTypes.LogicNode:
      itemArray = appData.value.LogicNodeList;
      break;
    default:
      //error not a valid type
      console.log("Error: Invalid type for updateModelAndReferences");
      return updatedEMRALDModel;
      break;
  }

  //find the index of the item in the array
  itemIdx = itemArray.findIndex(itemInArray => itemInArray.id === item.id); 
  if(itemIdx < 0){
    //todo error not found
    console.log("Error: item not found in array for updateModelAndReferences");
    return updatedEMRALDModel;
  }
  var previousName: string = itemArray[itemIdx].name; //old name of the item

  //update the item with the new item data
  itemArray[itemIdx] = item;
    
  if(item.name != previousName){  //name change so update all the references as well
    
    // //test
    //var m = GetModelItemsReferencing('S-DGN-B', MainItemTypes.Diagram);
    //var m2 = GetModelItemsReferencedBy('Test Diagram', MainItemTypes.Diagram, true);
    

    jsonPathRefArray.forEach((jsonPathSet) => {
      const jPath = jsonPathSet[0]
      jsonpath.paths(updatedEMRALDModel, jPath).forEach((ref: any) => {
        const path = ref.join('.');
        jsonpath.value(updatedEMRALDModel, path, item.name);
      });
    });
  }

  return updatedEMRALDModel;
}
