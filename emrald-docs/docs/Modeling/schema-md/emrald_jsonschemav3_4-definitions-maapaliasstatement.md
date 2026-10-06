# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPAliasStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPAliasStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapaliasstatement.md))

# MAAPAliasStatement Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                |
| :-------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapaliasstatement-properties-type.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/type")   |
| [value](#value)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapaliasstatement-properties-value.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/value") |
| [comments](#comments) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/comments")                 |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapaliasstatement-properties-type.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"alias"
```

## value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapaliasstatement-properties-value.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/value")

### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

## comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPAliasStatement/properties/comments")

### comments Type

`string[][]`
