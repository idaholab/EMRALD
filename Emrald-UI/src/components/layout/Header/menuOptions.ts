import { appData, clearCacheData } from "../../../hooks/useAppData";

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

      // Function to handle file selection
      const handleFileSelected = (event: Event) => {
        const input = event.target as HTMLInputElement;
        const selectedFile = input.files?.[0]; // Get the selected file

        if (!selectedFile) return; // If no file is selected, exit

        // Create a FileReader to read the file content
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string; // Get the file content as a string
          populateNewData(content);

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
    label: 'Merge',
    onClick: (mergeNewData) => {
      // Create a new file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file'; // Set input type to file
      fileInput.accept = '.json'; // Specify accepted file types as JSON

      // Function to handle file selection
      const handleFileSelected = (event: Event) => {
        const input = event.target as HTMLInputElement;
        const selectedFile = input.files?.[0]; // Get the selected file

        if (!selectedFile) return; // If no file is selected, exit

        // Create a FileReader to read the file content
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string; // Get the file content as a string
          mergeNewData(content);

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
    onClick: () => {
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
      a.download = `${
        appData.value.name ? appData.value.name : 'Untitled_EMRALD_Project'
      }.emrald`;

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
    onClick: () => {clearCacheData();}
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
