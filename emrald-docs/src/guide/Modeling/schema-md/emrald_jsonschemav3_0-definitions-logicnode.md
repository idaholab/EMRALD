# LogicNode Schema

```txt
EMRALD_Model#/definitions/LogicNode
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## LogicNode Type

`object` ([LogicNode](emrald_jsonschemav3\_0-definitions-logicnode.md))

# LogicNode Properties

| Property                      | Type      | Required | Nullable       | Defined by                                                                                                                                           |
| :---------------------------- | :-------- | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)                     | `string`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-id.md "EMRALD_Model#/definitions/LogicNode/properties/id")                     |
| [name](#name)                 | `string`  | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-name.md "EMRALD_Model#/definitions/LogicNode/properties/name")                 |
| [desc](#desc)                 | `string`  | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-desc.md "EMRALD_Model#/definitions/LogicNode/properties/desc")                 |
| [gateType](#gatetype)         | `string`  | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-gatetype.md "EMRALD_Model#/definitions/LogicNode/properties/gateType")         |
| [compChildren](#compchildren) | `array`   | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-compchild.md "EMRALD_Model#/definitions/LogicNode/properties/compChildren")                         |
| [gateChildren](#gatechildren) | `array`   | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-gatechildren.md "EMRALD_Model#/definitions/LogicNode/properties/gateChildren") |
| [isRoot](#isroot)             | `boolean` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-isroot.md "EMRALD_Model#/definitions/LogicNode/properties/isRoot")             |
| [changeLog](#changelog)       | `array`   | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/LogicNode/properties/changeLog")                            |

## id

Optional, internal use only.

`id`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-logicnode-properties-id.md "EMRALD_Model#/definitions/LogicNode/properties/id")

### id Type

`string`

## name

referenace name in the logic node

`name`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-logicnode-properties-name.md "EMRALD_Model#/definitions/LogicNode/properties/name")

### name Type

`string`

## desc

User entered description of the logic node

`desc`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-logicnode-properties-desc.md "EMRALD_Model#/definitions/LogicNode/properties/desc")

### desc Type

`string`

## gateType

Gate type for the logic node

`gateType`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-logicnode-properties-gatetype.md "EMRALD_Model#/definitions/LogicNode/properties/gateType")

### gateType Type

`string`

### gateType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value     | Explanation |
| :-------- | :---------- |
| `"gtAnd"` |             |
| `"gtOr"`  |             |
| `"gtNot"` |             |

## compChildren

Array of component diagram names and state values to use in evaluating if not using the default value.

`compChildren`

*   is required

*   Type: `object[]` ([items](emrald_jsonschemav3\_0-definitions-compchild-items.md))

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-compchild.md "EMRALD_Model#/definitions/LogicNode/properties/compChildren")

### compChildren Type

`object[]` ([items](emrald_jsonschemav3\_0-definitions-compchild-items.md))

## gateChildren

Array of logic node names that are children of this gate.

`gateChildren`

*   is required

*   Type: `string[]`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-logicnode-properties-gatechildren.md "EMRALD_Model#/definitions/LogicNode/properties/gateChildren")

### gateChildren Type

`string[]`

## isRoot

Flag indicating that this is to be displayed as a tree top in the UI and can be used in an evaluate logic tree event.

`isRoot`

*   is required

*   Type: `boolean`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-logicnode-properties-isroot.md "EMRALD_Model#/definitions/LogicNode/properties/isRoot")

### isRoot Type

`boolean`

## changeLog

Type of the diagram.

`changeLog`

*   is optional

*   Type: `object[]` ([items](emrald_jsonschemav3\_0-definitions-changelog-items.md))

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-changelog.md "EMRALD_Model#/definitions/LogicNode/properties/changeLog")

### changeLog Type

`object[]` ([items](emrald_jsonschemav3\_0-definitions-changelog-items.md))
