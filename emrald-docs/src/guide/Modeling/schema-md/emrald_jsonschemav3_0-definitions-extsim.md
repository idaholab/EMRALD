# ExtSim Schema

```txt
EMRALD_Model#/definitions/ExtSim
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## ExtSim Type

`object` ([ExtSim](emrald_jsonschemav3_0-definitions-extsim.md))

# ExtSim Properties

| Property                      | Type      | Required | Nullable       | Defined by                                                                                                                                      |
| :---------------------------- | :-------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)                     | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-id.md "EMRALD_Model#/definitions/ExtSim/properties/id")                     |
| [objType](#objtype)           | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-objtype.md "EMRALD_Model#/definitions/ExtSim/properties/objType")           |
| [name](#name)                 | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-name.md "EMRALD_Model#/definitions/ExtSim/properties/name")                 |
| [resourceName](#resourcename) | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-resourcename.md "EMRALD_Model#/definitions/ExtSim/properties/resourceName") |
| [required](#required)         | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-required.md "EMRALD_Model#/definitions/ExtSim/properties/required")         |

## id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-id.md "EMRALD_Model#/definitions/ExtSim/properties/id")

### id Type

`string`

## objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-objtype.md "EMRALD_Model#/definitions/ExtSim/properties/objType")

### objType Type

`string`

### objType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value            | Explanation |
| :--------------- | :---------- |
| `"Diagram"`      |             |
| `"State"`        |             |
| `"Action"`       |             |
| `"Event"`        |             |
| `"ExtSim"`       |             |
| `"LogicNode"`    |             |
| `"Variable"`     |             |
| `"EMRALD_Model"` |             |

## name

referenace name in the model for the external simulation

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-name.md "EMRALD_Model#/definitions/ExtSim/properties/name")

### name Type

`string`

## resourceName

name of resource type to connect to in MsgServer, not unique if more than one simulation of the same tool

`resourceName`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-resourcename.md "EMRALD_Model#/definitions/ExtSim/properties/resourceName")

### resourceName Type

`string`

## required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-required.md "EMRALD_Model#/definitions/ExtSim/properties/required")

### required Type

`boolean`
