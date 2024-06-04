# Untitled string in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/Event/properties/timeVariableUnit
```

Optional, For events of type etTimer. This is a time unit if a variable is used for the time. Example X min.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## timeVariableUnit Type

`string`

## timeVariableUnit Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `""`          |             |
| `"trYears"`   |             |
| `"trDays"`    |             |
| `"trHours"`   |             |
| `"trMinutes"` |             |
| `"trSeconds"` |             |
