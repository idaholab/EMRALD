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
import DraggableItem from '../drag-and-drop/DraggableItem';
import { useWindowContext } from '../../contexts/WindowContext';
import { useDiagramContext } from '../../contexts/DiagramContext';
import Box from '@mui/material/Box';
import ListComponent from '../common/List/List';

export interface MenuItemType {
  type: string;
  data: any[];
}

export interface MenuList {
  panels: MenuItemType[];
}

interface MenuListProps {
  item: MenuItemType;
}

const MenuItems: React.FC<MenuListProps> = ({ item }) => {
  const { addWindow } = useWindowContext();
  const { diagrams } = useDiagramContext();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null); // Keeps track of the index of the open item
  const diagramTypes = [
    { name: 'Plant', type: 'dtPlant' },
    { name: 'Component', type: 'dtComponent' },
    { name: 'System', type: 'dtSystem' },
  ];

  const handleClick = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      {item.type === 'Diagrams' ? (
        <List
          key={item.type}
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <Box>
            {diagramTypes.map(({ type, name }, index) => (
              <React.Fragment key={type}>
                <ListItemButton
                  onClick={() => handleClick(index)}
                  sx={{ py: '3px' }}
                >
                  <ListItemIcon sx={{ minWidth: '30px' }}>
                    {openIndex === index ? <FolderOpenIcon /> : <FolderIcon />}
                  </ListItemIcon>
                  <ListItemText primary={name} />
                  {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                  <List
                    component="div"
                    disablePadding
                    sx={{ maxHeight: '220px', overflow: 'auto' }}
                  >
                    {diagrams.map((diagram) => (
                      <React.Fragment key={diagram.id}>
                        {diagram.diagramType === type && (
                          <DraggableItem key={diagram.id} itemData={diagram}>
                            <ListItemButton sx={{ p: '0 0 0 3rem' }}>
                              <ListItemText
                                primary={diagram.name}
                                onClick={() =>
                                  addWindow(
                                    diagram.name,
                                    <>Diagram Viewer Component</>,
                                  )
                                }
                              />
                            </ListItemButton>
                          </DraggableItem>
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </Box>
        </List>
      ) : (
        <ListComponent items={item.data}></ListComponent>
      )}
    </>
  );
};

export default MenuItems;
