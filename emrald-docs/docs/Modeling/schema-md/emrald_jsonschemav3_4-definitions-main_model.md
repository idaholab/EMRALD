# Main\_Model Schema

```txt
EMRALD_Model#/definitions/MainModel
```

EMRALD model schema version 3.4

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MainModel Type

`object` ([Main\_Model](emrald_jsonschemav3_4-definitions-main_model.md))

# MainModel Properties

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

## id

Temporary, only used internally for some identification or uniqueness needs

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-id.md "EMRALD_Model#/definitions/MainModel/properties/id")

### id Type

`string`

## objType



`objType`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-objtype.md "EMRALD_Model#/definitions/MainModel/properties/objType")

### objType Type

unknown

### objType Constraints

**constant**: the value of this property must be equal to:

```json
"EMRALD_Model"
```

## name

Name of the EMRALD model

`name`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-name.md "EMRALD_Model#/definitions/MainModel/properties/name")

### name Type

`string`

## desc

description of the EMRALD model

`desc`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-desc.md "EMRALD_Model#/definitions/MainModel/properties/desc")

### desc Type

`string`

## emraldVersion

Version of the EMRALD model schema

`emraldVersion`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-emraldversion.md "EMRALD_Model#/definitions/MainModel/properties/emraldVersion")

### emraldVersion Type

`number`

## version

Version of the users model

`version`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-version.md "EMRALD_Model#/definitions/MainModel/properties/version")

### version Type

`number`

## versionHistory

The user's model version history and change descriptions

`versionHistory`

* is required

* Type: `object[]` ([VersionHistory](emrald_jsonschemav3_4-definitions-versionhistory.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-versionhistory.md "EMRALD_Model#/definitions/MainModel/properties/versionHistory")

### versionHistory Type

`object[]` ([VersionHistory](emrald_jsonschemav3_4-definitions-versionhistory.md))

## filename

Name of the original file that was opened to help distinguish between different versions of the model.

`filename`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-filename.md "EMRALD_Model#/definitions/MainModel/properties/filename")

### filename Type

`string`

## DiagramList

All the diagrams for the model

`DiagramList`

* is required

* Type: `object[]` ([Diagram](emrald_jsonschemav3_4-definitions-diagram.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-diagramlist.md "EMRALD_Model#/definitions/MainModel/properties/DiagramList")

### DiagramList Type

`object[]` ([Diagram](emrald_jsonschemav3_4-definitions-diagram.md))

## ExtSimList

All the external simulation links for the mdoel

`ExtSimList`

* is required

* Type: `object[]` ([ExtSim](emrald_jsonschemav3_4-definitions-extsim.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-extsimlist.md "EMRALD_Model#/definitions/MainModel/properties/ExtSimList")

### ExtSimList Type

`object[]` ([ExtSim](emrald_jsonschemav3_4-definitions-extsim.md))

## StateList

All of the states for the different diagrams of the model

`StateList`

* is required

* Type: `object[]` ([State](emrald_jsonschemav3_4-definitions-state.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-statelist.md "EMRALD_Model#/definitions/MainModel/properties/StateList")

### StateList Type

`object[]` ([State](emrald_jsonschemav3_4-definitions-state.md))

## ActionList

All the actions that can be used in the model

`ActionList`

* is required

* Type: `object[]` ([Action](emrald_jsonschemav3_4-definitions-action.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-actionlist.md "EMRALD_Model#/definitions/MainModel/properties/ActionList")

### ActionList Type

`object[]` ([Action](emrald_jsonschemav3_4-definitions-action.md))

## EventList

All the events that are used in the model.

`EventList`

* is required

* Type: `object[]` ([Event](emrald_jsonschemav3_4-definitions-event.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-eventlist.md "EMRALD_Model#/definitions/MainModel/properties/EventList")

### EventList Type

`object[]` ([Event](emrald_jsonschemav3_4-definitions-event.md))

## LogicNodeList

All the logic nodes to make the logic trees in the model

`LogicNodeList`

* is required

* Type: `object[]` ([LogicNode](emrald_jsonschemav3_4-definitions-logicnode.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-logicnodelist.md "EMRALD_Model#/definitions/MainModel/properties/LogicNodeList")

### LogicNodeList Type

`object[]` ([LogicNode](emrald_jsonschemav3_4-definitions-logicnode.md))

## VariableList

All the variables used in the model

`VariableList`

* is required

* Type: `object[]` ([Variable](emrald_jsonschemav3_4-definitions-variable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-variablelist.md "EMRALD_Model#/definitions/MainModel/properties/VariableList")

### VariableList Type

`object[]` ([Variable](emrald_jsonschemav3_4-definitions-variable.md))

## templates

Templates available to make new diagrams in the model. These are basically small models all on their own.

`templates`

* is optional

* Type: `object[]` ([Main\_Model](emrald_jsonschemav3_4-definitions-main_model.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-main_model-properties-templates.md "EMRALD_Model#/definitions/MainModel/properties/templates")

### templates Type

`object[]` ([Main\_Model](emrald_jsonschemav3_4-definitions-main_model.md))

## multiThreadInfo



`multiThreadInfo`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-multithreadinfo.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo.md "EMRALD_Model#/definitions/MainModel/properties/multiThreadInfo")

### multiThreadInfo Type

`object` ([Details](emrald_jsonschemav3_4-definitions-multithreadinfo.md))

## changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-changelog.md "EMRALD_Model#/definitions/MainModel/properties/changeLog")

### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_4-definitions-changelog-changelogitems.md))

## group

What catagory grouping this item belongs to. Used to indicate a group for and EMRALD model template.

`group`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-group.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-group.md "EMRALD_Model#/definitions/MainModel/properties/group")

### group Type

`object` ([Details](emrald_jsonschemav3_4-definitions-group.md))
