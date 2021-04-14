# Events
  Events monitor for specified criteria and can have one or more actions that are executed when that criteria is met. There are two categories of events; conditional and time based, with different types in each category.

  Actions executed by an event are state dependent, meaning that if the same event is in more than one state, the event can trigger different actions for each state. Multiple actions can also be assigned to a single event and each of these actions is executed if the event occurs. Finally, each event in a state has a flag that indicates if this state is to be exited if the event occurs.

## Creating a New Event 
**Option 1: For a specific diagram** <br>
  Open the Diagram you would like your event to be in. Locate the State you would like to add the event to and right click on the "Events" label. Click "New Event." <br> 
  ![New Event Option 1 Step 1](/images/Modeling/events/NewEvent1.PNG)<br>

**Option 2: For use in multiple diagrams** <br>
  Although events created in a specific diagram, they can be used in any other diagram, it is a best practice to create them using the "Global" tab in the left navigation panel.
  Creating an event by right clicking on the events tab marks the event so they will be listed in this tab. Drag and drop the event onto the "Events Actions" header of the desired state to add it as you would an existing event.
  <div style="width:300px">![New Event Option 2 Step 1](/images/Modeling/events/NewEventOpt2.PNG)</div><br>
  

**Continued for both options**<br>
  Fill out the dialogue box with the name, description and type. Once a type has been chosen and the event saved, the type cannot be changed.
  Depending on the type selected, different user options will be shown, see [Types of Events](#types-of-events) below. 
  Once the required and desired fields are filled out press "OK".<br>
  ![New Event Step 2](/images/Modeling/events/NewEvent2.PNG)<br>

  The name cannot be the same as any existing event in the model. If it is, a window will pop up to notify you to choose another name.<br>
  ![New Event Step 3](/images/Modeling/events/NewEvent3.PNG)<br>


## Adding an Existing Event
  In the Left Navigation Frame, locate the event you would like to re-use. Click and hold on to the event and drag it to the Event Actions section until a plus symbol shows and release your mouse.<br>

  ::: tip Note
  Use the tabs to more easily find the desired event.
  "Local" items were created in the current diagram.
  "Global" were created from the side bar tab for use in all multiple diagrams. 
  "All" shows events for all the diagrams
  See [Modeling Pieces Tabs](./webUIOverview.md#modeling-pieces) in the Web User Interface page for more information. 
  :::

  ![Add an Existing Event 1](/images/Modeling/events/AddExistingEvent1.PNG)

  The event will appear in the Event Actions section.<br>
  ![Add an Existing Event 2](/images/Modeling/events/AddExistingEvent2.PNG)

## Editing an Event
**Option 1:** <br> 
  On the Left Navigation Frame, click on the tab (All, Global, or Local) where your event is located. If you are not sure which tab, click on the All tab. Right click on the event and click "Edit properties...".<br>
  <div style="width:200px">![Edit State Option 1 Step 1](/images/Modeling/events/EditEventOpt1.PNG)</div>

  The Event Editor window will open up in the Modeling Area. <br>
  <div style="width:450px">![Edit State Option 1 Step 2](/images/Modeling/events/EditEventOpt1_2.PNG)</div><br>

**Option 2:** <br> 
  Open the Diagram containing the event and locate the event. Right click on the event and click "Event Properties...".<br>
  ![Edit State Option 2 Step 1](/images/Modeling/events/EditEventOpt2.PNG)

  The Event Editor window will open up in the diagram window. <br>
  ![Edit State Option 2 Step 2](/images/Modeling/events/EditEventOpt2_2.PNG)

**Continued for both options:**<br>
  In the Event Editor window, the common fields amongst all event types are Name, Description, Type, and the option to Exit Parent state when event is triggered. Each will be described below.
  - **Name:** Type the name of your event. This is how it will be shown and identified in the Left Navigation Frame and in diagrams. This is required.
  - **Desc:** Type a description of your event. This is not required.
  - **Exit Parent state when event is Triggered:** Click this box to check it on meaning that the model will be forced to exit the state once the event is triggered.
  - **Type:** Choosing the event type can only be done while creating the event. Once it is saved, the "Type:" field cannot be changed and will be grayed out. See [Types of Events](#types-of-events) for more information.

## Removing an Event
  To remove an event from a particular state, but leave it in all others, right click on the event and select "Remove Event". <br>
  ![Remove Event](/images/Modeling/events/RemoveEvent.PNG)

## Deleting an Event
**Option 1:** <br> 
  On the Left Navigation Frame, click on the tab (All, Global, or Local) where your event is located. If you are not sure which tab, click on the All tab. Right click on the event and click "Delete".<br>
  <div style="width:250px">![Delete Event Option 1 Step 1](/images/Modeling/events/DeleteEventOpt1.PNG)</div>

  A confirmation window will appear in the Modeling Area. Click "Yes."<br>
  ![Delete Event Option 1 Step 2](/images/Modeling/events/DeleteEventOpt1_2.PNG)<br>

  The event will be deleted from the entire model and no longer be listed in the Left Navigation Frame, to only remove it from this state, use "Remove Event" instead. <br>
  <div style="width:200px">![Delete Event Option 1 Step 3](/images/Modeling/events/DeleteEventOpt1_3.PNG)</div><br>

**Option 2:** <br> 
  Open the Diagram containing the event and locate the event. Right click on the event and click "Delete Event". Use caution when deleting because no confirmation window will appear.<br>
  ![Delete Event Option 2 Step 1](/images/Modeling/events/DeleteEventOpt2.PNG)<br>  
  ![Delete Event Option 2 Step 2](/images/Modeling/events/DeleteEventOpt2_2.PNG)<br>
  The event will no longer be listed in the state and will be deleted from the entire model and no longer be listed in the Left Navigation Frame, to only remove it from this state, use "Remove Event" instead. <br>
  
  
## Types of Events
  There are two categories of events: conditional and time based. The type of event is indicated by an icon to the left of the name in the Event Actions section in the state. Those icons are included in the title of the respective section as well as in the [Icons: Events](./icons.md#events) section.<br>
  <div style="width:200px">![Event Icon Location](/images/Modeling/events/EventIconLocation.PNG)</div>

  To define the type of event, click the "dropdown menu in the Event Editor the click the desired event type.<br> 
  <div style="width:500px">![Event Type Dropdown Menu](/images/Modeling/events/EventTypeDropdownMenu.PNG)</div> 
  
  The options and fields below will change accordingly. The options and fields specific to each event type will be explained in their respective section below. Note that choosing the event type can only be done while creating the event. Once it is saved, the "Type:" field cannot be changed and will be grayed out.<br>
  <div style="width:500px">![Event Type Grayed](/images/Modeling/events/EventTypeGrayed.PNG)</div>

  The check box "Exit parent state when event is triggered" indicates if the state is to be exited after the event has been processed. If a state is exited then it no longer watches for the other events in the state. This field, if selected, is shown in the graphic by an icon on the right side of the event by a door with exit arrow. Arrows exiting actions under the event will be solid black if it is selected and dashed green if it is not exiting.
  <div style="width:500px">![Exit Parent State](/images/Modeling/events/ExitParentState.PNG)</div>

<!-- TODO Courtney add a Picture for above field 
Completed -Courtney -12/7/2020-->

## Conditional Events
<h3>Variable Condition <img src="/images/Modeling/events/varCond.PNG" alt="Variable Condition" width="25"/></h3>  
  Listed as Var Condition in the dropdown menu. Monitors variable values with user-defined code to determine event execution.<br>
  
<!-- TODO Courtney, Please update picture below to have a small piece of code, "return FillLevel > 3.5;" and a couple variables 
Completed -Courtney -12/7/2020-->
  ![Variable Condition Options](/images/Modeling/events/VarConditionOptions.PNG)
  - **Evaluate Code (c#):** Type or copy and paste into this text field the C# code to evaluate to determine if this event is triggered. This must return a "bool" true or false value.
  - **Variables used in code:** A list of variables available in the model. This list will not include pre-existing variables such as CurTime. See [Pre-existing Variables](./variables.md#pre-existing-variables) for a full list of pre-existing variables. It will include the all of the variables that you create and are listed in the "All" Tab of the Left Navigation Frame. Click the check box to identify which variables are used in the code.

  
<h3>State Change <img src="/images/Modeling/events/stateChange.PNG" alt="State Change" width="25"/></h3>
  Monitors when entering or exiting a specified state to determine event execution.<br>

<!-- TODO Courtney, Please update picture below to have an item in the states list 
Completed -Courtney -12/7/2020-->
  ![State Change Options](/images/Modeling/events/StateChangeOptions.PNG)
  - **Enter State/Exit State:** Select "Enter state" if you would like the event to be triggered when the states listed in the event are entered. Select "Exit state" if you would like the event to be triggered when the states listed in the event are exited.
  - **All Items:** Click this box to check it if you want to require all states listed to be entered or exited in order for the event to trigger.
  - **States:** The list of states that you would like to monitor. To populate the list, drag existing states from the Left Navigation Frame to this list.

  In the Left Navigation Frame, locate the state you would like to monitor. Click and hold on to the event and drag it to the States list title until a plus symbol shows and release your mouse.<br> 
  ![Add a State to the list Step 1](/images/Modeling/events/StatetoStateChangeEvent1.PNG)

  The event will appear in the States list.<br>
  ![Add a State to the list Step 1](/images/Modeling/events/StatetoStateChangeEvent2.PNG)

<!-- TODO Courtney, Link above doesn't seem to work Got rid of this section. Putting what would have been in it directly in this section. 

See [Adding a State to a State Change Event](#adding-a-state-to-a-state-change-event) for more information.

Completed -Courtney -12/7/2020-->

<h3>Component Logic <img src="/images/Modeling/events/compLogic.PNG" alt="Component Logic" width="25"/></h3>
  Evaluates a logic model of component diagrams to determine event execution.<br>
  
  ![Component Logic Options](/images/Modeling/events/ComponentLogicOptions.PNG)
  - **On Success:** Click to check this box if you want to trigger the event upon success of the Logic Tree evaluation, default is failure of the logic tree. 
  - **Logic Top:** Click the field to expand the dropdown menu containing all of your Logic Trees. Click on the Logic Tree you would like evaluated when the event is trigger.
  
<!-- TODO icon below updated, should be ExtInput.png
Completed -Courtney -12/3/2020-->
<h3>External Simulation <img src="/images/Modeling/events/ExtInput.PNG" alt="External Simulation" width="25"/></h3>
  Listed as Ext. Simulation in the dropdown menu. This event is triggered when the assigned variable is modified by and external simulation and the evaluation code returns true.<br>

  For example, if you want to trigger the event when a tank is > 2 meters full, and you have created a new "Ext Sim Variable" named "Height" when "Height" gets modified by the external simulation, you would put the code "return Height > 2;". See [External Simulation Variables](./variables.md#external-simulation-variables) for more information.<br>
<!-- TODO Courtney Add a link to the ExtS Sim Variable section in the above text
Completed -Courtney -12/7/2020-->

  ![External Simulation Options](/images/Modeling/events/ExternalSimOptions.PNG)
  - **External Sim Variable:** Click the field to expand the drop down menu of external simulation variables you created in the model. Select the one that will change when this event could be triggered. One must be selected in order to create the event. 
  - **Evaluate Code (c#):** Type or copy and paste into this text field the C# code to evaluate to determine if this event is triggered. This must return a "bool" true or false value.
  - **Variables used in code:** A list of other variables available in the model for use in evaluating the code. This list will not include pre-existing variables such as CurTime. See [Pre-existing Variables](./variables.md#pre-existing-variables) for a full list of pre-existing variables. It will include the all of the variables that you create and are listed in the "All" Tab of the Left Navigation Frame. Click the check box to identify which variables are used in the code.

## Time Based Events
  
  <h3>Timer <img src="/images/Modeling/events/alarm.PNG" alt="Timer" width="25"/></h3>
  Monitors the time after entering the parent state against the user specified or sampled time.<br>
  
  ![Timer Options](/images/Modeling/events/TimerOptions.PNG)
  - **Time Span:** Enter the amount of model time to pass after entering this state before the event actions are triggered. The first box is the number of days, the second is the number of hours, the third is the number of minutes, and the fourth is the number of seconds. Values can only be integers.

<h3>Failure Rate <img src="/images/Modeling/events/dice.PNG" alt="Failure Rate" width="25"/></h3>
  Samples a given probability of failure to determine the time of this event.<br>
  
  ![Failure Rate Options](/images/Modeling/events/FailureRateOptions.PNG)
  - **Lambda/Freq:** The frequency (instances) of this event occurring per the time rate defined. Likely a decimal value like 0.0003.
  - **Time Rate:** Enter the time rate that the frequency is sampled over. The first box is the number of days, the second is the number of hours, the third is the number of minutes, and the fourth is the number of seconds. Values can only be integers.


<h3>Normal Distribution <img src="/images/Modeling/events/dist.PNG" alt="Normal Distribution" width="25"/></h3>
  Listed as Norm. Distribution in the dropdown menu. Samples a normal distribution according to user specified parameters for when this event will occur from the time entering the state.<br>
  
  ![Normal Distribution Options](/images/Modeling/events/NormalDistributionOptions.PNG)<br>
  To the right of each value is a dropdown menu which includes various time units. Click the dropdown menu to expand it and click the unit you would like to use for that value. It can be unique for each value.

  Given is the Probability Distribution Function (PDF) for a Normal Distribution curve for reference to the values required.
  - **Mean:** Enter the value of the mean.
  - **Standard Deviation:** Enter the value of the standard deviation.
  - **Minimum:** Enter the minimum value of the function, if a sampling returns a value less than this, then this time will be used. (Typically zero as you can't take no time to do something.)
  - **Maximum:** Enter the maximum value of the function, if a sampling returns a value greater than this, then this time will be used. 

<h3>Exponential Distribution <img src="/images/Modeling/events/dist.PNG" alt="Normal Distribution" width="25"/></h3>
  Samples an exponential distribution according to user specified parameters for when this event will occur from the time entering the state.<br>
  
  ![Exponential Distribution Options](/images/Modeling/events/ExponentialDistributionOptions.PNG)<br>
  - **Rate:** Enter the value of the rate. To the right of the value is a dropdown menu which includes various time units. Click the dropdown menu to expand it and click the unit you would like to use for that value.

<h3>Weibull Distribution <img src="/images/Modeling/events/dist.PNG" alt="Normal Distribution" width="25"/></h3>
  Samples a Weibull distribution according to user specified parameters for when this event will occur from the time entering the state.<br>

  ![Weibull Distribution Options](/images/Modeling/events/WeibullDistributionOptions.PNG)
  - **Shape:** Enter the value of the shape.
  - **Scale:** Enter the value of the scale.
  - **Time Scale:** Click the dropdown menu to expand it and click the unit you would like to use for this distribution. 


<!--Copyright 2021 Battelle Energy Alliance-->
