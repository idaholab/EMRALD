# Untitled string in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/DistributionType
```

Optional. For event type of etDistribution this is the type of distribution the user selected.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## DistributionType Type

`string`

## DistributionType Constraints

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
