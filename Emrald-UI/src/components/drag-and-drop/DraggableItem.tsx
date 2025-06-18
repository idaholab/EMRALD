import { Box } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { useDrag } from 'react-dnd';
import { Action, Event as EventType, LogicNode, Diagram, State, MainItemType } from '../../types/EMRALD_Model';

interface DraggableItemProps {
  itemData: Action | State | EventType | LogicNode | Diagram | any;
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
        : itemType === 'Diagram' && itemData.diagramType === 'dtSingle'
        ? 'Diagram'
        : isAction(itemData)
        ? 'Action'
        : isEventType(itemData)
        ? 'Event'
        : isStateType(itemData)
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

function isAction(data: Action): data is Action {
  return (data as Action).actType !== undefined;
}

function isEventType(data: EventType): data is EventType {
  return (data as EventType).evType !== undefined;
}

function isStateType(data: State): data is State {
  return (data as State).stateType !== undefined;
}
export default DraggableItem;
