import { Handle, Position } from 'reactflow';
import './StateNode.scss';
import { NodeTypeIcon } from './IconTypes';
import StateControllerComponent from './StateDisplayControllers/StateControllerComponent';
import { State } from '../../../types/State';
import { Diagram } from '../../../types/Diagram';

interface StateNodeComponentProps {
  id: string;
  data: {
    diagram: Diagram,
    state: State
  };
}

const StateNode: React.FC<StateNodeComponentProps> = ({ id, data }) => {
  const { 
    state, 
    diagram, 
  } = data;

  return (
    <>
      <div className="state-node__header" id={id}>
        <strong>{state.name}</strong> <NodeTypeIcon type={state.stateType} />
      </div>
      <div className="state-node__body">
        <Handle
          className="state-node__handle-left target-handle"
          type="target"
          position={Position.Left}
          id={`action-target`}
        />
        <StateControllerComponent
          type="immediate"
          state={state}
          diagram={diagram} 
        />
        <StateControllerComponent
          type="event"
          state={state}
          diagram={diagram} 
        />
      </div>
    </>
  );
}

export default StateNode;

