# EventDistributionParameter Schema

```txt
EMRALD_Model#/definitions/EventDistributionParameter
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## EventDistributionParameter Type

`object` ([EventDistributionParameter](emrald_jsonschemav3_0-definitions-eventdistributionparameter.md))

# EventDistributionParameter Properties

| Property                    | Type      | Required | Nullable       | Defined by                                                                                                                                                                            |
| :-------------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [name](#name)               | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-name.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/name")               |
| [value](#value)             | Merged    | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/value")             |
| [timeRate](#timerate)       | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-timerate.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/timeRate")       |
| [useVariable](#usevariable) | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-usevariable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/useVariable") |
| [variable](#variable)       | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-variable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/variable")       |

## name

For event type of etDistribution this is the name of the distribution parameter.

`name`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-name.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/name")

### name Type

`string`

### name Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                  | Explanation |
| :--------------------- | :---------- |
| `"Mean"`               |             |
| `"Standard Deviation"` |             |
| `"Minimum"`            |             |
| `"Maximum"`            |             |
| `"Rate"`               |             |
| `"Shape"`              |             |
| `"Scale"`              |             |
| `"Peak"`               |             |
| `"Alpha"`              |             |
| `"Beta"`               |             |

## value

Optional. The value of the parameter if the useVariable flag is false. Can be a number or a string if in scientific notation.

`value`

* is optional

* Type: merged type ([Details](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/value")

### value Type

merged type ([Details](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value.md))

any of

* [Untitled number in EMRALD_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value-anyof-0.md "check type definition")

* [Untitled string in EMRALD_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value-anyof-1.md "check type definition")

## timeRate

Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.

`timeRate`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-timerate.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/timeRate")

### timeRate Type

`string`

### timeRate Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `""`          |             |
| `"trYears"`   |             |
| `"trDays"`    |             |
| `"trHours"`   |             |
| `"trMinutes"` |             |
| `"trSeconds"` |             |

## useVariable

Flag to use the variable string vs the value item for the property

`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-usevariable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/useVariable")

### useVariable Type

`boolean`

## variable

Optional. The reference name of the variable to use as the value of the parameter if the useVariable flag is true.

`variable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-variable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/variable")

### variable Type

`string`
