# Untitled string in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/Event/properties/extEventType
```

Optional. For events of type et3dSimEv. This the type of message being sent to the external simulation. See the external messeage JSON schema.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## extEventType Type

`string`

## extEventType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"etCompEv"` |             |
| `"etEndSim"` |             |
| `"etStatus"` |             |
