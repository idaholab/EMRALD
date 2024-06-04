# items Schema

```txt
EMRALD_Model#/definitions/CompChild/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## items Type

`object` ([items](emrald_jsonschemav3\_0-definitions-compchild-items.md))

# items Properties

| Property                    | Type     | Required | Nullable       | Defined by                                                                                                                                                     |
| :-------------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [stateValues](#statevalues) | `array`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-compchild-items-properties-statevalues.md "EMRALD_Model#/definitions/CompChild/items/properties/stateValues") |
| [diagramName](#diagramname) | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-compchild-items-properties-diagramname.md "EMRALD_Model#/definitions/CompChild/items/properties/diagramName") |

## stateValues

Evaluate value if not the states default.

`stateValues`

*   is optional

*   Type: `object[]` ([items](emrald_jsonschemav3\_0-definitions-compchild-items-properties-statevalues-items.md))

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-compchild-items-properties-statevalues.md "EMRALD_Model#/definitions/CompChild/items/properties/stateValues")

### stateValues Type

`object[]` ([items](emrald_jsonschemav3\_0-definitions-compchild-items-properties-statevalues-items.md))

## diagramName

Name of the diagram to be evaluated

`diagramName`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-compchild-items-properties-diagramname.md "EMRALD_Model#/definitions/CompChild/items/properties/diagramName")

### diagramName Type

`string`
