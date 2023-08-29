// DropTargetComponent.tsx
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';

interface DroppedItem {
  id: string;
  itemData: any;
}

const DropTargetComponent: React.FC = () => {
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);

  const [{ isOver }, drop] = useDrop({
    accept: 'DRAGGABLE_ITEM',
    drop: (item: DroppedItem) => {
      console.log(item);
      if (!droppedItems.some((droppedItem) => droppedItem.id === item.id)) {
        setDroppedItems([...droppedItems, item]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const backgroundColor = isOver ? 'lightgreen' : 'white';

  return (
    <div
      ref={drop}
      style={{
        height: '100%',
        padding: '16px',
        backgroundColor,
      }}
    >
      {droppedItems.length > 0 ? (
        <div>
          Dropped Items:
          <ul>
            {droppedItems.map((item) => (
              <li
                key={item.id}
                style={{ overflowWrap: 'break-word', padding: 10 }}
              >
                {JSON.stringify(item)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>Drop here</div>
      )}
    </div>
  );
};

export default DropTargetComponent;
