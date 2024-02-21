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
import KeyIcon from '@mui/icons-material/Key';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { capitalize } from 'lodash';
import { TbReplaceFilled, TbArrowBarToRight } from 'react-icons/tb';

interface NodeActionsProps {
  type: 'immediate' | 'event';
  actions: string[] | EventAction[];
  events?: {event: {name: string, evType: string}, actions: string[], moveFromTarget: boolean}[];
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
  events
}) => {
  const [expandedPanel, setExpandedPanel] = React.useState<boolean>(true);

  console.log(events);

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
            {events && events.map((item) => (
              <Box key={item.event.name} sx={{borderBottom: "1px solid rgba(0, 0, 0, .125)", display: 'flex', alignItems: 'center', p: '5px', ":last-child": {
                borderBottom: "none"
              }}}>
                <TbReplaceFilled style={{width: '15px', height: '15px'}}/>
                <Box>
                  <Typography sx={{ fontSize: 10, ml: "10px", ":hover": 'background: rgba(0, 0, 0, .125)' }}>{item.event.name}</Typography>
                  <Box>
                    {item.actions.map((action) => (
                      <Box sx={{display: 'flex', alignItems: 'center', ml: "10px"}}>
                        <TbArrowBarToRight />
                        <Typography key={action} sx={{ fontSize: 10, ml: "5px" }}>{action}</Typography>
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
        
        {/* <DiagramAccordionDetails sx={{ p: 0 }}>
          <ActionList actions={actions} />
        </DiagramAccordionDetails> */}
      </DiagramAccordion>
      <Handle
        className="custom-node__handle-right source-handle"
        type="source"
        position={Position.Right}
        id={`${type}-action-source`}
      />
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
    if (typeof action === 'string') {
      return (
        <ListItem key={index}>
          <TbArrowBarToRight /> <Typography sx={{ fontSize: 10, ml: '5px' }}>{action}</Typography>
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
      return <KeyIcon sx={{color: '#E2B84C'}}/>;
    case 'stStart':
      return <PlayCircleOutlineIcon color='success'/>;
    case 'stTerminal':
      return <HighlightOffIcon color='error'/>;
    default:
      return <></>;
  }
}


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
        <NodeActionsComponent actions={immediateActions} type="immediate" />
        <NodeActionsComponent actions={eventActions} events={events} type="event" />
      </div>
    </>
  );
}

export default memo(CustomNode);
