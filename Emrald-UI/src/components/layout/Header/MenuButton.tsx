import React, { useState, useEffect, useRef } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { SystemStyleObject } from '@mui/system/styleFunctionSx';
import { startCase } from 'lodash';
import { type downloadOptions, projectOptions, templateSubMenuOptions } from './menuOptions';
import { useAssembledData } from '../../../hooks/useAssembledData';
import { useTemplateContext } from '../../../contexts/TemplateContext';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogComponent from '../../common/DialogComponent/DialogComponent';
import Typography from '@mui/material/Typography';
import { useWindowContext } from '../../../contexts/WindowContext';
import { useModelDetailsContext } from '../../../contexts/ModelDetailsContext';

interface MenuButtonProps {
  id: number;
  title: string;
  options?: typeof projectOptions | typeof downloadOptions,
  handleClick?: () => void;
  sx?: SystemStyleObject;
}

const MenuButton: React.FC<MenuButtonProps> = ({ id, title, options, handleClick, sx }) => {
  const { newProject, mergeNewData, populateNewData } = useAssembledData();
  const { templatesList, mergeTemplateToList, clearTemplateList } = useTemplateContext();
  const { updateFileName } = useModelDetailsContext();;
  const { addWindow } = useWindowContext();
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
    projectOptions.New(newProject);
    setShowNewProjectDialog(false);
  };

  const handleMenuItemClick = async (option: string) => {
    switch (option) {
      case 'New':
        setShowNewProjectDialog(true);
        break;
      case 'Open':
        projectOptions.Open(populateNewData, updateFileName);
        break;
      case 'Merge':
        projectOptions.Merge(mergeNewData);
        break;
      case 'Save':
        await projectOptions.Save();
        break;
      case 'Load Results':
        projectOptions['Load Results'](addWindow);
        break;
      // Add cases for other menu items as needed
      default:
        // The default case is currently used for the download menu, which doesn't take any arguments for any of it's functions
        if (handleClick) {
          handleClick(); // Call the onClick function without arguments by default
        }
    }
    // handleMouseLeave();
  };

  const handleSubMenuItemClick = (option: string) => {
    let content; // Declare the variable outside the if statement
    switch (option) {
      case 'Import Templates':
        templateSubMenuOptions['Import Templates'](mergeTemplateToList);
        break;
      case 'Export Templates':
        content = templateSubMenuOptions['Export Templates'](templatesList.value);
        if (content !== undefined || templatesList.value.length === 0) {
          setShowAlert(true);
          setAlertMessage('No templates to export');
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
        break;
      case 'Clear Templates':
        templateSubMenuOptions['Clear Templates'](clearTemplateList);
        break;
      default:
    }
    handleMouseLeave();
  };

  useEffect(() => {
    const handleClickOutside: EventListener = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      if (subMenuRef.current && !(subMenuRef.current.title === (event.target as any).title)) {
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
        aria-controls={`menu-${id.toString()}`} // Use the id prop
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
      <Menu
          id={`menu-${id.toString()}`} // Use the id prop
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleMouseLeave}
          slotProps={ { list: { onMouseLeave: handleMouseLeave } } }
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
          {options && Object.keys(options).map((option) => option).map((option, index) => (
            <MenuItem
              key={index}
              onClick={() => { void handleMenuItemClick(option); }}
              onMouseEnter={(e) => { handleSubMenuMouseEnter(e, option); }}
              onMouseLeave={handleSubMenuMouseLeave}
            >
              {option}
              {option === 'Templates' && (
                <Menu
                  id={`menu-submenu`}
                  anchorEl={subAnchorEl}
                  keepMounted
                  open={subMenuOpen}
                  slotProps={ { list: { onMouseLeave: handleSubMenuMouseLeave } } }
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
                  {Object.keys(templateSubMenuOptions).map((option, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        handleSubMenuItemClick(option as keyof typeof templateSubMenuOptions);
                        closeMenus();
                      }}
                    >
                      {startCase(option)}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </MenuItem>
          ))}
        </Menu>
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
          onSubmit={() => { createNewProject(); }}
          onClose={() => { setShowNewProjectDialog(false); }}
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
