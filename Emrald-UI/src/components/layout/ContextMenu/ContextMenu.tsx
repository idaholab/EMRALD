import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

export interface Option {
  label: string;
  action: () => void; // Pass context values as parameters
  isDivider?: boolean; // Whether to render a divider after this option
  disabled?: boolean;
}

interface ContextMenuProps {
  mouseX: number;
  mouseY: number;
  handleClose: () => void;
  options: Option[] | undefined;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  mouseX,
  mouseY,
  handleClose,
  options
}) => {
  // Open the menu if both mouseX and mouseY are not null
  const open = mouseX !== null && mouseY !== null;

  return (
    <Menu 
      open={open}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        open ? { top: mouseY, left: mouseX } : undefined
      }
    >
      {options && options.map((option, index) => (
          <MenuItem
            key={index}
            divider={option.isDivider}
            disabled={option.disabled}
            onClick={() => {
              option.action();
              handleClose();
            }}
          >
            {option.label}
          </MenuItem>
      ))}
    </Menu>
  );
};

export default ContextMenu;
