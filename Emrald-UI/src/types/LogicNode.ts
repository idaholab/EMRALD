import {GateType, StateEvalValue} from './ItemTypes'
import {ChangeLog} from './ChangeLog'

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
     * Array of component diagram names and state values to use in evaluating if not using the default value.
     */
    compChildren: {
      /**
       * Evaluate value if not the states default.
       */
      stateValues?: {
        /**
         * State name for the value.
         */
        stateName: string
        stateValue: StateEvalValue
      }[]
      /**
       * Name of the diagram to be evaluated
       */
      diagramName: string
    }[]
    /**
     * Array of logic node names that are children of this gate.
     */
    gateChildren: string[]
    /**
     * Flag indicating that this is to be displayed as a tree top in the UI and can be used in an evaluate logic tree event.
     */
    isRoot: boolean
    changeLog?: ChangeLog
  }