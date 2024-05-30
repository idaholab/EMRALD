# Diagram Schema

```txt
EMRALD_Model#/definitions/Diagram
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## Diagram Type

`object` ([Diagram](emrald_jsonschemav3\_0-definitions-diagram.md))

# Diagram Properties

| Property                            | Type     | Required | Nullable       | Defined by                                                                                                                                             |
| :---------------------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)                           | `string` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-diagram-properties-id.md "EMRALD_Model#/definitions/Diagram/properties/id")                           |
| [name](#name)                       | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-diagram-properties-name.md "EMRALD_Model#/definitions/Diagram/properties/name")                       |
| [desc](#desc)                       | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-diagram-properties-desc.md "EMRALD_Model#/definitions/Diagram/properties/desc")                       |
| [diagramType](#diagramtype)         | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-diagram-properties-diagramtype.md "EMRALD_Model#/definitions/Diagram/properties/diagramType")         |
| [diagramTemplate](#diagramtemplate) | `string` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-diagram-properties-diagramtemplate.md "EMRALD_Model#/definitions/Diagram/properties/diagramTemplate") |
| [diagramLabel](#diagramlabel)       | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-diagram-properties-diagramlabel.md "EMRALD_Model#/definitions/Diagram/properties/diagramLabel")       |
| [states](#states)                   | `array`  | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-diagram-properties-states.md "EMRALD_Model#/definitions/Diagram/properties/states")                   |
| [changeLog](#changelog)             | `array`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Diagram/properties/changeLog")                                |

## id

Optional. Only used for internal processing needs.

`id`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-diagram-properties-id.md "EMRALD_Model#/definitions/Diagram/properties/id")

### id Type

`string`

## name

Name of the diagram

`name`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-diagram-properties-name.md "EMRALD_Model#/definitions/Diagram/properties/name")

### name Type

`string`

## desc

description of the diagram

`desc`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-diagram-properties-desc.md "EMRALD_Model#/definitions/Diagram/properties/desc")

### desc Type

`string`

## diagramType

Type of the diagram. dtSingle - means you can only be in one state of the diagram at a time and states evaluate to a value. dtMulti - means you can be in multiple states at a time, but cant evaluate the diagram

`diagramType`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-diagram-properties-diagramtype.md "EMRALD_Model#/definitions/Diagram/properties/diagramType")

### diagramType Type

`string`

### diagramType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"dtSingle"` |             |
| `"dtMulti"`  |             |

## diagramTemplate

name of template used to make this diagram

`diagramTemplate`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-diagram-properties-diagramtemplate.md "EMRALD_Model#/definitions/Diagram/properties/diagramTemplate")

### diagramTemplate Type

`string`

## diagramLabel

Name of grouping in the UI for this diagram

`diagramLabel`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-diagram-properties-diagramlabel.md "EMRALD_Model#/definitions/Diagram/properties/diagramLabel")

### diagramLabel Type

`string`

## states

Names of the states used in this diagram

`states`

*   is required

*   Type: `string[]`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-diagram-properties-states.md "EMRALD_Model#/definitions/Diagram/properties/states")

### states Type

`string[]`

## changeLog

Type of the diagram.

`changeLog`

*   is optional

*   Type: `object[]` ([items](emrald_jsonschemav3\_0-definitions-changelog-items.md))

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-changelog.md "EMRALD_Model#/definitions/Diagram/properties/changeLog")

### changeLog Type

`object[]` ([items](emrald_jsonschemav3\_0-definitions-changelog-items.md))
