// DropTargetComponent.tsx
import { Box } from '@mui/material';
import React, { PropsWithChildren, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Action } from '../../types/Action';
import { Event } from '../../types/Event';

interface DroppedItem {
  id: string;
  itemData: Event | Action;
}

interface DroppableItemProps {
  type: 'Action' | 'Event' | 'DRAGGABLE_ITEM';
  children?: React.ReactNode;
  state?: string;
  event?: string;
  actionType?: 'immediate' | 'event';
  updateStateEvents?: (stateName: string, event: Event) => void;
  updateStateEventActions?: (stateName: string, eventName: string, action: Action) => void;
  updateStateImmediateActions?: (stateName: string, action: Action) => void;
}

const DropTargetComponent: React.FC<PropsWithChildren<DroppableItemProps>> = ({type, state, event, children, actionType, updateStateEvents, updateStateEventActions, updateStateImmediateActions}) => {
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);

  const [{ isOver }, drop] = useDrop({
    accept: type,
    drop: (item: Action | Event) => {
      if (type === 'Event' && state && updateStateEvents) {
        updateStateEvents(state, item as Event);
      }
      if (type === 'Action' && actionType === "immediate" && state && updateStateImmediateActions) {
        updateStateImmediateActions(state, item as Action);
      }
      if (type === 'Action' && actionType === "event" && state && event && updateStateEventActions) {
        updateStateEventActions(state, event, item as Action);
      }
      // if (!droppedItems.some((droppedItem) => droppedItem.id === item.id)) {
      //   setDroppedItems([...droppedItems, item]);
      // }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const backgroundColor = isOver ? 'lightgreen' : 'white';

  return (
    <Box
      ref={drop}
      sx={{backgroundColor}}
    >
      {children}
    </Box>
  );
};

export default DropTargetComponent;
