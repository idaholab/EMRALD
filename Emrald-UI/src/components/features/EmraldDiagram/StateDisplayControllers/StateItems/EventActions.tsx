import React from 'react';
import { Handle, Position } from 'reactflow';
import { Typography, Box } from '@mui/material';
import { BiExit } from 'react-icons/bi';
import DropTargetComponent from '../../../../drag-and-drop/Droppable';
import { ActionTypeIcon, EventTypeIcon } from '../../IconTypes';
import { State } from '../../../../../types/State';
import { useEventContext } from '../../../../../contexts/EventContext';
import { useActionContext } from '../../../../../contexts/ActionContext';
import { Action } from '../../../../../types/Action';

interface EventActionsProps {
  state: State;
  updateStateEventActions: (
    stateName: string,
    eventName: string,
    action: Action,
  ) => void;
}
const EventActions: React.FC<EventActionsProps> = ({
  state,
  updateStateEventActions,
}) => {
  const { getEventByEventName } = useEventContext();
  const { getActionByActionName } = useActionContext();

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
              <EventTypeIcon type={item.event?.evType || 'etStateCng'} />
            </Box>
            <Box
              sx={{
                width: '100%',
                borderLeft: '1px solid rgba(0, 0, 0, .125)',
              }}
            >
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
              <Box>
                {item.actions.map((action) => (
                  <Box
                    key={action?.id}
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      ml: '20px',
                      py: '5px',
                    }}
                  >
                    {action ? (
                      <>
                        {action && action.actType === 'atTransition' ? (
                          <Handle
                            className="custom-node__handle-right source-handle"
                            type="source"
                            position={Position.Right}
                            id={`event-action-source-${action.id}`}
                          />
                        ) : (
                          <></>
                        )}

                        <ActionTypeIcon type={action.actType} />
                        <Typography sx={{ fontSize: 10, ml: '5px' }}>
                          {action?.name}
                        </Typography>

                        <Handle
                          className="custom-node__handle-right source-handle"
                          type="source"
                          position={Position.Right}
                          id={`event-action-source-${action.id}`}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
    </>
  );
};

export default EventActions;
