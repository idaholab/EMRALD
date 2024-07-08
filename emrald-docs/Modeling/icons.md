---
pageClass: icons-page
---

# Icons

![Diagram Elements](/images/Modeling/diagrams/DiagramElements.png)<br>
Diagram elements are tabulated by States, Events, Actions, and Arrows in the following four sections.

## States
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<img style="width:25px" src="/images/Modeling/states/key.png" alt="KeyIcon" width="25"/>|Indicates a Key State|
  |<img style="width:25px" src="/images/Modeling/states/start.png" alt="StartIcon" width="25"/>|Indicates a Start State|
  |<div style="width:25px">![TerminalIcon](/images/Modeling/states/red-dot.png)</div>|Indicates a Terminal State|

  See [States](/Modeling/states.md) for more information.

## Events
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<div style="width:25px">![Variable Condition Icon](/images/Modeling/events/varCond.png)</div>|Variable Condition Icon|
  |<div style="width:25px">![State Change Icon](/images/Modeling/events/stateChange.png)</div>|State Change Icon|
  |<div style="width:25px">![Component Logic Icon](/images/Modeling/events/compLogic.png)</div>|Component Logic Icon|
  |<div style="width:25px">![External Simulation Icon](/images/Modeling/events/ExtInput.png)</div>|External Simulation Icon|
  |![Timer Icon](/images/Modeling/events/alarm.png)|Timer Icon|
  |<div style="width:25px">![Failure Rate Icon](/images/Modeling/events/dice.png)</div>|Failure Rate Icon|
  |<div style="width:25px">![Distribution Rate Icon](/images/Modeling/events/dist.png)</div>|Distribution Rate Icon|
  |<div style="width:25px">![Exit Parent State Icon](/images/Modeling/events/exit-icon.png)</div>|Exit Parent state when Event is triggered Icon|

  See [Events](/Modeling/events.md) for more information.

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
  |![Link Icon](/images/Modeling/actions/link.png)|This icon appears instead of an arrow, when the transition goes to a state not in the current diagram.|

<!-- |<div style="width:25px">![Missing Information Action Icon](/images/Modeling/actions/questionOrange.png)</div>|This icon appears when the action is not fully defined| -->
<!-- |<img src="/images/Modeling/actions/delete2.png" alt="Red X Icon" width="25"/>|This icon appears when there is an error with the item. Hover over name (not the X) to see a description of the error.| -->

  See [Actions](/Modeling/actions.md) for more information.

## Arrows
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<div style="width:150px">![Green Arrow](/images/Modeling/icons/GreenArrow.png)</div>|Indicates a split or adding a new state to the "current states" list when the action is executed, while staying in the state with the event that occured.|
  |<div style="width:150px">![Black Arrow](/images/Modeling/icons/GrayArrow.png)</div>|Indicates forced exititing from one state to another when the action is executed.|

  See [Arrows](./diagrams.md#arrows) on the Diagrams page for more information.

## Logic Trees
   ![Fault Tree Editor](/images/Modeling/logicTree/FaultTreeEditor.png) <br>
   
   The icons from the <span style="color:blue">Tools Window</span> and the <span style="color:red">Editing Area</span> are tabulated in the following two subsections.
   
   See [Logic Tree](/Modeling/logicTree.md) for more information.

### Tools Window
  |<div style="width:100px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |**Logic Gates**|
  |<div style="width:40px">![Or Gate](/images/Modeling/logicTree/OrGate.png)</div>|Drag this icon to add an Or Gate to the Fault Tree|
  |<div style="width:40px">![And Gate](/images/Modeling/logicTree/AndGate.png)</div>|Drag this icon to add an And Gate to the Fault Tree|
  |<div style="width:40px">![Basic Event](/images/Modeling/logicTree/NotGate.png)</div>|Drag this icon to add a Not Gate to the Fault Tree|

### Editing Area
  |<div style="width:150px">Icon</div>|<div style="width:300px">Description</div>|
  |---|---|
  |<div style="width:150px">![Or Gate](/images/Modeling/logicTree/OrGateElement.png)</div>|Or Gate|
  |<div style="width:150px">![And Gate](/images/Modeling/logicTree/AndGateElement.png)</div>|And Gate|
  |<div style="width:150px">![Basic Event](/images/Modeling/logicTree/BasicEventElement.png)</div>|Basic Event|
  |<div style="width:50px">![Edit](/images/Modeling/logicTree/edit.png)</div>|Click to edit the element|
  |<div style="width:25px">![Collapse and Expand](/images/Modeling/logicTree/CollapseIcon.png)</div>|Click to collapse the branches below the gate|
  |<div style="width:25px">![Expand](/images/Modeling/logicTree/ExpandIcon.png)</div>|Click to expand the branches below the gate|
 
<!--Copyright 2021 Battelle Energy Alliance-->