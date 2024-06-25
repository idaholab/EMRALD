export interface ExtSim {
    /**
     * Optional, internal use only.
     */
    id?: string
    /**
     * referenace name in the model for the external simulation
     */
    name: string
    /**
     * name of resource type to connect to in MsgServer, not unique if more than one simulation of the same tool
     */
    resourceName: string
    required?: boolean
  }