# Untitled string in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/Event/properties/onVarChange
```

Optional. When an event uses a variable and that variable changes, this tells the code how to update the event.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## onVarChange Type

`string`

## onVarChange Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value          | Explanation |
| :------------- | :---------- |
| `"ocIgnore"`   |             |
| `"ocResample"` |             |
| `"ocAdjust"`   |             |