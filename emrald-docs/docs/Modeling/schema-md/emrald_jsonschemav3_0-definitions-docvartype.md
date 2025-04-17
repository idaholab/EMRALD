# Untitled string in EMRALD\_Model Schema

```txt
EMRALD_Model#/definitions/DocVarType
```

If the varScope is gtDocLink then this the type of document the variable can be linked to. XML, JSON or PlainText using a regular expression

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                    |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [EMRALD\_JsonSchemaV3\_0.json\*](../../out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## DocVarType Type

`string`

## DocVarType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value           | Explanation |
| :-------------- | :---------- |
| `"dtXML"`       |             |
| `"dtJSON"`      |             |
| `"dtTextRegEx"` |             |
