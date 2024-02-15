export interface ExtSim {
    /**
     * Optional, internal use only.
     */
    id?: number
    /**
     * referenace name in the model for the external simulation
     */
    name: string
    /**
     * name of resource type to connect to in MsgServer, not unique if more than one simulation of the same tool
     */
    resourceName: string
  }