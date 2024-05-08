import { Box } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { useDrag } from 'react-dnd';
import { Action } from '../../types/Action';
import { Event as EventType } from '../../types/Event';
import { LogicNode } from '../../types/LogicNode';
import { Diagram } from '../../types/Diagram';
import { MainItemTypes } from '../../types/ItemTypes';
import { State } from '../../types/State';

interface DraggableItemProps {
  itemData: Action | State | EventType | LogicNode | Diagram | any;
  itemType: MainItemTypes | 'Gate';
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

function isStateType(data: State): data is State {
  return (data as State).stateType !== undefined;
}
export default DraggableItem;
