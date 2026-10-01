# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPAsExpression
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPAsExpression Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapasexpression.md))

# MAAPAsExpression Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                          |
| :-------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| [target](#target)     | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/target")                   |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapasexpression-properties-type.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/type") |
| [value](#value)       | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/value")                    |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/comments")             |

## target



`target`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/target")

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

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapasexpression-properties-type.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"as_expression"
```

## value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/value")

### value Type

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

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAsExpression/properties/comments")

### comments Type

`string[][]`
