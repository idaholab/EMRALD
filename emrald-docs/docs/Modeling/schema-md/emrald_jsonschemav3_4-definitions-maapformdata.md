# MAAPFormData Schema

```txt
EMRALD_Model#/definitions/MAAPFormData
```

Form data used by the MAAP form

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPFormData Type

`object` ([MAAPFormData](emrald_jsonschemav3_4-definitions-maapformdata.md))

# MAAPFormData Properties

| Property                                  | Type          | Required | Nullable       | Defined by                                                                                                                                                             |
| :---------------------------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [exePath](#exepath)                       | `string`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-exepath.md "EMRALD_Model#/definitions/MAAPFormData/properties/exePath")                       |
| [sourceElements](#sourceelements)         | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-sourceelements.md "EMRALD_Model#/definitions/MAAPFormData/properties/sourceElements")         |
| [parameters](#parameters)                 | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-parameters.md "EMRALD_Model#/definitions/MAAPFormData/properties/parameters")                 |
| [initiators](#initiators)                 | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-initiators.md "EMRALD_Model#/definitions/MAAPFormData/properties/initiators")                 |
| [inputBlocks](#inputblocks)               | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-inputblocks.md "EMRALD_Model#/definitions/MAAPFormData/properties/inputBlocks")               |
| [fileRefs](#filerefs)                     | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-filerefs.md "EMRALD_Model#/definitions/MAAPFormData/properties/fileRefs")                     |
| [inputPath](#inputpath)                   | `string`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-inputpath.md "EMRALD_Model#/definitions/MAAPFormData/properties/inputPath")                   |
| [parameterPath](#parameterpath)           | `string`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-parameterpath.md "EMRALD_Model#/definitions/MAAPFormData/properties/parameterPath")           |
| [possibleInitiators](#possibleinitiators) | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-possibleinitiators.md "EMRALD_Model#/definitions/MAAPFormData/properties/possibleInitiators") |
| [docLinkVariable](#doclinkvariable)       | `string`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-doclinkvariable.md "EMRALD_Model#/definitions/MAAPFormData/properties/docLinkVariable")       |
| [output](#output)                         | `string`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-output.md "EMRALD_Model#/definitions/MAAPFormData/properties/output")                         |
| [caType](#catype)                         | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-customformtype.md "EMRALD_Model#/definitions/MAAPFormData/properties/caType")                                         |
| [needsUpgrade](#needsupgrade)             | `boolean`     | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-needsupgrade.md "EMRALD_Model#/definitions/MAAPFormData/properties/needsUpgrade")             |

## exePath

The path to the MAAP executable on the user's machine

`exePath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-exepath.md "EMRALD_Model#/definitions/MAAPFormData/properties/exePath")

### exePath Type

`string`

## sourceElements

The contents of original .inp file parsed into JSON

`sourceElements`

* is optional

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-sourceelements.md "EMRALD_Model#/definitions/MAAPFormData/properties/sourceElements")

### sourceElements Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

## parameters

Source elements from the .inp file identified as parameters

`parameters`

* is optional

* Type: `object[]` ([Details](emrald_jsonschemav3_4-definitions-maapassignment.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-parameters.md "EMRALD_Model#/definitions/MAAPFormData/properties/parameters")

### parameters Type

`object[]` ([Details](emrald_jsonschemav3_4-definitions-maapassignment.md))

## initiators

Source elements from the .inp file identified as initiators

`initiators`

* is optional

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-initiators.md "EMRALD_Model#/definitions/MAAPFormData/properties/initiators")

### initiators Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

## inputBlocks

Source elements from the .inp file identified as input blocks (if blocks, when block, etc.)

`inputBlocks`

* is optional

* Type: `object[]` ([MAAPConditionalBlockStatement](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-inputblocks.md "EMRALD_Model#/definitions/MAAPFormData/properties/inputBlocks")

### inputBlocks Type

`object[]` ([MAAPConditionalBlockStatement](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement.md))

## fileRefs

The paths to other files referenced by the .inp and .par files

`fileRefs`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-filerefs.md "EMRALD_Model#/definitions/MAAPFormData/properties/fileRefs")

### fileRefs Type

`string[]`

## inputPath

The full path to the .inp file on the user's machine

`inputPath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-inputpath.md "EMRALD_Model#/definitions/MAAPFormData/properties/inputPath")

### inputPath Type

`string`

## parameterPath

The full path to the .par file on the user's machine

`parameterPath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-parameterpath.md "EMRALD_Model#/definitions/MAAPFormData/properties/parameterPath")

### parameterPath Type

`string`

## possibleInitiators

A list of possible initiators extracted from the .par file

`possibleInitiators`

* is optional

* Type: `object[]` ([MAAPParameter](emrald_jsonschemav3_4-definitions-maapparameter.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-possibleinitiators.md "EMRALD_Model#/definitions/MAAPFormData/properties/possibleInitiators")

### possibleInitiators Type

`object[]` ([MAAPParameter](emrald_jsonschemav3_4-definitions-maapparameter.md))

## docLinkVariable

The doc link variable used to store the results

`docLinkVariable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-doclinkvariable.md "EMRALD_Model#/definitions/MAAPFormData/properties/docLinkVariable")

### docLinkVariable Type

`string`

## output

The MAAP output variable to store in the doc link variable

`output`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-output.md "EMRALD_Model#/definitions/MAAPFormData/properties/output")

### output Type

`string`

## caType



`caType`

* is required

* Type: unknown ([CustomFormType](emrald_jsonschemav3_4-definitions-customformtype.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-customformtype.md "EMRALD_Model#/definitions/MAAPFormData/properties/caType")

### caType Type

unknown ([CustomFormType](emrald_jsonschemav3_4-definitions-customformtype.md))

### caType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value    | Explanation |
| :------- | :---------- |
| `"MAAP"` |             |

## needsUpgrade



`needsUpgrade`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-needsupgrade.md "EMRALD_Model#/definitions/MAAPFormData/properties/needsUpgrade")

### needsUpgrade Type

`boolean`
