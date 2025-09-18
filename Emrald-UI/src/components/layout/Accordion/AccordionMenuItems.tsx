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
import DraggableItem from '../../drag-and-drop/DraggableItem';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import Box from '@mui/material/Box';
import type { AccordionMenuItemType } from './types/AccordionMenuItems';
import ItemWithContextMenu from './ItemWithContextMenu';
// import DiagramForm from '../../features/DiagramForm/DiagramForm';
import Typography from '@mui/material/Typography';
import type { Diagram, LogicNode, MainItemType } from '../../../types/EMRALD_Model';
import type { ModelItem } from '../../../types/ModelUtils';

export interface AccordionMenuListProps {
  item: AccordionMenuItemType;
  bothAccordionsOpen: boolean;
  onDiagramChange: (diagram: Diagram) => void;
  handleDelete?: (itemToDelete: ModelItem, itemType: MainItemType) => void;
}

const AccordionMenuItems: React.FC<AccordionMenuListProps> = ({
  item,
  bothAccordionsOpen,
  onDiagramChange,
  handleDelete,
}) => {
  const { diagrams } = useDiagramContext();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null); // Keeps track of the index of the open item
  const diagramLabels = Array.from(new Set(diagrams.map((diagram) => diagram.diagramLabel))).sort();

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
        >
          <Box>
            {diagramLabels.length > 0 ? (
              diagramLabels.map((name, index) => (
                <React.Fragment key={name}>
                  <ListItemButton
                    onClick={() => {
                      handleClick(index);
                    }}
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
                      sx={{
                        maxHeight:
                          bothAccordionsOpen || window.innerHeight < 765 ? '160px' : '340px',
                        overflow: 'auto',
                      }}
                    >
                      {diagrams.map((diagram) => (
                        <React.Fragment key={diagram.id}>
                          {diagram.diagramLabel === name && (
                            <DraggableItem key={diagram.id} itemData={diagram} itemType={'Diagram'}>
                              <ListItemButton sx={{ p: '0 0 0 3rem', width: '100%' }}>
                                <ItemWithContextMenu
                                  itemData={diagram}
                                  optionType={item.type}
                                  onDiagramChange={onDiagramChange}
                                  handleDelete={handleDelete}
                                />
                              </ListItemButton>
                            </DraggableItem>
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              ))
            ) : (
              <Typography sx={{ pl: 3 }}>No Diagrams</Typography>
            )}
          </Box>
        </List>
      ) : (
        <List
          disablePadding
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            maxHeight: `${window.innerHeight - (bothAccordionsOpen ? 665 : 374)}px`,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {item.type === 'Logic Tree' && item.data && item.data.length > 0 ? (
            item.data.map((option: LogicNode, index) => (
              <React.Fragment key={option.id ?? index}>
                {option.isRoot ? ( // Only show logic tree items that are root
                  <ListItemButton key={option.id ?? index} sx={{ p: '0 0 0 2rem' }}>
                    <DraggableItem key={option.id} itemData={option} itemType={'LogicNode'}>
                      <ItemWithContextMenu
                        itemData={option}
                        optionType={item.type}
                        onDiagramChange={onDiagramChange}
                        handleDelete={handleDelete}
                      />
                    </DraggableItem>
                  </ListItemButton>
                ) : (
                  <></>
                )}
              </React.Fragment>
            ))
          ) : (
            <>
              {item.data && item.data.length > 0 ? (
                item.data.map((option: Diagram, index) => (
                  <ListItemButton key={option.id ?? index} sx={{ p: '0 0 0 2rem' }}>
                    <DraggableItem key={option.id} itemData={option} itemType={'Diagram'}>
                      <ItemWithContextMenu
                        itemData={option}
                        optionType={item.type}
                        onDiagramChange={onDiagramChange}
                        handleDelete={handleDelete}
                      />
                    </DraggableItem>
                  </ListItemButton>
                ))
              ) : (
                <Typography sx={{ pl: 3, py: 1 }}>No {item.type}</Typography>
              )}
            </>
          )}
        </List>
      )}
    </>
  );
};

export default AccordionMenuItems;
