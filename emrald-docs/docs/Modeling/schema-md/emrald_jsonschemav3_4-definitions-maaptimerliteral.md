# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/MAAPTimerLiteral
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPTimerLiteral Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maaptimerliteral.md))

# MAAPTimerLiteral Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                           |
| :-------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral-properties-type.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/type")   |
| [value](#value)       | `number`      | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral-properties-value.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/value") |
| [comments](#comments) | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/comments")               |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral-properties-type.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"timer"
```

## value



`value`

* is required

* Type: `number`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral-properties-value.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/value")

### value Type

`number`

## comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTimerLiteral/properties/comments")

### comments Type

`string[][]`
