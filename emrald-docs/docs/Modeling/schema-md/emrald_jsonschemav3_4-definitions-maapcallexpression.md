# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/MAAPCallExpression
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPCallExpression Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapcallexpression.md))

# MAAPCallExpression Properties

| Property                | Type          | Required | Nullable       | Defined by                                                                                                                                                       |
| :---------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [arguments](#arguments) | `array`       | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression-properties-arguments.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/arguments") |
| [type](#type)           | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression-properties-type.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/type")           |
| [value](#value)         | `object`      | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/value")                              |
| [comments](#comments)   | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/comments")                         |

## arguments



`arguments`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapexpressiontype.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression-properties-arguments.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/arguments")

### arguments Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapexpressiontype.md))

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression-properties-type.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"call_expression"
```

## value



`value`

* is required

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-maapidentifier.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/value")

### value Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapidentifier.md))

## comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPCallExpression/properties/comments")

### comments Type

`string[][]`
