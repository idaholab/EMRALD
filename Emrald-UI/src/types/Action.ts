import { ActionType, MainItemType } from './ItemTypes'
import { ChangeLog } from './ChangeLog'

export interface Action {
  /**
   * Optional, internal use only.
   */
  id?: string
  objType: MainItemType
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
   * Is this a global item to show up in the global list, If false it shows up in local or all list.
   */
  mainItem: boolean
  /**
   * Optional. Only one action may be taken so the probability determines if this action is taken vs another in the EventAction list. If false then the probability is used to sample if this action occurred and multiple or no actions could happen when the event is triggered.
   */
  mutExcl?: boolean
  /**
   * Optional. If this is a transition action then these are the states that it could be transitioned to.
   */
  newStates?: NewState[]
  /**
   * Optional. Script code to be executed if the action type has a script
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
   * Optional. For action type atRunExtApp. It is the C# script to be executed and the result string  passed as a parameter to the executable to be run.
   */
  makeInputFileCode?: string
  /**
   * Optional. For action type atRunExtApp. It is the path of the exe to be run. It can be relative to the location of the EMRALD model.
   */
  exePath?: string
  /**
   * Optional. For action type atRunExtApp. It is the C# script to be executed after the associated exe is ran. Typically it reads a result file and script typically returns a string list with +/-[StateName] to shift out or into a state because of the results..
   */
  processOutputFileCode?: string
  /**
   * Used for executing applications with custom form data. This can be anything needed by the custom form, but in the end only the standard atRunExtApp fields are used to do the action.
   */
  formData?: {
    [k: string]: unknown
  }
  /**
   * Optional. For action type atRunExtApp. It is used for custom app form.
   */
  template?: {
    [k: string]: unknown
  }
  /**
   * Optional. For action type atRunExtApp. It is flag to indicate the type of return from the processOutputFileCode. If rtNone then it has no return, otherwise the C# script must return a List<string> with +/-[StateName] to shift out or into a state.
   */
  returnProcess?: string
  changeLog?: ChangeLog
  /**
   * String for the run application action, only for UI used. Options depend on the custom UI forms made. "code" means default user defined pre and post execution code is used.
   */
  raType?: string
  /**
   * Used for custom form, variables used in the form.
   */
  updateVariables?: unknown[]
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean
}

export interface NewState {
  /**
   * reference name of the state to transition to.
   */
  toState: string
  /**
   * probability that this state will be transitioned to.
   */
  prob: number
  /**
   * The description from the user for output if this transition takes place.
   */
  failDesc: string
  /**
   * Optional, if used  then the a variable is used for the probability. This is the name of that variable
   */
  varProb?: null | string
}

