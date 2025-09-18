import { Handle, Position } from 'reactflow';
import { List, ListItem, Typography, Box } from '@mui/material';
import { TbArrowBarToRight } from 'react-icons/tb';
import { FaLink } from 'react-icons/fa';
import useEmraldDiagram from '../../useEmraldDiagram';
import ContextMenu from '../../../../layout/ContextMenu/ContextMenu';
import useContextMenu from '../../useContextMenu';
import type { State } from '../../../../../types/EMRALD_Model';
import DialogComponent from '../../../../common/DialogComponent/DialogComponent';

interface ImmediateActionsProps {
  state: State;
}

const ImmediateActions: React.FC<ImmediateActionsProps> = ({ state }) => {
  const { immediateActions } = state;
  const {
    openDiagramFromNewState,
    isStateInCurrentDiagram,
    getActionByActionName,
    onActionDoubleClick,
  } = useEmraldDiagram();

  const {
    menu,
    menuOptions,
    deleteConfirmation,
    itemToDelete,
    deleteItem,
    closeContextMenu,
    closeDeleteConfirmation,
    onActionContextMenu,
  } = useContextMenu();

  return (
    <List dense={true} sx={{ padding: 0 }}>
      {immediateActions.map((action, index) => {
        const actionValue = getActionByActionName(action);

        return (
          <ListItem
            onDoubleClick={(e) => {
              onActionDoubleClick(e, actionValue);
            }}
            onContextMenu={(e) => {
              if (actionValue) {
                onActionContextMenu(e, state, actionValue, 'immediate');
              }
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
                id={actionValue.id ?? ''}
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
                  onClick={() => {
                    if (actionValue) {
                      openDiagramFromNewState(actionValue);
                    }
                  }}
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
      {deleteConfirmation && (
        <DialogComponent
          open={true}
          title="Delete Confirmation"
          submitText="delete"
          onSubmit={() => {
            deleteItem();
          }}
          onClose={() => {
            closeDeleteConfirmation();
          }}
        >
          <Typography>
            Are you sure you want to delete {itemToDelete?.name}? It will be removed from all other
            places it is used.
          </Typography>
        </DialogComponent>
      )}
    </List>
  );
};

export default ImmediateActions;
