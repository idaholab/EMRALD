import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { startCase } from 'lodash';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { useModelDetailsContext } from '../../../contexts/ModelDetailsContext';
import { useTemplateContext } from '../../../contexts/TemplateContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import { appData } from '../../../hooks/useAppData';
import { useAssembledData } from '../../../hooks/useAssembledData';
import { DialogComponent } from '../../common/DialogComponent/DialogComponent';
import {
  downloadOptions,
  projectOptions,
  templateSubMenuOptions,
} from './menuOptions';

type MenuOption = keyof typeof projectOptions | keyof typeof downloadOptions;

interface MenuButtonProps {
  id: number;
  title: string;
  options?: typeof projectOptions | typeof downloadOptions;
  handleClick?: () => void;
  sx?: Record<string, number>;
  openVersionDialog?: () => void;
  openNameDialog?: () => void;
  handleModelError?: (message: string) => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  id,
  title,
  options,
  handleClick,
  sx,
  openVersionDialog,
  openNameDialog,
  handleModelError,
}) => {
  const { newProject, mergeNewData, populateNewData, compareData }
    = useAssembledData();
  const { templatesList, mergeTemplateToList, clearTemplateList }
    = useTemplateContext();
  const { setFileName } = useModelDetailsContext();
  const { addWindow } = useWindowContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subAnchorEl, setSubAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const subMenuRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleSubMenuMouseEnter = (
    event: MouseEvent<HTMLElement>,
    option: MenuOption,
  ) => {
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

  const handleMenuItemClick = async (option: MenuOption) => {
    switch (option) {
      case 'New': {
        setShowNewProjectDialog(true);
        break;
      }
      case 'Open': {
        projectOptions.Open(populateNewData, setFileName, handleModelError);
        break;
      }
      case 'Merge': {
        projectOptions.Merge(mergeNewData, handleModelError);
        break;
      }
      case 'Save': {
        await projectOptions.Save();
        break;
      }
      case 'Load Results': {
        projectOptions['Load Results'](addWindow, handleModelError);
        break;
      }
      // Add cases for other menu items as needed
      case 'Templates':
      case 'Clear Cached Data': {
        projectOptions[option]();
        break;
      }
      case 'Compare': {
        projectOptions.Compare(compareData, handleModelError);
        break;
      }
      default: {
        // The default case currently handles all download menu options which don't take any arguments
        if (options) {
          downloadOptions[option]();
        }
      }
    }
    // handleMouseLeave();
  };

  const handleSubMenuItemClick = (option: string) => {
    let content; // Declare the variable outside the if statement
    switch (option) {
      case 'Import Templates': {
        templateSubMenuOptions['Import Templates'](
          mergeTemplateToList,
          handleModelError,
        );
        break;
      }
      case 'Export Templates': {
        content = templateSubMenuOptions['Export Templates'](
          templatesList.value,
        );
        if (content !== undefined || templatesList.value.length === 0) {
          setShowAlert(true);
          setAlertMessage('No templates to export');
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
        break;
      }
      case 'Clear Templates': {
        templateSubMenuOptions['Clear Templates'](clearTemplateList);
        break;
      }
      default:
    }
    handleMouseLeave();
  };

  useEffect(() => {
    const handleClickOutside: EventListener = event => {
      if (
        subMenuRef.current
        && !(
          subMenuRef.current.title === (event.target as HTMLDivElement).title
        )
      ) {
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
        slotProps={{ list: { onMouseLeave: handleMouseLeave } }}
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
        {options
          && Object.keys(options)
            .map(option => option as MenuOption)
            .map((option, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  // TODO: The "new" option doesn't reset the name / version number
                  let interrupted = false;
                  if (option === 'Save') {
                    if (appData.value.name === undefined && openNameDialog) {
                      openNameDialog();
                      interrupted = true;
                    } else if (appData.value.version > 1 && openVersionDialog) {
                      openVersionDialog();
                      interrupted = true;
                    }
                  }
                  if (!interrupted) {
                    void handleMenuItemClick(option);
                  }
                }}
                onMouseEnter={e => {
                  handleSubMenuMouseEnter(e, option);
                }}
                onMouseLeave={handleSubMenuMouseLeave}
              >
                {option}
                {option === 'Templates' && (
                  <Menu
                    id="menu-submenu"
                    anchorEl={subAnchorEl}
                    keepMounted
                    open={subMenuOpen}
                    slotProps={{
                      list: { onMouseLeave: handleSubMenuMouseLeave },
                    }}
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
                    {Object.keys(templateSubMenuOptions).map(
                      (option, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => {
                            handleSubMenuItemClick(
                              option as keyof typeof templateSubMenuOptions,
                            );
                            closeMenus();
                          }}
                        >
                          {startCase(option)}
                        </MenuItem>
                      ),
                    )}
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
          cancelText="No"
          onSubmit={() => {
            createNewProject();
          }}
          onClose={() => {
            setShowNewProjectDialog(false);
          }}
        >
          <Typography>
            Are you sure you want to create a new project? Any unsaved changes
            will be lost.
          </Typography>
        </DialogComponent>
      )}
    </Box>
  );
};
