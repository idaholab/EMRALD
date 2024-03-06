import { Handle, Position } from 'reactflow';
import { List, ListItem, Typography, Box } from '@mui/material';
import { TbArrowBarToRight } from 'react-icons/tb';
import { FaLink } from 'react-icons/fa';
import { State } from '../../../../../types/State';
import { Diagram } from '../../../../../types/Diagram';
import useEmraldDiagram from '../../useEmraldDiagram';
import ContextMenu from '../../../../layout/ContextMenu/ContextMenu';

interface ImmediateActionsProps {
  state: State;
  diagram: Diagram;
}

const ImmediateActions: React.FC<ImmediateActionsProps> = ({
  state,
  diagram,
}) => {
  const { immediateActions } = state;
  const {
    menu,
    menuOptions,
    closeContextMenu,
    onActionContextMenu,
    openDiagramFromNewState,
    isStateInCurrentDiagram,
    getActionByActionName,
  } = useEmraldDiagram(diagram);

  return (
    <List dense={true} sx={{ padding: 0 }}>
      {immediateActions.map((action, index) => {
        const actionValue = getActionByActionName(action);

        return (
          <ListItem
            onContextMenu={(e) => {
              onActionContextMenu(e, state, actionValue, "immediate");
            }}
            key={index}
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'start',
              pl: '10px',
              pr: '5px',
            }}
          >
            {actionValue ? (
              <Handle
                className="state-node__handle-right source-handle"
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
              {!isStateInCurrentDiagram(actionValue) ? (
                <FaLink
                  onClick={() => openDiagramFromNewState(actionValue)}
                  style={{ cursor: 'pointer', width: '20px' }}
                />
              ) : (
                <></>
              )}
            </Box>
          </ListItem>
        );
      })}
      {menu && (
        <ContextMenu
          mouseX={menu.mouseX}
          mouseY={menu.mouseY}
          handleClose={closeContextMenu}
          options={menuOptions}
        />
      )}
    </List>
  );
};

export default ImmediateActions;
