# Untitled object in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/Group
```

What catagory grouping this item belongs to. Used to indicate a group for and EMRALD model template.

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## Group Type

`object` ([Details](emrald_jsonschemav3_4-definitions-group.md))

# Group Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                           |
| :-------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| [name](#name)         | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-group-properties-name.md "EMRALD_Model#/definitions/Group/properties/name")         |
| [subgroup](#subgroup) | `array`  | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-group-properties-subgroup.md "EMRALD_Model#/definitions/Group/properties/subgroup") |

## name

Name of the group

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-group-properties-name.md "EMRALD_Model#/definitions/Group/properties/name")

### name Type

`string`

## subgroup

Sub group tree path

`subgroup`

* is optional

* Type: `object[]` ([Details](emrald_jsonschemav3_4-definitions-group.md))

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-group-properties-subgroup.md "EMRALD_Model#/definitions/Group/properties/subgroup")

### subgroup Type

`object[]` ([Details](emrald_jsonschemav3_4-definitions-group.md))
