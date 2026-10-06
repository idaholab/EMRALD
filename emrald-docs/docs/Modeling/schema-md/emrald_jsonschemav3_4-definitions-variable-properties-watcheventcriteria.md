# Untitled string in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/Variable/properties/WatchEventCriteria
```

Optional. For variables of varScope gt3DSim, an fParser boolean expression (e.g. '(valve_12 > 5) & (valve_12 < 10)') the external simulation must satisfy before reporting this variable. Sent in the initial coupling message. When omitted the variable is reported on every change.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## WatchEventCriteria Type

`string`
