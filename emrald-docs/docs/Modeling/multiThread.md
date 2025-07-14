# Multi-Thread Solving
To speed up the simulation process, EMRALD has a built-in feature to allow multi-threaded solving.
## Setup
To enable multi-threaded solving, check the box next to "Multi Threaded". <br>
<img src="/images/Modeling/multiThread/multiThreadBox.png" style="width:1000px"><br>
Any references to paths or file locations within the model are parsed and recorded. This is so that these files can later be copied to avoid conflicts with threads reading or writing to the same file. Upon selection, the user will be prompted to verify or modify their path references to any items within their model that need to be copied.<br>
<img src="/images/Modeling/multiThread/multiThreadPathRef.png" style="width:1000px"><br>
The user will then be able to specify the number of threads to run the simulation. By defualt, 75% of the total threads are selected. The dropdown menu "Showing Thread" specficies which thread will have its results shown in the simulator table.<br>
<img src="/images/Modeling/multiThread/multiThreadCount.png" style="width:1000px"><br>

## Running and Results
Once configured, the simulation can be run with the "Run" button. Items specified in the path references prompt will be copied to the users AppData/Roaming/Emrald folder. Here, a folder containing the copied items, path results, and simulation results is generated for each thread specified. The folder names are of the format: <br>
"[FileName]_T[ThreadNumber]"<br>
<img src="/images/Modeling/multiThread/multiThreadFolders.png" style="width:1000px"><br>

Once the simulation is finished, the results across all the threads are summed and output in the solver table.

For more information regarding multi-thread solving, see [EMRALD Backend Information](./backendInfo.md#Multi-Thread-Solving)






<!--Copyright 2021 Battelle Energy Alliance-->