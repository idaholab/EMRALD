import { Handle, Position } from 'reactflow';
import './CustomNode.scss';
import { List, ListItem, Typography, Box } from '@mui/material';
import { EventAction } from '../../../types/State';
import {
  TbArrowBarToRight,
} from 'react-icons/tb';
import { FaLink } from 'react-icons/fa';
import { useActionContext } from '../../../contexts/ActionContext';
import { useStateContext } from '../../../contexts/StateContext';

interface ActionListProps {
  state: string;
  actions: string[] | EventAction[];
  diagramStates: string[] | undefined;
}

const ActionList: React.FC<ActionListProps> = ({ state, actions, diagramStates }) => {
  /**
   * Renders an action element based on the provided action and index.
   *
   * @param {string | EventAction} action - The action to render.
   * @param {number} index - The index of the action.
   * @return {JSX.Element} The rendered action element.
   */
  const renderAction = (state: string, action: string | EventAction, index: number, diagramStates: string[] | undefined) => {
    const { getActionByActionName } = useActionContext();
    const { getStateByStateName } = useStateContext();
    const actionValue = getActionByActionName(action);
    const newStates = actionValue?.newStates?.map((state) => state.toState) ?? [];
    const newStatesIncluded = newStates.every(newState => diagramStates?.includes(newState));
    const diagramForNewState = getStateByStateName(state);

    if (typeof action === 'string') {
      return (
        <ListItem key={index} sx={{ position: 'relative', display: 'flex', justifyContent: 'start' }}>
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
          <Box sx={{ width: "100%", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 10, ml: '5px' }}>{action}</Typography>
            {
              !newStatesIncluded ? <FaLink style={{cursor: 'pointer', width: '20px'}}/> : <></>
            }
            {/* <FaLink /> */}
          </Box>
        </ListItem>
      );
    } else {
      return (
        <ListItem key={index}>
          <Typography sx={{ fontSize: 10 }}>
            {action.actions ? action.actions[0] : ''}
          </Typography>
        </ListItem>
      );
    }
  };

  return (
    <List dense={true} sx={{ padding: 0 }}>
      {actions.map((action, index) => renderAction(state, action, index, diagramStates))}
    </List>
  );
};

export default ActionList;