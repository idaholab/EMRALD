import type { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';

interface TabPanelProps {
  index: number;
  value: number;
}

export const TabPanel: React.FC<PropsWithChildren<TabPanelProps>> = ({
  children,
  value,
  index,
  ...other
}) => (
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
