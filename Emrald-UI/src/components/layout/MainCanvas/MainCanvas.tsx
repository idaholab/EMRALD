import { useState } from 'react';
import {
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Fab,
  Button,
  SvgIcon,
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import WindowComponent from '../Window/Window';
import { TbSchema } from "react-icons/tb";
import { GrPerformance } from "react-icons/gr";
import { VscSymbolEvent } from "react-icons/vsc";
import { HiOutlineVariable } from "react-icons/hi";
import { MdOutlineLocationSearching } from "react-icons/md";
import { GiFamilyTree } from "react-icons/gi";
import { useWindowContext } from '../../../contexts/WindowContext';
import DiagramForm from '../../forms/DiagramForm/DiagramForm';
import MinimizedWindows from '../Window/MinimizedWindows';
import LogicNodeForm from '../../forms/LogicNodeForm/LogicNodeForm';
import ActionForm from '../../forms/ActionForm/ActionForm';
import EventForm from '../../forms/EventForm/EventForm';
import StateForm from '../../forms/StateForm/StateForm';
import VariableForm from '../../forms/VariableForm/VariableForm';
import ActionFormContextProvider from '../../forms/ActionForm/ActionFormContext';

const MainCanvas: React.FC = () => {
  const actions = [
    {
      icon: <SvgIcon><TbSchema /></SvgIcon>,
      name: 'New Diagram',
      content: <DiagramForm />,
    },
    {
      icon: <SvgIcon sx={{ rotate: '180deg' }}><GiFamilyTree /></SvgIcon>,
      name: 'New Logic Tree',
      content: <LogicNodeForm />,
    },
    {
      icon:  <SvgIcon><GrPerformance /></SvgIcon>,
      name: 'New Action',
      content: <ActionFormContextProvider><ActionForm /></ActionFormContextProvider>,
    },
    {
      icon: <SvgIcon><VscSymbolEvent /></SvgIcon>,
      name: 'New Event',
      content: <EventForm />,
    },
    {
      icon: <SvgIcon><MdOutlineLocationSearching /></SvgIcon>,
      name: 'New State',
      content: <StateForm />,
    },
    {
      icon: <SvgIcon><HiOutlineVariable /></SvgIcon>,
      name: 'New Variable',
      content: <VariableForm />,
    },
  ];
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const storedHistory = JSON.parse(sessionStorage.getItem('dataHistory') || '[]');

  const { addWindow } = useWindowContext();

  // const undoChange = () => {
  //   if (storedHistory && storedHistory.length > 1) {
  //     const newHistory = storedHistory.slice(0, storedHistory.length - 1); // Remove the last item in the array
  //     sessionStorage.setItem('dataHistory', JSON.stringify(newHistory));
  //     updateAppData(undefined, newHistory[newHistory.length - 1]);
  //   }
  // };

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
