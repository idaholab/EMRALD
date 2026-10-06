# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/MAAPTitleStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPTitleStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maaptitlestatement.md))

# MAAPTitleStatement Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                               |
| :-------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptitlestatement-properties-type.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/type")   |
| [value](#value)       | `string`      | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptitlestatement-properties-value.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/value") |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/comments")                 |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptitlestatement-properties-type.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"title"
```

## value



`value`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptitlestatement-properties-value.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/value")

### value Type

`string`

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTitleStatement/properties/comments")

### comments Type

`string[][]`
