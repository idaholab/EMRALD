# NewState Schema

```txt
EMRALD_Model#/definitions/NewState
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [EMRALD_JsonSchemaV3_0.json*](../../../../../Emrald-UI/out/EMRALD_JsonSchemaV3_0.json "open original schema") |

## NewState Type

`object` ([NewState](emrald_jsonschemav3\_0-definitions-newstate.md))

# NewState Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                 |
| :-------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| [toState](#tostate)   | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-newstate-properties-tostate.md "EMRALD_Model#/definitions/NewState/properties/toState")   |
| [prob](#prob)         | `number` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-newstate-properties-prob.md "EMRALD_Model#/definitions/NewState/properties/prob")         |
| [failDesc](#faildesc) | `string` | Required | cannot be null | [EMRALD_Model](emrald_jsonschemav3_0-definitions-newstate-properties-faildesc.md "EMRALD_Model#/definitions/NewState/properties/failDesc") |
| [varProb](#varprob)   | `string` | Optional | can be null    | [EMRALD_Model](emrald_jsonschemav3_0-definitions-newstate-properties-varprob.md "EMRALD_Model#/definitions/NewState/properties/varProb")   |

## toState

reference name of the state to transtion to.

`toState`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-newstate-properties-tostate.md "EMRALD_Model#/definitions/NewState/properties/toState")

### toState Type

`string`

## prob

probability that this state will be transtioned to.

`prob`

*   is required

*   Type: `number`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-newstate-properties-prob.md "EMRALD_Model#/definitions/NewState/properties/prob")

### prob Type

`number`

## failDesc

The description from the user for output if tthis transition takes place.

`failDesc`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-newstate-properties-faildesc.md "EMRALD_Model#/definitions/NewState/properties/failDesc")

### failDesc Type

`string`

## varProb

Optional, if used  then the a variable is used for the probability. This is the name of that variable

`varProb`

*   is optional

*   Type: `string`

*   can be null

*   defined in: [EMRALD_Model](emrald_jsonschemav3\_0-definitions-newstate-properties-varprob.md "EMRALD_Model#/definitions/NewState/properties/varProb")

### varProb Type

`string`
