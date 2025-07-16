import { Box } from '@mui/material';
import React, { type PropsWithChildren } from 'react';
import { useDrag } from 'react-dnd';
import type {
  Action,
  Event as EventType,
  LogicNode,
  Diagram,
  State,
  MainItemType,
  GateType,
} from '../../types/EMRALD_Model';

interface DraggableItemProps {
  itemData:
    | Action
    | State
    | EventType
    | LogicNode
    | Diagram
    | { objType: 'Gate'; gateType: GateType };
  itemType: MainItemType | 'Gate';
}

const DraggableItem: React.FC<PropsWithChildren<DraggableItemProps>> = ({
  itemType,
  itemData,
  children,
}) => {
  const [, drag] = useDrag({
    type:
      itemType === 'LogicNode'
        ? 'LogicNode'
        : itemType === 'Diagram' &&
            itemData.objType === 'Diagram' &&
            itemData.diagramType === 'dtSingle'
          ? 'Diagram'
          : itemData.objType === 'Action'
            ? 'Action'
            : itemData.objType === 'Event'
              ? 'Event'
              : itemData.objType === 'State'
                ? 'State'
                : 'Gate',
    item: itemData,
  });

  return (
    <Box ref={drag} sx={{ cursor: 'grab', width: '100%' }}>
      {children}
    </Box>
  );
};

export default DraggableItem;
