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
 * @typedef ExtSimData
 * @property {number} id - The ext sim id.
 * @property {string} name - The ext sim name.
 * @property {string} resourceName - The resource name.
 * @property {string} modelRef - The model reference.
 * @property {string[]} states - Associated state names.
 * @property {string} configData - Configuration data.
 * @property {string} simMaxTime - Maximum simulation time.
 */

/**
 * @typedef EMRALD.ExtSim
 * @property {ExtSimData} ExtSim - The ext sim data.
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
 * @typedef AccrualStateData
 * @property {string} stateName - The name of the state.
 * @property {string} type - The state type.
 * @property {number} accrualMult - The accrual multiplier.
 * @property {string} multRate - The multiplier time rate.
 * @property {number[]} accrualTable - The accrual table.
 */

/**
 * @typedef VariableData
 * @property {number} id - The variable id.
 * @property {string} name - The variable name.
 * @property {string} desc - The variable description.
 * @property {string} varScope - The variable scope.
 * @property {*} value - The numberical value.
 * @property {boolean} resetOnRuns - If the variable should be reset each run.
 * @property {AccrualStateData[]} accrualStatesData - Accrual states data.
 * @property {string} type - The C# type of the variable value.
 * @property {number} [begPosition] - Begin position for document link variables.
 * @property {string} [docLink] - The document to link to for document link variables.
 * @property {string} [docPath] - The path to the target document for document link variables.
 * @property {string} [docType] - The document type for document link variables.
 * @property {number} [numChars] - The number of characters to read for document link variables.
 * @property {boolean} [pathMustExist] - If the path must exist for document link variables.
 * @property {number} [regExpLine] - RegExp line for document link variables.
 */

/**
 * @typedef EMRALD.Variable
 * @property {VariableData} Variable - The variable data.
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
 */

/**
 * @namespace ActionEditor
 */

/**
 * @typedef ActionEditor.Window
 * @property {() => import('angular').IScope} getScope - Gets the Angular scope of the action editor window.
 * @property {EMRALD.Model[]} [templates] - Templates loaded into the project.
 */

/**
 * @typedef EMRALD.DiagramType
 * @property {string} label - The diagram type label.
 * @property {string} type - The diagram type category.
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
