import { useState } from 'react';
import Typography from '@mui/material/Typography';
import AccordionMenuItems from './AccordionMenuItems';
import { AccordionMenuItemType } from './types/AccordionMenuItems';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from './StyledComponents/StyledComponents';
import List from '@mui/material/List';
import { Menu, MenuItem } from '@mui/material';
import { EMRALD_Model } from '../../../types/EMRALD_Model';
import { useWindowContext } from '../../../contexts/WindowContext';
import ImportForm from '../../forms/ImportForm/ImportForm';

interface MenuAccordionProps {
  panels: AccordionMenuItemType[];
  group: string;
  setAccordionGroupOpen: (value: boolean) => void;
  bothAccordionsOpen: boolean;
}

const MenuAccordion: React.FC<MenuAccordionProps> = ({
  panels,
  setAccordionGroupOpen,
  bothAccordionsOpen,
}) => {
  const { addWindow } = useWindowContext();
  const [expandedPanel, setExpandedPanel] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notValidModel, setNotValidModel] = useState<boolean>(false);
  const [pastedModel, setPastedModel] = useState<EMRALD_Model>({} as EMRALD_Model);

  const isEmraldModel = (model: any): model is EMRALD_Model => {
    if (typeof model !== 'string') {
      return false;
    }
    try {
      //TODO: Add check here using Steve's validateModel to make sure its a valid emrald model.
      const parsedModel = JSON.parse(model);
      if (parsedModel.hasOwnProperty('emraldVersion')) {
        setPastedModel(parsedModel);
      }
      return parsedModel.hasOwnProperty('emraldVersion');
    } catch (error) {
      return false;
    }
  };

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanel(isExpanded ? panel : '');
      setAccordionGroupOpen(isExpanded);
    };

    const handleAccordionContextMenu = async (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      panel: string
    ) => {
      if (panel !== 'Diagrams') { return; } //TODO: Add the ability to paste on other panels when ready
      event.preventDefault();
      setAnchorEl(event.currentTarget);
      const pastedData = await navigator.clipboard.readText();
      isEmraldModel(pastedData) ? setNotValidModel(false) : setNotValidModel(true);
    };

    const handleMenuItemClick = async (
    ) => {
        try {
          if (pastedModel) {
            addWindow('Import Diagram', <ImportForm importedData={pastedModel} />, {
              x: 75,
              y: 25,
              width: 1300,
              height: 750,
            });
          }
        } catch (readError) {
          console.error('Error reading from clipboard:', readError);
          alert('Failed to read from clipboard. Please try again.');
        }
      
      handleClose();
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

  return (
    <>
      <List>
        {panels.map((panel: AccordionMenuItemType) => (
          <Accordion
            key={panel.type}
            expanded={expandedPanel === panel.type}
            onChange={handleChange(panel.type)}
          >
            <AccordionSummary
              aria-controls={`${panel}-content`}
              id={panel.type}
              onContextMenu={(e) => handleAccordionContextMenu(e, panel.type)}
            >
              <Typography>{panel.type}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <AccordionMenuItems
                item={panel}
                bothAccordionsOpen={bothAccordionsOpen}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </List>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem
            onClick={() => handleMenuItemClick()}
            disabled={notValidModel}
          >
            Paste
          </MenuItem>
      </Menu>
    </>
  );
};

export default MenuAccordion;
