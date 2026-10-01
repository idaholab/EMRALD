# EMRALD\_Model Schema

```txt
EMRALD_Model
```

EMRALD model schema version 3.3

| Abstract               | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :--------------------- | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Cannot be instantiated | Yes        | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_4.json](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## EMRALD\_Model Type

`object` ([EMRALD\_Model](emrald_jsonschemav3_4.md))

all of

* [Main_Model](emrald_jsonschemav3_4-definitions-main_model.md "check type definition")

# EMRALD\_Model Definitions

## Definitions group Model

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/Model"}
```

| Property                            | Type          | Required | Nullable       | Defined by                                                                                                                                                 |
| :---------------------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)                           | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-id.md "EMRALD_Model#/definitions/MainModel/properties/id")                         |
| [objType](#objtype)                 | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-objtype.md "EMRALD_Model#/definitions/MainModel/properties/objType")               |
| [name](#name)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-name.md "EMRALD_Model#/definitions/MainModel/properties/name")                     |
| [desc](#desc)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-desc.md "EMRALD_Model#/definitions/MainModel/properties/desc")                     |
| [emraldVersion](#emraldversion)     | `number`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-emraldversion.md "EMRALD_Model#/definitions/MainModel/properties/emraldVersion")   |
| [version](#version)                 | `number`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-version.md "EMRALD_Model#/definitions/MainModel/properties/version")               |
| [versionHistory](#versionhistory)   | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-versionhistory.md "EMRALD_Model#/definitions/MainModel/properties/versionHistory") |
| [filename](#filename)               | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-filename.md "EMRALD_Model#/definitions/MainModel/properties/filename")             |
| [DiagramList](#diagramlist)         | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-diagramlist.md "EMRALD_Model#/definitions/MainModel/properties/DiagramList")       |
| [ExtSimList](#extsimlist)           | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-extsimlist.md "EMRALD_Model#/definitions/MainModel/properties/ExtSimList")         |
| [StateList](#statelist)             | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-statelist.md "EMRALD_Model#/definitions/MainModel/properties/StateList")           |
| [ActionList](#actionlist)           | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-actionlist.md "EMRALD_Model#/definitions/MainModel/properties/ActionList")         |
| [EventList](#eventlist)             | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-eventlist.md "EMRALD_Model#/definitions/MainModel/properties/EventList")           |
| [LogicNodeList](#logicnodelist)     | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-logicnodelist.md "EMRALD_Model#/definitions/MainModel/properties/LogicNodeList")   |
| [VariableList](#variablelist)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-variablelist.md "EMRALD_Model#/definitions/MainModel/properties/VariableList")     |
| [templates](#templates)             | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-templates.md "EMRALD_Model#/definitions/MainModel/properties/templates")           |
| [multiThreadInfo](#multithreadinfo) | `object`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo.md "EMRALD_Model#/definitions/MainModel/properties/multiThreadInfo")                     |
| [changeLog](#changelog)             | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/MainModel/properties/changeLog")                                 |
| [group](#group)                     | `object`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-group.md "EMRALD_Model#/definitions/MainModel/properties/group")                                         |

### id

Temporary, only used internally for some identification or uniqueness needs

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-id.md "EMRALD_Model#/definitions/MainModel/properties/id")

#### id Type

`string`

### objType



`objType`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-objtype.md "EMRALD_Model#/definitions/MainModel/properties/objType")

#### objType Type

unknown

#### objType Constraints

**constant**: the value of this property must be equal to:

```json
"EMRALD_Model"
```

### name

Name of the EMRALD model

`name`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-name.md "EMRALD_Model#/definitions/MainModel/properties/name")

#### name Type

`string`

### desc

description of the EMRALD model

`desc`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-desc.md "EMRALD_Model#/definitions/MainModel/properties/desc")

#### desc Type

`string`

### emraldVersion

Version of the EMRALD model schema

`emraldVersion`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-emraldversion.md "EMRALD_Model#/definitions/MainModel/properties/emraldVersion")

#### emraldVersion Type

`number`

### version

Version of the users model

`version`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-version.md "EMRALD_Model#/definitions/MainModel/properties/version")

#### version Type

`number`

### versionHistory

The user's model version history and change descriptions

`versionHistory`

* is required

* Type: `object[]` ([VersionHistory](emrald_jsonschemav3_4-definitions-versionhistory.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-versionhistory.md "EMRALD_Model#/definitions/MainModel/properties/versionHistory")

#### versionHistory Type

`object[]` ([VersionHistory](emrald_jsonschemav3_4-definitions-versionhistory.md))

### filename

Name of the original file that was opened to help distinguish between different versions of the model.

`filename`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-filename.md "EMRALD_Model#/definitions/MainModel/properties/filename")

#### filename Type

`string`

### DiagramList

All the diagrams for the model

`DiagramList`

* is required

* Type: `object[]` ([Diagram](emrald_jsonschemav3_4-definitions-diagram.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-diagramlist.md "EMRALD_Model#/definitions/MainModel/properties/DiagramList")

#### DiagramList Type

`object[]` ([Diagram](emrald_jsonschemav3_4-definitions-diagram.md))

### ExtSimList

All the external simulation links for the mdoel

`ExtSimList`

* is required

* Type: `object[]` ([ExtSim](emrald_jsonschemav3_4-definitions-extsim.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-extsimlist.md "EMRALD_Model#/definitions/MainModel/properties/ExtSimList")

#### ExtSimList Type

`object[]` ([ExtSim](emrald_jsonschemav3_4-definitions-extsim.md))

### StateList

All of the states for the different diagrams of the model

`StateList`

* is required

* Type: `object[]` ([State](emrald_jsonschemav3_4-definitions-state.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-statelist.md "EMRALD_Model#/definitions/MainModel/properties/StateList")

#### StateList Type

`object[]` ([State](emrald_jsonschemav3_4-definitions-state.md))

### ActionList

All the actions that can be used in the model

`ActionList`

* is required

* Type: `object[]` ([Action](emrald_jsonschemav3_4-definitions-action.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-actionlist.md "EMRALD_Model#/definitions/MainModel/properties/ActionList")

#### ActionList Type

`object[]` ([Action](emrald_jsonschemav3_4-definitions-action.md))

### EventList

All the events that are used in the model.

`EventList`

* is required

* Type: `object[]` ([Event](emrald_jsonschemav3_4-definitions-event.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-eventlist.md "EMRALD_Model#/definitions/MainModel/properties/EventList")

#### EventList Type

`object[]` ([Event](emrald_jsonschemav3_4-definitions-event.md))

### LogicNodeList

All the logic nodes to make the logic trees in the model

`LogicNodeList`

* is required

* Type: `object[]` ([LogicNode](emrald_jsonschemav3_4-definitions-logicnode.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-logicnodelist.md "EMRALD_Model#/definitions/MainModel/properties/LogicNodeList")

#### LogicNodeList Type

`object[]` ([LogicNode](emrald_jsonschemav3_4-definitions-logicnode.md))

### VariableList

All the variables used in the model

`VariableList`

* is required

* Type: `object[]` ([Variable](emrald_jsonschemav3_4-definitions-variable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-variablelist.md "EMRALD_Model#/definitions/MainModel/properties/VariableList")

#### VariableList Type

`object[]` ([Variable](emrald_jsonschemav3_4-definitions-variable.md))

### templates

Templates available to make new diagrams in the model. These are basically small models all on their own.

`templates`

* is optional

* Type: `object[]` ([Main\_Model](emrald_jsonschemav3_4-definitions-main_model.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-templates.md "EMRALD_Model#/definitions/MainModel/properties/templates")

#### templates Type

`object[]` ([Main\_Model](emrald_jsonschemav3_4-definitions-main_model.md))

### multiThreadInfo



`multiThreadInfo`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-multithreadinfo.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo.md "EMRALD_Model#/definitions/MainModel/properties/multiThreadInfo")

#### multiThreadInfo Type

`object` ([Details](emrald_jsonschemav3_4-definitions-multithreadinfo.md))

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/MainModel/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

### group

What catagory grouping this item belongs to. Used to indicate a group for and EMRALD model template.

`group`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-group.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-group.md "EMRALD_Model#/definitions/MainModel/properties/group")

#### group Type

`object` ([Details](emrald_jsonschemav3_4-definitions-group.md))

## Definitions group MainModel

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MainModel"}
```

| Property                              | Type          | Required | Nullable       | Defined by                                                                                                                                                 |
| :------------------------------------ | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id-1)                           | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-id.md "EMRALD_Model#/definitions/MainModel/properties/id")                         |
| [objType](#objtype-1)                 | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-objtype.md "EMRALD_Model#/definitions/MainModel/properties/objType")               |
| [name](#name-1)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-name.md "EMRALD_Model#/definitions/MainModel/properties/name")                     |
| [desc](#desc-1)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-desc.md "EMRALD_Model#/definitions/MainModel/properties/desc")                     |
| [emraldVersion](#emraldversion-1)     | `number`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-emraldversion.md "EMRALD_Model#/definitions/MainModel/properties/emraldVersion")   |
| [version](#version-1)                 | `number`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-version.md "EMRALD_Model#/definitions/MainModel/properties/version")               |
| [versionHistory](#versionhistory-1)   | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-versionhistory.md "EMRALD_Model#/definitions/MainModel/properties/versionHistory") |
| [filename](#filename-1)               | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-filename.md "EMRALD_Model#/definitions/MainModel/properties/filename")             |
| [DiagramList](#diagramlist-1)         | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-diagramlist.md "EMRALD_Model#/definitions/MainModel/properties/DiagramList")       |
| [ExtSimList](#extsimlist-1)           | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-extsimlist.md "EMRALD_Model#/definitions/MainModel/properties/ExtSimList")         |
| [StateList](#statelist-1)             | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-statelist.md "EMRALD_Model#/definitions/MainModel/properties/StateList")           |
| [ActionList](#actionlist-1)           | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-actionlist.md "EMRALD_Model#/definitions/MainModel/properties/ActionList")         |
| [EventList](#eventlist-1)             | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-eventlist.md "EMRALD_Model#/definitions/MainModel/properties/EventList")           |
| [LogicNodeList](#logicnodelist-1)     | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-logicnodelist.md "EMRALD_Model#/definitions/MainModel/properties/LogicNodeList")   |
| [VariableList](#variablelist-1)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-variablelist.md "EMRALD_Model#/definitions/MainModel/properties/VariableList")     |
| [templates](#templates-1)             | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-templates.md "EMRALD_Model#/definitions/MainModel/properties/templates")           |
| [multiThreadInfo](#multithreadinfo-1) | `object`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo.md "EMRALD_Model#/definitions/MainModel/properties/multiThreadInfo")                     |
| [changeLog](#changelog-1)             | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/MainModel/properties/changeLog")                                 |
| [group](#group-1)                     | `object`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-group.md "EMRALD_Model#/definitions/MainModel/properties/group")                                         |

### id

Temporary, only used internally for some identification or uniqueness needs

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-id.md "EMRALD_Model#/definitions/MainModel/properties/id")

#### id Type

`string`

### objType



`objType`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-objtype.md "EMRALD_Model#/definitions/MainModel/properties/objType")

#### objType Type

unknown

#### objType Constraints

**constant**: the value of this property must be equal to:

```json
"EMRALD_Model"
```

### name

Name of the EMRALD model

`name`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-name.md "EMRALD_Model#/definitions/MainModel/properties/name")

#### name Type

`string`

### desc

description of the EMRALD model

`desc`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-desc.md "EMRALD_Model#/definitions/MainModel/properties/desc")

#### desc Type

`string`

### emraldVersion

Version of the EMRALD model schema

`emraldVersion`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-emraldversion.md "EMRALD_Model#/definitions/MainModel/properties/emraldVersion")

#### emraldVersion Type

`number`

### version

Version of the users model

`version`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-version.md "EMRALD_Model#/definitions/MainModel/properties/version")

#### version Type

`number`

### versionHistory

The user's model version history and change descriptions

`versionHistory`

* is required

* Type: `object[]` ([VersionHistory](emrald_jsonschemav3_4-definitions-versionhistory.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-versionhistory.md "EMRALD_Model#/definitions/MainModel/properties/versionHistory")

#### versionHistory Type

`object[]` ([VersionHistory](emrald_jsonschemav3_4-definitions-versionhistory.md))

### filename

Name of the original file that was opened to help distinguish between different versions of the model.

`filename`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-filename.md "EMRALD_Model#/definitions/MainModel/properties/filename")

#### filename Type

`string`

### DiagramList

All the diagrams for the model

`DiagramList`

* is required

* Type: `object[]` ([Diagram](emrald_jsonschemav3_4-definitions-diagram.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-diagramlist.md "EMRALD_Model#/definitions/MainModel/properties/DiagramList")

#### DiagramList Type

`object[]` ([Diagram](emrald_jsonschemav3_4-definitions-diagram.md))

### ExtSimList

All the external simulation links for the mdoel

`ExtSimList`

* is required

* Type: `object[]` ([ExtSim](emrald_jsonschemav3_4-definitions-extsim.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-extsimlist.md "EMRALD_Model#/definitions/MainModel/properties/ExtSimList")

#### ExtSimList Type

`object[]` ([ExtSim](emrald_jsonschemav3_4-definitions-extsim.md))

### StateList

All of the states for the different diagrams of the model

`StateList`

* is required

* Type: `object[]` ([State](emrald_jsonschemav3_4-definitions-state.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-statelist.md "EMRALD_Model#/definitions/MainModel/properties/StateList")

#### StateList Type

`object[]` ([State](emrald_jsonschemav3_4-definitions-state.md))

### ActionList

All the actions that can be used in the model

`ActionList`

* is required

* Type: `object[]` ([Action](emrald_jsonschemav3_4-definitions-action.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-actionlist.md "EMRALD_Model#/definitions/MainModel/properties/ActionList")

#### ActionList Type

`object[]` ([Action](emrald_jsonschemav3_4-definitions-action.md))

### EventList

All the events that are used in the model.

`EventList`

* is required

* Type: `object[]` ([Event](emrald_jsonschemav3_4-definitions-event.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-eventlist.md "EMRALD_Model#/definitions/MainModel/properties/EventList")

#### EventList Type

`object[]` ([Event](emrald_jsonschemav3_4-definitions-event.md))

### LogicNodeList

All the logic nodes to make the logic trees in the model

`LogicNodeList`

* is required

* Type: `object[]` ([LogicNode](emrald_jsonschemav3_4-definitions-logicnode.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-logicnodelist.md "EMRALD_Model#/definitions/MainModel/properties/LogicNodeList")

#### LogicNodeList Type

`object[]` ([LogicNode](emrald_jsonschemav3_4-definitions-logicnode.md))

### VariableList

All the variables used in the model

`VariableList`

* is required

* Type: `object[]` ([Variable](emrald_jsonschemav3_4-definitions-variable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-variablelist.md "EMRALD_Model#/definitions/MainModel/properties/VariableList")

#### VariableList Type

`object[]` ([Variable](emrald_jsonschemav3_4-definitions-variable.md))

### templates

Templates available to make new diagrams in the model. These are basically small models all on their own.

`templates`

* is optional

* Type: `object[]` ([Main\_Model](emrald_jsonschemav3_4-definitions-main_model.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-templates.md "EMRALD_Model#/definitions/MainModel/properties/templates")

#### templates Type

`object[]` ([Main\_Model](emrald_jsonschemav3_4-definitions-main_model.md))

### multiThreadInfo



`multiThreadInfo`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-multithreadinfo.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo.md "EMRALD_Model#/definitions/MainModel/properties/multiThreadInfo")

#### multiThreadInfo Type

`object` ([Details](emrald_jsonschemav3_4-definitions-multithreadinfo.md))

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/MainModel/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

### group

What catagory grouping this item belongs to. Used to indicate a group for and EMRALD model template.

`group`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-group.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-group.md "EMRALD_Model#/definitions/MainModel/properties/group")

#### group Type

`object` ([Details](emrald_jsonschemav3_4-definitions-group.md))

## Definitions group Diagram

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/Diagram"}
```

| Property                            | Type          | Required | Nullable       | Defined by                                                                                                                                              |
| :---------------------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [id](#id-2)                         | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-id.md "EMRALD_Model#/definitions/Diagram/properties/id")                           |
| [objType](#objtype-2)               | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-objtype.md "EMRALD_Model#/definitions/Diagram/properties/objType")                 |
| [name](#name-2)                     | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-name.md "EMRALD_Model#/definitions/Diagram/properties/name")                       |
| [desc](#desc-2)                     | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-desc.md "EMRALD_Model#/definitions/Diagram/properties/desc")                       |
| [diagramType](#diagramtype)         | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-diagramtype.md "EMRALD_Model#/definitions/Diagram/properties/diagramType")         |
| [diagramTemplate](#diagramtemplate) | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-diagramtemplate.md "EMRALD_Model#/definitions/Diagram/properties/diagramTemplate") |
| [diagramLabel](#diagramlabel)       | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-diagramlabel.md "EMRALD_Model#/definitions/Diagram/properties/diagramLabel")       |
| [states](#states)                   | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-states.md "EMRALD_Model#/definitions/Diagram/properties/states")                   |
| [changeLog](#changelog-2)           | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/Diagram/properties/changeLog")                                |
| [required](#required)               | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-required.md "EMRALD_Model#/definitions/Diagram/properties/required")               |

### id

Optional. Only used for internal processing needs.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-id.md "EMRALD_Model#/definitions/Diagram/properties/id")

#### id Type

`string`

### objType



`objType`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-objtype.md "EMRALD_Model#/definitions/Diagram/properties/objType")

#### objType Type

unknown

#### objType Constraints

**constant**: the value of this property must be equal to:

```json
"Diagram"
```

### name

Name of the diagram

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-name.md "EMRALD_Model#/definitions/Diagram/properties/name")

#### name Type

`string`

### desc

description of the diagram

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-desc.md "EMRALD_Model#/definitions/Diagram/properties/desc")

#### desc Type

`string`

### diagramType

Type of the diagram. dtSingle - means you can only be in one state of the diagram at a time and states evaluate to a value. dtMulti - means you can be in multiple states at a time, but cant evaluate the diagram

`diagramType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-diagramtype.md "EMRALD_Model#/definitions/Diagram/properties/diagramType")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-diagramtemplate.md "EMRALD_Model#/definitions/Diagram/properties/diagramTemplate")

#### diagramTemplate Type

`string`

### diagramLabel

Name of grouping in the UI for this diagram

`diagramLabel`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-diagramlabel.md "EMRALD_Model#/definitions/Diagram/properties/diagramLabel")

#### diagramLabel Type

`string`

### states

Names of the states used in this diagram

`states`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-states.md "EMRALD_Model#/definitions/Diagram/properties/states")

#### states Type

`string[]`

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/Diagram/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-diagram-properties-required.md "EMRALD_Model#/definitions/Diagram/properties/required")

#### required Type

`boolean`

## Definitions group ExtSim

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/ExtSim"}
```

| Property                      | Type          | Required | Nullable       | Defined by                                                                                                                                      |
| :---------------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id-3)                   | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-extsim-properties-id.md "EMRALD_Model#/definitions/ExtSim/properties/id")                     |
| [objType](#objtype-3)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-extsim-properties-objtype.md "EMRALD_Model#/definitions/ExtSim/properties/objType")           |
| [name](#name-3)               | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-extsim-properties-name.md "EMRALD_Model#/definitions/ExtSim/properties/name")                 |
| [resourceName](#resourcename) | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-extsim-properties-resourcename.md "EMRALD_Model#/definitions/ExtSim/properties/resourceName") |
| [required](#required-1)       | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-extsim-properties-required.md "EMRALD_Model#/definitions/ExtSim/properties/required")         |

### id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-extsim-properties-id.md "EMRALD_Model#/definitions/ExtSim/properties/id")

#### id Type

`string`

### objType



`objType`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-extsim-properties-objtype.md "EMRALD_Model#/definitions/ExtSim/properties/objType")

#### objType Type

unknown

#### objType Constraints

**constant**: the value of this property must be equal to:

```json
"ExtSim"
```

### name

referenace name in the model for the external simulation

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-extsim-properties-name.md "EMRALD_Model#/definitions/ExtSim/properties/name")

#### name Type

`string`

### resourceName

name of resource type to connect to in MsgServer, not unique if more than one simulation of the same tool

`resourceName`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-extsim-properties-resourcename.md "EMRALD_Model#/definitions/ExtSim/properties/resourceName")

#### resourceName Type

`string`

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-extsim-properties-required.md "EMRALD_Model#/definitions/ExtSim/properties/required")

#### required Type

`boolean`

## Definitions group State

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/State"}
```

| Property                                            | Type          | Required | Nullable       | Defined by                                                                                                                                                          |
| :-------------------------------------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [id](#id-4)                                         | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-id.md "EMRALD_Model#/definitions/State/properties/id")                                           |
| [objType](#objtype-4)                               | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-objtype.md "EMRALD_Model#/definitions/State/properties/objType")                                 |
| [name](#name-4)                                     | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-name.md "EMRALD_Model#/definitions/State/properties/name")                                       |
| [desc](#desc-3)                                     | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-desc.md "EMRALD_Model#/definitions/State/properties/desc")                                       |
| [stateType](#statetype)                             | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-statetype.md "EMRALD_Model#/definitions/State/properties/stateType")                             |
| [diagramName](#diagramname)                         | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-diagramname.md "EMRALD_Model#/definitions/State/properties/diagramName")                         |
| [immediateActions](#immediateactions)               | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-immediateactions.md "EMRALD_Model#/definitions/State/properties/immediateActions")               |
| [events](#events)                                   | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-events.md "EMRALD_Model#/definitions/State/properties/events")                                   |
| [eventActions](#eventactions)                       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-eventactions.md "EMRALD_Model#/definitions/State/properties/eventActions")                       |
| [geometryInfo](#geometryinfo)                       | `object`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-geometryinfo.md "EMRALD_Model#/definitions/State/properties/geometryInfo")                                        |
| [changeLog](#changelog-3)                           | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/State/properties/changeLog")                                              |
| [defaultSingleStateValue](#defaultsinglestatevalue) | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-defaultsinglestatevalue.md "EMRALD_Model#/definitions/State/properties/defaultSingleStateValue") |
| [required](#required-2)                             | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-required.md "EMRALD_Model#/definitions/State/properties/required")                               |

### id



`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-id.md "EMRALD_Model#/definitions/State/properties/id")

#### id Type

`string`

### objType



`objType`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-objtype.md "EMRALD_Model#/definitions/State/properties/objType")

#### objType Type

unknown

#### objType Constraints

**constant**: the value of this property must be equal to:

```json
"State"
```

### name

referenace name in the model for state

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-name.md "EMRALD_Model#/definitions/State/properties/name")

#### name Type

`string`

### desc

User entered description of the state

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-desc.md "EMRALD_Model#/definitions/State/properties/desc")

#### desc Type

`string`

### stateType

Type of the state

`stateType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-statetype.md "EMRALD_Model#/definitions/State/properties/stateType")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-diagramname.md "EMRALD_Model#/definitions/State/properties/diagramName")

#### diagramName Type

`string`

### immediateActions

Array of name references for the immediate actions to be run when entering the state

`immediateActions`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-immediateactions.md "EMRALD_Model#/definitions/State/properties/immediateActions")

#### immediateActions Type

`string[]`

### events

Array of name references to events. These event will be monitored for when in this state.

`events`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-events.md "EMRALD_Model#/definitions/State/properties/events")

#### events Type

`string[]`

### eventActions

actions for the events in sibling "events" array. One to one relationship.

`eventActions`

* is required

* Type: `object[]` ([EventActionItems](emrald_jsonschemav3_4-definitions-state-properties-eventactions-eventactionitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-eventactions.md "EMRALD_Model#/definitions/State/properties/eventActions")

#### eventActions Type

`object[]` ([EventActionItems](emrald_jsonschemav3_4-definitions-state-properties-eventactions-eventactionitems.md))

### geometryInfo

position for the GUI

`geometryInfo`

* is optional

* Type: `object` ([GeometryInfo](emrald_jsonschemav3_4-definitions-geometryinfo.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-geometryinfo.md "EMRALD_Model#/definitions/State/properties/geometryInfo")

#### geometryInfo Type

`object` ([GeometryInfo](emrald_jsonschemav3_4-definitions-geometryinfo.md))

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/State/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

### defaultSingleStateValue

For single state diagrams. Boolean value for the diagram when evaluated in a logic tree. Ignore - removes that item from the logic calculation.

`defaultSingleStateValue`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-defaultsinglestatevalue.md "EMRALD_Model#/definitions/State/properties/defaultSingleStateValue")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-state-properties-required.md "EMRALD_Model#/definitions/State/properties/required")

#### required Type

`boolean`

## Definitions group Action

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/Action"}
```

| Property                                              | Type          | Required | Nullable       | Defined by                                                                                                                                                              |
| :---------------------------------------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id-5)                                           | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-id.md "EMRALD_Model#/definitions/Action/properties/id")                                             |
| [objType](#objtype-5)                                 | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-objtype.md "EMRALD_Model#/definitions/Action/properties/objType")                                   |
| [name](#name-5)                                       | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-name.md "EMRALD_Model#/definitions/Action/properties/name")                                         |
| [desc](#desc-4)                                       | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-desc.md "EMRALD_Model#/definitions/Action/properties/desc")                                         |
| [actType](#acttype)                                   | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-acttype.md "EMRALD_Model#/definitions/Action/properties/actType")                                   |
| [mainItem](#mainitem)                                 | `boolean`     | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-mainitem.md "EMRALD_Model#/definitions/Action/properties/mainItem")                                 |
| [mutExcl](#mutexcl)                                   | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-mutexcl.md "EMRALD_Model#/definitions/Action/properties/mutExcl")                                   |
| [newStates](#newstates)                               | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-newstates.md "EMRALD_Model#/definitions/Action/properties/newStates")                               |
| [scriptCode](#scriptcode)                             | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-scriptcode.md "EMRALD_Model#/definitions/Action/properties/scriptCode")                             |
| [variableName](#variablename)                         | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-variablename.md "EMRALD_Model#/definitions/Action/properties/variableName")                         |
| [codeVariables](#codevariables)                       | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-codevariables.md "EMRALD_Model#/definitions/Action/properties/codeVariables")                       |
| [useDistribution](#usedistribution)                   | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-usedistribution.md "EMRALD_Model#/definitions/Action/properties/useDistribution")                   |
| [distType](#disttype)                                 | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-disttype.md "EMRALD_Model#/definitions/Action/properties/distType")                                 |
| [parameters](#parameters)                             | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-parameters.md "EMRALD_Model#/definitions/Action/properties/parameters")                             |
| [sim3DMessage](#sim3dmessage)                         | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-sim3dmessage.md "EMRALD_Model#/definitions/Action/properties/sim3DMessage")                         |
| [extSim](#extsim)                                     | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-extsim.md "EMRALD_Model#/definitions/Action/properties/extSim")                                     |
| [sim3DVariable](#sim3dvariable)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-sim3dvariable.md "EMRALD_Model#/definitions/Action/properties/sim3DVariable")                       |
| [openSimVarParams](#opensimvarparams)                 | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-opensimvarparams.md "EMRALD_Model#/definitions/Action/properties/openSimVarParams")                 |
| [sim3DModelRef](#sim3dmodelref)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-sim3dmodelref.md "EMRALD_Model#/definitions/Action/properties/sim3DModelRef")                       |
| [sim3DConfigData](#sim3dconfigdata)                   | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-sim3dconfigdata.md "EMRALD_Model#/definitions/Action/properties/sim3DConfigData")                   |
| [simEndTime](#simendtime)                             | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-simendtime.md "EMRALD_Model#/definitions/Action/properties/simEndTime")                             |
| [makeInputFileCode](#makeinputfilecode)               | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-makeinputfilecode.md "EMRALD_Model#/definitions/Action/properties/makeInputFileCode")               |
| [exePath](#exepath)                                   | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-exepath.md "EMRALD_Model#/definitions/Action/properties/exePath")                                   |
| [ExeFromPreCode](#exefromprecode)                     | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-exefromprecode.md "EMRALD_Model#/definitions/Action/properties/ExeFromPreCode")                     |
| [useProjPathExeWorkingDir](#useprojpathexeworkingdir) | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-useprojpathexeworkingdir.md "EMRALD_Model#/definitions/Action/properties/useProjPathExeWorkingDir") |
| [processOutputFileCode](#processoutputfilecode)       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-processoutputfilecode.md "EMRALD_Model#/definitions/Action/properties/processOutputFileCode")       |
| [formData](#formdata)                                 | `object`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-formdata.md "EMRALD_Model#/definitions/Action/properties/formData")                                 |
| [template](#template)                                 | `object`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-template.md "EMRALD_Model#/definitions/Action/properties/template")                                 |
| [returnProcess](#returnprocess)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-returnprocess.md "EMRALD_Model#/definitions/Action/properties/returnProcess")                       |
| [changeLog](#changelog-4)                             | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/Action/properties/changeLog")                                                 |
| [raType](#ratype)                                     | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-ratype.md "EMRALD_Model#/definitions/Action/properties/raType")                                     |
| [updateVariables](#updatevariables)                   | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-updatevariables.md "EMRALD_Model#/definitions/Action/properties/updateVariables")                   |
| [required](#required-3)                               | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-required.md "EMRALD_Model#/definitions/Action/properties/required")                                 |

### id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-id.md "EMRALD_Model#/definitions/Action/properties/id")

#### id Type

`string`

### objType



`objType`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-objtype.md "EMRALD_Model#/definitions/Action/properties/objType")

#### objType Type

unknown

#### objType Constraints

**constant**: the value of this property must be equal to:

```json
"Action"
```

### name

referenace name in the model for the action

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-name.md "EMRALD_Model#/definitions/Action/properties/name")

#### name Type

`string`

### desc

User entered description of the action

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-desc.md "EMRALD_Model#/definitions/Action/properties/desc")

#### desc Type

`string`

### actType

The type of action

`actType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-acttype.md "EMRALD_Model#/definitions/Action/properties/actType")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-mainitem.md "EMRALD_Model#/definitions/Action/properties/mainItem")

#### mainItem Type

`boolean`

### mutExcl

Optional. Only one action may be taken so the probability determines if this action is taken vs another in the EventAction list. If false then the probability is used to sample if this action occured and multiple or no actions could happen when the event is triggered.

`mutExcl`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-mutexcl.md "EMRALD_Model#/definitions/Action/properties/mutExcl")

#### mutExcl Type

`boolean`

### newStates

Optional. If this is a transition action then these are the states that it could be transitioned to.

`newStates`

* is optional

* Type: `object[]` ([NewState](emrald_jsonschemav3_4-definitions-newstate.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-newstates.md "EMRALD_Model#/definitions/Action/properties/newStates")

#### newStates Type

`object[]` ([NewState](emrald_jsonschemav3_4-definitions-newstate.md))

### scriptCode

Optionsl. Script code to be executed if the action type has a script

`scriptCode`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-scriptcode.md "EMRALD_Model#/definitions/Action/properties/scriptCode")

#### scriptCode Type

`string`

### variableName

Optional. For change var value actions, the result of the script is assigned to this variable name reference.

`variableName`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-variablename.md "EMRALD_Model#/definitions/Action/properties/variableName")

#### variableName Type

`string`

### codeVariables

Optional. If action has a script, these are the variable name references for variables used in the script. All variables used in script must be in this list.

`codeVariables`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-codevariables.md "EMRALD_Model#/definitions/Action/properties/codeVariables")

#### codeVariables Type

`string[]`

### useDistribution

Optional. For action type atCngVarVal. When true, the new value is sampled from the distribution defined by distType and parameters instead of running scriptCode. Defaults to false (use code) when unset.

`useDistribution`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-usedistribution.md "EMRALD_Model#/definitions/Action/properties/useDistribution")

#### useDistribution Type

`boolean`

### distType

Optional. For event type of etDistribution this is the type of distribution the user selected.

`distType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-disttype.md "EMRALD_Model#/definitions/Action/properties/distType")

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

Optional. For action type atCngVarVal when useDistribution is true, this is the array of distribution parameters. The shape is shared with etDistribution events for convenience, but the timeRate field on each parameter is ignored for atCngVarVal (variable values are unitless raw numbers, not durations).

`parameters`

* is optional

* Type: `object[]` ([EventDistributionParameter](emrald_jsonschemav3_4-definitions-eventdistributionparameter.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-parameters.md "EMRALD_Model#/definitions/Action/properties/parameters")

#### parameters Type

`object[]` ([EventDistributionParameter](emrald_jsonschemav3_4-definitions-eventdistributionparameter.md))

### sim3DMessage

Optional. For action type at3DSimMsg, this is the message to be sent to the coupled external simulation.

`sim3DMessage`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-sim3dmessage.md "EMRALD_Model#/definitions/Action/properties/sim3DMessage")

#### sim3DMessage Type

`string`

### extSim

Optional. For action type at3DSimMsg, this is the name of the coupled external sim to send the message to.

`extSim`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-extsim.md "EMRALD_Model#/definitions/Action/properties/extSim")

#### extSim Type

`string`

### sim3DVariable

Optional. For action type at3DSimMsg and a sim3DMessage of atCompModify, this is the name of the variable in the external simulation to be modified by the message.

`sim3DVariable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-sim3dvariable.md "EMRALD_Model#/definitions/Action/properties/sim3DVariable")

#### sim3DVariable Type

`string`

### openSimVarParams

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this flag indicates that the JSON has the properties for sim3DModelRef, sim3DConfigData, and simEndTime.

`openSimVarParams`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-opensimvarparams.md "EMRALD_Model#/definitions/Action/properties/openSimVarParams")

#### openSimVarParams Type

`boolean`

### sim3DModelRef

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the data defined by the user that is used by the external simulation on startup. Typically a path to a model it need to open.

`sim3DModelRef`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-sim3dmodelref.md "EMRALD_Model#/definitions/Action/properties/sim3DModelRef")

#### sim3DModelRef Type

`string`

### sim3DConfigData

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the data defined by the user that is used by the external simulation on startup.

`sim3DConfigData`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-sim3dconfigdata.md "EMRALD_Model#/definitions/Action/properties/sim3DConfigData")

#### sim3DConfigData Type

`string`

### simEndTime

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the end simulation time defined by the user that is used by the external simulation on startup.

`simEndTime`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-simendtime.md "EMRALD_Model#/definitions/Action/properties/simEndTime")

#### simEndTime Type

`string`

### makeInputFileCode

Optional. For action type atRunExtApp. It is the C# script to be executed and the result strig  passed as a parameter to the executable to be run.

`makeInputFileCode`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-makeinputfilecode.md "EMRALD_Model#/definitions/Action/properties/makeInputFileCode")

#### makeInputFileCode Type

`string`

### exePath

Optional. For action type atRunExtApp. It is the path of the exe to be run. It can be relative to the location of the EMRALD model.

`exePath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-exepath.md "EMRALD_Model#/definitions/Action/properties/exePath")

#### exePath Type

`string`

### ExeFromPreCode

Optional. For action type atRunExtApp. When true, the preprocessor code return string determines the executable to run instead of exePath.

`ExeFromPreCode`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-exefromprecode.md "EMRALD_Model#/definitions/Action/properties/ExeFromPreCode")

#### ExeFromPreCode Type

`boolean`

#### ExeFromPreCode Default Value

The default value is:

```json
false
```

### useProjPathExeWorkingDir

Optional. For action type atRunExtApp. When true, the executable working directory is the model project path instead of the executable directory.

`useProjPathExeWorkingDir`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-useprojpathexeworkingdir.md "EMRALD_Model#/definitions/Action/properties/useProjPathExeWorkingDir")

#### useProjPathExeWorkingDir Type

`boolean`

#### useProjPathExeWorkingDir Default Value

The default value is:

```json
false
```

### processOutputFileCode

Optional. For action type atRunExtApp. It is the C# script to be executed after the accociated exe is ran. Typically it reads a result file and script typically returns a string list with +/-\[StateName] to shift out or into a state because of the results..

`processOutputFileCode`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-processoutputfilecode.md "EMRALD_Model#/definitions/Action/properties/processOutputFileCode")

#### processOutputFileCode Type

`string`

### formData

Used for executing applications with custom form data. This can be anything needed by the custom form, but in the end only the standard atRunExtApp fields are used to do the action. TODO: This type definition is set up for only the MAAP form. If other forms are added in the future, this definition will need to be adjusted for their form data formats.

`formData`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-action-properties-formdata.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-formdata.md "EMRALD_Model#/definitions/Action/properties/formData")

#### formData Type

`object` ([Details](emrald_jsonschemav3_4-definitions-action-properties-formdata.md))

### template

Optional. For action type atRunExtApp. It is used for custom app form.

`template`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-action-properties-template.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-template.md "EMRALD_Model#/definitions/Action/properties/template")

#### template Type

`object` ([Details](emrald_jsonschemav3_4-definitions-action-properties-template.md))

### returnProcess

Optional. For action type atRunExtApp. It is flag to indicate the type of return from the processOutputFileCode. If rtNone then it has no return, othrwise the C# script must return a List of strings with +/-\[StateName] to shift out or into a state.

`returnProcess`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-returnprocess.md "EMRALD_Model#/definitions/Action/properties/returnProcess")

#### returnProcess Type

`string`

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/Action/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

### raType

String for the run application action, only for UI used. Options depend on the custom UI forms made. "code" means default user defined pre and post execution code is used.

`raType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-ratype.md "EMRALD_Model#/definitions/Action/properties/raType")

#### raType Type

`string`

### updateVariables

Used for custom form, variables used in the form.

`updateVariables`

* is optional

* Type: `array`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-updatevariables.md "EMRALD_Model#/definitions/Action/properties/updateVariables")

#### updateVariables Type

`array`

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-action-properties-required.md "EMRALD_Model#/definitions/Action/properties/required")

#### required Type

`boolean`

## Definitions group Event

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/Event"}
```

| Property                                  | Type          | Required | Nullable       | Defined by                                                                                                                                                |
| :---------------------------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id-6)                               | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-id.md "EMRALD_Model#/definitions/Event/properties/id")                                 |
| [objType](#objtype-6)                     | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-objtype.md "EMRALD_Model#/definitions/Event/properties/objType")                       |
| [name](#name-6)                           | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-name.md "EMRALD_Model#/definitions/Event/properties/name")                             |
| [desc](#desc-5)                           | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-desc.md "EMRALD_Model#/definitions/Event/properties/desc")                             |
| [mainItem](#mainitem-1)                   | `boolean`     | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-mainitem.md "EMRALD_Model#/definitions/Event/properties/mainItem")                     |
| [evType](#evtype)                         | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-evtype.md "EMRALD_Model#/definitions/Event/properties/evType")                         |
| [allItems](#allitems)                     | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-allitems.md "EMRALD_Model#/definitions/Event/properties/allItems")                     |
| [triggerStates](#triggerstates)           | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-triggerstates.md "EMRALD_Model#/definitions/Event/properties/triggerStates")           |
| [varNames](#varnames)                     | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-varnames.md "EMRALD_Model#/definitions/Event/properties/varNames")                     |
| [ifInState](#ifinstate)                   | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-ifinstate.md "EMRALD_Model#/definitions/Event/properties/ifInState")                   |
| [evalEvOnStateEntry](#evalevonstateentry) | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-evalevonstateentry.md "EMRALD_Model#/definitions/Event/properties/evalEvOnStateEntry") |
| [onSuccess](#onsuccess)                   | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-onsuccess.md "EMRALD_Model#/definitions/Event/properties/onSuccess")                   |
| [triggerOnFalse](#triggeronfalse)         | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-triggeronfalse.md "EMRALD_Model#/definitions/Event/properties/triggerOnFalse")         |
| [logicTop](#logictop)                     | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-logictop.md "EMRALD_Model#/definitions/Event/properties/logicTop")                     |
| [lambda](#lambda)                         | Merged        | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-lambda.md "EMRALD_Model#/definitions/Event/properties/lambda")                         |
| [lambdaTimeRate](#lambdatimerate)         | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-lambdatimerate.md "EMRALD_Model#/definitions/Event/properties/lambdaTimeRate")         |
| [useVariable](#usevariable)               | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-usevariable.md "EMRALD_Model#/definitions/Event/properties/useVariable")               |
| [onVarChange](#onvarchange)               | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-onvarchange.md "EMRALD_Model#/definitions/Event/properties/onVarChange")               |
| [time](#time)                             | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-time.md "EMRALD_Model#/definitions/Event/properties/time")                             |
| [timeVariableUnit](#timevariableunit)     | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-timevariableunit.md "EMRALD_Model#/definitions/Event/properties/timeVariableUnit")     |
| [fromSimStart](#fromsimstart)             | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-fromsimstart.md "EMRALD_Model#/definitions/Event/properties/fromSimStart")             |
| [extEventType](#exteventtype)             | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-exteventtype.md "EMRALD_Model#/definitions/Event/properties/extEventType")             |
| [variable](#variable)                     | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-variable.md "EMRALD_Model#/definitions/Event/properties/variable")                     |
| [code](#code)                             | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-code.md "EMRALD_Model#/definitions/Event/properties/code")                             |
| [distType](#disttype-1)                   | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-disttype.md "EMRALD_Model#/definitions/Event/properties/distType")                     |
| [parameters](#parameters-1)               | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-parameters.md "EMRALD_Model#/definitions/Event/properties/parameters")                 |
| [persistent](#persistent)                 | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-persistent.md "EMRALD_Model#/definitions/Event/properties/persistent")                 |
| [dfltTimeRate](#dflttimerate)             | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-dflttimerate.md "EMRALD_Model#/definitions/Event/properties/dfltTimeRate")             |
| [changeLog](#changelog-5)                 | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/Event/properties/changeLog")                                    |
| [required](#required-4)                   | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-required.md "EMRALD_Model#/definitions/Event/properties/required")                     |

### id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-id.md "EMRALD_Model#/definitions/Event/properties/id")

#### id Type

`string`

### objType



`objType`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-objtype.md "EMRALD_Model#/definitions/Event/properties/objType")

#### objType Type

unknown

#### objType Constraints

**constant**: the value of this property must be equal to:

```json
"Event"
```

### name

referenace name in the event in the model.

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-name.md "EMRALD_Model#/definitions/Event/properties/name")

#### name Type

`string`

### desc

User entered description of the event.

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-desc.md "EMRALD_Model#/definitions/Event/properties/desc")

#### desc Type

`string`

### mainItem

Is this a global item to show up in the global list, If false it showes up in local or all list.

`mainItem`

* is required

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-mainitem.md "EMRALD_Model#/definitions/Event/properties/mainItem")

#### mainItem Type

`boolean`

### evType

Type of the event

`evType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-evtype.md "EMRALD_Model#/definitions/Event/properties/evType")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-allitems.md "EMRALD_Model#/definitions/Event/properties/allItems")

#### allItems Type

`boolean`

### triggerStates

Optional. For event type etStateCng. List of state name references as part of the criteria needed to trigger the event. These are the states that need to be entered or exited to tirgger the event.

`triggerStates`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-triggerstates.md "EMRALD_Model#/definitions/Event/properties/triggerStates")

#### triggerStates Type

`string[]`

### varNames

Optional, Name references for all variables used in scripts if the event type uses scripts.

`varNames`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-varnames.md "EMRALD_Model#/definitions/Event/properties/varNames")

#### varNames Type

`string[]`

### ifInState

Optional. For event type etStateCng, flag to indicate that event is triggired when entering or exiting states listed in triggerStates array. On Enter State/s or On Exit State/s

`ifInState`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-ifinstate.md "EMRALD_Model#/definitions/Event/properties/ifInState")

#### ifInState Type

`boolean`

### evalEvOnStateEntry

Optional. For event type etStateCng, flag to indicate that the event should be evaluated when entering the state so that it is triggered without something changing. Enter State/s or On Exit State/s becomes Enter State/s or already in and On Exit State/s or not in

`evalEvOnStateEntry`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-evalevonstateentry.md "EMRALD_Model#/definitions/Event/properties/evalEvOnStateEntry")

#### evalEvOnStateEntry Type

`boolean`

### onSuccess

Optional. For event type etStateCng, flag to indicate that event is triggering needs all the items or just one or rmore from the states listed in triggerStates array. checkbox - All Items

`onSuccess`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-onsuccess.md "EMRALD_Model#/definitions/Event/properties/onSuccess")

#### onSuccess Type

`boolean`

### triggerOnFalse

Optional. For event type etComponentLogic, flag to indicate that event is triggered if logic tree evaluates to a False, otherwise it triggeres on true.

`triggerOnFalse`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-triggeronfalse.md "EMRALD_Model#/definitions/Event/properties/triggerOnFalse")

#### triggerOnFalse Type

`boolean`

### logicTop

Optional. For event type etComponentLogic, this is the logic tree name to be evaluated for triggering the event.

`logicTop`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-logictop.md "EMRALD_Model#/definitions/Event/properties/logicTop")

#### logicTop Type

`string`

### lambda

Optional. Parameter for a event with type of etFailRate. It is either a number or the name of a variable if useVariable is true

`lambda`

* is optional

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-event-properties-lambda.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-lambda.md "EMRALD_Model#/definitions/Event/properties/lambda")

#### lambda Type

merged type ([Details](emrald_jsonschemav3_4-definitions-event-properties-lambda.md))

any of

* [Untitled string in EMRALD_Model](emrald_jsonschemav3_4-definitions-event-properties-lambda-anyof-0.md "check type definition")

* [Untitled number in EMRALD_Model](emrald_jsonschemav3_4-definitions-event-properties-lambda-anyof-1.md "check type definition")

### lambdaTimeRate

Optional. arameter for a event with type of etFailRate. It is the lambda value time frequency.

`lambdaTimeRate`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-lambdatimerate.md "EMRALD_Model#/definitions/Event/properties/lambdaTimeRate")

#### lambdaTimeRate Type

`string`

### useVariable

Optional. Indicates that variables can be used for the fields

`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-usevariable.md "EMRALD_Model#/definitions/Event/properties/useVariable")

#### useVariable Type

`boolean`

### onVarChange

Optional. When an event uses a variable and that variable changes, this tells the code how to update the event.

`onVarChange`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-onvarchange.md "EMRALD_Model#/definitions/Event/properties/onVarChange")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-time.md "EMRALD_Model#/definitions/Event/properties/time")

#### time Type

`string`

### timeVariableUnit

Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.

`timeVariableUnit`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-timevariableunit.md "EMRALD_Model#/definitions/Event/properties/timeVariableUnit")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-fromsimstart.md "EMRALD_Model#/definitions/Event/properties/fromSimStart")

#### fromSimStart Type

`boolean`

### extEventType

Optional. For events of type et3dSimEv. This the type of message being sent to the external simulation. See the external messeage JSON schema.

`extEventType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-exteventtype.md "EMRALD_Model#/definitions/Event/properties/extEventType")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-variable.md "EMRALD_Model#/definitions/Event/properties/variable")

#### variable Type

`string`

### code

Optional. For event type et3dSimEv and extEventType etCompEv. It is the reference name for the variable. If that variable is modified by the external code, then this code script is executed to determine if the event is triggered.

`code`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-code.md "EMRALD_Model#/definitions/Event/properties/code")

#### code Type

`string`

### distType

Optional. For event type of etDistribution this is the type of distribution the user selected.

`distType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-disttype.md "EMRALD_Model#/definitions/Event/properties/distType")

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

* Type: `object[]` ([EventDistributionParameter](emrald_jsonschemav3_4-definitions-eventdistributionparameter.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-parameters.md "EMRALD_Model#/definitions/Event/properties/parameters")

#### parameters Type

`object[]` ([EventDistributionParameter](emrald_jsonschemav3_4-definitions-eventdistributionparameter.md))

### persistent

Optional. For event type of etFailRate, etDistribution, and etTimer. Sets the event value as being persistent, keeping the initial sampled time between state movements and only re-samples after it occurs.

`persistent`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-persistent.md "EMRALD_Model#/definitions/Event/properties/persistent")

#### persistent Type

`boolean`

### dfltTimeRate

Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.

`dfltTimeRate`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-dflttimerate.md "EMRALD_Model#/definitions/Event/properties/dfltTimeRate")

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

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/Event/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-event-properties-required.md "EMRALD_Model#/definitions/Event/properties/required")

#### required Type

`boolean`

## Definitions group LogicNode

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/LogicNode"}
```

| Property                      | Type          | Required | Nullable       | Defined by                                                                                                                                            |
| :---------------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id-7)                   | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-id.md "EMRALD_Model#/definitions/LogicNode/properties/id")                     |
| [objType](#objtype-7)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-objtype.md "EMRALD_Model#/definitions/LogicNode/properties/objType")           |
| [name](#name-7)               | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-name.md "EMRALD_Model#/definitions/LogicNode/properties/name")                 |
| [desc](#desc-6)               | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-desc.md "EMRALD_Model#/definitions/LogicNode/properties/desc")                 |
| [gateType](#gatetype)         | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-gatetype.md "EMRALD_Model#/definitions/LogicNode/properties/gateType")         |
| [compChildren](#compchildren) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-compchild.md "EMRALD_Model#/definitions/LogicNode/properties/compChildren")                         |
| [gateChildren](#gatechildren) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-gatechildren.md "EMRALD_Model#/definitions/LogicNode/properties/gateChildren") |
| [isRoot](#isroot)             | `boolean`     | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-isroot.md "EMRALD_Model#/definitions/LogicNode/properties/isRoot")             |
| [changeLog](#changelog-6)     | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/LogicNode/properties/changeLog")                            |
| [required](#required-5)       | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-required.md "EMRALD_Model#/definitions/LogicNode/properties/required")         |

### id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-id.md "EMRALD_Model#/definitions/LogicNode/properties/id")

#### id Type

`string`

### objType



`objType`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-objtype.md "EMRALD_Model#/definitions/LogicNode/properties/objType")

#### objType Type

unknown

#### objType Constraints

**constant**: the value of this property must be equal to:

```json
"LogicNode"
```

### name

referenace name in the logic node

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-name.md "EMRALD_Model#/definitions/LogicNode/properties/name")

#### name Type

`string`

### desc

User entered description of the logic node

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-desc.md "EMRALD_Model#/definitions/LogicNode/properties/desc")

#### desc Type

`string`

### gateType

Gate type for the logic node

`gateType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-gatetype.md "EMRALD_Model#/definitions/LogicNode/properties/gateType")

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

* Type: `object[]` ([CompChildItems](emrald_jsonschemav3_4-definitions-compchild-compchilditems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-compchild.md "EMRALD_Model#/definitions/LogicNode/properties/compChildren")

#### compChildren Type

`object[]` ([CompChildItems](emrald_jsonschemav3_4-definitions-compchild-compchilditems.md))

### gateChildren

Array of logic node names that are children of this gate.

`gateChildren`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-gatechildren.md "EMRALD_Model#/definitions/LogicNode/properties/gateChildren")

#### gateChildren Type

`string[]`

### isRoot

Flag indicating that this is to be displayed as a tree top in the UI and can be used in an evaluate logic tree event.

`isRoot`

* is required

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-isroot.md "EMRALD_Model#/definitions/LogicNode/properties/isRoot")

#### isRoot Type

`boolean`

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/LogicNode/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-logicnode-properties-required.md "EMRALD_Model#/definitions/LogicNode/properties/required")

#### required Type

`boolean`

## Definitions group Variable

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/Variable"}
```

| Property                                  | Type          | Required | Nullable       | Defined by                                                                                                                                                      |
| :---------------------------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id-8)                               | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-id.md "EMRALD_Model#/definitions/Variable/properties/id")                                 |
| [objType](#objtype-8)                     | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-objtype.md "EMRALD_Model#/definitions/Variable/properties/objType")                       |
| [name](#name-8)                           | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-name.md "EMRALD_Model#/definitions/Variable/properties/name")                             |
| [desc](#desc-7)                           | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-desc.md "EMRALD_Model#/definitions/Variable/properties/desc")                             |
| [varScope](#varscope)                     | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-varscope.md "EMRALD_Model#/definitions/Variable/properties/varScope")                     |
| [value](#value)                           | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-value.md "EMRALD_Model#/definitions/Variable/properties/value")                           |
| [docLink](#doclink)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-doclink.md "EMRALD_Model#/definitions/Variable/properties/docLink")                       |
| [docType](#doctype)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-doctype.md "EMRALD_Model#/definitions/Variable/properties/docType")                       |
| [docPath](#docpath)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-docpath.md "EMRALD_Model#/definitions/Variable/properties/docPath")                       |
| [pathMustExist](#pathmustexist)           | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-pathmustexist.md "EMRALD_Model#/definitions/Variable/properties/pathMustExist")           |
| [type](#type)                             | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-type.md "EMRALD_Model#/definitions/Variable/properties/type")                             |
| [accrualStatesData](#accrualstatesdata)   | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-accrualstatesdata.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData")   |
| [regExpLine](#regexpline)                 | `integer`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-regexpline.md "EMRALD_Model#/definitions/Variable/properties/regExpLine")                 |
| [begPosition](#begposition)               | `integer`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-begposition.md "EMRALD_Model#/definitions/Variable/properties/begPosition")               |
| [numChars](#numchars)                     | `integer`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-numchars.md "EMRALD_Model#/definitions/Variable/properties/numChars")                     |
| [regExpGroup](#regexpgroup)               | `integer`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-regexpgroup.md "EMRALD_Model#/definitions/Variable/properties/regExpGroup")               |
| [resetOnRuns](#resetonruns)               | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-resetonruns.md "EMRALD_Model#/definitions/Variable/properties/resetOnRuns")               |
| [resourceName](#resourcename-1)           | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-resourcename.md "EMRALD_Model#/definitions/Variable/properties/resourceName")             |
| [sim3DId](#sim3did)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-sim3did.md "EMRALD_Model#/definitions/Variable/properties/sim3DId")                       |
| [extSim](#extsim-1)                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-extsim.md "EMRALD_Model#/definitions/Variable/properties/extSim")                         |
| [WatchEventCriteria](#watcheventcriteria) | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-watcheventcriteria.md "EMRALD_Model#/definitions/Variable/properties/WatchEventCriteria") |
| [changeLog](#changelog-7)                 | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/Variable/properties/changeLog")                                       |
| [cumulativeStats](#cumulativestats)       | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-cumulativestats.md "EMRALD_Model#/definitions/Variable/properties/cumulativeStats")       |
| [monitorInSim](#monitorinsim)             | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-monitorinsim.md "EMRALD_Model#/definitions/Variable/properties/monitorInSim")             |
| [canMonitor](#canmonitor)                 | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-canmonitor.md "EMRALD_Model#/definitions/Variable/properties/canMonitor")                 |
| [inVariable](#invariable)                 | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-invariable.md "EMRALD_Model#/definitions/Variable/properties/inVariable")                 |
| [outVariable](#outvariable)               | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-outvariable.md "EMRALD_Model#/definitions/Variable/properties/outVariable")               |
| [required](#required-6)                   | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-required.md "EMRALD_Model#/definitions/Variable/properties/required")                     |

### id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-id.md "EMRALD_Model#/definitions/Variable/properties/id")

#### id Type

`string`

### objType



`objType`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-objtype.md "EMRALD_Model#/definitions/Variable/properties/objType")

#### objType Type

unknown

#### objType Constraints

**constant**: the value of this property must be equal to:

```json
"Variable"
```

### name

referenace name in the model for the variable

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-name.md "EMRALD_Model#/definitions/Variable/properties/name")

#### name Type

`string`

### desc

User entered description of the variable

`desc`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-desc.md "EMRALD_Model#/definitions/Variable/properties/desc")

#### desc Type

`string`

### varScope

Context of use for the variable in the model.

`varScope`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-varscope.md "EMRALD_Model#/definitions/Variable/properties/varScope")

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

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-variable-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-value.md "EMRALD_Model#/definitions/Variable/properties/value")

#### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-variable-properties-value.md))

any of

* [Untitled number in EMRALD_Model](emrald_jsonschemav3_4-definitions-variable-properties-value-anyof-0.md "check type definition")

* [Untitled string in EMRALD_Model](emrald_jsonschemav3_4-definitions-variable-properties-value-anyof-1.md "check type definition")

* [Untitled boolean in EMRALD_Model](emrald_jsonschemav3_4-definitions-variable-properties-value-anyof-2.md "check type definition")

### docLink

If the varScope is gtDocLink then this is the expression defining path in the document to the variable is linked to. XPath for XML, JSONPath for JSON, or a RegularExpression for txt

`docLink`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-doclink.md "EMRALD_Model#/definitions/Variable/properties/docLink")

#### docLink Type

`string`

### docType

If the varScope is gtDocLink then this the type of document the variable can be linked to. XML, JSON or PlainText using a regular expression

`docType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-doctype.md "EMRALD_Model#/definitions/Variable/properties/docType")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-docpath.md "EMRALD_Model#/definitions/Variable/properties/docPath")

#### docPath Type

`string`

### pathMustExist

Flag, if true then the file in the docPath must exist when the simulation starts running. This is helpful to minimize errors.

`pathMustExist`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-pathmustexist.md "EMRALD_Model#/definitions/Variable/properties/pathMustExist")

#### pathMustExist Type

`boolean`

### type

This is the type of the variable, Bool, double, int, string

`type`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-type.md "EMRALD_Model#/definitions/Variable/properties/type")

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

* Type: `object[]` ([accrualStatesDataItems](emrald_jsonschemav3_4-definitions-variable-properties-accrualstatesdata-accrualstatesdataitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-accrualstatesdata.md "EMRALD_Model#/definitions/Variable/properties/accrualStatesData")

#### accrualStatesData Type

`object[]` ([accrualStatesDataItems](emrald_jsonschemav3_4-definitions-variable-properties-accrualstatesdata-accrualstatesdataitems.md))

### regExpLine

Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this is the regular expression string.

`regExpLine`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-regexpline.md "EMRALD_Model#/definitions/Variable/properties/regExpLine")

#### regExpLine Type

`integer`

### begPosition

Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this the start possition after the regular expression finds its match for reading or writing the value of the variable.

`begPosition`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-begposition.md "EMRALD_Model#/definitions/Variable/properties/begPosition")

#### begPosition Type

`integer`

### numChars

Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, this how many characters to read for the value of the variable

`numChars`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-numchars.md "EMRALD_Model#/definitions/Variable/properties/numChars")

#### numChars Type

`integer`

### regExpGroup

Optional. For variable varScope of gtDocLink, docType dtTxtRegExp, if this is defined, the value will be read from the given group within the user's regex expression

`regExpGroup`

* is optional

* Type: `integer`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-regexpgroup.md "EMRALD_Model#/definitions/Variable/properties/regExpGroup")

#### regExpGroup Type

`integer`

### resetOnRuns

Optional, this specifies if the value of the variable is to be reset to the default value on each run or retain the value from the last run.

`resetOnRuns`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-resetonruns.md "EMRALD_Model#/definitions/Variable/properties/resetOnRuns")

#### resetOnRuns Type

`boolean`

### resourceName

Optional. If the variable varScope is gt3DSim, this is the name reference to the external simulation to link to for the value.

`resourceName`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-resourcename.md "EMRALD_Model#/definitions/Variable/properties/resourceName")

#### resourceName Type

`string`

### sim3DId

Optional. For variables of varScope gt3DSim, this is the external simulations name of the variable. It is used in sending a message to the external simulation.

`sim3DId`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-sim3did.md "EMRALD_Model#/definitions/Variable/properties/sim3DId")

#### sim3DId Type

`string`

### extSim

Optional. For variables of varScope gt3DSim, this is the external simulation the variable is linked to.

`extSim`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-extsim.md "EMRALD_Model#/definitions/Variable/properties/extSim")

#### extSim Type

`string`

### WatchEventCriteria

Optional. For variables of varScope gt3DSim, an fParser boolean expression (e.g. '(valve\_12 > 5) & (valve\_12 < 10)') the external simulation must satisfy before reporting this variable. Sent in the initial coupling message. When omitted the variable is reported on every change.

`WatchEventCriteria`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-watcheventcriteria.md "EMRALD_Model#/definitions/Variable/properties/WatchEventCriteria")

#### WatchEventCriteria Type

`string`

### changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/Variable/properties/changeLog")

#### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

### cumulativeStats

Flag to indicate the user want to do cumulative statistics in the results.

`cumulativeStats`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-cumulativestats.md "EMRALD_Model#/definitions/Variable/properties/cumulativeStats")

#### cumulativeStats Type

`boolean`

### monitorInSim

Flag to have the monitor variable check box checked in the solver by default.

`monitorInSim`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-monitorinsim.md "EMRALD_Model#/definitions/Variable/properties/monitorInSim")

#### monitorInSim Type

`boolean`

### canMonitor

Flag to indicate if the variable can be monitored in the solver. This removes it from the solver UI if false. Must be true if monitorInSim is true.

`canMonitor`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-canmonitor.md "EMRALD_Model#/definitions/Variable/properties/canMonitor")

#### canMonitor Type

`boolean`

### inVariable

Optional. Flag marking this variable as a simulation input - its value is supplied into a run (for example set by a coupled/external application or used as a run parameter).

`inVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-invariable.md "EMRALD_Model#/definitions/Variable/properties/inVariable")

#### inVariable Type

`boolean`

### outVariable

Optional. Flag marking this variable as a simulation output - its value is produced during a run and exposed to results or a coupled/external application.

`outVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-outvariable.md "EMRALD_Model#/definitions/Variable/properties/outVariable")

#### outVariable Type

`boolean`

### required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-variable-properties-required.md "EMRALD_Model#/definitions/Variable/properties/required")

#### required Type

`boolean`

## Definitions group NewState

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/NewState"}
```

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                  |
| :-------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| [toState](#tostate)   | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-newstate-properties-tostate.md "EMRALD_Model#/definitions/NewState/properties/toState")   |
| [prob](#prob)         | `number` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-newstate-properties-prob.md "EMRALD_Model#/definitions/NewState/properties/prob")         |
| [failDesc](#faildesc) | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-newstate-properties-faildesc.md "EMRALD_Model#/definitions/NewState/properties/failDesc") |
| [varProb](#varprob)   | `string` | Optional | can be null    | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-newstate-properties-varprob.md "EMRALD_Model#/definitions/NewState/properties/varProb")   |

### toState

reference name of the state to transtion to.

`toState`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-newstate-properties-tostate.md "EMRALD_Model#/definitions/NewState/properties/toState")

#### toState Type

`string`

### prob

probability that this state will be transtioned to.

`prob`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-newstate-properties-prob.md "EMRALD_Model#/definitions/NewState/properties/prob")

#### prob Type

`number`

### failDesc

The description from the user for output if tthis transition takes place.

`failDesc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-newstate-properties-faildesc.md "EMRALD_Model#/definitions/NewState/properties/failDesc")

#### failDesc Type

`string`

### varProb

Optional, if used  then the a variable is used for the probability. This is the name of that variable

`varProb`

* is optional

* Type: `string`

* can be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-newstate-properties-varprob.md "EMRALD_Model#/definitions/NewState/properties/varProb")

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

| Property          | Type     | Required | Nullable       | Defined by                                                                                                                                      |
| :---------------- | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| [x](#x)           | `number` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-geometryinfo-properties-x.md "EMRALD_Model#/definitions/GeometryInfo/properties/x")           |
| [y](#y)           | `number` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-geometryinfo-properties-y.md "EMRALD_Model#/definitions/GeometryInfo/properties/y")           |
| [width](#width)   | `number` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-geometryinfo-properties-width.md "EMRALD_Model#/definitions/GeometryInfo/properties/width")   |
| [height](#height) | `number` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-geometryinfo-properties-height.md "EMRALD_Model#/definitions/GeometryInfo/properties/height") |

### x



`x`

* is optional

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-geometryinfo-properties-x.md "EMRALD_Model#/definitions/GeometryInfo/properties/x")

#### x Type

`number`

### y



`y`

* is optional

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-geometryinfo-properties-y.md "EMRALD_Model#/definitions/GeometryInfo/properties/y")

#### y Type

`number`

### width



`width`

* is optional

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-geometryinfo-properties-width.md "EMRALD_Model#/definitions/GeometryInfo/properties/width")

#### width Type

`number`

### height



`height`

* is optional

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-geometryinfo-properties-height.md "EMRALD_Model#/definitions/GeometryInfo/properties/height")

#### height Type

`number`

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
| [name](#name-9)       | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-group-properties-name.md "EMRALD_Model#/definitions/Group/properties/name")         |
| [subgroup](#subgroup) | `array`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-group-properties-subgroup.md "EMRALD_Model#/definitions/Group/properties/subgroup") |

### name

Name of the group

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-group-properties-name.md "EMRALD_Model#/definitions/Group/properties/name")

#### name Type

`string`

### subgroup

Sub group tree path

`subgroup`

* is optional

* Type: `object[]` ([Details](emrald_jsonschemav3_4-definitions-group.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-group-properties-subgroup.md "EMRALD_Model#/definitions/Group/properties/subgroup")

#### subgroup Type

`object[]` ([Details](emrald_jsonschemav3_4-definitions-group.md))

## Definitions group MultiThreadInfo

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MultiThreadInfo"}
```

| Property                        | Type     | Required | Nullable       | Defined by                                                                                                                                                          |
| :------------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ToCopyForRefs](#tocopyforrefs) | `array`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo-properties-tocopyforrefs.md "EMRALD_Model#/definitions/MultiThreadInfo/properties/ToCopyForRefs") |
| [AssignedTime](#assignedtime)   | `string` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo-properties-assignedtime.md "EMRALD_Model#/definitions/MultiThreadInfo/properties/AssignedTime")   |

### ToCopyForRefs



`ToCopyForRefs`

* is optional

* Type: `object[]` ([Details](emrald_jsonschemav3_4-definitions-tocopyforref.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo-properties-tocopyforrefs.md "EMRALD_Model#/definitions/MultiThreadInfo/properties/ToCopyForRefs")

#### ToCopyForRefs Type

`object[]` ([Details](emrald_jsonschemav3_4-definitions-tocopyforref.md))

### AssignedTime

ISO 8601 date time when the multi-thread copy references were assigned.

`AssignedTime`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo-properties-assignedtime.md "EMRALD_Model#/definitions/MultiThreadInfo/properties/AssignedTime")

#### AssignedTime Type

`string`

## Definitions group ToCopyForRef

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/ToCopyForRef"}
```

| Property                  | Type     | Required | Nullable       | Defined by                                                                                                                                              |
| :------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ItemName](#itemname)     | `string` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-itemname.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ItemName")     |
| [ItemType](#itemtype)     | `string` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-itemtype.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ItemType")     |
| [RefPath](#refpath)       | `string` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-refpath.md "EMRALD_Model#/definitions/ToCopyForRef/properties/RefPath")       |
| [ToCopy](#tocopy)         | `array`  | Optional | can be null    | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-tocopy.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ToCopy")         |
| [RelPath](#relpath)       | `string` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-relpath.md "EMRALD_Model#/definitions/ToCopyForRef/properties/RelPath")       |
| [AdjRelRoot](#adjrelroot) | `string` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-adjrelroot.md "EMRALD_Model#/definitions/ToCopyForRef/properties/AdjRelRoot") |

### ItemName



`ItemName`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-itemname.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ItemName")

#### ItemName Type

`string`

### ItemType



`ItemType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-itemtype.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ItemType")

#### ItemType Type

`string`

#### ItemType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value          | Explanation |
| :------------- | :---------- |
| `"itVar"`      |             |
| `"itComp"`     |             |
| `"itState"`    |             |
| `"itEvent"`    |             |
| `"itAction"`   |             |
| `"itTreeNode"` |             |
| `"itTimer"`    |             |
| `"itDiagram"`  |             |
| `"itExtSim"`   |             |

### RefPath



`RefPath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-refpath.md "EMRALD_Model#/definitions/ToCopyForRef/properties/RefPath")

#### RefPath Type

`string`

### ToCopy



`ToCopy`

* is optional

* Type: `string[]`

* can be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-tocopy.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ToCopy")

#### ToCopy Type

`string[]`

### RelPath



`RelPath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-relpath.md "EMRALD_Model#/definitions/ToCopyForRef/properties/RelPath")

#### RelPath Type

`string`

### AdjRelRoot



`AdjRelRoot`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-adjrelroot.md "EMRALD_Model#/definitions/ToCopyForRef/properties/AdjRelRoot")

#### AdjRelRoot Type

`string`

## Definitions group EnIDType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/EnIDType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

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
| [name](#name-10)              | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-name.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/name")               |
| [value](#value-1)             | Merged    | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-value.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/value")             |
| [timeRate](#timerate)         | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-timerate.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/timeRate")       |
| [useVariable](#usevariable-1) | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-usevariable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/useVariable") |
| [variable](#variable-1)       | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-variable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/variable")       |

### name

For event type of etDistribution this is the name of the distribution parameter.

`name`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-name.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/name")

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

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-value.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/value")

#### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-value.md))

any of

* [Untitled number in EMRALD_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-value-anyof-0.md "check type definition")

* [Untitled string in EMRALD_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-value-anyof-1.md "check type definition")

### timeRate

Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.

`timeRate`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-timerate.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/timeRate")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-usevariable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/useVariable")

#### useVariable Type

`boolean`

### variable

Optional. The reference name of the variable to use as the value of the parameter if the useVariable flag is true.

`variable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-eventdistributionparameter-properties-variable.md "EMRALD_Model#/definitions/EventDistributionParameter/properties/variable")

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

## Definitions group VersionHistory

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/VersionHistory"}
```

| Property                    | Type     | Required | Nullable       | Defined by                                                                                                                                                    |
| :-------------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [description](#description) | `string` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-versionhistory-properties-description.md "EMRALD_Model#/definitions/VersionHistory/properties/description") |
| [version](#version-2)       | `number` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-versionhistory-properties-version.md "EMRALD_Model#/definitions/VersionHistory/properties/version")         |

### description

A description of the changes made to the model in this version

`description`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-versionhistory-properties-description.md "EMRALD_Model#/definitions/VersionHistory/properties/description")

#### description Type

`string`

### version

The version number

`version`

* is optional

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-versionhistory-properties-version.md "EMRALD_Model#/definitions/VersionHistory/properties/version")

#### version Type

`number`

## Definitions group CustomFormType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/CustomFormType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group MAAPFormData

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPFormData"}
```

| Property                                  | Type          | Required | Nullable       | Defined by                                                                                                                                                              |
| :---------------------------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [exePath](#exepath-1)                     | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-exepath.md "EMRALD_Model#/definitions/MAAPFormData/properties/exePath")                       |
| [sourceElements](#sourceelements)         | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-sourceelements.md "EMRALD_Model#/definitions/MAAPFormData/properties/sourceElements")         |
| [parameters](#parameters-2)               | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-parameters.md "EMRALD_Model#/definitions/MAAPFormData/properties/parameters")                 |
| [initiators](#initiators)                 | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-initiators.md "EMRALD_Model#/definitions/MAAPFormData/properties/initiators")                 |
| [inputBlocks](#inputblocks)               | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-inputblocks.md "EMRALD_Model#/definitions/MAAPFormData/properties/inputBlocks")               |
| [fileRefs](#filerefs)                     | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-filerefs.md "EMRALD_Model#/definitions/MAAPFormData/properties/fileRefs")                     |
| [inputPath](#inputpath)                   | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-inputpath.md "EMRALD_Model#/definitions/MAAPFormData/properties/inputPath")                   |
| [parameterPath](#parameterpath)           | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-parameterpath.md "EMRALD_Model#/definitions/MAAPFormData/properties/parameterPath")           |
| [possibleInitiators](#possibleinitiators) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-possibleinitiators.md "EMRALD_Model#/definitions/MAAPFormData/properties/possibleInitiators") |
| [docLinkVariable](#doclinkvariable)       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-doclinkvariable.md "EMRALD_Model#/definitions/MAAPFormData/properties/docLinkVariable")       |
| [output](#output)                         | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-output.md "EMRALD_Model#/definitions/MAAPFormData/properties/output")                         |
| [caType](#catype)                         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-customformtype.md "EMRALD_Model#/definitions/MAAPFormData/properties/caType")                 |
| [needsUpgrade](#needsupgrade)             | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-needsupgrade.md "EMRALD_Model#/definitions/MAAPFormData/properties/needsUpgrade")             |

### exePath

The path to the MAAP executable on the user's machine

`exePath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-exepath.md "EMRALD_Model#/definitions/MAAPFormData/properties/exePath")

#### exePath Type

`string`

### sourceElements

The contents of original .inp file parsed into JSON

`sourceElements`

* is optional

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapformdata-properties-sourceelements-items.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-sourceelements.md "EMRALD_Model#/definitions/MAAPFormData/properties/sourceElements")

#### sourceElements Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapformdata-properties-sourceelements-items.md))

### parameters

Source elements from the .inp file identified as parameters

`parameters`

* is optional

* Type: `object[]` ([Details](emrald_jsonschemav3_4-definitions-maapassignment.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-parameters.md "EMRALD_Model#/definitions/MAAPFormData/properties/parameters")

#### parameters Type

`object[]` ([Details](emrald_jsonschemav3_4-definitions-maapassignment.md))

### initiators

Source elements from the .inp file identified as initiators

`initiators`

* is optional

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapformdata-properties-initiators-items.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-initiators.md "EMRALD_Model#/definitions/MAAPFormData/properties/initiators")

#### initiators Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapformdata-properties-initiators-items.md))

### inputBlocks

Source elements from the .inp file identified as input blocks (if blocks, when block, etc.)

`inputBlocks`

* is optional

* Type: `object[]` ([MAAPConditionalBlockStatement](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-inputblocks.md "EMRALD_Model#/definitions/MAAPFormData/properties/inputBlocks")

#### inputBlocks Type

`object[]` ([MAAPConditionalBlockStatement](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement.md))

### fileRefs

The paths to other files referenced by the .inp and .par files

`fileRefs`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-filerefs.md "EMRALD_Model#/definitions/MAAPFormData/properties/fileRefs")

#### fileRefs Type

`string[]`

### inputPath

The full path to the .inp file on the user's machine

`inputPath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-inputpath.md "EMRALD_Model#/definitions/MAAPFormData/properties/inputPath")

#### inputPath Type

`string`

### parameterPath

The full path to the .par file on the user's machine

`parameterPath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-parameterpath.md "EMRALD_Model#/definitions/MAAPFormData/properties/parameterPath")

#### parameterPath Type

`string`

### possibleInitiators

A list of possible initiators extracted from the .par file

`possibleInitiators`

* is optional

* Type: `object[]` ([MAAPParameter](emrald_jsonschemav3_4-definitions-maapparameter.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-possibleinitiators.md "EMRALD_Model#/definitions/MAAPFormData/properties/possibleInitiators")

#### possibleInitiators Type

`object[]` ([MAAPParameter](emrald_jsonschemav3_4-definitions-maapparameter.md))

### docLinkVariable

The doc link variable used to store the results

`docLinkVariable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-doclinkvariable.md "EMRALD_Model#/definitions/MAAPFormData/properties/docLinkVariable")

#### docLinkVariable Type

`string`

### output

The MAAP output variable to store in the doc link variable

`output`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-output.md "EMRALD_Model#/definitions/MAAPFormData/properties/output")

#### output Type

`string`

### caType



`caType`

* is required

* Type: unknown ([CustomFormType](emrald_jsonschemav3_4-definitions-maapformdata-properties-customformtype.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-customformtype.md "EMRALD_Model#/definitions/MAAPFormData/properties/caType")

#### caType Type

unknown ([CustomFormType](emrald_jsonschemav3_4-definitions-maapformdata-properties-customformtype.md))

#### caType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value    | Explanation |
| :------- | :---------- |
| `"MAAP"` |             |

### needsUpgrade



`needsUpgrade`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapformdata-properties-needsupgrade.md "EMRALD_Model#/definitions/MAAPFormData/properties/needsUpgrade")

#### needsUpgrade Type

`boolean`

## Definitions group MAAPParameter

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPParameter"}
```

| Property                      | Type          | Required | Nullable       | Defined by                                                                                                                                                  |
| :---------------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [flag](#flag)                 | `object`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md "EMRALD_Model#/definitions/MAAPParameter/properties/flag")                          |
| [index](#index)               | `number`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-index.md "EMRALD_Model#/definitions/MAAPParameter/properties/index")             |
| [type](#type-1)               | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-type.md "EMRALD_Model#/definitions/MAAPParameter/properties/type")               |
| [value](#value-2)             | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-value.md "EMRALD_Model#/definitions/MAAPParameter/properties/value")             |
| [comments](#comments)         | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPParameter/properties/comments")                        |
| [name](#name-11)              | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-name.md "EMRALD_Model#/definitions/MAAPParameter/properties/name")               |
| [useVariable](#usevariable-2) | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-usevariable.md "EMRALD_Model#/definitions/MAAPParameter/properties/useVariable") |
| [unit](#unit)                 | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-unit.md "EMRALD_Model#/definitions/MAAPParameter/properties/unit")               |
| [variable](#variable-2)       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-variable.md "EMRALD_Model#/definitions/MAAPParameter/properties/variable")       |
| [desc](#desc-8)               | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-desc.md "EMRALD_Model#/definitions/MAAPParameter/properties/desc")               |

### flag



`flag`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md "EMRALD_Model#/definitions/MAAPParameter/properties/flag")

#### flag Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md))

### index



`index`

* is optional

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-index.md "EMRALD_Model#/definitions/MAAPParameter/properties/index")

#### index Type

`number`

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-type.md "EMRALD_Model#/definitions/MAAPParameter/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"parameter"
```

### value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapparameter-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-value.md "EMRALD_Model#/definitions/MAAPParameter/properties/value")

#### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapparameter-properties-value.md))

any of

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

  * all of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

    * any of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparametername.md "check type definition")

* [Untitled string in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-value-anyof-2.md "check type definition")

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPParameter/properties/comments")

#### comments Type

`string[][]`

### name



`name`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-name.md "EMRALD_Model#/definitions/MAAPParameter/properties/name")

#### name Type

`string`

### useVariable



`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-usevariable.md "EMRALD_Model#/definitions/MAAPParameter/properties/useVariable")

#### useVariable Type

`boolean`

### unit



`unit`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-unit.md "EMRALD_Model#/definitions/MAAPParameter/properties/unit")

#### unit Type

`string`

### variable



`variable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-variable.md "EMRALD_Model#/definitions/MAAPParameter/properties/variable")

#### variable Type

`string`

### desc



`desc`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-desc.md "EMRALD_Model#/definitions/MAAPParameter/properties/desc")

#### desc Type

`string`

## Definitions group MAAPConditionalBlockStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPConditionalBlockStatement"}
```

| Property                | Type          | Required | Nullable       | Defined by                                                                                                                                                                              |
| :---------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [blockType](#blocktype) | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-blocktype.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/blockType") |
| [test](#test)           | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-test.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/test")           |
| [type](#type-2)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-type.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/type")           |
| [value](#value-3)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-value.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/value")         |
| [comments](#comments-1) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/comments")                                    |

### blockType



`blockType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-blocktype.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/blockType")

#### blockType Type

`string`

#### blockType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value    | Explanation |
| :------- | :---------- |
| `"IF"`   |             |
| `"WHEN"` |             |

### test



`test`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-test.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-test.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/test")

#### test Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-test.md))

any of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

* all of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

    * all of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-1.md "check type definition")

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-type.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"conditional_block"
```

### value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-value-items.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-value.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/value")

#### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-value-items.md))

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPExpression

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPExpression"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group MAAPIsExpression

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPIsExpression"}
```

| Property                      | Type          | Required | Nullable       | Defined by                                                                                                                                                        |
| :---------------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [target](#target)             | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/target")                                 |
| [type](#type-3)               | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapisexpression-properties-type.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/type")               |
| [value](#value-4)             | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapisexpression-properties-value.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/value")             |
| [useVariable](#usevariable-3) | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapisexpression-properties-usevariable.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/useVariable") |
| [comments](#comments-2)       | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/comments")                           |

### target



`target`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/target")

#### target Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

all of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparametername.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "check type definition")

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapisexpression-properties-type.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"is_expression"
```

### value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapisexpression-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapisexpression-properties-value.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/value")

#### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapisexpression-properties-value.md))

any of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

* all of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

    * all of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-1.md "check type definition")

### useVariable



`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapisexpression-properties-usevariable.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/useVariable")

#### useVariable Type

`boolean`

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPVariable

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPVariable"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group MAAPCallExpression

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPCallExpression"}
```

| Property                | Type          | Required | Nullable       | Defined by                                                                                                                                                        |
| :---------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [arguments](#arguments) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcallexpression-properties-arguments.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/arguments") |
| [type](#type-4)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcallexpression-properties-type.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/type")           |
| [value](#value-5)       | `object`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/value")                              |
| [comments](#comments-3) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/comments")                         |

### arguments



`arguments`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapexpressiontype.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcallexpression-properties-arguments.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/arguments")

#### arguments Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapexpressiontype.md))

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcallexpression-properties-type.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"call_expression"
```

### value



`value`

* is required

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-maapidentifier.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/value")

#### value Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapidentifier.md))

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPIdentifier

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPIdentifier"}
```

| Property                      | Type          | Required | Nullable       | Defined by                                                                                                                                                    |
| :---------------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [type](#type-5)               | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-type.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/type")               |
| [value](#value-6)             | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-value.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/value")             |
| [useVariable](#usevariable-4) | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-usevariable.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/useVariable") |
| [comments](#comments-4)       | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/comments")                         |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-type.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"identifier"
```

### value



`value`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-value.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/value")

#### value Type

`string`

### useVariable



`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-usevariable.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/useVariable")

#### useVariable Type

`boolean`

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPExpressionType

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPExpressionType"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group MAAPExpressionBlock

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPExpressionBlock"}
```

| Property                | Type          | Required | Nullable       | Defined by                                                                                                                                                  |
| :---------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type-6)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-type.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/type")   |
| [value](#value-7)       | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-value.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/value") |
| [units](#units)         | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-units.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/units") |
| [comments](#comments-5) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/comments")                  |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-type.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"expression_block"
```

### value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-value.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/value")

#### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-value.md))

any of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

* all of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

    * all of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-1.md "check type definition")

### units



`units`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-units.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/units")

#### units Type

`string`

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPPureExpression

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPPureExpression"}
```

| Property                      | Type          | Required | Nullable       | Defined by                                                                                                                                                            |
| :---------------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type-7)               | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-type.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/type")               |
| [left](#left)                 | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/left")                               |
| [op](#op)                     | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-op.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/op")                   |
| [right](#right)               | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-right.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/right")             |
| [useVariable](#usevariable-5) | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-usevariable.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/useVariable") |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-type.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"expression"
```

### left



`left`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapexpressiontype.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/left")

#### left Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapexpressiontype.md))

all of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

  * all of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

    * any of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-1-anyof-1.md "check type definition")

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparametername.md "check type definition")

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "check type definition")

### op



`op`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-op.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/op")

#### op Type

`string`

#### op Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value  | Explanation |
| :----- | :---------- |
| `"**"` |             |
| `"*"`  |             |
| `"/"`  |             |
| `">="` |             |
| `"<="` |             |
| `">"`  |             |
| `"<"`  |             |
| `"+"`  |             |
| `"-"`  |             |
| `"!="` |             |
| `"=="` |             |

### right



`right`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maappureexpression-properties-right.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-right.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/right")

#### right Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maappureexpression-properties-right.md))

any of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

* all of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

    * all of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-1.md "check type definition")

### useVariable



`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-usevariable.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/useVariable")

#### useVariable Type

`boolean`

## Definitions group MAAPExpressionOperator

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPExpressionOperator"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group MAAPParameterName

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPParameterName"}
```

| Property                | Type          | Required | Nullable       | Defined by                                                                                                                                              |
| :---------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [type](#type-8)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparametername-properties-type.md "EMRALD_Model#/definitions/MAAPParameterName/properties/type")   |
| [value](#value-8)       | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparametername-properties-value.md "EMRALD_Model#/definitions/MAAPParameterName/properties/value") |
| [comments](#comments-6) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPParameterName/properties/comments")                |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparametername-properties-type.md "EMRALD_Model#/definitions/MAAPParameterName/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"parameter_name"
```

### value



`value`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapparametername-properties-value.md "EMRALD_Model#/definitions/MAAPParameterName/properties/value")

#### value Type

`string`

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPParameterName/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPLiteral

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPLiteral"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group MAAPBooleanLiteral

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPBooleanLiteral"}
```

| Property                | Type          | Required | Nullable       | Defined by                                                                                                                                                |
| :---------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type-9)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral-properties-type.md "EMRALD_Model#/definitions/MAAPBooleanLiteral/properties/type")   |
| [value](#value-9)       | `boolean`     | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral-properties-value.md "EMRALD_Model#/definitions/MAAPBooleanLiteral/properties/value") |
| [comments](#comments-7) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPBooleanLiteral/properties/comments")                 |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral-properties-type.md "EMRALD_Model#/definitions/MAAPBooleanLiteral/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"boolean"
```

### value



`value`

* is required

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral-properties-value.md "EMRALD_Model#/definitions/MAAPBooleanLiteral/properties/value")

#### value Type

`boolean`

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPBooleanLiteral/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPNumericLiteral

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPNumericLiteral"}
```

| Property                | Type          | Required | Nullable       | Defined by                                                                                                                                                |
| :---------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type-10)        | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral-properties-type.md "EMRALD_Model#/definitions/MAAPNumericLiteral/properties/type")   |
| [units](#units-1)       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral-properties-units.md "EMRALD_Model#/definitions/MAAPNumericLiteral/properties/units") |
| [value](#value-10)      | `number`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral-properties-value.md "EMRALD_Model#/definitions/MAAPNumericLiteral/properties/value") |
| [comments](#comments-8) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPNumericLiteral/properties/comments")                 |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral-properties-type.md "EMRALD_Model#/definitions/MAAPNumericLiteral/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"number"
```

### units



`units`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral-properties-units.md "EMRALD_Model#/definitions/MAAPNumericLiteral/properties/units")

#### units Type

`string`

### value



`value`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral-properties-value.md "EMRALD_Model#/definitions/MAAPNumericLiteral/properties/value")

#### value Type

`number`

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPNumericLiteral/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPTimerLiteral

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPTimerLiteral"}
```

| Property                | Type          | Required | Nullable       | Defined by                                                                                                                                            |
| :---------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type-11)        | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral-properties-type.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/type")   |
| [value](#value-11)      | `number`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral-properties-value.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/value") |
| [comments](#comments-9) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/comments")               |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral-properties-type.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"timer"
```

### value



`value`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral-properties-value.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/value")

#### value Type

`number`

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPSourceElement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPSourceElement"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group MAAPSensitivityStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPSensitivityStatement"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                                            |
| :----------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type-12)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapsensitivitystatement-properties-type.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/type")   |
| [value](#value-12)       | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapsensitivitystatement-properties-value.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/value") |
| [comments](#comments-10) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/comments")                       |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapsensitivitystatement-properties-type.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"sensitivity"
```

### value



`value`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapsensitivitystatement-properties-value.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/value")

#### value Type

`string`

#### value Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value   | Explanation |
| :------ | :---------- |
| `"ON"`  |             |
| `"OFF"` |             |

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPTitleStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPTitleStatement"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                                |
| :----------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type-13)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptitlestatement-properties-type.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/type")   |
| [value](#value-13)       | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptitlestatement-properties-value.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/value") |
| [comments](#comments-11) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/comments")                 |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptitlestatement-properties-type.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"title"
```

### value



`value`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptitlestatement-properties-value.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/value")

#### value Type

`string`

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPFileStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPFileStatement"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                                    |
| :----------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [fileType](#filetype)    | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-filetype.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/fileType") |
| [type](#type-14)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-type.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/type")         |
| [value](#value-14)       | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-value.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/value")       |
| [comments](#comments-12) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/comments")                      |

### fileType



`fileType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-filetype.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/fileType")

#### fileType Type

`string`

#### fileType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                   | Explanation |
| :---------------------- | :---------- |
| `"PARAMETER FILE"`      |             |
| `"INCLUDE"`             |             |
| `"DOSE PARAMETER FILE"` |             |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-type.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"file"
```

### value



`value`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-value.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/value")

#### value Type

`string`

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPBlockStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPBlockStatement"}
```

| Property                  | Type          | Required | Nullable       | Defined by                                                                                                                                                        |
| :------------------------ | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [blockType](#blocktype-1) | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-blocktype.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/blockType") |
| [type](#type-15)          | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-type.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/type")           |
| [value](#value-15)        | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-value.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/value")         |
| [comments](#comments-13)  | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/comments")                         |

### blockType



`blockType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-blocktype.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/blockType")

#### blockType Type

`string`

#### blockType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                | Explanation |
| :------------------- | :---------- |
| `"PARAMETER CHANGE"` |             |
| `"INITIATORS"`       |             |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-type.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"block"
```

### value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-value-items.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-value.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/value")

#### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-value-items.md))

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPCommentArray

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPCommentArray"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group MAAPAliasStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPAliasStatement"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                                |
| :----------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type-16)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapaliasstatement-properties-type.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/type")   |
| [value](#value-16)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapaliasstatement-properties-value.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/value") |
| [comments](#comments-14) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/comments")                 |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapaliasstatement-properties-type.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"alias"
```

### value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapaliasstatement-properties-value-items.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapaliasstatement-properties-value.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/value")

#### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapaliasstatement-properties-value-items.md))

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPAsExpression

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPAsExpression"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                          |
| :----------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| [target](#target-1)      | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/target")                   |
| [type](#type-17)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapasexpression-properties-type.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/type") |
| [value](#value-17)       | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/value")                    |
| [comments](#comments-15) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/comments")             |

### target



`target`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/target")

#### target Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

all of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparametername.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "check type definition")

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapasexpression-properties-type.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"as_expression"
```

### value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/value")

#### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

all of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparametername.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "check type definition")

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPPlotFilBody

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPPlotFilBody"}
```

| Property                 | Type    | Required | Nullable       | Defined by                                                                                                                                                |
| :----------------------- | :------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [row](#row)              | `array` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilbody-properties-row.md "EMRALD_Model#/definitions/MAAPPlotFilBody/properties/row")           |
| [comments](#comments-16) | `array` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilbody-properties-comments.md "EMRALD_Model#/definitions/MAAPPlotFilBody/properties/comments") |

### row



`row`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilbody-properties-row.md "EMRALD_Model#/definitions/MAAPPlotFilBody/properties/row")

#### row Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

### comments



`comments`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilbody-properties-comments.md "EMRALD_Model#/definitions/MAAPPlotFilBody/properties/comments")

#### comments Type

`string[]`

## Definitions group MAAPPlotFilStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPPlotFilStatement"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                                    |
| :----------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [n](#n)                  | `number`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-n.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/n")         |
| [type](#type-18)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-type.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/type")   |
| [value](#value-18)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-value.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/value") |
| [comments](#comments-17) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/comments")                   |

### n



`n`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-n.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/n")

#### n Type

`number`

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-type.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"plotfil"
```

### value



`value`

* is required

* Type: `object[]` ([Details](emrald_jsonschemav3_4-definitions-maapplotfilbody.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-value.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/value")

#### value Type

`object[]` ([Details](emrald_jsonschemav3_4-definitions-maapplotfilbody.md))

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPUserEvtStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPUserEvtStatement"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                                    |
| :----------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [type](#type-19)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapuserevtstatement-properties-type.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/type")   |
| [value](#value-19)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapuserevtstatement-properties-value.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/value") |
| [comments](#comments-18) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/comments")                   |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapuserevtstatement-properties-type.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"user_evt"
```

### value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapuserevtstatement-properties-value-items.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapuserevtstatement-properties-value.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/value")

#### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapuserevtstatement-properties-value-items.md))

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPActionStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPActionStatement"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                                  |
| :----------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [index](#index-1)        | `number`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-index.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/index") |
| [type](#type-20)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-type.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/type")   |
| [value](#value-20)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-value.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/value") |
| [comments](#comments-19) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/comments")                  |

### index



`index`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-index.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/index")

#### index Type

`number`

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-type.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"action"
```

### value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-value-items.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-value.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/value")

#### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-value-items.md))

### comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPFunctionStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPFunctionStatement"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                                      |
| :----------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [name](#name-12)         | `object`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/name")                          |
| [type](#type-21)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfunctionstatement-properties-type.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/type")   |
| [value](#value-21)       | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfunctionstatement-properties-value.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/value") |
| [comments](#comments-20) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/comments")                    |

### name



`name`

* is required

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-maapidentifier.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/name")

#### name Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapidentifier.md))

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfunctionstatement-properties-type.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"function"
```

### value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapfunctionstatement-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfunctionstatement-properties-value.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/value")

#### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapfunctionstatement-properties-value.md))

any of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

* all of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

    * all of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-1.md "check type definition")

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPTimerStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPTimerStatement"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                              |
| :----------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [type](#type-22)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptimerstatement-properties-type.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/type") |
| [value](#value-22)       | `object`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/value")                  |
| [comments](#comments-21) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/comments")               |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptimerstatement-properties-type.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"set_timer"
```

### value



`value`

* is required

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-maaptimerliteral.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/value")

#### value Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maaptimerliteral.md))

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPLookupStatement

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPLookupStatement"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                                  |
| :----------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [name](#name-13)         | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/name")                          |
| [type](#type-23)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaplookupstatement-properties-type.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/type")   |
| [value](#value-23)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaplookupstatement-properties-value.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/value") |
| [comments](#comments-22) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/comments")                  |

### name



`name`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/name")

#### name Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

all of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparametername.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "check type definition")

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaplookupstatement-properties-type.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"lookup_variable"
```

### value



`value`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maaplookupstatement-properties-value.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/value")

#### value Type

`string[]`

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPAssignment

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPAssignment"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                          |
| :----------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| [target](#target-2)      | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-target.md "EMRALD_Model#/definitions/MAAPAssignment/properties/target") |
| [type](#type-24)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-type.md "EMRALD_Model#/definitions/MAAPAssignment/properties/type")     |
| [value](#value-24)       | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-value.md "EMRALD_Model#/definitions/MAAPAssignment/properties/value")   |
| [comments](#comments-23) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAssignment/properties/comments")               |

### target



`target`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapassignment-properties-target.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-target.md "EMRALD_Model#/definitions/MAAPAssignment/properties/target")

#### target Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapassignment-properties-target.md))

any of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "check type definition")

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-type.md "EMRALD_Model#/definitions/MAAPAssignment/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"assignment"
```

### value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapassignment-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-value.md "EMRALD_Model#/definitions/MAAPAssignment/properties/value")

#### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapassignment-properties-value.md))

all of

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

  * all of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

    * any of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-value-allof-1.md "check type definition")

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAssignment/properties/comments")

#### comments Type

`string[][]`

## Definitions group MAAPMultiPartExpression

Reference this group by using

```json
{"$ref":"EMRALD_Model#/definitions/MAAPMultiPartExpression"}
```

| Property                 | Type          | Required | Nullable       | Defined by                                                                                                                                                          |
| :----------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [type](#type-25)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-type.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/type")   |
| [op](#op-1)              | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-op.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/op")       |
| [value](#value-25)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-value.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/value") |
| [comments](#comments-24) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/comments")                      |

### type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-type.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/type")

#### type Type

unknown

#### type Constraints

**constant**: the value of this property must be equal to:

```json
"multi_expression"
```

### op



`op`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-op.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/op")

#### op Type

`string`

### value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-value-items.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-value.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/value")

#### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-value-items.md))

### comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/comments")

#### comments Type

`string[][]`
