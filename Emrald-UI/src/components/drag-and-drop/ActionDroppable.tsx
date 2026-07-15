import type { Ref } from 'react';
import type { State } from '../../types/EMRALD_Model';
import type { NewStateItem } from '../forms/ActionForm/ActionForm';
import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { useActionFormContext } from '../forms/ActionForm/ActionFormContext';
import { ActionToStateTable } from '../forms/ActionForm/ActionToStateTable';

export const ActionDropTarget: React.FC = () => {
  const { newStateItems, mutuallyExclusive, setNewStateItems, sortNewStates }
    = useActionFormContext();

  const [{ isOver }, drop] = useDrop({
    accept: 'State',
    drop: (item?: State) => {
      if (item) {
        const shouldUseRemaining =
          (mutuallyExclusive ?? true) && !!newStateItems?.length;
        const existingItems = shouldUseRemaining
          ? newStateItems?.map(newStateItem =>
              newStateItem.remaining
                ? { ...newStateItem, remaining: false, prob: 0 }
                : newStateItem,
            )
          : newStateItems;
        const newStateItem: NewStateItem = {
          id: uuidv4(),
          toState: item.name,
          prob: shouldUseRemaining ? -1 : 0,
          failDesc: '',
          remaining: shouldUseRemaining,
          probType: 'fixed',
        };
        if (existingItems) {
          setNewStateItems(sortNewStates([...existingItems, newStateItem]));
        } else {
          setNewStateItems([newStateItem]);
        }
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const backgroundColor = isOver ? 'lightgreen' : 'white';

  return (
    <Box
      ref={drop as unknown as Ref<unknown>}
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
