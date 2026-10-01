# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPFileStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPFileStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapfilestatement.md))

# MAAPFileStatement Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                    |
| :-------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [fileType](#filetype) | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-filetype.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/fileType") |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-type.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/type")         |
| [value](#value)       | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-value.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/value")       |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/comments")                      |

## fileType



`fileType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-filetype.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/fileType")

### fileType Type

`string`

### fileType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                   | Explanation |
| :---------------------- | :---------- |
| `"PARAMETER FILE"`      |             |
| `"INCLUDE"`             |             |
| `"DOSE PARAMETER FILE"` |             |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-type.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"file"
```

## value



`value`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapfilestatement-properties-value.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/value")

### value Type

`string`

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPFileStatement/properties/comments")

### comments Type

`string[][]`
