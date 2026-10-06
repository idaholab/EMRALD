# MAAPParameter Schema

```txt
EMRALD_Model#/definitions/MAAPParameter
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPParameter Type

`object` ([MAAPParameter](emrald_jsonschemav3_4-definitions-maapparameter.md))

# MAAPParameter Properties

| Property                    | Type          | Required | Nullable       | Defined by                                                                                                                                                 |
| :-------------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [flag](#flag)               | `object`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md "EMRALD_Model#/definitions/MAAPParameter/properties/flag")                          |
| [index](#index)             | `number`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-index.md "EMRALD_Model#/definitions/MAAPParameter/properties/index")             |
| [type](#type)               | Not specified | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-type.md "EMRALD_Model#/definitions/MAAPParameter/properties/type")               |
| [value](#value)             | Merged        | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-value.md "EMRALD_Model#/definitions/MAAPParameter/properties/value")             |
| [comments](#comments)       | `array`       | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPParameter/properties/comments")                        |
| [name](#name)               | `string`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-name.md "EMRALD_Model#/definitions/MAAPParameter/properties/name")               |
| [useVariable](#usevariable) | `boolean`     | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-usevariable.md "EMRALD_Model#/definitions/MAAPParameter/properties/useVariable") |
| [unit](#unit)               | `string`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-unit.md "EMRALD_Model#/definitions/MAAPParameter/properties/unit")               |
| [variable](#variable)       | `string`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-variable.md "EMRALD_Model#/definitions/MAAPParameter/properties/variable")       |
| [desc](#desc)               | `string`      | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-desc.md "EMRALD_Model#/definitions/MAAPParameter/properties/desc")               |

## flag



`flag`

* is optional

* Type: `object` ([Details](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md "EMRALD_Model#/definitions/MAAPParameter/properties/flag")

### flag Type

`object` ([Details](emrald_jsonschemav3_4-definitions-maapbooleanliteral.md))

## index



`index`

* is optional

* Type: `number`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-index.md "EMRALD_Model#/definitions/MAAPParameter/properties/index")

### index Type

`number`

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-type.md "EMRALD_Model#/definitions/MAAPParameter/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"parameter"
```

## value



`value`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapparameter-properties-value.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-value.md "EMRALD_Model#/definitions/MAAPParameter/properties/value")

### value Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapparameter-properties-value.md))

any of

* any of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression.md "check type definition")

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

  * all of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

    * any of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparametername.md "check type definition")

* [Untitled string in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-value-anyof-2.md "check type definition")

## comments



`comments`

* is optional

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPParameter/properties/comments")

### comments Type

`string[][]`

## name



`name`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-name.md "EMRALD_Model#/definitions/MAAPParameter/properties/name")

### name Type

`string`

## useVariable



`useVariable`

* is optional

* Type: `boolean`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-usevariable.md "EMRALD_Model#/definitions/MAAPParameter/properties/useVariable")

### useVariable Type

`boolean`

## unit



`unit`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-unit.md "EMRALD_Model#/definitions/MAAPParameter/properties/unit")

### unit Type

`string`

## variable



`variable`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-variable.md "EMRALD_Model#/definitions/MAAPParameter/properties/variable")

### variable Type

`string`

## desc



`desc`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-maapparameter-properties-desc.md "EMRALD_Model#/definitions/MAAPParameter/properties/desc")

### desc Type

`string`
