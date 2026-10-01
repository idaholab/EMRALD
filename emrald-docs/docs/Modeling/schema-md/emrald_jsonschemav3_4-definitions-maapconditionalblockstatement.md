# MAAPConditionalBlockStatement Schema

```txt
EMRALD_Model#/definitions/MAAPConditionalBlockStatement
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## MAAPConditionalBlockStatement Type

`object` ([MAAPConditionalBlockStatement](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement.md))

# MAAPConditionalBlockStatement Properties

| Property                | Type          | Required | Nullable       | Defined by                                                                                                                                                                              |
| :---------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [blockType](#blocktype) | `string`      | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-blocktype.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/blockType") |
| [test](#test)           | Merged        | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-test.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/test")           |
| [type](#type)           | Not specified | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-type.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/type")           |
| [value](#value)         | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-value.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/value")         |
| [comments](#comments)   | `array`       | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/comments")                                    |

## blockType



`blockType`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-blocktype.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/blockType")

### blockType Type

`string`

### blockType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value    | Explanation |
| :------- | :---------- |
| `"IF"`   |             |
| `"WHEN"` |             |

## test



`test`

* is required

* Type: merged type ([Details](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-test.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-test.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/test")

### test Type

merged type ([Details](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-test.md))

any of

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapmultipartexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapisexpression.md "check type definition")

* [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maappureexpression.md "check type definition")

* all of

  * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressiontype-allof-0.md "check type definition")

  * any of

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapcallexpression.md "check type definition")

    * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapexpressionblock.md "check type definition")

    * all of

      * [Untitled object in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-0.md "check type definition")

      * [Untitled undefined type in EMRALD_Model](emrald_jsonschemav3_4-definitions-maapvariable-allof-1.md "check type definition")

## type



`type`

* is required

* Type: unknown

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-type.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"conditional_block"
```

## value



`value`

* is required

* Type: an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapconditionalblockstatement-properties-value.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/value")

### value Type

an array of merged types ([Details](emrald_jsonschemav3_4-definitions-maapsourceelement.md))

## comments



`comments`

* is required

* Type: `string[][]`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_4-definitions-maapcommentarray.md "EMRALD_Model#/definitions/MAAPConditionalBlockStatement/properties/comments")

### comments Type

`string[][]`
