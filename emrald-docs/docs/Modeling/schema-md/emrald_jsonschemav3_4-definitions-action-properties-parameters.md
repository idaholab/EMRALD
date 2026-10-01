# parameters Schema

```txt
EMRALD_Model#/definitions/Action/properties/parameters
```

Optional. For action type atCngVarVal when useDistribution is true, this is the array of distribution parameters. The shape is shared with etDistribution events for convenience, but the timeRate field on each parameter is ignored for atCngVarVal (variable values are unitless raw numbers, not durations).

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## parameters Type

`object[]` ([EventDistributionParameter](emrald_jsonschemav3_4-definitions-eventdistributionparameter.md))
