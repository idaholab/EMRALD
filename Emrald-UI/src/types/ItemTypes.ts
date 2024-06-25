//Not incuded in the Schema, do not delete
export enum MainItemTypes {
  Diagram = "Diagram",
  State = "State",
  Action = "Action",
  Event = "Event",
  ExtSim = "ExtSim",
  LogicNode = "LogicNode",
  Variable = "Variable",
  EMRALD_Model = "EMRALD_Model",
}
//end not included in schema



/**
 * For event type of etDistribution this is the name of the distribution parameter.
 */
export type MainItemType =
  | "Diagram"
  | "State"
  | "Action"
  | "Event"
  | "ExtSim"
  | "LogicNode"
  | "Variable"
  | "EMRALD_Model"

/**
 * Type of the diagram. dtSingle - means you can only be in one state of the diagram at a time and states evaluate to a value. dtMulti - means you can be in multiple states at a time, but cant evaluate the diagram
 */
 export type DiagramType = "dtSingle" | "dtMulti"
 /**
  * Type of the diagram.
  */
 export type ChangeLog = {
   /**
    * Description of the change.
    */
   cngDesc: string
   /**
    * ISO 8601 date time format for the change
    */
   dateTime: string
 }[]
 /**
  * Type of the state
  */
 export type StateType = "stStart" | "stKeyState" | "stStandard" | "stTerminal"
 /**
  * For single state diagrams. Boolean value for the diagram when evaluated in a logic tree. Ignore - removes that item from the logic calculation.
  */
 export type StateEvalValue = "True" | "False" | "Ignore"
 /**
  */
 export type ActionType =
   | "atTransition"
   | "atCngVarVal"
   | "at3DSimMsg"
   | "atRunExtApp"
 /**
  * Type of the event
  */
 export type EventType =
   | "etStateCng"
   | "etComponentLogic"
   | "etFailRate"
   | "etTimer"
   | "et3dSimEv"
   | "etDistribution"
   | "etVarCond"
 /**
  * Optional. When an event uses a variable and that variable changes, this tells the code how to update the event.
  */
 export type VarChangeOptions = "ocIgnore" | "ocResample" | "ocAdjust"
 /**
  * Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.
  */
 export type TimeVariableUnit =
   | ""
   | "trYears"
   | "trDays"
   | "trHours"
   | "trMinutes"
   | "trSeconds"
 /**
  * Optional. For events of type et3dSimEv. This the type of message being sent to the external simulation. See the external messeage JSON schema.
  */
 export type ExtEventMsgType = "etCompEv" | "etEndSim" | "etStatus"
 /**
  * Optional. For event type of etDistribution this is the type of distribution the user selected.
  */
 export type DistributionType =
   | "dtNormal"
   | "dtExponential"
   | "dtWeibull"
   | "dtLogNormal"
   | "dtTriangular"
   | "dtGamma"
   | "dtGompertz"
   | "dtUniform"
   | "dtBeta"
 /**
  * Gate type for the logic node
  */
 export type GateType = "gtAnd" | "gtOr" | "gtNot"
 /**
  * Context of use for the variable in the model.
  */
 export type VarScope = "gtDocLink" | "gtAccrual" | "gtGlobal" | "gt3DSim"
 /**
  * If the varScope is gtDocLink then this the type of document the variable can be linked to. XML, JSON or PlainText using a regular expression
  */
 export type DocVarType = "dtXML" | "dtJSON" | "dtTextRegEx"
 /**
  * This is the type of the variable, Bool, double, int, string
  */
 export type VariableType = "bool" | "double" | "int" | "string"
 /**
  * Type of accrual for the specified state.
  */
 export type AccrualVarTableType = "ctMultiplier" | "ctTable"

 export type Group = {
  name: string;
  subgroup: Group[] | null;
};
/**
 * For event type of etDistribution this is the name of the distribution parameter.
 */
export type EventDistributionParameterName =
  | "Mean"
  | "Standard Deviation"
  | "Minimum"
  | "Maximum"
  | "Rate"
  | "Shape"
  | "Scale"
  | "Peak"
  | "Alpha"
  | "Beta"
