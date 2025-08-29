import React from 'react';
import { useDrop } from 'react-dnd';
import type { State } from '../../types/EMRALD_Model';
import { Box } from '@mui/material';
import ActionToStateTable from '../forms/ActionForm/ActionToStateTable';
import type { NewStateItem } from '../forms/ActionForm/ActionForm';
import { v4 as uuidv4 } from 'uuid';
import { useActionFormContext } from '../forms/ActionForm/ActionFormContext';

const ActionDropTarget: React.FC = () => {
  const { newStateItems, setNewStateItems, sortNewStates } = useActionFormContext();

  const [{ isOver }, drop] = useDrop({
    accept: 'State',
    drop: (item?: State) => {
      if (item) {
        const newStateItem: NewStateItem = {
          id: uuidv4(),
          toState: item.name,
          prob: 0,
          failDesc: '',
          remaining: false,
          probType: 'fixed',
        };
        if (newStateItems) {
          setNewStateItems(sortNewStates([...newStateItems, newStateItem]));
        } else {
          setNewStateItems([newStateItem]);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const backgroundColor = isOver ? 'lightgreen' : 'white';

  return (
    <Box
      ref={drop}
      sx={{ mt: 3 }}
      style={{
        height: '100%',
        backgroundColor,
      }}
    >
      {newStateItems && newStateItems.length > 0 ? (
        <ActionToStateTable />
      ) : (
        <Box
          sx={{
            border: '2px dashed gray',
            height: '75px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
        >
          Drop State Items Here
        </Box>
      )}
    </Box>
  );
};

export default ActionDropTarget;
