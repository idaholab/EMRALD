import type { PropsWithChildren, Ref } from 'react';
import type { Diagram, GateType, LogicNode } from '../../types/EMRALD_Model';
import { Box } from '@mui/material';
import { useSignal } from '@preact/signals-react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import {
  emptyLogicNode,
  useLogicNodeContext,
} from '../../contexts/LogicNodeContext';
import {
  type NodeType,
  useLogicNodeTreeDiagram,
} from '../diagrams/LogicTreeDiagram/useLogicTreeDiagram';

interface LogicNodeDroppableItemProps {
  type: ('Gate' | 'Diagram' | 'LogicNode')[];
  nodeType?: NodeType;
  node?: string;
}

export const LogicTreeNodeDropTarget: React.FC<
  PropsWithChildren<LogicNodeDroppableItemProps>
> = ({ type, nodeType, node, children }) => {
  const { logicNodes, createLogicNode, updateLogicNode, getLogicNodeByName }
    = useLogicNodeContext();
  const newGateNode = useSignal(emptyLogicNode);
  const { couldCreateInfiniteLoop } = useLogicNodeTreeDiagram();
  const resetNewNode = () => {
    newGateNode.value = emptyLogicNode;
  };

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: type,
    drop: (
      item: LogicNode | Diagram | { objType: 'Gate'; gateType: GateType },
    ) => {
      // If the item is a diagram, add its name to the compChildren of the dropped node
      if (item.objType === 'Diagram') {
        const { name } = item;
        // setCompDiagram(diagramType === 'dtSingle');
        if (!node) {
          return;
        }
        const logicNode = getLogicNodeByName(node); // Get the info of the logic node to be updated
        if (!logicNode) {
          return;
        }
        if (
          logicNode.compChildren.some(child => child.diagramName === item.name)
        ) {
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
      } else if (item.objType === 'LogicNode') {
        const logicNode = getLogicNodeByName(node); // Get the info of the logic node to be updated
        if (!logicNode) {
          return;
        }
        if (couldCreateInfiniteLoop(logicNode, item)) {
          console.log(
            'Alert: This node is already in the logic tree either as a child or parent',
          );
          return;
        }
        logicNode.gateChildren.push(item.name);
        updateLogicNode(logicNode); // Update the dropped node with the new compChildren
      } else {
        const { gateType } = item as { gateType: string }; // Get the gateType of the dropped item
        if (!node) {
          return;
        }

        const gateNodes = logicNodes.filter(node =>
          /^Gate \d+$/.test(node.name),
        ); // Find all existing logic nodes with the name Gate and a number

        const largestNumber = gateNodes.reduce(
          (max, node) =>
            Math.max(Number.parseInt(node.name.split(' ')[1] ?? '0'), max),
          0,
        );
        const newGateNumber = largestNumber + 1; // Increment the largest number to get the new gate number

        const logicNode = getLogicNodeByName(node); // Get the info of the logic node to be updated
        if (!logicNode) {
          return;
        }
        createLogicNode({
          // Create a new logic node with the gate type being the type of the dropped item
          ...newGateNode.value,
          id: uuidv4(),
          name: `Gate ${newGateNumber.toString()}`,
          gateType: gateType as GateType,
        });
        logicNode.gateChildren = [
          ...logicNode.gateChildren,
          `Gate ${newGateNumber.toString()}`,
        ]; // Add the new gate node's name to the gateChildren of the parent logic node
        updateLogicNode(logicNode); // Update the dropped node with the new gateChildren
        resetNewNode(); // Reset the new gate node to its empty state
      }
    },
    canDrop: (
      item: LogicNode | Diagram | { objType: 'Gate'; gateType: GateType },
    ) => {
      // Prevent drop if nodeType is 'comp' and if diagramType is 'dtMulti'
      return (
        nodeType !== 'comp'
        && ((item.objType === 'Diagram' && item.diagramType === 'dtSingle')
          || item.objType !== 'Diagram')
      );
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const backgroundColor = isOver && canDrop ? '#18e7a8' : 'transparent';

  return (
    <Box
      ref={drop as unknown as Ref<unknown>}
      sx={{ backgroundColor, borderRadius: '8px' }}
    >
      {children}
    </Box>
  );
};
