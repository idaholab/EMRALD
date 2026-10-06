# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPPlotFilStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPPlotFilStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapplotfilstatement.md))

# MAAPPlotFilStatement Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                    |
| :-------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [n](#n)               | `number`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-n.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/n")         |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-type.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/type")   |
| [value](#value)       | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-value.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/value") |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/comments")                   |

## n



`n`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-n.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/n")

### n Type

`number`

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-type.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"plotfil"
```

## value



`value`

* is required

* Type: `object[]` ([Details](emrald_jsonschemav3_4-definitions-maapplotfilbody.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapplotfilstatement-properties-value.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/value")

### value Type

`object[]` ([Details](emrald_jsonschemav3_4-definitions-maapplotfilbody.md))

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPPlotFilStatement/properties/comments")

### comments Type

`string[][]`
