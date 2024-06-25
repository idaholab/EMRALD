# Untitled string in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/VarChangeOptions
```

Optional. When an event uses a variable and that variable changes, this tells the code how to update the event.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## VarChangeOptions Type

`string`

## VarChangeOptions Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value          | Explanation |
| :------------- | :---------- |
| `"ocIgnore"`   |             |
| `"ocResample"` |             |
| `"ocAdjust"`   |             |
