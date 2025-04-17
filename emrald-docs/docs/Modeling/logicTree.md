# Logic Trees
   Once components are modeled, a logic tree similar to a Fault Tree from traditional modeling can be constructed. Logic trees allow for complex behavior to be easily 
   modeled. An equivalent model using only Markov type modeling would require exponential growing and complex models.
   A standard use of Logic trees would be in System diagram models with just two states and a special event used to evaluate Boolean logic. 
   The two states are "Active" and "Failed", with a "Component Logic" event in the active state evaluating the assigned logic whenever a component diagram 
   state changes. If the logic ever evaluates to false, then the current state shifts from "Active" to "Failed". As shown in the System Diagram example in the [Types of Diagrams: System](./diagrams.md#system) section.
   
   The following will give introductions to all the elements seen in the Fault Tree Editor and how to use them to construct a logic tree.

   The Fault Tree editor consists of the <span style="color:blue">Tools Window</span>, and the <span style="color:red">Editing Area</span>. 

  <img src="/images/Modeling/logicTree/FaultTreeEditor.png" alt="Fault Tree Editor" /> 
  
  Each section will be explained in detail below.

## Tools Window
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |**Logic Gates**|
  |<img src="/images/Modeling/logicTree/OrGate.png" alt="Or Gate" style="width:40px;" />|Drag this icon to add an Or Gate to the Fault Tree|
  | <img src="/images/Modeling/logicTree/AndGate.png" alt="And Gate" style="width:40px;" />|Drag this icon to add an And Gate to the Fault Tree|
  |<img src="/images/Modeling/logicTree/NotGate.png" alt="Not Gate" style="width:40px;" />|Drag this icon to add a Not Gate to the Fault Tree|


## Editing Area
  The logic trees consist of two basic elements, Logic Gates (Or and And) and Basic Events. The following sections will explain them in detail and how to model with them.

## Logic Gates
  **Or Gate** <br>
  <img src="/images/Modeling/logicTree/OrGateElement.png" alt="Or Gate" style="width:200px;" />

  **And Gate**<br>
  <img src="/images/Modeling/logicTree/AndGateElement.png" alt="And Gate" style="width:200px;" />

  **Not Gate** <br>
  <img src="/images/Modeling/logicTree/NotGateElement.png" alt="Not Gate" style="width:200px;" />

  
  **Adding a Gate**<br>
  <ins>Option 1:</ins> From the Tools Window, click and hold on to the gate you would like to add and drag it to the bottom of the desired gate in the Modeling Area until the gate highlights a light green, then release your mouse.<br>
<img src="/images/Modeling/logicTree/AddGateOpt1.png" alt="Add Gate Option 1" style="width:500px;" />
  
  The gate will appear in the Editing Area under the branch you dragged it to.<br>
<img src="/images/Modeling/logicTree/AddGateOpt1_2.png" alt="Add Gate Option 1 Step 2" style="width:500px;" />

  <ins>Option 2:</ins> In the Editing Area, right click on the gate you would like to add a new gate under and select "Add Gate".<br> 
<img src="/images/Modeling/logicTree/AddGateOpt2.png" alt="Add Gate Option 2" style="width:500px;" />
   
  A Edit Forms/Gate Adder window will appear. Fill it out and click "SAVE" A description is optional.<br>
<img src="/images/Modeling/logicTree/AddGateOpt2_2.png" alt="Add Gate Option 2 Step 2" style="width:500px;" />
  
  The gate will appear in the Editing Area under the branch you added it to.<br> 
<img src="/images/Modeling/logicTree/AddGateOpt2_3.png" alt="Add Gate Option 2 Step 3" style="width:500px;" />

  **Editing a Gate**<br>
  To edit a gate, right click on the desired blue gate and select the option to "Edit Gate Node". <br> 
<img src="/images/Modeling/logicTree/EditGate1.png" alt="Edit Gate Step 1" style="width:500px;" />
  
  The Edit Gate Node window should appear. Click "SAVE" to confirm the changes.<br>
<img src="/images/Modeling/logicTree/EditGate2.png" alt="Edit Gate Step 2" style="width:500px;" />
  
  **Deleting a Gate**<br>
  Right click on the gate and select the option to "Delete Gate" as shown below. This will delete the gate from all logic trees if you have previously copied and pasted that tree elsewhere. <br>
  ![Delete Gate Option 1](/images/Modeling/logicTree/DeleteGateOption1.png) 

  **Removing a Gate**<br>
  In the top right corner of the gate you would like to delete, click the [x] icon. Use caution as no confirmation window will appear.<br>
<img src="/images/Modeling/logicTree/DeleteGate1.png" alt="Delete Gate Step 1" style="width:500px;" />

  The gate will no longer be shown in the logic tree. You can also right click and click "Remove Gate" for the same effect.<br>
<img src="/images/Modeling/logicTree/DeleteGate2.png" alt="Delete Gate Step 2" style="width:500px;" />

## Basic Events

  <img src="/images/Modeling/logicTree/BasicEventElement.png" alt="Basic Event" width="200"/>

  **Adding a Basic Event**<br>
  <ins>Option 1:</ins> Right click on the gate node and click Add Component as shown below.<br>
<img src="/images/Modeling/logicTree/AddBasicEventOpt1.png" alt="Add Basic Event Option 1" style="width:500px;" />
  
  A window titled "New Node" will appear. Select the Component, or single state, Diagram from the dropdown list and click "SAVE"<br>
<img src="/images/Modeling/logicTree/AddBasicEventOpt1_2.png" alt="Add Basic Event Option 1 Step 2" style="width:500px;" />

  The Basic Event will appear in the Editing Area under the branch you added it to.<br>
<img src="/images/Modeling/logicTree/AddBasicEventOpt1_3.png" alt="Add Basic Event Option 1 Step 3" style="width:500px;" />

  <ins>Option 2:</ins> 
  From the Left Navigation Frame, expand the Diagrams section. Click and hold on the single state diagram that you would like to add as a Basic Event to your logic tree and drag it to the Gate you would like it to be under until the gate highlihgts green and release your mouse. <br>
  ![Add Basic Event Option 2 Step 1](/images/Modeling/logicTree/AddBasicEventOpt2.png)

  The Basic Event will appear in the Editing Area under the branch you added it to.<br> 
  <img src="/images/Modeling/logicTree/AddBasicEventOpt2_2.png" style="width:500px">

  **Editing a Basic Event**<br>
  <ins>Option 1:</ins>
  Right click on the basic event and click "Edit Component Node" from the pop up menu. <br> 
  <img src="/images/Modeling/logicTree/EditBasicEvent1.png" style="width:500px">

  The "Edit Component Node" window will appear. After making any changes, click "SAVE" <br>
  <img src="/images/Modeling/logicTree/EditBasicEvent2.png" style="width:500px">

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
  <img src="/images/Modeling/logicTree/DeleteBasicEvent1.png" style="width:300px">

  The Basic Event will no longer be shown in the logic tree. Clicking the [x] button removes the event fromt he tree, but does not delete the corresponding diagram. <br>
  <img src="/images/Modeling/logicTree/DeleteBasicEvent2.png" style="width:300px">

  <ins>Option 2:</ins><br>
  Right click on the basic event and select "Remove Component". 
  <img src="/images/Modeling/logicTree/DeleteBasicEvent3.png" style="width:300px">

  The Basic Event will no longer be shown in the logic tree.<br>
  <img src="/images/Modeling/logicTree/DeleteBasicEvent2.png" style="width:300px">


## Summary of Shared Symbols
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<img src="/images/Modeling/logicTree/CollapseIcon.png" style="width:25px">|Click to collapse the branches below the gate|
  |<img src="/images/Modeling/logicTree/ExpandIcon.png" style="width:25px">|Click to expand the branches below the gate|
  |<img src="/images/Modeling/logicTree/LinkDiagramIcon.png" style="width:25px">|Click to go to the diagram of that component|

<!--Copyright 2021 Battelle Energy Alliance-->