import { Handle, Position } from 'reactflow';
import { List, ListItem, Typography, Box } from '@mui/material';
import { TbArrowBarToRight } from 'react-icons/tb';
import { FaLink } from 'react-icons/fa';
import { State } from '../../../../../types/State';
import { useActionContext } from '../../../../../contexts/ActionContext';

interface ImmediateActionsProps {
  state: State;
  diagramStates: string[];
}

const ImmediateActions: React.FC<ImmediateActionsProps> = ({ state, diagramStates }) => {
  const { immediateActions } = state;
  const { getActionByActionName } = useActionContext();
  return (
    <List dense={true} sx={{ padding: 0 }}>
      {immediateActions.map((action, index) => {
        const actionValue = getActionByActionName(action);
        const newStates = actionValue?.newStates?.map((state) => state.toState) ?? [];
        const newStatesIncluded = newStates.every(newState => diagramStates?.includes(newState));
        
        return (
          <ListItem
            key={index}
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'start',
            }}
          >
            {actionValue ? (
              <Handle
                className="custom-node__handle-right source-handle"
                type="source"
                position={Position.Right}
                id={`immediate-action-source-${actionValue.id}`}
              />
            ) : (
              <></>
            )}
            <TbArrowBarToRight />{' '}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: 10, ml: '5px' }}>{action}</Typography>
              {!newStatesIncluded ? (
                <FaLink style={{ cursor: 'pointer', width: '20px' }} />
              ) : (
                <></>
              )}
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};

export default ImmediateActions;
