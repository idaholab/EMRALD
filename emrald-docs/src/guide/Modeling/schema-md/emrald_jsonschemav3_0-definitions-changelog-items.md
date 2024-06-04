# items Schema

```txt
EMRALD_Model#/definitions/ChangeLog/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## items Type

`object` ([items](emrald_jsonschemav3\_0-definitions-changelog-items.md))

# items Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                               |
| :-------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [cngDesc](#cngdesc)   | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-changelog-items-properties-cngdesc.md "EMRALD_Model#/definitions/ChangeLog/items/properties/cngDesc")   |
| [dateTime](#datetime) | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-changelog-items-properties-datetime.md "EMRALD_Model#/definitions/ChangeLog/items/properties/dateTime") |
| [cngID](#cngid)       | `string` | Optional | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-changelog-items-properties-cngid.md "EMRALD_Model#/definitions/ChangeLog/items/properties/cngID")       |

## cngDesc

Description of the change.

`cngDesc`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-changelog-items-properties-cngdesc.md "EMRALD_Model#/definitions/ChangeLog/items/properties/cngDesc")

### cngDesc Type

`string`

## dateTime

ISO 8601 date time format for the change

`dateTime`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-changelog-items-properties-datetime.md "EMRALD_Model#/definitions/ChangeLog/items/properties/dateTime")

### dateTime Type

`string`

## cngID



`cngID`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-changelog-items-properties-cngid.md "EMRALD_Model#/definitions/ChangeLog/items/properties/cngID")

### cngID Type

`string`
