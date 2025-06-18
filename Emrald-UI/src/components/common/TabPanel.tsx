import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index.toString()}`}
      aria-labelledby={`simple-tab-${index.toString()}`}
      sx={{ flex: 1 }}
      {...other}
    >
      {value === index && <Box sx={{ py: 3, width: '100%' }}>{children}</Box>}
    </Box>
  );
};

export default TabPanel;
