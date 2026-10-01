# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPFunctionStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPFunctionStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapfunctionstatement.md))

# MAAPFunctionStatement Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                    |
| :-------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [name](#name)         | `object`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/name")                        |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfunctionstatement-properties-type.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/type") |
| [value](#value)       | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapexpression.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/value")                       |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/comments")                  |

## name



`name`

* is required

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-maapidentifier.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/name")

### name Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapidentifier.md))

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfunctionstatement-properties-type.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"function"
```

## value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapexpression.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapexpression.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/value")

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

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPFunctionStatement/properties/comments")

### comments Type

`string[][]`
