import type { State } from '../../../../types/EMRALD_Model';
import { Typography } from '@mui/material';
import { capitalize } from 'lodash';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';
import { DropTargetComponent } from '../../../drag-and-drop/Droppable';
import { ContextMenu } from '../../../layout/ContextMenu/ContextMenu';
import {
  DiagramAccordion,
  DiagramAccordionDetails,
  DiagramAccordionSummary,
} from '../DiagramAccordion';
import { useContextMenu } from '../useContextMenu';
import { useEmraldDiagram } from '../useEmraldDiagram';
import { EventActions } from './StateItems/EventActions';
import { ImmediateActions } from './StateItems/ImmediateActions';
import '../StateNode.scss';

interface StateControllerComponentProps {
  type: 'immediate' | 'event';
  state: State;
}

export const StateControllerComponent: React.FC<
  StateControllerComponentProps
> = ({ type, state }) => {
  const [expandedPanel, setExpandedPanel] = useState(true);
  const { updateStateEvents, updateStateImmediateActions } = useEmraldDiagram();
  const { menu, menuOptions, onActionsHeaderContextMenu, closeContextMenu }
    = useContextMenu();

  const handleAccordionChange = useCallback(
    debounce(() => {
      setExpandedPanel(prev => !prev);
    }, 30), // Adjust the debounce delay as needed
    [],
  );

  return (
    <div className={`state-node__${type}-actions`}>
      <DiagramAccordion
        expanded={expandedPanel}
        aria-controls={`panel-${state.name}-${type}-content`}
        id={`panel-${state.name}-${type}-header`}
        onChange={handleAccordionChange}
      >
        <DropTargetComponent
          type={type === 'event' ? 'Event' : 'Action'}
          state={state.name}
          actionType={type === 'event' ? 'event' : 'immediate'}
          updateStateEvents={updateStateEvents}
          updateStateImmediateActions={updateStateImmediateActions}
        >
          <DiagramAccordionSummary
            aria-controls="panel1a-content"
            onContextMenu={e => void onActionsHeaderContextMenu(e, type, state)}
          >
            <Typography sx={{ fontSize: 11 }}>
              {`${capitalize(type)} actions`}
            </Typography>
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
