import { EMRALD_Model, } from '../types/EMRALD_Model.ts';
import jsonpath from 'jsonpath';
import { MainItemTypes } from '../types/ItemTypes.ts';
import { DiagramRefs, StateRefs, ActionRefs, EventRefs, VariableRefs, LogicNodeRefs, ExtSimRefs } from './ModelReferences.ts';

//import { appData } from '../types/Data';
// import { useAppData } from '../hooks/useAppData.tsx';
// import { Diagram } from '../types/Diagram';
// import { LogicNode } from '../types/LogicNode';
// import { EventAction, State } from '../types/State';
// import { Event } from '../types/Event';

export const updateModelAndReferences = ( //Update the main appData EMRALD model with all the item changed in the model provided and references if the name changes
  emraldModel : EMRALD_Model, //It is assumed the the EMRALD model passed in has already been udpated with all the object changes
  updateAppData : (model: EMRALD_Model) => void, 
  itemType : MainItemTypes, //This is the type of the object that was updated
  previousName: string, //old name of the item
  newName: string //new name of the item
) => {
  
  // Clone the original itemData to avoid mutating it directly
  //const updatedEMRALDModel: EMRALD_Model = appData;
  if(newName === previousName){
    updateAppData(emraldModel);
  }  
  else{ //update all the references as well
    var jsonPathRefArray : string[] = [];
    switch (itemType) {
      case MainItemTypes.Diagram:
        jsonPathRefArray = DiagramRefs;
        break;
      case MainItemTypes.State:
        jsonPathRefArray = StateRefs;
        break;
      case MainItemTypes.Action:
        jsonPathRefArray = ActionRefs;
        break;
      case MainItemTypes.Event:
        jsonPathRefArray = EventRefs;
        break;
      case MainItemTypes.ExtSim:
        jsonPathRefArray = ExtSimRefs;
        break;
      case MainItemTypes.Variable:
        jsonPathRefArray = VariableRefs;
        break;
      case MainItemTypes.LogicNode:
        jsonPathRefArray = LogicNodeRefs;
        break;
      default:
        break;
    }


    //replace all the 'nameRef' items with the given previousName
    const updatedJsonPathRefArray = jsonPathRefArray.map(jsonPath => {
      // Replace 'nameRef' with variableName
      return jsonPath.replace(/nameRef/g, previousName);
    });

    updatedJsonPathRefArray.forEach((jPath) => {


      jsonpath.paths(emraldModel, jPath).forEach((ref: any) => {
        const path = ref.join('.');
        jsonpath.value(emraldModel, path, newName);
      });
    });


    updateAppData(emraldModel);  
  }
}

