import { useState } from 'react';
import {
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Fab,
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import WindowComponent from '../Window/Window';
import SchemaIcon from '@mui/icons-material/Schema';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import EventIcon from '@mui/icons-material/Event';
import CommitIcon from '@mui/icons-material/Commit';
import ShapeLineIcon from '@mui/icons-material/ShapeLine';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import { useWindowContext } from '../../../contexts/WindowContext';
import DiagramForm from '../../forms/DiagramForm/DiagramForm';
import MinimizedWindows from '../Window/MinimizedWindows';
import LogicNodeForm from '../../forms/LogicNodeForm/LogicNodeForm';
import ActionForm from '../../forms/ActionForm/ActionForm';
import EventForm from '../../forms/EventForm/EventForm';
import StateForm from '../../forms/StateForm/StateForm';
import VariableForm from '../../forms/VariableForm/VariableForm';
import emraldData from '../../../emraldData.json';

interface MainCanvasProps {
  appData: any;
  updateAppData: (newData: any, undoData?: any) => void;
}

const MainCanvas: React.FC<MainCanvasProps> = ({ appData, updateAppData }) => {
  const actions = [
    {
      icon: <SchemaIcon />,
      name: 'New Diagram',
      content: <DiagramForm />,
    },
    {
      icon: <AccountTreeIcon />,
      name: 'New Logic Tree',
      content: <LogicNodeForm />,
    },
    {
      icon: <CommitIcon />,
      name: 'New Action',
      content: <ActionForm />,
    },
    {
      icon: <EventIcon />,
      name: 'New Event',
      content: <EventForm />,
    },
    {
      icon: <ShapeLineIcon />,
      name: 'New State',
      content: <StateForm />,
    },
    {
      icon: <PermDataSettingIcon />,
      name: 'New Variable',
      content: <VariableForm />,
    },
  ];
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const storedHistory = JSON.parse(sessionStorage.getItem('dataHistory') || '[]');

  const { addWindow } = useWindowContext();

  const undoChange = () => {
    if (storedHistory && storedHistory.length > 1) {
      const newHistory = storedHistory.slice(0, storedHistory.length - 1); // Remove the last item in the array
      sessionStorage.setItem('dataHistory', JSON.stringify(newHistory));
      updateAppData(undefined, newHistory[newHistory.length - 1]);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        position: 'relative',
        height: 'calc(100% - 65px)',
        top: '65px',
        backgroundColor: '#eee',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          transform: 'translateZ(0px)',
          flexGrow: 1,
        }}
      >
        <MinimizedWindows />

        {/* Figure this out later */}
        {/* {storedHistory && storedHistory.length > 1 ? (
          <Fab color="secondary" aria-label="add" onClick={() => undoChange()}>
            <UndoIcon />
          </Fab>
        ) : null} */}

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
