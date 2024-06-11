# States
  A state is a logical representation for the condition of a component, person, system, process, etc. Each state has a Name, Immediate Action, and Event Action section.
  There are four different kinds of states: Start, Standard, Key, and Terminal.
  The Header indicates what kind of state with an icon it is as well as the name of the state. The Immediate Action section lists actions taken when a new state is entered. The Event Action section lists events to look for when in this state and what action to take if the event is triggered.<br>
  
  <img src="/images/Modeling/states/StateAnatomy.png" alt="State Anatomy" width="220"/>

## Creating a New State
  In the diagram that you want your state to be added to, right-click anywhere in the diagram window (not on any objects) and click, "New State." <br>
  ![New State Step 1](/images/Modeling/states/NewState1.png)

  Type in a state name, an optional description, and, if the diagram is a single state diagram, what the logic tree evaluation should be. Press "SAVE". The state will open up in the diagram window in the Modeling Area.<br> 
  ![New State Step 2](/images/Modeling/states/NewState2.png)<br>
  ![New State Step 3](/images/Modeling/states/NewState3.png)<br>

  This name cannot be the same as any existing state in the model. If it is, an error message will pop up to notify you to choose another name.<br>
  ![New State Step 4](/images/Modeling/states/NewState4.png)<br>

## Editing a State
**Option 1:**<br>
  On the Left Navigation Frame, click on the tab (All or Local) where your state is located. If you are not sure which tab, click on the All tab. Right-click on the state and click "Edit properties...".<br>
  <div style="width:200px">![Edit State Option 1](/images/Modeling/states/EditStateOpt1.png)</div><br>

  The properties window will open up in the Modeling Area. Note that because you are accessing the state properties from the Left Navigation Frame, the boolean evaluation value will not appear even if one of the diagrams it belongs to is a single state diagram.<br> 
  <div style="width:450px">![Edit State Option 2 Step 2](/images/Modeling/states/EditStateOpt1_2.png)</div>

**Option 2:**<br>
  In the diagram window, right-click in the middle of the state and click "State Properties...".<br>
  ![Edit State Option 2](/images/Modeling/states/EditStateOpt2.png)<br>

  The properties window will open up in the diagram window. <br>
  ![Edit State Option 2 Step 2](/images/Modeling/states/EditStateOpt2_2.png)

## State Properties
  State properties depend on the type of diagram. All diagram states have lists of events in the "Event Actions" list, and associated with each event is a "Exit Parent State" property. This property tells the simulation to exit the state after the events actions are executed. This adds a door with arrow icon ( <img src="/images/Modeling/states/exit-icon.png" alt="Start" width="18"/> ) to the right of the event and any arrows going from the action will turn black. If there are no transition actions.<br>
  
  Note that the exit property is set an edited in the event forms, not the state forms.
  <div style="width:450px">![Event Properties Exit Option](/images/Modeling/states/ExitPropertyInEventProperties.png)</div><br>

### Single State Diagrams (System, Component)
Single State diagrams such as system and components have an additional status value. This field is used for logic tree evaluations. 
They must have at least one state with a "True" value and one with a "False". The "Unknown" value can be used if it is not to have any effect on the logic evaluation. 
See the following screenshots of the CCS System diagram as an example, there should never be a green dashed arrow in the diagram and the events for all transition
actions should have a exit symbol.<br>

The Single State diagram representing the CCS System.
<div style="width:500px">![Single State Diagram Example](/images/Modeling/states/StatusValueExample.png)</div><br>

The CCS_Sys_Active State Properties window with "True" selected as the Status Value.
<div style="width:450px">![Status Value True](/images/Modeling/states/StatusValueTrue.png)</div><br>

The CCS_Sys_Failed State Properties window with "False" selected as the Status Value.
<div style="width:450px">![Status Value False](/images/Modeling/states/StatusValueFalse.png)</div><br>


## Deleting a State
**Option 1:** <br> 
  On the Left Navigation Frame, click on the tab (All, Global, or Local) where your state is located. If you are not sure which tab, click on the All tab. Right-click on the state and click "Delete".<br>
  <div style="width:300px">![Delete State Option 1 Step 1](/images/Modeling/states/DeleteStateOpt1.png)</div>

  A confirmation window will appear in the Modeling Area. Click "Yes."<br>
  ![Delete State Option 1 Step 2](/images/Modeling/states/DeleteStateOpt1_2.png)<br>

  The state will be deleted and no longer listed in the Left Navigation Frame. <br>
  <div style="width:200px">![Delete State Option 1 Step 3](/images/Modeling/states/DeleteStateOpt1_3.png)</div><br>

**Option 2:** <br> 
  Open the Diagram containing the state and locate the state. Right-click on the state and click " Delete State". Use caution when deleting because no confirmation window will appear.<br>
  ![Edit State Option 2 Step 1](/images/Modeling/states/DeleteStateOpt2.png)

  The state will no longer show in the diagram window no longer be listed in the Left Navigation Frame. <br>
  ![Edit State Option 2 Step 2](/images/Modeling/states/DeleteStateOpt2_2.png)

## Types of States
The type of state will be indicated by an icon in the header of the state. Those icons are included in the title of the respective section as well as in the [Icons: States](./icons.md#states) section.

<h3>Start <img src="/images/Modeling/states/green-dot.gif" alt="Start" width="25"/></h3>

Start states are the states the model is in when the simulation begins. There must be at least one but can be more. All start states will be activated simultaneously.<br>
<div style="width:220px">![Start State](/images/Modeling/states/StartState.png)</div>

### Standard
A normal state representing no special conditions. It will have no icon in the Header.<br>
<div style="width:220px">![Standard State](/images/Modeling/states/StandardState.png)</div>

<h3>Key <img src="/images/Modeling/states/key.png" alt="Key" width="25"/></h3>

A key state is what is of interest in the model, it will be tracked and reported if the model is in this state at the end of a simulation. In comparison to traditional PRA, all "End Sates" would have a corresponding "Key State." <br>
<div style="width:220px">![Key State](/images/Modeling/states/KeyState.png)</div>


<h3>Terminal <img src="/images/Modeling/states/red-dot.png" alt="Terminal" width="25"/></h3>

A user-defined simulation stopping point. A terminal state is not required but the simulation will run until the end time parameter is reached. However, it is recommend that terminal states be used to end all simulations when desired stop conditions are met for shortened computing time.<br>
<div style="width:220px">![Terminal State](/images/Modeling/states/TerminalState.png)</div>


## Immediate Actions
  Immediate actions are actions that are executed upon entering the state in a simulation. The actions are performed in order, top to bottom.<br>
  ![Immediate Action Examples](/images/Modeling/states/ImmediateActionExample.png) 

  An icon on the left of the action shows what type of action it is. Refer to the [Actions](./icons.md#Actions) section of the Icons page too see what icons are associated with each action type. 
  
  ::: tip Note 
  A Transition Action in Immediate Actions area can not exit the state (black arrow), but adds the "too" state as current state (dotted green arrow). See the [Elements of a Diagram: Arrows](./diagrams.md#arrows) section for more information.
  :::

### Adding an Immediate Action  
To add an Immediate Action, you can either...<br>

**Option 1:** Right-click on the Immediate Action header in the state to create a new Immediate Action or <br>
![New Action 1](/images/Modeling/actions/NewAction1.png)<br>

**Option 2:** Drag and drop an existing action into the Immediate Action section.<br>
![Add an Existing Immediate Action](/images/Modeling/states/AddExistingImmediateAction.png)<br> 

See [Creating a New Action](./actions.md#creating-a-new-action) for detailed instructions for Option 1. See [Adding an Existing Action](./actions.md#adding-an-existing-action) for detailed instructions for Option 2.

See [Actions](/guide/Modeling/actions.md) for more information.


## Event Actions
  Event Actions are event/action combinations taken when the event condition is met. 
  <div style="width:220px">![Event Actions Section](/images/Modeling/states/EventActionsSection.png)</div><br>
An icon on the left of the action shows what type of action it is. See [Icons](/guide/Modeling/icons.md) for descriptions of each icon.

### Adding an Event
To add an Event, you can either...<br>

**Option 1:** Right-click on the Event Actions header in the state to create a new event or <br>
![New Event Step 1](/images/Modeling/events/NewEvent1.png)<br>

**Option 2:** Drag and drop an existing event into the Immediate Action section.<br>
![Add an Existing Event 1](/images/Modeling/events/AddExistingEvent1.png)<br> 

See [Creating a New Event](./events.md#creating-a-new-event) for detailed instructions for Option 1. See [Adding an Existing Event](./events.md#adding-an-existing-event) for detailed instructions for Option 2.

See [Events](/guide/Modeling/events.md) for more information.

### Adding an Action for an Event
To add an action to an event, you can either...<br>

**Option 1:** Under the Event Actions header, right-click on the event you want to add the action to create a new Event Action or <br>
![New Event Action](/images/Modeling/states/AddNewEventAction.png)<br>

**Option 2:** Drag and drop an existing action into the Immediate Action section.<br>
![Add an Existing Action 1](/images/Modeling/actions/AddExistingAction1.png)

See [Creating a New Action](./actions.md#creating-a-new-action) for detailed instructions for Option 1. See [Adding an Existing Action](./actions.md#adding-an-existing-action) for detailed instructions for Option 2.

See [Actions](/guide/Modeling/actions.md) for more information on Actions.

<!--Copyright 2021 Battelle Energy Alliance-->