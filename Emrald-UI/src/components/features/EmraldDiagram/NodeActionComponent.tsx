import React from 'react';
import { Handle, Position } from 'reactflow';
import './CustomNode.scss';
import { Typography, Box } from '@mui/material';
import {
  DiagramAccordion,
  DiagramAccordionDetails,
  DiagramAccordionSummary,
} from './DiagramAccordion';
import { EventAction } from '../../../types/State';
import { Event } from '../../../types/Event';
import { capitalize } from 'lodash';
import { Action } from '../../../types/Action';
import { BiExit } from 'react-icons/bi';
import DropTargetComponent from '../../drag-and-drop/Droppable';
import { ActionTypeIcon, EventTypeIcon } from './IconTypes';
import ActionList from './ActionList';

interface NodeActionsProps {
  type: 'immediate' | 'event';
  actions: string[] | EventAction[];
  events?: { event: Event; actions: Action[]; moveFromCurrent: boolean }[];
  diagramStates?: string[];
  state: string;
  updateStateEvents?: (stateName: string, event: Event) => void;
  updateStateEventActions?: (stateName: string, eventName: string, action: Action) => void;
  updateStateImmediateActions?: (stateName: string, action: Action) => void;
}

/**
 * Renders the NodeActionsComponent.
 *
 * @param {NodeActionsProps} props - The props object containing the type and actions.
 * @return {ReactElement} The rendered NodeActionsComponent.
 */
const NodeActionsComponent: React.FC<NodeActionsProps> = ({
  type,
  actions,
  events,
  diagramStates,
  state,
  updateStateEvents,
  updateStateEventActions,
  updateStateImmediateActions
}) => {
  const [expandedPanel, setExpandedPanel] = React.useState<boolean>(true);

  return (
    <div className={`custom-node__${type}-actions`}>
      <DiagramAccordion
        expanded={expandedPanel}
        aria-controls="panel1a-content"
        id="panel1a-header"
        onClick={() => setExpandedPanel(!expandedPanel)}
      >
        <DropTargetComponent 
          type={type === 'event' ? 'Event' : 'Action'} 
          state={state} 
          actionType={type === 'event' ? 'event' : 'immediate'} 
          updateStateEvents={updateStateEvents}
          updateStateImmediateActions={updateStateImmediateActions}
          >
          <DiagramAccordionSummary aria-controls={`panel1a-content`}>
            <Typography sx={{ fontSize: 11 }}>{`${capitalize(
              type,
            )} actions`}</Typography>
          </DiagramAccordionSummary>
        </DropTargetComponent>

        {type === 'event' ? (
          <DiagramAccordionDetails sx={{ p: 0 }}>
            {events &&
              events.map((item) => (
                <Box
                  key={item.event.name}
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
                    <EventTypeIcon type={item.event.evType} />
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      borderLeft: '1px solid rgba(0, 0, 0, .125)',
                    }}
                  >
                    <DropTargetComponent type="Action" state={state} actionType="event" event={item.event.name} updateStateEventActions={updateStateEventActions}>
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
                        {item.event.name}
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
                          key={action.id}
                          sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            ml: '20px',
                            py: '5px',
                          }}
                        >
                          {action.id && action.actType === 'atTransition'? (
                            <Handle
                              className="custom-node__handle-right source-handle"
                              type="source"
                              position={Position.Right}
                              id={`${type}-action-source-${action.id}`}
                            />
                          ) : (
                            <></>
                          )}

                          <ActionTypeIcon type={action.actType} />
                          <Typography sx={{ fontSize: 10, ml: '5px' }}>
                            {action.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              ))}
          </DiagramAccordionDetails>
        ) : (
          <DiagramAccordionDetails sx={{ p: 0 }}>
            <ActionList state={state} actions={actions} diagramStates={diagramStates}/>
          </DiagramAccordionDetails>
        )}
      </DiagramAccordion>
    </div>
  );
};

export default NodeActionsComponent;