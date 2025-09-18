# EMRALD V3

## Introduction

The Event Modeling Risk Assessment using Linked Diagrams **(EMRALD V3)** is a React-based application developed at INL for researching the capabilities of dynamic PRA (Probabilistic Risk Assessment). It is a front-end only application, meaning there is no backend server required to run it. Users of EMRALD can craft their models and save them as JSON files, which can then be used to generate results.

## Running the Project

To run EMRALD, follow these steps:

1. Clone the repository from GitHub using the following command:
```
git clone https://github.com/idaholab/EMRALD.git
```

2. Navigate to the project directory and cd into the **Emrald-UI** folder and install the required dependencies by running the following command:
```
npm install
```

3. Start the development server by running the following command:
```
npm run dev
```

4. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## Usage

Once the application is running, you can start crafting your models and saving them as JSON files.
Everything you need to know about learning the software can be found here: [EMRALD Docs](https://emraldapp.inl.gov/docs/)

INL release (v3 while old version is still avaliable)
Go to Pipelines click EMRALD_V3 and run "new Pipeline" 
Go to Releases click "Azure - EMRALD_v3 App New" and Create release
Put "master" in for Azure_ARM and AzureScripts and run
Test in acceptance
Release to Scan
Send email for Scan and push to producion