# External Simulations
EMRALD can be loosely coupled with external solvers through a network messaging protocol. For example, EMRALD can provide direction to the Neutrino 3D fluid 
solver analysis module through an open-standard message sent through the XMPP messaging protocol.

Integrating an external simulation into the state diagram is done by defining variables for data to be sent between the codes along with "external sim message""
actions to start, modify and stop the other simulation from the EMRALD model. Any changes by the external simulation to variables inside EMRALD will automatically 
trigger any events that use that variable. So, for each component that can have a failure from the 3D simulation, the modeler must add a variable and an event
in the component's state diagram evaluating that variable to determine failure. The following describes the pieces required to make a model that couples to
an external simulation, the video [Two Way Coupling](https://www.youtube.com/watch?v=IgduGTaZGR8&list=PLX2nBoWRisnXWhC2LD9j4jV0iFzQbRcFX&index=7) also shows how test a model or the external simulation.

## Creating a New External Simulation
For any model connecting to an external simulation the first step is to create a reference for the connection. This is done
on the Left Navigation Frame, right-click External Sims. A dropdown menu will appear and click "New External Sim."<br>
<div style="width:300px">![New External Simulation Step 1](/images/Modeling/externalSims/NewExtSim.PNG)</div>

The External Simulation Editor window will open in the Modeling Area. Fill it out and press "OK."<br>
<div style="width:450px">![New External Simulation Step 2](/images/Modeling/externalSims/NewExtSim2.PNG)</div>

## Editing an External Simulation Link
On the Left Navigation Frame, expand the External Sims section. Either...

**Option 1:** Double click on the External Simulation that you want to edit or

**Option 2:** Right-click on the External Simulation that you want to edit. A dropdown menu will appear and click "Edit Properties...".<br>
<div style="width:300px">![Edit External Simulation Step 1](/images/Modeling/externalSims/EditExtSim.PNG)</div>

The External Simulation Editor window will open in the Modeling Area. Edit the fields as needed and press "OK."<br>
<div style="width:450px">![Edit External Simulation Step 2](/images/Modeling/externalSims/NewExtSim2.PNG)</div>

## Deleting an External Simulation Link
On the Left Navigation Frame, right-click on the individual external simulation and click on "Delete" in the menu that appears.<br>
<div style="width:300px">![Delete External Sim Step 1](/images/Modeling/externalSims/DeleteExtSim.PNG)</div>

A confirmation window will appear in the Modeling Area. Click "Yes."<br>
![Delete External Sim Step 2](/images/Modeling/externalSims/DeleteExtSim2.PNG)

The external simulation will be deleted and no longer be listed in the Left Navigation Frame.<br>
<div style="width:300px">![Delete External Sim Step 3](/images/Modeling/externalSims/DeleteExtSim3.PNG)</div>

## External Simulation Message Action
<!--Informational Note for Courtney: Most properties are here. Edit actions to link with external simulations in OpenSim page.-->
To incorporate an external simulation into your model, you must send a message to start the other simulation by adding a External Simulation Message Action 
when the simulation is to start up.

First make sure that the External Simulation Link is created first by following the steps in [Creating a New External Simulation](#creating-a-new-external-simulation). 

Open the Diagram you would like to incorporate an external simulation in. Locate the State you would like to add the action to and either right-click on the 
immediate action label or on the event you would like to add it to. Click "New Action". <br>
![New External Sim Action Step 1](/images/Modeling/externalSims/ExtSimAction.PNG)

An Action Properties window should appear in Modeling Area. To the right of "type:" click the field currently labeled "Transition" to expand the drop down menu. 
Click on "Ext. Sim Message."<br>
![New External Sim Action Step 2](/images/Modeling/externalSims/ExtSimAction2.PNG)

The fields in the bottom half of the Action Properties should have changed to look like the following. Each type of message requires the "External Sim" the message
will be sent to. 

::: tip Note 
There can be more than one external simulation for a model, but currently your model must not let more than one be "Started" and running in the EMRALD model execution at the same EMRALD simulation time. This capability will be added at a future time.
:::

![New External Sim Action Step 3](/images/Modeling/externalSims/ExtSimAction3.PNG)

The various actions available in the "Sim Action" dropdown menu will explained later. The focus now will be on **"Open Sim"** which allows sends a message to start 
the external simulation. To change the Sim Action to OpenSim, click the field currently labeled "Comp Modify" to expand the drop down menu. Click on "Open Sim." <br>
![New External Sim Action Step 4](/images/Modeling/externalSims/ExtSimAction4.PNG)

Next select your external simulation. To the right of "External Sim:" click the field to expand the drop down menu. Click on the external simulation you want to incorporate.<br>
![New External Sim Action Step 5](/images/Modeling/externalSims/ExtSimAction5.PNG)

Fill out the remaining fields with your desired specifications. "Model Reference" and "Config Data" are optional parameters sent to the simulation and will need
to be filled out according to the needs of the simulation. "Max Simulation Runtime" is also sent to the simulation as a safety quit time (relative to when this message was sent), 
but it is best to make sure the model stops the simulation at the appropriate time. and click "OK."<br>
![New External Sim Action Step 6](/images/Modeling/externalSims/ExtSimAction6.PNG)

Your action will now be listed in the state and section (Immediate or Event) you added it to.<br>
![New External Sim Action Step 7](/images/Modeling/externalSims/ExtSimAction7.PNG)

The External Simulation Message Action type can also perform other actions relating the external simulation. Those will be explained below.

### Comp Modify
This message sends the current value of the specified variable to the simulation. 
![Comp Modify Options](/images/Modeling/externalSims/CompModifyOptions.PNG)

### Cancel Sim
This message tells the simulation to stop running and should be sent when no more information from the external simulation is needed.
![Cancel Sim Options](/images/Modeling/externalSims/OtherExtSimOptions.PNG)

### Ping
This message is for testing. Could be used to tell the connected simulation to output a status.
![Ping Options](/images/Modeling/externalSims/PingOptions.PNG)

## Message Passing Modeling Requriements
- You must start with an "Open Sim" action message.
- You should send a "Cancel Sim" action message when it is no longer needed or before the EMRALD model hits a termination state.

## External Simulation Requriements
- The connected simulation must return a "SimStarted" message after it receives an "Open Sim" Message.
- The EMRALD simulation automatically sends callback times after it receives a "SimStarted" message or a "Timer" message. The connected simulation must send a "Timer" message
whenever the local time reaches the next specified callback time. Whenever it receives new callback times old ones must be removed. 
- The connected simulation must wait for a "Continue" message after sending any message to EMRALD.
- After receiving a "Cancel Sim" message the software must reset the model and be ready for another "Open Sim" message.

See [XMPP communication protocol](/guide/Modeling/xmppProtocol.md) for details on coupling code to EMRALD.
