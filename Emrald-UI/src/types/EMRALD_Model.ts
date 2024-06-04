//import {ItemTypes} from './ItemTypes'
import {Action} from './Action'
import {Diagram} from './Diagram'
import {Event} from './Event'
import {ExtSim} from './ExtSim'
import {Variable} from './Variable'
import {State} from './State'
import {LogicNode} from './LogicNode'
import {ChangeLog} from './ChangeLog'


export const EMRALD_SchemaVersion : number = 3.0;
 /**
  * EMRALD model schema version 3.0
  */
 export interface EMRALD_Model {
   /**
    * Temporary, only used internally for some identification or uniqueness needs
    */
   id?: string
   /**
    * Name of the EMRALD model
    */
   name: string
   /**
    * description of the EMRALD model
    */
   desc: string
   /**
   * Users version of the model
   */
   version: number
   /**
    * EMRALD Scema Version
    */
   emraldVersion: number
   /**
    * All the diagrams for the model
    */
   DiagramList: Diagram[]
   /**
    * All the external simulation links for the mdoel
    */
   ExtSimList: ExtSim[]
   /**
    * All of the states for the different diagrams of the model
    */
   StateList: State[]
   /**
    * All the actions that can be used in the model
    */
   ActionList: Action[]
   /**
    * All the events that are used in the model.
    */
   EventList: Event[]
   /**
    * All the logic nodes to make the logic trees in the model
    */
   LogicNodeList: LogicNode[]
   /**
    * All the variables used in the model
    */
   VariableList: Variable[]
   /**
    * Templates avaliable to make new diagrams in the model. These are basicly a small model all on there own.
    */
   templates?: unknown[]

   group?: any;
   changeLog?: ChangeLog
 }

 export function CreateEmptyEMRALDModel(): EMRALD_Model {
  return {
    name: '',
    desc: '',
    version: 1.0,
    emraldVersion: EMRALD_SchemaVersion,
    DiagramList: [],
    ExtSimList: [],
    StateList: [],
    ActionList: [],
    EventList: [],
    LogicNodeList: [],
    VariableList: [],
  };
}

 




 