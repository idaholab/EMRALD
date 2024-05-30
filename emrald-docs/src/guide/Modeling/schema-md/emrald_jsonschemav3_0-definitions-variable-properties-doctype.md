# Untitled string in EMRALD_Model Schema

```txt
EMRALD_Model#/definitions/Variable/properties/docType
```

If the varScope is gtDocLink then this the type of document the variable can be linked to. XML, JSON or PlainText using a regular expression

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## docType Type

`string`

## docType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value           | Explanation |
| :-------------- | :---------- |
| `"dtXML"`       |             |
| `"dtJSON"`      |             |
| `"dtTextRegEx"` |             |
