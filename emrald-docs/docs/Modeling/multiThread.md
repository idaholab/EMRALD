# Multi-Thread Solving
To speed up the simulation process, EMRALD has a built-in feature to allow multi-thread solving. Any files referenced by the model will be copied into a seperate folder for each thread to avoid conflicts. File paths may be specified in the [Change Variable Value](./actions.md#types-of-actions) and [Run Application](./actions.md#types-of-actions) Actions, the [Variable Condition](./events.md#conditional-events) Event, and the [Document Link](./variables.md#document-link-variable) Variable. Debug mode is disabled while multi-thread solving is enabled.


## Setup
To enable multi-threaded solving, check the box next to "Multi Threaded". <br>
<img src="/images/Modeling/multiThread/multiThreadBox.png" style="width:1000px"><br>
Any references to paths or file locations within the model are parsed and recorded. Upon selection, the user will be prompted to verify their path references to any items within their model that need to be copied for each variable. Copied items can be added or removed with their corresponding buttons on the right.<br>
<img src="/images/Modeling/multiThread/multiThreadPathRef.png" style="width:1000px"><br>
The user will then be able to specify the number of threads to run the simulation. By default, the number of available threads up to 75% of the total threads are selected. The dropdown menu "Showing Thread" specficies which thread will have its results shown in the results monitor.<br>
<img src="/images/Modeling/multiThread/multiThreadCount.png" style="width:1000px"><br>

## Running and Results
Once configured, the simulation can be run with the "Run" button. Items specified in the path references prompt will be copied to the users AppData/Roaming/Emrald folder. Here, a folder containing the copied items, path results, and simulation results is generated for each thread specified. To aovid clutter, these files may be cleared automatically after the simulation by checking the "Clear Thread Files" box next to the "Multi Threaded" box. The folder names are of the format: <br>
"[FileName]_T[ThreadNumber]"<br>
<img src="/images/Modeling/multiThread/multiThreadFolders.png" style="width:1000px"><br>

Once the simulation is finished, the results across all the threads are summed and output in the solver table.

For more information regarding multi-thread solving, see [EMRALD Backend Information](./backendInfo.md#Multi-Thread-Solving)






<!--Copyright 2021 Battelle Energy Alliance-->