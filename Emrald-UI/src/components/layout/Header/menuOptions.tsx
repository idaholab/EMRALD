import { appData, clearCacheData } from '../../../hooks/useAppData';
import { upgradeModel, validateModel } from '../../../utils/Upgrades/upgrade';
import { v4 as uuidv4 } from 'uuid';
import {
  SankeyTimelineDiagram,
  type TimelineOptions,
} from '../../diagrams/SankeyTimelineDiagram/SankeyTimelineDiagram';
import type { EMRALD_Model } from '../../../types/EMRALD_Model';
import type { WindowPosition } from '../../../contexts/WindowContext';
import { EMRALD_SchemaVersion } from '../../../types/ModelUtils';

export const projectOptions = {
  New(newProject: () => void) {
    newProject();
  },
  Open(
    populateNewData: (openedModel?: EMRALD_Model) => void,
    setFileName?: (name: string) => void,
  ) {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // Set input type to file
    fileInput.accept = '.json, .emrald'; // Specify accepted file types as JSON
    fileInput.style.display = 'none'; // Hide the file input element

    // Function to handle file selection
    const handleFileSelected = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0]; // Get the selected file

      if (!selectedFile) return; // If no file is selected, exit
      const fileName = selectedFile.name; // Get the filename
      setFileName && setFileName(fileName);
      // Create a FileReader to read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string; // Get the file content as a string

        try {
          const parsedContent = JSON.parse(content) as EMRALD_Model;
          if (!Object.prototype.hasOwnProperty.call(parsedContent, 'emraldVersion') || parsedContent.emraldVersion < EMRALD_SchemaVersion) {
            console.log(`Upgrading from ${parsedContent.emraldVersion}`);
            const upgradedModel = upgradeModel(content);
            if (upgradedModel) {
              upgradedModel.id = uuidv4();
              console.log(upgradedModel);
              populateNewData(upgradedModel);
            }
          } else {
            populateNewData(parsedContent);
          }
        } catch {
          console.error('Invalid JSON format');
        }
      };
      reader.readAsText(selectedFile); // Read the file as text
    };

    // Add an event listener for when a file is selected
    fileInput.addEventListener('change', handleFileSelected, false);

    // Append the file input to the document body
    document.body.appendChild(fileInput);

    // Trigger a click on the file input to open the file dialog
    fileInput.click();
  },
  Merge(mergeNewData: (newModel: EMRALD_Model) => void) {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // Set input type to file
    fileInput.accept = '.json,.emrald'; // Specify accepted file types as JSON
    fileInput.style.display = 'none'; // Hide the file input element

    // Function to handle file selection
    const handleFileSelected = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0]; // Get the selected file

      if (!selectedFile) return; // If no file is selected, exit

      // Create a FileReader to read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string; // Get the file content as a string
        //TODO: Make sure there is no duplicates when merging. If there are show the import form to resolve conflicts.
        try {
          const parsedContent = JSON.parse(content) as EMRALD_Model;
          if (Object.prototype.hasOwnProperty.call(parsedContent, 'emraldVersion')) {
            mergeNewData(parsedContent);
          } else {
            const upgradedModel = upgradeModel(content);
            if (upgradedModel) {
              upgradedModel.id = uuidv4();
              mergeNewData(upgradedModel);
            }
          }
        } catch {
          console.error('Invalid JSON format');
        }
      };
      reader.readAsText(selectedFile); // Read the file as text
    };

    // Add an event listener for when a file is selected
    fileInput.addEventListener('change', handleFileSelected, false);

    // Append the file input to the document body
    document.body.appendChild(fileInput);

    // Trigger a click on the file input to open the file dialog
    fileInput.click();
  },
  Save: async () => {
    //validate the model
    const errors: string[] = await validateModel(appData.value);

    //if error TODO
    if (errors.length > 0) {
      //todo let the user know the errors and report a bug to developers, provide the model if possible
    }
    // Convert JSON data to a string
    const jsonString = JSON.stringify(appData.value, null, 2);

    //todo validate the appData from the latest emrald schema version in types

    // Create a Blob (Binary Large Object) with the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an <a> element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appData.value.name ? appData.value.name : 'Untitled_EMRALD_Project'}.emrald`;

    // Trigger a click event on the <a> element to initiate the download
    a.click();

    // Clean up by revoking the URL
    URL.revokeObjectURL(url);
  },
  Templates() {},
  // {
  //   label: 'Load Demo',
  //   onClick: () => {},
  // },
  'Load Results': (
    addWindow: (
      title: string,
      content: React.ReactNode,
      position?: WindowPosition,
      windowId?: string | null,
      closePrevWindowId?: string,
    ) => void,
  ) => {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // Set input type to file
    fileInput.accept = '.json'; // Specify accepted file types as JSON
    fileInput.style.display = 'none'; // Hide the file input element

    // Function to handle file selection
    const handleFileSelected = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0]; // Get the selected file

      if (!selectedFile) return; // If no file is selected, exit

      // Create a FileReader to read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string; // Get the file content as a string
        //TODO: Make sure there is no duplicates when merging. If there are show the import form to resolve conflicts.
        try {
          const parsedContent = JSON.parse(content) as TimelineOptions;
          parsedContent.name = selectedFile.name;
          // TODO - Opening a results file with a different results file already open displays the same file in both windows
          addWindow(
            `${parsedContent.name} - Results View`,
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              <SankeyTimelineDiagram data={parsedContent} />
            </div>,
          );
        } catch (error) {
          console.error('Invalid JSON format or other error:', error); // Add logging here
        }
        // You can now work with the JSON content here
      };
      reader.readAsText(selectedFile); // Read the file as text
    };

    // Add an event listener for when a file is selected
    fileInput.addEventListener('change', handleFileSelected, false);

    // Append the file input to the document body
    document.body.appendChild(fileInput);

    // Trigger a click on the file input to open the file dialog
    fileInput.click();
  },
  'Clear Cached Data': () => {
    clearCacheData();
  },
  Compare(compareData: (newModel: EMRALD_Model) => void) {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // Set input type to file
    fileInput.accept = '.json,.emrald'; // Specify accepted file types as JSON
    fileInput.style.display = 'none'; // Hide the file input element

    // Function to handle file selection
    const handleFileSelected = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0]; // Get the selected file

      if (!selectedFile) return; // If no file is selected, exit

      // Create a FileReader to read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string; // Get the file content as a string
        //TODO: Make sure there is no duplicates when merging. If there are show the import form to resolve conflicts.
        try {
          const parsedContent = JSON.parse(content) as EMRALD_Model;
          if (Object.prototype.hasOwnProperty.call(parsedContent, 'emraldVersion')) {
            compareData(parsedContent);
          } else {
            const upgradedModel = upgradeModel(content);
            if (upgradedModel) {
              upgradedModel.id = uuidv4();
              compareData(upgradedModel);
            }
          }
        } catch {
          console.error('Invalid JSON format');
        }
      };
      reader.readAsText(selectedFile); // Read the file as text
    };

    // Add an event listener for when a file is selected
    fileInput.addEventListener('change', handleFileSelected, false);

    // Append the file input to the document body
    document.body.appendChild(fileInput);

    // Trigger a click on the file input to open the file dialog
    fileInput.click();
  }
};

export const templateSubMenuOptions = {
  'Import Templates': (mergeTemplateToList: (newTemplate: EMRALD_Model) => void) => {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // Set input type to file
    fileInput.accept = '.json'; // Specify accepted file types as JSON
    fileInput.style.display = 'none'; // Ensure the file input is not visible

    // Function to handle file selection
    const handleFileSelected = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0]; // Get the selected file

      if (!selectedFile) return; // If no file is selected, exit

      // Create a FileReader to read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string; // Get the file content as a string
        try {
          const parsedContent = JSON.parse(content) as EMRALD_Model[];
          parsedContent.forEach((model) => {
            if (Object.prototype.hasOwnProperty.call(model, 'emraldVersion')) {
              mergeTemplateToList(model);
            } else {
              const upgradedModel = upgradeModel(JSON.stringify(model));
              if (upgradedModel) {
                upgradedModel.id = uuidv4();
                mergeTemplateToList(upgradedModel);
              }
            }
          });
        } catch {
          console.error('Invalid JSON format');
        }
      };
      reader.readAsText(selectedFile); // Read the file as text
    };

    // Add an event listener for when a file is selected
    fileInput.addEventListener('change', handleFileSelected, false);

    // Append the file input to the document body
    document.body.appendChild(fileInput);

    // Trigger a click on the file input to open the file dialog
    fileInput.click();
  },
  'Export Templates': (templates: EMRALD_Model[]) => {
    if (templates.length === 0) {
      return 'error';
    }
    // Convert JSON data to a string
    const jsonString = JSON.stringify(templates, null, 2);

    // Create a Blob (Binary Large Object) with the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an <a> element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${
      appData.value.name ? appData.value.name : 'Untitled_EMRALD_Project'
    }-templates.json`;

    // Trigger a click event on the <a> element to initiate the download
    a.click();

    // Clean up by revoking the URL
    URL.revokeObjectURL(url);
  },
  'Clear Templates': (clearTemplateList: () => void) => {
    clearTemplateList();
  },
};

export const downloadOptions = {
  'Solve Engine': () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href =
      'https://github.com/idaholab/EMRALD/releases/latest/download/EMRALD_SimEngine.3_0.zip'; //The file to download.
    link.click();
  },
  'Client Tester': () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = 'https://github.com/idaholab/EMRALD/releases/latest/download/XMPPClientTester.zip'; //The file to download.
    link.click();
  },
  'Client Tester Source': () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = 'https://github.com/idaholab/EMRALD/tree/main/XmppClient'; //The file to download.
    link.click();
  },
  'Desktop Model Editor': () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = 'https://github.com/idaholab/EMRALD/releases/latest/download/emrald_modeler.exe';
    link.click();
  },
  'Source Code': () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = 'https://github.com/idaholab/EMRALD';
    link.click();
  },
};
