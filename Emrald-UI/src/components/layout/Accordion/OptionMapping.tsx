import { useWindowContext } from '../../../contexts/WindowContext';
import { Diagram } from '../../../types/Diagram';
import { Action } from '../../../types/Action';
import DiagramForm from '../../forms/DiagramForm/DiagramForm';
import { LogicNode } from '../../../types/LogicNode';
import { Variable } from '../../../types/Variable';
import { Event } from '../../../types/Event';
import { State } from '../../../types/State';
import ActionForm from '../../forms/ActionForm/ActionForm';
import EventForm from '../../forms/EventForm/EventForm';
import VariableForm from '../../forms/VariableForm/VariableForm';
import StateForm from '../../forms/StateForm/StateForm';
import EmraldDiagram from '../../diagrams/EmraldDiagram/EmraldDiagram';
import LogicNodeTreeDiagram from '../../diagrams/LogicTreeDiagram/LogicTreeDiagram';
import LogicNodeForm from '../../forms/LogicNodeForm/LogicNodeForm';
import { ReactFlowProvider } from 'reactflow';
import ActionFormContextProvider from '../../forms/ActionForm/ActionFormContext';
import { ExtSim } from '../../../types/ExtSim';
import ExtSimForm from '../../forms/ExtSimForm/ExtSimForm';
import { GetModelItemsReferencedBy } from '../../../utils/ModelReferences';
import { MainItemTypes } from '../../../types/ItemTypes';
import VariableFormContextProvider from '../../forms/VariableForm/VariableFormContext';
import EventFormContextProvider from '../../forms/EventForm/EventFormContext';
import TemplateForm from '../../forms/TemplateForm/TemplateForm';
import { EMRALD_SchemaVersion } from '../../../types/EMRALD_Model';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAlertContext } from '../../../contexts/AlertContext';
import LogicNodeFormContextProvider from '../../forms/LogicNodeForm/LogicNodeFormContext';

// Define your Option and OptionsMapping types
export interface Option {
  label: string;
  action: (content: any, handleDelete?: any) => void; // Pass context values as parameters
}

interface OptionsMapping {
  [key: string]: Option[];
}

export const useOptionsMapping = () => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'xl'));
  const { addWindow } = useWindowContext();
  const { showAlert } = useAlertContext();
  const optionsMapping: OptionsMapping = {
    Diagrams: [
      {
        label: 'Open',
        action: (diagram: Diagram) => {
          addWindow(diagram.name, <EmraldDiagram diagram={diagram} />, {
            x: 75,
            y: 25,
            width: isMediumScreen ? 600 : 1000,
            height: isMediumScreen ? 400 : 500
          });
        },
      },
      {
        label: 'Edit Properties',
        action: (diagram: Diagram) =>
          addWindow(`Edit Properties: ${diagram.name}`, <DiagramForm diagramData={diagram} />),
      },
      {
        label: 'Delete',
        action: (
          diagram: Diagram,
          handleDelete: (itemToDelete: Diagram, itemToDeleteType: MainItemTypes) => void,
        ) => {
          handleDelete(diagram, MainItemTypes.Diagram);
        },
      },
      {
        label: 'Make Template',
        action: (diagram: Diagram) => {
          try {
            const copiedModel = structuredClone(
              GetModelItemsReferencedBy(diagram.name, MainItemTypes.Diagram, 3),
            );
            addWindow(`Create Template`, <TemplateForm templatedData={copiedModel} />, {
              x: 75,
              y: 25,
              width: isMediumScreen ? 600 : 1000,
              height: isMediumScreen ? 400 : 500
            });
          } catch(error) {
            console.error(error);
            showAlert('Unable to make template, Please report the issue on the GitHub repo so we can address this problem.', 'error')
          }
        },
      },
      {
        label: 'Export',
        action: (diagram: Diagram) => {
          try {
            const copiedModel = GetModelItemsReferencedBy(diagram.name, MainItemTypes.Diagram, 2);
            copiedModel.name = diagram.name;
            copiedModel.emraldVersion = EMRALD_SchemaVersion;
  
            // Convert JSON data to a string
            const jsonString = JSON.stringify(copiedModel, null, 2);
  
            // Create a Blob (Binary Large Object) with the JSON string
            const blob = new Blob([jsonString], { type: 'application/json' });
  
            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);
  
            // Create an <a> element to trigger the download
            const a = document.createElement('a');
            a.href = url;
            a.download = `${copiedModel.name ? copiedModel.name : 'exported-diagram'}.json`;
  
            // Trigger a click event on the <a> element to initiate the download
            a.click();
  
            // Clean up by revoking the URL
            URL.revokeObjectURL(url);
          } catch(error) {
            console.error(error);
            showAlert(`Unable to export ${diagram.name}, Please report the issue on the GitHub repo so we can address this problem.`, 'error')
          }
        },
      },
      {
        label: 'Copy',
        action: (diagram: Diagram) => {
          try {
            const copiedModel = GetModelItemsReferencedBy(diagram.name, MainItemTypes.Diagram, 2);
            copiedModel.name = diagram.name;
            copiedModel.emraldVersion = EMRALD_SchemaVersion;
            navigator.clipboard.writeText(JSON.stringify(copiedModel, null, 2));
          } catch (error) {
            console.error('Error occurred:', error);
            showAlert(`Unable to copy ${diagram.name}, Please report the issue on the GitHub repo so we can address this problem.`, 'error');
          }
        },
      },
      {
        label: 'Copy Recursive',
        action: (diagram: Diagram) => {
          try {
            const copiedModel = GetModelItemsReferencedBy(diagram.name, MainItemTypes.Diagram, 0);
            copiedModel.name = diagram.name;
            copiedModel.emraldVersion = EMRALD_SchemaVersion;
            navigator.clipboard.writeText(JSON.stringify(copiedModel, null, 2));
          } catch(error) {
            console.error(error);
            showAlert(`Unable to copy recursive ${diagram.name}, Please report the issue on the GitHub repo so we can address this problem.`, 'error')
          }
        },
      },
    ],
    'Logic Tree': [
      {
        label: 'Open',
        action: (logicNode: LogicNode) => {
          addWindow(
            logicNode.name,
            <ReactFlowProvider>
              <LogicNodeTreeDiagram logicNode={logicNode} />
            </ReactFlowProvider>,
            { x: 75, 
              y: 25,  
              width: isMediumScreen ? 600 : 1000,
              height: isMediumScreen ? 400 : 500 
            },
          );
        },
      },
      {
        label: 'Edit Properties',
        action: (logicNode: LogicNode) => {
          addWindow(
            `Edit Properties: ${logicNode.name}`,
            <LogicNodeFormContextProvider>
              <LogicNodeForm logicNodeData={logicNode} editing />
            </LogicNodeFormContextProvider>,
          );
        },
      },
      {
        label: 'Delete',
        action: (
          logicNode: LogicNode,
          handleDelete: (itemToDelete: LogicNode, itemToDeleteType: MainItemTypes) => void,
        ) => handleDelete(logicNode, MainItemTypes.LogicNode),
      },
    ],
    'External Sims': [
      {
        label: 'Edit Properties',
        action: (extSim: ExtSim) =>
          addWindow(`Edit Properties: ${extSim.name}`, <ExtSimForm ExtSimData={extSim} />),
      },
      {
        label: 'Delete',
        action: (
          extSim: ExtSim,
          handleDelete: (itemToDelete: ExtSim, itemToDeleteType: MainItemTypes) => void,
        ) => handleDelete(extSim, MainItemTypes.ExtSim),
      },
    ],
    Actions: [
      {
        label: 'Edit Properties',
        action: (action: Action) => {
          addWindow(
            `Edit Properties: ${action.name}`,
            <ActionFormContextProvider>
              <ActionForm actionData={action} />
            </ActionFormContextProvider>,
          );
        },
      },
      {
        label: 'Delete',
        action: (
          action: Action,
          handleDelete: (itemToDelete: Action, itemToDeleteType: MainItemTypes) => void,
        ) => handleDelete(action, MainItemTypes.Action),
      },
    ],
    Events: [
      {
        label: 'Edit Properties',
        action: (event: Event) => {
          console.log(event);
          addWindow(
            `Edit Properties: ${event.name}`,
            <EventFormContextProvider>
              <EventForm eventData={event} />
            </EventFormContextProvider>,
          );
        },
      },
      {
        label: 'Delete',
        action: (
          event: Event,
          handleDelete: (itemToDelete: Event, itemToDeleteType: MainItemTypes) => void,
        ) => handleDelete(event, MainItemTypes.Event),
      },
    ],
    States: [
      {
        label: 'Edit Properties',
        action: (state: State) =>
          addWindow(`Edit Properties: ${state.name}`, <StateForm stateData={state} />),
      },
      {
        label: 'Delete',
        action: (
          state: State,
          handleDelete: (itemToDelete: State, itemToDeleteType: MainItemTypes) => void,
        ) => handleDelete(state, MainItemTypes.State),
      },
    ],
    Variables: [
      {
        label: 'Edit Properties',
        action: (variable: Variable) =>
          addWindow(
            `Edit Properties: ${variable.name}`,
            <VariableFormContextProvider>
              <VariableForm variableData={variable} />
            </VariableFormContextProvider>,
          ),
      },
      {
        label: 'Delete',
        action: (
          variable: Variable,
          handleDelete: (itemToDelete: Variable, itemToDeleteType: MainItemTypes) => void,
        ) => handleDelete(variable, MainItemTypes.Variable),
      },
    ],
  };

  return optionsMapping;
};
