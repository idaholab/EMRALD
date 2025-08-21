# EMRALD Backend Information

## File References and relative paths

Files on a local machine or server can be referenced in the following model locations:
- **Action "Run Application":** The field "Executable Location" is the path (full or relative to the model location) or command to the executable to be run. The pre and post processing script can also specify file paths and be relative, script relative paths for this action are from the exe location. See Run Application under [Types of Actions](./actions.md#types-of-actions) for more information.
- **Variable "Document Link":** The field "Doc Path" is the file path to a text document read from and/or written to by the variable. Relative paths are from the model location. See [Document Link Variable](./variables.md#variable-scope) for more information.
- **Event "Var Condition":** The script fields can have file or relative paths to a text document or other item. Relative paths are from the model location. See [Var Condition](./events.md#conditional-events) for more information.
- **Action "Change Var Value":** The script field can have file or relative paths to a text document or other item. Relative paths are from the model location. See [Change Variable Value](./variables.md#types-of-actions) for more information.

The other files EMRALD references or creates are done in the simulation engine through the GUI or the command line (See [EMRALD Solver](solver.md) and the [Command Line Options](cmdLineOptions.md) for more details):
- **UI "Basic Run Loc":** Specifies the location for the basic results file, can also be passed in through the command line.
- **UI "Path Results Loc":** Specifies the location for the JSON path results file, can also be passed in through command line.
- **UI "Debug" option:** If the user specifies this option, then a debug.txt file is saved to the location where the EMRALD solve engine is executed from, overwriting any previous debug file.

## Dynamic Scripts

EMRALD runs user defined scripts to perform evaluations and post process data. These scripts have access to the following .net libraries:
- System.IO
- System.Collections.Generic
- MathNet.Numerics.Distributions
- Newtonsoft.json

Users can define scripts in the following locations:
- **Action "Run Application":** Fields "Preprocess Code" and "Postprocess Code." See Run Application under [Types of Actions](./actions.md#types-of-actions) for more information.
- **Action "Change Var Value":** Fields "New Code Value" and See New Code Value under [Types of Actions](./actions.md#types-of-actions) for more information.
- **Event "Var Condition":** Field "Evaluate Code." See Variable Condition under [Conditional Events](./events.md#conditional-events) for more information.
- **Event "Ext Simulation":** Field "Evaluate Code." See Variable Condition under [Conditional Events](./events.md#conditional-events) for more information.

## Default Variables

All custom user scripts can use the following default variables:
- **CurTime** type[double]: The current time of the simulation in hours.
- **RunIdx** type[int]: The current index or count of simulations run in this batch.


The "Run Application" action, see Run Application under [Types of Actions](./actions.md#types-of-actions) also has the following:
Preprocess Code
- **ExePath** type[string]: The path to the application being run.
Postprocess Code
- **ExeExitCode** type[int]: Exit code of the application that ran.
- **OutputFile** type[string]: The path to any text written to standard out when executing the application.


The "Var Condition" event, see Variable Condition under [Conditional Events](./events.md#conditional-events), also has the following:
- **NextEvTime** type[double]: The simulation time for the next event in EMRALD.

## Multi-Thread Solving

This option makes a copy of the model and nesessary files for each thread. Then EMRALD runs starts up multiple threads and runs the different copies of the model. Once all the treads are done, then it compiles the text and JSON path results back together and places them in location specified by the user for running the model. For most projects this should be fairly simple, but for projects that use and external executable than the user will have to make sure all the nessisary files are also coppied by using the UI when first specifying to run the model in multi-thread mode. All temporary files are saved in seprate folders in appdata/Roaming/EMRALD/. File paths are converted into relative and relative path rules are maintained as stated above. 

<!--Copyright 2021 Battelle Energy Alliance-->