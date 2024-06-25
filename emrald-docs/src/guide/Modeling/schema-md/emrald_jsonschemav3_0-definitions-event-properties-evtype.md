# Untitled string in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/Event/properties/evType
```

Type of the event

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## evType Type

`string`

## evType Constraints

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
