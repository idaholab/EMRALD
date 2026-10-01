# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/MAAPSensitivityStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPSensitivityStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapsensitivitystatement.md))

# MAAPSensitivityStatement Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                            |
| :-------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapsensitivitystatement-properties-type.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/type")   |
| [value](#value)       | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapsensitivitystatement-properties-value.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/value") |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/comments")                       |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapsensitivitystatement-properties-type.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"sensitivity"
```

## value



`value`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapsensitivitystatement-properties-value.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/value")

### value Type

`string`

### value Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value   | Explanation |
| :------ | :---------- |
| `"ON"`  |             |
| `"OFF"` |             |

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPSensitivityStatement/properties/comments")

### comments Type

`string[][]`
