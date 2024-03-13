//Diagrams
const DiagramRefs = [
  "$.DiagramList[?(@.name == 'nameRef')].nam",
  "$.Statelist[? (@.diagramName == 'nameRef')].diagramName",
  "$.LogicNodeList[*].compChildren[? (@.diagramName == 'TDP1')].diagramName"
];

//States
const StateRefs = [
  "$.StateList[?(@.name == 'nameRef')].name",
  "$.DiagramList[*].states[? (@ == 'nameRef')]",
  "$.ActionList[*].newStates[? (@.toState == 'nameRef')].toState",
  "$.EventList[*].triggerStates[? (@ == 'nameRef')]",
  "$.LogicNodeList[*].compChildren[*].stateValues[? (@.stateName == 'nameRef')].stateName",
  "$.VariableList[*].accrualStatesData[? (@.stateName == 'nameRef')]"
];

//Events
const EventRefs = [
  "$.EventList[?(@.name == 'nameRef')].name",
  "$.StateList[*].events[? (@ == 'nameRef')]"
];

//Actions
const ActionRefs = [
  "$.ActionList[?(@.name == 'nameRef')].name",
  "$.StateList[*].immediateActions[? (@ == 'nameRef')]",
  "$.StateList[*].eventActions[*].actions[? (@ == 'nameRef')]"
];

//Variables
const VariableRefs = [
  "$.VariableList[?(@.name == 'nameRef')].name" ,
  "$.ActionList[*].newStates[? (@.varProb == 'nameRef')].varProb" ,
  "$.ActionList[? (@.variableName == 'nameRef')].variableName" ,
  "$.ActionList[*].codeVariables[? (@ == 'nameRef')]" ,
  "$.EventList[*].varNames[? (@ == 'nameRef')]" ,
  "$.EventList[? (@.variable == 'nameRef')].variable" ,
  "$.EventList[*].parameters[? (@.variable == 'ProtPumpMoveTime')].variable"
];

//ExtSim
const ExtSimRefs = [
  "$.ExtSimList[?(@.name == 'nameRef')].name",
  "$.ActionList[? (@.extSim == 'nameRef')].name"
];

//LogicNodes
const logicNodesRefs = [
  "$.LogicNodeList[? (@.name == 'nameRef')].name",
  "$.EventList[? (@.logicTop == 'nameRef')].logicTop",
  "$.LogicNodeList[*].gateChildren[? (@ == 'ACPowerOK')]"
];

