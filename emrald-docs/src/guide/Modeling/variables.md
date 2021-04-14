# Variables
Variables define a value that can be evaluated or modified by user defied scripts in some events and actions. External variables are linked to an external code and can be modified or evaluated by either.
<!--Todo Courtney - Add pictures 
Completed where possible -Courtney -12/8/2020-->

## Creating a New Variable
On the Left Navigation Frame, right click on the variable label and click "New Variable".<br> 
<div style="width:300px">![New Variable Step 1](/images/Modeling/variables/NewVar1.PNG)</div>

Fill out the dialogue box and press "OK". Each field is described in detail below.<br>
<div style="width:500px">![New Variable Step 2](/images/Modeling/variables/NewVar2.PNG)</div>
- **Name:** The name of the variable, how it will be listed in the Left Navigation Frame and be used in code.
- **Description:** Optional description of the variable.
- **Scope:** Click the field to define the variable as a Global variable or an External Simulation variable.
- **Type:** Click the field to define the variable as an integer, double, boolean, or string.
- **Value:** The value of the variable. <!-- QUESTION: Seems odd to have this set. Is this an initial value? -Courtney -->

It will be listed in the Left Navigation Frame.<br>
<div style="width:300px">![New Variable Step 3](/images/Modeling/variables/NewVar3.PNG)</div>

## Editing a Variable
On the Left Navigation Frame, click on the tab (All or Global), External Sim Variables will not show up in the Global tab. If you are not sure which tab, click on the All tab. Right click on the variable and click "Edit properties".<br>
<div style="width:300px">![Edit Variable Step 1](/images/Modeling/variables/EditVar1.PNG)</div>

The variable properties dialogue box will appear in the modeling area. Edit your properties as needed and press "OK" to save the changes.<br>
<div style="width:500px">![Edit Variable Step 2](/images/Modeling/variables/EditVar2.PNG)</div>

If you would like to create a new variable based on this one, check the box "Save As New." Then after you are done editing the variable, click the "Save As New" button which was previously the "OK" button.<br>
<div style="width:500px">![Edit Variable Step 3](/images/Modeling/variables/EditVar3.PNG)</div>

It will be listed in the Left Navigation Frame.<br>
<div style="width:300px">![Edit Variable Step 4](/images/Modeling/variables/EditVar4.PNG)</div>

## Deleting a Variable
  On the Left Navigation Frame, click on the tab (All or Global) where your variable is located. If you are not sure which tab, click on the All tab. Right click on the variable and click "Delete".<br>
  <div style="width:300px">![Delete Variable Step 1](/images/Modeling/variables/DeleteVar1.PNG)</div>

  A confirmation window will appear in the Modeling Area. Click "Yes."<br>
  ![Delete Variable Step 2](/images/Modeling/variables/DeleteVar2.PNG)<br>
  <!-- TODO Steve - there's a typo in the header of the popup box when confirming deletion of a variable and it won't allow "Yes" to be clicked. Can click "Cancel". -->

  The variable will be deleted from the entire model and no longer be listed in the Left Navigation Frame. <br>
  <div style="width:300px">![Delete Event Variable Step 3](/images/Modeling/variables/DeleteVar3.PNG)</div><br>


## Using Variables in the Model

Whether you're identifying or adding variables to a Variable Condition Event or Change Variable Value Action, there will be a list of variables available in the editor window. 

|Variable Condition Event|Change Variable Value Action|
|---|---|
|<div style="width:300px">![Variable Condition Options](/images/Modeling/events/VarConditionOptions.PNG)</div>|<div style="width:330px">![Change Variable Value Options](/images/Modeling/actions/ChangeVarValueOptions.PNG)</div>|

This list will not include pre-existing variables such as CurTime. See [Pre-existing Variables](./variables.md#pre-existing-variables) for a full list of pre-existing variables. It will include the all of the variables that you create and are listed in the "All" Tab of the Left Navigation Frame. Click the check box to identify which variables are used in the code.

See [Variable Condition Event](./events.md#variable-condition) and [Change Variable Value Action](./actions.md#change-variable-value) for more information on those respective topics.


## Pre-existing Variables
EMRALD comes with a set of variables that can be used in the model that don't have to be created new. Below is a list of those variables and what they represent.

|Variable Name|Description|Availability|
|---|---|
|CurTime|Current simulation time|All Areas|
|ExtSimStartTime|Start time for a linked external Simulation|All Areas
|ExeExitCode|Code returned from external exe|Action - Run Application|
|ExePath|Path to specified executable to run|Action - Run Application|
|NextEvTime|Time of the next event to occur, in hours| Event - Variable Condition|

|

## Variable Scope
Depending on the Scope of variable selected different options are available.

### Global
Currently all variables are technically global, variables local to a diagram were available originally, but proved unnecessary and confusing. Global variables are normal variables and available in any item that has a script.

### External Simulation Variables
Seen as "Ext Sim Variable" in the drop down menu. An external simulation variable is a connected between the EMRALD simulation and an external simulation through the messaging protocol for sending or receiving values. These variables are used by the following items:
- **External Simulation Event:** See [External Simulation Event](./events.md#external-simulation) for more information.
- **External Simulation Message Action:** See [External Simulation Message Action](./actions.md#external-simulation-message) for more information.
<!--Todo Courtney - Add bulleted items and link for Ext Sim Message action, Ext Simulation Event 
Links aren't working in this section and Using Variables Section -Courtney -12/8/2020-->

### Document Link Variable

## Variable Types
Integer (Int), Double, Boolean (Bool), String

<!--TODO coming soon but GUI not done yet, add pictures and input descriptions for each of the options-->
### Accumulation Variable 
An accumulation variable allows the user to easily adjust a variable depending on how much time is spent in specified states. 
For example determining a radiation dose rate or costs for procedures or downtime. Accumulation variables are always doubles.
There are different options for accumulation variables:

#### Time
The time option simply accrues the time in the listed states.

#### Multiplier
The multiplier option multiplies the time in the listed states by a specified multiplier value which can be different for each state.

#### Table
The Table option multiplies the time in the listed states by multiplier value which changes according to the time specified in the table. 
This can also be different for each state.

<!--Copyright 2021 Battelle Energy Alliance-->
