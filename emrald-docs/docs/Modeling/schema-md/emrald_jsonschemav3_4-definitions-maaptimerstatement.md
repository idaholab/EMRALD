# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/MAAPTimerStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPTimerStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maaptimerstatement.md))

# MAAPTimerStatement Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                             |
| :-------------------- | :------------ | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerstatement-properties-type.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/type") |
| [value](#value)       | `object`      | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/value")                  |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/comments")               |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerstatement-properties-type.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"set_timer"
```

## value



`value`

* is required

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-maaptimerliteral.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maaptimerliteral.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/value")

### value Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maaptimerliteral.md))

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPTimerStatement/properties/comments")

### comments Type

`string[][]`
