import type {
  Action,
  Diagram,
  Event,
  ExtSim,
  LogicNode,
  MainItemType,
  State,
  Variable,
} from '../../../types/EMRALD_Model';
import type { ModelItem } from '../../../types/ModelUtils';
import { Box } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { type DragEvent as ReactDragEvent, type MouseEvent, useState } from 'react';
import { VARIABLE_DRAG_MIME } from '../../common/variableDrag';
import { type Option, useOptionsMapping } from './OptionMapping';

interface ItemWithContextMenuProps {
  itemData: Diagram | LogicNode | Action | Event | State | Variable;
  optionType: string;
  onDiagramChange: (diagram: Diagram) => void;
  handleDelete?: (itemToDelete: ModelItem, itemType: MainItemType) => void;
}

export const ItemWithContextMenu: React.FC<ItemWithContextMenuProps> = ({
  itemData,
  optionType,
  onDiagramChange,
  handleDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const optionsMapping = useOptionsMapping();
  const options = optionsMapping[optionType];

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setContextMenuOpen(true); // Set the context menu to open
  };

  const handleClose = () => {
    setAnchorEl(null);
    setContextMenuOpen(false); // Set the context menu to closed
  };

  const handleRegularClick = async (
    itemData: Diagram | LogicNode | Action | Event | State | Variable | ExtSim,
  ) => {
    if (!isContextMenuOpen) {
      // Double click functionality here
      await options?.[0]?.action(itemData);
      if (itemData.objType === 'Diagram') {
        onDiagramChange(itemData);
      }
    }
  };

  const handleMenuItemClick = async (
    option: Option,
    itemData: Diagram | LogicNode | Action | Event | State | Variable | ExtSim,
  ) => {
    // Implement functionality based on the selected option
    await (option.label === 'Delete'
      ? option.action(itemData, handleDelete)
      : option.action(itemData));
    handleClose();
  };

  const isVariable = optionType === 'Variables';

  const handleDragStart = (event: ReactDragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(VARIABLE_DRAG_MIME, itemData.name);
    event.dataTransfer.setData('text/plain', itemData.name);
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Box
      onContextMenu={handleContextMenu}
      onDoubleClick={() => {
        void handleRegularClick(itemData);
      }}
      sx={{ width: '100%', cursor: isVariable ? 'grab' : undefined }}
      draggable={isVariable}
      onDragStart={isVariable ? handleDragStart : undefined}
    >
      <Box>{itemData.name}</Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {options?.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              void handleMenuItemClick(option, itemData);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
