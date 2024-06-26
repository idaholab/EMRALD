import {VarScope, VariableType, AccrualVarTableType, DocVarType, MainItemType} from './ItemTypes'
import {ChangeLog} from './ChangeLog'

type AccrualStatesData = AccrualStatesDataItems[]
type AccrualTable = number[][]

export interface Variable {
  /**
   * Optional, internal use only.
   */
  id?: string
  objType: MainItemType
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
  accrualStatesData?: AccrualStatesData
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
  changeLog?: ChangeLog
  /**
   * Flag to indicate the user want to do cumulative statistics in the results.
   */
  cumulativeStats?: boolean
  /**
   * Flag to have the monitor variable check box checked in the solver by default.
   */
  monitorInSim?: boolean
  /**
   * Flag to indicate if the variable can be monitored in the solver. This removes it from the solver UI if false. Must be true if monitorInSim is true.
   */
  canMonitor?: boolean
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean
}

interface AccrualStatesDataItems {
  /**
   * Reference name to the state contributiong to the accrual calculation.
   */
  stateName: string
  type: AccrualVarTableType
  /**
   * Optional. If type is ctMultiplier then this is the multiplier value for every time increment, specified by the multRate, spent in the state.
   */
  accrualMult: number
  /**
   * This is the time rate for the accrualMult in calculating the value for the variable.
   */
  multRate: string
  accrualTable: AccrualTable
}