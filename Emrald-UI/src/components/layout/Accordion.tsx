import { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import MenuItems, { MenuItemType, MenuList } from './MenuItems';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: '#FFF' }} />
    }
    {...props}
  />
))(({ theme }) => ({
  height: 35,
  minHeight: 35,
  color: theme.palette.secondary.main,
  backgroundColor: theme.palette.primary.main,
  pl: 1,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)({
  paddingLeft: 0,
  borderTop: '1px solid rgba(0, 0, 0, .125)',
});

interface MenuAccordionProps {
  panels: MenuItemType[];
}

const MenuAccordion: React.FC<MenuAccordionProps> = ({ panels }) => {
  const [expandedPanel, setExpandedPanel] = useState<string>('');

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanel(isExpanded ? panel : '');
    };

  return (
    <>
      {panels.map((panel: MenuItemType) => (
        <Accordion
          key={panel.type}
          expanded={expandedPanel === panel.type}
          onChange={handleChange(panel.type)}
        >
          <AccordionSummary aria-controls={`${panel}-content`} id={panel.type}>
            <Typography>{panel.type}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <MenuItems item={panel} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default MenuAccordion;
