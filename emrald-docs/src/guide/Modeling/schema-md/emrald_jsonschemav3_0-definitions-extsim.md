# ExtSim Schema

```txt
EMRALD_Model#/definitions/ExtSim
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## ExtSim Type

`object` ([ExtSim](emrald_jsonschemav3\_0-definitions-extsim.md))

# ExtSim Properties

| Property                      | Type     | Required | Nullable       | Defined by                                                                                                                                     |
| :---------------------------- | :------- | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)                     | `string` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-extsim-properties-id.md "EMRALD_Model#/definitions/ExtSim/properties/id")                     |
| [name](#name)                 | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-extsim-properties-name.md "EMRALD_Model#/definitions/ExtSim/properties/name")                 |
| [resourceName](#resourcename) | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-extsim-properties-resourcename.md "EMRALD_Model#/definitions/ExtSim/properties/resourceName") |

## id

Optional, internal use only.

`id`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-extsim-properties-id.md "EMRALD_Model#/definitions/ExtSim/properties/id")

### id Type

`string`

## name

referenace name in the model for the external simulation

`name`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-extsim-properties-name.md "EMRALD_Model#/definitions/ExtSim/properties/name")

### name Type

`string`

## resourceName

name of resource type to connect to in MsgServer, not unique if more than one simulation of the same tool

`resourceName`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-extsim-properties-resourcename.md "EMRALD_Model#/definitions/ExtSim/properties/resourceName")

### resourceName Type

`string`
