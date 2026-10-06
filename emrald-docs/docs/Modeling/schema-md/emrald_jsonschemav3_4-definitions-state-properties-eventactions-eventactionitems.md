# EventActionItems Schema

```txt
EMRALD_Model#/definitions/State/properties/eventActions/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_4.json\*](../../../out/EMRALD_JsonSchemaV3_4.json "open original schema") |

## items Type

`object` ([EventActionItems](emrald_jsonschemav3_4-definitions-state-properties-eventactions-eventactionitems.md))

# items Properties

| Property                            | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                                |
| :---------------------------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [actions](#actions)                 | `array`   | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-state-properties-eventactions-eventactionitems-properties-actions.md "EMRALD_Model#/definitions/State/properties/eventActions/items/properties/actions")                 |
| [moveFromCurrent](#movefromcurrent) | `boolean` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_4-definitions-state-properties-eventactions-eventactionitems-properties-movefromcurrent.md "EMRALD_Model#/definitions/State/properties/eventActions/items/properties/moveFromCurrent") |

## actions

array of referenace names for actions of the associated event.

`actions`

* is required

* Type: `string[]`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-state-properties-eventactions-eventactionitems-properties-actions.md "EMRALD_Model#/definitions/State/properties/eventActions/items/properties/actions")

### actions Type

`string[]`

## moveFromCurrent



`moveFromCurrent`

* is required

* Type: `boolean`

* cannot be null

* defined in: [EMRALD_Model](emrald_jsonschemav3_4-definitions-state-properties-eventactions-eventactionitems-properties-movefromcurrent.md "EMRALD_Model#/definitions/State/properties/eventActions/items/properties/moveFromCurrent")

### moveFromCurrent Type

`boolean`
