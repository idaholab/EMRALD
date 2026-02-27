import Box from '@mui/material/Box';
import React, { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import type { DraggableContainerProps } from './types/draggableContainer';

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
        height: resizable.state.height,
        width: resizable.state.width,
      });
    }
  };

  const updatePosition = () => {
    const draggable = containerRef.current?.draggable;
    if (!fullScreen && draggable) {
      setPosition({
        x: draggable.state.x,
        y: draggable.state.y,
      });
    }
  };

  return (
    <Rnd
      ref={containerRef}
      default={initialPosition}
      size={fullScreen ? { height: '99.2%', width: '99.2%' } : size}
      position={fullScreen ? { x: 0, y: 0 } : position}
      minHeight={35}
      minWidth={350}
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
