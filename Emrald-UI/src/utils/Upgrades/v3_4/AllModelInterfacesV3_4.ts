/**
 * EMRALD model schema version 3.3
 */
export type EMRALD_Model = Main_Model;
/**
 * Type of the diagram. dtSingle - means you can only be in one state of the diagram at a time and states evaluate to a value. dtMulti - means you can be in multiple states at a time, but cant evaluate the diagram
 */
export type DiagramType = 'dtSingle' | 'dtMulti';
/**
 * Type of the diagram.
 */
export type ChangeLog = ChangeLogItems[];
/**
 * Type of the state
 */
export type StateType = 'stStart' | 'stKeyState' | 'stStandard' | 'stTerminal';
/**
 * actions for the events in sibling "events" array. One to one relationship.
 */
export type EventActions = EventActionItems[];
/**
 * For single state diagrams. Boolean value for the diagram when evaluated in a logic tree. Ignore - removes that item from the logic calculation.
 */
export type StateEvalValue = 'True' | 'False' | 'Ignore';
/**
 * The type of action
 */
export type ActionType
  = | 'atTransition'
    | 'atCngVarVal'
    | 'at3DSimMsg'
    | 'atRunExtApp';
/**
 * For event type of etDistribution this is the name of the distribution parameter.
 */
export type EventDistributionParameterName
  = | 'Mean'
    | 'Standard Deviation'
    | 'Minimum'
    | 'Maximum'
    | 'Rate'
    | 'Shape'
    | 'Scale'
    | 'Peak'
    | 'Alpha'
    | 'Beta';
/**
 * Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.
 */
export type TimeVariableUnit
  = | ''
    | 'trYears'
    | 'trDays'
    | 'trHours'
    | 'trMinutes'
    | 'trSeconds';
/**
 * Optional. For action type atCngVarVal when useDistribution is true, this is the array of distribution parameters. The shape is shared with etDistribution events for convenience, but the timeRate field on each parameter is ignored for atCngVarVal (variable values are unitless raw numbers, not durations).
 */
export type Parameters = EventDistributionParameter[];
export type Event = {
  [k: string]: unknown;
};
/**
 * Gate type for the logic node
 */
export type GateType = 'gtAnd' | 'gtOr' | 'gtNot';
/**
 * Evaluate value if not the states default.
 */
export type StateValues = StateValuesItems[];
/**
 * Array of component diagram names and state values to use in evaluating if not using the default value.
 */
export type CompChild = CompChildItems[];
/**
 * Context of use for the variable in the model.
 */
export type VarScope = 'gtDocLink' | 'gtAccrual' | 'gtGlobal' | 'gt3DSim';
/**
 * If the varScope is gtDocLink then this the type of document the variable can be linked to. XML, JSON or PlainText using a regular expression
 */
export type DocVarType = 'dtXML' | 'dtJSON' | 'dtTextRegEx';
/**
 * This is the type of the variable, Bool, double, int, string
 */
export type VariableType = 'bool' | 'double' | 'int' | 'string';
/**
 * Type of accrual for the specified state.
 */
export type AccrualVarTableType = 'ctMultiplier' | 'ctTable';
/**
 * Optional. If the type is ctTable then this is the array of values used in calculating this states contribution to the variable value. Example for the first hour the accrual multiplier is 0.5, for the second hour the accrual multiplier is 0.1
 */
export type AccrualTable = number[][];
/**
 * Optional. If the variable varScope is gtAccrual, then these are the states used for calculating the variables value over time.
 */
export type AccrualStatesData = AccrualStatesDataItems[];
export type EnIDType
  = | 'itVar'
    | 'itComp'
    | 'itState'
    | 'itEvent'
    | 'itAction'
    | 'itTreeNode'
    | 'itTimer'
    | 'itDiagram'
    | 'itExtSim';

/**
 * EMRALD model schema version 3.4
 */
export interface Main_Model {
  /**
   * Temporary, only used internally for some identification or uniqueness needs
   */
  id?: string;
  objType: 'EMRALD_Model';
  /**
   * Name of the EMRALD model
   */
  name?: string;
  /**
   * description of the EMRALD model
   */
  desc?: string;
  /**
   * Version of the EMRALD model schema
   */
  emraldVersion: number;
  /**
   * Version of the users model
   */
  version: number;
  /**
   * The user's model version history and change descriptions
   */
  versionHistory: VersionHistory[];
  /**
   * Name of the original file that was opened to help distinguish between different versions of the model.
   */
  filename?: string;
  /**
   * All the diagrams for the model
   */
  DiagramList: Diagram[];
  /**
   * All the external simulation links for the mdoel
   */
  ExtSimList: ExtSim[];
  /**
   * All of the states for the different diagrams of the model
   */
  StateList: State[];
  /**
   * All the actions that can be used in the model
   */
  ActionList: Action[];
  /**
   * All the events that are used in the model.
   */
  EventList: Event[];
  /**
   * All the logic nodes to make the logic trees in the model
   */
  LogicNodeList: LogicNode[];
  /**
   * All the variables used in the model
   */
  VariableList: Variable[];
  /**
   * Templates available to make new diagrams in the model. These are basically small models all on their own.
   */
  templates?: Main_Model[];
  multiThreadInfo?: MultiThreadInfo;
  changeLog?: ChangeLog;
  group?: Group;
}
export interface VersionHistory {
  /**
   * A description of the changes made to the model in this version
   */
  description?: string;
  /**
   * The version number
   */
  version?: number;
}
export interface Diagram {
  /**
   * Optional. Only used for internal processing needs.
   */
  id?: string;
  objType: 'Diagram';
  /**
   * Name of the diagram
   */
  name: string;
  /**
   * description of the diagram
   */
  desc: string;
  diagramType: DiagramType;
  /**
   * name of template used to make this diagram
   */
  diagramTemplate?: string;
  /**
   * Name of grouping in the UI for this diagram
   */
  diagramLabel: string;
  /**
   * Names of the states used in this diagram
   */
  states: string[];
  changeLog?: ChangeLog;
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean;
}
export interface ChangeLogItems {
  /**
   * Description of the change.
   */
  cngDesc: string;
  /**
   * ISO 8601 date time format for the change
   */
  dateTime: string;
  cngID?: string;
}
export interface ExtSim {
  /**
   * Optional, internal use only.
   */
  id?: string;
  objType: 'ExtSim';
  /**
   * referenace name in the model for the external simulation
   */
  name: string;
  /**
   * name of resource type to connect to in MsgServer, not unique if more than one simulation of the same tool
   */
  resourceName: string;
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean;
}
export interface State {
  id?: string;
  objType: 'State';
  /**
   * referenace name in the model for state
   */
  name: string;
  /**
   * User entered description of the state
   */
  desc: string;
  stateType: StateType;
  /**
   * Diagram the state belongs to, A state can only be in one diagram.
   */
  diagramName: string;
  /**
   * Array of name references for the immediate actions to be run when entering the state
   */
  immediateActions: string[];
  /**
   * Array of name references to events. These event will be monitored for when in this state.
   */
  events: string[];
  eventActions: EventActions;
  geometryInfo?: GeometryInfo;
  changeLog?: ChangeLog;
  defaultSingleStateValue?: StateEvalValue;
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean;
}
export interface EventActionItems {
  /**
   * array of referenace names for actions of the associated event.
   */
  actions: string[];
  moveFromCurrent: boolean;
}
/**
 * position for the GUI
 */
export interface GeometryInfo {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}
export interface Action {
  /**
   * Optional, internal use only.
   */
  id?: string;
  objType: 'Action';
  /**
   * referenace name in the model for the action
   */
  name: string;
  /**
   * User entered description of the action
   */
  desc: string;
  actType: ActionType;
  /**
   * Is this a global item to show up in the global list, If false it showes up in local or all list.
   */
  mainItem: boolean;
  /**
   * Optional. Only one action may be taken so the probability determines if this action is taken vs another in the EventAction list. If false then the probability is used to sample if this action occured and multiple or no actions could happen when the event is triggered.
   */
  mutExcl?: boolean;
  /**
   * Optional. If this is a transition action then these are the states that it could be transitioned to.
   */
  newStates?: NewState[];
  /**
   * Optionsl. Script code to be executed if the action type has a script
   */
  scriptCode?: string;
  /**
   * Optional. For change var value actions, the result of the script is assigned to this variable name reference.
   */
  variableName?: string;
  /**
   * Optional. If action has a script, these are the variable name references for variables used in the script. All variables used in script must be in this list.
   */
  codeVariables?: string[];
  /**
   * Optional. For action type atCngVarVal. When true, the new value is sampled from the distribution defined by distType and parameters instead of running scriptCode. Defaults to false (use code) when unset.
   */
  useDistribution?: boolean;
  /**
   * Optional. For action type atCngVarVal when useDistribution is true, this is the type of distribution used to sample the new variable value.
   */
  distType?:
    | 'dtNormal'
    | 'dtExponential'
    | 'dtWeibull'
    | 'dtLogNormal'
    | 'dtTriangular'
    | 'dtGamma'
    | 'dtGompertz'
    | 'dtUniform'
    | 'dtBeta';
  parameters?: Parameters;
  /**
   * Optional. For action type at3DSimMsg, this is the message to be sent to the coupled external simulation.
   */
  sim3DMessage?: string;
  /**
   * Optional. For action type at3DSimMsg, this is the name of the coupled external sim to send the message to.
   */
  extSim?: string;
  /**
   * Optional. For action type at3DSimMsg and a sim3DMessage of atCompModify, this is the name of the variable in the external simulation to be modified by the message.
   */
  sim3DVariable?: string;
  /**
   * Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this flag indicates that the JSON has the properties for sim3DModelRef, sim3DConfigData, and simEndTime.
   */
  openSimVarParams?: boolean;
  /**
   * Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the data defined by the user that is used by the external simulation on startup. Typically a path to a model it need to open.
   */
  sim3DModelRef?: string;
  /**
   * Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the data defined by the user that is used by the external simulation on startup.
   */
  sim3DConfigData?: string;
  /**
   * Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the end simulation time defined by the user that is used by the external simulation on startup.
   */
  simEndTime?: string;
  /**
   * Optional. For action type atRunExtApp. It is the C# script to be executed and the result strig  passed as a parameter to the executable to be run.
   */
  makeInputFileCode?: string;
  /**
   * Optional. For action type atRunExtApp. It is the path of the exe to be run. It can be relative to the location of the EMRALD model.
   */
  exePath?: string;
  /**
   * Optional. For action type atRunExtApp. When true, the preprocessor code return string determines the executable to run instead of exePath.
   */
  ExeFromPreCode?: boolean;
  /**
   * Optional. For action type atRunExtApp. When true, the executable working directory is the model project path instead of the executable directory.
   */
  useProjPathExeWorkingDir?: boolean;
  /**
   * Optional. For action type atRunExtApp. It is the C# script to be executed after the accociated exe is ran. Typically it reads a result file and script typically returns a string list with +/-[StateName] to shift out or into a state because of the results..
   */
  processOutputFileCode?: string;
  /**
   * Used for executing applications with custom form data. This can be anything needed by the custom form, but in the end only the standard atRunExtApp fields are used to do the action. TODO: This type definition is set up for only the MAAP form. If other forms are added in the future, this definition will need to be adjusted for their form data formats.
   */
  formData?: {
    [k: string]: unknown;
  };
  /**
   * Optional. For action type atRunExtApp. It is used for custom app form.
   */
  template?: {
    [k: string]: unknown;
  };
  /**
   * Optional. For action type atRunExtApp. It is flag to indicate the type of return from the processOutputFileCode. If rtNone then it has no return, othrwise the C# script must return a List of strings with +/-[StateName] to shift out or into a state.
   */
  returnProcess?: string;
  changeLog?: ChangeLog;
  /**
   * String for the run application action, only for UI used. Options depend on the custom UI forms made. "code" means default user defined pre and post execution code is used.
   */
  raType?: string;
  /**
   * Used for custom form, variables used in the form.
   */
  updateVariables?: unknown[];
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean;
}
export interface NewState {
  /**
   * reference name of the state to transtion to.
   */
  toState: string;
  /**
   * probability that this state will be transtioned to.
   */
  prob: number;
  /**
   * The description from the user for output if tthis transition takes place.
   */
  failDesc: string;
  /**
   * Optional, if used  then the a variable is used for the probability. This is the name of that variable
   */
  varProb?: null | string;
}
export interface EventDistributionParameter {
  name?: EventDistributionParameterName;
  /**
   * Optional. The value of the parameter if the useVariable flag is false. Can be a number or a string if in scientific notation.
   */
  value?: number | string;
  timeRate?: TimeVariableUnit;
  /**
   * Flag to use the variable string vs the value item for the property
   */
  useVariable?: boolean;
  /**
   * Optional. The reference name of the variable to use as the value of the parameter if the useVariable flag is true.
   */
  variable?: string;
}
export interface LogicNode {
  /**
   * Optional, internal use only.
   */
  id?: string;
  objType: 'LogicNode';
  /**
   * referenace name in the logic node
   */
  name: string;
  /**
   * User entered description of the logic node
   */
  desc: string;
  gateType: GateType;
  compChildren: CompChild;
  /**
   * Array of logic node names that are children of this gate.
   */
  gateChildren: string[];
  /**
   * Flag indicating that this is to be displayed as a tree top in the UI and can be used in an evaluate logic tree event.
   */
  isRoot: boolean;
  changeLog?: ChangeLog;
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean;
}
export interface CompChildItems {
  stateValues?: StateValues;
  /**
   * Name of the diagram to be evaluated
   */
  diagramName: string;
}
export interface StateValuesItems {
  /**
   * State name for the value.
   */
  stateName: string;
  stateValue: StateEvalValue;
}
export interface Variable {
  /**
   * Optional, internal use only.
   */
  id?: string;
  objType: 'Variable';
  /**
   * referenace name in the model for the variable
   */
  name: string;
  /**
   * User entered description of the variable
   */
  desc?: string;
  varScope: VarScope;
  /**
   * The default value for the variable.
   */
  value: number | string | boolean;
  /**
   * If the varScope is gtDocLink then this is the expression defining path in the document to the variable is linked to. XPath for XML, JSONPath for JSON, or a RegularExpression for txt
   */
  docLink?: string;
  docType?: DocVarType;
  /**
   * If the varScope is gtDocLink then this is the path to the document the variable is linked to.
   */
  docPath?: string;
  /**
   * Flag, if true then the file in the docPath must exist when the simulation starts running. This is helpful to minimize errors.
   */
  pathMustExist?: boolean;
  type: VariableType;
  accrualStatesData?: AccrualStatesData;
  /**
   * Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this is the regular expression string.
   */
  regExpLine?: number;
  /**
   * Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this the start possition after the regular expression finds its match for reading or writing the value of the variable.
   */
  begPosition?: number;
  /**
   * Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this how many characters to read for the value of the variable
   */
  numChars?: number;
  /**
   * Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, if this is defined, the value will be read from the given group within the user's regex expression
   */
  regExpGroup?: number;
  /**
   * Optional, this specifies if the value of the variable is to be reset to the default value on each run or retain the value from the last run.
   */
  resetOnRuns?: boolean;
  /**
   * Optional. If the variable varScope is gt3DSim, this is the name reference to the external simulation to link to for the value.
   */
  resourceName?: string;
  /**
   * Optional. For variables of varScope gt3DSim, this is the external simulations name of the variable. It is used in sending a message to the external simulation.
   */
  sim3DId?: string;
  /**
   * Optional. For variables of varScope gt3DSim, this is the external simulation the variable is linked to.
   */
  extSim?: string;
  /**
   * Optional. For variables of varScope gt3DSim, an fParser boolean expression (e.g. '(valve_12 > 5) & (valve_12 < 10)') the external simulation must satisfy before reporting this variable. Sent in the initial coupling message. When omitted the variable is reported on every change.
   */
  WatchEventCriteria?: string;
  changeLog?: ChangeLog;
  /**
   * Flag to indicate the user want to do cumulative statistics in the results.
   */
  cumulativeStats?: boolean;
  /**
   * Flag to have the monitor variable check box checked in the solver by default.
   */
  monitorInSim?: boolean;
  /**
   * Flag to indicate if the variable can be monitored in the solver. This removes it from the solver UI if false. Must be true if monitorInSim is true.
   */
  canMonitor?: boolean;
  /**
   * Optional. Flag marking this variable as a simulation input - its value is supplied into a run (for example set by a coupled/external application or used as a run parameter).
   */
  inVariable?: boolean;
  /**
   * Optional. Flag marking this variable as a simulation output - its value is produced during a run and exposed to results or a coupled/external application.
   */
  outVariable?: boolean;
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean;
}
export interface AccrualStatesDataItems {
  /**
   * Reference name to the state contributiong to the accrual calculation.
   */
  stateName: string;
  type: AccrualVarTableType;
  /**
   * Optional. If type is ctMultiplier then this is the multiplier value for every time increment, specified by the multRate, spent in the state.
   */
  accrualMult: number;
  /**
   * This is the time rate for the accrualMult in calculating the value for the variable.
   */
  multRate: string;
  accrualTable: AccrualTable;
}
export interface MultiThreadInfo {
  ToCopyForRefs?: ToCopyForRef[];
  /**
   * ISO 8601 date time when the multi-thread copy references were assigned.
   */
  AssignedTime?: string;
}
export interface ToCopyForRef {
  ItemName?: string;
  ItemType?: EnIDType;
  RefPath?: string;
  ToCopy?: string[] | null;
  RelPath?: string;
  AdjRelRoot?: string;
}
/**
 * What catagory grouping this item belongs to. Used to indicate a group for and EMRALD model template.
 */
export interface Group {
  /**
   * Name of the group
   */
  name: string;
  /**
   * Sub group tree path
   */
  subgroup?: Group[];
}
