import { useState } from 'react';
import Typography from '@mui/material/Typography';
import AccordionMenuItems from './AccordionMenuItems';
import { AccordionMenuItemType } from './types/AccordionMenuItems';
import { Accordion, AccordionDetails, AccordionSummary } from './StyledComponents/StyledComponents';
import List from '@mui/material/List';
import { Menu, MenuItem } from '@mui/material';
import { EMRALD_Model } from '../../../types/EMRALD_Model';
import { useWindowContext } from '../../../contexts/WindowContext';
import ImportForm from '../../forms/ImportForm/ImportForm';
import { upgradeModel } from '../../../utils/Upgrades/upgrade';
import { Diagram } from '../../../types/Diagram';
import { LogicNode } from '../../../types/LogicNode';
import { ExtSim } from '../../../types/ExtSim';
import LogicNodeForm from '../../forms/LogicNodeForm/LogicNodeForm';
import ExtSimForm from '../../forms/ExtSimForm/ExtSimForm';
import ActionForm from '../../forms/ActionForm/ActionForm';
import EventForm from '../../forms/EventForm/EventForm';
import VariableForm from '../../forms/VariableForm/VariableForm';
import VariableFormContextProvider from '../../forms/VariableForm/VariableFormContext';
import EventFormContextProvider from '../../forms/EventForm/EventFormContext';
import ActionFormContextProvider from '../../forms/ActionForm/ActionFormContext';
import { MainItemTypes } from '../../../types/ItemTypes';
import DiagramForm from '../../forms/DiagramForm/DiagramForm';
import { Action } from '../../../types/Action';
import { State } from '../../../types/State';
import { Variable } from '../../../types/Variable';
import { Event } from '../../../types/Event';

interface MenuAccordionProps {
  panels: AccordionMenuItemType[];
  group: string;
  setAccordionGroupOpen: (value: boolean) => void;
  bothAccordionsOpen: boolean;
  onDiagramChange: (diagram: Diagram) => void;
  componentGroup?: string;
  handleDelete?: (itemToDelete: Diagram | LogicNode | ExtSim | Action | Event | State | Variable, itemToDeleteType: MainItemTypes) => void;
}

const MenuAccordion: React.FC<MenuAccordionProps> = ({
  panels,
  setAccordionGroupOpen,
  bothAccordionsOpen,
  onDiagramChange,
  componentGroup,
  handleDelete,
}) => {
  const { addWindow } = useWindowContext();
  const [expandedPanel, setExpandedPanel] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notValidModel, setNotValidModel] = useState<boolean>(false);
  const [pastedModel, setPastedModel] = useState<EMRALD_Model>({} as EMRALD_Model);
  const [accordionPanel, setAccordionPanel] = useState<string>('');

  const isEmraldModel = (clipboardData: any): clipboardData is EMRALD_Model => {
    if (typeof clipboardData !== 'string') {
      return false;
    }
    
    try {
      const parsedModel = JSON.parse(clipboardData);
      const upgradedModel = upgradeModel(clipboardData);
      if (parsedModel && parsedModel.hasOwnProperty('emraldVersion') || !upgradedModel) {
        setPastedModel(parsedModel);
      } else {
        setPastedModel(upgradedModel);
      }
      return parsedModel.hasOwnProperty('emraldVersion') || (upgradedModel && upgradedModel.hasOwnProperty('emraldVersion'));
    } catch (error) {
      return false;
    }
  };

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : '');
    setAccordionGroupOpen(isExpanded);
  };

  const handleAccordionContextMenu = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    panel: string,
  ) => {
    if (
      componentGroup !== 'global' &&
      panel !== 'Diagrams' &&
      panel !== 'Logic Tree' &&
      panel !== 'External Sims' && 
      panel !== 'Variables'
    )
      return;
    event.preventDefault();
    setAccordionPanel(panel);
    setAnchorEl(event.currentTarget);
    if (panel === 'Diagrams') {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
      const pastedData = await navigator.clipboard.readText();
      isEmraldModel(pastedData) ? setNotValidModel(false) : setNotValidModel(true);
    }
  };

  const handleMenuItemClick = async (e: React.MouseEvent<HTMLElement>) => {
    if (accordionPanel === 'Diagrams') {
      if (e.currentTarget.textContent === 'Paste') {
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
      } else {
        addWindow('New Diagram', <DiagramForm />);
      }
    } else if (accordionPanel === 'Logic Tree') {
      addWindow('New Logic Tree', <LogicNodeForm isRoot/>);
    } else if (accordionPanel === 'External Sims') {
      addWindow('New External Sim', <ExtSimForm />);
    } else if (accordionPanel === 'Actions') {
      addWindow(
        'New Action',
        <ActionFormContextProvider>
          <ActionForm />
        </ActionFormContextProvider>,
      );
    } else if (accordionPanel === 'Events') {
      addWindow(
        'New Event',
        <EventFormContextProvider>
          <EventForm />
        </EventFormContextProvider>,
      );
    } else if (accordionPanel === 'Variables') {
      addWindow(
        'New Variable',
        <VariableFormContextProvider>
          <VariableForm />
        </VariableFormContextProvider>,
      );
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
                onDiagramChange={onDiagramChange}
                handleDelete={handleDelete}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </List>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={(e) => handleMenuItemClick(e)}
          disabled={accordionPanel === 'Diagrams' && notValidModel}
        >
          {accordionPanel === 'Diagrams' && 'Paste'}
          {accordionPanel === 'Logic Tree' && 'New TOP Node'}
          {accordionPanel === 'External Sims' && 'New External Sim'}
          {accordionPanel === 'Actions' && 'New Action'}
          {accordionPanel === 'Events' && 'New Event'}
          {accordionPanel === 'Variables' && 'New Variable'}
        </MenuItem>
        {accordionPanel === 'Diagrams' && (
          <MenuItem
            onClick={(e) => {
              handleMenuItemClick(e);
            }}
          >
            New Diagram
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default MenuAccordion;
