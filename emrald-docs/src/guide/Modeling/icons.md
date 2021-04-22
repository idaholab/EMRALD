---
pageClass: icons-page
---

# Icons

![Diagram Elements](/images/Modeling/diagrams/DiagramElements.PNG)<br>
Diagram elements are tabulated by States, Events, Actions, and Arrows in the following four sections.

## States
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<img src="/images/Modeling/states/key.PNG" alt="KeyIcon" width="25"/>|Indicates a Key State|
  |<img src="/images/Modeling/states/green-dot.gif" alt="StartIcon" width="25"/>|Indicates a Start State|
  |<div style="width:20px">![TerminalIcon](/images/Modeling/states/red-dot.PNG)</div>|Indicates a Terminal State|

  See [States](/guide/Modeling/states.md) for more information.

## Events
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<div style="width:25px">![Variable Condition Icon](/images/Modeling/events/varCond.PNG)</div>|Variable Condition Icon|
  |<div style="width:25px">![State Change Icon](/images/Modeling/events/stateChange.PNG)</div>|State Change Icon|
  |<div style="width:25px">![Component Logic Icon](/images/Modeling/events/compLogic.PNG)</div>|Component Logic Icon|
  |<div style="width:25px">![External Simulation Icon](/images/Modeling/events/ExtInput.PNG)</div>|External Simulation Icon|
  |![Timer Icon](/images/Modeling/events/alarm.PNG)|Timer Icon|
  |<div style="width:25px">![Failure Rate Icon](/images/Modeling/events/dice.PNG)</div>|Failure Rate Icon|
  |<div style="width:25px">![Distribution Rate Icon](/images/Modeling/events/dist.PNG)</div>|Distribution Rate Icon|
  |<div style="width:25px">![Exit Parent State Icon](/images/Modeling/events/exit-icon.PNG)</div>|Exit Parent state when Event is triggered Icon|

  See [Events](/guide/Modeling/events.md) for more information.

## Actions
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |**Action Type**| |
  |<div style="width:25px">![Transition](/images/Modeling/actions/TransitionArrow.png)</div>|Transition Action|
  |<div style="width:25px">![Change Variable Value](/images/Modeling/actions/varCond.png)</div>|Change Variable Value Action|
  |<div style="width:25px">![External Simulation Message](/images/Modeling/actions/extSim.png)</div>|External Simulation Message Action|
  |![Run Application](/images/Modeling/actions/cogwheel.png)|Run Application Action|
  |**Status Icons**| |
  |<img src="/images/Modeling/actions/connector.gif" alt="Arrow Icon" width="25"/>|This click and drag from this icon to connect the action to a state.|
  |<div style="width:25px">![Missing Information Action Icon](/images/Modeling/actions/questionOrange.PNG)</div>|This icon appears when the action is not fully defined|
  |<img src="/images/Modeling/actions/delete2.PNG" alt="Red X Icon" width="25"/>|This icon appears when there is an error with the item. Hover over name (not the X) to see a description of the error.|
  |![Link Icon](/images/Modeling/actions/link.PNG)|This icon appears instead of an arrow, when the transition goes to a state not in the current diagram.|

  See [Actions](/guide/Modeling/actions.md) for more information.

## Arrows
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |![Green Arrow](/images/Modeling/icons/GreenArrow.PNG)|Indicates movement from one state to another|
  |![Black Arrow](/images/Modeling/icons/BlackArrow.PNG)|Indicates forced exit from one state to another|

  See [Arrows](./diagrams.md#arrows) on the Diagrams page for more information.

## Logic Trees
   ![Fault Tree Editor](/images/Modeling/logicTree/FaultTreeEditor.PNG) <br>
   
   The icons from the <span style="color:blue">Tools Window</span> and the <span style="color:red">Editing Area</span> are tabulated in the following two subsections.
   
   See [Logic Tree](/guide/Modeling/logicTree.md) for more information.

### Tools Window
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |**Navigation**|
  |<div style="width:50px">![Zoom In](/images/Modeling/logicTree/zoom_in32.PNG)</div>|Click to zoom in|
  |<div style="width:50px">![Zoom Out](/images/Modeling/logicTree/zoom_out32.PNG)</div>|Click to zoom out|
  |<div style="width:50px">![Actual Size](/images/Modeling/logicTree/view_1_132.PNG)</div>|Click to return to actual size|
  |**Logic Gates**|
  |<div style="width:40px">![Or Gate](/images/Modeling/logicTree/OrGate.PNG)</div>|Drag this icon to add an Or Gate to the Fault Tree|
  |<div style="width:40px">![And Gate](/images/Modeling/logicTree/AndGate.PNG)</div>|Drag this icon to add an And Gate to the Fault Tree|
  |<div style="width:40px">![Basic Event](/images/Modeling/logicTree/BE.PNG)</div>|Drag this icon to add a Basic Event to the Fault Tree|
  |**Help**|
  |<div style="width:40px">![Help](/images/Modeling/logicTree/question.PNG)</div>|Click to open a basic help document|

### Editing Area
  |<div style="width:150px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<div style="width:150px">![Or Gate](/images/Modeling/logicTree/OrGateElement.PNG)</div>|Or Gate|
  |<div style="width:150px">![And Gate](/images/Modeling/logicTree/AndGateElement.PNG)</div>|And Gate|
  |<div style="width:150px">![Basic Event](/images/Modeling/logicTree/BasicEventElement.PNG)</div>|Basic Event|
  |<div style="width:50px">![Add](/images/Modeling/logicTree/add.PNG)</div>|Click to add a new Logic Gate|
  |<div style="width:50px">![Edit](/images/Modeling/logicTree/edit.PNG)</div>|Click to edit the element|
  |<div style="width:50px">![Delete](/images/Modeling/logicTree/delete.PNG)</div>|Click to delete the element|
  |<div style="width:25px">![Collapse and Expand](/images/Modeling/logicTree/CollapseIcon.PNG)</div>|Click to collapse the branches below the gate|
  |<div style="width:25px">![Expand](/images/Modeling/logicTree/ExpandIcon.PNG)</div>|Click to expand the branches below the gate|
 
<!--Copyright 2021 Battelle Energy Alliance-->