# CODENAME ACRONYM
Event Modeling Risk Assessment using Linked Diagrams (EMRALD) 

Event Modeling Risk Assessment using Linked Diagrams (EMRALD) is a software tool developed at INL for researching the capabilities of dynamic PRA (Probabilistic Risk Assessment). In order to promote the effective use of dynamic PRA by the general community, EMRALD focuses on the following key aspects: 
 - Simplifying the modeling process by providing a structure that corresponds to traditional PRA modeling methods.
 - Providing a user interface (UI) that makes it easy for the user to model and visualize complex interactions.
 - Allowing the user to couple with other analysis applications such as physics based simulations. This includes one-way communication for most applications and two-way loose coupling for customizable applications.
 - Providing the sequence and timing of events that lead to the specified outcomes when calculating results.
 - Traditional aspects of components with basic events, fault trees, and event trees are all captured in a dynamic framework of state diagrams, which are displayed.

## SETUP
1. Clone this repository to your machine using `git clone https://github.com/idaholab/EMRALD.git`
	- To avoid unexpected problems during setup, it is strongly recommended to NOT use Visual Studio to clone the repository
2. When the cloning is complete, open "EMRALD.sln" in Visual Studio.
	- This project uses .NET 6, which is not supported in versions of Visual Studio below Visual Studio 2022. [Click here for more info on .NET 6 support](https://devblogs.microsoft.com/dotnet/announcing-net-6/#support). If .NET 6 is not installed, it can be downloaded from [https://dotnet.microsoft.com/en-us/download/dotnet/6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0). Please ensure this is installed before attempting to run any of the EMRALD projects.
	- If needed, a .NET 5 version of EMRALD exists on the [legacy/dotnet5](https://github.com/idaholab/EMRALD/tree/legacy/dotnet5) branch. 
3. In Visual Studio's Solution Explorer, there will be several projects listed.  These are shown in the [EMRALD Projects](#emrald-projects) section below.  The three primary projects are the website used for building models, the desktop application used for running simulations, and the documentation project for getting started with EMRALD and learning how to use it.
	- To run (debug) the Website project:
		1. After loading the solution in Visual Studio and all packages have been restored, run the `RunFirst.bat` file in the `Emrald_Site` folder. After doing this step one time, it only needs to be done when NuGet packages have been changed or updated (if the site fails to load properly, this may be an indicator that this script needs to be run again).
			1. To run this file from Visual Studio, right-click on the `Emrald_Site` project and select `Open in Terminal`.  
			2. In the terminal window that appears, type `.\RunFirst.bat` and hit enter.
			3. This will copy the needed dependencies for the Emrald_Site project that could not be restored by Visual Studio
			4. Upon completion, a success message should appear.
		2. Right-click on "Emrald_Site" in the Solution Explorer
		3. Select "View in Browser"
	- To run (debug) the Simulator Project:
		1. Right-click on "EMRALD_Sim" in the Solution Explorer
		2. Under "Debug," select "Start New Instance"
    - To run the Documentation Project:
        1. Download and install Node.js from [https://nodejs.org/en/](https://nodejs.org/en/) (This will also install npm)
        2. Once Node.js is installed, navigate to the "emrald-docs" directory (i.e. \EMRALD\emrald-docs) in a terminal window (such as Command Prompt)
        3. Run the commmand `npm install` to install the project's dependencies
        4. Start the local dev server by running the command `npm run dev`
        5. Once the server is running, this message should appear: `VuePress dev server listening at http://localhost:8080/`
        6. Navigate to [http://localhost:8080/](http://localhost:8080/) to view the EMRALD Documentation.
	- To build the offline executable:
		1. Install C++ Build Tools, from within Visual Studio or from [https://visualstudio.microsoft.com/visual-cpp-build-tools/](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
		2. Install WebView2 by downloading the Evergreen Standalone Installer from [https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section)
		3. Install Rust from [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
		4. Install Node.js & NPM from [https://nodejs.org/en/](https://nodejs.org/en/)
		5. Build dependencies by running `npm install` in the root directory
		6. Build the executable by running `npm build` in the root directory
    - To run JavaScript unit tests:
		1. Install Node.js & NPM from [https://nodejs.org/en/](https://nodejs.org/en/)
		2. Build dependencies by running `npm install` in the root directory
		3. Start the testing app by running `npm test` in the root directory
		4. Visit [https://localhost:8080/](http://localhost:8080) to view the test results
	- To generate a JavaScript coverage report:
		1. Install Node.js & NPM from [https://nodejs.org/en/](https://nodejs.org/en/)
		2. Build dependencies by running `npm install` in the root directory
		3. Generate files required for coverage by running `npm run coverage` in the root directory
		4. Visit [https://localhost:8080/](http://localhost:8080) to view the test results and generate the coverage data
		5. Run `npx nyx report --reporter=html` to generate the HTML coverage report
		6. Visit [./coverage/index.html](./coverage/index.html) to view the coverage results



## EMRALD Projects
 - EMRALD_Sim
 - Emrald_Site
 - emrald-docs
 - MessageDefLib
 - SimulationDAL
 - SimulationEngine
 - src-tauri
 - Testing
 - XmppClient
 - XmppServerController


### Other Software
Idaho National Laboratory is a cutting edge research facility which is a constantly producing high quality research and software. Feel free to take a look at our other software and scientific offerings at:

[Primary Technology Offerings Page](https://www.inl.gov/inl-initiatives/technology-deployment)

[Supported Open Source Software](https://github.com/idaholab)

[Raw Experiment Open Source Software](https://github.com/IdahoLabResearch)

[Unsupported Open Source Software](https://github.com/IdahoLabCuttingBoard)

### License

Copyright 2021 Battelle Energy Alliance, LLC

Licensed under the MIT (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  https://opensource.org/licenses/MIT

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.



Licensing
-----
This software is licensed under the terms you may find in the file named "LICENSE" in this directory.


Developers
-----
By contributing to this software project, you are agreeing to the following terms and conditions for your contributions:

You agree your contributions are submitted under the Apache-2 license. You represent you are authorized to make the contributions and grant the license. If your employer has rights to intellectual property that includes your contributions, you represent that you have received permission to make contributions and grant the required license on behalf of that employer.
