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
		- First-time setup:
			1. Download and install Node.js from [https://nodejs.org/en/](https://nodejs.org/en/)
			2. Open the Emrald-UI folder in a terminal window
			3. Run the command `npm install` to install the project's dependencies
			4. Run the command `npm run build` to compile the project
			5. Run the command `npm run preview`. A link to "localhost" will appear in the terminal. Hold the ctrl key and click this link to open EMRALD in your browser.
		- After first-time setup:
			1. Open the Emrald-UI folder in a terminal window
			2. Run the command `npm run preview`. A link to "localhost" will appear in the terminal. Hold the ctrl key and click this link to open EMRALD in your browser.
	- To run (debug) the Simulator Project:
		1. Right-click on "EMRALD_Sim" in the Solution Explorer
		2. Under "Debug," select "Start New Instance"
    - To run the Documentation Project:
        1. Download and install Node.js from [https://nodejs.org/en/](https://nodejs.org/en/) (This will also install npm)
        2. Once Node.js is installed, navigate to the "emrald-docs" directory (i.e. \EMRALD\emrald-docs) in a terminal window (such as Command Prompt)
        3. Run the commmand `npm install` to install the project's dependencies
        4. Start the local dev server by running the command `npm run dev`
        5. Once the server is running, a message will appear with a link to "localhost". Hold the ctrl key and click this link to open the documentation in your browser.
	- To build the offline executable:
		1. Install C++ Build Tools, from within Visual Studio or from [https://visualstudio.microsoft.com/visual-cpp-build-tools/](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
		2. Install WebView2 by downloading the Evergreen Standalone Installer from [https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section)
		3. Install Rust from [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
		4. Install Node.js & NPM from [https://nodejs.org/en/](https://nodejs.org/en/)
		5. Build dependencies by running `npm install` in the root directory
		6. Build the executable by running `npm run build` in the root directory
		- If you are behind a firewall, the tauri build may fail to fetch some requirements. If this happens, the requirements can be manually downloaded.
			1.	Create a folder called “tauri” in AppData/Local
			2.	Download wix314-binaries.zip from https://github.com/wixtoolset/wix3/releases
			3.	Create a folder called “WixTools314” in AppData/Local/tauri
			4.	Extract the contents of wix314-binaries.zip into the WixTools314 folder
			5.	Download https://github.com/tauri-apps/binary-releases/releases/download/nsis-3/nsis-3.zip
			6.	Create a folder called “NSIS” in AppData/Local/tauri
			7.	Extract the contents of the folder in nsis-3.zip into the NSIS folder, so that the
			NSIS folder contains the nsis.exe file at the top level.
			8.	Download https://github.com/tauri-apps/nsis-tauri-utils/releases/download/nsis_tauri_utils-v0.4.1/nsis_tauri_utils.dll
			9.	Move nsis_tauri_utils.dll into AppData/Local/tauri/NSIS/Plugins/x86-unicode 
	- To compile the Sankey diagrams:
		1. Install Node.js & NPM from [https://nodejs.org/en/](https://nodejs.org/en/)
		2. Install Yarn by running `corepack enable` in the root directory
		3. In the d3-sankey-timeline directory, run `yarn build` to compile the project



## EMRALD Projects
 - EMRALD_Sim
 - Emrald_Site
 - Emrald-UI
 - emrald-docs
 - MessageDefLib
 - SimulationDAL
 - SimulationEngine
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
