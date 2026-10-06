# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/MAAPExpressionBlock
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPExpressionBlock Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapexpressionblock.md))

# MAAPExpressionBlock Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                 |
| :-------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-type.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/type")   |
| [value](#value)       | Merged        | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpression.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/value")                       |
| [units](#units)       | `string`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-units.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/units") |
| [comments](#comments) | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/comments")                  |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-type.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"expression_block"
```

## value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapexpression.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpression.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/value")

### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapexpression.md))

any of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

* all of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

    * all of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-1.md "check type definition")

## units



`units`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock-properties-units.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/units")

### units Type

`string`

## comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPExpressionBlock/properties/comments")

### comments Type

`string[][]`
