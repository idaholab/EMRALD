import { useState } from 'react';
import {
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import WindowComponent from '../Window/Window';
import SchemaIcon from '@mui/icons-material/Schema';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useWindowContext } from '../../../contexts/WindowContext';
import DiagramForm from '../../features/DiagramForm/DiagramForm';
import MinimizedWindows from '../Window/MinimizedWindows';
import LogicTreeForm from '../../features/LogicTreeForm/LogicTreeForm';

const MainCanvas = () => {
  const actions = [
    {
      icon: <SchemaIcon />,
      name: 'New Diagram',
      content: <DiagramForm />,
    },
    {
      icon: <AccountTreeIcon />,
      name: 'New Logic Tree',
      content: <LogicTreeForm />,
    },
  ];
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { addWindow } = useWindowContext();
  return (
    <Box
    component="main"
    sx={{
      flexGrow: 1,
      p: 3,
      position: 'relative',
      height: 'calc(100% - 65px)',
      top: '65px',
      backgroundColor:"#eee"
    }}
  >

      <Box sx={{ display: 'flex', height: '100%', transform: 'translateZ(0px)', flexGrow: 1 }}>
        <MinimizedWindows />
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: 'absolute', right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction="down"
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => addWindow(action.name, action.content)}
            />
          ))}
        </SpeedDial>
      </Box>

      <WindowComponent />
    </Box>
  );
};

export default MainCanvas;
