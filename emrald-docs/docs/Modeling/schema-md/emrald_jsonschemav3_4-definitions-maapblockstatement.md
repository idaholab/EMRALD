# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPBlockStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPBlockStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapblockstatement.md))

# MAAPBlockStatement Properties

| Property                | Type          | Required | Nullable       | Defined by                                                                                                                                                        |
| :---------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [blockType](#blocktype) | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-blocktype.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/blockType") |
| [type](#type)           | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-type.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/type")           |
| [value](#value)         | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-value.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/value")         |
| [comments](#comments)   | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/comments")                         |

## blockType



`blockType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-blocktype.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/blockType")

### blockType Type

`string`

### blockType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                | Explanation |
| :------------------- | :---------- |
| `"PARAMETER CHANGE"` |             |
| `"INITIATORS"`       |             |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-type.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"block"
```

## value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapblockstatement-properties-value.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/value")

### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPBlockStatement/properties/comments")

### comments Type

`string[][]`
