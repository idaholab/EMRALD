# State Schema

```txt
EMRALD_Model#/definitions/State
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## State Type

`object` ([State](emrald_jsonschemav3_0-definitions-state.md))

# State Properties

| Property                                            | Type      | Required | Nullable       | Defined by                                                                                                                                                          |
| :-------------------------------------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [id](#id)                                           | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-id.md "EMRALD_Model#/definitions/State/properties/id")                                           |
| [objType](#objtype)                                 | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-objtype.md "EMRALD_Model#/definitions/State/properties/objType")                                 |
| [name](#name)                                       | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-name.md "EMRALD_Model#/definitions/State/properties/name")                                       |
| [desc](#desc)                                       | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-desc.md "EMRALD_Model#/definitions/State/properties/desc")                                       |
| [stateType](#statetype)                             | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-statetype.md "EMRALD_Model#/definitions/State/properties/stateType")                             |
| [diagramName](#diagramname)                         | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-diagramname.md "EMRALD_Model#/definitions/State/properties/diagramName")                         |
| [immediateActions](#immediateactions)               | `array`   | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-immediateactions.md "EMRALD_Model#/definitions/State/properties/immediateActions")               |
| [events](#events)                                   | `array`   | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-events.md "EMRALD_Model#/definitions/State/properties/events")                                   |
| [eventActions](#eventactions)                       | `array`   | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-eventactions.md "EMRALD_Model#/definitions/State/properties/eventActions")                       |
| [geometry](#geometry)                               | `object`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo.md "EMRALD_Model#/definitions/State/properties/geometry")                                            |
| [changeLog](#changelog)                             | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/State/properties/changeLog")                                              |
| [defaultSingleStateValue](#defaultsinglestatevalue) | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-defaultsinglestatevalue.md "EMRALD_Model#/definitions/State/properties/defaultSingleStateValue") |
| [required](#required)                               | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-required.md "EMRALD_Model#/definitions/State/properties/required")                               |

## id



`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-id.md "EMRALD_Model#/definitions/State/properties/id")

### id Type

`string`

## objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-objtype.md "EMRALD_Model#/definitions/State/properties/objType")

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

referenace name in the model for state

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-name.md "EMRALD_Model#/definitions/State/properties/name")

### name Type

`string`

## desc

User entered description of the state

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-desc.md "EMRALD_Model#/definitions/State/properties/desc")

### desc Type

`string`

## stateType

Type of the state

`stateType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-statetype.md "EMRALD_Model#/definitions/State/properties/stateType")

### stateType Type

`string`

### stateType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value          | Explanation |
| :------------- | :---------- |
| `"stStart"`    |             |
| `"stKeyState"` |             |
| `"stStandard"` |             |
| `"stTerminal"` |             |

## diagramName

Diagram the state belongs to, A state can only be in one diagram.

`diagramName`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-diagramname.md "EMRALD_Model#/definitions/State/properties/diagramName")

### diagramName Type

`string`

## immediateActions

Array of name references for the immediate actions to be run when entering the state

`immediateActions`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-immediateactions.md "EMRALD_Model#/definitions/State/properties/immediateActions")

### immediateActions Type

`string[]`

## events

Array of name references to events. These event will be monitored for when in this state.

`events`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-events.md "EMRALD_Model#/definitions/State/properties/events")

### events Type

`string[]`

## eventActions

actions for the events in sibling "events" array. One to one relationship.

`eventActions`

* is required

* Type: `object[]` ([EventActionItems](emrald_jsonschemav3_0-definitions-state-properties-eventactions-eventactionitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-eventactions.md "EMRALD_Model#/definitions/State/properties/eventActions")

### eventActions Type

`object[]` ([EventActionItems](emrald_jsonschemav3_0-definitions-state-properties-eventactions-eventactionitems.md))

## geometry

position for the GUI

`geometry`

* is optional

* Type: `object` ([GeometryInfo](emrald_jsonschemav3_0-definitions-geometryinfo.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo.md "EMRALD_Model#/definitions/State/properties/geometry")

### geometry Type

`object` ([GeometryInfo](emrald_jsonschemav3_0-definitions-geometryinfo.md))

## changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/State/properties/changeLog")

### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

## defaultSingleStateValue

For single state diagrams. Boolean value for the diagram when evaluated in a logic tree. Ignore - removes that item from the logic calculation.

`defaultSingleStateValue`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-defaultsinglestatevalue.md "EMRALD_Model#/definitions/State/properties/defaultSingleStateValue")

### defaultSingleStateValue Type

`string`

### defaultSingleStateValue Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"True"`   |             |
| `"False"`  |             |
| `"Ignore"` |             |

## required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-required.md "EMRALD_Model#/definitions/State/properties/required")

### required Type

`boolean`
