import { useState } from 'react';
import Typography from '@mui/material/Typography';
import AccordionMenuItems from './AccordionMenuItems';
import { AccordionMenuItemType } from './types/AccordionMenuItems';
import { Accordion, AccordionDetails, AccordionSummary } from './StyledComponents/StyledComponents';
import List from '@mui/material/List';

interface MenuAccordionProps {
  panels: AccordionMenuItemType[];
}

const MenuAccordion: React.FC<MenuAccordionProps> = ({ panels }) => {
  const [expandedPanel, setExpandedPanel] = useState<string>('');

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanel(isExpanded ? panel : '');
    };

  return (
    <List>
      {panels.map((panel: AccordionMenuItemType) => (
        <Accordion
          key={panel.type}
          expanded={expandedPanel === panel.type}
          onChange={handleChange(panel.type)}
        >
          <AccordionSummary aria-controls={`${panel}-content`} id={panel.type}>
            <Typography>{panel.type}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <AccordionMenuItems item={panel} />
          </AccordionDetails>
        </Accordion>
      ))}
    </List>
  );
};

export default MenuAccordion;
