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
export const logicNodesRefs = [
  "$.LogicNodeList[? (@.name == 'nameRef')].name",
  "$.EventList[? (@.logicTop == 'nameRef')].logicTop",
  "$.LogicNodeList[*].gateChildren[? (@ == 'ACPowerOK')]"
];

