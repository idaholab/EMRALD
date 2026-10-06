# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPActionStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPActionStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapactionstatement.md))

# MAAPActionStatement Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                  |
| :-------------------- | :------------ | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [index](#index)       | `number`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-index.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/index") |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-type.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/type")   |
| [value](#value)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-value.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/value") |
| [comments](#comments) | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/comments")                  |

## index



`index`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-index.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/index")

### index Type

`number`

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-type.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"action"
```

## value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapactionstatement-properties-value.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/value")

### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

## comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPActionStatement/properties/comments")

### comments Type

`string[][]`
