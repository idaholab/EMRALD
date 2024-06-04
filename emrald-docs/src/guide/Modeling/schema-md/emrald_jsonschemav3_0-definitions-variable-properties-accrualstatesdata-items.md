# items Schema

```txt
EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## items Type

`object` ([items](emrald_jsonschemav3\_0-definitions-variable-properties-accrualstatesdata-items.md))

# items Properties

| Property                      | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                               |
| :---------------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [stateName](#statename)       | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata-items-properties-statename.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/stateName")       |
| [type](#type)                 | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata-items-properties-type.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/type")                 |
| [accrualMult](#accrualmult)   | `number` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata-items-properties-accrualmult.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/accrualMult")   |
| [multRate](#multrate)         | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata-items-properties-multrate.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/multRate")         |
| [accrualTable](#accrualtable) | `array`  | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata-items-properties-accrualtable.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/accrualTable") |

## stateName

Reference name to the state contributiong to the accrual calculation.

`stateName`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-accrualstatesdata-items-properties-statename.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/stateName")

### stateName Type

`string`

## type

Type of accrual for the specified state.

`type`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-accrualstatesdata-items-properties-type.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value            | Explanation |
| :--------------- | :---------- |
| `"ctMultiplier"` |             |
| `"ctTable"`      |             |

## accrualMult

Optional. If type is ctMultiplier then this is the multiplier value for every time increment, specified by the multRate, spent in the state.

`accrualMult`

*   is required

*   Type: `number`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-accrualstatesdata-items-properties-accrualmult.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/accrualMult")

### accrualMult Type

`number`

## multRate

This is the time rate for the accrualMult in calculating the value for the variable.

`multRate`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-accrualstatesdata-items-properties-multrate.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/multRate")

### multRate Type

`string`

## accrualTable

Optional. If the type is ctTable then this is the array of values used in calculating this states contribution to the variable value. Example for the first hour the accrual multiplier is 0.5, for the second hour the accrual multiplier is 0.1

`accrualTable`

*   is required

*   Type: `integer[][]`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-accrualstatesdata-items-properties-accrualtable.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/accrualTable")

### accrualTable Type

`integer[][]`
