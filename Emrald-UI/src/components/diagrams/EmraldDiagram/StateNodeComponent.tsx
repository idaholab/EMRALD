import { Handle, Position } from 'reactflow';
import './StateNode.scss';
import { NodeTypeIcon } from './IconTypes';
import StateControllerComponent from './StateDisplayControllers/StateControllerComponent';
import { State } from '../../../types/State';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { PiResizeFill } from 'react-icons/pi';
interface StateNodeComponentProps {
  id: string;
  data: {
    state: State;
  };
}

const StateNode: React.FC<StateNodeComponentProps> = ({ id, data }) => {
  const [size, setSize] = useState<{ width: number; height: number }>();
  const { state } = data;

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size?.width || 225;
    const startHeight = size?.height || 200;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + moveEvent.clientX - startX;
      const newHeight = startHeight + moveEvent.clientY - startY;

      setSize({
        width: Math.max(100, Math.min(newWidth, 800)),
        height: Math.max(100, Math.min(newHeight, 400)),
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <Box
      className={`${
        state.defaultSingleStateValue === 'False'
          ? 'failed-state'
          : state.defaultSingleStateValue === 'True'
          ? 'success-state'
          : ''
      }`}
      style={{
        width: size?.width || 225,
        height: size?.height || 'max-content',
        position: 'relative',
      }}
    >
      <div>
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
          <StateControllerComponent type="immediate" state={state} />
          <StateControllerComponent type="event" state={state} />
        </div>

        <PiResizeFill
          className="nodrag"
          onMouseDown={handleMouseDown}
          style={{
            width: '18px',
            height: '18px',
            transform: 'rotate(270deg)',
            bottom: 0,
            right: 0,
            position: 'absolute',
            cursor: 'se-resize',
            marginLeft: 20,
            marginTop: 20,
          }}
        />
      </div>
    </Box>
  );
};

export default StateNode;
