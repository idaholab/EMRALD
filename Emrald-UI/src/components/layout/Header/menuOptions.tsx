import type { ReactNode } from 'react';
import type { WindowPosition } from '../../../contexts/WindowContext';
import type { EMRALD_Model } from '../../../types/EMRALD_Model';
import { v4 as uuidv4 } from 'uuid';
import { appData, clearCacheData } from '../../../hooks/useAppData';
import { EMRALD_SchemaVersion } from '../../../types/ModelUtils';
import {
  type ModelValidationResult,
  upgradeModel,
  validateModel,
} from '../../../utils/Upgrades/upgrade';
import {
  SankeyTimelineDiagram,
  type TimelineOptions,
} from '../../diagrams/SankeyTimelineDiagram/SankeyTimelineDiagram';

function normalizeModelObjType(model: EMRALD_Model): EMRALD_Model {
  type StateWithLegacyGeometry = EMRALD_Model['StateList'][number] & {
    geometry?: unknown;
  };

  type LogicNodeWithLegacyRootName = EMRALD_Model['LogicNodeList'][number] & {
    rootName?: string;
  };

  const normalizeState = (state: EMRALD_Model['StateList'][number]) => {
    const { geometry: _geometry, ...stateWithoutGeometry }
      = state as StateWithLegacyGeometry;
    return stateWithoutGeometry;
  };

  const normalizeLogicNode = (
    logicNode: EMRALD_Model['LogicNodeList'][number],
  ) => {
    const { rootName, isRoot, ...logicNodeWithoutRootName }
      = logicNode as LogicNodeWithLegacyRootName;
    return {
      ...logicNodeWithoutRootName,
      isRoot: isRoot || rootName === logicNode.name,
    };
  };

  return {
    ...model,
    objType: 'EMRALD_Model',
    StateList: model.StateList.map(state => normalizeState(state)),
    LogicNodeList: model.LogicNodeList.map(logicNode => normalizeLogicNode(logicNode)),
    templates: model.templates?.map(template => normalizeModelObjType(template)),
  };
}

export const projectOptions = {
  New(newProject: () => void) {
    newProject();
  },
  Open(
    populateNewData: (openedModel?: EMRALD_Model) => void,
    setFileName?: (name: string) => void,
    handleModelError?: (message: string) => void,
  ) {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // Set input type to file
    fileInput.accept = '.json, .emrald'; // Specify accepted file types as JSON
    fileInput.style.display = 'none'; // Hide the file input element

    // Function to handle file selection
    const handleFileSelected = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0]; // Get the selected file

      if (!selectedFile) {
        return; // If no file is selected, exit
      }
      const fileName = selectedFile.name; // Get the filename
      if (setFileName) {
        setFileName(fileName);
      }

      const content = await selectedFile.text(); // Read the file as text
      try {
        const parsedContent = JSON.parse(content) as EMRALD_Model;
        if (
          !Object.prototype.hasOwnProperty.call(parsedContent, 'emraldVersion')
          || parsedContent.emraldVersion < EMRALD_SchemaVersion
        ) {
          const upgradedModel = upgradeModel(content);
          if (upgradedModel) {
            upgradedModel.id = uuidv4();
            populateNewData(normalizeModelObjType(upgradedModel));
          }
        } else {
          populateNewData(normalizeModelObjType(parsedContent));
        }
      } catch (error) {
        console.error('Invalid JSON format');
        console.error(error);
        if (handleModelError) {
          handleModelError((error as Error).message);
        }
      }
    };

    // Add an event listener for when a file is selected
    fileInput.addEventListener(
      'change',
      ev => void handleFileSelected(ev),
      false,
    );

    // Append the file input to the document body
    document.body.append(fileInput);

    // Trigger a click on the file input to open the file dialog
    fileInput.click();
  },
  Merge(
    mergeNewData: (newModel: EMRALD_Model) => void,
    handleModelError?: (message: string) => void,
  ) {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // Set input type to file
    fileInput.accept = '.json,.emrald'; // Specify accepted file types as JSON
    fileInput.style.display = 'none'; // Hide the file input element

    // Function to handle file selection
    const handleFileSelected = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0]; // Get the selected file

      if (!selectedFile) {
        return; // If no file is selected, exit
      }

      const content = await selectedFile.text(); // Read the file as text
      // TODO: Make sure there is no duplicates when merging. If there are show the import form to resolve conflicts.
      try {
        const parsedContent = JSON.parse(content) as EMRALD_Model;
        if (
          Object.prototype.hasOwnProperty.call(parsedContent, 'emraldVersion')
        ) {
          mergeNewData(normalizeModelObjType(parsedContent));
        } else {
          const upgradedModel = upgradeModel(content);
          if (upgradedModel) {
            upgradedModel.id = uuidv4();
            mergeNewData(normalizeModelObjType(upgradedModel));
          }
        }
      } catch (error) {
        console.error('Invalid JSON format');
        if (handleModelError) {
          handleModelError((error as Error).message);
        }
      }
    };

    // Add an event listener for when a file is selected
    fileInput.addEventListener(
      'change',
      ev => void handleFileSelected(ev),
      false,
    );

    // Append the file input to the document body
    document.body.append(fileInput);

    // Trigger a click on the file input to open the file dialog
    fileInput.click();
  },
  Save: async (
    confirmInvalidModelSave?: (
      validationResult: ModelValidationResult,
    ) => boolean | Promise<boolean>,
  ) => {
    const data = normalizeModelObjType(structuredClone(appData.value));
    data.desc = data.desc ?? ''; // Ensure desc is a string before validating and saving.

    const validationResult = validateModel(data);
    if (!validationResult.valid) {
      console.error('Model validation errors:', validationResult.errors);
      const shouldSave = confirmInvalidModelSave
        ? await confirmInvalidModelSave(validationResult)
        : window.confirm(
            `This model does not match EMRALD schema ${validationResult.schemaVersion.toString()}. Save anyway?`,
          );

      if (!shouldSave) {
        return;
      }
    }

    const jsonString = JSON.stringify(data, null, 2);

    // Create a Blob (Binary Large Object) with the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an <a> element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name === undefined || data.name.length === 0 ? 'Untitled_EMRALD_Project' : data.name}.emrald`;

    // Trigger a click event on the <a> element to initiate the download
    a.click();

    // Clean up by revoking the URL
    URL.revokeObjectURL(url);
  },
  Templates() {},
  'Load Results': (
    addWindow: (
      title: string,
      content: ReactNode,
      position?: WindowPosition,
      windowId?: string | null,
      closePrevWindowId?: string,
    ) => void,
    handleModelError?: (message: string) => void,
  ) => {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // Set input type to file
    fileInput.accept = '.json'; // Specify accepted file types as JSON
    fileInput.style.display = 'none'; // Hide the file input element

    // Function to handle file selection
    const handleFileSelected = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0]; // Get the selected file

      if (!selectedFile) {
        return; // If no file is selected, exit
      }

      const content = await selectedFile.text(); // Read the file as text
      // TODO: Make sure there is no duplicates when merging. If there are show the import form to resolve conflicts.
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
        console.error('Invalid JSON format or other error:', error);
        if (handleModelError) {
          handleModelError((error as Error).message);
        }
      }
    };

    // Add an event listener for when a file is selected
    fileInput.addEventListener(
      'change',
      ev => void handleFileSelected(ev),
      false,
    );

    // Append the file input to the document body
    document.body.append(fileInput);

    // Trigger a click on the file input to open the file dialog
    fileInput.click();
  },
  'Clear Cached Data': () => {
    clearCacheData();
  },
  Compare(
    compareData: (newModel: EMRALD_Model) => void,
    handleModelError?: (message: string) => void,
  ) {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // Set input type to file
    fileInput.accept = '.json,.emrald'; // Specify accepted file types as JSON
    fileInput.style.display = 'none'; // Hide the file input element
    fileInput.id = 'compare-file-input';
    // Add a label so the unit testing framework can interact with it
    const inputLabel = document.createElement('label');
    inputLabel.innerHTML = 'Upload Model To Compare';
    inputLabel.setAttribute('for', 'compare-file-input');

    // Function to handle file selection
    const handleFileSelected = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0]; // Get the selected file

      if (!selectedFile) {
        return; // If no file is selected, exit
      }

      const content = await selectedFile.text(); // Read the file as text
      // TODO: Make sure there is no duplicates when merging. If there are show the import form to resolve conflicts.
      try {
        const parsedContent = JSON.parse(content) as EMRALD_Model;
        if (
          Object.prototype.hasOwnProperty.call(parsedContent, 'emraldVersion')
        ) {
          compareData(normalizeModelObjType(parsedContent));
        } else {
          const upgradedModel = upgradeModel(content);
          if (upgradedModel) {
            upgradedModel.id = uuidv4();
            compareData(normalizeModelObjType(upgradedModel));
          }
        }
      } catch (error) {
        console.error('Invalid JSON format');
        if (handleModelError) {
          handleModelError((error as Error).message);
        }
      }
      fileInput.remove();
      inputLabel.remove();
    };

    // Add an event listener for when a file is selected
    fileInput.addEventListener(
      'change',
      ev => void handleFileSelected(ev),
      false,
    );

    // Append the file input to the document body
    document.body.append(fileInput);
    document.body.append(inputLabel);

    // Trigger a click on the file input to open the file dialog
    fileInput.click();
  },
};

export const templateSubMenuOptions = {
  'Import Templates': (
    mergeTemplateToList: (newTemplate: EMRALD_Model) => void,
    handleModelError?: (message: string) => void,
  ) => {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // Set input type to file
    fileInput.accept = '.json'; // Specify accepted file types as JSON
    fileInput.style.display = 'none'; // Ensure the file input is not visible

    // Function to handle file selection
    const handleFileSelected = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0]; // Get the selected file

      if (!selectedFile) {
        return; // If no file is selected, exit
      }

      const content = await selectedFile.text(); // Read the file as text
      try {
        const parsedContent = JSON.parse(content) as EMRALD_Model[];
        for (const model of parsedContent) {
          if (Object.prototype.hasOwnProperty.call(model, 'emraldVersion')) {
            mergeTemplateToList(normalizeModelObjType(model));
          } else {
            const upgradedModel = upgradeModel(JSON.stringify(model));
            if (upgradedModel) {
              upgradedModel.id = uuidv4();
              mergeTemplateToList(normalizeModelObjType(upgradedModel));
            }
          }
        }
      } catch (error) {
        console.error('Invalid JSON format');
        if (handleModelError) {
          handleModelError((error as Error).message);
        }
      }
    };

    // Add an event listener for when a file is selected
    fileInput.addEventListener(
      'change',
      ev => void handleFileSelected(ev),
      false,
    );

    // Append the file input to the document body
    document.body.append(fileInput);

    // Trigger a click on the file input to open the file dialog
    fileInput.click();
  },
  'Export Templates': (templates: EMRALD_Model[]) => {
    if (templates.length === 0) {
      return 'error';
    }
    // Convert JSON data to a string
    const jsonString = JSON.stringify(
      templates.map(template => normalizeModelObjType(template)),
      null,
      2,
    );

    // Create a Blob (Binary Large Object) with the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an <a> element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${
      appData.value.name ?? 'Untitled_EMRALD_Project'
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
    link.href = window.location.href.includes('acc')
      ? `https://github.com/idaholab/EMRALD/releases/download/v${EMRALD_SchemaVersion.toString().padEnd(5, '.0')}/EMRALD_SimEngine.zip` // In the dev environment, explictly link to the current version, which should set as a pre-release on GitHub
      : 'https://github.com/idaholab/EMRALD/releases/latest/download/EMRALD_SimEngine.zip'; // Otherwise link to the latest full release
    link.click();
  },
  'Client Tester': () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href
      = 'https://github.com/idaholab/EMRALD/releases/latest/download/XMPPClientTester.zip'; // The file to download.
    link.click();
  },
  'Client Tester Source': () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = 'https://github.com/idaholab/EMRALD/tree/main/XmppClient'; // The file to download.
    link.click();
  },
  'Desktop Model Editor': () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href
      = 'https://github.com/idaholab/EMRALD/releases/latest/download/emrald_modeler.exe';
    link.click();
  },
  'Source Code': () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = 'https://github.com/idaholab/EMRALD';
    link.click();
  },
};
