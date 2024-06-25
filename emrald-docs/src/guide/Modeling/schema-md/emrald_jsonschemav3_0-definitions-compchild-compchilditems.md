# CompChildItems Schema

```txt
EMRALD_Model#/definitions/CompChild/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## items Type

`object` ([CompChildItems](emrald_jsonschemav3_0-definitions-compchild-compchilditems.md))

# items Properties

| Property                    | Type     | Required | Nullable       | Defined by                                                                                                                                                               |
| :-------------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [stateValues](#statevalues) | `array`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues.md "EMRALD_Model#/definitions/CompChild/items/properties/stateValues") |
| [diagramName](#diagramname) | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-diagramname.md "EMRALD_Model#/definitions/CompChild/items/properties/diagramName") |

## stateValues

Evaluate value if not the states default.

`stateValues`

* is optional

* Type: `object[]` ([StateValuesItems](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues-statevaluesitems.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues.md "EMRALD_Model#/definitions/CompChild/items/properties/stateValues")

### stateValues Type

`object[]` ([StateValuesItems](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues-statevaluesitems.md))

## diagramName

Name of the diagram to be evaluated

`diagramName`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-diagramname.md "EMRALD_Model#/definitions/CompChild/items/properties/diagramName")

### diagramName Type

`string`
