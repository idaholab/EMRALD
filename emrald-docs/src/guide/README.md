# Introduction

Event Modeling Risk Assessment using Linked Diagrams (EMRALD) is a software tool developed at INL for researching the capabilities of dynamic PRA (Probabilistic Risk Assessment). In order to promote the effective use of dynamic PRA by the general community, EMRALD focuses on the following key aspects:

- Simplifying the modeling process by providing a structure that corresponds to traditional PRA modeling methods
- Providing a user interface (UI) that makes it easy for the user to model and visualize complex interactions
- Allowing the user to couple with other analysis applications such as physics based simulations.  This includes one-way communication for most applications and two-way loose coupling for customizable applications
- Providing the sequence and timing of events that lead to the specified outcomes when calculating results

Traditional aspects of components with basic events, fault trees, and event trees are all captured in a dynamic framework of state diagrams, which are displayed in a user-friendly modeling manner.  Each component is represented by a compact state diagram with basic events driving the current state of that component.  A logic tree using components corresponding to a fault tree can be evaluated dynamically during the simulations. Finally, event trees are captured in a plant response diagram, with events (including those from the dynamic logic evaluation) driving an end state result.  This approach allows the user to implement dynamic methods with only needing to learn the dynamic state aspects of the model.

After running the EMRALD model, the user is able to not only obtain probabilistic results, but also able to see dynamic benefits such as timing and event sequences for specified simulation results.  Additionally, an open standard for communication is used which allows for coupling to other simulation-based or physics-based analysis.   The open standard allows the user to include complex phenomena simulation capabilities such as flood or fire analysis directly in the PRA model.

<!--Copyright 2021 Battelle Energy Alliance-->
