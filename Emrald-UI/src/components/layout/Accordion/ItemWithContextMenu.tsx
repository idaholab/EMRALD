import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import { Diagram , LogicNode, Action, Event, State, Variable, ExtSim } from '../../../types/EMRALD_Model';
import { Option, useOptionsMapping } from './OptionMapping';
import { ModelItem } from '../../../types/ModelUtils';

interface ItemWithContextMenuProps {
  itemData: Diagram | LogicNode | Action | Event | State | Variable;
  optionType: string;
  onDiagramChange: (diagram: Diagram) => void;
  handleDelete?: (itemToDelete: ModelItem) => void;
}

const isDiagram = (object: any): object is Diagram => {
  return 'diagramLabel' in object;
};

const ItemWithContextMenu: React.FC<ItemWithContextMenuProps> = ({
  itemData,
  optionType,
  onDiagramChange,
  handleDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const optionsMapping = useOptionsMapping();
  const options = optionsMapping[optionType];

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setContextMenuOpen(true); // Set the context menu to open
  };

  const handleClose = () => {
    setAnchorEl(null);
    setContextMenuOpen(false); // Set the context menu to closed
  };

  const handleRegularClick = (
    itemData: Diagram | LogicNode | Action | Event | State | Variable | ExtSim,
  ) => {
    if (!isContextMenuOpen) {
      // Double click functionality here
      options[0].action(itemData);
      if (isDiagram(itemData)) {
        onDiagramChange(itemData);
      }
    }
  };

  const handleMenuItemClick = (
    option: Option,
    itemData: Diagram | LogicNode | Action | Event | State | Variable | ExtSim,
  ) => {
    // Implement functionality based on the selected option
    if (option.label === 'Delete') option.action(itemData, handleDelete);
    else option.action(itemData);
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
        {options &&
          options.map((option, index) => (
            <MenuItem key={index} onClick={() => handleMenuItemClick(option, itemData)}>
              {option.label}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

export default ItemWithContextMenu;
