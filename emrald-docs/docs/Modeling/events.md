# Events
Events monitor for specified criteria and can have one or more actions that are executed when that criteria is met. There are two categories of events; conditional and time based, with different types in each category.

Actions executed by an event are state dependent, meaning that if the same event is in more than one state, the event can trigger different actions for each state. Multiple actions can also be assigned to a single event and each of these actions is executed if the event occurs. Finally, each event in a state has a flag that indicates if this state is to be exited if the event occurs.

## Creating a New Event 
**Option 1: For a specific diagram** <br>
Open the Diagram you would like your event to be in. Locate the State you would like to add the event to and right-click on the "Events" label. Click "New Event." <br> 
<img src="/images/Modeling/events/NewEvent1.png" alt="New Event Option 1 Step 1"><br>

**Option 2: For use in multiple diagrams** <br>
Although events can be created in a specific diagram, they can be used in any other diagram. It is best practice to create them using the "Global" tab in the left navigation panel.
Creating an event by right-clicking on the events tab marks the event so they will be listed in this tab. Drag and drop the event onto the "Events Actions" header of the desired state to add it as you would an existing event.
<img src="/images/Modeling/events/NewEventOpt2.png" alt="New Event Option 2 Step 1" style="width: 300px;"><br>

**Continued for both options**<br>
Fill out the dialogue box with the name, description, and type.
Depending on the type selected, different user options will be shown, see [Types of Events](#types-of-events) below. You can come back and change the event type later, but by changing the event type, all previous data saved for the event will be erased. 
Once the required and desired fields are filled out press "SAVE".<br>
<img src="/images/Modeling/events/NewEvent2.png" alt="New Event Step 2"><br>

The name cannot be the same as any existing event in the model. If it is, a window will pop up to notify you to choose another name.<br>
<img src="/images/Modeling/events/NewEvent3.png" alt="New Event Step 3"><br>

## Adding an Existing Event
In the Left Navigation Frame, locate the event you would like to re-use. Click and hold on to the event and drag it to the Event Actions section until it highlights green. Release your mouse.<br>

::: tip Note
Use the tabs to more easily find the desired event.
"Local" items were created in the current diagram.
"Global" were created from the side bar tab for use in any/all diagrams. 
"All" shows events for all the diagrams.
See [Modeling Pieces Tabs](./webUIOverview.md#modeling-pieces) in the Web User Interface page for more information. 
:::

<img src="/images/Modeling/events/AddExistingEvent1.png" alt="Add an Existing Event 1">
The event will appear in the Event Actions section.<br>
<img src="/images/Modeling/events/AddExistingEvent2.png" alt="Add an Existing Event 2">

## Editing an Event
**Option 1:** <br> 
On the Left Navigation Frame, click on the tab (All, Global, or Local) where your event is located. If you are not sure which tab, click on the All tab. Right-click on the event and click "Edit properties".<br>
<img src="/images/Modeling/events/EditEventOpt1.png" alt="Edit State Option 1 Step 1" style="width: 200px;">

The Event Editor window will open up in the Modeling Area. Make any necessary changes and click "SAVE"<br>
<img src="/images/Modeling/events/EditEventOpt1_2.png" alt="Edit State Option 1 Step 2" style="width: 450px;"><br>

**Option 2:** <br> 
Open the Diagram containing the event and locate the event. Right-click on the event and click "Event Properties".<br>
<img src="/images/Modeling/events/EditEventOpt2.png" alt="Edit State Option 2 Step 1">

The Event Editor window will open up in the modeling area. <br>
<img src="/images/Modeling/events/EditEventOpt2_2.png" alt="Edit State Option 2 Step 2">

**Continued for both options:**<br>
In the Event Editor window, the common fields amongst all event types are Name, Description, Type, and the option to Exit Parent state when event is triggered. Each will be described below.
- **Name:** Type the name of your event. This is how it will be shown and identified in the Left Navigation Frame and in diagrams. This is required.
- **Desc:** Type a description of your event. This is not required.
- **Exit Parent state when event is Triggered:**  Check the box to indicate if the state is to be exited after the event has been processed. If a state is exited then it no longer watches for the other events in the state. This field, if selected, is shown in the graphic by an icon on the right side of the event by a door with exit arrow. Arrows exiting actions under the event will be solid black if it is selected and dashed green if it is not exiting. This option will appear in the editor window only when editing in a Diagram (Option 2). </br>
<img src="/images/Modeling/events/ExitParentState.png" alt="Exit Parent State" style="width: 500px;">
- **Type:** If you decide to change the event type, the event data - besides the name and description - will be lost. The form will erase all stored data each time the event type is changed and saved. See [Types of Events](#types-of-events) for more information.

## Removing an Event
To remove an event from a particular state, but leave it in all others, right-click on the event and select "Remove Event". <br>
<img src="/images/Modeling/events/RemoveEvent.png" alt="Remove Event">

## Deleting an Event
**Option 1:** <br> 
On the Left Navigation Frame, click on the tab (All, Global, or Local) where your event is located. If you are not sure which tab, click on the All tab. Right-click on the event and click "Delete".<br>
<img src="/images/Modeling/events/DeleteEventOpt1.png" alt="Delete Event Option 1 Step 1" style="width: 250px;">

A confirmation window will appear in the Modeling Area. Click "DELETE".<br>
<img src="/images/Modeling/events/DeleteEventNotification.png" alt="Delete Event Option 1 Step 2"><br>

The event will be deleted from the entire model and no longer be listed in the Left Navigation Frame. To only remove it from this state, use "[Remove Event](#removing-an-event)" instead. <br>
<img src="/images/Modeling/events/DeleteEventOpt1_3.png" alt="Delete Event Option 1 Step 3" style="width: 200px;"><br>

**Option 2:** <br> 
Open the Diagram containing the event and locate the event. Right-click on the event and click "Delete Event".<br>
<img src="/images/Modeling/events/DeleteEventOpt2.png" alt="Delete Event Option 2 Step 1"><br>  

A confirmation window will appear in the Modeling Area. Click "Delete"<br>
<img src="/images/Modeling/events/DeleteEventNotification.png" alt="Delete Event Option 1 Step 2"><br>

<img src="/images/Modeling/events/DeleteEventOpt2_2.png" alt="Delete Event Option 2 Step 2"><br>
The event will no longer be listed in the state, will be deleted from the entire model, and no longer will be listed in the Left Navigation Frame. To only remove it from this state, use "[Remove Event](#removing-an-event)" instead. <br>
  
  
## Types of Events
There are two categories of events: conditional and time based. The type of event is indicated by an icon to the left of the name in the Event Actions section in the state. Those icons are included in the title of the respective section as well as in the [Icons: Events](./icons.md#events) section.<br>
<img src="/images/Modeling/events/EventIconLocation.png" alt="Event Icon Location" style="width: 200px;">

To define the type of event, click the dropdown menu in the Event Editor then click the desired event type.<br> 
<img src="/images/Modeling/events/EventTypeDropdownMenu.png" alt="Event Type Dropdown Menu" style="width: 500px;"> 
  
The options and fields below will change accordingly. The options and fields specific to each event type will be explained in their respective section below. Note that you can come back to edit the event and change the event type, but it will clear all data associated with the event besides the name and description. <br>

## Conditional Events
<h3>Variable Condition <img src="/images/Modeling/events/varCond.png" alt="Variable Condition" width="25"/></h3>  
Listed as Var Condition in the dropdown menu. Monitors variable values with user-defined code to determine event execution.</br>
<img src="/images/Modeling/events/VarConditionOptions.png" alt="Var Condition" style="width: 500px;"><br>  

- **Evaluate Code (c#):** Type or copy and paste into this text field the C# code to evaluate to determine if this event is triggered. This must return a boolean true or false value.
  - **Variables used in code:** A list of variables available in the model. Pre-existing variables such as CurTime are auto checked and always available. See [Dynamic Scripts](./backendInfo.md#dynamic-scripts) for more information. It will include the all of the variables that you create and are listed in the "All" Tab of the Left Navigation Frame. Click the check box to identify which variables are used in the code.

  
<h3>State Change <img src="/images/Modeling/events/stateChange.png" alt="State Change" width="25"/></h3>
  Monitors when entering or exiting a specified state to determine event execution.<br>

<img src="/images/Modeling/events/StateChangeOptions.png" alt="State Change Options" width="500"/>

  - **Enter State/Exit State:** Select "On Enter State/s" if you would like the event to be triggered when the states listed in the event are entered. Select "On Exit State/s" if you would like the event to be triggered when the states listed in the event are exited.
  - **All Items:** Check this box to require all states listed to be entered or exited in order for the event to trigger. Leave it unchecked if entering or exiting only one of the states is required to trigger the event.
  - **States:** The list of states that you would like to monitor. To populate the list, drag existing states from the Left Navigation Frame to this list.

  In the Left Navigation Frame, locate the state you would like to monitor. Click and hold on to the event and drag it to the States list title until the row highlights green and release your mouse.<br> 
  <img src="/images/Modeling/events/StateToStateChangeEvent1.png" alt="Add a State to the list Step 1"/>

  The event will appear in the States list.<br>
  <img src="/images/Modeling/events/StateToStateChangeEvent2.png" alt="Add a State to the list Step 2"/>

<h3>Component Logic <img src="/images/Modeling/events/compLogic.png" alt="Component Logic" width="25"/></h3>
  Evaluates a logic model of component diagrams to determine event execution.<br>
  
  <img src="/images/Modeling/events/ComponentLogicOptions.png" alt="Component Logic Options" width="500"/>

  - **Success Tree:** Success Tree or Failure Tree selection indicates whether to treat the tree linked to the event as a success tree or failure tree. (For failure trees Boolean values for states are swapped)
  - **Trigger on False:** This indicates whether the event should trigger on true or false.
  - **Logic Top:** Click the field to expand the dropdown menu containing all of your Logic Trees. Click on the Logic Tree you would like evaluated when the event is triggered.
  
<h3>External Simulation <img src="/images/Modeling/events/ExtInput.png" alt="External Simulation" width="25"/></h3>
  Listed as Ext. Simulation in the dropdown menu. This event is triggered when the assigned variable is modified by and external simulation and the evaluation code returns true.<br>

  For example, you want to trigger the event when a tank is over 2 meters full so you have created a new "Ext Sim Variable" named "Height" to monitor the tank fill height. When "Height" gets modified by the external simulation, you would put the code "return Height > 2;". See [External Simulation Variables](./variables.md#external-simulation-variables) for more information.<br>

<img src="/images/Modeling/events/ExternalSimOptions.png" alt="External Simulation Options" width="500"/>

  - **External Sim Variable:** Click the field to expand the drop down menu of external simulation variables you created in the model. Select the one that will change when this event could be triggered. One must be selected in order to create the event. 
  - **Evaluate Code (C#):** Type or copy and paste into this text field the C# code to evaluate to determine if this event is triggered. This must return a boolean true or false value.
  - **Variables used in code:** A list of other variables available in the model for use in evaluating the code. Pre-existing variables such as CurTime are auto checked and always available. See [Dynamic Scripts](./backendInfo.md#dynamic-scripts) for more information. It will include the all of the variables that you create and are listed in the "All" Tab of the Left Navigation Frame. Check box to identify which variables are used in the code.

## Time-based Events

  <h3>Persistent Events</h3>
  Time-based events have the option to be "persistent", meaning they will retain their time after the state is exited if the event wasn't triggered.<br>
  
  For example, let's say a state has two timer events, Timer A for an hour and Timer B for a day, both of which trigger an exit. Once the state is entered, Timer A will trigger after an hour, causing the state to exit. If Timer B is not a persistent event, then it will start timing from 0 hours the next time it is in an active state. However, if Timer B is a persistent event, then it will start counting from 1 hour the next time it is in an active state.  

  **insert picture here**

  Note: If a persistent event is dependent on an user-defined variable, and the variable changes, then the event cannot adjust its timing, only resample and ignore based on the updated variable. Additionally, the event must be in an active state while the variable changes.

  <h3>Timer <img src="/images/Modeling/events/alarm.png" alt="Timer" width="25"/></h3>
  Monitors the time after entering the parent state against the user specified or sampled time. This can be set to a static value or to a variable value. The fields will change form depending on what type of value you are setting it to. Leave the checkbox next to "Use Variable?" blank to set a static value or check it to use a variable value.<br>
  
  #### Static Value Timer
  <img src="/images/Modeling/events/TimerStaticOptions.png" alt="Timer Static Options" width="500"/>

  - **Duration:** Enter the amount of model time to pass after entering this state before the event actions are triggered. The first box is the number of days, the second is the number of hours, the third is the number of minutes, and the fourth is the number of seconds. Values can only be integers.

  #### Variable Value Timer
  <img src="/images/Modeling/events/TimerVarOptions1.png" alt="Timer Variable Options 1" width="500"/>
  <img src="/images/Modeling/events/TimerVarOptions2.png" alt="Timer Variable Options 2" width="500"/>

  - **Time Span:** Enter the amount of model time to pass after entering this state before the event actions are triggered. The first field is the variable value you would like to use. The second field is the time unit you would like to use. Click the field to reveal the dropdown menu of options then click your desired selection to set it.

<h3>Failure Rate <img src="/images/Modeling/events/dice.png" alt="Failure Rate" width="25"/></h3>
  Samples a given probability of failure [P(t) = 1-e^(-lambda*t)] to determine the time (t) of this event. The lambda or frequency value can be set to a static value or to a variable value. The lambda/frequency field will change form slightly depending on what type of value you are setting it to. Leave the checkbox next to "Use Variable Lambda/Frequency?" blank to set a static value or check it to use a variable value. Once sampled, this event will not sample again until the parent state is exited and re-entered. <br>
  
  #### Static Failure Rate
  <img src="/images/Modeling/events/FailureRateOptions1.png" alt="Failure Rate Options" width="500"/>

  #### Variable Failure Rate
  <img src="/images/Modeling/events/FailureRateOptions2.png" alt="Failure Rate Options" width="500"/>

  - **Lambda/Freq:** The frequency (instances) of this event occurring per the time rate defined. Likely a decimal value like 0.0003. If you choose to have it as a static value, checkbox unchecked, type in the value into the field. If you choose to have it as a variable value, checkbox checked, click the field to reveal the dropdown menu of variables available in your model and click the variable to set it.
  - **Time Rate:** Enter the time rate that the frequency is sampled over. The first box is the number of days, the second is the number of hours, the third is the number of minutes, and the fourth is the number of seconds. For example, for an hourly failure rate, days=0, hours=1, minutes=0, and seconds=0. Values can only be integers.

<h3>Distribution <img src="/images/Modeling/events/dist.png" alt="Normal Distribution" width="25"/></h3>
Depending on the type of distribution selected, parameters are set to determine a variable, which in turn will determine when the event occurs. For each required parameter, there is a box for the time rate next to it. You can choose the time units for the parameter, or you can leave it on default, and use the default time unit. The default time rate is also changeable. Once sampled, this event will not sample again until the parent state is exited and re-entered. 
<h4>Normal Distribution </h4>
  Listed as Normal Distribution in the Distribution Type dropdown menu. Samples a normal distribution according to user specified parameters for when this event will occur from the time entering the state
  <br><br>
  <img src="/images/Modeling/events/NormalDistributionOptions.png" alt="Normal Distribution Options" width="500"/>
<br>

  - **Mean:** Enter the value of the mean.
  - **Standard Deviation:** Enter the value of the standard deviation.
  - **Minimum:** Enter the minimum value of the function, if a sampling returns a value less than this, then this time will be used. (Typically zero as you can't take no time to do something.)
  - **Maximum:** Enter the maximum value of the function, if a sampling returns a value greater than this, then this time will be used. 

<h4>Exponential Distribution </h4>
  Samples an exponential distribution according to user specified parameters to generate a value for when this event will occur from the time entering the state.<br>
  
  <img src="/images/Modeling/events/ExponentialDistributionOptions.png" alt="Exponential Distribution Options" width="500"/>
<br>

  - **Rate:** Enter the value of the rate. To the right of the value is a dropdown menu which includes various time units. Click the dropdown menu to expand it and click the unit you would like to use for that value.

<h4>Weibull Distribution</h4>
  Samples a Weibull distribution according to user specified parameters to generate a value for when this event will occur from the time entering the state.<br>

<img src="/images/Modeling/events/WeibullDistributionOptions.png" alt="Weibull Distribution Options" width="500"/>

  - **Shape:** Enter the value of the shape.
  - **Scale:** Enter the value of the scale.
  - **Time Scale:** Click the dropdown menu to expand it and click the unit you would like to use for this distribution. 


<h4>Log Normal Distribution </h4>

  Listed as LogNorm. Distribution in the dropdown menu. Samples a log-normal distribution according to user specified parameters to generate a value for when this event will occur from the time entering the state.<br>
  
  <img src="/images/Modeling/events/LogNormalDistributionOptions.png" alt="Normal Distribution Options" width="500"/>
<br>

  - **Mean:** Enter the value of the mean.
  - **Standard Deviation:** Enter the value of the standard deviation.
  - **Minimum:** Enter the minimum value of the function, if a sampling returns a value less than this, then this time will be used. (Typically zero as you can't take no time to do something.)
  - **Maximum:** Enter the maximum value of the function, if a sampling returns a value greater than this, then this time will be used. 

<h4>Uniform Distribution</h4>
  This option samples a uniform distribution. It is listed as Uniform Distribution in the drop down menu.<br>
  <br>

  <img src="/images/Modeling/events/UniformDistributionOptions.png" alt="Uniform Distribution Options" width="500">
  <br>

  - **Minimum:** Enter the minimum value of the function, if a sampling returns a value less than this, then this time will be used. (Typically zero as you can't take no time to do something.)
  - **Maximum:** Enter the maximum value of the function, if a sampling returns a value greater than this, then this time will be used. 

<h4>Triangular Distribution </h4>
  <p>This option samples a triangular distribution given a peak, minimum, and maximum values to generate a value of when the event occurs.</p>

  <img src="/images/Modeling/events/TriangularDistributionOptions.png" alt="Uniform Distribution Options" width="500">

  - **Peak:** Enter the value of the peak (mode) of the distribution. This is the most likely value that can be sampled.
  - **Minimum:** Enter the minimum value of the function. If a sampling returns a value less than this, then this time will be used.
  - **Maximum:** Enter the maximum value of the function. If a sampling returns a value greater than this, then this time will be used.


<h4>Gamma Distribution </h4>
  <p>This option samples a gamma distribution given an indicated shape, rate, minimu
  m, and maximum values to generate a value of when the event occurs.</p>

  <img src="/images/Modeling/events/GammaDistributionOptions.png" alt="Uniform Distribution Options" width="500">

  - **Shape (Alpha):** Enter the value of the shape parameter (alpha), which determines the shape of the distribution.
  - **Rate (Inverse Scale):** Enter the value of the rate parameter (beta), which is the inverse of the scale. This parameter affects the spread of the distribution.
  - **Minimum:** Enter the minimum value of the function. If a sampling returns a value less than this, then this time will be used.
  - **Maximum:** Enter the maximum value of the function. If a sampling returns a value greater than this, then this time will be used.

<h4>Gompertz Distribution </h4>
  <p>This option samples a Gompertz distribution given a shape, scale, minimum, and maximum values to generate a value of when the event occurs.</p>

  <img src="/images/Modeling/events/GompertzDistributionOptions.png" alt="Uniform Distribution Options" width="500">

  - **Shape (Eta):** Enter the value of the shape parameter (eta), which determines the growth rate of the distribution.
  - **Scale (Beta):** Enter the value of the scale parameter (beta), which affects the spread of the distribution.
  - **Minimum:** Enter the minimum value of the function. If a sampling returns a value less than this, then this time will be used.
  - **Maximum:** Enter the maximum value of the function. If a sampling returns a value greater than this, then this time will be used.

<!--Copyright 2021 Battelle Energy Alliance-->

