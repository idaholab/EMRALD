import Box from '@mui/material/Box';
import React, { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { WindowPosition } from '../../../types/EMRALD_Model';

type DraggableContainerProps = {
  id: string;
  initialPosition: WindowPosition;
  fullScreen: boolean;
  children: React.ReactNode;
  onResize?: (position: WindowPosition) => void;
};

const CustomResizeHandle: React.FC = () => {
  return (
    <Box
      sx={{
        background: 'transparent',
        cursor: 'se-resize',
        width: '15px',
        height: '15px',
        position: 'absolute',
        right: '13px',
        bottom: '13px',
        borderTop: '3px solid #ccc',
        borderRight: '3px solid #ccc',
        transition: 'background-color 0.3s, border-color 0.3s',
        rotate: '90deg',
        zIndex: 100,
      }}
    />
  );
};

const DraggableContainer: React.FC<DraggableContainerProps> = ({
  id,
  initialPosition,
  fullScreen,
  children,
  onResize,
}) => {
  const [position, setPosition] = useState({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [size, setSize] = useState({
    height: initialPosition.height,
    width: initialPosition.width,
  });
  const containerRef = useRef<Rnd | null>(null);

  const updateSize = () => {
    const resizable = containerRef.current?.resizable;
    if (!fullScreen && resizable) {
      setSize({
        height: Number(resizable.state.height),
        width: Number(resizable.state.width),
      });
      if (onResize) {
        onResize({
          x: position.x,
          y: position.y,
          width: Number(resizable.state.height),
          height: Number(resizable.state.width),
        });
      }
    }
  };

  const updatePosition = () => {
    const draggable = containerRef.current?.draggable;
    if (!fullScreen && draggable) {
      setPosition({
        x: draggable.state.x,
        y: draggable.state.y,
      });
      if (onResize) {
        onResize({
          x: draggable.state.x,
          y: draggable.state.y,
          width: size.width,
          height: size.height,
        });
      }
    }
  };

  return (
    <Rnd
      ref={containerRef}
      default={initialPosition}
      size={fullScreen ? { height: '99.2%', width: '99.2%' } : size}
      position={fullScreen ? { x: 0, y: 0 } : position}
      resizeHandleComponent={{
        bottomRight: <CustomResizeHandle />,
      }}
      dragHandleClassName={`title-bar-${id}`}
      onResizeStop={() => {
        updateSize();
      }}
      onDragStop={() => {
        updatePosition();
      }}
      bounds="parent"
      disableDragging={fullScreen}
    >
      {children}
    </Rnd>
  );
};

export default DraggableContainer;
