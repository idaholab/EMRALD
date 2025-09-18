# StateValuesItems Schema

```txt
EMRALD_Model#/definitions/CompChild/items/properties/stateValues/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                    |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## items Type

`object` ([StateValuesItems](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues-statevaluesitems.md))

# items Properties

| Property                  | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                                                  |
| :------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [stateName](#statename)   | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues-statevaluesitems-properties-statename.md "EMRALD_Model#/definitions/CompChild/items/properties/stateValues/items/properties/stateName")   |
| [stateValue](#statevalue) | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues-statevaluesitems-properties-statevalue.md "EMRALD_Model#/definitions/CompChild/items/properties/stateValues/items/properties/stateValue") |

## stateName

State name for the value.

`stateName`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues-statevaluesitems-properties-statename.md "EMRALD_Model#/definitions/CompChild/items/properties/stateValues/items/properties/stateName")

### stateName Type

`string`

## stateValue

For single state diagrams. Boolean value for the diagram when evaluated in a logic tree. Ignore - removes that item from the logic calculation.

`stateValue`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues-statevaluesitems-properties-statevalue.md "EMRALD_Model#/definitions/CompChild/items/properties/stateValues/items/properties/stateValue")

### stateValue Type

`string`

### stateValue Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"True"`   |             |
| `"False"`  |             |
| `"Ignore"` |             |
