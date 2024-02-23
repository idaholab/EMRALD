import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './CustomNode.scss';
import { List, ListItem, Typography, Box } from '@mui/material';
import {
  DiagramAccordion,
  DiagramAccordionDetails,
  DiagramAccordionSummary,
} from './DiagramAccordion';
import { EventAction } from '../../../types/State';
import { EventType, ActionType } from '../../../types/ItemTypes';
import { Event } from '../../../types/Event';
import KeyIcon from '@mui/icons-material/Key';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { capitalize } from 'lodash';
import {
  TbReplaceFilled,
  TbArrowBarToRight,
  TbArrowsSplit,
} from 'react-icons/tb';
import { GiPerspectiveDiceSixFacesOne } from 'react-icons/gi';
import {
  PiTimer,
  PiArrowsMergeBold,
  PiArrowSquareDownLeft,
} from 'react-icons/pi';
import { HiOutlineVariable } from 'react-icons/hi';
import { Action } from '../../../types/Action';
import { FaCog } from 'react-icons/fa';
import { BiExit } from 'react-icons/bi';
import { useActionContext } from '../../../contexts/ActionContext';

interface NodeActionsProps {
  type: 'immediate' | 'event';
  actions: string[] | EventAction[];
  events?: { event: Event; actions: Action[]; moveFromCurrent: boolean }[];
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
        <DiagramAccordionSummary aria-controls={`panel1a-content`}>
          <Typography sx={{ fontSize: 11 }}>{`${capitalize(
            type,
          )} actions`}</Typography>
        </DiagramAccordionSummary>

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
                          {action.id ? (
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
            <ActionList actions={actions} />
          </DiagramAccordionDetails>
        )}
      </DiagramAccordion>
    </div>
  );
};

interface ActionListProps {
  actions: string[] | EventAction[];
}

const ActionList: React.FC<ActionListProps> = ({ actions }) => {
  /**
   * Renders an action element based on the provided action and index.
   *
   * @param {string | EventAction} action - The action to render.
   * @param {number} index - The index of the action.
   * @return {JSX.Element} The rendered action element.
   */
  const renderAction = (action: string | EventAction, index: number) => {
    const {getActionByActionName} = useActionContext();
    const actionValue = getActionByActionName(action);
    
    if (typeof action === 'string') {
      return (
        <ListItem key={index} sx={{ position: 'relative'}}>
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
          <Typography sx={{ fontSize: 10, ml: '5px' }}>{action}</Typography>
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
      {actions.map(renderAction)}
    </List>
  );
};

const NodeTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'stKeyState':
      return <KeyIcon sx={{ color: '#E2B84C' }} />;
    case 'stStart':
      return <PlayCircleOutlineIcon color="success" />;
    case 'stTerminal':
      return <HighlightOffIcon color="error" />;
    default:
      return <></>;
  }
};

const EventTypeIcon = ({ type }: { type: EventType }) => {
  switch (type) {
    case 'etStateCng':
      return <TbReplaceFilled style={{ width: '15px', height: '15px' }} />;
    case 'etComponentLogic':
      return (
        <PiArrowsMergeBold
          style={{ width: '15px', height: '15px', transform: 'rotate(270deg)' }}
        />
      );
    case 'etFailRate':
      return (
        <GiPerspectiveDiceSixFacesOne
          style={{ width: '15px', height: '15px' }}
        />
      );
    case 'etTimer':
      return <PiTimer style={{ width: '15px', height: '15px' }} />;
    case 'et3dSimEv':
      return (
        <PiArrowSquareDownLeft style={{ width: '15px', height: '15px' }} />
      );
    case 'etDistribution':
      return <TbArrowsSplit style={{ width: '15px', height: '15px' }} />;
    case 'etVarCond':
      return <HiOutlineVariable style={{ width: '15px', height: '15px' }} />;
    default:
      return <></>;
  }
};

const ActionTypeIcon = ({ type }: { type: ActionType }) => {
  switch (type) {
    case 'atTransition':
      return <TbArrowBarToRight />;
    case 'atCngVarVal':
      return <HiOutlineVariable />;
    case 'at3DSimMsg':
      return (
        <PiArrowSquareDownLeft style={{ width: '15px', height: '15px' }} />
      );
    case 'atRunExtApp':
      return <FaCog />;
    default:
      return <></>;
  }
};

interface CustomNodeProps {
  id: string;
  data: any;
}

/**
 * Renders a custom node component.
 *
 * @param {CustomNodeProps} { id, data } - The ID and data of the custom node.
 * @return {ReactNode} The rendered custom node component.
 */
function CustomNode({ id, data }: CustomNodeProps) {
  const { immediateActions, eventActions, events } = data;
  return (
    <>
      <div className="custom-node__header" id={id}>
        <strong>{data.label}</strong> <NodeTypeIcon type={data.type} />
      </div>
      <div className="custom-node__body">
        <Handle
          className="custom-node__handle-left target-handle"
          type="target"
          position={Position.Left}
          id={`action-target`}
        />
        <NodeActionsComponent actions={immediateActions} events={events} type="immediate" />
        <NodeActionsComponent
          actions={eventActions}
          events={events}
          type="event"
        />
      </div>
    </>
  );
}

export default memo(CustomNode);
