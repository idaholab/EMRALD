import { Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { DialogComponent } from '../../common';
import { ButtonGroupComponent } from '../../common/ButtonGroupComponent/ButtonGroupComponent';
import { MenuAccordion } from '../Accordion/Accordion';
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

export const Sidebar: React.FC = () => {
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
    onDiagramChange,
    deleteConfirmation,
    itemToDelete,
    handleDelete,
    closeDeleteConfirmation,
    deleteItem,
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
          backgroundColor: 'primary.main',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Toolbar />
      <ResizeHandle
        onMouseDown={() => {
          handleMouseDown();
        }}
      />
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <MenuAccordion
          panels={diagramPanels}
          group="diagrams"
          setAccordionGroupOpen={setIsDiagramAccordionOpen}
          bothAccordionsOpen={bothAccordionsOpen}
          onDiagramChange={onDiagramChange}
          handleDelete={handleDelete}
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
          onDiagramChange={onDiagramChange}
          componentGroup={componentGroup}
          handleDelete={handleDelete}
        />
      </Box>
      <Box
        component="a"
        href="https://iapsam.org/PSAM18/index.html"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'block',
          px: 2,
          py: 1.5,
          backgroundColor: '#1d6b4a',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          textDecoration: 'none',
          transition: 'background-color 150ms cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': { backgroundColor: '#175840' },
          '&:focus-visible': {
            outline: '2px solid #7dd4aa',
            outlineOffset: '-2px',
          },
        }}
      >
        <Typography
          sx={{
            display: 'block',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          PSAM-18
        </Typography>
        <Typography
          sx={{
            display: 'block',
            color: '#fff',
            fontSize: '12px',
            lineHeight: 1.4,
            mb: 0.75,
          }}
        >
          Attend EMRALD Workshop
          <br />
          July 20-21, 2026
        </Typography>
        <Typography
          sx={{
            display: 'block',
            color: '#7dd4aa',
            fontSize: '11px',
            lineHeight: 1.2,
          }}
        >
          iapsam.org/PSAM18 ↗
        </Typography>
      </Box>
      {deleteConfirmation && (
        <DialogComponent
          open={true}
          title="Delete Confirmation"
          submitText="delete"
          onSubmit={() => {
            deleteItem();
          }}
          onClose={() => {
            closeDeleteConfirmation();
          }}
        >
          <Typography>
            Are you sure you want to delete {itemToDelete?.name}? It will be removed from all other
            places it is used.
          </Typography>
        </DialogComponent>
      )}
    </Drawer>
  );
};
