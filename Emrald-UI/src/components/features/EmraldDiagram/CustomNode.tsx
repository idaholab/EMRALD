import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './CustomNode.scss';
import { NodeTypeIcon } from './IconTypes';
import NodeActionsComponent from './NodeActionComponent';

interface CustomNodeProps {
  id: string;
  data: any;
}

/**
 * Renders a custom node component.
 *
 * @param {CustomNodeProps} { id, data } - The ID and data of the custom node.
 * @return {ReactNode} The rendered custom node component.
 */
const CustomNode: React.FC<CustomNodeProps> = ({ id, data }) => {
  const { 
    state, 
    diagramStates, 
    immediateActions, 
    eventActions, 
    events, 
    updateStateEvents,
    updateStateEventActions,
    updateStateImmediateActions
  } = data;
  return (
    <>
      <div className="custom-node__header" id={id}>
        <strong>{data.label}</strong> <NodeTypeIcon type={data.type} />
      </div>
      <div className="custom-node__body">
        <Handle
          className="custom-node__handle-left target-handle"
          type="target"
          position={Position.Left}
          id={`action-target`}
        />
        <NodeActionsComponent 
          actions={immediateActions} 
          events={events} 
          diagramStates={diagramStates} 
          state={state} 
          updateStateEvents={updateStateEvents} 
          updateStateEventActions={updateStateEventActions} 
          updateStateImmediateActions={updateStateImmediateActions} 
          type="immediate" />
        <NodeActionsComponent
          actions={eventActions}
          events={events}
          diagramStates={diagramStates}
          state={state} 
          updateStateEvents={updateStateEvents} 
          updateStateEventActions={updateStateEventActions} 
          updateStateImmediateActions={updateStateImmediateActions} 
          type="event"
        />
      </div>
    </>
  );
}

export default memo(CustomNode);
