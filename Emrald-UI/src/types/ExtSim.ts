import { MainItemType } from "./ItemTypes"

export interface ExtSim {
  /**
   * Optional, internal use only.
   */
  id?: string
  objType: MainItemType
  /**
   * referenace name in the model for the external simulation
   */
  name: string
  /**
   * name of resource type to connect to in MsgServer, not unique if more than one simulation of the same tool
   */
  resourceName: string
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean
}