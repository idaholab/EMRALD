import React, { useState, useEffect, useRef } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { startCase } from 'lodash';
import { MenuOption, templateSubMenuOptions } from './menuOptions';
import { useAssembledData } from '../../../hooks/useAssembledData';
import { useTemplateContext } from '../../../contexts/TemplateContext';
import Alert from '@mui/material/Alert';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogComponent from '../../common/DialogComponent/DialogComponent';
import Typography from '@mui/material/Typography';

interface MenuButtonProps {
  id: number;
  title: string;
  options?: MenuOption[];
  handleClick?: (args: any) => void;
  sx?: SxProps;
}

const MenuButton: React.FC<MenuButtonProps> = ({ id, title, options, handleClick, sx }) => {
  const { assembleData, newProject, mergeNewData, populateNewData } = useAssembledData();
  const { templatesList, mergeTemplateToList, clearTemplateList } = useTemplateContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subAnchorEl, setSubAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [subMenuOpen, setSubMenuOpen] = useState<boolean>(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [showNewProjectDialog, setShowNewProjectDialog] = useState<boolean>(false);
  const [currentOption, setCurrentOption] = useState<MenuOption>();

  const subMenuRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleSubMenuMouseEnter = (event: React.MouseEvent<HTMLElement>, option: string) => {
    if (option === 'Templates') {
      const templateMenuEl = event.currentTarget;
      const timeout = setTimeout(() => {
        setSubAnchorEl(templateMenuEl);
        setSubMenuOpen(true);
      }, 300);
      setHoverTimeout(timeout);
    } else {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      return;
    }
  };

  const handleSubMenuMouseLeave = () => {
    setSubAnchorEl(null);
    setSubMenuOpen(false);
  };

  const closeMenus = () => {
    setAnchorEl(null);
    setOpen(false);
    setSubAnchorEl(null);
    setSubMenuOpen(false);
  };

  const createNewProject = () => {
    currentOption?.onClick(newProject);
    setShowNewProjectDialog(false);
  };

  const handleMenuItemClick = (option: MenuOption) => {
    switch (option.label) {
      case 'New':
        setCurrentOption(option);
        setShowNewProjectDialog(true);
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
    // handleMouseLeave();
  };

  const handleSubMenuItemClick = async (option: MenuOption) => {
    let content; // Declare the variable outside the if statement
    switch (option.label) {
      case 'Import Templates':
        option.onClick(mergeTemplateToList);
        break;
      case 'Export Templates':
        content = option.onClick(templatesList.value);
        if (content !== undefined || templatesList.value.length === 0) {
          setShowAlert(true);
          setAlertMessage('No templates to export');
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
        break;
      case 'Clear Templates':
        option.onClick(clearTemplateList);
        break;
      default:
        option.onClick(); // Call the onClick function without arguments by default
    }
    handleMouseLeave();
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (subMenuRef.current && !(subMenuRef.current.title === event.target.title)) {
        closeMenus();
      }
    };

    if (subMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [subMenuOpen]);

  return (
    <Box>
      <Button
        aria-label="menu"
        aria-controls={`menu-${id}`} // Use the id prop
        aria-haspopup="true"
        onClick={options ? handleMouseEnter : handleClick}
        // onMouseEnter={options && handleMouseEnter}
        sx={{
          borderRight: '2px solid #bbb',
          borderRadius: 0,
          height: 30,
          p: 0,
          pr: isMediumScreen ? '10px' : 2,
          pl: isMediumScreen ? '10px' : 2,
          cursor: 'pointer',
          fontSize: isMediumScreen ? '0.725rem' : '0.875rem',
          ...sx,
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
          sx={{
            mt: 3,
          }}
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
            <MenuItem
              key={index}
              onClick={() => handleMenuItemClick(option)}
              onMouseEnter={(e) => handleSubMenuMouseEnter(e, option.label)}
              onMouseLeave={handleSubMenuMouseLeave}
            >
              {startCase(option.label)}
              {option.label === 'Templates' && (
                <Menu
                  id={`menu-submenu`}
                  anchorEl={subAnchorEl}
                  keepMounted
                  open={subMenuOpen}
                  MenuListProps={{ onMouseLeave: handleSubMenuMouseLeave }}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  title="Templates Menu"
                  ref={subMenuRef}
                >
                  {templateSubMenuOptions.map((option, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        handleSubMenuItemClick(option);
                        closeMenus();
                      }}
                    >
                      {startCase(option.label)}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </MenuItem>
          ))}
        </Menu>
      )}
      <Alert
        severity="error"
        variant="filled"
        sx={{
          position: 'absolute',
          top: 35,
          right: 15,
          zIndex: 9999,
          opacity: showAlert ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
        }}
      >
        {alertMessage}
      </Alert>

      {showNewProjectDialog && (
        <DialogComponent
          open={true}
          title="Create New Project?"
          submitText="Yes"
          cancelText='No'
          onSubmit={() => createNewProject()}
          onClose={() => setShowNewProjectDialog(false)}
        >
          <Typography>
            Are you sure you want to create a new project? Any unsaved changes will be lost.
          </Typography>
        </DialogComponent>
      )}
    </Box>
  );
};

export default MenuButton;
