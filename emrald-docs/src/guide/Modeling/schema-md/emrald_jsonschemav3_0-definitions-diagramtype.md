# Untitled string in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/DiagramType
```

Type of the diagram. dtSingle - means you can only be in one state of the diagram at a time and states evaluate to a value. dtMulti - means you can be in multiple states at a time, but cant evaluate the diagram

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## DiagramType Type

`string`

## DiagramType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"dtSingle"` |             |
| `"dtMulti"`  |             |
