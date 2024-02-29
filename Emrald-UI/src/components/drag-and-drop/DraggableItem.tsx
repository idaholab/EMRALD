import { Box } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { useDrag } from 'react-dnd';
import { Action } from '../../types/Action';
import { Event as EventType } from '../../types/Event';

interface DraggableItemProps {
  itemData: Action | EventType | any;
}

const DraggableItem: React.FC<PropsWithChildren<DraggableItemProps>> = ({
  itemData,
  children,
}) => {
  const [, drag] = useDrag({
    type: isAction(itemData) ? 'Action' : isEventType(itemData) ? 'Event' : 'DRAGGABLE_ITEM',
    item: itemData,
  });

  return (
    <Box ref={drag} sx={{ cursor: 'grab' }}>
      {children}
    </Box>
  );
};

function isAction(data: Action): data is Action {
  return (data as Action).actType !== undefined;
}

function isEventType(data: EventType): data is EventType {
  return (data as EventType).evType !== undefined;
}

export default DraggableItem;