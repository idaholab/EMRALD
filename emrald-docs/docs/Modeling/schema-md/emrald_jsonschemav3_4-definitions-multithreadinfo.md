# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MultiThreadInfo
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MultiThreadInfo Type

`object` ([Details](emrald_jsonschemav3_4-definitions-multithreadinfo.md))

# MultiThreadInfo Properties

| Property                        | Type     | Required | Nullable       | Defined by                                                                                                                                                          |
| :------------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ToCopyForRefs](#tocopyforrefs) | `array`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo-properties-tocopyforrefs.md "EMRALD_Model#/definitions/MultiThreadInfo/properties/ToCopyForRefs") |
| [AssignedTime](#assignedtime)   | `string` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo-properties-assignedtime.md "EMRALD_Model#/definitions/MultiThreadInfo/properties/AssignedTime")   |

## ToCopyForRefs



`ToCopyForRefs`

* is optional

* Type: `object[]` ([Details](emrald_jsonschemav3_4-definitions-tocopyforref.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo-properties-tocopyforrefs.md "EMRALD_Model#/definitions/MultiThreadInfo/properties/ToCopyForRefs")

### ToCopyForRefs Type

`object[]` ([Details](emrald_jsonschemav3_4-definitions-tocopyforref.md))

## AssignedTime

ISO 8601 date time when the multi-thread copy references were assigned.

`AssignedTime`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-multithreadinfo-properties-assignedtime.md "EMRALD_Model#/definitions/MultiThreadInfo/properties/AssignedTime")

### AssignedTime Type

`string`
