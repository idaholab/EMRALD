import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

export const DiagramAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

export const DiagramAccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
    <ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: '#000' }} />    }
    {...props}
  />
))(() => ({
  height: 25,
  minHeight: 25,
  fontSize: 10,
  padding: '0 10px',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: 0,
  },
}));

export const DiagramAccordionDetails = styled(MuiAccordionDetails)({
  paddingLeft: 0,
  borderTop: '1px solid rgba(0, 0, 0, .125)',
});