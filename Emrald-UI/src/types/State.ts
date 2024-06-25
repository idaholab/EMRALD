import {StateType, StateEvalValue, MainItemType} from './ItemTypes'
import {ChangeLog} from './ChangeLog'

/**
 * actions for the events in sibling "events" array. One to one relationship.
 */
type EventActions = EventActionItems[]

interface EventActionItems {
  /**
   * array of referenace names for actions of the associated event.
   */
  actions: string[]
  moveFromCurrent: boolean
}

/**
 * position for the GUI
 */
export interface GeometryInfo {
  x?: number
  y?: number
  width?: number
  height?: number
  [k: string]: unknown
}

export interface State {
  id?: string
  objType: MainItemType
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
  eventActions: EventActions
  geometry?: GeometryInfo
  changeLog?: ChangeLog
  defaultSingleStateValue?: StateEvalValue
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean
}
// export interface State {
//     id?: string
//     /**
//      * referenace name in the model for state
//      */
//     name: string
//     /**
//      * User entered description of the state
//      */
//     desc: string
//     stateType: StateType
//     /**
//      * Diagram the state belongs to, A state can only be in one diagram.
//      */
//     diagramName: string
//     /**
//      * Array of name references for the immediate actions to be run when entering the state
//      */
//     immediateActions: string[]
//     /**
//      * Array of name references to events. These event will be monitored for when in this state.
//      */
//     events: string[]
//     /**
//      * actions for the events in sibling "events" array. One to one relationship.
//      */
//     eventActions: {
//       /**
//        * array of referenace names for actions of the associated event.
//        */
//       actions: string[]
//       moveFromCurrent: boolean
//     }[]
//     /**
//      * possition for the GUI
//      */
//     geometryInfo?: {
//       x: number
//       y: number
//       width: number
//       height: number
//     }
//     changeLog?: ChangeLog
//     defaultSingleStateValue?: StateEvalValue
//   }