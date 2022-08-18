# Validation Cases

Validation cases are test cases that have been added to the EMRALD [Testing Project](https://github.com/idaholab/EMRALD/tree/main/UnitTesting_Simulation).  The purpose of these tests is to validate that specifically designed models work properly when used as an input to the EMRALD Simulator.

The navigation menu to the left contains a list of validation cases that have been completed.  Clicking on a case will navigate you to a page to show details about that case.

## How to Add a New Validation Case
1. Use git to create a new branch for adding this validation case: `git checkout -b validationCase/{caseName}`
1. Create a new test method in the file `UnitTesting_Simulation\ValidationTests.cs` by coping and pasting the template method: `Template_ValidationCase_Test()`
1. Place the test model inside `UnitTesting_Simulation\TestingFiles\Models\ValidationModels\` and ensure the test model's file name matches exactly the name of the new test method with a `.json` extension (ex. `Template_ValidationCase_Test.json`).
1. Place the file with the expected results inside `UnitTesting_Simulation\TestingFiles\Models\ValidationModels\` and ensure the file name matches exactly the name of the new test method with the following appended to the end of it, as appropriate:
   - `_res.txt` for normal results (ex. `Template_ValidationCase_Test_res.txt`)
   - `_paths.txt` for path out results (ex. `Template_ValidationCase_Test_paths.txt`)
   - `_jsonResults.json` for JSON results (ex. `Template_ValidationCase_Test_jsonResults.json`)
1. Edit the test method and options as necessary.
1. Confirm the test works by right-clicking the method name and selecting `Run Tests` in Visual Studio.
1. Once the test method is confirmed as passing, add a new page for the test case in this documentation. Instructions for doing this can be found in [the template page](./cases/template)
1. Commit your changes in git and push them up to github.
1. [Create a Pull Request in Github](https://github.com/idaholab/EMRALD/compare) to merge your branch into the `main` branch.
1. The EMRALD Team will review the changes and decide whether or not to complete the pull request.


<!--Copyright 2021 Battelle Energy Alliance-->
