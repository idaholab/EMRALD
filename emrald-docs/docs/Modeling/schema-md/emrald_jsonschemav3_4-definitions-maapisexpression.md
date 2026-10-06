# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/MAAPIsExpression
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPIsExpression Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapisexpression.md))

# MAAPIsExpression Properties

| Property                    | Type          | Required | Nullable       | Defined by                                                                                                                                                       |
| :-------------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [target](#target)           | Merged        | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/target")                                 |
| [type](#type)               | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression-properties-type.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/type")               |
| [value](#value)             | Merged        | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpression.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/value")                                |
| [useVariable](#usevariable) | `boolean`     | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression-properties-usevariable.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/useVariable") |
| [comments](#comments)       | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/comments")                           |

## target



`target`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/target")

### target Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

all of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapnumericliteral.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparametername.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "check type definition")

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression-properties-type.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"is_expression"
```

## value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapexpression.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpression.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/value")

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

## useVariable



`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression-properties-usevariable.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/useVariable")

### useVariable Type

`boolean`

## comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPIsExpression/properties/comments")

### comments Type

`string[][]`
