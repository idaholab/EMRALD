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
