import React from 'react';
import '../CustomNode.scss';
import { Typography } from '@mui/material';
import {
  DiagramAccordion,
  DiagramAccordionDetails,
  DiagramAccordionSummary,
} from '../DiagramAccordion';
import { capitalize } from 'lodash';
import { Event as EventType } from '../../../../types/Event';
import { Action } from '../../../../types/Action';
import DropTargetComponent from '../../../drag-and-drop/Droppable';
import { State } from '../../../../types/State';
import EventActions from './StateItems/EventActions';
import ImmediateActions from './StateItems/ImmediateActions';

interface StateControllerComponentProps {
  type: 'immediate' | 'event';
  state: State;
  diagramStates: string[];
  updateStateEvents: (stateName: string, event: EventType) => void;
  updateStateEventActions: (stateName: string, eventName: string, action: Action) => void;
  updateStateImmediateActions: (stateName: string, action: Action) => void;
}

const StateControllerComponent: React.FC<StateControllerComponentProps> = ({
  type,
  state,
  diagramStates,
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
          state={state.name} 
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

        <DiagramAccordionDetails sx={{ p: 0 }}>
          {type === 'event' ? (
              <EventActions state={state} updateStateEventActions={updateStateEventActions} />
          ) : (
              <ImmediateActions state={state} diagramStates={diagramStates} />
          )}
        </DiagramAccordionDetails>
      </DiagramAccordion>
    </div>
  );
};

export default StateControllerComponent;