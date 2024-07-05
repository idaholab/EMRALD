# Event Schema

```txt
EMRALD_Model#/definitions/Event
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                    |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## Event Type

`object` ([Event](emrald_jsonschemav3_0-definitions-event.md))

# Event Properties

| Property                              | Type      | Required | Nullable       | Defined by                                                                                                                                            |
| :------------------------------------ | :-------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)                             | `string`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-id.md "EMRALD_Model#/definitions/Event/properties/id")                             |
| [objType](#objtype)                   | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-objtype.md "EMRALD_Model#/definitions/Event/properties/objType")                   |
| [name](#name)                         | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-name.md "EMRALD_Model#/definitions/Event/properties/name")                         |
| [desc](#desc)                         | `string`  | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-desc.md "EMRALD_Model#/definitions/Event/properties/desc")                         |
| [mainItem](#mainitem)                 | `boolean` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-mainitem.md "EMRALD_Model#/definitions/Event/properties/mainItem")                 |
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
| [changeLog](#changelog)               | `array`   | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Event/properties/changeLog")                                |
| [required](#required)                 | `boolean` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-required.md "EMRALD_Model#/definitions/Event/properties/required")                 |

## id

Optional, internal use only.

`id`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-id.md "EMRALD_Model#/definitions/Event/properties/id")

### id Type

`string`

## objType

For event type of etDistribution this is the name of the distribution parameter.

`objType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-objtype.md "EMRALD_Model#/definitions/Event/properties/objType")

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

referenace name in the event in the model.

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-name.md "EMRALD_Model#/definitions/Event/properties/name")

### name Type

`string`

## desc

User entered description of the event.

`desc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-desc.md "EMRALD_Model#/definitions/Event/properties/desc")

### desc Type

`string`

## mainItem

Is this a global item to show up in the global list, If false it showes up in local or all list.

`mainItem`

* is required

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-mainitem.md "EMRALD_Model#/definitions/Event/properties/mainItem")

### mainItem Type

`boolean`

## evType

Type of the event

`evType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-evtype.md "EMRALD_Model#/definitions/Event/properties/evType")

### evType Type

`string`

### evType Constraints

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

## allItems

Optional. For event type etStateCng. Flag to indicate if all the items in the triggerStates need to occure as specified or just one of them.

`allItems`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-allitems.md "EMRALD_Model#/definitions/Event/properties/allItems")

### allItems Type

`boolean`

## triggerStates

Optional. For event type etStateCng. List of state name references as part of the criteria needed to trigger the event. These are the states that need to be entered or exited to tirgger the event.

`triggerStates`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-triggerstates.md "EMRALD_Model#/definitions/Event/properties/triggerStates")

### triggerStates Type

`string[]`

## varNames

Optional, Name references for all variables used in scripts if the event type uses scripts.

`varNames`

* is optional

* Type: `string[]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-varnames.md "EMRALD_Model#/definitions/Event/properties/varNames")

### varNames Type

`string[]`

## ifInState

Optional. For event type etStateCng, flag to indicate that event is triggired when entering or exiting states listed in triggerStates array. On Enter State/s or On Exit State/s

`ifInState`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-ifinstate.md "EMRALD_Model#/definitions/Event/properties/ifInState")

### ifInState Type

`boolean`

## onSuccess

Optional. For event type etStateCng, flag to indicate that event is triggering needs all the items or just one or rmore from the states listed in triggerStates array. checkbox - All Items

`onSuccess`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-onsuccess.md "EMRALD_Model#/definitions/Event/properties/onSuccess")

### onSuccess Type

`boolean`

## triggerOnFalse

Optional. For event type etComponentLogic, flag to indicate that event is triggered if logic tree evaluates to a False, otherwise it triggeres on true.

`triggerOnFalse`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-triggeronfalse.md "EMRALD_Model#/definitions/Event/properties/triggerOnFalse")

### triggerOnFalse Type

`boolean`

## logicTop

Optional. For event type etComponentLogic, this is the logic tree name to be evaluated for triggering the event.

`logicTop`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-logictop.md "EMRALD_Model#/definitions/Event/properties/logicTop")

### logicTop Type

`string`

## lambda

Optional. Parameter for a event with type of etFailRate. It is either a number or the name of a variable if useVariable is true

`lambda`

* is optional

* Type: merged type ([Details](emrald_jsonschemav3_0-definitions-event-properties-lambda.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-lambda.md "EMRALD_Model#/definitions/Event/properties/lambda")

### lambda Type

merged type ([Details](emrald_jsonschemav3_0-definitions-event-properties-lambda.md))

any of

* [Untitled string in EMRALD_Model](emrald_jsonschemav3_0-definitions-event-properties-lambda-anyof-0.md "check type definition")

* [Untitled number in EMRALD_Model](emrald_jsonschemav3_0-definitions-event-properties-lambda-anyof-1.md "check type definition")

## lambdaTimeRate

Optional. arameter for a event with type of etFailRate. It is the lambda value time frequency.

`lambdaTimeRate`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-lambdatimerate.md "EMRALD_Model#/definitions/Event/properties/lambdaTimeRate")

### lambdaTimeRate Type

`string`

## useVariable

Optional. Indicates that variables can be used for the fields

`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-usevariable.md "EMRALD_Model#/definitions/Event/properties/useVariable")

### useVariable Type

`boolean`

## onVarChange

Optional. When an event uses a variable and that variable changes, this tells the code how to update the event.

`onVarChange`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-onvarchange.md "EMRALD_Model#/definitions/Event/properties/onVarChange")

### onVarChange Type

`string`

### onVarChange Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value          | Explanation |
| :------------- | :---------- |
| `"ocIgnore"`   |             |
| `"ocResample"` |             |
| `"ocAdjust"`   |             |

## time

Optional, For events of type etTimer. This is a time or variable that indicates the time for the event.

`time`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-time.md "EMRALD_Model#/definitions/Event/properties/time")

### time Type

`string`

## timeVariableUnit

Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.

`timeVariableUnit`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-timevariableunit.md "EMRALD_Model#/definitions/Event/properties/timeVariableUnit")

### timeVariableUnit Type

`string`

### timeVariableUnit Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `""`          |             |
| `"trYears"`   |             |
| `"trDays"`    |             |
| `"trHours"`   |             |
| `"trMinutes"` |             |
| `"trSeconds"` |             |

## fromSimStart

Optional, For time based events, is the time from the beginning of the simulation \[true] or from when the state was entered.

`fromSimStart`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-fromsimstart.md "EMRALD_Model#/definitions/Event/properties/fromSimStart")

### fromSimStart Type

`boolean`

## extEventType

Optional. For events of type et3dSimEv. This the type of message being sent to the external simulation. See the external messeage JSON schema.

`extEventType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-exteventtype.md "EMRALD_Model#/definitions/Event/properties/extEventType")

### extEventType Type

`string`

### extEventType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"etCompEv"` |             |
| `"etEndSim"` |             |
| `"etStatus"` |             |

## variable

Optional. For event type et3dSimEv and extEventType etCompEv. It is the reference name for the variable. If that variable is modified by the external code, then the script is executed to determine if the event is triggered.

`variable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-variable.md "EMRALD_Model#/definitions/Event/properties/variable")

### variable Type

`string`

## code

Optional. For event type et3dSimEv and extEventType etCompEv. It is the reference name for the variable. If that variable is modified by the external code, then this code script is executed to determine if the event is triggered.

`code`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-code.md "EMRALD_Model#/definitions/Event/properties/code")

### code Type

`string`

## distType

Optional. For event type of etDistribution this is the type of distribution the user selected.

`distType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-disttype.md "EMRALD_Model#/definitions/Event/properties/distType")

### distType Type

`string`

### distType Constraints

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

## parameters

Optional. For event type of etDistribution this is an array of properties for the distribution calculation.

`parameters`

* is optional

* Type: `object[]` ([EventDistributionParameter](emrald_jsonschemav3_0-definitions-eventdistributionparameter.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-parameters.md "EMRALD_Model#/definitions/Event/properties/parameters")

### parameters Type

`object[]` ([EventDistributionParameter](emrald_jsonschemav3_0-definitions-eventdistributionparameter.md))

## dfltTimeRate

Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.

`dfltTimeRate`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-dflttimerate.md "EMRALD_Model#/definitions/Event/properties/dfltTimeRate")

### dfltTimeRate Type

`string`

### dfltTimeRate Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `""`          |             |
| `"trYears"`   |             |
| `"trDays"`    |             |
| `"trHours"`   |             |
| `"trMinutes"` |             |
| `"trSeconds"` |             |

## changeLog

Type of the diagram.

`changeLog`

* is optional

* Type: `object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog.md "EMRALD_Model#/definitions/Event/properties/changeLog")

### changeLog Type

`object[]` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

## required

If this is a template then it indicates the item must exist in the current model before using the template.

`required`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-event-properties-required.md "EMRALD_Model#/definitions/Event/properties/required")

### required Type

`boolean`
