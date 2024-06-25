# README

## Top-level Schemas

* [EMRALD\_Model](./emrald_jsonschemav3_0.md "EMRALD model schema version 3") – `EMRALD_Model`

## Other Schemas

### Objects

* [Action](./emrald_jsonschemav3_0-definitions-action.md) – `EMRALD_Model#/definitions/Action`

* [ChangeLogItems](./emrald_jsonschemav3_0-definitions-changelog-changelogitems.md) – `EMRALD_Model#/definitions/ChangeLog/items`

* [CompChildItems](./emrald_jsonschemav3_0-definitions-compchild-compchilditems.md) – `EMRALD_Model#/definitions/CompChild/items`

* [Diagram](./emrald_jsonschemav3_0-definitions-diagram.md) – `EMRALD_Model#/definitions/Diagram`

* [Event](./emrald_jsonschemav3_0-definitions-event.md) – `EMRALD_Model#/definitions/Event`

* [EventActionItems](./emrald_jsonschemav3_0-definitions-state-properties-eventactions-eventactionitems.md) – `EMRALD_Model#/definitions/State/properties/eventActions/items`

* [EventDistributionParameter](./emrald_jsonschemav3_0-definitions-eventdistributionparameter.md) – `EMRALD_Model#/definitions/EventDistributionParameter`

* [ExtSim](./emrald_jsonschemav3_0-definitions-extsim.md) – `EMRALD_Model#/definitions/ExtSim`

* [GeometryInfo](./emrald_jsonschemav3_0-definitions-geometryinfo.md "position for the GUI") – `EMRALD_Model#/definitions/GeometryInfo`

* [LogicNode](./emrald_jsonschemav3_0-definitions-logicnode.md) – `EMRALD_Model#/definitions/LogicNode`

* [Main\_Model](./emrald_jsonschemav3_0-definitions-main_model.md "EMRALD model schema version 3") – `EMRALD_Model#/definitions/MainModel`

* [NewState](./emrald_jsonschemav3_0-definitions-newstate.md) – `EMRALD_Model#/definitions/NewState`

* [State](./emrald_jsonschemav3_0-definitions-state.md) – `EMRALD_Model#/definitions/State`

* [StateValuesItems](./emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues-statevaluesitems.md) – `EMRALD_Model#/definitions/CompChild/items/properties/stateValues/items`

* [Untitled object in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-action-properties-template.md "Optional") – `EMRALD_Model#/definitions/Action/properties/template`

* [Untitled object in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-group.md "What catagory grouping this item belongs to") – `EMRALD_Model#/definitions/Group`

* [Variable](./emrald_jsonschemav3_0-definitions-variable.md) – `EMRALD_Model#/definitions/Variable`

* [accrualStatesDataItems](./emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata-accrualstatesdataitems.md) – `EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items`

### Arrays

* [ChangeLog](./emrald_jsonschemav3_0-definitions-changelog.md "Type of the diagram") – `EMRALD_Model#/definitions/ChangeLog`

* [CompChild](./emrald_jsonschemav3_0-definitions-compchild.md "Array of component diagram names and state values to use in evaluating if not using the default value") – `EMRALD_Model#/definitions/CompChild`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-main_model-properties-diagramlist.md "All the diagrams for the model") – `EMRALD_Model#/definitions/MainModel/properties/DiagramList`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-diagram-properties-states.md "Names of the states used in this diagram") – `EMRALD_Model#/definitions/Diagram/properties/states`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-main_model-properties-extsimlist.md "All the external simulation links for the mdoel") – `EMRALD_Model#/definitions/MainModel/properties/ExtSimList`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-main_model-properties-statelist.md "All of the states for the different diagrams of the model") – `EMRALD_Model#/definitions/MainModel/properties/StateList`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-state-properties-immediateactions.md "Array of name references for the immediate actions to be run when entering the state") – `EMRALD_Model#/definitions/State/properties/immediateActions`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-state-properties-events.md "Array of name references to events") – `EMRALD_Model#/definitions/State/properties/events`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-state-properties-eventactions-eventactionitems-properties-actions.md "array of referenace names for actions of the associated event") – `EMRALD_Model#/definitions/State/properties/eventActions/items/properties/actions`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-main_model-properties-actionlist.md "All the actions that can be used in the model") – `EMRALD_Model#/definitions/MainModel/properties/ActionList`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-action-properties-newstates.md "Optional") – `EMRALD_Model#/definitions/Action/properties/newStates`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-action-properties-codevariables.md "Optional") – `EMRALD_Model#/definitions/Action/properties/codeVariables`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-action-properties-updatevariables.md "Used for custom form, variables used in the form") – `EMRALD_Model#/definitions/Action/properties/updateVariables`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-main_model-properties-eventlist.md "All the events that are used in the model") – `EMRALD_Model#/definitions/MainModel/properties/EventList`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-event-properties-triggerstates.md "Optional") – `EMRALD_Model#/definitions/Event/properties/triggerStates`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-event-properties-varnames.md "Optional, Name references for all variables used in scripts if the event type uses scripts") – `EMRALD_Model#/definitions/Event/properties/varNames`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-main_model-properties-logicnodelist.md "All the logic nodes to make the logic trees in the model") – `EMRALD_Model#/definitions/MainModel/properties/LogicNodeList`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-logicnode-properties-gatechildren.md "Array of logic node names that are children of this gate") – `EMRALD_Model#/definitions/LogicNode/properties/gateChildren`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-main_model-properties-variablelist.md "All the variables used in the model") – `EMRALD_Model#/definitions/MainModel/properties/VariableList`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata-accrualstatesdataitems-properties-accrualtable-items.md "Each row has the rate the time specified") – `EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/accrualTable/items`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-definitions-group-properties-subgroup.md "Sub group tree path") – `EMRALD_Model#/definitions/Group/properties/subgroup`

* [Untitled array in EMRALD\_Model](./emrald_jsonschemav3_0-allof-templates-properties-templates.md "Templates available to make new diagrams in the model") – `EMRALD_Model#/allOf/1/properties/templates`

* [accrualStatesData](./emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata.md "Optional") – `EMRALD_Model#/definitions/Variable/properties/accrualStatesData`

* [accrualTable](./emrald_jsonschemav3_0-definitions-variable-properties-accrualstatesdata-accrualstatesdataitems-properties-accrualtable.md "Optional") – `EMRALD_Model#/definitions/Variable/properties/accrualStatesData/items/properties/accrualTable`

* [eventActions](./emrald_jsonschemav3_0-definitions-state-properties-eventactions.md "actions for the events in sibling \"events\" array") – `EMRALD_Model#/definitions/State/properties/eventActions`

* [parameters](./emrald_jsonschemav3_0-definitions-event-properties-parameters.md "Optional") – `EMRALD_Model#/definitions/Event/properties/parameters`

* [stateValues](./emrald_jsonschemav3_0-definitions-compchild-compchilditems-properties-statevalues.md "Evaluate value if not the states default") – `EMRALD_Model#/definitions/CompChild/items/properties/stateValues`

## Version Note

The schemas linked above follow the JSON Schema Spec version: `http://json-schema.org/draft-07/schema#`
