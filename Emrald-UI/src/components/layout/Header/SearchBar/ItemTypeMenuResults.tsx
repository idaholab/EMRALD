import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import type {
  Diagram,
  State,
  Action,
  Event,
  ExtSim,
  LogicNode,
  Variable,
} from '../../../../types/EMRALD_Model';
import type { ReactNode } from 'react';
import type { ModelItem } from '../../../../types/ModelUtils';

interface ItemTypeMenuResultsProps {
  diagrams: Diagram[];
  isNested?: boolean;
  states: State[];
  actions: Action[];
  events: Event[];
  extSims: ExtSim[];
  logicNodes: LogicNode[];
  variables: Variable[];
  handleItemClick: (event: React.MouseEvent, item: ModelItem) => void;
  getModel: (item: ModelItem, direction: string) => ReactNode;
}

const ItemTypeMenuResults: React.FC<React.PropsWithChildren<ItemTypeMenuResultsProps>> = ({
  diagrams,
  isNested,
  states,
  actions,
  events,
  extSims,
  logicNodes,
  variables,
  handleItemClick,
  getModel,
}) => {
  const DisplayButtonOrModel = (item: ModelItem): ReactNode => {
    return (
      <Box>
        <div>{getModel(item, 'Used By')}</div>
        <div style={{ marginTop: 10 }}>{getModel(item, 'Using')}</div>
      </Box>
    );
  };
  const DisplayItemTypeCard = (title: string, items: ModelItem[]) => {
    return (
      <Accordion defaultExpanded={isNested ? false : true}>
        <AccordionSummary sx={{ fontWeight: 'bold' }}>
          {title} ({items.length})
        </AccordionSummary>
        <AccordionDetails>
          {items.map((item) => (
            <Accordion key={item.id}>
              <AccordionSummary
                onContextMenu={(e) => {
                  handleItemClick(e, item);
                }}
              >
                {item.name}
              </AccordionSummary>
              <AccordionDetails>{DisplayButtonOrModel(item)}</AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box id="itemTypeMenuResults">
      {diagrams.length > 0 && DisplayItemTypeCard('Diagrams', diagrams)}
      {states.length > 0 && DisplayItemTypeCard('States', states)}
      {actions.length > 0 && DisplayItemTypeCard('Actions', actions)}
      {events.length > 0 && DisplayItemTypeCard('Events', events)}
      {extSims.length > 0 && DisplayItemTypeCard('ExtSims', extSims)}
      {logicNodes.length > 0 && DisplayItemTypeCard('LogicNodes', logicNodes)}
      {variables.length > 0 && DisplayItemTypeCard('Variables', variables)}
    </Box>
  );
};

export default ItemTypeMenuResults;
