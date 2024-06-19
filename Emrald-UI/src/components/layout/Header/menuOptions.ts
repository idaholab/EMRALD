import { appData, clearCacheData } from '../../../hooks/useAppData';
import { upgradeModel, validateModel } from '../../../utils/Upgrades/upgrade';
import { v4 as uuidv4 } from 'uuid';


export interface MenuOption {
  label: string;
  onClick: (args?: any) => void;
}

export const projectOptions: MenuOption[] = [
  {
    label: 'New',
    onClick: (newProject) => {
      newProject();
    },
  },
  {
    label: 'Open',
    onClick: (populateNewData) => {
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

          try {
            const parsedContent = JSON.parse(content);
              if (parsedContent && parsedContent.hasOwnProperty('emraldVersion')) {
                populateNewData(content);
              } else {
                const upgradedModel = upgradeModel(content);
                if (upgradedModel) {
                  upgradedModel.id = uuidv4();
                  populateNewData(upgradedModel);
                }
              }
          } catch (error) {
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
  },
  {
    label: 'Merge',
    onClick: (mergeNewData) => {
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
            const parsedContent = JSON.parse(content);
              if (parsedContent && parsedContent.hasOwnProperty('emraldVersion')) {
                mergeNewData(content);
              } else {
                const upgradedModel = upgradeModel(content);
                if (upgradedModel) {
                  upgradedModel.id = uuidv4();
                  mergeNewData(upgradedModel);
                }
              }
          } catch (error) {
            console.error('Invalid JSON format');
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
  },
  {
    label: 'Save',
    onClick: async () => {
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
  },
  {
    label: 'Templates',
    onClick: () => {},
  },
  {
    label: 'Load Demo',
    onClick: () => {},
  },
  {
    label: 'Load Results',
    onClick: () => {},
  },
  {
    label: 'Clear Cached Data',
    onClick: () => {
      clearCacheData();
    },
  },
];

export const templateSubMenuOptions: MenuOption[] = [
  {
    label: 'Import Templates',
    onClick: (mergeTemplateToList) => {
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
            const parsedContent = JSON.parse(content);
            parsedContent.forEach((model: any) => {
              if (model && model.hasOwnProperty('emraldVersion')) {
                mergeTemplateToList(model);
              } else {
                const upgradedModel = upgradeModel(JSON.stringify(model));
                if (upgradedModel) {
                  upgradedModel.id = uuidv4();
                  mergeTemplateToList(upgradedModel);
                }
              }
            })
          } catch (error) {
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
  },
  {
    label: 'Export Templates',
    onClick: (templates) => {
      console.log(templates);

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
      a.download = `${appData.value.name ? appData.value.name : 'Untitled_EMRALD_Project'}-templates.json`;

      // Trigger a click event on the <a> element to initiate the download
      a.click();

      // Clean up by revoking the URL
      URL.revokeObjectURL(url);
    },
  },
  {
    label: 'Clear Templates',
    onClick: (clearTemplateList) => {
      clearTemplateList();
    },
  },
];

export const downloadOptions: MenuOption[] = [
  {
    label: 'Solver Engine',
    onClick: () => {
      var link = document.createElement('a');
      link.target = '_blank';
      link.href =
        'https://github.com/idaholab/EMRALD/releases/latest/download/EMRALD_SimEngine.zip'; //The file to download.
      link.click();
    },
  },
  {
    label: 'Client Tester',
    onClick: () => {
      var link = document.createElement('a');
      link.target = '_blank';
      link.href =
        'https://github.com/idaholab/EMRALD/releases/latest/download/XMPPClientTester.zip'; //The file to download.
      link.click();
    },
  },
  {
    label: 'Client Tester Source',
    onClick: () => {
      var link = document.createElement('a');
      link.target = '_blank';
      link.href = 'https://github.com/idaholab/EMRALD/tree/main/XmppClient'; //The file to download.
      link.click();
    },
  },
];
