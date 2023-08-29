import { Box } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { useDrag } from 'react-dnd';

interface DraggableItemProps {
  itemData: any;
}

const DraggableItem: React.FC<PropsWithChildren<DraggableItemProps>> = ({
  itemData,
  children,
}) => {
  const [, drag] = useDrag({
    type: 'DRAGGABLE_ITEM',
    item: itemData,
  });

  return (
    <Box ref={drag} sx={{ cursor: 'grab' }}>
      {children}
    </Box>
  );
};

export default DraggableItem;
