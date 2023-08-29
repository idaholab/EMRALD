import { useCallback, useState } from 'react';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import MenuAccordion from './Accordion';
import { styled } from '@mui/material/styles';
import { useDiagramContext } from '../../contexts/DiagramContext';
import { useLogicNodeContext } from '../../contexts/LogicNodeContext';
import { useActionContext } from '../../contexts/ActionContext';
import { useEventContext } from '../../contexts/EventContext';

const defaultDrawerWidth = 245;
const minDrawerWidth = 215;
const maxDrawerWidth = 1000;

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
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const { diagrams } = useDiagramContext();
  const { logicNodes } = useLogicNodeContext();
  const { actions } = useActionContext();
  const { events } = useEventContext();

  const handleAccordionChange = (panel: string) => {
    setExpandedPanel(panel === expandedPanel ? false : panel);
  };

  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);

  const handleMouseDown = (e: any) => {
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('mousemove', handleMouseMove, true);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
  };

  const handleMouseMove = useCallback((e: any) => {
    const newWidth = e.clientX - document.body.offsetLeft;
    if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
      setDrawerWidth(newWidth);
    }
  }, []);

  // const drawerWidth = 220;
  const diagramPanels = [
    { type: 'Diagrams', data: diagrams },
    { type: 'Logic Tree', data: logicNodes },
    { type: 'External Sims', data: [] },
  ]; //? Diagram Panel group names

  const componentPanels = [
    { type: 'Actions', data: actions },
    { type: 'Events', data: events },
    { type: 'Variables', data: [] },
    { type: 'States', data: [] },
  ]; //? Component Panel group names

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
      <ResizeHandle onMouseDown={(e) => handleMouseDown(e)} />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <MenuAccordion panels={diagramPanels} />
        </List>

        <List>
          <MenuAccordion panels={componentPanels} />
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
