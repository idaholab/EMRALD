Testing instructions. For more detailed instructions, see the official V&V Testing Plan.

Public Contribution - Users can add V&V tests that will be run before major releases. Only contributions that follow these steps will be accepted into the source code through a git pull request
	1. Create a new branch from the main project
	2. Create and add UserValidationDoc in the /TestingFiles/UserValidationDocs folder, you can use the template provided in the folder.
	2. Create a new test in UserValidationTests at the bottom following the first example template.
	3. Run the test using the visual studio test explorer, saving the results file if needed and verify the results are correct.
	4. Push the branch and make a pull request.

Developers Summary- (Follow the full process outlined in the Testing Plan)
	If it is a unit test, add it to the VandV_Testing code.
	If it is a integration or system test, add it to IntegerationTsting_Simulation code.
	If it is a manual test add to the MantualTests code and add a section to the applicable document in /TestingFiles/ManualTestInstructions/ or create a new one if none are applicable.	

	To run tests for an official major verion release:
		1. Open command propmt and run -  dotnet test VandV_Testing/testing.csproj --logger "html;LogFileName=TestResults.html"
		2. Print the results html file and copy to ??? as part of the V&V.