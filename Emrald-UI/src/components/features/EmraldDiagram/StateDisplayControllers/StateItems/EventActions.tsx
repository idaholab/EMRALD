import React from 'react';
import { Handle, Position } from 'reactflow';
import { Typography, Box } from '@mui/material';
import { BiExit } from 'react-icons/bi';
import DropTargetComponent from '../../../../drag-and-drop/Droppable';
import { ActionTypeIcon, EventTypeIcon } from '../../IconTypes';
import { State } from '../../../../../types/State';
import { FaLink } from 'react-icons/fa';
import useEmraldDiagram from '../../useEmraldDiagram';
import ContextMenu from '../../../../layout/ContextMenu/ContextMenu';
import useContextMenu from '../../useContextMenu';
import DialogComponent from '../../../../common/DialogComponent/DialogComponent';

interface EventActionsProps {
  state: State;
}
const EventActions: React.FC<EventActionsProps> = ({ state }) => {
  const {
    isStateInCurrentDiagram,
    openDiagramFromNewState,
    getEventByEventName,
    getActionByActionName,
    updateStateEventActions,
  } = useEmraldDiagram();

  const {
    menu,
    menuOptions,
    deleteConfirmation,
    itemToDelete,
    deleteItem,
    closeDeleteConfirmation,
    closeContextMenu,
    onEventContextMenu,
    onActionContextMenu,
  } = useContextMenu();

  const events = state.events.map((event, index) => ({
    event: getEventByEventName(event),
    actions: state.eventActions[index]
      ? state.eventActions[index].actions.map((action: string) =>
          getActionByActionName(action),
        )
      : [],
    moveFromCurrent: state.eventActions[index]
      ? state.eventActions[index].moveFromCurrent
      : false,
  }));

  return (
    <>
      {events &&
        events.map((item) => (
          // Event container
          <Box
            key={item.event?.name}
            sx={{
              borderBottom: '1px solid rgba(0, 0, 0, .125)',
              display: 'flex',
              alignItems: 'center',
              pl: '5px',
              ':last-child': {
                borderBottom: 'none',
              },
            }}
          >
            <Box
              sx={{
                minHeight: '20px',
                width: '20px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Event Type  */}
              <EventTypeIcon type={item.event?.evType || 'etStateCng'} />
            </Box>
            <Box
              onContextMenu={(e) => onEventContextMenu(e, state, item.event)}
              sx={{
                width: '100%',
                borderLeft: '1px solid rgba(0, 0, 0, .125)',
              }}
            >
              {menu && (
                <ContextMenu
                  mouseX={menu.mouseX}
                  mouseY={menu.mouseY}
                  handleClose={closeContextMenu}
                  options={menuOptions}
                />
              )}
              {/* Event  */}
              <DropTargetComponent
                type="Action"
                state={state.name}
                actionType="event"
                event={item.event?.name}
                updateStateEventActions={updateStateEventActions}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(0, 0, 0, .125)',
                    py: '5px',
                    background: 'rgba(173,216,230, 0.25)',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 10,
                      ml: '10px',
                      ':hover': 'background: rgba(0, 0, 0, .125)',
                    }}
                  >
                    {item.event?.name}
                  </Typography>
                  {item.moveFromCurrent === true ? (
                    <BiExit style={{ width: '18px', height: '18px' }} />
                  ) : (
                    <></>
                  )}
                </Box>
              </DropTargetComponent>

              {/* Event Actions */}
              <Box>
                {item.actions.map((action) => (
                  <Box
                    onContextMenu={(e) =>
                      onActionContextMenu(e, state, action, 'event')
                    }
                    key={action?.id}
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      ml: '10px',
                      mr: '5px',
                      py: '5px',
                    }}
                  >
                    {action ? (
                      <>
                        {action.actType === 'atTransition' ? (
                          <Handle
                            className="state-node__handle-right source-handle"
                            type="source"
                            position={Position.Right}
                            id={`${action.id}`}
                          />
                        ) : (
                          <></>
                        )}

                        <ActionTypeIcon type={action.actType} />

                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography sx={{ fontSize: 10, ml: '5px' }}>
                            {' '}
                            {action?.name}
                          </Typography>
                          {!isStateInCurrentDiagram(action) ? (
                            <FaLink
                              onClick={() => openDiagramFromNewState(action)}
                              style={{ cursor: 'pointer', width: '20px' }}
                            />
                          ) : (
                            <></>
                          )}
                        </Box>
                      </>
                    ) : (
                      <></>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {
            deleteConfirmation && (
              <DialogComponent 
                open={true}
                title="Delete Confirmation"
                submitText="delete"
                onSubmit={() => deleteItem()}
                onClose={() => closeDeleteConfirmation()}
              >
                <Typography>Are you sure you want to delete {itemToDelete?.name}? It will be removed from all other places it is used.</Typography>
              </DialogComponent>
            )
          }
          </Box>
        ))}
    </>
  );
};

export default EventActions;
