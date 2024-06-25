# ChangeLogItems Schema

```txt
EMRALD_Model#/definitions/ChangeLog/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## items Type

`object` ([ChangeLogItems](emrald_jsonschemav3_0-definitions-changelog-changelogitems.md))

# items Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                         |
| :-------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [cngDesc](#cngdesc)   | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog-changelogitems-properties-cngdesc.md "EMRALD_Model#/definitions/ChangeLog/items/properties/cngDesc")   |
| [dateTime](#datetime) | `string` | Required | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog-changelogitems-properties-datetime.md "EMRALD_Model#/definitions/ChangeLog/items/properties/dateTime") |
| [cngID](#cngid)       | `string` | Optional | cannot be null | [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog-changelogitems-properties-cngid.md "EMRALD_Model#/definitions/ChangeLog/items/properties/cngID")       |

## cngDesc

Description of the change.

`cngDesc`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog-changelogitems-properties-cngdesc.md "EMRALD_Model#/definitions/ChangeLog/items/properties/cngDesc")

### cngDesc Type

`string`

## dateTime

ISO 8601 date time format for the change

`dateTime`

* is required

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog-changelogitems-properties-datetime.md "EMRALD_Model#/definitions/ChangeLog/items/properties/dateTime")

### dateTime Type

`string`

## cngID



`cngID`

* is optional

* Type: `string`

* cannot be null

* defined in: [EMRALD\_Model](emrald_jsonschemav3_0-definitions-changelog-changelogitems-properties-cngid.md "EMRALD_Model#/definitions/ChangeLog/items/properties/cngID")

### cngID Type

`string`
