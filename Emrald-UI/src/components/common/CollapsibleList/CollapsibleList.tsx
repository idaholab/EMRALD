import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

interface CollapsibleListProps {
  groups: { name: string }[];
}

const CollapsibleList: React.FC<React.PropsWithChildren<CollapsibleListProps>> = ({
  groups,
  children,
}) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <List>
      {groups.map((group, index) => (
        <React.Fragment key={group.name}>
          <ListItemButton
            onClick={() => {
              handleClick(index);
            }}
          >
            <ListItemIcon>{openIndex === index ? <FolderOpenIcon /> : <FolderIcon />}</ListItemIcon>
            <ListItemText primary={group.name} />
            {openIndex === index ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
            {children}
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};

export default CollapsibleList;
