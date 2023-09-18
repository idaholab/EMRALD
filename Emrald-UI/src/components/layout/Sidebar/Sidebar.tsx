import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import MenuAccordion from '../Accordion/Accordion';
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';
import ButtonGroupComponent from '../../common/ButtonGroupComponent/ButtonGroupComponent';
import { useSidebarLogic } from './SidebarLogic';

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
  const {
    setIsDiagramAccordionOpen,
    setIsComponentAccordionOpen,
    componentGroup,
    setComponentGroup,
    bothAccordionsOpen,
    drawerWidth,
    handleMouseDown,
    diagramPanels,
    componentPanels,
  } = useSidebarLogic();

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

        <ButtonGroupComponent
          componentGroup={componentGroup}
          setComponentGroup={setComponentGroup}
        />

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
