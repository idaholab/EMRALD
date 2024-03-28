// DropTargetComponent.tsx
import { Box } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';
import { NodeType } from '../diagrams/LogicTreeDiagram/useLogicTreeDiagram';
import { LogicNode } from '../../types/LogicNode';
import { Diagram } from '../../types/Diagram';
import {
  emptyLogicNode,
  useLogicNodeContext,
} from '../../contexts/LogicNodeContext';
import { useSignal } from '@preact/signals-react';
import { v4 as uuidv4 } from 'uuid';
import { GateType } from '../../types/ItemTypes';

interface LogicNodeDroppableItemProps {
  type: ('Gate' | 'Diagram')[];
  children?: React.ReactNode;
  nodeType?: NodeType;
  node?: string;
}

function isDiagram(data: Diagram): data is Diagram {
  return (data as Diagram).diagramType !== undefined;
}

const LogicTreeNodeDropTarget: React.FC<
  PropsWithChildren<LogicNodeDroppableItemProps>
> = ({ type, nodeType, node, children }) => {
  const { logicNodes, createLogicNode, updateLogicNode, getLogicNodeByName } = useLogicNodeContext();
  const newGateNode = useSignal<LogicNode>(emptyLogicNode);

  const resetNewNode = () => {
    newGateNode.value = emptyLogicNode;
  };

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: type,
    drop: (item: LogicNode | Diagram) => {
      // If the item is a diagram, add its name to the compChildren of the dropped node
      if (isDiagram(item as Diagram)) {
        const { name } = item as Diagram;
        if (!node) { return; }
        const logicNode = getLogicNodeByName(node); // Get the info of the logic node to be updated
        if (logicNode.compChildren.some((child) => child.diagramName === item.name)) {
          return; // If there is already a item with the name of the item being dropped, don't add it again
        }
        logicNode.compChildren = [
          ...logicNode.compChildren,
          {
            // Add the diagram's name to the compChildren
            diagramName: name,
          },
        ];
        updateLogicNode(logicNode); // Update the dropped node with the new compChildren
      } else {
        const { gateType } = item as { gateType: string }; // Get the gateType of the dropped item
        if (!node) {
          return;
        }

        const gateNodes = logicNodes.filter((node) =>
          /^Gate \d+$/.test(node.name),
        ); // Find all existing logic nodes with the name Gate and a number

        const largestNumber = gateNodes.reduce((max, node) => {
          // Find the largest number in the existing default gate nodes
          const number = parseInt(node.name.split(' ')[1]);
          return number > max ? number : max;
        }, 0);
        const newGateNumber = largestNumber + 1; // Increment the largest number to get the new gate number

        const logicNode = getLogicNodeByName(node); // Get the info of the logic node to be updated
        createLogicNode({
          // Create a new logic node with the gate type being the type of the dropped item
          ...newGateNode.value,
          id: uuidv4(),
          name: `Gate ${newGateNumber}`,
          gateType: gateType as GateType,
        });
        logicNode.gateChildren = [
          ...logicNode.gateChildren,
          `${`Gate ${newGateNumber}`}`,
        ]; // Add the new gate node's name to the gateChildren of the parent logic node
        updateLogicNode(logicNode); // Update the dropped node with the new gateChildren
        resetNewNode(); // Reset the new gate node to its empty state
      }
    },
    canDrop: () => {
      // Prevent drop if nodeType is 'comp'
      return nodeType !== 'comp';
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const backgroundColor = isOver && canDrop ? 'lightgreen' : 'transparent';

  return (
    <Box ref={drop} sx={{ backgroundColor, borderRadius: '8px' }}>
      {children}
    </Box>
  );
};

export default LogicTreeNodeDropTarget;
