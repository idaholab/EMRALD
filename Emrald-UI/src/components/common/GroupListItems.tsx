import type { Group } from '@/types/EMRALD_Model';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
  useState,
} from 'react';
import { useTemplateContext } from '@/contexts/TemplateContext';

interface GroupListItemsProps {
  selectedGroup: string;
  highlightSelectedGroup?: boolean;
  setSelectedGroup: Dispatch<SetStateAction<string>>;
  handleContextMenu?: (event: MouseEvent<HTMLDivElement>, group: Group) => void;
}

export const GroupListItems: React.FC<GroupListItemsProps> = ({
  selectedGroup,
  highlightSelectedGroup,
  setSelectedGroup,
  handleContextMenu,
}) => {
  const { groups } = useTemplateContext();
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpanded(prevExpanded =>
      prevExpanded.includes(id)
        ? prevExpanded.filter(item => item !== id)
        : [...prevExpanded, id],
    );
  };

  const renderListItems = (groups: Group[], level = 1) =>
    groups.map(item => (
      <>
        <ListItemButton
          onClick={() => {
            toggleExpand(item.name);
            setSelectedGroup(item.name);
          }}
          onContextMenu={e => {
            if (handleContextMenu) {
              handleContextMenu(e, item);
            }
          }}
          sx={{
            backgroundColor:
              highlightSelectedGroup && item.name === selectedGroup
                ? 'lightgreen'
                : 'white',
          }}
        >
          <ListItemIcon>
            {expanded.includes(item.name)
              && item.subgroup
              && item.subgroup.length > 0 ? (
                  <FolderOpenIcon />
                ) : (
                  <FolderIcon />
                )}
          </ListItemIcon>
          <ListItemText primary={item.name} />
          {item.subgroup && item.subgroup.length > 0 && (
            <>
              {expanded.includes(item.name) ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItemButton>

        {item.subgroup && item.subgroup.length > 0 && (
          <Collapse
            in={expanded.includes(item.name)}
            timeout="auto"
            unmountOnExit
          >
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
      </>
    ));

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
