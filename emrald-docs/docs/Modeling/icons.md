# Icons

![Diagram Elements](/images/Modeling/diagrams/DiagramElements.png)<br>
Diagram elements are tabulated by States, Events, Actions, and Arrows in the following four sections.

## States
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<img src="/images/Modeling/states/key.png" alt="KeyIcon" width="25"/>|Indicates a Key State|
  |<img src="/images/Modeling/states/start.png" alt="StartIcon" width="25"/>|Indicates a Start State|
  |<img src="/images/Modeling/states/red-dot.png" alt="TerminalIcon" width="25"/>|Indicates a Terminal State|

  See [States](/Modeling/states.md) for more information.

## Events
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<img src="/images/Modeling/events/varCond.png" alt="Variable Condition Icon" width="25" />|Variable Condition Icon|
  |<img src="/images/Modeling/events/stateChange.png" alt="State Change Icon" width="25" />|State Change Icon|
  |<img src="/images/Modeling/events/compLogic.png" alt="Component Logic Icon" width="25" />|Component Logic Icon|
  |<img src="/images/Modeling/events/ExtInput.png" alt="External Simulation Icon" width="25" />|External Simulation Icon|
  |<img src="/images/Modeling/events/alarm.png" alt="Timer Icon" width="25" />|Timer Icon|
  |<img src="/images/Modeling/events/dice.png" alt="Failure Rate Icon" width="25" />|Failure Rate Icon|
  |<img src="/images/Modeling/events/dist.png" alt="Distribution Rate Icon" width="25" />|Distribution Rate Icon|
  |<img src="/images/Modeling/events/exit-icon.png" alt="Exit Parent State Icon" width="25" />|Exit Parent state when Event is triggered Icon|

  See [Events](/Modeling/events.md) for more information.

## Actions
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |**Action Type**| |
  |<img src="/images/Modeling/actions/TransitionArrow.png" alt="Transition" width="25" />|Transition Action|
  |<img src="/images/Modeling/actions/varCond.png" alt="Change Variable Value" width="25" />|Change Variable Value Action|
  |<img src="/images/Modeling/actions/extSim.png" alt="External Simulation Message" width="25" />|External Simulation Message Action|
  |<img src="/images/Modeling/actions/cogwheel.png" alt="Run Application" width="25" />|Run Application Action|
  |**Status Icons**| |
  |<img src="/images/Modeling/actions/connector.gif" alt="Arrow Icon" width="25"/>|This click and drag from this icon to connect the action to a state.|  
  |<img src="/images/Modeling/actions/link.png" alt="Link Icon" width="25" />|This icon appears instead of an arrow, when the transition goes to a state not in the current diagram.|

<!-- |<img src="/images/Modeling/actions/questionOrange.png" alt="Missing Information Action Icon]" width="25" />|This icon appears when the action is not fully defined| -->
<!-- |<img src="/images/Modeling/actions/delete2.png" alt="Red X Icon" width="25"/>|This icon appears when there is an error with the item. Hover over name (not the X) to see a description of the error.| -->

  See [Actions](/Modeling/actions.md) for more information.

## Arrows
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<img src="/images/Modeling/icons/GreenArrow.png" alt="Green Arrow" width="150" />|Indicates a split or adding a new state to the "current states" list when the action is executed, while staying in the state with the event that occured.|
  |<img src="/images/Modeling/icons/GrayArrow.png" alt="Black Arrow" width="150" />|Indicates forced exititing from one state to another when the action is executed.|

  See [Arrows](./diagrams.md#arrows) on the Diagrams page for more information.

## Logic Trees
   ![Fault Tree Editor](/images/Modeling/logicTree/FaultTreeEditor.png) <br>
   
   The icons from the <span style="color:blue">Tools Window</span> and the <span style="color:red">Editing Area</span> are tabulated in the following two subsections.
   
   See [Logic Tree](/Modeling/logicTree.md) for more information.

### Tools Window
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |**Logic Gates**|
  |<img src="/images/Modeling/logicTree/OrGate.png" alt="Or Gate" width="40" />|Drag this icon to add an Or Gate to the Fault Tree|
  |<img src="/images/Modeling/logicTree/AndGate.png" alt="And Gate" width="40" />|Drag this icon to add an And Gate to the Fault Tree|
  |<img src="/images/Modeling/logicTree/NotGate.png" alt="Basic Event" width="40" />|Drag this icon to add a Not Gate to the Fault Tree|

### Editing Area
  |<div style="width:150px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<img src="/images/Modeling/logicTree/OrGateElement.png" alt="Or Gate" width="150" />|Or Gate|
  |<img src="/images/Modeling/logicTree/AndGateElement.png" alt="And Gate" width="150" />|And Gate|
  |<img src="/images/Modeling/logicTree/BasicEventElement.png" alt="Basic Event" width="150" />|Basic Event|
  |<img src="/images/Modeling/logicTree/edit.png" alt="Edit" width="50" />|Click to edit the element|
  |<img src="/images/Modeling/logicTree/CollapseIcon.png" alt="Collapse and Expand" width="25" />|Click to collapse the branches below the gate|
  |<img src="/images/Modeling/logicTree/ExpandIcon.png" alt="Expand" width="25" />|Click to expand the branches below the gate|
 
<!--Copyright 2021 Battelle Energy Alliance-->