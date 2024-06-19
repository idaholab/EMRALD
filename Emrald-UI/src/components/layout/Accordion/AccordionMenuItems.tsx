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
import { AccordionMenuItemType } from './types/AccordionMenuItems';
import ItemWithContextMenu from './ItemWithContextMenu';
// import DiagramForm from '../../features/DiagramForm/DiagramForm';
import Typography from '@mui/material/Typography';
import { MainItemTypes } from '../../../types/ItemTypes';
import { Diagram } from '../../../types/Diagram';
import { LogicNode } from '../../../types/LogicNode';
import { ExtSim } from '../../../types/ExtSim';
import { Action } from '../../../types/Action';
import { State } from '../../../types/State';
import { Variable } from '../../../types/Variable';
import { Event } from '../../../types/Event';

export interface AccordionMenuListProps {
  item: AccordionMenuItemType;
  bothAccordionsOpen: boolean;
  onDiagramChange: (diagram: Diagram) => void;
  handleDelete?: (itemToDelete: Diagram | LogicNode | ExtSim | Action | Event | State | Variable, itemToDeleteType: MainItemTypes) => void;
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
          aria-labelledby="nested-list-subheader"
        >
          <Box>
            {diagramLabels.length > 0 ? (
              diagramLabels.map((name, index) => (
                <React.Fragment key={name}>
                  <ListItemButton onClick={() => handleClick(index)} sx={{ py: '3px' }}>
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      {openIndex === index ? <FolderOpenIcon /> : <FolderIcon />}
                    </ListItemIcon>
                    <ListItemText primary={name} />
                    {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse
                    in={openIndex === index}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List
                      component="div"
                      disablePadding
                      sx={{
                        maxHeight: !bothAccordionsOpen ? '420px' : '210px',
                        overflow: 'auto',
                      }}
                    >
                      {diagrams.map((diagram) => (
                        <React.Fragment key={diagram.id}>
                          {diagram.diagramLabel === name && (
                            <DraggableItem
                              key={diagram.id}
                              itemData={diagram}
                              itemType={MainItemTypes.Diagram}
                            >
                              <ListItemButton
                                sx={{ p: '0 0 0 3rem', width: '100%' }}
                              >
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
              <Typography>N/A</Typography>
            )}
          </Box>
        </List>
      ) : (
        <List
          disablePadding
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            maxHeight: !bothAccordionsOpen ? '420px' : '210px',
            overflow: 'auto',
          }}
        >
          {item.type === 'Logic Tree' && item.data.length > 0 ? (
            item.data.map((option, index) => (
              <React.Fragment key={option.id || index}>
                {option.isRoot ? ( // Only show logic tree items that are root
                  <ListItemButton
                    key={option.id || index}
                    sx={{ p: '0 0 0 2rem' }}
                  >
                    <DraggableItem
                      key={option.id}
                      itemData={option}
                      itemType={MainItemTypes.LogicNode}
                    >
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
              {item.data.length > 0 ? (
                item.data.map((option, index) => (
                  <ListItemButton
                    key={option.id || index}
                    sx={{ p: '0 0 0 2rem' }}
                  >
                    <DraggableItem
                      key={option.id}
                      itemData={option}
                      itemType={MainItemTypes.Diagram}
                    >
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
                <Typography>N/A</Typography>
              )}
            </>
          )}
        </List>
      )}
    </>
  );
};

export default AccordionMenuItems;
