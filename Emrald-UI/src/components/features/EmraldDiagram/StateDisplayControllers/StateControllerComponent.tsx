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
import useEmraldDiagram from '../useEmraldDiagram';
import useContextMenu from '../useContextMenu';
import ContextMenu from '../../../layout/ContextMenu/ContextMenu';

interface StateControllerComponentProps {
  type: 'immediate' | 'event';
  state: State;
}

const StateControllerComponent: React.FC<StateControllerComponentProps> = ({
  type,
  state
}) => {
  const [expandedPanel, setExpandedPanel] = React.useState<boolean>(true);
  const { updateStateEvents, updateStateImmediateActions } = useEmraldDiagram();
  const { menu, menuOptions, onActionsHeaderContextMenu, closeContextMenu } = useContextMenu();

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
          <DiagramAccordionSummary 
            aria-controls={`panel1a-content`}
            onContextMenu={(e) => onActionsHeaderContextMenu(e, type)}>
            <Typography sx={{ fontSize: 11 }}>{`${capitalize(
              type,
            )} actions`}</Typography>
          </DiagramAccordionSummary>
        </DropTargetComponent>

        <DiagramAccordionDetails sx={{ p: 0 }}>
          {type === 'event' ? (
            <EventActions state={state} />
          ) : (
            <ImmediateActions state={state} />
          )}
        </DiagramAccordionDetails>
      </DiagramAccordion>

      {menu && (
        <ContextMenu
          mouseX={menu.mouseX}
          mouseY={menu.mouseY}
          handleClose={closeContextMenu}
          options={menuOptions}
        />
      )}
    </div>
  );
};

export default StateControllerComponent;