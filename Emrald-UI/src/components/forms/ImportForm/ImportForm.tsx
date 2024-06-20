import React, { useEffect, useState } from 'react';
import { EMRALD_Model } from '../../../types/EMRALD_Model';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Icon,
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
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { useExtSimContext } from '../../../contexts/ExtSimContext';
import { useEventContext } from '../../../contexts/EventContext';
import { useStateContext } from '../../../contexts/StateContext';
import { useActionContext } from '../../../contexts/ActionContext';
import { useVariableContext } from '../../../contexts/VariableContext';
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
import { useTemplateContext } from '../../../contexts/TemplateContext';

interface ImportDiagramFormProps {
  importedData: EMRALD_Model;
  fromTemplate?: boolean;
}

interface ImportedItem {
  type: MainItemTypes;
  displayType: string;
  locked: boolean;
  oldName: string;
  action: string;
  newName: string;
  conflict: boolean;
  emraldItem: Action | Diagram | LogicNode | ExtSim | Event | State | Variable;
}

const ImportForm: React.FC<ImportDiagramFormProps> = ({ importedData, fromTemplate }) => {
  const [findValue, setFindValue] = useState<string>('');
  const [replaceValue, setReplaceValue] = useState<string>('');
  const [importedItems, setImportedItems] = useState<ImportedItem[]>([]);
  const [hasConflicts, setHasConflicts] = useState<boolean>(true);
  const { diagramList } = useDiagramContext();
  const { logicNodeList } = useLogicNodeContext();
  const { extSimList } = useExtSimContext();
  const { eventsList } = useEventContext();
  const { statesList} = useStateContext();
  const { actionsList } = useActionContext();
  const { variableList } = useVariableContext();
  const { handleClose } = useWindowContext();
  const { addTemplateToModel } = useTemplateContext();
  const { refreshWithNewData } = useAssembledData();

  const convertModelToArray = (model: EMRALD_Model): ImportedItem[] => {
    const items: ImportedItem[] = [];

    for (const diagram of model.DiagramList) {
      items.push({
        type: MainItemTypes.Diagram,
        displayType: 'Diagram',
        locked: false,
        oldName: diagram.name,
        newName: diagram.name,
        action: 'rename',
        conflict: diagramList.value.some(item => item.name === diagram.name),
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
        conflict: logicNodeList.value.some(item => item.name === logicNode.name),
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
        conflict: extSimList.value.some(item => item.name === extSim.name),
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
        conflict: actionsList.value.some(item => item.name === action.name),
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
        conflict: eventsList.value.some(item => item.name === event.name),
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
        conflict: statesList.value.some(item => item.name === state.name),
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
        conflict: variableList.value.some(item => item.name === variable.name),
        emraldItem: variable,
      });
    }

    return items;
  };

  useEffect(() => {
    setImportedItems(convertModelToArray(importedData));
  }, [importedData]);

  useEffect(() => {
    const hasConflicts = importedItems.some((item) => item.conflict);
    setHasConflicts(hasConflicts);
  }, [importedItems]);

  const checkForConflicts = (newName: string, type: MainItemTypes) => {
    switch(type) {
      case MainItemTypes.Diagram:
        return diagramList.value.some(item => item.name === newName);
      case MainItemTypes.LogicNode:
        return logicNodeList.value.some(item => item.name === newName);
      case MainItemTypes.ExtSim:
        return extSimList.value.some(item => item.name === newName);
      case MainItemTypes.Action:
        return actionsList.value.some(item => item.name === newName);
      case MainItemTypes.Event:
        return eventsList.value.some(item => item.name === newName);
      case MainItemTypes.State:
        return statesList.value.some(item => item.name === newName);
      case MainItemTypes.Variable:
        return variableList.value.some(item => item.name === newName);
      default:
        return false;
    }
  };

  const handleNewNameChange = (index: number, newName: string) => {
    const updatedItems = [...importedItems];
    updatedItems[index].newName = newName;
    const hasConflict = checkForConflicts(newName, updatedItems[index].type);
    updatedItems[index].conflict = hasConflict;
    setImportedItems(updatedItems);
  };

  const handleLockChange = (index: number, locked: boolean) => {
    const updatedItems = [...importedItems];
    updatedItems[index].locked = locked;
    setImportedItems(updatedItems);
  };

  const lockAll = () => {
    const updatedItems = importedItems.map((item) => {
      return { ...item, locked: true };
    });
    setImportedItems(updatedItems);
  };

  const unlockAll = () => {
    const updatedItems = importedItems.map((item) => {
      return { ...item, locked: false };
    });
    setImportedItems(updatedItems);
  };

  const updateAllUnlocked = (action: string) => {
    const updatedItems = importedItems.map((item) => {
      if (!item.locked) {
        if (item.type === MainItemTypes.State && importedData.DiagramList.length > 0) {
          return { ...item, action: 'rename' };
        }
        return { 
          ...item,
          action: action,
          conflict: action !== 'rename' ? false : checkForConflicts(item.newName, item.type),
        };
      }
      return item;
    });
    setImportedItems(updatedItems);
  };

  const handleActionChange = (index: number, action: string) => {
    const updatedItems = [...importedItems];
    updatedItems[index].action = action;
    if (action !== 'rename') {
      if (updatedItems[index].type === MainItemTypes.State && importedData.DiagramList.length > 0) {
        updatedItems[index].action = 'rename';
      }
      updatedItems[index].conflict = false;
    } else {
      updatedItems[index].conflict = checkForConflicts(updatedItems[index].newName.replace(findValue, replaceValue), updatedItems[index].type);
    }
    setImportedItems(updatedItems);
  };

  const handleApply = () => {
    const updatedItems = importedItems.map((item) => {
      if (item.newName.includes(findValue) && !item.locked) {
        return {
          ...item,
          newName: item.newName.replace(findValue, replaceValue),
          conflict: checkForConflicts(item.newName.replace(findValue, replaceValue), item.type),
        };
      }
      return item;
    });

    setImportedItems(updatedItems);
  };

  const handleSave = async () => {
    // Go through all of the renamed items and update the pasted model
    let updatedModel: EMRALD_Model = { ...appData.value };
  
    // Rename loop
    for (let i = 0; i < importedItems.length; i++) {
      const item = importedItems[i];
      if (item.action === 'rename') {
        const itemCopy = structuredClone(item.emraldItem);
        itemCopy.name = item.newName;
        await updateSpecifiedModel(itemCopy, item.type, importedData, false);
        const updatedItems = convertModelToArray(importedData);
        item.emraldItem = updatedItems[i].emraldItem;
        item.emraldItem.id = uuidv4();
      }
    }
  
    // Update loop
    for (let i = 0; i < importedItems.length; i++) {
      const item = importedItems[i];
      if (item.action === 'replace') {
        let currentEmraldItem = GetItemByNameType(item.oldName, item.type);
        item.emraldItem.id = currentEmraldItem?.id;
        updatedModel = await updateModelAndReferences(item.emraldItem, item.type);
        updateAppData(updatedModel);
        return;
      } else {
        updatedModel = await updateModelAndReferences(item.emraldItem, item.type);
        updateAppData(updatedModel);
      }
    }

    // If from template, add it to the model
    if (fromTemplate) {
      addTemplateToModel(importedData);
    }
  
    // Make it so the lists are refreshed with the new data
    refreshWithNewData(updatedModel);
    handleClose();
  };

  return (
    <Box mx={3}>
      <Box display={'flex'} alignItems={'center'}>
        <TextFieldComponent
          label="Find"
          value={findValue}
          setValue={setFindValue}
          sx={{ mr: 4 }}
        />
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
          <Button
            color="secondary"
            variant="contained"
            onClick={() => updateAllUnlocked('ignore')}
          >
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
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateAllUnlocked('rename')}
          >
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
              <TableCell align="left">
                <b>Conflict</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {importedItems.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
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
                      onChange={(e) =>
                        handleActionChange(index, e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="ignore"
                        control={<Radio disabled={row.locked || (row.type === 'State' && importedData.DiagramList.length > 0)} />}
                        label="Ignore"
                      />
                      <FormControlLabel
                        value="replace"
                        control={<Radio disabled={row.locked || (row.type === 'State' && importedData.DiagramList.length > 0)} />}
                        label="Replace"
                      />
                      <FormControlLabel
                        value="rename"
                        control={<Radio disabled={row.locked} />}
                        label="New Name"
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
                <TableCell align="left">
                  <Typography fontSize={14} color={row.conflict ? '#d32c38' : '#1b8f55'}>
                    {row.conflict ? 'CONFLICTS' : 'NO CONFLICT'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box mt={3} textAlign={'right'}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} disabled={hasConflicts}>
          Save Changes
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleClose()}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ImportForm;
