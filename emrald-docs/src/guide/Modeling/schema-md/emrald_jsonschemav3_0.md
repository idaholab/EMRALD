# EMRALD\_Model Schema

```txt
EMRALD_Model
```

EMRALD model schema version 3.0

| Abstract               | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                        |
| :--------------------- | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------ |
| Cannot be instantiated | Yes        | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_0.json](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## EMRALD\_Model Type

`object` ([EMRALD\_Model](emrald_jsonschemav3_0.md))

all of

* [Main_Model](emrald_jsonschemav3_0-definitions-main_model.md "check type definition")

* [Templates](emrald_jsonschemav3_0-allof-templates.md "check type definition")

# EMRALD\_Model Definitions

## Definitions group MainModel

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MainModel"}
```

| Property                        | Type     | Required | Nullable       | Defined by                                                                                                                                               |
| :------------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)                       | `string` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-id.md "EMRALD_Model#/definitions/MainModel/properties/id")                       |
| [objType](#objtype)             | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-objtype.md "EMRALD_Model#/definitions/MainModel/properties/objType")             |
| [name](#name)                   | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-name.md "EMRALD_Model#/definitions/MainModel/properties/name")                   |
| [desc](#desc)                   | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-desc.md "EMRALD_Model#/definitions/MainModel/properties/desc")                   |
| [emraldVersion](#emraldversion) | `number` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-emraldversion.md "EMRALD_Model#/definitions/MainModel/properties/emraldVersion") |
| [version](#version)             | `number` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-version.md "EMRALD_Model#/definitions/MainModel/properties/version")             |
| [DiagramList](#diagramlist)     | `array`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-diagramlist.md "EMRALD_Model#/definitions/MainModel/properties/DiagramList")     |
| [ExtSimList](#extsimlist)       | `array`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-extsimlist.md "EMRALD_Model#/definitions/MainModel/properties/ExtSimList")       |
| [StateList](#statelist)         | `array`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-statelist.md "EMRALD_Model#/definitions/MainModel/properties/StateList")         |
| [ActionList](#actionlist)       | `array`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-actionlist.md "EMRALD_Model#/definitions/MainModel/properties/ActionList")       |
| [EventList](#eventlist)         | `array`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-eventlist.md "EMRALD_Model#/definitions/MainModel/properties/EventList")         |
| [LogicNodeList](#logicnodelist) | `array`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-logicnodelist.md "EMRALD_Model#/definitions/MainModel/properties/LogicNodeList") |
| [VariableList](#variablelist)   | `array`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-variablelist.md "EMRALD_Model#/definitions/MainModel/properties/VariableList")   |
| [changeLog](#changelog)         | `array`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/MainModel/properties/changeLog")                               |
| [group](#group)                 | `object` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-group.md "EMRALD_Model#/definitions/MainModel/properties/group")                                       |

### id

Temporary, only used internally for some identification or uniqueness needs

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-id.md "EMRALD_Model#/definitions/MainModel/properties/id")

#### id Type

`string`

### objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-objtype.md "EMRALD_Model#/definitions/MainModel/properties/objType")

#### objType Type

`string`

#### objType Constraints

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

### name

Name of the EMRALD model

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-name.md "EMRALD_Model#/definitions/MainModel/properties/name")

#### name Type

`string`

### desc

description of the EMRALD model

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-desc.md "EMRALD_Model#/definitions/MainModel/properties/desc")

#### desc Type

`string`

### emraldVersion

Version of the EMRALD model schema

`emraldVersion`

* is optional

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-emraldversion.md "EMRALD_Model#/definitions/MainModel/properties/emraldVersion")

#### emraldVersion Type

`number`

### version

Version of the users model

`version`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-version.md "EMRALD_Model#/definitions/MainModel/properties/version")

#### version Type

`number`

### DiagramList

All the diagrams for the model

`DiagramList`

* is required

* Type: `object[]` ([Diagram](emrald_jsonschemav3_0-definitions-diagram.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-diagramlist.md "EMRALD_Model#/definitions/MainModel/properties/DiagramList")

#### DiagramList Type

`object[]` ([Diagram](emrald_jsonschemav3_0-definitions-diagram.md))

### ExtSimList

All the external simulation links for the mdoel

`ExtSimList`

* is required

* Type: `object[]` ([ExtSim](emrald_jsonschemav3_0-definitions-extsim.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-extsimlist.md "EMRALD_Model#/definitions/MainModel/properties/ExtSimList")

#### ExtSimList Type

`object[]` ([ExtSim](emrald_jsonschemav3_0-definitions-extsim.md))

### StateList

All of the states for the different diagrams of the model

`StateList`

* is required

* Type: `object[]` ([State](emrald_jsonschemav3_0-definitions-state.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-statelist.md "EMRALD_Model#/definitions/MainModel/properties/StateList")

#### StateList Type

`object[]` ([State](emrald_jsonschemav3_0-definitions-state.md))

### ActionList

All the actions that can be used in the model

`ActionList`

* is required

* Type: `object[]` ([Action](emrald_jsonschemav3_0-definitions-action.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-actionlist.md "EMRALD_Model#/definitions/MainModel/properties/ActionList")

#### ActionList Type

`object[]` ([Action](emrald_jsonschemav3_0-definitions-action.md))

### EventList

All the events that are used in the model.

`EventList`

* is required

* Type: `object[]` ([Event](emrald_jsonschemav3_0-definitions-event.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-eventlist.md "EMRALD_Model#/definitions/MainModel/properties/EventList")

#### EventList Type

`object[]` ([Event](emrald_jsonschemav3_0-definitions-event.md))

### LogicNodeList

All the logic nodes to make the logic trees in the model

`LogicNodeList`

* is required

* Type: `object[]` ([LogicNode](emrald_jsonschemav3_0-definitions-logicnode.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-logicnodelist.md "EMRALD_Model#/definitions/MainModel/properties/LogicNodeList")

#### LogicNodeList Type

`object[]` ([LogicNode](emrald_jsonschemav3_0-definitions-logicnode.md))

### VariableList

All the variables used in the model

`VariableList`

* is required

* Type: `object[]` ([Variable](emrald_jsonschemav3_0-definitions-variable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-main_model-properties-variablelist.md "EMRALD_Model#/definitions/MainModel/properties/VariableList")

#### VariableList Type

`object[]` ([Variable](emrald_jsonschemav3_0-definitions-variable.md))

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/MainModel/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

### group

What catagory grouping this item belongs to. Used to indicate a group for and EMRALD model template

`group`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_0-definitions-group.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-group.md "EMRALD_Model#/definitions/MainModel/properties/group")

#### group Type

`object` ([Details](emrald_jsonschemav3_0-definitions-group.md))

## Definitions group Diagram

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/Diagram"}
```

| Property                            | Type      | Required | Nullable       | Defined by                                                                                                                                              |
| :---------------------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [id](#id-1)                         | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-id.md "EMRALD_Model#/definitions/Diagram/properties/id")                           |
| [objType](#objtype-1)               | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-objtype.md "EMRALD_Model#/definitions/Diagram/properties/objType")                 |
| [name](#name-1)                     | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-name.md "EMRALD_Model#/definitions/Diagram/properties/name")                       |
| [desc](#desc-1)                     | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-desc.md "EMRALD_Model#/definitions/Diagram/properties/desc")                       |
| [diagramType](#diagramtype)         | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-diagramtype.md "EMRALD_Model#/definitions/Diagram/properties/diagramType")         |
| [diagramTemplate](#diagramtemplate) | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-diagramtemplate.md "EMRALD_Model#/definitions/Diagram/properties/diagramTemplate") |
| [diagramLabel](#diagramlabel)       | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-diagramlabel.md "EMRALD_Model#/definitions/Diagram/properties/diagramLabel")       |
| [states](#states)                   | `array`   | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-states.md "EMRALD_Model#/definitions/Diagram/properties/states")                   |
| [changeLog](#changelog-1)           | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Diagram/properties/changeLog")                                |
| [required](#required)               | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-required.md "EMRALD_Model#/definitions/Diagram/properties/required")               |

### id

Optional. Only used for internal processing needs.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-id.md "EMRALD_Model#/definitions/Diagram/properties/id")

#### id Type

`string`

### objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-objtype.md "EMRALD_Model#/definitions/Diagram/properties/objType")

#### objType Type

`string`

#### objType Constraints

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

### name

Name of the diagram

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-name.md "EMRALD_Model#/definitions/Diagram/properties/name")

#### name Type

`string`

### desc

description of the diagram

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-desc.md "EMRALD_Model#/definitions/Diagram/properties/desc")

#### desc Type

`string`

### diagramType

Type of the diagram. dtSingle - means you can only be in one state of the diagram at a time and states evaluate to a value. dtMulti - means you can be in multiple states at a time, but cant evaluate the diagram

`diagramType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-diagramtype.md "EMRALD_Model#/definitions/Diagram/properties/diagramType")

#### diagramType Type

`string`

#### diagramType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"dtSingle"` |             |
| `"dtMulti"`  |             |

### diagramTemplate

name of template used to make this diagram

`diagramTemplate`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-diagramtemplate.md "EMRALD_Model#/definitions/Diagram/properties/diagramTemplate")

#### diagramTemplate Type

`string`

### diagramLabel

Name of grouping in the UI for this diagram

`diagramLabel`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-diagramlabel.md "EMRALD_Model#/definitions/Diagram/properties/diagramLabel")

#### diagramLabel Type

`string`

### states

Names of the states used in this diagram

`states`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-states.md "EMRALD_Model#/definitions/Diagram/properties/states")

#### states Type

`string[]`

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Diagram/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-diagram-properties-required.md "EMRALD_Model#/definitions/Diagram/properties/required")

#### required Type

`boolean`

## Definitions group ExtSim

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/ExtSim"}
```

| Property                      | Type      | Required | Nullable       | Defined by                                                                                                                                      |
| :---------------------------- | :-------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id-2)                   | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-id.md "EMRALD_Model#/definitions/ExtSim/properties/id")                     |
| [objType](#objtype-2)         | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-objtype.md "EMRALD_Model#/definitions/ExtSim/properties/objType")           |
| [name](#name-2)               | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-name.md "EMRALD_Model#/definitions/ExtSim/properties/name")                 |
| [resourceName](#resourcename) | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-resourcename.md "EMRALD_Model#/definitions/ExtSim/properties/resourceName") |
| [required](#required-1)       | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-required.md "EMRALD_Model#/definitions/ExtSim/properties/required")         |

### id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-id.md "EMRALD_Model#/definitions/ExtSim/properties/id")

#### id Type

`string`

### objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-objtype.md "EMRALD_Model#/definitions/ExtSim/properties/objType")

#### objType Type

`string`

#### objType Constraints

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

### name

referenace name in the model for the external simulation

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-name.md "EMRALD_Model#/definitions/ExtSim/properties/name")

#### name Type

`string`

### resourceName

name of resource type to connect to in MsgServer, not unique if more than one simulation of the same tool

`resourceName`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-resourcename.md "EMRALD_Model#/definitions/ExtSim/properties/resourceName")

#### resourceName Type

`string`

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-extsim-properties-required.md "EMRALD_Model#/definitions/ExtSim/properties/required")

#### required Type

`boolean`

## Definitions group State

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/State"}
```

| Property                                            | Type      | Required | Nullable       | Defined by                                                                                                                                                          |
| :-------------------------------------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [id](#id-3)                                         | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-id.md "EMRALD_Model#/definitions/State/properties/id")                                           |
| [objType](#objtype-3)                               | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-objtype.md "EMRALD_Model#/definitions/State/properties/objType")                                 |
| [name](#name-3)                                     | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-name.md "EMRALD_Model#/definitions/State/properties/name")                                       |
| [desc](#desc-2)                                     | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-desc.md "EMRALD_Model#/definitions/State/properties/desc")                                       |
| [stateType](#statetype)                             | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-statetype.md "EMRALD_Model#/definitions/State/properties/stateType")                             |
| [diagramName](#diagramname)                         | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-diagramname.md "EMRALD_Model#/definitions/State/properties/diagramName")                         |
| [immediateActions](#immediateactions)               | `array`   | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-immediateactions.md "EMRALD_Model#/definitions/State/properties/immediateActions")               |
| [events](#events)                                   | `array`   | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-events.md "EMRALD_Model#/definitions/State/properties/events")                                   |
| [eventActions](#eventactions)                       | `array`   | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-eventactions.md "EMRALD_Model#/definitions/State/properties/eventActions")                       |
| [geometry](#geometry)                               | `object`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo.md "EMRALD_Model#/definitions/State/properties/geometry")                                            |
| [changeLog](#changelog-2)                           | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/State/properties/changeLog")                                              |
| [defaultSingleStateValue](#defaultsinglestatevalue) | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-defaultsinglestatevalue.md "EMRALD_Model#/definitions/State/properties/defaultSingleStateValue") |
| [required](#required-2)                             | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-required.md "EMRALD_Model#/definitions/State/properties/required")                               |

### id



`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-id.md "EMRALD_Model#/definitions/State/properties/id")

#### id Type

`string`

### objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-objtype.md "EMRALD_Model#/definitions/State/properties/objType")

#### objType Type

`string`

#### objType Constraints

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

### name

referenace name in the model for state

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-name.md "EMRALD_Model#/definitions/State/properties/name")

#### name Type

`string`

### desc

User entered description of the state

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-desc.md "EMRALD_Model#/definitions/State/properties/desc")

#### desc Type

`string`

### stateType

Type of the state

`stateType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-statetype.md "EMRALD_Model#/definitions/State/properties/stateType")

#### stateType Type

`string`

#### stateType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value          | Explanation |
| :------------- | :---------- |
| `"stStart"`    |             |
| `"stKeyState"` |             |
| `"stStandard"` |             |
| `"stTerminal"` |             |

### diagramName

Diagram the state belongs to, A state can only be in one diagram.

`diagramName`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-diagramname.md "EMRALD_Model#/definitions/State/properties/diagramName")

#### diagramName Type

`string`

### immediateActions

Array of name references for the immediate actions to be run when entering the state

`immediateActions`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-immediateactions.md "EMRALD_Model#/definitions/State/properties/immediateActions")

#### immediateActions Type

`string[]`

### events

Array of name references to events. These event will be monitored for when in this state.

`events`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-events.md "EMRALD_Model#/definitions/State/properties/events")

#### events Type

`string[]`

### eventActions

actions for the events in sibling "events" array. One to one relationship.

`eventActions`

* is required

* Type: `object[]` ([EventActionItems](emrald_jsonschemav3_0-definitions-state-properties-eventactions-eventactionitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-eventactions.md "EMRALD_Model#/definitions/State/properties/eventActions")

#### eventActions Type

`object[]` ([EventActionItems](emrald_jsonschemav3_0-definitions-state-properties-eventactions-eventactionitems.md))

### geometry

position for the GUI

`geometry`

* is optional

* Type: `object` ([GeometryInfo](emrald_jsonschemav3_0-definitions-geometryinfo.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo.md "EMRALD_Model#/definitions/State/properties/geometry")

#### geometry Type

`object` ([GeometryInfo](emrald_jsonschemav3_0-definitions-geometryinfo.md))

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/State/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

### defaultSingleStateValue

For single state diagrams. Boolean value for the diagram when evaluated in a logic tree. Ignore - removes that item from the logic calculation.

`defaultSingleStateValue`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-defaultsinglestatevalue.md "EMRALD_Model#/definitions/State/properties/defaultSingleStateValue")

#### defaultSingleStateValue Type

`string`

#### defaultSingleStateValue Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"True"`   |             |
| `"False"`  |             |
| `"Ignore"` |             |

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-state-properties-required.md "EMRALD_Model#/definitions/State/properties/required")

#### required Type

`boolean`

## Definitions group Action

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/Action"}
```

| Property                                        | Type          | Required | Nullable       | Defined by                                                                                                                                                        |
| :---------------------------------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id-4)                                     | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-id.md "EMRALD_Model#/definitions/Action/properties/id")                                       |
| [objType](#objtype-4)                           | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-objtype.md "EMRALD_Model#/definitions/Action/properties/objType")                             |
| [name](#name-4)                                 | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-name.md "EMRALD_Model#/definitions/Action/properties/name")                                   |
| [desc](#desc-3)                                 | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-desc.md "EMRALD_Model#/definitions/Action/properties/desc")                                   |
| [actType](#acttype)                             | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-acttype.md "EMRALD_Model#/definitions/Action/properties/actType")                             |
| [mainItem](#mainitem)                           | `boolean`     | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-mainitem.md "EMRALD_Model#/definitions/Action/properties/mainItem")                           |
| [mutExcl](#mutexcl)                             | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-mutexcl.md "EMRALD_Model#/definitions/Action/properties/mutExcl")                             |
| [newStates](#newstates)                         | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-newstates.md "EMRALD_Model#/definitions/Action/properties/newStates")                         |
| [scriptCode](#scriptcode)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-scriptcode.md "EMRALD_Model#/definitions/Action/properties/scriptCode")                       |
| [variableName](#variablename)                   | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-variablename.md "EMRALD_Model#/definitions/Action/properties/variableName")                   |
| [codeVariables](#codevariables)                 | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-codevariables.md "EMRALD_Model#/definitions/Action/properties/codeVariables")                 |
| [sim3DMessage](#sim3dmessage)                   | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dmessage.md "EMRALD_Model#/definitions/Action/properties/sim3DMessage")                   |
| [extSim](#extsim)                               | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-extsim.md "EMRALD_Model#/definitions/Action/properties/extSim")                               |
| [sim3DVariable](#sim3dvariable)                 | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dvariable.md "EMRALD_Model#/definitions/Action/properties/sim3DVariable")                 |
| [openSimVarParams](#opensimvarparams)           | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-opensimvarparams.md "EMRALD_Model#/definitions/Action/properties/openSimVarParams")           |
| [sim3DModelRef](#sim3dmodelref)                 | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dmodelref.md "EMRALD_Model#/definitions/Action/properties/sim3DModelRef")                 |
| [sim3DConfigData](#sim3dconfigdata)             | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dconfigdata.md "EMRALD_Model#/definitions/Action/properties/sim3DConfigData")             |
| [simEndTime](#simendtime)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-simendtime.md "EMRALD_Model#/definitions/Action/properties/simEndTime")                       |
| [makeInputFileCode](#makeinputfilecode)         | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-makeinputfilecode.md "EMRALD_Model#/definitions/Action/properties/makeInputFileCode")         |
| [exePath](#exepath)                             | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-exepath.md "EMRALD_Model#/definitions/Action/properties/exePath")                             |
| [processOutputFileCode](#processoutputfilecode) | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-processoutputfilecode.md "EMRALD_Model#/definitions/Action/properties/processOutputFileCode") |
| [formData](#formdata)                           | Not specified | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-formdata.md "EMRALD_Model#/definitions/Action/properties/formData")                           |
| [template](#template)                           | `object`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-template.md "EMRALD_Model#/definitions/Action/properties/template")                           |
| [returnProcess](#returnprocess)                 | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-returnprocess.md "EMRALD_Model#/definitions/Action/properties/returnProcess")                 |
| [changeLog](#changelog-3)                       | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Action/properties/changeLog")                                           |
| [raType](#ratype)                               | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-ratype.md "EMRALD_Model#/definitions/Action/properties/raType")                               |
| [updateVariables](#updatevariables)             | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-updatevariables.md "EMRALD_Model#/definitions/Action/properties/updateVariables")             |
| [required](#required-3)                         | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-required.md "EMRALD_Model#/definitions/Action/properties/required")                           |

### id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-id.md "EMRALD_Model#/definitions/Action/properties/id")

#### id Type

`string`

### objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-objtype.md "EMRALD_Model#/definitions/Action/properties/objType")

#### objType Type

`string`

#### objType Constraints

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

### name

referenace name in the model for the action

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-name.md "EMRALD_Model#/definitions/Action/properties/name")

#### name Type

`string`

### desc

User entered description of the action

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-desc.md "EMRALD_Model#/definitions/Action/properties/desc")

#### desc Type

`string`

### actType

The type of action

`actType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-acttype.md "EMRALD_Model#/definitions/Action/properties/actType")

#### actType Type

`string`

#### actType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value            | Explanation |
| :--------------- | :---------- |
| `"atTransition"` |             |
| `"atCngVarVal"`  |             |
| `"at3DSimMsg"`   |             |
| `"atRunExtApp"`  |             |

### mainItem

Is this a global item to show up in the global list, If false it showes up in local or all list.

`mainItem`

* is required

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-mainitem.md "EMRALD_Model#/definitions/Action/properties/mainItem")

#### mainItem Type

`boolean`

### mutExcl

Optional. Only one action may be taken so the probability determines if this action is taken vs another in the EventAction list. If false then the probability is used to sample if this action occured and multiple or no actions could happen when the event is triggered.

`mutExcl`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-mutexcl.md "EMRALD_Model#/definitions/Action/properties/mutExcl")

#### mutExcl Type

`boolean`

### newStates

Optional. If this is a transition action then these are the states that it could be transitioned to.

`newStates`

* is optional

* Type: `object[]` ([NewState](emrald_jsonschemav3_0-definitions-newstate.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-newstates.md "EMRALD_Model#/definitions/Action/properties/newStates")

#### newStates Type

`object[]` ([NewState](emrald_jsonschemav3_0-definitions-newstate.md))

### scriptCode

Optionsl. Script code to be executed if the action type has a script

`scriptCode`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-scriptcode.md "EMRALD_Model#/definitions/Action/properties/scriptCode")

#### scriptCode Type

`string`

### variableName

Optional. For change var value actions, the result of the script is assigned to this variable name reference.

`variableName`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-variablename.md "EMRALD_Model#/definitions/Action/properties/variableName")

#### variableName Type

`string`

### codeVariables

Optional. If action has a script, these are the variable name references for variables used in the script. All variables used in script must be in this list.

`codeVariables`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-codevariables.md "EMRALD_Model#/definitions/Action/properties/codeVariables")

#### codeVariables Type

`string[]`

### sim3DMessage

Optional. For action type at3DSimMsg, this is the message to be sent to the coupled external simulation.

`sim3DMessage`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dmessage.md "EMRALD_Model#/definitions/Action/properties/sim3DMessage")

#### sim3DMessage Type

`string`

### extSim

Optional. For action type at3DSimMsg, this is the name of the coupled external sim to send the message to.

`extSim`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-extsim.md "EMRALD_Model#/definitions/Action/properties/extSim")

#### extSim Type

`string`

### sim3DVariable

Optional. For action type at3DSimMsg and a sim3DMessage of atCompModify, this is the name of the variable in the external simulation to be modified by the message.

`sim3DVariable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dvariable.md "EMRALD_Model#/definitions/Action/properties/sim3DVariable")

#### sim3DVariable Type

`string`

### openSimVarParams

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this flag indicates that the JSON has the properties for sim3DModelRef, sim3DConfigData, and simEndTime.

`openSimVarParams`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-opensimvarparams.md "EMRALD_Model#/definitions/Action/properties/openSimVarParams")

#### openSimVarParams Type

`boolean`

### sim3DModelRef

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the data defined by the user that is used by the external simulation on startup. Typically a path to a model it need to open.

`sim3DModelRef`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dmodelref.md "EMRALD_Model#/definitions/Action/properties/sim3DModelRef")

#### sim3DModelRef Type

`string`

### sim3DConfigData

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the data defined by the user that is used by the external simulation on startup.

`sim3DConfigData`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dconfigdata.md "EMRALD_Model#/definitions/Action/properties/sim3DConfigData")

#### sim3DConfigData Type

`string`

### simEndTime

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the end simulation time defined by the user that is used by the external simulation on startup.

`simEndTime`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-simendtime.md "EMRALD_Model#/definitions/Action/properties/simEndTime")

#### simEndTime Type

`string`

### makeInputFileCode

Optional. For action type atRunExtApp. It is the C# script to be executed and the result strig  passed as a parameter to the executable to be run.

`makeInputFileCode`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-makeinputfilecode.md "EMRALD_Model#/definitions/Action/properties/makeInputFileCode")

#### makeInputFileCode Type

`string`

### exePath

Optional. For action type atRunExtApp. It is the path of the exe to be run. It can be relative to the location of the EMRALD model.

`exePath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-exepath.md "EMRALD_Model#/definitions/Action/properties/exePath")

#### exePath Type

`string`

### processOutputFileCode

Optional. For action type atRunExtApp. It is the C# script to be executed after the accociated exe is ran. Typically it reads a result file and script typically returns a string list with +/-\[StateName] to shift out or into a state because of the results..

`processOutputFileCode`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-processoutputfilecode.md "EMRALD_Model#/definitions/Action/properties/processOutputFileCode")

#### processOutputFileCode Type

`string`

### formData

Used for executing applications with custom form data. This can be anything needed by the custom form, but in the end only the standard atRunExtApp fields are used to do the action.

`formData`

* is optional

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-formdata.md "EMRALD_Model#/definitions/Action/properties/formData")

#### formData Type

unknown

### template

Optional. For action type atRunExtApp. It is used for custom app form.

`template`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_0-definitions-action-properties-template.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-template.md "EMRALD_Model#/definitions/Action/properties/template")

#### template Type

`object` ([Details](emrald_jsonschemav3_0-definitions-action-properties-template.md))

### returnProcess

Optional. For action type atRunExtApp. It is flag to indicate the type of return from the processOutputFileCode. If rtNone then it has no return, othrwise the C# script must return a List<string/> with +/-\[StateName] to shift out or into a state.

`returnProcess`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-returnprocess.md "EMRALD_Model#/definitions/Action/properties/returnProcess")

#### returnProcess Type

`string`

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Action/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

### raType

String for the run application action, only for UI used. Options depend on the custom UI forms made. "code" means default user defined pre and post execution code is used.

`raType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-ratype.md "EMRALD_Model#/definitions/Action/properties/raType")

#### raType Type

`string`

### updateVariables

Used for custom form, variables used in the form.

`updateVariables`

* is optional

* Type: `array`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-updatevariables.md "EMRALD_Model#/definitions/Action/properties/updateVariables")

#### updateVariables Type

`array`

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-required.md "EMRALD_Model#/definitions/Action/properties/required")

#### required Type

`boolean`

## Definitions group Event

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/Event"}
```

| Property                              | Type      | Required | Nullable       | Defined by                                                                                                                                            |
| :------------------------------------ | :-------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id-5)                           | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-id.md "EMRALD_Model#/definitions/Event/properties/id")                             |
| [objType](#objtype-5)                 | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-objtype.md "EMRALD_Model#/definitions/Event/properties/objType")                   |
| [name](#name-5)                       | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-name.md "EMRALD_Model#/definitions/Event/properties/name")                         |
| [desc](#desc-4)                       | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-desc.md "EMRALD_Model#/definitions/Event/properties/desc")                         |
| [mainItem](#mainitem-1)               | `boolean` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-mainitem.md "EMRALD_Model#/definitions/Event/properties/mainItem")                 |
| [evType](#evtype)                     | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-evtype.md "EMRALD_Model#/definitions/Event/properties/evType")                     |
| [allItems](#allitems)                 | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-allitems.md "EMRALD_Model#/definitions/Event/properties/allItems")                 |
| [triggerStates](#triggerstates)       | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-triggerstates.md "EMRALD_Model#/definitions/Event/properties/triggerStates")       |
| [varNames](#varnames)                 | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-varnames.md "EMRALD_Model#/definitions/Event/properties/varNames")                 |
| [ifInState](#ifinstate)               | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-ifinstate.md "EMRALD_Model#/definitions/Event/properties/ifInState")               |
| [onSuccess](#onsuccess)               | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-onsuccess.md "EMRALD_Model#/definitions/Event/properties/onSuccess")               |
| [triggerOnFalse](#triggeronfalse)     | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-triggeronfalse.md "EMRALD_Model#/definitions/Event/properties/triggerOnFalse")     |
| [logicTop](#logictop)                 | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-logictop.md "EMRALD_Model#/definitions/Event/properties/logicTop")                 |
| [lambda](#lambda)                     | Merged    | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-lambda.md "EMRALD_Model#/definitions/Event/properties/lambda")                     |
| [lambdaTimeRate](#lambdatimerate)     | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-lambdatimerate.md "EMRALD_Model#/definitions/Event/properties/lambdaTimeRate")     |
| [useVariable](#usevariable)           | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-usevariable.md "EMRALD_Model#/definitions/Event/properties/useVariable")           |
| [onVarChange](#onvarchange)           | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-onvarchange.md "EMRALD_Model#/definitions/Event/properties/onVarChange")           |
| [time](#time)                         | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-time.md "EMRALD_Model#/definitions/Event/properties/time")                         |
| [timeVariableUnit](#timevariableunit) | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-timevariableunit.md "EMRALD_Model#/definitions/Event/properties/timeVariableUnit") |
| [fromSimStart](#fromsimstart)         | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-fromsimstart.md "EMRALD_Model#/definitions/Event/properties/fromSimStart")         |
| [extEventType](#exteventtype)         | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-exteventtype.md "EMRALD_Model#/definitions/Event/properties/extEventType")         |
| [variable](#variable)                 | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-variable.md "EMRALD_Model#/definitions/Event/properties/variable")                 |
| [code](#code)                         | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-code.md "EMRALD_Model#/definitions/Event/properties/code")                         |
| [distType](#disttype)                 | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-disttype.md "EMRALD_Model#/definitions/Event/properties/distType")                 |
| [parameters](#parameters)             | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-parameters.md "EMRALD_Model#/definitions/Event/properties/parameters")             |
| [dfltTimeRate](#dflttimerate)         | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-dflttimerate.md "EMRALD_Model#/definitions/Event/properties/dfltTimeRate")         |
| [changeLog](#changelog-4)             | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Event/properties/changeLog")                                |
| [required](#required-4)               | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-required.md "EMRALD_Model#/definitions/Event/properties/required")                 |

### id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-id.md "EMRALD_Model#/definitions/Event/properties/id")

#### id Type

`string`

### objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-objtype.md "EMRALD_Model#/definitions/Event/properties/objType")

#### objType Type

`string`

#### objType Constraints

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

### name

referenace name in the event in the model.

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-name.md "EMRALD_Model#/definitions/Event/properties/name")

#### name Type

`string`

### desc

User entered description of the event.

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-desc.md "EMRALD_Model#/definitions/Event/properties/desc")

#### desc Type

`string`

### mainItem

Is this a global item to show up in the global list, If false it showes up in local or all list.

`mainItem`

* is required

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-mainitem.md "EMRALD_Model#/definitions/Event/properties/mainItem")

#### mainItem Type

`boolean`

### evType

Type of the event

`evType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-evtype.md "EMRALD_Model#/definitions/Event/properties/evType")

#### evType Type

`string`

#### evType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                | Explanation |
| :------------------- | :---------- |
| `"etStateCng"`       |             |
| `"etComponentLogic"` |             |
| `"etFailRate"`       |             |
| `"etTimer"`          |             |
| `"et3dSimEv"`        |             |
| `"etDistribution"`   |             |
| `"etVarCond"`        |             |

### allItems

Optional. For event type etStateCng. Flag to indicate if all the items in the triggerStates need to occure as specified or just one of them.

`allItems`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-allitems.md "EMRALD_Model#/definitions/Event/properties/allItems")

#### allItems Type

`boolean`

### triggerStates

Optional. For event type etStateCng. List of state name references as part of the criteria needed to trigger the event. These are the states that need to be entered or exited to tirgger the event.

`triggerStates`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-triggerstates.md "EMRALD_Model#/definitions/Event/properties/triggerStates")

#### triggerStates Type

`string[]`

### varNames

Optional, Name references for all variables used in scripts if the event type uses scripts.

`varNames`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-varnames.md "EMRALD_Model#/definitions/Event/properties/varNames")

#### varNames Type

`string[]`

### ifInState

Optional. For event type etStateCng, flag to indicate that event is triggired when entering or exiting states listed in triggerStates array. On Enter State/s or On Exit State/s

`ifInState`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-ifinstate.md "EMRALD_Model#/definitions/Event/properties/ifInState")

#### ifInState Type

`boolean`

### onSuccess

Optional. For event type etStateCng, flag to indicate that event is triggering needs all the items or just one or rmore from the states listed in triggerStates array. checkbox - All Items

`onSuccess`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-onsuccess.md "EMRALD_Model#/definitions/Event/properties/onSuccess")

#### onSuccess Type

`boolean`

### triggerOnFalse

Optional. For event type etComponentLogic, flag to indicate that event is triggered if logic tree evaluates to a False, otherwise it triggeres on true.

`triggerOnFalse`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-triggeronfalse.md "EMRALD_Model#/definitions/Event/properties/triggerOnFalse")

#### triggerOnFalse Type

`boolean`

### logicTop

Optional. For event type etComponentLogic, this is the logic tree name to be evaluated for triggering the event.

`logicTop`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-logictop.md "EMRALD_Model#/definitions/Event/properties/logicTop")

#### logicTop Type

`string`

### lambda

Optional. Parameter for a event with type of etFailRate. It is either a number or the name of a variable if useVariable is true

`lambda`

* is optional

* Type: merged type ([Details](emrald_jsonschemav3_0-definitions-event-properties-lambda.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-lambda.md "EMRALD_Model#/definitions/Event/properties/lambda")

#### lambda Type

merged type ([Details](emrald_jsonschemav3_0-definitions-event-properties-lambda.md))

any of

* [Untitled string in EMRALD_Model](emrald_jsonschemav3_0-definitions-event-properties-lambda-anyof-0.md "check type definition")

* [Untitled number in EMRALD_Model](emrald_jsonschemav3_0-definitions-event-properties-lambda-anyof-1.md "check type definition")

### lambdaTimeRate

Optional. arameter for a event with type of etFailRate. It is the lambda value time frequency.

`lambdaTimeRate`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-lambdatimerate.md "EMRALD_Model#/definitions/Event/properties/lambdaTimeRate")

#### lambdaTimeRate Type

`string`

### useVariable

Optional. Indicates that variables can be used for the fields

`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-usevariable.md "EMRALD_Model#/definitions/Event/properties/useVariable")

#### useVariable Type

`boolean`

### onVarChange

Optional. When an event uses a variable and that variable changes, this tells the code how to update the event.

`onVarChange`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-onvarchange.md "EMRALD_Model#/definitions/Event/properties/onVarChange")

#### onVarChange Type

`string`

#### onVarChange Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value          | Explanation |
| :------------- | :---------- |
| `"ocIgnore"`   |             |
| `"ocResample"` |             |
| `"ocAdjust"`   |             |

### time

Optional, For events of type etTimer. This is a time or variable that indicates the time for the event.

`time`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-time.md "EMRALD_Model#/definitions/Event/properties/time")

#### time Type

`string`

### timeVariableUnit

Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.

`timeVariableUnit`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-timevariableunit.md "EMRALD_Model#/definitions/Event/properties/timeVariableUnit")

#### timeVariableUnit Type

`string`

#### timeVariableUnit Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `""`          |             |
| `"trYears"`   |             |
| `"trDays"`    |             |
| `"trHours"`   |             |
| `"trMinutes"` |             |
| `"trSeconds"` |             |

### fromSimStart

Optional, For time based events, is the time from the beginning of the simulation \[true] or from when the state was entered.

`fromSimStart`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-fromsimstart.md "EMRALD_Model#/definitions/Event/properties/fromSimStart")

#### fromSimStart Type

`boolean`

### extEventType

Optional. For events of type et3dSimEv. This the type of message being sent to the external simulation. See the external messeage JSON schema.

`extEventType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-exteventtype.md "EMRALD_Model#/definitions/Event/properties/extEventType")

#### extEventType Type

`string`

#### extEventType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"etCompEv"` |             |
| `"etEndSim"` |             |
| `"etStatus"` |             |

### variable

Optional. For event type et3dSimEv and extEventType etCompEv. It is the reference name for the variable. If that variable is modified by the external code, then the script is executed to determine if the event is triggered.

`variable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-variable.md "EMRALD_Model#/definitions/Event/properties/variable")

#### variable Type

`string`

### code

Optional. For event type et3dSimEv and extEventType etCompEv. It is the reference name for the variable. If that variable is modified by the external code, then this code script is executed to determine if the event is triggered.

`code`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-code.md "EMRALD_Model#/definitions/Event/properties/code")

#### code Type

`string`

### distType

Optional. For event type of etDistribution this is the type of distribution the user selected.

`distType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-disttype.md "EMRALD_Model#/definitions/Event/properties/distType")

#### distType Type

`string`

#### distType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value             | Explanation |
| :---------------- | :---------- |
| `"dtNormal"`      |             |
| `"dtExponential"` |             |
| `"dtWeibull"`     |             |
| `"dtLogNormal"`   |             |
| `"dtTriangular"`  |             |
| `"dtGamma"`       |             |
| `"dtGompertz"`    |             |
| `"dtUniform"`     |             |
| `"dtBeta"`        |             |

### parameters

Optional. For event type of etDistribution this is an array of properties for the distribution calculation.

`parameters`

* is optional

* Type: `object[]` ([EventDistributionParameter](emrald_jsonschemav3_0-definitions-eventdistributionparameter.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-parameters.md "EMRALD_Model#/definitions/Event/properties/parameters")

#### parameters Type

`object[]` ([EventDistributionParameter](emrald_jsonschemav3_0-definitions-eventdistributionparameter.md))

### dfltTimeRate

Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.

`dfltTimeRate`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-dflttimerate.md "EMRALD_Model#/definitions/Event/properties/dfltTimeRate")

#### dfltTimeRate Type

`string`

#### dfltTimeRate Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `""`          |             |
| `"trYears"`   |             |
| `"trDays"`    |             |
| `"trHours"`   |             |
| `"trMinutes"` |             |
| `"trSeconds"` |             |

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Event/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-required.md "EMRALD_Model#/definitions/Event/properties/required")

#### required Type

`boolean`

## Definitions group LogicNode

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/LogicNode"}
```

| Property                      | Type      | Required | Nullable       | Defined by                                                                                                                                            |
| :---------------------------- | :-------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id-6)                   | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-id.md "EMRALD_Model#/definitions/LogicNode/properties/id")                     |
| [objType](#objtype-6)         | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-objtype.md "EMRALD_Model#/definitions/LogicNode/properties/objType")           |
| [name](#name-6)               | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-name.md "EMRALD_Model#/definitions/LogicNode/properties/name")                 |
| [desc](#desc-5)               | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-desc.md "EMRALD_Model#/definitions/LogicNode/properties/desc")                 |
| [gateType](#gatetype)         | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-gatetype.md "EMRALD_Model#/definitions/LogicNode/properties/gateType")         |
| [compChildren](#compchildren) | `array`   | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-compchild.md "EMRALD_Model#/definitions/LogicNode/properties/compChildren")                         |
| [gateChildren](#gatechildren) | `array`   | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-gatechildren.md "EMRALD_Model#/definitions/LogicNode/properties/gateChildren") |
| [isRoot](#isroot)             | `boolean` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-isroot.md "EMRALD_Model#/definitions/LogicNode/properties/isRoot")             |
| [changeLog](#changelog-5)     | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/LogicNode/properties/changeLog")                            |
| [required](#required-5)       | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-required.md "EMRALD_Model#/definitions/LogicNode/properties/required")         |

### id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-id.md "EMRALD_Model#/definitions/LogicNode/properties/id")

#### id Type

`string`

### objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-objtype.md "EMRALD_Model#/definitions/LogicNode/properties/objType")

#### objType Type

`string`

#### objType Constraints

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

### name

referenace name in the logic node

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-name.md "EMRALD_Model#/definitions/LogicNode/properties/name")

#### name Type

`string`

### desc

User entered description of the logic node

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-desc.md "EMRALD_Model#/definitions/LogicNode/properties/desc")

#### desc Type

`string`

### gateType

Gate type for the logic node

`gateType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-gatetype.md "EMRALD_Model#/definitions/LogicNode/properties/gateType")

#### gateType Type

`string`

#### gateType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value     | Explanation |
| :-------- | :---------- |
| `"gtAnd"` |             |
| `"gtOr"`  |             |
| `"gtNot"` |             |

### compChildren

Array of component diagram names and state values to use in evaluating if not using the default value.

`compChildren`

* is required

* Type: `object[]` ([CompChildItems](emrald_jsonschemav3_0-definitions-compchild-compchilditems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-compchild.md "EMRALD_Model#/definitions/LogicNode/properties/compChildren")

#### compChildren Type

`object[]` ([CompChildItems](emrald_jsonschemav3_0-definitions-compchild-compchilditems.md))

### gateChildren

Array of logic node names that are children of this gate.

`gateChildren`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-gatechildren.md "EMRALD_Model#/definitions/LogicNode/properties/gateChildren")

#### gateChildren Type

`string[]`

### isRoot

Flag indicating that this is to be displayed as a tree top in the UI and can be used in an evaluate logic tree event.

`isRoot`

* is required

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-isroot.md "EMRALD_Model#/definitions/LogicNode/properties/isRoot")

#### isRoot Type

`boolean`

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/LogicNode/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-logicnode-properties-required.md "EMRALD_Model#/definitions/LogicNode/properties/required")

#### required Type

`boolean`

## Definitions group Variable

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/Variable"}
```

| Property                                | Type      | Required | Nullable       | Defined by                                                                                                                                                    |
| :-------------------------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [id](#id-7)                             | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-id.md "EMRALD_Model#/definitions/Variable/properties/id")                               |
| [objType](#objtype-7)                   | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-objtype.md "EMRALD_Model#/definitions/Variable/properties/objType")                     |
| [name](#name-7)                         | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-name.md "EMRALD_Model#/definitions/Variable/properties/name")                           |
| [desc](#desc-6)                         | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-desc.md "EMRALD_Model#/definitions/Variable/properties/desc")                           |
| [varScope](#varscope)                   | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-varscope.md "EMRALD_Model#/definitions/Variable/properties/varScope")                   |
| [value](#value)                         | Merged    | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-value.md "EMRALD_Model#/definitions/Variable/properties/value")                         |
| [docLink](#doclink)                     | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-doclink.md "EMRALD_Model#/definitions/Variable/properties/docLink")                     |
| [docType](#doctype)                     | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-doctype.md "EMRALD_Model#/definitions/Variable/properties/docType")                     |
| [docPath](#docpath)                     | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-docpath.md "EMRALD_Model#/definitions/Variable/properties/docPath")                     |
| [pathMustExist](#pathmustexist)         | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-pathmustexist.md "EMRALD_Model#/definitions/Variable/properties/pathMustExist")         |
| [type](#type)                           | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-type.md "EMRALD_Model#/definitions/Variable/properties/type")                           |
| [accrualStatesData](#accrualstatesdata) | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData") |
| [regExpLine](#regexpline)               | `integer` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-regexpline.md "EMRALD_Model#/definitions/Variable/properties/regExpLine")               |
| [begPosition](#begposition)             | `integer` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-begposition.md "EMRALD_Model#/definitions/Variable/properties/begPosition")             |
| [numChars](#numchars)                   | `integer` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-numchars.md "EMRALD_Model#/definitions/Variable/properties/numChars")                   |
| [resetOnRuns](#resetonruns)             | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-resetonruns.md "EMRALD_Model#/definitions/Variable/properties/resetOnRuns")             |
| [resourceName](#resourcename-1)         | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-resourcename.md "EMRALD_Model#/definitions/Variable/properties/resourceName")           |
| [sim3DId](#sim3did)                     | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-sim3did.md "EMRALD_Model#/definitions/Variable/properties/sim3DId")                     |
| [changeLog](#changelog-6)               | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Variable/properties/changeLog")                                     |
| [cumulativeStats](#cumulativestats)     | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-cumulativestats.md "EMRALD_Model#/definitions/Variable/properties/cumulativeStats")     |
| [monitorInSim](#monitorinsim)           | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-monitorinsim.md "EMRALD_Model#/definitions/Variable/properties/monitorInSim")           |
| [canMonitor](#canmonitor)               | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-canmonitor.md "EMRALD_Model#/definitions/Variable/properties/canMonitor")               |
| [required](#required-6)                 | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-required.md "EMRALD_Model#/definitions/Variable/properties/required")                   |

### id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-id.md "EMRALD_Model#/definitions/Variable/properties/id")

#### id Type

`string`

### objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-objtype.md "EMRALD_Model#/definitions/Variable/properties/objType")

#### objType Type

`string`

#### objType Constraints

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

### name

referenace name in the model for the variable

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-name.md "EMRALD_Model#/definitions/Variable/properties/name")

#### name Type

`string`

### desc

User entered description of the variable

`desc`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-desc.md "EMRALD_Model#/definitions/Variable/properties/desc")

#### desc Type

`string`

### varScope

Context of use for the variable in the model.

`varScope`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-varscope.md "EMRALD_Model#/definitions/Variable/properties/varScope")

#### varScope Type

`string`

#### varScope Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `"gtDocLink"` |             |
| `"gtAccrual"` |             |
| `"gtGlobal"`  |             |
| `"gt3DSim"`   |             |

### value

The default value for the variable.

`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_0-definitions-variable-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-value.md "EMRALD_Model#/definitions/Variable/properties/value")

#### value Type

merged type ([Details](emrald_jsonschemav3_0-definitions-variable-properties-value.md))

any of

* [Untitled number in EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-value-anyof-0.md "check type definition")

* [Untitled string in EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-value-anyof-1.md "check type definition")

* [Untitled boolean in EMRALD_Model](emrald_jsonschemav3_0-definitions-variable-properties-value-anyof-2.md "check type definition")

### docLink

If the varScope is gtDocLink then this is the expression defining path in the document to the variable is linked to. XPath for XML, JSONPath for JSON, or a RegularExpression for txt

`docLink`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-doclink.md "EMRALD_Model#/definitions/Variable/properties/docLink")

#### docLink Type

`string`

### docType

If the varScope is gtDocLink then this the type of document the variable can be linked to. XML, JSON or PlainText using a regular expression

`docType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-doctype.md "EMRALD_Model#/definitions/Variable/properties/docType")

#### docType Type

`string`

#### docType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value           | Explanation |
| :-------------- | :---------- |
| `"dtXML"`       |             |
| `"dtJSON"`      |             |
| `"dtTextRegEx"` |             |

### docPath

If the varScope is gtDocLink then this is the path to the document the variable is linked to.

`docPath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-docpath.md "EMRALD_Model#/definitions/Variable/properties/docPath")

#### docPath Type

`string`

### pathMustExist

Flag, if true then the file in the docPath must exist when the simulation starts running. This is helpful to minimize errors.

`pathMustExist`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-pathmustexist.md "EMRALD_Model#/definitions/Variable/properties/pathMustExist")

#### pathMustExist Type

`boolean`

### type

This is the type of the variable, Bool, double, int, string

`type`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-type.md "EMRALD_Model#/definitions/Variable/properties/type")

#### type Type

`string`

#### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"bool"`   |             |
| `"double"` |             |
| `"int"`    |             |
| `"string"` |             |

### accrualStatesData

Optional. If the variable varScope is gtAccrual, then these are the states used for calculating the variables value over time.

`accrualStatesData`

* is optional

* Type: `object[]` ([accrualStatesDataItems](emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata-accrualstatesdataitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData")

#### accrualStatesData Type

`object[]` ([accrualStatesDataItems](emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata-accrualstatesdataitems.md))

### regExpLine

Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this is the regular expression string.

`regExpLine`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-regexpline.md "EMRALD_Model#/definitions/Variable/properties/regExpLine")

#### regExpLine Type

`integer`

### begPosition

Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this the start possition after the regular expression finds its match for reading or writing the value of the variable.

`begPosition`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-begposition.md "EMRALD_Model#/definitions/Variable/properties/begPosition")

#### begPosition Type

`integer`

### numChars

Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this how many characters to read for the value of the variable

`numChars`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-numchars.md "EMRALD_Model#/definitions/Variable/properties/numChars")

#### numChars Type

`integer`

### resetOnRuns

Optional, this specifies if the value of the variable is to be reset to the default value on each run or retain the value from the last run.

`resetOnRuns`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-resetonruns.md "EMRALD_Model#/definitions/Variable/properties/resetOnRuns")

#### resetOnRuns Type

`boolean`

### resourceName

Optional. If the variable varScope is gt3DSim, this is the name reference to the external simulation to link to for the value.

`resourceName`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-resourcename.md "EMRALD_Model#/definitions/Variable/properties/resourceName")

#### resourceName Type

`string`

### sim3DId

Optional. For variables of varScope gt3DSim, this is the external simulations name of the variable. It is used in sending a message to the external simulation.

`sim3DId`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-sim3did.md "EMRALD_Model#/definitions/Variable/properties/sim3DId")

#### sim3DId Type

`string`

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Variable/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

### cumulativeStats

Flag to indicate the user want to do cumulative statistics in the results.

`cumulativeStats`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-cumulativestats.md "EMRALD_Model#/definitions/Variable/properties/cumulativeStats")

#### cumulativeStats Type

`boolean`

### monitorInSim

Flag to have the monitor variable check box checked in the solver by default.

`monitorInSim`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-monitorinsim.md "EMRALD_Model#/definitions/Variable/properties/monitorInSim")

#### monitorInSim Type

`boolean`

### canMonitor

Flag to indicate if the variable can be monitored in the solver. This removes it from the solver UI if false. Must be true if monitorInSim is true.

`canMonitor`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-canmonitor.md "EMRALD_Model#/definitions/Variable/properties/canMonitor")

#### canMonitor Type

`boolean`

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-variable-properties-required.md "EMRALD_Model#/definitions/Variable/properties/required")

#### required Type

`boolean`

## Definitions group NewState

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/NewState"}
```

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                  |
| :-------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| [toState](#tostate)   | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-newstate-properties-tostate.md "EMRALD_Model#/definitions/NewState/properties/toState")   |
| [prob](#prob)         | `number` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-newstate-properties-prob.md "EMRALD_Model#/definitions/NewState/properties/prob")         |
| [failDesc](#faildesc) | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-newstate-properties-faildesc.md "EMRALD_Model#/definitions/NewState/properties/failDesc") |
| [varProb](#varprob)   | `string` | Optional | can be null    | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-newstate-properties-varprob.md "EMRALD_Model#/definitions/NewState/properties/varProb")   |

### toState

reference name of the state to transtion to.

`toState`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-newstate-properties-tostate.md "EMRALD_Model#/definitions/NewState/properties/toState")

#### toState Type

`string`

### prob

probability that this state will be transtioned to.

`prob`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-newstate-properties-prob.md "EMRALD_Model#/definitions/NewState/properties/prob")

#### prob Type

`number`

### failDesc

The description from the user for output if tthis transition takes place.

`failDesc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-newstate-properties-faildesc.md "EMRALD_Model#/definitions/NewState/properties/failDesc")

#### failDesc Type

`string`

### varProb

Optional, if used  then the a variable is used for the probability. This is the name of that variable

`varProb`

* is optional

* Type: `string`

* can be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-newstate-properties-varprob.md "EMRALD_Model#/definitions/NewState/properties/varProb")

#### varProb Type

`string`

## Definitions group ChangeLog

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/ChangeLog"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group GeometryInfo

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/GeometryInfo"}
```

| Property          | Type      | Required | Nullable       | Defined by                                                                                                                                      |
| :---------------- | :-------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| [x](#x)           | `integer` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo-properties-x.md "EMRALD_Model#/definitions/GeometryInfo/properties/x")           |
| [y](#y)           | `integer` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo-properties-y.md "EMRALD_Model#/definitions/GeometryInfo/properties/y")           |
| [width](#width)   | `integer` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo-properties-width.md "EMRALD_Model#/definitions/GeometryInfo/properties/width")   |
| [height](#height) | `integer` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo-properties-height.md "EMRALD_Model#/definitions/GeometryInfo/properties/height") |

### x



`x`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo-properties-x.md "EMRALD_Model#/definitions/GeometryInfo/properties/x")

#### x Type

`integer`

### y



`y`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo-properties-y.md "EMRALD_Model#/definitions/GeometryInfo/properties/y")

#### y Type

`integer`

### width



`width`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo-properties-width.md "EMRALD_Model#/definitions/GeometryInfo/properties/width")

#### width Type

`integer`

### height



`height`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-geometryinfo-properties-height.md "EMRALD_Model#/definitions/GeometryInfo/properties/height")

#### height Type

`integer`

## Definitions group CompChild

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/CompChild"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group Group

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/Group"}
```

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                            |
| :-------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| [name](#name-8)       | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-group-properties-name.md "EMRALD_Model#/definitions/Group/properties/name")         |
| [subgroup](#subgroup) | `array`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-group-properties-subgroup.md "EMRALD_Model#/definitions/Group/properties/subgroup") |

### name

Name of the group

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-group-properties-name.md "EMRALD_Model#/definitions/Group/properties/name")

#### name Type

`string`

### subgroup

Sub group tree path

`subgroup`

* is optional

* Type: unknown\[]

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-group-properties-subgroup.md "EMRALD_Model#/definitions/Group/properties/subgroup")

#### subgroup Type

unknown\[]

## Definitions group DiagramType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/DiagramType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group StateType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/StateType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group ActionType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/ActionType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group EventType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/EventType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group EventDistributionParameter

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/EventDistributionParameter"}
```

| Property                      | Type      | Required | Nullable       | Defined by                                                                                                                                                                            |
| :---------------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [name](#name-9)               | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-name.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/name")               |
| [value](#value-1)             | Merged    | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/value")             |
| [timeRate](#timerate)         | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-timerate.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/timeRate")       |
| [useVariable](#usevariable-1) | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-usevariable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/useVariable") |
| [variable](#variable-1)       | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-variable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/variable")       |

### name

For event type of etDistribution this is the name of the distribution parameter.

`name`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-name.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/name")

#### name Type

`string`

#### name Constraints

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

### value

Optional. The value of the parameter if the useVariable flag is false. Can be a number or a string if in scientific notation.

`value`

* is optional

* Type: merged type ([Details](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/value")

#### value Type

merged type ([Details](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value.md))

any of

* [Untitled number in EMRALD_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value-anyof-0.md "check type definition")

* [Untitled string in EMRALD_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-value-anyof-1.md "check type definition")

### timeRate

Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.

`timeRate`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-timerate.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/timeRate")

#### timeRate Type

`string`

#### timeRate Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `""`          |             |
| `"trYears"`   |             |
| `"trDays"`    |             |
| `"trHours"`   |             |
| `"trMinutes"` |             |
| `"trSeconds"` |             |

### useVariable

Flag to use the variable string vs the value item for the property

`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-usevariable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/useVariable")

#### useVariable Type

`boolean`

### variable

Optional. The reference name of the variable to use as the value of the parameter if the useVariable flag is true.

`variable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-eventdistributionparameter-properties-variable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/variable")

#### variable Type

`string`

## Definitions group VarChangeOptions

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/VarChangeOptions"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group TimeVariableUnit

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/TimeVariableUnit"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group ExtEventMsgType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/ExtEventMsgType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group DistributionType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/DistributionType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group GateType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/GateType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group VarScope

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/VarScope"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group DocVarType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/DocVarType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group VariableType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/VariableType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group AccrualVarTableType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/AccrualVarTableType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group StateEvalValue

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/StateEvalValue"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group EventDistributionParameterName

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/EventDistributionParameterName"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group MainItemType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MainItemType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |
