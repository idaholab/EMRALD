import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import { Diagram } from '../../../types/Diagram';
import { Option, useOptionsMapping } from './OptionMapping';
import { LogicNode } from '../../../types/LogicNode';
import { Action } from '../../../types/Action';
import { Event } from '../../../types/Event';
import { State } from '../../../types/State';
import { Variable } from '../../../types/Variable';

interface ItemWithContextMenuProps {
  itemData: Diagram | LogicNode | Action | Event | State | Variable;
  optionType: string;
}

const ItemWithContextMenu: React.FC<ItemWithContextMenuProps> = ({
  itemData,
  optionType,
}) => {
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const optionsMapping = useOptionsMapping();
  const options = optionsMapping[optionType];

  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setContextMenuOpen(true); // Set the context menu to open
  };

  const handleClose = () => {
    setAnchorEl(null);
    setContextMenuOpen(false); // Set the context menu to closed
  };

  const handleRegularClick = (itemData: Diagram | LogicNode | Action | Event | State | Variable) => {
    if (!isContextMenuOpen) {
      // Double click functionality here
      options[0].action(itemData);
    }
  };

  const handleMenuItemClick = (
    option: Option,
    itemData: Diagram | LogicNode | Action | Event | State | Variable,
  ) => {
    // Implement functionality based on the selected option
    option.action(itemData);
    handleClose();
  };

  return (
    <Box
      onContextMenu={handleContextMenu}
      onDoubleClick={() => handleRegularClick(itemData)}
      sx={{ width: '100%' }}
    >
      <Box>{itemData.name}</Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {options && options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleMenuItemClick(option, itemData)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ItemWithContextMenu;
