# Action Schema

```txt
EMRALD_Model#/definitions/Action
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## Action Type

`object` ([Action](emrald_jsonschemav3_0-definitions-action.md))

# Action Properties

| Property                                        | Type          | Required | Nullable       | Defined by                                                                                                                                                        |
| :---------------------------------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)                                       | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-id.md "EMRALD_Model#/definitions/Action/properties/id")                                       |
| [objType](#objtype)                             | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-objtype.md "EMRALD_Model#/definitions/Action/properties/objType")                             |
| [name](#name)                                   | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-name.md "EMRALD_Model#/definitions/Action/properties/name")                                   |
| [desc](#desc)                                   | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-desc.md "EMRALD_Model#/definitions/Action/properties/desc")                                   |
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
| [changeLog](#changelog)                         | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Action/properties/changeLog")                                           |
| [raType](#ratype)                               | `string`      | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-ratype.md "EMRALD_Model#/definitions/Action/properties/raType")                               |
| [updateVariables](#updatevariables)             | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-updatevariables.md "EMRALD_Model#/definitions/Action/properties/updateVariables")             |
| [required](#required)                           | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-required.md "EMRALD_Model#/definitions/Action/properties/required")                           |

## id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-id.md "EMRALD_Model#/definitions/Action/properties/id")

### id Type

`string`

## objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-objtype.md "EMRALD_Model#/definitions/Action/properties/objType")

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

referenace name in the model for the action

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-name.md "EMRALD_Model#/definitions/Action/properties/name")

### name Type

`string`

## desc

User entered description of the action

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-desc.md "EMRALD_Model#/definitions/Action/properties/desc")

### desc Type

`string`

## actType

The type of action

`actType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-acttype.md "EMRALD_Model#/definitions/Action/properties/actType")

### actType Type

`string`

### actType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value            | Explanation |
| :--------------- | :---------- |
| `"atTransition"` |             |
| `"atCngVarVal"`  |             |
| `"at3DSimMsg"`   |             |
| `"atRunExtApp"`  |             |

## mainItem

Is this a global item to show up in the global list, If false it showes up in local or all list.

`mainItem`

* is required

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-mainitem.md "EMRALD_Model#/definitions/Action/properties/mainItem")

### mainItem Type

`boolean`

## mutExcl

Optional. Only one action may be taken so the probability determines if this action is taken vs another in the EventAction list. If false then the probability is used to sample if this action occured and multiple or no actions could happen when the event is triggered.

`mutExcl`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-mutexcl.md "EMRALD_Model#/definitions/Action/properties/mutExcl")

### mutExcl Type

`boolean`

## newStates

Optional. If this is a transition action then these are the states that it could be transitioned to.

`newStates`

* is optional

* Type: `object[]` ([NewState](emrald_jsonschemav3_0-definitions-newstate.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-newstates.md "EMRALD_Model#/definitions/Action/properties/newStates")

### newStates Type

`object[]` ([NewState](emrald_jsonschemav3_0-definitions-newstate.md))

## scriptCode

Optionsl. Script code to be executed if the action type has a script

`scriptCode`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-scriptcode.md "EMRALD_Model#/definitions/Action/properties/scriptCode")

### scriptCode Type

`string`

## variableName

Optional. For change var value actions, the result of the script is assigned to this variable name reference.

`variableName`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-variablename.md "EMRALD_Model#/definitions/Action/properties/variableName")

### variableName Type

`string`

## codeVariables

Optional. If action has a script, these are the variable name references for variables used in the script. All variables used in script must be in this list.

`codeVariables`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-codevariables.md "EMRALD_Model#/definitions/Action/properties/codeVariables")

### codeVariables Type

`string[]`

## sim3DMessage

Optional. For action type at3DSimMsg, this is the message to be sent to the coupled external simulation.

`sim3DMessage`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dmessage.md "EMRALD_Model#/definitions/Action/properties/sim3DMessage")

### sim3DMessage Type

`string`

## extSim

Optional. For action type at3DSimMsg, this is the name of the coupled external sim to send the message to.

`extSim`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-extsim.md "EMRALD_Model#/definitions/Action/properties/extSim")

### extSim Type

`string`

## sim3DVariable

Optional. For action type at3DSimMsg and a sim3DMessage of atCompModify, this is the name of the variable in the external simulation to be modified by the message.

`sim3DVariable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dvariable.md "EMRALD_Model#/definitions/Action/properties/sim3DVariable")

### sim3DVariable Type

`string`

## openSimVarParams

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this flag indicates that the JSON has the properties for sim3DModelRef, sim3DConfigData, and simEndTime.

`openSimVarParams`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-opensimvarparams.md "EMRALD_Model#/definitions/Action/properties/openSimVarParams")

### openSimVarParams Type

`boolean`

## sim3DModelRef

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the data defined by the user that is used by the external simulation on startup. Typically a path to a model it need to open.

`sim3DModelRef`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dmodelref.md "EMRALD_Model#/definitions/Action/properties/sim3DModelRef")

### sim3DModelRef Type

`string`

## sim3DConfigData

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the data defined by the user that is used by the external simulation on startup.

`sim3DConfigData`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-sim3dconfigdata.md "EMRALD_Model#/definitions/Action/properties/sim3DConfigData")

### sim3DConfigData Type

`string`

## simEndTime

Optional. For action type at3DSimMsg with a sim3DMessage of type atOpenSim, this is the end simulation time defined by the user that is used by the external simulation on startup.

`simEndTime`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-simendtime.md "EMRALD_Model#/definitions/Action/properties/simEndTime")

### simEndTime Type

`string`

## makeInputFileCode

Optional. For action type atRunExtApp. It is the C# script to be executed and the result strig  passed as a parameter to the executable to be run.

`makeInputFileCode`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-makeinputfilecode.md "EMRALD_Model#/definitions/Action/properties/makeInputFileCode")

### makeInputFileCode Type

`string`

## exePath

Optional. For action type atRunExtApp. It is the path of the exe to be run. It can be relative to the location of the EMRALD model.

`exePath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-exepath.md "EMRALD_Model#/definitions/Action/properties/exePath")

### exePath Type

`string`

## processOutputFileCode

Optional. For action type atRunExtApp. It is the C# script to be executed after the accociated exe is ran. Typically it reads a result file and script typically returns a string list with +/-\[StateName] to shift out or into a state because of the results..

`processOutputFileCode`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-processoutputfilecode.md "EMRALD_Model#/definitions/Action/properties/processOutputFileCode")

### processOutputFileCode Type

`string`

## formData

Used for executing applications with custom form data. This can be anything needed by the custom form, but in the end only the standard atRunExtApp fields are used to do the action.

`formData`

* is optional

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-formdata.md "EMRALD_Model#/definitions/Action/properties/formData")

### formData Type

unknown

## template

Optional. For action type atRunExtApp. It is used for custom app form.

`template`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_0-definitions-action-properties-template.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-template.md "EMRALD_Model#/definitions/Action/properties/template")

### template Type

`object` ([Details](emrald_jsonschemav3_0-definitions-action-properties-template.md))

## returnProcess

Optional. For action type atRunExtApp. It is flag to indicate the type of return from the processOutputFileCode. If rtNone then it has no return, othrwise the C# script must return a List<string/> with +/-\[StateName] to shift out or into a state.

`returnProcess`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-returnprocess.md "EMRALD_Model#/definitions/Action/properties/returnProcess")

### returnProcess Type

`string`

## changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Action/properties/changeLog")

### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

## raType

String for the run application action, only for UI used. Options depend on the custom UI forms made. "code" means default user defined pre and post execution code is used.

`raType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-ratype.md "EMRALD_Model#/definitions/Action/properties/raType")

### raType Type

`string`

## updateVariables

Used for custom form, variables used in the form.

`updateVariables`

* is optional

* Type: `array`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-updatevariables.md "EMRALD_Model#/definitions/Action/properties/updateVariables")

### updateVariables Type

`array`

## required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-action-properties-required.md "EMRALD_Model#/definitions/Action/properties/required")

### required Type

`boolean`
