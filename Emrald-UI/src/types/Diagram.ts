import './ItemTypes'
import './ChangeLog'
import { DiagramType } from './ItemTypes'
import { ChangeLog } from './ChangeLog'

export interface Diagram {
  /**
   * Optional. Only used for internal processing needs.
   */
  id?: string
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
    
  required: boolean
}