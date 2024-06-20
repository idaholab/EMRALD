import React from 'react';
import { useTemplateContext } from '../../contexts/TemplateContext';
import { ListItemButton, ListItemIcon, ListItemText, Collapse, List } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Group } from '../../types/ItemTypes';

interface GroupListItemsProps {

  selectedGroup: string;
  highlightSelectedGroup?: boolean;
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
  handleContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, group: Group) => void;
}

const GroupListItems: React.FC<GroupListItemsProps> = ({ selectedGroup, highlightSelectedGroup, setSelectedGroup, handleContextMenu }) => {
  const { groups } = useTemplateContext();
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpanded((prevExpanded) => {
      const isExpanded = prevExpanded.includes(id);
      if (isExpanded) {
        return prevExpanded.filter((item) => item !== id);
      } else {
        return [...prevExpanded, id];
      }
    });
  };

  const renderListItems = (groups: Group[], level: number = 1) => {
    return groups.map((item) => (
      <React.Fragment key={item.name}>
        <ListItemButton
          onClick={() => {
            toggleExpand(item.name);
            setSelectedGroup(item.name);
          }}
          onContextMenu={(e) => handleContextMenu ? handleContextMenu(e, item) : null}
          sx={{ backgroundColor: highlightSelectedGroup && item.name === selectedGroup ? 'lightgreen' : 'white' }}
        >
          <ListItemIcon>
            {expanded.includes(item.name) && item.subgroup && item.subgroup.length > 0 ? (
              <FolderOpenIcon />
            ) : (
              <FolderIcon />
            )}
          </ListItemIcon>
          <ListItemText primary={item.name} />
          {item.subgroup && item.subgroup.length > 0 && (
            <>{expanded.includes(item.name) ? <ExpandLess /> : <ExpandMore />}</>
          )}
        </ListItemButton>

        {item.subgroup && item.subgroup.length > 0 && (
          <Collapse in={expanded.includes(item.name)} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{
                pl: 3,
              }}
            >
              {renderListItems(item.subgroup, level + 1)}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list"
    >
      {renderListItems(groups)}
    </List>
  );
};

export default GroupListItems;
