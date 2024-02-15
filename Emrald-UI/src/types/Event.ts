import {EventType, VarChangeOptions, ExtEventMsgType, DistributionType, TimeVariableUnit} from './ItemTypes'
import {ChangeLog} from './ChangeLog'

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
    allItems?: boolean
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
    ifInState?: boolean
    /**
     * Optional. For event type etStateCng, flag to indicate that event is triggering needs all the items or just one or rmore from the states listed in triggerStates array. checkbox - All Items
     */
    onSuccess?: boolean
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
        | "Alpha"
        | "Beta"
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
    dfltTimeRate?: TimeVariableUnit
    changeLog?: ChangeLog
  }