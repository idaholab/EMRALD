# Logic Trees
   Once components are modeled, a logic tree similar to a Fault Tree from traditional modeling can be constructed. Logic trees allow for complex behavior to be easily 
   modeled. An equivalent model using only Markov type modeling would require exponential growing and complex models.
   A standard use of Logic trees would be in System diagram models with just two states and a special event used to evaluate Boolean logic. 
   The two states are "Active" and "Failed", with a "Component Logic" event in the active state evaluating the assigned logic whenever a component diagram 
   state changes. If the logic ever evaluates to false, then the current state shifts from "Active" to "Failed". As shown in the System Diagram example in the [Types of Diagrams: System](./diagrams.md#system) section.
   
   The following will give introductions to all the elements seen in the Fault Tree Editor and how to use them to construct a logic tree.

   The Fault Tree editor consists of the <span style="color:blue">Tools Window</span>, <span style="color:green">Navigation Window</span>, and the <span style="color:red">Editing Area</span>. 

   ![Fault Tree Editor](/images/Modeling/logicTree/FaultTreeEditor.png) Each section will be explained in detail below.

## Tools Window
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |**Navigation**|
  |<div style="width:50px">![Zoom In](/images/Modeling/logicTree/zoom_in32.png)</div>|Click to zoom in|
  |<div style="width:50px">![Zoom Out](/images/Modeling/logicTree/zoom_out32.png)</div>|Click to zoom out|
  |<div style="width:50px">![Actual Size](/images/Modeling/logicTree/view_1_132.png)</div>|Click to return to actual size|
  |**Logic Gates**|
  |<div style="width:40px">![Or Gate](/images/Modeling/logicTree/OrGate.png)</div>|Drag this icon to add an Or Gate to the Fault Tree|
  |<div style="width:40px">![And Gate](/images/Modeling/logicTree/AndGate.png)</div>|Drag this icon to add an And Gate to the Fault Tree|
  |<div style="width:40px">![Basic Event](/images/Modeling/logicTree/BE.png)</div>|Drag this icon to add a Basic Event to the Fault Tree|
  |**Help**|
  |<div style="width:40px">![Help](/images/Modeling/logicTree/question.png)</div>|Click to open a basic help document|

## Navigation Window
  The blue rectangle represents the bounds of your current view and the entire Navigation Window is the bounds of your entire logic tree. You can move the blue rectangle around to pan your view. You can also zoom in and out by adjusting the size of the blue rectangle by clicking and dragging the light blue square in the bottom right corner.<br>
  ![Navigation Window](/images/Modeling/logicTree/NavigationWindow.png)

## Editing Area
  The logic trees consist of two basic elements, Logic Gates (Or and And) and Basic Events. The following sections will explain them in detail and how to model with them.

## Logic Gates
  **Or Gate** <br>
  <div style="width:200px">![Or Gate](/images/Modeling/logicTree/OrGateElement.png)</div>

  **And Gate**<br>
  <div style="width:200px">![And Gate](/images/Modeling/logicTree/AndGateElement.png)</div>
  
  **Adding a Gate**<br>
  <ins>Option 1:</ins> From the Tools Window, click and hold on to the gate you would like to add and drag it to the bottom of the desired gate in the Modeling Area until a plus symbol appears then release your mouse.<br>
  <div style="width:500px">![Add Gate Option 1 Step 1](/images/Modeling/logicTree/AddGateOpt1.png)</div>
  
  The gate will appear in the Editing Area under the branch you dragged it to.<br>
  <div style="width:500px">![Add Gate Option 1 Step 2](/images/Modeling/logicTree/AddGateOpt1_2.png)</div>

  <ins>Option 2:</ins> In the Editing Area, click on the green circle with the white plus sign in the bottom left corner of the gate you would like to add a new gate under.<br> 
  <div style="width:500px">![Add Gate Option 2 Step 1](/images/Modeling/logicTree/AddGateOpt2.png)</div>
   
  A Edit Forms/Gate Adder window will appear. Fill it out and click "OK." A description is optional.<br>
  <div style="width:500px">![Add Gate Option 2 Step 2](/images/Modeling/logicTree/AddGateOpt2_2.png)</div>
  
  The gate will appear in the Editing Area under the branch you added it to.<br> 
  <div style="width:500px">![Add Gate Option 2 Step 3](/images/Modeling/logicTree/AddGateOpt2_3.png)</div>

  **Editing a Gate**<br>
  In the bottom right hand corner of the gate you would like to edit, click the left icon of the paper and pencil.<br> 
  <div style="width:500px">![Edit Gate Step 1](/images/Modeling/logicTree/EditGate1.png)</div>
  
  The Edit Forms/Gate Editor window should appear. Click "OK" to confirm the changes.<br>
  <div style="width:500px">![Edit Gate Step 2](/images/Modeling/logicTree/EditGate2.png)</div>
  
  **Deleting a Gate**<br>
  In the bottom right hand corner of the gate you would like to edit, click the right icon of the backspace symbol. Use caution as no confirmation window will appear.<br>
  <div style="width:500px">![Delete Gate Step 1](/images/Modeling/logicTree/DeleteGate1.png)</div>

  The gate will no longer be shown in the logic tree.<br>
  <div style="width:500px">![Delete Gate Step 2](/images/Modeling/logicTree/DeleteGate2.png)</div>

## Basic Events

  <img src="/images/Modeling/logicTree/BasicEventElement.png" alt="Basic Event" width="300"/>

  **Adding a Basic Event**<br>
  <ins>Option 1:</ins> From the Tools Window, click and hold on to the Basic Event icon and drag it to the bottom of the desired gate in the Modeling Area until a plus symbol appears then release your mouse.<br>
  <div style="width:500px">![Add Basic Event Option 1 Step 1](/images/Modeling/logicTree/AddBasicEventOpt1.png)</div>
  
  The Edit Forms/Component Adder window will appear. Select the Component Element from the dropdown list and click "OK."<br>
  <div style="width:500px">![Add Basic Event Option 1 Step 2](/images/Modeling/logicTree/AddBasicEventOpt1_2.png)</div>

  The Basic Event will appear in the Editing Area under the branch you added it to.<br>
  <div style="width:500px">![Add Basic Event Option 1 Step 3](/images/Modeling/logicTree/AddBasicEventOpt1_3.png)</div>

  <ins>Option 2:</ins> 
  From the Left Navigation Frame, Expand the Diagrams section and the Components folder. Click and hold on the component that you would like to add as a Basic Event to your logic tree and drag it to the Gate you would like it to be under until you see a white plus symbol and release your mouse. <br>
  ![Add Basic Event Option 2 Step 1](/images/Modeling/logicTree/AddBasicEventOpt2.png)

  The Basic Event will appear in the Editing Area under the branch you added it to.<br> 
  <div style="width:500px">![Add Basic Event Option 2 Step 2](/images/Modeling/logicTree/AddBasicEventOpt2_2.png)</div>

  **Editing a Basic Event**<br>
  In the bottom right hand corner of the gate you would like to edit, click the left icon of the paper and pencil.<br> 
  <div style="width:500px">![Edit Basic Event Step 1](/images/Modeling/logicTree/EditBasicEvent1.png)</div>

  The Diagram window for that component will open in the Modeling Area. You can edit the Component Diagram from this window.<br>
  <div style="width:500px">![Edit Basic Event Step 2](/images/Modeling/logicTree/EditBasicEvent2.png)</div>

  **Deleting a Basic Event**<br>
  In the bottom right hand corner of the Basic Event you would like to edit, click the right icon of the backspace symbol. Use caution as no confirmation window will appear.<br>
  <div style="width:500px">![Delete Basic Event Step 1](/images/Modeling/logicTree/DeleteBasicEvent1.png)</div>

  The Basic Event will no longer be shown in the logic tree.<br>
  <div style="width:500px">![Delete Basic Event Step 2](/images/Modeling/logicTree/DeleteBasicEvent2.png)</div>


## Summary of Shared Symbols
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<div style="width:50px">![Add](/images/Modeling/logicTree/add.png)</div>|Click to add a new Logic Gate|
  |<div style="width:50px">![Edit](/images/Modeling/logicTree/edit.png)</div>|Click to edit the element|
  |<div style="width:50px">![Delete](/images/Modeling/logicTree/delete.png)</div>|Click to delete the element|
  |<div style="width:25px">![Collapse and Expand](/images/Modeling/logicTree/CollapseIcon.png)</div>|Click to collapse the branches below the gate|
  |<div style="width:25px">![Expand](/images/Modeling/logicTree/ExpandIcon.png)</div>|Click to expand the branches below the gate|

<!--Copyright 2021 Battelle Energy Alliance-->