import React, { useMemo } from 'react';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { useWindowContext } from '../../../contexts/WindowContext';
import DraggableContainer from './DraggableContainer';
import { Typography } from '@mui/material';

const WindowComponent: React.FC = () => {
  const { windows, bringToFront, handleClose, toggleMaximize, toggleMinimize, resizeListener } =
    useWindowContext();

  const openWindows = useMemo(() => windows.filter((window) => !window.minimized), [windows]);

  return (
    <>
      {openWindows.map((window) => (
        <DraggableContainer
          key={window.id}
          id={window.id}
          initialPosition={window.initialPosition}
          fullScreen={window.maximized}
          onResize={(position) => {
            resizeListener.emit('resize', window.id, position);
          }}
        >
          <Card
            onMouseDown={() => {
              bringToFront(window);
            }}
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)',
              zIndex: window.id === windows[windows.length - 1].id ? 2 : 1,
              paddingBottom: '0px', // Ensure no padding at the bottom
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
              <Box
                sx={{
                  minWidth: '250px',
                  display: 'flex',
                  flex: '1',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography>{window.title}</Typography>
              </Box>
              <Box sx={{ position: 'relative', top: '-2px', display: 'flex', flexWrap: 'nowrap' }}>
                <IconButton
                  aria-label="minimize"
                  onClick={() => {
                    toggleMinimize(window);
                  }}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  {!window.minimized && !window.maximized ? <HorizontalRuleIcon /> : null}
                </IconButton>
                <IconButton
                  aria-label="maximize"
                  onClick={() => {
                    toggleMaximize(window);
                  }}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  {window.maximized ? <CloseFullscreenIcon /> : <CropSquareIcon />}
                </IconButton>
                <IconButton
                  aria-label="close"
                  onClick={() => {
                    handleClose(window.id);
                  }}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <CardContent
              sx={{
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                p: 0,
                '&:last-child': {
                  paddingBottom: '0px',
                },
              }}
            >
              <Box sx={{ height: '96%', width: '100%' }} className={`droppable-area-${window.id}`}>
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
