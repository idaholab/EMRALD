import React from 'react';
import '../StateNode.scss';
import { Typography } from '@mui/material';
import {
  DiagramAccordion,
  DiagramAccordionDetails,
  DiagramAccordionSummary,
} from '../DiagramAccordion';
import { capitalize } from 'lodash';
import DropTargetComponent from '../../../drag-and-drop/Droppable';
import { State } from '../../../../types/State';
import EventActions from './StateItems/EventActions';
import ImmediateActions from './StateItems/ImmediateActions';
import { Diagram } from '../../../../types/Diagram';
import useEmraldDiagram from '../useEmraldDiagram';

interface StateControllerComponentProps {
  type: 'immediate' | 'event';
  state: State;
  diagram: Diagram;
}

const StateControllerComponent: React.FC<StateControllerComponentProps> = ({
  type,
  state,
  diagram
}) => {
  const [expandedPanel, setExpandedPanel] = React.useState<boolean>(true);
  const { updateStateEvents, updateStateImmediateActions } = useEmraldDiagram(diagram);

  return (
    <div className={`state-node__${type}-actions`}>
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
              <EventActions state={state} diagram={diagram} />
          ) : (
              <ImmediateActions state={state} diagram={diagram} />
          )}
        </DiagramAccordionDetails>
      </DiagramAccordion>
    </div>
  );
};

export default StateControllerComponent;