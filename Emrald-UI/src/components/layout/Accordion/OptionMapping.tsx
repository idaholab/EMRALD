import { useWindowContext } from '../../../contexts/WindowContext';
import { Diagram } from '../../../types/Diagram';
import { Action } from '../../../types/Action';
import DiagramForm from '../../features/DiagramForm/DiagramForm';
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
import ActionForm from '../../features/ActionForm/ActionForm';
import EventForm from '../../features/EventForm/EventForm';
import VariableForm from '../../features/VariableForm/VariableForm';
import StateForm from '../../features/StateForm/StateForm';
import ReactFlowTest from '../../features/ReactFlow/ReactFlowDiagram';

// Define your Option and OptionsMapping types
export interface Option {
  label: string;
  action: (content: any) => void; // Pass context values as parameters
}

interface OptionsMapping {
  [key: string]: Option[];
}

export const useOptionsMapping = () => {
  const {addWindow} = useWindowContext();
  const {deleteDiagram} = useDiagramContext();
  const {deleteLogicNode} = useLogicNodeContext();
  const {deleteAction} = useActionContext();
  const {deleteEvent} = useEventContext();
  const {deleteState} = useStateContext();
  const {deleteVariable} = useVariableContext();

  const optionsMapping: OptionsMapping = {
    Diagrams: [
      { label: 'Open', action: (diagram: Diagram) => {addWindow(diagram.name, <ReactFlowTest diagram={diagram}/>, { x: 75, y: 25, width: 1300, height: 700 }) }},
      { label: 'Edit Properties', action: (diagram: Diagram) => addWindow(`Edit Properties ${diagram.name}`, <DiagramForm diagramData={diagram}/>) },
      { label: 'Delete', action: (diagram: Diagram) => deleteDiagram(diagram.id) },
      { label: 'Make Template', action: () => null },
      { label: 'Export', action: () => null },
      { label: 'Copy', action: () => null },
    ],
    'Logic Tree': [
      { label: 'Open', action: () => null },
      { label: 'Edit Properties', action: () => null },
      { label: 'Delete', action: (logicNode: LogicNode) => deleteLogicNode(logicNode.id) },
    ],
    Actions: [
      { label: 'Edit Properties', action: (action: Action) => {console.log(action); addWindow(action.name, <ActionForm actionData={action}/>) }},
      { label: 'Delete', action: (action: Action) => deleteAction(action.id) },
    ],
    Events: [
      { label: 'Edit Properties', action: (event: Event) => {console.log(event); addWindow(event.name, <EventForm eventData={event}/>) }},
      { label: 'Delete', action: (event: Event) => deleteEvent(event.id) },
    ],
    States: [
      { label: 'Edit Properties', action: (state: State) => addWindow(state.name, <StateForm stateData={state}/>) },
      { label: 'Delete', action: (state: State) => deleteState(state.id) },
    ],
    Variables: [
      { label: 'Edit Properties', action: (variable: Variable) => addWindow(variable.name, <VariableForm variableData={variable}/>) },
      { label: 'Delete', action: (variable: Variable) => deleteVariable(variable.id) },
    ],
  };

  return optionsMapping;
};