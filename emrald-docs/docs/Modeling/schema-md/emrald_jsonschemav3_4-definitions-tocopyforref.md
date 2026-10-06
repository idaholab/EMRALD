# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/ToCopyForRef
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## ToCopyForRef Type

`object` ([Details](emrald_jsonschemav3_4-definitions-tocopyforref.md))

# ToCopyForRef Properties

| Property                  | Type     | Required | Nullable       | Defined by                                                                                                                                             |
| :------------------------ | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ItemName](#itemname)     | `string` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-itemname.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ItemName")     |
| [ItemType](#itemtype)     | `string` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-itemtype.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ItemType")     |
| [RefPath](#refpath)       | `string` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-refpath.md "EMRALD_Model#/definitions/ToCopyForRef/properties/RefPath")       |
| [ToCopy](#tocopy)         | `array`  | Optional | can be null    | [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-tocopy.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ToCopy")         |
| [RelPath](#relpath)       | `string` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-relpath.md "EMRALD_Model#/definitions/ToCopyForRef/properties/RelPath")       |
| [AdjRelRoot](#adjrelroot) | `string` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-adjrelroot.md "EMRALD_Model#/definitions/ToCopyForRef/properties/AdjRelRoot") |

## ItemName



`ItemName`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-itemname.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ItemName")

### ItemName Type

`string`

## ItemType



`ItemType`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-itemtype.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ItemType")

### ItemType Type

`string`

### ItemType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value          | Explanation |
| :------------- | :---------- |
| `"itVar"`      |             |
| `"itComp"`     |             |
| `"itState"`    |             |
| `"itEvent"`    |             |
| `"itAction"`   |             |
| `"itTreeNode"` |             |
| `"itTimer"`    |             |
| `"itDiagram"`  |             |
| `"itExtSim"`   |             |

## RefPath



`RefPath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-refpath.md "EMRALD_Model#/definitions/ToCopyForRef/properties/RefPath")

### RefPath Type

`string`

## ToCopy



`ToCopy`

* is optional

* Type: `string[]`

* can be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-tocopy.md "EMRALD_Model#/definitions/ToCopyForRef/properties/ToCopy")

### ToCopy Type

`string[]`

## RelPath



`RelPath`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-relpath.md "EMRALD_Model#/definitions/ToCopyForRef/properties/RelPath")

### RelPath Type

`string`

## AdjRelRoot



`AdjRelRoot`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-tocopyforref-properties-adjrelroot.md "EMRALD_Model#/definitions/ToCopyForRef/properties/AdjRelRoot")

### AdjRelRoot Type

`string`
