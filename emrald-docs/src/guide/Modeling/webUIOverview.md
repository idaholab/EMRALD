
# Web User Interface

## Initial Screen
![Initial Screen](/images/Modeling/webUIOverview/InitialScreenSectionHighlights.PNG) <br>
  This is the screen you will see when you first open the EMRALD model editor. It contains the 
  <span style="color:red">Modeling Area</span>, 
  <span style="color:green">Top Menu Bar</span>, and
  <span style="color:blue">Left Navigation Frame</span>
   which will be explained in the following sections.

## Top Menu Bar
**Project** <br>
  <div style="width:600px">![Project Menu](/images/Modeling/webUIOverview/TopMenuProject.PNG)</div> <br>
  * **New**: Creates a new project. The following window appears in the Modeling Area.<br>
  <div style="width:500px">![New Project Window](/images/Modeling/webUIOverview/NewProject.PNG)</div><br>

      After hitting the "Ok" button, your project name will populate the right corner of the header.<br>![New Project Window](/images/Modeling/webUIOverview/NewProjectHeader.PNG)
  - **Merge:** Merge one project into another project. This will pull in all diagrams, states, events, actions, variables, and logic trees into the project. First it will bring up a File Explorer, browse for the file you want to merge in and click "Open". <br>
  <div style="width:500px">![Open File to Merge Window](/images/Modeling/webUIOverview/Merge_1.PNG)</div><br>
  If there are diagrams or components with identical names in the models being merged, a conflict window will appear with a list of all of the identically named items. There are three options of how to resolve the conflict.
    - Overwrite: The item being merged in will replace the item in the base project.
    - Ignore: The item being merged in will be disregarded and the item in the base project will remain unchanged.
    - Rename: The item being merged in can be renamed and made a new and separate item. A text box will appear in an adjacent column where you can edit the new name of the item being merged in. <br>

    ![Open File to Merge Window](/images/Modeling/webUIOverview/Merge_3.PNG)<br>

  Once you complete your conflict resolution choices, click ""Submit"" and the model will merge into the base model accordingly.
  - **Open:** Browse to open an existing project.
  - **Save:** Operates like a standard "Save As" to save the current project.
  - **Export Templates:** Allows you to save any project template items for use in other projects. When clicked from the dropdown menu, the following window appears in the Modeling Area.<br><div style="width:400px">![Export Template Window](/images/Modeling/webUIOverview/ExportTemplate.PNG)</div>
  - **Load Demo:** Exist the current project and loads the demo project as with any changing of projects, unsaved changes in the current project would be lost.

**Download** <br>
  <div style="width:500px">![Download Menu](/images/Modeling/webUIOverview/TopMenuDownload.PNG)</div> <br>
  - **Solver Engine:** Downloads the EMRALD model solver which is a separate executable.
  - **Client Tester:** Downloads an example test client that couples with EMRALD through message protocal. For use in testing and developing custom software coupling.
  - **Client Tester Source:** Downloads the source code for the Client Tester.

**Help** <br>
  <div style="width:500px">![Help Menu](/images/Modeling/webUIOverview/TopMenuHelp.PNG)</div> <br>
  Opens up a basic help window in the Modeling Area as shown below. <br>
  ![Help Window](/images/Modeling/webUIOverview/Help.PNG) <br>

**About** <br>
  <div style="width:500px">![About Menu](/images/Modeling/webUIOverview/TopMenuAbout.PNG)</div> <br>
  This redirects you to the INL [EMRALD Website](https://google.com) as shown below.<br>
  ![About Menu](/images/Modeling/webUIOverview/AboutRedirect.PNG) <br>

## Left Navigation Frame

### Modeling Pieces
  <img src="/images/Modeling/webUIOverview/ModelingPieces.PNG" alt="Modeling Pieces" width="300"/><br>
  This top half of the Left Navigation Frame allows you to access your Diagrams, Logic Trees, and External Simulations.

**Diagrams** <br>
  <div style="width:300px">![Diagrams Expanded](/images/Modeling/webUIOverview/DiagramsExpanded.PNG)</div> <br>
  By default Diagrams are sorted by Plant, Component, and System Diagrams. However, these categories can be customized by the currently open model or for specific modeling needs. Double clicking on the folders will expand them to reveal the inidividual diagrams. Double clicking on the individual diagrams will open them in the Modeling Area.

  Each diagram represents a particular piece of the model and the various conditions or states that this piece of the model can be in.  These pieces correlate to aspects of traditional PRA modeling and range from small-scale components to a large scope, overall plant response and design.  A diagram contains multiple states with the events that can occur, actions that can be executed and variables used.  These all define how the simulation may sift through the diagram over time.

  Additionally, some diagrams (Component and State) can also be evaluated to a Boolean depending on which stat they are currently in. This is a main feature that when combined with a Component Logic Event, can greatly simplify a model. Unlike the more general plant response diagrams, these diagrams are restricted to only be in one state at a time, in order to execute the evaluation process. 

  Breif descriptions of each diagram type will be explained below but for more information, see [Diagrams](/guide/Modeling/diagrams.md).

* Plant<br>

  ![Diagrams Plant Expanded](/images/Modeling/webUIOverview/PlantDiagram.PNG) <br>
  These diagrams are the main scenarios to be evaluated, similar to Event Trees in traditional PRA.  This diagram has a starting state called Normal Operation.  Other states do general evaluation and movement or be a key end state.  Here the user defines the various states and events that drive the simulation from an initial start state and events to a desired key state. <br>
    
* Component<br>
    
  ![Diagrams Component Expanded](/images/Modeling/webUIOverview/ComponentDiagram.PNG) <br>
  All aspects of a component should be captured in a simple Component Diagram.
  PRA Basic Events are captured by events in one of the component states.
  Events can be shared between different components for a "common cause" effect.
  Component diagrams are required to be "Single State Diagrams" meaning the simulation can only be in one of those states at any given time.
  Each State has a Boolean evaluation value, which can represent things like OK or Failed. <br>

* System<br>
    
  ![Diagrams System Expanded](/images/Modeling/webUIOverview/SystemDiagram.PNG) <br>
  System Diagrams are mainly just a catigorization, but behave similarly to component diagrams.
  A Fault Tree from traditional modeling could be directly converted into System diagram with just two states and a "Component Logic" event used to determine the boolean logic from component diagrams. See [Logic Trees](/guide/Modeling/logicTree.md) and [Events](/guide/Modeling/events.md) for more information.  The two states for this diagram are "Active" and "Failed", with a "Component Logic" event in the active state evaluating the assigned logic whenever a component diagram state changes.  If the logic ever evaluates to false, then the current state shifts from "Active" to "Failed". This is similar to a typical PRA model except the logic does not contain any probabilities, just references to the Component diagrams.
    
**Logic Tree** <br>
  All of logic trees are accessible in this section. Double clicking on the individual Logic Trees will open them in the Modeling Area. <br>
       
  ![Logic Tree Expanded](/images/Modeling/webUIOverview/LogicTree.PNG) <br>
  Logic Trees utilize boolean gates to solve for the top value of the tree which can inform "Component Logic" [events](/guide/Modeling/events.md) in [diagrams](/guide/Modeling/diagrams.md). <br>
  
  See [Logic Tree](/guide/Modeling/logicTree.md) for more information.

**External Sims** <br>
  All of your external simulation links will be available in this section. <br> 
  <div style="width:300px">![External Sims Expanded](/images/Modeling/webUIOverview/ExternalSimsExpanded.PNG)</div><br>
  The External simulations are defined coupled links to an external code, such as physics models that inform the EMRALD model. This is used for special coupling cases to simply run an executable and process the results, use a "Run Application" action as described in the Run Application section of [Types of Actions](./actions.md#types-of-actions).<br>

  See [External Simulations](/guide/Modeling/externalSims.md) for more information.

### Modeling Pieces Tabs 
  The bottom half of the Left Navigation Frame allows you to access your Actions, Events, Variables, and States which are organized by tabs. Actions, events, or states can be dragged from this Navigation Frame into applicable Modeling Areas for use in a diagram.

**Tabs**<br>
  <!--TODO-If have time, make this look nice. 
  I tried but the only way I can unstack the two images in the Global column is to make the column too wide for the text area-Courtney -->
  |<div style="width:150px">All</div>|<div style="width:400px">Global</div>|<div style="width:150px">Local</div>|
  |---|---|---|
  |![All Tab](/images/Modeling/webUIOverview/AllTabs.PNG)|![Global Tab](/images/Modeling/webUIOverview/GlobalTabs.PNG)![Global Tab](/images/Modeling/webUIOverview/GlobalTabOptions.PNG)|![Local Tab](/images/Modeling/webUIOverview/LocalTabs.PNG)|
  |Items from every diagram in the project. |Shows items can be used in any diagram. New Global items must be created through the right-click option of the selected type. Items created in a specific diagram are local to that diagram|Items present in the diagram currently open and being worked on.|

**Actions**<br>
  Actions change the properties or cause movement though a model during a simulation run. <br>

  See [Actions](/guide/Modeling/actions.md) for more information.

**Events**<br>
  Events monitor for specified criteria and can have one or more actions that are executed when that criteria is met. <br>

  See [Events](/guide/Modeling/events.md) for more information.

**Variables**<br>
Variables define a value that can be evaluated or modified by user defied scripts in some events and actions.

See [Variables](/guide/Modeling/variables.md) for more information.

**States**<br>
  States are a logical representation for a current condition in a diagram. <br>

  See [States](/guide/Modeling/states.md) for more information.

<!--Copyright 2021 Battelle Energy Alliance-->