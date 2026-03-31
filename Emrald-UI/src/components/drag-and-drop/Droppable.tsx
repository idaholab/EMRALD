import type { PropsWithChildren, Ref } from 'react';
import type { Action, Event } from '../../types/EMRALD_Model';
import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';

// interface DroppedItem {
//   id: string;
//   itemData: Event | Action;
// }

interface DroppableItemProps {
  type: 'Action' | 'Event' | 'DRAGGABLE_ITEM';
  state?: string;
  event?: string;
  actionType?: 'immediate' | 'event';
  updateStateEvents?: (stateName: string, event: Event) => void;
  updateStateEventActions?: (
    stateName: string,
    eventName: string,
    action: Action,
  ) => void;
  updateStateImmediateActions?: (stateName: string, action: Action) => void;
}

export const DropTargetComponent: React.FC<
  PropsWithChildren<DroppableItemProps>
> = ({
  type,
  state,
  event,
  children,
  actionType,
  updateStateEvents,
  updateStateEventActions,
  updateStateImmediateActions,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: type,
    drop: (item: Action | Event) => {
      if (type === 'Event' && state && updateStateEvents) {
        updateStateEvents(state, item as Event);
      }
      if (
        type === 'Action'
        && actionType === 'immediate'
        && state
        && updateStateImmediateActions
      ) {
        updateStateImmediateActions(state, item as Action);
      }
      if (
        type === 'Action'
        && actionType === 'event'
        && state
        && event
        && updateStateEventActions
      ) {
        updateStateEventActions(state, event, item as Action);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const backgroundColor = isOver ? 'lightgreen' : 'white';

  return (
    <Box ref={drop as unknown as Ref<unknown>} sx={{ backgroundColor }}>
      {children}
    </Box>
  );
};
