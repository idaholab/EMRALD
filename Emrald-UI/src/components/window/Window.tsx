import React from 'react';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { useWindowContext } from '../../contexts/WindowContext';
import DraggableContainer from './DraggableContainer';

const WindowComponent: React.FC = () => {
  const { windows, bringToFront, handleClose, toggleMaximize, toggleMinimize } =
    useWindowContext();

  return (
    <>
      {windows.map((window) => (
        <DraggableContainer
          key={window.id}
          id={window.id}
          initialPosition={{ x: 0, y: 0, width: 500, height: 500 }}
          fullScreen={window.maximized}
        >
          <Card
            onMouseDown={() => bringToFront(window)}
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)',
              zIndex: window.id === windows[windows.length - 1].id ? 2 : 1,
            }}
          >
            <Box
              className={`title-bar-${window.id}`}
              sx={{
                backgroundColor: 'lightgrey',
                height: '35px',
                padding: '0',
                textAlign: 'end',
                cursor: 'move',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <IconButton
                aria-label="minimize"
                onClick={() => toggleMinimize(window)}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                {!window.minimized ? <HorizontalRuleIcon /> : null}
              </IconButton>
              <IconButton
                aria-label="maximize"
                onClick={() => toggleMaximize(window)}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                {window.maximized ? (
                  <CloseFullscreenIcon />
                ) : (
                  <CropSquareIcon />
                )}
              </IconButton>
              <IconButton
                aria-label="close"
                onClick={() => handleClose(window.id)}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <CardContent sx={{ height: '94%', p: 0 }}>
              <Box
                sx={{ height: '100%', width: '100%' }}
                className={`droppable-area-${window.id}`}
              >
                {window.content}
              </Box>
            </CardContent>
          </Card>
        </DraggableContainer>
      ))}
    </>
  );
};

export default WindowComponent;
