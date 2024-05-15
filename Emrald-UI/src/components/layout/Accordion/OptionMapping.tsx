import { useWindowContext } from '../../../contexts/WindowContext';
import { Diagram } from '../../../types/Diagram';
import { Action } from '../../../types/Action';
import DiagramForm from '../../forms/DiagramForm/DiagramForm';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { useActionContext } from '../../../contexts/ActionContext';
import { useEventContext } from '../../../contexts/EventContext';
import { useStateContext } from '../../../contexts/StateContext';
import { useVariableContext } from '../../../contexts/VariableContext';
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
import { useExtSimContext } from '../../../contexts/ExtSimContext';
import VariableFormContextProvider from '../../forms/VariableForm/VariableFormContext';

// Define your Option and OptionsMapping types
export interface Option {
  label: string;
  action: (content: any) => void; // Pass context values as parameters
}

interface OptionsMapping {
  [key: string]: Option[];
}

export const useOptionsMapping = () => {
  const { addWindow } = useWindowContext();
  const { deleteDiagram } = useDiagramContext();
  const { deleteLogicNode } = useLogicNodeContext();
  const { deleteAction } = useActionContext();
  const { deleteEvent } = useEventContext();
  const { deleteState, getStateByStateName } = useStateContext();
  const { deleteVariable } = useVariableContext();
  const { deleteExtSim } = useExtSimContext();

  const optionsMapping: OptionsMapping = {
    Diagrams: [
      {
        label: 'Open',
        action: (diagram: Diagram) => {
          addWindow(diagram.name, <EmraldDiagram diagram={diagram} />, {
            x: 75,
            y: 25,
            width: 1300,
            height: 700,
          });
        },
      },
      {
        label: 'Edit Properties',
        action: (diagram: Diagram) =>
          addWindow(
            `Edit Properties: ${diagram.name}`,
            <DiagramForm diagramData={diagram} />,
          ),
      },
      {
        label: 'Delete',
        action: (diagram: Diagram) => {
          // delete all states tied to the diagram
          diagram.states.map((name) => {
            const state = getStateByStateName(name);
            deleteState(state.id);
          });
          deleteDiagram(diagram.id);
        },
      },
      { label: 'Make Template', action: () => null },
      { label: 'Export', action: () => null },
      { label: 'Copy', action: () => null },
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
            { x: 75, y: 25, width: 1300, height: 700 },
          );
        },
      },
      {
        label: 'Edit Properties',
        action: (logicNode: LogicNode) => {
          addWindow(
            `Edit Properties: ${logicNode.name}`,
            <LogicNodeForm logicNodeData={logicNode} />,
          );
        },
      },
      {
        label: 'Delete',
        action: (logicNode: LogicNode) => deleteLogicNode(logicNode.id),
      },
    ],
    'External Sims': [
      {
        label: 'Edit Properties',
        action: (extSim: ExtSim) =>
          addWindow(
            `Edit Properties: ${extSim.name}`,
            <ExtSimForm ExtSimData={extSim} />,
          ),
      },
      {
        label: 'Delete',
        action: (extSim: ExtSim) => deleteExtSim(extSim.id),
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
      { label: 'Delete', action: (action: Action) => deleteAction(action.id) },
    ],
    Events: [
      {
        label: 'Edit Properties',
        action: (event: Event) => {
          console.log(event);
          addWindow(
            `Edit Properties: ${event.name}`,
            <EventForm eventData={event} />,
          );
        },
      },
      { label: 'Delete', action: (event: Event) => deleteEvent(event.id) },
    ],
    States: [
      {
        label: 'Edit Properties',
        action: (state: State) =>
          addWindow(
            `Edit Properties: ${state.name}`,
            <StateForm stateData={state} />,
          ),
      },
      { label: 'Delete', action: (state: State) => deleteState(state.id) },
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
        action: (variable: Variable) => deleteVariable(variable.id),
      },
    ],
  };

  return optionsMapping;
};
