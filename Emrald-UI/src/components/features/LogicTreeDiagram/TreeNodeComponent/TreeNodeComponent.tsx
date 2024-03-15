import { Handle, Position } from 'reactflow';
import './TreeNode.scss';
import { Box, IconButton } from '@mui/material';
import { FaLink } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/close';
import useLogicNodeTreeDiagram from '../useLogicTreeDiagram';

interface TreeNodeComponentProps {
  id: string;
  data: {
    label: string;
    type: string;
  };
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({ id, data }) => {
  const { label, type } = data;
  const { goToDiagram } = useLogicNodeTreeDiagram();
  return (
    <Box
      className={`tree-node ${
        type === 'comp' ? 'tree-node__comp' : 'tree-node__gate'
      }`}
    >
      <Box className="tree-node__control-bar">
      {
          type === 'comp' ? ( // Only show delete button if not root
            <IconButton
            aria-label="close"
            onClick={() => goToDiagram(label)}
            sx={{height: 16, width: 16, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          >
            <FaLink className="tree-node__control-bar control-icon"/>
          </IconButton>
          ) : <></>
        }
        {
          type !== 'root' ? ( // Only show delete button if not root
            <IconButton
            aria-label="close"
            onClick={() => console.log("remove node")}
            sx={{height: 16, width: 16}}
          >
            <DeleteIcon sx={{height: 16, width: 16}}/>
          </IconButton>
          ) : <></>
        }
      </Box>
      <Box className="tree-node__header">
        <strong>{label}</strong>
      </Box>
      <Box className="tree-node__body">Where description will go</Box>
      { type !== 'root' ? <Handle type="target" position={Position.Top} /> : <></>}
      { type !== 'comp' ? <Handle type="source" position={Position.Bottom} /> : <></>}
    </Box>
  );
};

export default TreeNodeComponent;
