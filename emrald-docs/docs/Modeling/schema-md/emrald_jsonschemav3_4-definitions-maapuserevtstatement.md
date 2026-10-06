# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/MAAPUserEvtStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPUserEvtStatement Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapuserevtstatement.md))

# MAAPUserEvtStatement Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                   |
| :-------------------- | :------------ | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapuserevtstatement-properties-type.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/type")   |
| [value](#value)       | `array`       | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapuserevtstatement-properties-value.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/value") |
| [comments](#comments) | `array`       | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/comments")                   |

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapuserevtstatement-properties-type.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"user_evt"
```

## value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapuserevtstatement-properties-value.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/value")

### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPUserEvtStatement/properties/comments")

### comments Type

`string[][]`
