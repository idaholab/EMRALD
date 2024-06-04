# Untitled string in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/ExtEventMsgType
```

Optional. For events of type et3dSimEv. This the type of message being sent to the external simulation. See the external messeage JSON schema.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## ExtEventMsgType Type

`string`

## ExtEventMsgType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"etCompEv"` |             |
| `"etEndSim"` |             |
| `"etStatus"` |             |
