import { EMRALD_Model, } from '../types/EMRALD_Model.ts';
import jsonpath from 'jsonpath';
import { MainItemTypes } from '../types/ItemTypes.ts';
import { DiagramRefs, StateRefs, ActionRefs, EventRefs, VariableRefs, LogicNodeRefs, ExtSimRefs } from './ModelReferences.ts';
import { appData, updateAppData } from '../hooks/useAppData';
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
) => {

  const updatedEMRALDModel: EMRALD_Model = appData.value;
  
  var jsonPathRefArray : string[] = [];
  var itemArray: any[];
  var itemIdx = -1;

  switch (itemType) {
    case MainItemTypes.Diagram:
      jsonPathRefArray = DiagramRefs;
      itemArray = appData.value.DiagramList;
      break;
    case MainItemTypes.State:
      jsonPathRefArray = StateRefs;
      itemArray = appData.value.StateList;
      break;
    case MainItemTypes.Action:
      jsonPathRefArray = ActionRefs;
      itemArray = appData.value.ActionList;
      break;
    case MainItemTypes.Event:
      jsonPathRefArray = EventRefs;
      itemArray = appData.value.EventList;
      break;
    case MainItemTypes.ExtSim:
      jsonPathRefArray = ExtSimRefs;
      itemArray = appData.value.ExtSimList;
      break;
    case MainItemTypes.Variable:
      jsonPathRefArray = VariableRefs;
      itemArray = appData.value.VariableList;
      break;
    case MainItemTypes.LogicNode:
      jsonPathRefArray = LogicNodeRefs;
      itemArray = appData.value.LogicNodeList;
      break;
    default:
      //error not a valid type
      return;
      break;
  }

  //find the index of the item in the array
  itemIdx = itemArray.findIndex(itemInArray => itemInArray.id === item.id);  
  var previousName: string = itemArray[itemIdx].name; //old name of the item

  //update the item with the new item data
  itemArray[itemIdx] = item;
    
  if(item.name === previousName){ //name the same so no refernce updates.
    updateAppData(updatedEMRALDModel);
  }  
  else{ //name change so update all the references as well
    //replace all the 'nameRef' items with the given previousName
    const updatedJsonPathRefArray = jsonPathRefArray.map(jsonPath => {
      // Replace 'nameRef' with variableName
      return jsonPath.replace(/nameRef/g, previousName);
    });

    updatedJsonPathRefArray.forEach((jPath) => {
      jsonpath.paths(updatedEMRALDModel, jPath).forEach((ref: any) => {
        const path = ref.join('.');
        jsonpath.value(updatedEMRALDModel, path, item.name);
      });
    });


    updateAppData(updatedEMRALDModel);  
  }
}
