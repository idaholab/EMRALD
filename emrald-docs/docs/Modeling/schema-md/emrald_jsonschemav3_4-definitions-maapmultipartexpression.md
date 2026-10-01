# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPMultiPartExpression
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPMultiPartExpression Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md))

# MAAPMultiPartExpression Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                          |
| :-------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-type.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/type")   |
| [op](#op)             | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-op.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/op")       |
| [value](#value)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-value.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/value") |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/comments")                      |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-type.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"multi_expression"
```

## op



`op`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-op.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/op")

### op Type

`string`

## value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-value-items.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-value.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/value")

### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapmultipartexpression-properties-value-items.md))

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPMultiPartExpression/properties/comments")

### comments Type

`string[][]`
