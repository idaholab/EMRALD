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
import { useWindowContext } from '../../../contexts/WindowContext';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import Box from '@mui/material/Box';
import { AccordionMenuItemType } from './types/AccordionMenuItems';
import ItemWithContextMenu from './ItemWithContextMenu';
import DiagramForm from '../../features/DiagramForm/DiagramForm';
import Typography from '@mui/material/Typography';
import TestD3Chart from '../../features/TestD3Chart';
import TreeDiagram from '../../features/TreeDiagram';
import ReactFlowTest from '../../features/ReactFlow/ReactFlowText';
export interface AccordionMenuListProps {
  item: AccordionMenuItemType;
  bothAccordionsOpen: boolean;
}

const AccordionMenuItems: React.FC<AccordionMenuListProps> = ({ item, bothAccordionsOpen }) => {
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
                    sx={{ maxHeight: !bothAccordionsOpen ? '420px' : '210px', overflow: 'auto' }}
                  >
                    {diagrams.map((diagram) => (
                      <React.Fragment key={diagram.id}>
                        {diagram.diagramType === type && (
                          <DraggableItem key={diagram.id} itemData={diagram}>
                            <ListItemButton sx={{ p: '0 0 0 3rem', width: '100%' }}>
                            {/* <ListItemText primary={diagram.name} onClick={() => addWindow(diagram.name, <ReactFlowTest diagram={diagram}/>, { x: 75, y: 25, width: 1500, height: 700 })}/> */}
                            <ItemWithContextMenu itemData={diagram} optionType={item.type}/>
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
        <List
        disablePadding
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          maxHeight: !bothAccordionsOpen ? '420px' : '210px',
          overflow: 'auto',
        }}
      >
        {item.data.length > 0 ? (
          item.data.map((option, index) => (
            <ListItemButton key={option.id || index} sx={{ p: '0 0 0 2rem' }}>
              <ItemWithContextMenu itemData={option} optionType={item.type}/>
            </ListItemButton>
          ))
        ) : (
          <Typography>N/A</Typography>
        )}
      </List>
      )}
    </>
  );
};

export default AccordionMenuItems;
