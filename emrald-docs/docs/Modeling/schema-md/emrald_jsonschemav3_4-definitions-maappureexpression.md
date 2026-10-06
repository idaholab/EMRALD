# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/MAAPPureExpression
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPPureExpression Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maappureexpression.md))

# MAAPPureExpression Properties

| Property                    | Type          | Required | Nullable       | Defined by                                                                                                                                                           |
| :-------------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)               | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-type.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/type")               |
| [left](#left)               | Merged        | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/left")                               |
| [op](#op)                   | `string`      | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-op.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/op")                   |
| [right](#right)             | Merged        | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-right.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/right")             |
| [useVariable](#usevariable) | `boolean`     | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-usevariable.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/useVariable") |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-type.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"expression"
```

## left



`left`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapexpressiontype.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/left")

### left Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapexpressiontype.md))

all of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

  * all of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

    * any of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-1-anyof-1.md "check type definition")

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparametername.md "check type definition")

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "check type definition")

## op



`op`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-op.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/op")

### op Type

`string`

### op Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value  | Explanation |
| :----- | :---------- |
| `"**"` |             |
| `"*"`  |             |
| `"/"`  |             |
| `">="` |             |
| `"<="` |             |
| `">"`  |             |
| `"<"`  |             |
| `"+"`  |             |
| `"-"`  |             |
| `"!="` |             |
| `"=="` |             |

## right



`right`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maappureexpression-properties-right.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-right.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/right")

### right Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maappureexpression-properties-right.md))

any of

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

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression-properties-usevariable.md "EMRALD_Model#/definitions/MAAPPureExpression/properties/useVariable")

### useVariable Type

`boolean`
