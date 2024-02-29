import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './CustomNode.scss';
import { NodeTypeIcon } from './IconTypes';
import StateControllerComponent from './StateDisplayControllers/StateControllerComponent';
import { State } from '../../../types/State';
import { Action } from '../../../types/Action';
import { Event } from '../../../types/Event';

interface StateNodeComponentProps {
  id: string;
  data: {
    state: State,
    diagramStates: string[],
    updateStateEvents: (stateName: string, event: Event) => void;
    updateStateEventActions: (stateName: string, eventName: string, action: Action) => void;
    updateStateImmediateActions: (stateName: string, action: Action) => void;
  };
}

const StateNode: React.FC<StateNodeComponentProps> = ({ id, data }) => {
  const { 
    state, 
    diagramStates, 
    updateStateEvents,
    updateStateEventActions,
    updateStateImmediateActions
  } = data;
  return (
    <>
      <div className="custom-node__header" id={id}>
        <strong>{state.name}</strong> <NodeTypeIcon type={state.stateType} />
      </div>
      <div className="custom-node__body">
        <Handle
          className="custom-node__handle-left target-handle"
          type="target"
          position={Position.Left}
          id={`action-target`}
        />
        <StateControllerComponent
          type="immediate"
          state={state}
          diagramStates={diagramStates} 
          updateStateEvents={updateStateEvents} 
          updateStateEventActions={updateStateEventActions} 
          updateStateImmediateActions={updateStateImmediateActions} 
        />
        <StateControllerComponent
          type="event"
          state={state}
          diagramStates={diagramStates} 
          updateStateEvents={updateStateEvents} 
          updateStateEventActions={updateStateEventActions} 
          updateStateImmediateActions={updateStateImmediateActions} 
        />
      </div>
    </>
  );
}

export default memo(StateNode);
