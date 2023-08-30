import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { startCase } from 'lodash';

interface MenuButtonProps {
  id: number;
  title: string;
  optionCallbacks?: Record<string, () => void>;
  handleClick?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  id,
  title,
  optionCallbacks,
  handleClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    console.log('enter');
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    console.log('leave');
    setAnchorEl(null);
    setOpen(false);
  };

  const handleMenuItemClick = (option: string) => {
    if (optionCallbacks && optionCallbacks[option]) {
      optionCallbacks[option]();
    }
    handleMouseLeave();
  };

  const menuOptions = Object.keys(optionCallbacks ? optionCallbacks : {});

  return (
    <Box>
      <Button
        aria-label="menu"
        aria-controls={`menu-${id}`} // Use the id prop
        aria-haspopup="true"
        onClick={optionCallbacks ? handleMouseEnter : handleClick}
        onMouseEnter={optionCallbacks && handleMouseEnter}
        sx={{
          borderRight: '2px solid #bbb',
          borderRadius: 0,
          p: 0,
          pr: 2,
          ml: 2,
          cursor: 'pointer',
        }}
      >
        {title}
      </Button>
      {menuOptions && (
        <Menu
          id={`menu-${id}`} // Use the id prop
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleMouseLeave}
          MenuListProps={{ onMouseLeave: handleMouseLeave }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: "left",
          }}
        >
          {menuOptions.map((option, index) => (
            <MenuItem key={index} onClick={() => handleMenuItemClick(option)}>
              {startCase(option)}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
};

export default MenuButton;
