import React, { useEffect, useState } from 'react';
import { EMRALD_Model } from '../../../types/EMRALD_Model';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { TextFieldComponent } from '../../common';
import { FaLock } from 'react-icons/fa6';
import { FaLockOpen } from 'react-icons/fa6';

import { MainItemTypes } from '../../../types/ItemTypes';
import { State } from '../../../types/State';
import { Event } from '../../../types/Event';
import { Action } from '../../../types/Action';
import { Diagram } from '../../../types/Diagram';
import { LogicNode } from '../../../types/LogicNode';
import { Variable } from '../../../types/Variable';
import { ExtSim } from '../../../types/ExtSim';
import { updateModelAndReferences, updateSpecifiedModel } from '../../../utils/UpdateModel';
import { appData, updateAppData } from '../../../hooks/useAppData';
import { GetItemByNameType } from '../../../utils/ModelReferences';
import { v4 as uuidv4 } from 'uuid';
import { useWindowContext } from '../../../contexts/WindowContext';
import { useAssembledData } from '../../../hooks/useAssembledData';

import { StarBorder } from '@mui/icons-material';

import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface TemplateDiagramFormProps {
  templatedData: EMRALD_Model;
}

interface TemplatedItem {
  type: MainItemTypes;
  displayType: string;
  locked: boolean;
  oldName: string;
  action: string;
  newName: string;
  exclude: boolean;
  requiredInImportingModel: boolean;
  emraldItem: Action | Diagram | LogicNode | ExtSim | Event | State | Variable;
}

type Group = {
  id: string;
  name: string;
  children?: Group[];
};

type GroupsState = Group[];

const TemplateForm: React.FC<TemplateDiagramFormProps> = ({ templatedData }) => {
  const [findValue, setFindValue] = useState<string>('');
  const [replaceValue, setReplaceValue] = useState<string>('');
  const [templatedItems, setTemplatedItems] = useState<TemplatedItem[]>([]);
  const [templateName, setTemplateName] = useState<string>('');
  const [templateDesc, setTemplateDesc] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [groups, setGroups] = useState<GroupsState>( [
    {
      id: uuidv4(),
      name: "Group 1",
      children: [
        {
          id: uuidv4(),
          name: "Subgroup 1.1",
          children: [
            { id: uuidv4(), name: "Item 1.1.1", children: [
              { id: uuidv4(), name: "Item 1.1.1.1", children: [
                { id: uuidv4(), name: "Item 1.1.1.1.1", children: [
                  { id: uuidv4(), name: "Item 1.1.1.1.1.1" },
                ]},
              ]},
            ] },
            { id: uuidv4(), name: "Item 1.1.2" },
          ],
        }
      ],
    },
    {
      id: uuidv4(),
      name: "Group 2",
      children: [
        {
          id: uuidv4(),
          name: "Subgroup 2.1",
          children: [
            { id: uuidv4(), name: "Item 2.1.1" },
            { id: uuidv4(), name: "Item 2.1.2" },
          ],
        }
      ],
    },
  ]);
  const { handleClose } = useWindowContext();
  const { refreshWithNewData } = useAssembledData();

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const [expanded, setExpanded] = useState(["Group 1"]);

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
  

  // const addGroup = (name: string): void => {
  //   setGroups((prevGroups) => [...prevGroups, { name }]);
  // };

  // const addSubgroup = (parentGroupIndex: number, name: string): void => {
  //   setGroups((prevGroups) => {
  //     const updatedGroups = [...prevGroups];
  //     const parentGroup = updatedGroups[parentGroupIndex];
  //     if (parentGroup) {
  //       parentGroup.subGroups = parentGroup.subGroups || [];
  //       parentGroup.subGroups.push({ name });
  //     }
  //     return updatedGroups;
  //   });
  // };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const handleClickGroup = (groupName: string) => {
    setOpenGroups((prevOpenGroups) => ({
      ...prevOpenGroups,
      [groupName]: !prevOpenGroups[groupName],
    }));
  };

  const convertModelToArray = (model: EMRALD_Model): TemplatedItem[] => {
    const items: TemplatedItem[] = [];

    for (const diagram of model.DiagramList) {
      items.push({
        type: MainItemTypes.Diagram,
        displayType: 'Diagram',
        locked: false,
        oldName: diagram.name,
        newName: diagram.name,
        action: 'rename',
        exclude: false,
        requiredInImportingModel: false,
        emraldItem: diagram,
      });
    }

    for (const logicNode of model.LogicNodeList) {
      items.push({
        type: MainItemTypes.LogicNode,
        displayType: 'Logic Node',
        locked: false,
        oldName: logicNode.name,
        newName: logicNode.name,
        action: 'rename',
        exclude: false,
        requiredInImportingModel: false,
        emraldItem: logicNode,
      });
    }

    for (const extSim of model.ExtSimList) {
      items.push({
        type: MainItemTypes.ExtSim,
        displayType: 'External Sim',
        locked: false,
        oldName: extSim.name,
        newName: extSim.name,
        action: 'rename',
        exclude: false,
        requiredInImportingModel: false,
        emraldItem: extSim,
      });
    }

    for (const action of model.ActionList) {
      items.push({
        type: MainItemTypes.Action,
        displayType: 'Action',
        locked: false,
        oldName: action.name,
        newName: action.name,
        action: 'rename',
        exclude: false,
        requiredInImportingModel: false,
        emraldItem: action,
      });
    }

    for (const event of model.EventList) {
      items.push({
        type: MainItemTypes.Event,
        displayType: 'Event',
        locked: false,
        oldName: event.name,
        newName: event.name,
        action: 'rename',
        exclude: false,
        requiredInImportingModel: false,
        emraldItem: event,
      });
    }

    for (const state of model.StateList) {
      items.push({
        type: MainItemTypes.State,
        displayType: 'State',
        locked: false,
        oldName: state.name,
        newName: state.name,
        action: 'rename',
        exclude: false,
        requiredInImportingModel: false,
        emraldItem: state,
      });
    }

    for (const variable of model.VariableList) {
      items.push({
        type: MainItemTypes.Variable,
        displayType: 'Variable',
        locked: false,
        oldName: variable.name,
        newName: variable.name,
        action: 'rename',
        exclude: false,
        requiredInImportingModel: false,
        emraldItem: variable,
      });
    }

    return items;
  };

  useEffect(() => {
    setTemplatedItems(convertModelToArray(templatedData));
  }, [templatedData]);

  const handleNewNameChange = (index: number, newName: string) => {
    const updatedItems = [...templatedItems];
    updatedItems[index].newName = newName;
    // const hasConflict = checkForConflicts(newName, updatedItems[index].type);
    // updatedItems[index].conflict = hasConflict;
    setTemplatedItems(updatedItems);
  };

  const handleLockChange = (index: number, locked: boolean) => {
    const updatedItems = [...templatedItems];
    updatedItems[index].locked = locked;
    setTemplatedItems(updatedItems);
  };

  const lockAll = () => {
    const updatedItems = templatedItems.map((item) => {
      return { ...item, locked: true };
    });
    setTemplatedItems(updatedItems);
  };

  const unlockAll = () => {
    const updatedItems = templatedItems.map((item) => {
      return { ...item, locked: false };
    });
    setTemplatedItems(updatedItems);
  };

  const updateAllUnlocked = (action: string) => {
    const updatedItems = templatedItems.map((item) => {
      if (!item.locked) {
        if (item.type === MainItemTypes.State && templatedData.DiagramList.length > 0) {
          return { ...item, action: 'rename' };
        }
        return {
          ...item,
          action: action,
          // conflict: action !== 'rename' ? false : checkForConflicts(item.newName, item.type),
        };
      }
      return item;
    });
    setTemplatedItems(updatedItems);
  };

  const handleActionChange = (index: number, action: string) => {
    const updatedItems = [...templatedItems];
    updatedItems[index].action = action;
    if (action !== 'rename') {
      if (
        updatedItems[index].type === MainItemTypes.State &&
        templatedData.DiagramList.length > 0
      ) {
        updatedItems[index].action = 'rename';
      }
      // updatedItems[index].conflict = false;
    } else {
      // updatedItems[index].conflict = checkForConflicts(updatedItems[index].newName.replace(findValue, replaceValue), updatedItems[index].type);
    }
    setTemplatedItems(updatedItems);
  };

  const handleApply = () => {
    const updatedItems = templatedItems.map((item) => {
      if (item.newName.includes(findValue)) {
        return {
          ...item,
          newName: item.newName.replace(findValue, replaceValue),
          // conflict: checkForConflicts(item.newName.replace(findValue, replaceValue), item.type),
        };
      }
      return item;
    });

    setTemplatedItems(updatedItems);
  };

  const handleSave = async () => {
    // Go through all of the renamed items and update the pasted model
    let updatedModel: EMRALD_Model = { ...appData.value };
    for (let i = 0; i < templatedItems.length; i++) {
      const item = templatedItems[i];
      if (item.action === 'rename') {
        item.emraldItem.name = item.newName;
        updateSpecifiedModel(item.emraldItem, item.type, templatedData, false);
        item.emraldItem.id = uuidv4();
        updatedModel = await updateModelAndReferences(item.emraldItem, item.type);
        updateAppData(updatedModel);
      }

      if (item.action === 'replace') {
        let currentEmraldItem = GetItemByNameType(item.oldName, item.type);
        item.emraldItem.id = currentEmraldItem?.id;
        updatedModel = await updateModelAndReferences(item.emraldItem, item.type);
        updateAppData(updatedModel);
      }
    }

    // Make it so the lists are refreshed with the new data
    refreshWithNewData(updatedModel);
    handleClose();
  };

const renderListItems = (data: Group[], level: number = 1) => {
  return data.map((item) => (
    <React.Fragment key={item.id}>
      <ListItemButton onClick={() => {toggleExpand(item.name); setSelectedGroup(item.name)}} sx={{ backgroundColor: item.name === selectedGroup ? 'lightgreen' : 'white'}}>
        <ListItemIcon>
          {expanded.includes(item.name) && item.children && item.children.length > 0 ? <FolderOpenIcon /> : <FolderIcon />}
        </ListItemIcon>
        <ListItemText primary={item.name} />
        {
          item.children && item.children.length > 0 && (
            <>{expanded.includes(item.name) ? <ExpandLess /> : <ExpandMore />}</>
          )
        }
      </ListItemButton>

      {item.children && item.children.length > 0 && (
        <Collapse
          in={expanded.includes(item.name)}
          timeout="auto"
          unmountOnExit
        >
          <List
            component="div"
            disablePadding
            sx={{
              pl: 3
            }}
          >
            {renderListItems(item.children, level + 1)}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  ));
};

  return (
    <Box mx={3}>
      <Box mt={2}>
        <Typography variant="h5" fontWeight={'bold'}>
          Create a Template
        </Typography>

        <TextFieldComponent label="Name" value={templateName} setValue={setTemplateName} />
        <TextFieldComponent label="Description" value={templateDesc} setValue={setTemplateDesc} />
        <Typography variant="subtitle1" mt={2}>
          Assign this template to group: <span style={{ fontWeight: 'bold' }}>{selectedGroup}</span>
        </Typography>
        <Box>
          <List
            sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {renderListItems(groups)}
          </List>
        </Box>
      </Box>
      <Box display={'flex'} alignItems={'center'}>
        <TextFieldComponent label="Find" value={findValue} setValue={setFindValue} sx={{ mr: 4 }} />
        <TextFieldComponent
          label="Replace With"
          value={replaceValue}
          setValue={setReplaceValue}
          sx={{ mr: 4 }}
        />
        <Box mt={2}>
          <Button variant="contained" onClick={handleApply}>
            Apply
          </Button>
        </Box>
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        <Box mt={2} mr={3}>
          <Button startIcon={<FaLock />} variant="contained" onClick={lockAll}>
            Lock All
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            startIcon={<FaLockOpen />}
            variant="contained"
            color="secondary"
            onClick={unlockAll}
          >
            Unlock All
          </Button>
        </Box>
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        <Box mt={2} mr={2}>
          <Button color="secondary" variant="contained" onClick={() => updateAllUnlocked('ignore')}>
            Ignore Unlocked
          </Button>
        </Box>
        <Box mt={2} mr={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateAllUnlocked('replace')}
          >
            Replace Unlocked
          </Button>
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="secondary" onClick={() => updateAllUnlocked('rename')}>
            Rename Unlocked
          </Button>
        </Box>
      </Box>

      <Box mt={3} maxHeight={'400px'} overflow={'auto'}>
        <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Type</b>
              </TableCell>
              <TableCell align="center">
                <b>Lock</b>
              </TableCell>
              <TableCell align="left">
                <b>Old Name</b>
              </TableCell>
              <TableCell align="center" sx={{ width: '30%' }}>
                <b>Action</b>
              </TableCell>
              <TableCell align="left" sx={{ width: '30%' }}>
                <b>New Name</b>
              </TableCell>
              {/* <TableCell align="left">
                <b>Conflict</b>
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {templatedItems.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.type}
                </TableCell>
                <TableCell align="center">
                  {row.locked ? (
                    <Icon
                      style={{ color: '#1b8f55' }}
                      onClick={() => handleLockChange(index, false)}
                    >
                      <FaLock />
                    </Icon>
                  ) : (
                    <Icon
                      style={{ color: '#d32c38' }}
                      onClick={() => handleLockChange(index, true)}
                    >
                      <FaLockOpen />
                    </Icon>
                  )}
                </TableCell>
                <TableCell align="left">{row.oldName}</TableCell>
                <TableCell align="center">
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={row.action}
                      onChange={(e) => handleActionChange(index, e.target.value)}
                    >
                      <FormControlLabel
                        value="keep"
                        control={
                          <Radio
                            disabled={
                              row.locked ||
                              (row.type === 'State' && templatedData.DiagramList.length > 0)
                            }
                          />
                        }
                        label="Keep Name"
                      />
                      <FormControlLabel
                        value="rename"
                        control={<Radio disabled={row.locked} />}
                        label="Rename"
                      />
                    </RadioGroup>
                  </FormControl>
                </TableCell>
                <TableCell align="left">
                  <TextField
                    value={row.action === 'rename' ? row.newName : ''}
                    disabled={row.locked || row.action !== 'rename'}
                    onChange={(e) => handleNewNameChange(index, e.target.value)}
                    size="small"
                  />
                </TableCell>
                {/* <TableCell align="left">
                  <Typography fontSize={14} color={row.conflict ? '#d32c38' : '#1b8f55'}>
                    {row.conflict ? 'CONFLICTS' : 'NO CONFLICT'}
                  </Typography>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box mt={3} textAlign={'right'}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave}>
          Save Changes
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleClose()}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default TemplateForm;
