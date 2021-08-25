# Demo Project

A demonstration project is loaded immediately upon opening EMRALD. </br>
![SamplePlantDiagram](/images/Modeling/diagrams/SamplePlantDiagram.PNG)

This project evaluates time it takes for a small or large radiological release due to a loss of offsite power (LOSP) of a nuclear plant to occur. The model starts in "Normal_Operations," stops any safety systems, then samples a failure rate for a LSOP. When in "LOSP," the safety systems start up again then three more events are evaluated: the Emergency Cooling System (ECS) can fail, the Containment Cooling System (CCS) and ECS can fail, or 24 hours can pass. The safety systems starting up are indicated by the moving to Start Systems state which also moves the model into the ECS Active state and the CCS Active state. Those evaluate logic trees made up of components represented by component diagrams to determine if the overall safety systems failed or not.

If ECS system fails, then the model will move to the small release key state.

If CCS system also fails, then the model will move to the large release state, it will override/leave the small release state and the simulation will end.

If the CCS system succeeded when the ECS system failed, the final event being evaluated, the 24 hour mission time passing, then the simulation will end in the small release state.

If neither system fails and therefore no release occurs, the final event being evaluated, the 24 hour mission time passing, will move the model back to normal operations and the model will cycle until either a small or large release occurs.

Upcoming sections of the documentation will detail how the model is set up to move between states via the events, transition actions, and other structures. The [Types of Diagrams](./diagrams.md#types-of-diagrams) section explains the dynamics of the component and system diagrams within the context of this demo project.

Below is a table outlining what acronyms used in diagram names, event names, or action names.
|Name|Description|
|---|---|
|LOSP|Loss of offsite power|
|ECS|Emergency Cooling System|
|CCS|Containment Cooling System|
|CKV|Check valve|
|MOV|Motor operated valve|
|PMP|Pump| 
|DGN|Diesel generator|
|S-TNK|Storage tank|
|FR|Fails to run|

<!--Copyright 2021 Battelle Energy Alliance-->