# Actions
Actions change the properties or cause movement though a model during a simulation run. The current types of actions are explained in the following sections but with the expandable design of EMRALD, additional or customized actions may be added.

## Immediate and Event Actions
<img src="/images/Modeling/actions/ImmediateEventActions.png" alt="Immediate and Event Actions" width="250"/>

Actions that are triggered immediately are listed in the **Immediate Actions** section. Actions that are triggered upon completion of an event are listed under their associated event in the **Event Actions** section.

## Creating a New Action

**Option 1:** <br>
Open the Diagram you would like your action to be in. Locate the State you would like to add the action to and either right-click on the immediate action label or on the event you would like to add it to. Click "New Action". <br>
![New Action 1_1](/images/Modeling/actions/NewAction1.png)

Fill out the dialogue box and press "SAVE". A description is optional.
![New Action 2](/images/Modeling/actions/NewAction2.png) See [Types of Actions](#types-of-actions) for detailed description of dialogue box options for each type of action.

The action name cannot be the same as any existing action in the model. If it is, an error message will appear notifying you to choose another name.<br>
![New Action 3](/images/Modeling/actions/NewAction3.png)<br>

The action will appear in the Immediate Actions list or Event that you initially clicked in. <br>
![New Action 4_1](/images/Modeling/actions/NewAction4_1.png)<br>

**Option 2:** <br>
Click on the Global tab in the Left Navigation Frame Modeling Pieces Tabs. The descriptor for each section under the tab should have changed to Global.<br>
![New Action 1_2](/images/Modeling/webUIOverview/GlobalTabs.png)

Then right click on Global Actions. A dropdown menu will appear, click on "New Action". <br>
![New Action 2_2](/images/Modeling/actions/NewAction2_2.png)

Fill out the dialogue box and press "SAVE". A description is optional.
![New Action 3_2](/images/Modeling/actions/NewAction3_2.png) 

See [Types of Actions](#types-of-actions) for detailed description of dialogue box options for each type of action.

The action will appear in the Global Actions list. <br>
![New Action 4_2](/images/Modeling/actions/NewAction4_2.png)<br>

## Adding an Existing Action

In the Left Navigation Frame, locate the action you would like to re-use. Click and hold on to the action and drag it to the Event Actions section until a plus symbol shows and release your mouse.<br>
![Add an Existing Action 1](/images/Modeling/actions/AddExistingAction1.png)

The event will appear in the Event Actions section.<br>
![Add an Existing Action 2](/images/Modeling/actions/AddExistingAction2.png)

You can also add an action in this way to the Immediate Actions section. You would just instead drag it to the Immediate Actions section and it would appear there.

## Editing an Action
**Option 1:** <br>
On the Left Navigation Frame, click on the tab (All, Global, or Local) where your action is located. If you are not sure which tab, click on the All tab. Right-click on the action and click "Edit Properties".<br>
<img src="/images/Modeling/actions/EditActionOpt1.png" style="width:300px;">


The Action Properties window should appear in the Modeling Area.<br>
<img src="/images/Modeling/actions/EditActionOpt1_2.png" style="width:300px;">


**Option 2:** <br>
Open the Diagram containing the action and locate the action. Right-click on the action and click "Action Properties".<br>
![Edit an Action Option 2](/images/Modeling/actions/EditActionOpt2.png)

The Action Properties window should appear in the Diagram Window.<br>
![Edit an Action Option 2 Step 2](/images/Modeling/actions/EditActionOpt2_2.png)

## Removing an Action

 Open the Diagram containing the action and locate the action. Right-click on the action and click "Remove Action". Use caution when removing because no confirmation window will appear. <br>
![Removing an Action in a State](/images/Modeling/actions/RemoveAction1_1.png)

The action will no longer be listed in the state but will still be listed in the Left Navigation Frame. It was only removed from that instance, not the model. It will only be removed from the Left Navigation Frame if it was the only instance in the entire model. <br>
![Removing an Action in a State Step 2](/images/Modeling/actions/RemoveAction1_2.png)

## Deleting an Action
**Option 1:** <br>
On the Left Navigation Frame, click on the tab (All, Global, or Local) where your event is located. If you are not sure which tab, click on the All tab. Right-click on the action and click "Delete".<br> 
<img src="/images/Modeling/actions/DeleteActionInList.png" style="width:300px;">
<br>

A confirmation window will appear in the Modeling Area. Click "DELETE." <br>
![Delete Action Option 1 Step 2](/images/Modeling/actions/DeleteActionInList_2.png)<br>

The action will be deleted from the entire model and no longer be listed in the Left Navigation Frame. <br>
<img src="/images/Modeling/actions/DeleteActionInList_3.png" style="width:200px;">
<br>

**Option 2:**

 Open the Diagram containing the action and locate the action. Right-click on the action and click "Delete Action".<br>
![Deleting an Action in a State](/images/Modeling/actions/DeleteActionInState.png)

A confirmation window will appear in the Modeling Area. Click "DELETE." <br>
![Delete Action Option 1 Step 2](/images/Modeling/actions/DeleteActionInList_2.png)<br>

The action will no longer be listed in the state and will no longer be listed in the Left Navigation Frame. <br>
![Delete an Action in a State Step 2](/images/Modeling/actions/DeleteActionInState_2.png)</br>
Use "[Remove Action](#removing-an-action)" to just remove it from the selected state.

## Types of Actions

<h3>Transition <img src="/images/Modeling/actions/TransitionArrow.png" alt="Transition" width="25"/></h3>

A transition action always adds the state it references to the current state list, meaning that it is now in that state during the simulation. If the event is marked as "Exit" when it occurs, (See [State Properties](./states.md#state-properties) and [Editing an Event](./events.md#editing-an-event) for more information) then the model is
moving from the one state to the other. A solid black arrow indicates moving, and a dashed green indicated adding to the current states. A transition action in 
the "Immediate Actions" list (See [Immediate and Event Actions](#immediate-and-event-actions) for more information) will always be adding to the current states because there is no event with an exit property and it would be bad modeling to exit a state immediately after entering, making it possible for other immediate actions to not be executed.

<img src="/images/Modeling/actions/TransitionActionOptions.png" alt="Transition Action Options" width="500"/>

- **Mutually Exclusive:** Check this box if you would like the action to transition to one and only one of the states in the list. If not checked, all destinations must either 
add up to 100% or use "Remaining" on the last destination and one of the destinations will be sampled. If checked, then multiple or no destinations could be added 
to the current state list. A sample is taken for each item and all the destinations that meet the stated probability are chosen.  
- **State Table:** 
To add a new destination state, go to the Left Navigation Window, click and hold on to the desired state and drag it to the table until a plus symbol shows and release your mouse.<br>
![Add a State to an Action 1](/images/Modeling/actions/StateToAction1.png)

The state will be listed in the table.<br>
![Add a State to an Action 2](/images/Modeling/actions/StateToAction2.png)

Then fill in the probability. 
You can either fill in a constant value from 0.0 to 1.0 in the second column or you can choose a variable probability in the third column by clicking the field then 
clicking the variable you want to define the probability. The variable allows you to dynamically change the rate according to other conditions, but if the variable
changes after entering the state, a new sample will not be made.

<h3>Change Variable Value <img src="/images/Modeling/actions/varCond.png" alt="Change Variable Value" width="25"/></h3>  
Listed as "Change Var Value" in the dropdown menu. This action changes the value of a variable according to a user defined script.

<img src="/images/Modeling/actions/ChangeVarValueOptions.png" alt="Change Variable Value Options" width="500"/>

- **Variable:** Click the field to expand the drop down menu of variables you created in the model. Click on the variable to be updated. 
The value returned by the script is assigned to the variable, so one must be selected in order to create the event. 
- **New Value Code (c#):** Type or copy and paste into this text field. The script must have a return value and that value must be the
same type as the assigned variable or an error will occur. Other variables from the code can be used in the script if marked in the Variables section.
- **Variables used in code:** A list of variables available in the model. Pre-existing variables such as CurTime are auto checked and always available. See [Dynamic Scripts](./backendInfo.md#dynamic-scripts) for more information. It will include all of the variables that you create and are listed in the "All" Tab of the Left Navigation Frame. Click the check box to identify which variables are used in the code. Do not click the check box for the variable that is being updated even if it is used in the code. It only needs to be selected from the "Variable" dropdown menu.

<h3>External Simulation Message <img src="/images/Modeling/actions/extSim.png" alt="External Simulation Message" width="25"/></h3>  

Listed as "Ext. Sim Message" in the dropdown menu. This action sends a message to an external code through coupled communication messaging protocol. See [XMPP Protocol](./xmppProtocol.md#xmpp-protocol) for details on coupling code to EMRALD.

<img src="/images/Modeling/actions/ExtSimMessageOptions.png" alt="External Simulation Message Options" width="500"/>

See [External Simulation Message Action](./externalSims.md#external-simulation-message-action) for more information.

<h3>Run Application <img src="/images/Modeling/actions/cogwheel.png" alt="Run Application" width="25"/></h3>  
Runs user defined scripts to both execute an external piece of code and process the results to direct state changes.</br>

<img src="/images/Modeling/actions/RunApplicationOptions.png" alt="Run Application Options" width="500"/>

- **Preprocess Code (C#):** Type or copy and paste into this text field the C# code you would like to be executed before the executable is started when this action is triggered. 
this code must return a string and this string is passed as parameters on end of executable being run. For example if you are running notepad you could 
return "c:/somepath/file.txt" to open a specific file.
- **Executable Location:** Type or copy and paste into this text field the path to the executable.
- **Return Type:** The type of process for returning data from the executable. Options are "None" and "State List". If a value other than "None" is selected, the Postprocess Code section will be shown (see below).
- **Postprocess Code (C#):** Type or copy and paste into this text field the C# code you would like to be executed after the executable is finished.
If the "State List" return type is selected, this code typically processes the results of the executable and determines what to do because of them. It must return a list of states to enter or exit.
It is recommened that you use a C# compiler to test and debug code before entering it. See the video [Coupling an Executable](https://www.youtube.com/watch?v=SZzNcougc9k&list=PLX2nBoWRisnXWhC2LD9j4jV0iFzQbRcFX&index=6) for detailed instructions and an example.
- **Variables used in code:**  A list of variables available in the model. Click the check box to identify which variables are used in the code.
Pre-existing variables such as CurTime are auto checked and always available. See [Dynamic Scripts](./backendInfo.md#dynamic-scripts) for more information. It will include the all of the variables that you create and are listed in the "All" Tab of the Left Navigation Frame. 

## Summary of Icons
Below is a table of icons that either identify the type of action (left hand side of action item) or identify the status of an action (right hand side of action item).

|<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
|---|---|
|**Action Type**| |
|<div style="width:25px">![Transition](/images/Modeling/actions/TransitionArrow.png)</div>|Transition Action|
|<div style="width:25px">![Change Variable Value](/images/Modeling/actions/varCond.png)</div>|Change Variable Value Action|
|<div style="width:25px">![External Simulation Message](/images/Modeling/actions/extSim.png)</div>|External Simulation Message Action|
|![Run Application](/images/Modeling/actions/cogwheel.png)|Run Application Action|
|**Status Icons**| |
|![Arrow Icon](/images/Modeling/actions/connector.gif)|This click and drag from this icon to connect the action to a state.|
|![Link Icon](/images/Modeling/actions/link.png)|This icon appears instead of an arrow, when the transition goes to a state not in the current diagram.|


<!-- |<div style="width:20px">![Missing Information Action Icon](/images/Modeling/actions/questionOrange.png)</div>|This icon appears when the action is not fully defined|
|![Red X Icon](/images/Modeling/actions/delete2.png)|This icon appears when there is an error with the item. Hover over name (not the X) to see a description of the error.| -->
<!--Copyright 2021 Battelle Energy Alliance-->