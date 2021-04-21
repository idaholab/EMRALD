# EMRALD Backend Information

## File References

Files on a local machine or server can be referenced in the following model locations:
- **Action "Run Application":** The field "Executable Location" is the path or command to the executable to be run. See Run Application under [Types of Actions](./actions.md#types-of-actions) for more information.
- **Variable "Document Link":** The field "Doc Path" is the file path to a text document read from and/or written to by the variable. See [Document Link](./variables.md#xxx) for more information.

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
- **Event "Var Condition":** Field "Evaluate Code." See Variable Condition under [Conditional Events](./events.md#conditional-events) for more information.