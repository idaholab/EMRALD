# Untitled object in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/Group
```

What catagory grouping this item belongs to. Used to indicate a group for and EMRALD model template

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## Group Type

`object` ([Details](emrald_jsonschemav3_0-definitions-group.md))

# Group Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                            |
| :-------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| [name](#name)         | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-group-properties-name.md "EMRALD_Model#/definitions/Group/properties/name")         |
| [subgroup](#subgroup) | `array`  | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-group-properties-subgroup.md "EMRALD_Model#/definitions/Group/properties/subgroup") |

## name

Name of the group

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-group-properties-name.md "EMRALD_Model#/definitions/Group/properties/name")

### name Type

`string`

## subgroup

Sub group tree path

`subgroup`

* is optional

* Type: unknown\[]

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-group-properties-subgroup.md "EMRALD_Model#/definitions/Group/properties/subgroup")

### subgroup Type

unknown\[]
