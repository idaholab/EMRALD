import { Handle, Position, Node, useNodes } from 'reactflow';
import './TreeNode.scss';
import { Box, IconButton, TextField } from '@mui/material';
import { FaLink } from 'react-icons/fa';
import { Close as DeleteIcon } from '@mui/icons-material';
import { PiNotePencilDuotone } from 'react-icons/pi';
import useLogicNodeTreeDiagram, { NodeType } from '../useLogicTreeDiagram';
import React from 'react';
import GateTypeIcon from '../IconTypes/GateTypeIcon';
import { GateType } from '../../../../types/ItemTypes';
import { LogicNode } from '../../../../types/LogicNode';
import LogicTreeNodeDropTarget from '../../../drag-and-drop/LogicTreeNodeDroppable';

interface TreeNodeComponentProps {
  id: string;
  data: {
    label: string;
    type: NodeType;
    gateType: GateType;
    description: string;
    parentName: string;
    defaultStateValues?: boolean;
  };
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({ id, data }) => {
  const { label, type, gateType, description, parentName, defaultStateValues } =
    data;
  const { goToDiagram } = useLogicNodeTreeDiagram();
  const nodes = useNodes();
  const {
    editingDescription,
    editedDescription,
    setEditedDescription,
    handleDescriptionDoubleClick,
    handleDescriptionBlur,
    removeNode,
  } = useLogicNodeTreeDiagram();

  return (
    <Box
      className={`tree-node 
        ${type === 'comp' ? 'tree-node__comp' : 'tree-node__gate'}
        ${type === 'comp' && !defaultStateValues ? 'non-default' : ''}`}
    >
      <LogicTreeNodeDropTarget
        type={['Gate', 'Diagram']}
        nodeType={type}
        node={label}
      >
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  {/* Left container with icon */}
  <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
    {type === 'comp' && !defaultStateValues ? (
      <PiNotePencilDuotone className="modified-icon" />
    ) : (
      <></>
    )}
  </Box>

  {/* Center container with title text */}
  <Box className="tree-node__header" sx={{ flex: 1 }}>
    <strong>{label}</strong>
  </Box>

  {/* Right container with control buttons */}
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {type === 'comp' ? (
      <IconButton
        aria-label="close"
        onClick={() => goToDiagram(label)}
        sx={{ marginLeft: '5px', width: 22, height: 22, p: '6px' }}
      >
        <FaLink className="tree-node__control-bar control-icon" />
      </IconButton>
    ) : (
      <></>
    )}
    {type !== 'root' ? ( // Only show delete button if not root
      <IconButton
        aria-label="close"
        onClick={() => removeNode(parentName, label, type)}
        sx={{ p: 0, ml: '5px' }}
      >
        <DeleteIcon sx={{ height: 16, width: 16 }} />
      </IconButton>
    ) : (
      <></>
    )}
  </Box>
</Box>

        {editingDescription ? (
          <TextField
            value={editedDescription}
            onChange={(event) => setEditedDescription(event.target.value)}
            onBlur={() => handleDescriptionBlur(id, type, label, nodes)}
            multiline
            fullWidth
            variant="outlined"
            autoFocus
          />
        ) : (
          <Box
            className="tree-node__body"
            onDoubleClick={() => handleDescriptionDoubleClick(description)}
          >
            {editedDescription ? editedDescription : description}
          </Box>
        )}

        {type !== 'root' ? (
          <Handle type="target" position={Position.Top} />
        ) : (
          <></>
        )}
        {type !== 'comp' ? (
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Handle type="source" position={Position.Bottom} />
            <GateTypeIcon type={gateType} className="logic-icon" />
          </Box>
        ) : (
          <></>
        )}
      </LogicTreeNodeDropTarget>
    </Box>
  );
};

export default TreeNodeComponent;
