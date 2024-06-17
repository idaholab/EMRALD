# Logic Trees
   Once components are modeled, a logic tree similar to a Fault Tree from traditional modeling can be constructed. Logic trees allow for complex behavior to be easily 
   modeled. An equivalent model using only Markov type modeling would require exponential growing and complex models.
   A standard use of Logic trees would be in System diagram models with just two states and a special event used to evaluate Boolean logic. 
   The two states are "Active" and "Failed", with a "Component Logic" event in the active state evaluating the assigned logic whenever a component diagram 
   state changes. If the logic ever evaluates to false, then the current state shifts from "Active" to "Failed". As shown in the System Diagram example in the [Types of Diagrams: System](./diagrams.md#system) section.
   
   The following will give introductions to all the elements seen in the Fault Tree Editor and how to use them to construct a logic tree.

   The Fault Tree editor consists of the <span style="color:blue">Tools Window</span>, and the <span style="color:red">Editing Area</span>. 

   ![Fault Tree Editor](/images/Modeling/logicTree/FaultTreeEditor.png) Each section will be explained in detail below.

## Tools Window
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |**Logic Gates**|
  |<div style="width:40px">![Or Gate](/images/Modeling/logicTree/OrGate.png)</div>|Drag this icon to add an Or Gate to the Fault Tree|
  |<div style="width:40px">![And Gate](/images/Modeling/logicTree/AndGate.png)</div>|Drag this icon to add an And Gate to the Fault Tree|
  |<div style="width:40px">![Not Gate](/images/Modeling/logicTree/NotGate.png)</div>|Drag this icon to add a Not Gate to the Fault Tree|


## Editing Area
  The logic trees consist of two basic elements, Logic Gates (Or and And) and Basic Events. The following sections will explain them in detail and how to model with them.

## Logic Gates
  **Or Gate** <br>
  <div style="width:200px">![Or Gate](/images/Modeling/logicTree/OrGateElement.png)</div>

  **And Gate**<br>
  <div style="width:200px">![And Gate](/images/Modeling/logicTree/AndGateElement.png)</div>

  **Not Gate** <br>
  <div style="width:200px">![And Gate](/images/Modeling/logicTree/NotGateElement.png)</div>
  
  **Adding a Gate**<br>
  <ins>Option 1:</ins> From the Tools Window, click and hold on to the gate you would like to add and drag it to the bottom of the desired gate in the Modeling Area until the gate highlights a light green, then release your mouse.<br>
  <div style="width:500px">![Add Gate Option 1 Step 1](/images/Modeling/logicTree/AddGateOpt1.png)</div>
  
  The gate will appear in the Editing Area under the branch you dragged it to.<br>
  <div style="width:500px">![Add Gate Option 1 Step 2](/images/Modeling/logicTree/AddGateOpt1_2.png)</div>

  <ins>Option 2:</ins> In the Editing Area, right click on the gate you would like to add a new gate under and select "Add Gate".<br> 
  <div style="width:500px">![Add Gate Option 2 Step 1](/images/Modeling/logicTree/AddGateOpt2.png)</div>
   
  A Edit Forms/Gate Adder window will appear. Fill it out and click "SAVE" A description is optional.<br>
  <div style="width:500px">![Add Gate Option 2 Step 2](/images/Modeling/logicTree/AddGateOpt2_2.png)</div>
  
  The gate will appear in the Editing Area under the branch you added it to.<br> 
  <div style="width:500px">![Add Gate Option 2 Step 3](/images/Modeling/logicTree/AddGateOpt2_3.png)</div>

  **Editing a Gate**<br>
  To edit a gate, right click on the desired blue gate and select the option to "Edit Gate Node". <br> 
  <div style="width:500px">![Edit Gate Step 1](/images/Modeling/logicTree/EditGate1.png)</div>
  
  The Edit Gate Node window should appear. Click "SAVE" to confirm the changes.<br>
  <div style="width:500px">![Edit Gate Step 2](/images/Modeling/logicTree/EditGate2.png)</div>
  
  **Deleting a Gate**<br>
  <ins>Option 1:</ins><br>
  Right click on the gate and select the option to "Delete Gate" as shown below.<br>
  ![Delete Gate Option 1](/images/Modeling/logicTree/DeleteGateOption1.png) 

  <ins>Option 2:</ins><br>
  In the top right corner of the gate you would like to delete, click the [x] icon. Use caution as no confirmation window will appear.<br>
  <div style="width:500px">![Delete Gate Step 1](/images/Modeling/logicTree/DeleteGate1.png)</div>

  The gate will no longer be shown in the logic tree.<br>
  <div style="width:500px">![Delete Gate Step 2](/images/Modeling/logicTree/DeleteGate2.png)</div>

## Basic Events

  <img src="/images/Modeling/logicTree/BasicEventElement.png" alt="Basic Event" width="300"/>

  **Adding a Basic Event**<br>
  <ins>Option 1:</ins> Right click on the gate node and click Add Component as shown below.<br>
  <div style="width:500px">![Add Basic Event Option 1 Step 1](/images/Modeling/logicTree/AddBasicEventOpt1.png)</div>
  
  A window titled "New Node" will appear. Select the Component, or single state, Diagram from the dropdown list and click "SAVE"<br>
  <div style="width:500px">![Add Basic Event Option 1 Step 2](/images/Modeling/logicTree/AddBasicEventOpt1_2.png)</div>

  The Basic Event will appear in the Editing Area under the branch you added it to.<br>
  <div style="width:500px">![Add Basic Event Option 1 Step 3](/images/Modeling/logicTree/AddBasicEventOpt1_3.png)</div>

  <ins>Option 2:</ins> 
  From the Left Navigation Frame, expand the Diagrams section. Click and hold on the single state diagram that you would like to add as a Basic Event to your logic tree and drag it to the Gate you would like it to be under until the gate highlihgts green and release your mouse. <br>
  ![Add Basic Event Option 2 Step 1](/images/Modeling/logicTree/AddBasicEventOpt2.png)

  The Basic Event will appear in the Editing Area under the branch you added it to.<br> 
  <div style="width:500px">![Add Basic Event Option 2 Step 2](/images/Modeling/logicTree/AddBasicEventOpt2_2.png)</div>

  **Editing a Basic Event**<br>
  <ins>Option 1:</ins>
  Right click on the basic event and click "Edit Component Node" from the pop up menu. <br> 
  <div style="width:500px">![Edit Basic Event Step 1](/images/Modeling/logicTree/EditBasicEvent1.png)</div>

  The "Edit Component Node" window will appear. After making any changes, click "SAVE" <br>
  <div style="width:500px">![Edit Basic Event Step 2](/images/Modeling/logicTree/EditBasicEvent2.png)</div>

  <ins>Option 2:</ins>
  Right click on the basic event and click "Go to Diagram" from the pop up menu. <br>

  ![Edit Basic Event Option 2_1](/images/Modeling/logicTree/EditBasicEventOption2.png)

  The diagram window for the basic event will appear. You can edit the diagram from here. 

  ![Edit Basic Event Option 2_2](/images/Modeling/logicTree/EditBasicEventOption2_2.png)

  <ins>Option 3:</ins>
  Click on the link icon at the top right of the basic event to the left of the [x].<br>

  ![Edit Basic Event Option 3_1](/images/Modeling/logicTree/EditBasicEventOption3_1.png) 

  This opens up the basic event's diagram where it can be edited.<br>

  **Deleting a Basic Event**<br>
  <ins>Option 1:</ins><br>
  In the top right corner of the Basic Event you would like to delete, click the [x] icon. Use caution as no confirmation window will appear.<br>
  <div style="width:500px">![Delete Basic Event Step 1](/images/Modeling/logicTree/DeleteBasicEvent1.png)</div>

  The Basic Event will no longer be shown in the logic tree.<br>
  <div style="width:500px">![Delete Basic Event Step 2](/images/Modeling/logicTree/DeleteBasicEvent2.png)</div>

  <ins>Option 2:</ins><br>
  Right click on the basic event and select "Remove Component". 
  <div style="width:500px">![Delete Basic Event Step 1](/images/Modeling/logicTree/DeleteBasicEvent3.png)</div>

  The Basic Event will no longer be shown in the logic tree.<br>
  <div style="width:500px">![Delete Basic Event Step 2](/images/Modeling/logicTree/DeleteBasicEvent2.png)</div>


## Summary of Shared Symbols
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<div style="width:25px">![Collapse and Expand](/images/Modeling/logicTree/CollapseIcon.png)</div>|Click to collapse the branches below the gate|
  |<div style="width:25px">![Expand](/images/Modeling/logicTree/ExpandIcon.png)</div>|Click to expand the branches below the gate|

<!--Copyright 2021 Battelle Energy Alliance-->