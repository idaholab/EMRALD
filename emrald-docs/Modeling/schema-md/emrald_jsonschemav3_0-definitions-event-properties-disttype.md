# Untitled string in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/Event/properties/distType
```

Optional. For event type of etDistribution this is the type of distribution the user selected.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                    |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## distType Type

`string`

## distType Constraints

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
