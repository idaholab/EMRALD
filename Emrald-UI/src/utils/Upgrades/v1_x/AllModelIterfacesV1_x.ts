/**
 * Type of the diagram.
 */
 export type DiagramType = "dtPlant" | "dtComponent" | "dtSystem" | "dtOther"
	
						
	
						  
	  
								
	  
				  
	  
											  
	  
				   
	
 /**
  * Type of the state
  */
 export type StateType = "stStart" | "stKeyState" | "stStandard" | "stTerminal"
 /**
																																				   
	
														 
	
  * The type of action
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
   | "etNormalDist"
   | "etLogNormalDist"
   | "etExponentialDist"
   | "etWeibullDist"
 /**
  * Optional. When an event uses a variable and that variable changes, this tells the code how to update the event.
  */
 export type VarChangeOptions = "ocIgnore" | "ocResample" | "ocAdjust"
 /**
  * Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.
  */
 export type TimeVariableUnit = "trDays" | "trHours" | "trMinutes" | "trSeconds" | "trYears"
	   
			  
			 
			  
				
				
 /**
  * Optional. For events of type et3dSimEv. This the type of message being sent to the external simulation. See the external messeage JSON schema.
  */
 export type ExtEventMsgType = "etCompEv" | "etEndSim"
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
 
 /**
  * EMRALD model schema version 2.4
  */
 export interface EMRALD_Model {
   /**
    * Temporary, only used internally for some identification or uniqueness needs
    */
   id?: number
   /**
    * Name of the EMRALD model
    */
   name: string
   /**
    * description of the EMRALD model
    */
   desc: string
   /**
    * Version of the EMRALD model
    */
   version: number
   /**
    * All the diagrams for the model
    */
   DiagramList: {
     Diagram: Diagram
   }[]
   /**
    * All the external simulation links for the mdoel
    */
   ExtSimList: {
     ExtSim: ExtSim
   }[]
   /**
    * All of the states for the different diagrams of the model
    */
   StateList: {
     State: State
   }[]
   /**
    * All the actions that can be used in the model
    */
   ActionList: {
     Action: Action
   }[]
   /**
    * All the events that are used in the model.
    */
   EventList: {
     Event: Event
   }[]
   /**
    * All the logic nodes to make the logic trees in the model
    */
   LogicNodeList: {
     LogicNode: LogicNode
   }[]
   /**
    * All the variables used in the model
    */
   VariableList: {
     Variable: Variable
   }[]
   /**
    * Templates avaliable to make new diagrams in the model. These are basicly a small model all on there own.
    */
   templates?: unknown[][]
						
 }
 export interface Diagram {
  /**
   * Optional. Only used for internal processing needs.
   */
  id?: number
  /**
   * Name of the diagram
   */
  name: string
  /**
   * description of the diagram
   */
  desc: string
  diagramType: DiagramType
  /**
   * name of template used to make this diagram
   */
  diagramTemplate?: string
  /**
   * Name of grouping in the UI for this diagram
   */
  diagramLabel: string
  /**
   * Names of the states used in this diagram
   */
  states: string[]
  /**
   * If a single state diagram, then this lists the states that have a boolean value assigned to them
   */
  singleStates?: {
    /**
     * Name of state for the value.
     */
    stateName: string
    /**
     * value of the state to be used in logic evaluation.
     */
    okState: "True" | "False"
  }[]
  /**
   * Should not be here GUI mistake.
   */
  diagramList?: {
    [k: string]: unknown
  }
  /**
   * Temporary for GUI should have been deleted.
   */
  forceMerge?: {
    [k: string]: unknown
  }
}
 export interface ExtSim {
   /**
    * Optional, internal use only.
    */
   id?: number
   /**
    * referenace name in the model for the external simulation
    */
   name: string
   /**
    * name of resource type to connect to in MsgServer, not unique if more than one simulation of the same tool
    */
   resourceName: string
 }
 export interface State {
   id?: number
   /**
    * referenace name in the model for state
    */
   name: string
   /**
    * User entered description of the state
    */
   desc: string
   stateType: StateType
   /**
    * Diagram the state belongs to, A state can only be in one diagram.
    */
   diagramName: string
   /**
    * Array of name references for the immediate actions to be run when entering the state
    */
   immediateActions: string[]
   /**
    * Array of name references to events. These event will be monitored for when in this state.
    */
   events: string[]
   /**
    * actions for the events in sibling "events" array. One to one relationship.
    */
   eventActions: {
     /**
      * array of referenace names for actions of the associated event.
      */
     actions: string[]
     moveFromCurrent: boolean
   }[]
   /**
    * possition for the GUI
    */
   geometry: string
						
										   
 }
 export interface Action {
   /**
    * Optional, internal use only.
    */
   id?: number
   /**
    * referenace name in the model for the action
    */
   name: string
   /**
    * User entered description of the action
    */
   desc: string
   actType: ActionType
   /**
    * Is this a global item to show up in the global list, If false it showes up in local or all list.
    */
   mainItem: boolean
   /**
    * Optional. Only one action may be taken so the probability determines if this action is taken vs another in the EventAction list. If false then the probability is used to sample if this action occured and multiple or no actions could happen when the event is triggered.
    */
   mutExcl?: boolean
   /**
    * Optional. If this is a transition action then these are the states that it could be transitioned to.
    */
   newStates?: {
     /**
      * reference name of the state to transtion to.
      */
     toState: string
     /**
      * probability that this state will be transtioned to.
      */
     prob: number
     /**
      * The description from the user for output if tthis transition takes place.
      */
     failDesc: string
		
																											 
		
							
   }[]
   /**
    * Optionsl. Script code to be executed if the action type has a script
    */
   scriptCode?: string
   /**
    * Optional. For change var value actions, the result of the script is assigned to this variable name reference.
    */
   variableName?: string
   /**
    * Optional. If action has a script, these are the variable name references for variables used in the script. All variables used in script must be in this list.
    */
   codeVariables?: string[]
   /**
    * Optional. For action type at3DSimMsg, this is the message to be sent to the coupled external simulation.
    */
   sim3DMessage?: string
   /**
    * Optional. For action type at3DSimMsg, this is the name of the coupled external sim to send the message to.
    */
   extSim?: string
   /**
    * Optional. For action type at3DSimMsg and a sim3DMessage of atCompModify, this is the name of the variable in the external simulation to be modified by the message.
    */
   sim3DVariable?: string
   /**
    * Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this flag indicates that the JSON has the properties for sim3DModelRef, sim3DConfigData, and simEndTime.
    */
   openSimVarParams?: boolean
   /**
    * Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the data defined by the user that is used by the external simulation on startup. Typically a path to a model it need to open.
    */
   sim3DModelRef?: string
   /**
    * Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the data defined by the user that is used by the external simulation on startup.
    */
   sim3DConfigData?: string
   /**
    * Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the end simulation time defined by the user that is used by the external simulation on startup.
    */
   simEndTime?: string
   /**
    * Optional. For action type atRunExtApp. It is the C# script to be executed and the result strig  passed as a parameter to the executable to be run.
    */
   makeInputFileCode?: string
   /**
    * Optional. For action type atRunExtApp. It is the path of the exe to be run. It can be relative to the location of the EMRALD model.
    */
   exePath?: string
   /**
    * Optional. For action type atRunExtApp. It is the C# script to be executed after the accociated exe is ran. Typically it reads a result file and script typically returns a string list with +/-[StateName] to shift out or into a state because of the results..
    */
   processOutputFileCode?: string
   /**
    * Used for executing applications with custom form data. This can be anything needed by the custom form, but in the end only the standard atRunExtApp fields are used to do the action.
    */
   formData?: {}
						 
	
   /**
    * Optional. For action type atRunExtApp. It is used for custom app form.
    */
   template?: {}
						 
	
   /**
    * Optional. For action type atRunExtApp. It is flag to indicate the type of return from the processOutputFileCode. If rtNone then it has no return, othrwise the C# script must return a List<string> with +/-[StateName] to shift out or into a state.
    */
   returnProcess?: string
						
	  
																																												 
	  
				  
	  
													   
	  
   NewProperty?: unknown
 }
 export interface Event {
   /**
    * Optional, internal use only.
    */
   id?: number
   /**
    * referenace name in the event in the model.
    */
   name: string
   /**
    * User entered description of the event.
    */
   desc: string
   /**
    * Is this a global item to show up in the global list, If false it showes up in local or all list.
    */
   mainItem: boolean
   evType: EventType
   /**
    * Optional. For event type etStateCng. Flag to indicate if all the items in the triggerStates need to occure as specified or just one of them.
    */
   allItems?: boolean | string
   /**
    * Optional. For event type etStateCng. List of state name references as part of the criteria needed to trigger the event. These are the states that need to be entered or exited to tirgger the event.
    */
   triggerStates?: string[]
   /**
    * Depricated, This is stored in the states eventActions property.
    */
   moveFromCurrent?: boolean
   /**
    * Optional, Name references for all variables used in scripts if the event type uses scripts.
    */
   varNames?: string[]
   /**
    * Optional. For event type etStateCng, flag to indicate that event is triggired when entering or exiting states listed in triggerStates array. On Enter State/s or On Exit State/s
    */
   ifInState?: boolean | string
   /**
    * Optional. For event type etStateCng, flag to indicate that event is triggering needs all the items or just one or rmore from the states listed in triggerStates array. checkbox - All Items
    */
   onSuccess?: boolean | string
   /**
    * Optional. For event type etComponentLogic, flag to indicate that event is triggered if logic tree evaluates to a False, otherwise it triggeres on true.
    */
   triggerOnFalse?: boolean
   /**
    * Optional. For event type etComponentLogic, this is the logic tree name to be evaluated for triggering the event.
    */
   logicTop?: string
   /**
    * Optional. Parameter for a event with type of etFailRate. It is either a number or the name of a variable if useVariable is true
    */
   lambda?: string | number
   /**
    * Optional. arameter for a event with type of etFailRate. It is the lambda value time frequency.
    */
   lambdaTimeRate?: string
   /**
    * Optional. Indicates that variables can be used for the fields
    */
   useVariable?: boolean
   onVarChange?: VarChangeOptions
   /**
    * Optional, For events of type etTimer. This is a time or variable that indicates the time for the event.
    */
   time?: string
   timeVariableUnit?: TimeVariableUnit
   /**
    * Optional, For time based events, is the time from the beginning of the simulation [true] or from when the state was entered.
    */
   fromSimStart?: boolean
   extEventType?: ExtEventMsgType
   /**
    * Optional. For event type et3dSimEv and extEventType etCompEv. It is the reference name for the variable. If that variable is modified by the external code, then the script is executed to determine if the event is triggered.
    */
   variable?: string
   /**
    * Optional. For event type et3dSimEv and extEventType etCompEv. It is the reference name for the variable. If that variable is modified by the external code, then this code script is executed to determine if the event is triggered.
    */
   code?: string
   distType?: DistributionType
   /**
    * Optional. For event type of etDistribution this is an array of properties for the distribution calculation.
    */
   parameters?: {
     /**
      * For event type of etDistribution this is the name of the distribution parameter.
      */
     name:
       | "Mean"
       | "Standard Deviation"
       | "Minimum"
       | "Maximum"
       | "Rate"
       | "Shape"
       | "Scale"
       | "Peak"
     /**
      * Optional. The value of the parameter if the useVariable flag is false. Can be a number or a string if in scientific notation.
      */
     value?: number | string
     timeRate?: TimeVariableUnit
     /**
      * Flag to use the variable string vs the value item for the property
      */
     useVariable: boolean
     /**
      * Optional. The reference name of the variable to use as the value of the parameter if the useVariable flag is true.
      */
     variable?: string
   }[]
   timeRate?: TimeVariableUnit
   rate?: number
   mean?: number
   std?: number
   min?: number
   max?: number
   shape?: number
   scale?: number
   meanTimeRate?: TimeVariableUnit
   stdTimeRate?: TimeVariableUnit
   minTimeRate?: TimeVariableUnit
   maxTimeRate?: TimeVariableUnit
 }
 export interface LogicNode {
   /**
    * Optional, internal use only.
    */
   id?: number
   /**
    * referenace name in the logic node
    */
   name: string
   /**
    * User entered description of the logic node
    */
   desc: string
   gateType: GateType
   /**
    * Depricated, dont use
    */
   rootName?: string
   /**
    * Array of component diagram names that are children of this gate.
    */
   compChildren: string[]
		
												 
		
					
		  
								   
		  
						
								 
		
		
										   
		
						
	  
   /**
    * Array of logic node names that are children of this gate.
    */
   gateChildren: string[]
   /**
    * Flag indicating that this is to be displayed as a tree top in the UI and can be used in an evaluate logic tree event.
    */
   isRoot: boolean
						
 }
 export interface Variable {
  /**
   * Optional, internal use only.
   */
  id?: number
  /**
   * referenace name in the model for the variable
   */
  name: string
  /**
   * User entered description of the variable
   */
  desc?: string
  varScope: VarScope
  /**
   * The default value for the variable.
   */
  value: number | string | boolean
  /**
   * If the varScope is gtDocLink then this is the expression defining path in the document to the variable is linked to. XPath for XML, JSONPath for JSON, or a RegularExpression for txt
   */
  docLink?: string
  docType?: DocVarType
  /**
   * If the varScope is gtDocLink then this is the path to the document the variable is linked to.
   */
  docPath?: string
  /**
   * Flag, if true then the file in the docPath must exist when the simulation starts running. This is helpful to minimize errors.
   */
  pathMustExist?: boolean
  type: VariableType

		
																			 
		
					  
							  
		
																																					
		
						
		
																							
		
					 
  /**
																																																														 
		
							 
	  
	  
   * Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this is the regular expression string.
   */
  regExpLine?: number
  /**
   * Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this the start possition after the regular expression finds its match for reading or writing the value of the variable.
   */
  begPosition?: number
  /**
   * Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this how many characters to read for the value of the variable
   */
  numChars?: number
  /**
   * Optional, this specifies if the value of the variable is to be reset to the default value on each run or retain the value from the last run.
   */
  resetOnRuns?: boolean
  /**
   * Optional. If the variable varScope is gt3DSim, this is the name reference to the external simulation to link to for the value.
   */
  resourceName?: string
  /**
   * Optional. For variables of varScope gt3DSim, this is the external simulations name of the variable. It is used in sending a message to the external simulation.
   */
  sim3DId?: string
  /**
   * Depricated
   */
  modelRef?: {
    [k: string]: unknown
  }
  /**
   * Depricated
   */
  states?: {
    [k: string]: unknown
  }
  /**
   * Depricated
   */
  configData?: {
    [k: string]: unknown
  }
  /**
   * Depricated
   */
  simMaxTime?: {
    [k: string]: unknown
  }
}
 