import './ItemTypes'
import './ChangeLog'
import { DiagramType, MainItemType } from './ItemTypes'
import { ChangeLog } from './ChangeLog'

export interface Diagram {
  /**
   * Optional. Only used for internal processing needs.
   */
  id?: string
  objType: MainItemType
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
  changeLog?: ChangeLog
  /**
   * If this is a template then it indicates the item must exist in the current model before using the template.
   */
  required?: boolean
}