/**
 * @file JSDoc type definitions.
 */
// @ts-check

/**
 * @namespace EMRALD
 */

/**
 * @typedef NewState
 * @property {string} failDesc - Description of the failure.
 * @property {number} prob - Probability of failure.
 * @property {string} toState - The name of the destination state.
 * @property {string} varProb - A variable to use for probability, if any.
 */

/**
 * @typedef ActionData
 * @property {string} actType - The action type.
 * @property {string} desc - The action description.
 * @property {number} id - The action id.
 * @property {boolean} mainItem - If the action is the main item.
 * @property {string} mutExcl - If the action is mutually exclusive.
 * @property {string} name - The name of the action.
 * @property {NewState[]} newStates - New states the action can enter.
 */

/**
 * @typedef EMRALD.Action
 * @property {ActionData} Action - The action data.
 */

/**
 * @typedef SingleState
 * @property {string} stateName - The name of the state.
 * @property {string} okState - If the state is an OK state ('True' or 'False').
 */

/**
 * @typedef DiagramData
 * @property {string} desc - The diagram description.
 * @property {string} diagramLabel - The diagram type label.
 * @property {string} diagramType - The diagram type.
 * @property {number} id - The diagram id.
 * @property {string} name - The diagram name.
 * @property {SingleState[]} singleStates - Single state list.
 * @property {string[]} states - The names of states in the diagram.
 */

/**
 * @typedef EMRALD.Diagram
 * @property {DiagramData} Diagram - The diagram data.
 */

/**
 * @typedef EventData
 * @property {string} allItems - 'True' or 'false' value for state change events.
 * @property {string} desc - Event description.
 * @property {string} evType - The event type.
 * @property {number} id - The event id.
 * @property {string} ifInState - Trigger if in a specified enter state initially.
 * @property {boolean} mainItem - If the event is the main item.
 * @property {string} name - The name of the event.
 * @property {string[]} triggerStates - The names of states the event triggers.
 */

/**
 * @typedef EMRALD.Event
 * @property {EventData} Event - The event data.
 */

/**
 * @typedef LogicNodeData
 * @property {string[]} compChildren - The names of comp children.
 * @property {string} desc - The node description.
 * @property {string[]} gateChildren - The names of gate children.
 * @property {string} gateType - The gate type.
 * @property {number} id - The logic node id.
 * @property {string} name - The logic node name.
 * @property {string} rootName - The name of the root node.
 */

/**
 * @typedef EMRALD.LogicNode
 * @property {LogicNodeData} LogicNode - The logic node data.
 */

/**
 * @typedef EventAction
 * @property {string[]} actions - The names of associated actions.
 * @property {boolean} moveFromCurrent - If the action moves from the current state.
 */

/**
 * @typedef StateData
 * @property {string} desc - The state description.
 * @property {string} diagramName - The name of the diagram the state belongs to.
 * @property {EventAction[]} eventActions - Associated event actions.
 * @property {string[]} events - The names of events in the state.
 * @property {string} geometry - The mxGraph geometry.
 * @property {number} id - The id of the state.
 * @property {string[]} immediateActions - Immediate actions in the state.
 * @property {string} name - The name of the state.
 * @property {string} stateType - The state type.
 */

/**
 * @typedef EMRALD.State
 * @property {StateData} State - The state data.
 */

/**
 * @typedef EMRALD.Model
 * @property {EMRALD.Action[]} ActionList - The list of actions.
 * @property {EMRALD.Diagram[]} DiagramList - The list of diagrams.
 * @property {EMRALD.Event[]} EventList - The list of events.
 * @property {EMRALD.ExtSim[]} ExtSimList - The list of ext sims.
 * @property {EMRALD.LogicNode[]} LogicNodeList - The list of logic nodes.
 * @property {EMRALD.State[]} StateList - The list of states.
 * @property {EMRALD.Variable[]} VariableList - The list of variables.
 * @property {string} desc - The model description.
 * @property {number} id - The model id.
 * @property {string} name - The model name.
 * @property {EMRALD.Model[]} [templates] - Templates loaded into the project.
 */

/**
 * @namespace Navigation
 */

/**
 * @typedef Navigation.Sidebar
 */

/**
 * @namespace SimApp
 */

/**
 * @typedef SimApp.SimApp
 * @property {SimApp.SimApp} mainApp - The main application instance.
 * @property {Navigation.Sidebar} sidebar - The global sidebar.
 */
