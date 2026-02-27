import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import type { EMRALD_Model } from '../../../../types/EMRALD_Model';
import { type ReactNode } from 'react';
import type { ModelItem } from '../../../../types/ModelUtils';
import { SearchContextMenu } from './SearchContextMenu';

interface ItemTypeMenuResultsProps {
  model: EMRALD_Model;
  isNested?: boolean;
  getModel: (item: ModelItem, direction: string) => ReactNode;
  expandable?: boolean;
}

const ItemTypeMenuResults: React.FC<React.PropsWithChildren<ItemTypeMenuResultsProps>> = ({
  model,
  isNested,
  getModel,
  expandable,
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
    return expandable === false ? (
      <>
        <Card>
          <CardContent>
            <Typography fontWeight="bold">
              {title} ({items.length})
            </Typography>
            {items.map((item) => (
              <Card sx={{ margin: '8px' }}>
                <CardContent>
                  <SearchContextMenu targetItem={item}>
                    <Typography>{item.name}</Typography>
                  </SearchContextMenu>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </>
    ) : (
      <Accordion defaultExpanded={isNested ? false : true}>
        <AccordionSummary sx={{ fontWeight: 'bold' }}>
          {title} ({items.length})
        </AccordionSummary>
        <AccordionDetails>
          {items.map((item) => (
            <Accordion key={item.id}>
              <SearchContextMenu targetItem={item}>
                <AccordionSummary>{item.name}</AccordionSummary>
                <AccordionDetails>{DisplayButtonOrModel(item)}</AccordionDetails>
              </SearchContextMenu>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box id="itemTypeMenuResults">
      {model.DiagramList.length > 0 && DisplayItemTypeCard('Diagrams', model.DiagramList)}
      {model.StateList.length > 0 && DisplayItemTypeCard('States', model.StateList)}
      {model.ActionList.length > 0 && DisplayItemTypeCard('Actions', model.ActionList)}
      {model.EventList.length > 0 && DisplayItemTypeCard('Events', model.EventList)}
      {model.ExtSimList.length > 0 && DisplayItemTypeCard('ExtSims', model.ExtSimList)}
      {model.LogicNodeList.length > 0 && DisplayItemTypeCard('LogicNodes', model.LogicNodeList)}
      {model.VariableList.length > 0 && DisplayItemTypeCard('Variables', model.VariableList)}
    </Box>
  );
};

export default ItemTypeMenuResults;
