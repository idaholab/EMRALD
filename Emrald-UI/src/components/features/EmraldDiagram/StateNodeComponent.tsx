import { Connection, Handle, Position } from 'reactflow';
import './StateNode.scss';
import { NodeTypeIcon } from './IconTypes';
import StateControllerComponent from './StateDisplayControllers/StateControllerComponent';
import { State } from '../../../types/State';

interface StateNodeComponentProps {
  id: string;
  data: {
    state: State
  };
}

const StateNode: React.FC<StateNodeComponentProps> = ({ id, data }) => {
  const { state } = data;
  return (
    <>
      <div className="state-node__header" id={id}>
        <strong>{state.name}</strong> <NodeTypeIcon type={state.stateType} />
      </div>
      <div className="state-node__body">
        <Handle
          className="state-node__handle-left target-handle"
          type="target"
          isConnectableStart={false}
          position={Position.Left}
          id={`action-target`}
        />
        <StateControllerComponent
          type="immediate"
          state={state}
        />
        <StateControllerComponent
          type="event"
          state={state}
        />
      </div>
    </>
  );
}

export default StateNode;

