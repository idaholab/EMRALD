# Variable Schema

```txt
EMRALD_Model#/definitions/Variable
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## Variable Type

`object` ([Variable](emrald_jsonschemav3\_0-definitions-variable.md))

# Variable Properties

| Property                                | Type      | Required | Nullable       | Defined by                                                                                                                                                   |
| :-------------------------------------- | :-------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)                               | `string`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-id.md "EMRALD_Model#/definitions/Variable/properties/id")                               |
| [name](#name)                           | `string`  | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-name.md "EMRALD_Model#/definitions/Variable/properties/name")                           |
| [desc](#desc)                           | `string`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-desc.md "EMRALD_Model#/definitions/Variable/properties/desc")                           |
| [varScope](#varscope)                   | `string`  | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-varscope.md "EMRALD_Model#/definitions/Variable/properties/varScope")                   |
| [value](#value)                         | Merged    | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-value.md "EMRALD_Model#/definitions/Variable/properties/value")                         |
| [docLink](#doclink)                     | `string`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-doclink.md "EMRALD_Model#/definitions/Variable/properties/docLink")                     |
| [docType](#doctype)                     | `string`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-doctype.md "EMRALD_Model#/definitions/Variable/properties/docType")                     |
| [docPath](#docpath)                     | `string`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-docpath.md "EMRALD_Model#/definitions/Variable/properties/docPath")                     |
| [pathMustExist](#pathmustexist)         | `boolean` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-pathmustexist.md "EMRALD_Model#/definitions/Variable/properties/pathMustExist")         |
| [type](#type)                           | `string`  | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-type.md "EMRALD_Model#/definitions/Variable/properties/type")                           |
| [accrualStatesData](#accrualstatesdata) | `array`   | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData") |
| [regExpLine](#regexpline)               | `integer` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-regexpline.md "EMRALD_Model#/definitions/Variable/properties/regExpLine")               |
| [begPosition](#begposition)             | `integer` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-begposition.md "EMRALD_Model#/definitions/Variable/properties/begPosition")             |
| [numChars](#numchars)                   | `integer` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-numchars.md "EMRALD_Model#/definitions/Variable/properties/numChars")                   |
| [resetOnRuns](#resetonruns)             | `boolean` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-resetonruns.md "EMRALD_Model#/definitions/Variable/properties/resetOnRuns")             |
| [resourceName](#resourcename)           | `string`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-resourcename.md "EMRALD_Model#/definitions/Variable/properties/resourceName")           |
| [sim3DId](#sim3did)                     | `string`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-sim3did.md "EMRALD_Model#/definitions/Variable/properties/sim3DId")                     |
| [changeLog](#changelog)                 | `array`   | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Variable/properties/changeLog")                                     |
| [cumulativeStats](#cumulativestats)     | `boolean` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-cumulativestats.md "EMRALD_Model#/definitions/Variable/properties/cumulativeStats")     |
| [monitorInSim](#monitorinsim)           | `boolean` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-monitorinsim.md "EMRALD_Model#/definitions/Variable/properties/monitorInSim")           |
| [canMonitor](#canmonitor)               | `boolean` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-canmonitor.md "EMRALD_Model#/definitions/Variable/properties/canMonitor")               |

## id

Optional, internal use only.

`id`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-id.md "EMRALD_Model#/definitions/Variable/properties/id")

### id Type

`string`

## name

referenace name in the model for the variable

`name`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-name.md "EMRALD_Model#/definitions/Variable/properties/name")

### name Type

`string`

## desc

User entered description of the variable

`desc`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-desc.md "EMRALD_Model#/definitions/Variable/properties/desc")

### desc Type

`string`

## varScope

Context of use for the variable in the model.

`varScope`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-varscope.md "EMRALD_Model#/definitions/Variable/properties/varScope")

### varScope Type

`string`

### varScope Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `"gtDocLink"` |             |
| `"gtAccrual"` |             |
| `"gtGlobal"`  |             |
| `"gt3DSim"`   |             |

## value

The default value for the variable.

`value`

*   is required

*   Type: merged type ([Details](emrald_jsonschemav3\_0-definitions-variable-properties-value.md))

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-value.md "EMRALD_Model#/definitions/Variable/properties/value")

### value Type

merged type ([Details](emrald_jsonschemav3\_0-definitions-variable-properties-value.md))

any of

*   [Untitled number in EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-value-anyof-0.md "check type definition")

*   [Untitled string in EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-value-anyof-1.md "check type definition")

*   [Untitled boolean in EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-value-anyof-2.md "check type definition")

## docLink

If the varScope is gtDocLink then this is the expression defining path in the document to the variable is linked to. XPath for XML, JSONPath for JSON, or a RegularExpression for txt

`docLink`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-doclink.md "EMRALD_Model#/definitions/Variable/properties/docLink")

### docLink Type

`string`

## docType

If the varScope is gtDocLink then this the type of document the variable can be linked to. XML, JSON or PlainText using a regular expression

`docType`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-doctype.md "EMRALD_Model#/definitions/Variable/properties/docType")

### docType Type

`string`

### docType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value           | Explanation |
| :-------------- | :---------- |
| `"dtXML"`       |             |
| `"dtJSON"`      |             |
| `"dtTextRegEx"` |             |

## docPath

If the varScope is gtDocLink then this is the path to the document the variable is linked to.

`docPath`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-docpath.md "EMRALD_Model#/definitions/Variable/properties/docPath")

### docPath Type

`string`

## pathMustExist

Flag, if true then the file in the docPath must exist when the simulation starts running. This is helpful to minimize errors.

`pathMustExist`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-pathmustexist.md "EMRALD_Model#/definitions/Variable/properties/pathMustExist")

### pathMustExist Type

`boolean`

## type

This is the type of the variable, Bool, double, int, string

`type`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-type.md "EMRALD_Model#/definitions/Variable/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"bool"`   |             |
| `"double"` |             |
| `"int"`    |             |
| `"string"` |             |

## accrualStatesData

Optional. If the variable varScope is gtAccrual, then these are the states used for calculating the variables value over time.

`accrualStatesData`

*   is optional

*   Type: `object[]` ([items](emrald_jsonschemav3\_0-definitions-variable-properties-accrualstatesdata-items.md))

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-accrualstatesdata.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData")

### accrualStatesData Type

`object[]` ([items](emrald_jsonschemav3\_0-definitions-variable-properties-accrualstatesdata-items.md))

## regExpLine

Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this is the regular expression string.

`regExpLine`

*   is optional

*   Type: `integer`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-regexpline.md "EMRALD_Model#/definitions/Variable/properties/regExpLine")

### regExpLine Type

`integer`

## begPosition

Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this the start possition after the regular expression finds its match for reading or writing the value of the variable.

`begPosition`

*   is optional

*   Type: `integer`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-begposition.md "EMRALD_Model#/definitions/Variable/properties/begPosition")

### begPosition Type

`integer`

## numChars

Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this how many characters to read for the value of the variable

`numChars`

*   is optional

*   Type: `integer`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-numchars.md "EMRALD_Model#/definitions/Variable/properties/numChars")

### numChars Type

`integer`

## resetOnRuns

Optional, this specifies if the value of the variable is to be reset to the default value on each run or retain the value from the last run.

`resetOnRuns`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-resetonruns.md "EMRALD_Model#/definitions/Variable/properties/resetOnRuns")

### resetOnRuns Type

`boolean`

## resourceName

Optional. If the variable varScope is gt3DSim, this is the name reference to the external simulation to link to for the value.

`resourceName`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-resourcename.md "EMRALD_Model#/definitions/Variable/properties/resourceName")

### resourceName Type

`string`

## sim3DId

Optional. For variables of varScope gt3DSim, this is the external simulations name of the variable. It is used in sending a message to the external simulation.

`sim3DId`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-sim3did.md "EMRALD_Model#/definitions/Variable/properties/sim3DId")

### sim3DId Type

`string`

## changeLog

Type of the diagram.

`changeLog`

*   is optional

*   Type: `object[]` ([items](emrald_jsonschemav3\_0-definitions-changelog-items.md))

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-changelog.md "EMRALD_Model#/definitions/Variable/properties/changeLog")

### changeLog Type

`object[]` ([items](emrald_jsonschemav3\_0-definitions-changelog-items.md))

## cumulativeStats

Flag to indicate the user want to do cumulative statistics in the results.

`cumulativeStats`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-cumulativestats.md "EMRALD_Model#/definitions/Variable/properties/cumulativeStats")

### cumulativeStats Type

`boolean`

## monitorInSim

Flag to have the monitor variable check box checked in the solver by default.

`monitorInSim`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-monitorinsim.md "EMRALD_Model#/definitions/Variable/properties/monitorInSim")

### monitorInSim Type

`boolean`

## canMonitor

Flag to indicate if the variable can be monitored in the solver. This removes it from the solver UI if false. Must be true if monitorInSim is true.

`canMonitor`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-variable-properties-canmonitor.md "EMRALD_Model#/definitions/Variable/properties/canMonitor")

### canMonitor Type

`boolean`
