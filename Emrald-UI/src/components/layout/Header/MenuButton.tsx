import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { startCase } from 'lodash';
import { MenuOption } from './menuOptions';
import { useAssembledData } from '../../../hooks/useAssembledData';

interface MenuButtonProps {
  id: number;
  title: string;
  options?: MenuOption[];
  handleClick?: (args: any) => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  id,
  title,
  options,
  handleClick,
}) => {
  const { assembleData, newProject, mergeNewData } = useAssembledData();
  const { populateNewData } = useAssembledData();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleMenuItemClick = (option: MenuOption) => {
    switch (option.label) {
      case 'New':
        option.onClick(newProject);
        break;
      case 'Open':
        option.onClick(populateNewData);
        break;
      case 'Merge':
        option.onClick(mergeNewData);
        break;
      case 'Save':
        option.onClick(assembleData);
        break;
      // Add cases for other menu items as needed
      default:
        option.onClick(); // Call the onClick function without arguments by default
    }
    handleMouseLeave();
  };

  return (
    <Box>
      <Button
        aria-label="menu"
        aria-controls={`menu-${id}`} // Use the id prop
        aria-haspopup="true"
        onClick={options ? handleMouseEnter : handleClick}
        onMouseEnter={options && handleMouseEnter}
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
      {options && (
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
            horizontal: 'left',
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} onClick={() => handleMenuItemClick(option)}>
              {startCase(option.label)}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
};

export default MenuButton;
