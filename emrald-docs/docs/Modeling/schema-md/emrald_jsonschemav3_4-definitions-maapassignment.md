# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPAssignment
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPAssignment Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapassignment.md))

# MAAPAssignment Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                          |
| :-------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| [target](#target)     | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-target.md "EMRALD_Model#/definitions/MAAPAssignment/properties/target") |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-type.md "EMRALD_Model#/definitions/MAAPAssignment/properties/type")     |
| [value](#value)       | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-value.md "EMRALD_Model#/definitions/MAAPAssignment/properties/value")   |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAssignment/properties/comments")               |

## target



`target`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapassignment-properties-target.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-target.md "EMRALD_Model#/definitions/MAAPAssignment/properties/target")

### target Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapassignment-properties-target.md))

any of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapidentifier.md "check type definition")

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-type.md "EMRALD_Model#/definitions/MAAPAssignment/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"assignment"
```

## value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapassignment-properties-value.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-value.md "EMRALD_Model#/definitions/MAAPAssignment/properties/value")

### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapassignment-properties-value.md))

all of

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

  * all of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

    * any of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapassignment-properties-value-allof-1.md "check type definition")

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAssignment/properties/comments")

### comments Type

`string[][]`
