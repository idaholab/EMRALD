# Untitled string in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/Variable/properties/WatchEventCriteria
```

Optional. For variables of varScope gt3DSim, an fParser boolean expression (e.g. '(valve\_12 > 5) & (valve\_12 < 10)') the external simulation must satisfy before reporting this variable. Sent in the initial coupling message. When omitted the variable is reported on every change.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## WatchEventCriteria Type

`string`
