# Validation Cases
Validation cases are test cases that have been added to the [EMRALD Testing Project](https://github.com/idaholab/EMRALD/tree/main/VandV_Testing) (opens new window). The purpose of these tests is to validate that specifically designed models work properly when used as an input to the EMRALD Simulator.

## Internal Testing Coverage

**Unit and Integration Tests**  
Focus on entities with limited dependencies; includes positive and negative cases.  
- **SimDAL_Testing** - validates model pieces are read correctly.  
- **ItemValue_Testing** - checks single-object function calculations.  

**System and Regression Tests**  
Ensure the solve engine features behave as intended and stay stable; includes positive and negative cases.  
- **ActionTests** - verify actions behave as expected in simulations.  
- **EventTests** - verify events trigger as defined.  
- **VariableTests** - confirm event-driven variable updates.  
- **LogicTreeTests** - confirm logic trees produce correct Boolean outputs.  
- **DiagramTests** - verify diagram functionality matches documentation.  
- **SimEngineTests** - general simulation and result-generation checks.  

## Other Testing

**Manual Tests**
Manual tests focus on system and acceptance testing that currently don�t have an automated way for evaluation. These are kept to a minimum and are only for critical features. All the manual tests are currently in the same testing file but could be broken out into different categories in the future. When manual tests are run, instructions are given to the tester along with expected outcome and they are asked if the test gave correct results.

**User Validation Tests**
These tests ensure that the software fulfills the needs of its users and changes do not affect those needs. For steps to create and contribute new validation cases, see [User Validation Setup](user-validation-setup).

# How to Add a New Validation Case
1. Use git to create a new branch for adding this validation case: git checkout -b validationCase/{caseName}
2. Create a new test method in the file UnitTesting_Simulation\ValidationTests.cs by coping and pasting the template method: Template_ValidationCase_Test().
3. Place the test model inside UnitTesting_Simulation\TestingFiles\Models\ValidationModels\ and ensure the test model's file name exactly matches the new test method's name with a .json extension (ex. Template_ValidationCase_Test.json).
4. Place the file with the expected results inside UnitTesting_Simulation\TestingFiles\Models\ValidationModels\ and ensure the file name exactly matches the new test method's name with the following appended to the end of it, as appropriate:
    - _res.txt for normal results (e.g., Template_ValidationCase_Test_res.txt)
    - _paths.txt for path out results (e.g., Template_ValidationCase_Test_paths.txt)
    - _jsonResults.json for JSON results (e.g., Template_ValidationCase_Test_jsonResults.json)
5. Edit the test method and options as necessary.
6. Confirm the test works by right-clicking the method name and selecting Run Tests in Visual Studio.
7. Once the test method is confirmed as passing, add a new page for the test case in this documentation. Instructions for doing this can be found in the template page
8. Commit your changes in git and push them up to GitHub.
9. Create a "Pull Request" in GitHub (opens new window)to merge your branch into the main branch.
10. The EMRALD Team will review the changes and decide whether or not to complete the pull request.
