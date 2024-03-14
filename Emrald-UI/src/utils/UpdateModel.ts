import { EMRALD_Model, } from '../types/EMRALD_Model.ts';
import jsonpath from 'jsonpath';
import { MainItemTypes } from '../types/ItemTypes.ts';

//import { appData } from '../types/Data';
import { useAppData } from '../hooks/useAppData.tsx';
// import { Diagram } from '../types/Diagram';
// import { LogicNode } from '../types/LogicNode';
// import { EventAction, State } from '../types/State';
// import { Event } from '../types/Event';

export const updateModelAndReferences = ( //Update the main appData EMRALD model with all the item changed in the model provided and references if the name changes
  emraldModel : EMRALD_Model, //It is assumed the the EMRALD model passed in has already been udpated with all the object changes
  itemType : MainItemTypes, //This is the type of the object that was updated
  previousName: string, //old name of the item
  newName: string //new name of the item
) => {
  const { updateAppData } = useAppData();
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

    const exp = "";
    const r = jsonpath.query(emraldModel, updatedJsonPathRefArray[0]);
    const results = updatedJsonPathRefArray.map(jPath => jsonpath.query(emraldModel, jPath)).flat();

    // Update the objects selected by JSONPath
    results.forEach((result: any) => {
      // Example of updating each selected object
      result.parent[result.parentProperty] = newName;
    });


    updateAppData(emraldModel);  
  }
}

//Diagrams
export const DiagramRefs = [
  "$.DiagramList[?(@.name == 'C-CKV-A')].name",
  "$.StateList[?(@.diagramName == 'nameRef')].diagramName",
  "$.LogicNodeList[*].compChildren[? (@.diagramName == 'nameRef')].diagramName"
];

//States
export const StateRefs = [
  "$.StateList[?(@.name == 'nameRef')].name",
  "$.DiagramList[*].states[? (@ == 'nameRef')]",
  "$.ActionList[*].newStates[? (@.toState == 'nameRef')].toState",
  "$.EventList[*].triggerStates[? (@ == 'nameRef')]",
  "$.LogicNodeList[*].compChildren[*].stateValues[? (@.stateName == 'nameRef')].stateName",
  "$.VariableList[*].accrualStatesData[? (@.stateName == 'nameRef')]"
];

//Events
export const EventRefs = [
  "$.EventList[?(@.name == 'nameRef')].name",
  "$.StateList[*].events[? (@ == 'nameRef')]"
];

//Actions
export const ActionRefs = [
  "$.ActionList[?(@.name == 'nameRef')].name",
  "$.StateList[*].immediateActions[? (@ == 'nameRef')]",
  "$.StateList[*].eventActions[*].actions[? (@ == 'nameRef')]"
];

//Variables
export const VariableRefs = [
  "$.VariableList[?(@.name == 'nameRef')].name" ,
  "$.ActionList[*].newStates[? (@.varProb == 'nameRef')].varProb" ,
  "$.ActionList[? (@.variableName == 'nameRef')].variableName" ,
  "$.ActionList[*].codeVariables[? (@ == 'nameRef')]" ,
  "$.EventList[*].varNames[? (@ == 'nameRef')]" ,
  "$.EventList[? (@.variable == 'nameRef')].variable" ,
  "$.EventList[*].parameters[? (@.variable == 'ProtPumpMoveTime')].variable"
];

//ExtSim
export const ExtSimRefs = [
  "$.ExtSimList[?(@.name == 'nameRef')].name",
  "$.ActionList[? (@.extSim == 'nameRef')].name"
];

//LogicNodes
export const LogicNodeRefs = [
  "$.LogicNodeList[? (@.name == 'nameRef')].name",
  "$.EventList[? (@.logicTop == 'nameRef')].logicTop",
  "$.LogicNodeList[*].gateChildren[? (@ == 'ACPowerOK')]"
];

