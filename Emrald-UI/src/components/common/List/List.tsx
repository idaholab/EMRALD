import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

interface ListComponentProps {
  items: any[];
}

const ListComponent: React.FC<ListComponentProps> = ({ items }) => (
  <List
    disablePadding
    sx={{
      width: '100%',
      bgcolor: 'background.paper',
      maxHeight: '220px',
      overflow: 'auto',
    }}
  >
    {items.length > 0 ? (
      items.map((item, index) => (
        <ListItemButton key={item.id || index} sx={{ p: '0 0 0 2rem' }}>
          <ListItemText primary={item.name} />
        </ListItemButton>
      ))
    ) : (
      <Typography>N/A</Typography>
    )}
  </List>
);

export default ListComponent;
