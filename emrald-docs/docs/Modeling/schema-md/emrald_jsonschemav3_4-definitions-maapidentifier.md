# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPIdentifier
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPIdentifier Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapidentifier.md))

# MAAPIdentifier Properties

| Property                    | Type          | Required | Nullable       | Defined by                                                                                                                                                    |
| :-------------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [type](#type)               | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-type.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/type")               |
| [value](#value)             | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-value.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/value")             |
| [useVariable](#usevariable) | `boolean`     | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-usevariable.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/useVariable") |
| [comments](#comments)       | `array`       | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/comments")                         |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-type.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"identifier"
```

## value



`value`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-value.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/value")

### value Type

`string`

## useVariable



`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapidentifier-properties-usevariable.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/useVariable")

### useVariable Type

`boolean`

## comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPIdentifier/properties/comments")

### comments Type

`string[][]`
