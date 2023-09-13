import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import { Diagram } from '../../../types/Diagram';

interface ItemWithContextMenuProps {
  itemData: Diagram;
}

const ItemWithContextMenu: React.FC<ItemWithContextMenuProps> = ({ itemData }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setContextMenuOpen(true); // Set the context menu to open
  };

  const handleClose = () => {
    setAnchorEl(null);
    setContextMenuOpen(false); // Set the context menu to closed
  };

  const handleRegularClick = () => {
    if (!isContextMenuOpen) {
      // Handle your regular click functionality here
      console.log('Regular click');
    }
  };

  const handleMenuItemClick = (option: string) => {
    // Implement functionality based on the selected option
    console.log(`Clicked on ${option}`);
    handleClose();
  };

  return (
    <Box onContextMenu={handleContextMenu} onClick={handleRegularClick} sx={{width: '100%'}}>
      <Box>{itemData.name}</Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick('Open')}>Open</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Edit Properties')}>Edit Properties</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Delete')}>Delete</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Make Template')}>Make Template</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Export')}>Export</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Copy')}>Copy</MenuItem>
      </Menu>
    </Box>
  );
};

export default ItemWithContextMenu;
