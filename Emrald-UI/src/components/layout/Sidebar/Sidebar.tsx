import { useCallback, useMemo, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import MenuAccordion from '../Accordion/Accordion';
import { styled } from '@mui/material/styles';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { useActionContext } from '../../../contexts/ActionContext';
import { useEventContext } from '../../../contexts/EventContext';
import { useVariableContext } from '../../../contexts/VariableContext';
import { useStateContext } from '../../../contexts/StateContext';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';

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
  const { states } = useStateContext();
  const { variables } = useVariableContext();

  const [isDiagramAccordionOpen, setIsDiagramAccordionOpen] = useState(false);
  const [isComponentAccordionOpen, setIsComponentAccordionOpen] =
    useState(false);

  const [componentGroup, setComponentGroup] = useState('all');

  const bothAccordionsOpen = useMemo(() => {
    return isDiagramAccordionOpen && isComponentAccordionOpen;
  }, [isDiagramAccordionOpen, isComponentAccordionOpen]);

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
    { type: 'Variables', data: variables },
    { type: 'States', data: states },
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
      <Box sx={{ overflow: 'hidden' }}>
        <MenuAccordion
          panels={diagramPanels}
          group="diagrams"
          setAccordionGroupOpen={setIsDiagramAccordionOpen}
          bothAccordionsOpen={bothAccordionsOpen}
        />

        <Divider sx={{ borderColor: '#fff', mx: 2 }} />

        <ButtonGroup
          size="small"
          aria-label="small button group"
          variant="contained"
          color="secondary"
          sx={{ ml: 2, position: 'relative', top: 12 }}
        >
          <Button key="all" onClick={() => setComponentGroup('all')}>
            All
          </Button>
          <Button key="global" onClick={() => setComponentGroup('global')}>
            Global
          </Button>
          <Button key="local" onClick={() => setComponentGroup('local')}>
            Local
          </Button>
        </ButtonGroup>

        <MenuAccordion
          panels={componentPanels}
          group="components"
          setAccordionGroupOpen={setIsComponentAccordionOpen}
          bothAccordionsOpen={bothAccordionsOpen}
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
