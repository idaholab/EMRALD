# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/MAAPLookupStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPLookupStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maaplookupstatement.md))

# MAAPLookupStatement Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                 |
| :-------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [name](#name)         | Merged        | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/name")                          |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaplookupstatement-properties-type.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/type")   |
| [value](#value)       | `array`       | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaplookupstatement-properties-value.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/value") |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/comments")                  |

## name



`name`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapvariable.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/name")

### name Type

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

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaplookupstatement-properties-type.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"lookup_variable"
```

## value



`value`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaplookupstatement-properties-value.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/value")

### value Type

`string[]`

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPLookupStatement/properties/comments")

### comments Type

`string[][]`
