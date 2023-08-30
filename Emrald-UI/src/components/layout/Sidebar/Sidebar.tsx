import { useCallback, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import MenuAccordion from '../Accordion/Accordion';
import { styled } from '@mui/material/styles';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { useActionContext } from '../../../contexts/ActionContext';
import { useEventContext } from '../../../contexts/EventContext';

const ResizeHandle = styled('div')({
  width: '6px',
  cursor: 'ew-resize',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 100,
});

const Sidebar = () => {
  const { diagrams } = useDiagramContext();
  const { logicNodes } = useLogicNodeContext();
  const { actions } = useActionContext();
  const { events } = useEventContext();

  const defaultDrawerWidth = 245;
  const minDrawerWidth = 215;
  const maxDrawerWidth = 1000;

  const diagramPanels = [
    { type: 'Diagrams', data: diagrams },
    { type: 'Logic Tree', data: logicNodes },
    { type: 'External Sims', data: [] },
  ];

  const componentPanels = [
    { type: 'Actions', data: actions },
    { type: 'Events', data: events },
    { type: 'Variables', data: [] },
    { type: 'States', data: [] },
  ];

  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);

  const handleMouseDown = () => {
    document.addEventListener('mouseup', handleMouseUp as EventListener, true);
    document.addEventListener(
      'mousemove',
      handleMouseMove as EventListener,
      true,
    );
  };

  const handleMouseUp = () => {
    document.removeEventListener(
      'mouseup',
      handleMouseUp as EventListener,
      true,
    );
    document.removeEventListener(
      'mousemove',
      handleMouseMove as EventListener,
      true,
    );
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const newWidth = e.clientX - document.body.offsetLeft;
      if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
        setDrawerWidth(newWidth);
      }
    },
    [minDrawerWidth, maxDrawerWidth],
  );

  return (
    <Drawer
      variant="permanent"
      data-testid="sidebar"
      elevation={1}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#008080',
        },
      }}
    >
      <Toolbar />
      <ResizeHandle
        onMouseDown={(_event: React.MouseEvent<HTMLElement>) =>
          handleMouseDown()
        }
      />
      <Box sx={{ overflow: 'auto' }}>
        <MenuAccordion panels={diagramPanels} />
        <MenuAccordion panels={componentPanels} />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
