import type { GateType } from '../../../../types/EMRALD_Model';
import DeleteIcon from '@mui/icons-material/Close';
import { Box, IconButton, TextField } from '@mui/material';
import { FaLink } from 'react-icons/fa';
import { PiNotePencilDuotone } from 'react-icons/pi';
import { Handle, Position } from 'reactflow';
import { LogicTreeNodeDropTarget } from '../../../drag-and-drop/LogicTreeNodeDroppable';
import { ExpandedIcon } from '../IconTypes/ExpandedIcon';
import { GateTypeIcon } from '../IconTypes/GateTypeIcon';
import { type NodeType, useLogicNodeTreeDiagram } from '../useLogicTreeDiagram';
import './TreeNode.scss';

interface TreeNodeComponentProps {
  id: string;
  data: {
    label: string;
    type: NodeType;
    gateType: GateType;
    description: string;
    parentName: string;
    defaultStateValues?: boolean;
    expanded: boolean;
    expandable: boolean;
    toggleExpanded: () => void;
  };
}

export const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({
  data,
}) => {
  const {
    label,
    type,
    gateType,
    description,
    parentName,
    defaultStateValues,
    expanded,
    expandable,
  } = data;
  const {
    goToDiagram,
    editingTitle,
    editingDescription,
    editedDescription,
    editedTitle,
    setEditedDescription,
    setEditedTitle,
    handleDoubleClick,
    handleDescriptionBlur,
    handleTitleBlur,
    removeNode,
  } = useLogicNodeTreeDiagram();

  return (
    <Box
      className={`tree-node 
        ${type === 'comp' ? 'tree-node__comp' : 'tree-node__gate'}
        ${type === 'comp' && !defaultStateValues ? 'non-default' : ''}`}
    >
      <LogicTreeNodeDropTarget
        type={['Gate', 'Diagram', 'LogicNode']}
        nodeType={type}
        node={label}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: '8px',
          }}
          onClick={event => {
            event.stopPropagation();
          }}
        >
          {/* Left container with icon */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}
          >
            {type === 'comp' && !defaultStateValues ? (
              <PiNotePencilDuotone className="modified-icon" />
            ) : (
              <></>
            )}
          </Box>

          {editingTitle ? (
            <TextField
              value={editedTitle}
              onChange={event => {
                setEditedTitle(event.target.value);
              }}
              onBlur={() => {
                handleTitleBlur(type, label);
              }}
              fullWidth
              variant="outlined"
              slotProps={{
                htmlInput: { maxLength: 20, style: { fontSize: '12px' } },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  padding: '6px',
                },
              }}
              autoFocus
              size="small"
              maxRows={1}
            />
          ) : (
            <Box
              className="tree-node__header"
              sx={{ flex: 1 }}
              onDoubleClick={() => {
                handleDoubleClick('title', label);
              }}
            >
              {editedTitle ?? label}
            </Box>
          )}

          {/* Right container with control buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {type === 'comp' ? (
              <IconButton
                aria-label="close"
                onClick={() => {
                  goToDiagram(label);
                }}
                sx={{ marginLeft: '5px', width: 22, height: 22, p: '6px' }}
              >
                <FaLink className="tree-node__control-bar control-icon" />
              </IconButton>
            ) : (
              <></>
            )}
            {type === 'root' ? (
              <></>
            ) : (
              // Only show delete button if not root
              <IconButton
                aria-label="close"
                onClick={() => {
                  removeNode(parentName, label, type);
                }}
                sx={{ p: 0, ml: '5px' }}
              >
                <DeleteIcon sx={{ height: 16, width: 16 }} />
              </IconButton>
            )}
          </Box>
        </Box>

        <Box
          onClick={event => {
            event.stopPropagation();
          }}
          sx={{
            maxWidth: '220px',
            maxHeight: '73px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '4',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {editingDescription ? (
            <TextField
              value={editedDescription}
              onChange={event => {
                setEditedDescription(event.target.value);
              }}
              onBlur={() => {
                handleDescriptionBlur(type, label);
              }}
              multiline
              fullWidth
              variant="outlined"
              autoFocus
              slotProps={{ htmlInput: { style: { fontSize: '12px' } } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  padding: '6px',
                },
              }}
            />
          ) : (
            <Box
              className="tree-node__body"
              onDoubleClick={() => {
                handleDoubleClick('description', description);
              }}
            >
              {editedDescription ?? description}
            </Box>
          )}
        </Box>

        {type === 'root' ? (
          <></>
        ) : (
          <Handle type="target" position={Position.Top} />
        )}
        {type === 'comp' ? (
          <></>
        ) : (
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
            {expandable ? (
              <ExpandedIcon expanded={expanded} className="expanded-icon" />
            ) : (
              <></>
            )}
          </Box>
        )}
      </LogicTreeNodeDropTarget>
    </Box>
  );
};
