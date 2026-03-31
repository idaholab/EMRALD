import type { PropsWithChildren, Ref } from 'react';
import type {
  Action,
  Diagram,
  Event as EventType,
  GateType,
  LogicNode,
  MainItemType,
  State,
} from '../../types/EMRALD_Model';
import { Box } from '@mui/material';
import { useDrag } from 'react-dnd';

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

export const DraggableItem: React.FC<PropsWithChildren<DraggableItemProps>> = ({
  itemType,
  itemData,
  children,
}) => {
  const [, drag] = useDrag({
    type:
      itemType === 'LogicNode'
        ? 'LogicNode'
        : itemType === 'Diagram'
          && itemData.objType === 'Diagram'
          && itemData.diagramType === 'dtSingle'
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
    <Box
      ref={drag as unknown as Ref<unknown>}
      sx={{ cursor: 'grab', width: '100%' }}
    >
      {children}
    </Box>
  );
};
