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

interface ImportDiagramFormProps {
  importedData: EMRALD_Model;
}

interface ConflictItem {
  type: string;
  locked: boolean;
  oldName: string;
  action: string;
  newName: string;
  conflict: boolean;
}

const ImportForm: React.FC<ImportDiagramFormProps> = ({ importedData }) => {
  const [findValue, setFindValue] = useState<string>('');
  const [replaceValue, setReplaceValue] = useState<string>('');
  const [conflictItems, setConflictItems] = useState<ConflictItem[]>([]);
  const { diagramList } = useDiagramContext();
  const { logicNodeList } = useLogicNodeContext();
  const { extSimList } = useExtSimContext();
  const { eventsList } = useEventContext();
  const { statesList } = useStateContext();
  const { actionsList } = useActionContext();
  const { variableList } = useVariableContext();

  const convertModelToArray = (model: EMRALD_Model): ConflictItem[] => {
    const items: ConflictItem[] = [];

    for (const diagram of model.DiagramList) {
      items.push({
        type: 'Diagram',
        locked: false,
        oldName: diagram.name,
        newName: diagram.name,
        action: 'rename',
        conflict: diagramList.value.some(item => item.name === diagram.name),
      });
    }

    for (const logicNode of model.LogicNodeList) {
      items.push({
        type: 'Logic Node',
        locked: false,
        oldName: logicNode.name,
        newName: logicNode.name,
        action: 'rename',
        conflict: logicNodeList.value.some(item => item.name === logicNode.name),
      });
    }

    for (const extSim of model.ExtSimList) {
      items.push({
        type: 'External Sim',
        locked: false,
        oldName: extSim.name,
        newName: extSim.name,
        action: 'rename',
        conflict: extSimList.value.some(item => item.name === extSim.name),
      });
    }

    for (const action of model.ActionList) {
      items.push({
        type: 'Action',
        locked: false,
        oldName: action.name,
        newName: action.name,
        action: 'rename',
        conflict: actionsList.value.some(item => item.name === action.name),
      });
    }

    for (const event of model.EventList) {
      items.push({
        type: 'Event',
        locked: false,
        oldName: event.name,
        newName: event.name,
        action: 'rename',
        conflict: eventsList.value.some(item => item.name === event.name),
      });
    }

    for (const state of model.StateList) {
      items.push({
        type: 'State',
        locked: false,
        oldName: state.name,
        newName: state.name,
        action: 'rename',
        conflict: statesList.value.some(item => item.name === state.name),
      });
    }

    for (const variable of model.VariableList) {
      items.push({
        type: 'Variable',
        locked: false,
        oldName: variable.name,
        newName: variable.name,
        action: 'rename',
        conflict: variableList.value.some(item => item.name === variable.name),
      });
    }

    return items;
  };

  useEffect(() => {
    setConflictItems(convertModelToArray(importedData));
  }, [importedData]);

  const checkForConflicts = (newName: string, type: string) => {
    switch(type) {
      case 'Diagram':
        return diagramList.value.some(item => item.name === newName);
      case 'Logic Node':
        return logicNodeList.value.some(item => item.name === newName);
      case 'External Sim':
        return extSimList.value.some(item => item.name === newName);
      case 'Action':
        return actionsList.value.some(item => item.name === newName);
      case 'Event':
        return eventsList.value.some(item => item.name === newName);
      case 'State':
        return statesList.value.some(item => item.name === newName);
      case 'Variable':
        return variableList.value.some(item => item.name === newName);
      default:
        return false;
    }
  };

  const handleNewNameChange = (index: number, newName: string) => {
    const updatedItems = [...conflictItems];
    updatedItems[index].newName = newName;
    const hasConflict = checkForConflicts(newName, updatedItems[index].type);
    updatedItems[index].conflict = hasConflict;
    setConflictItems(updatedItems);
  };

  const handleLockChange = (index: number, locked: boolean) => {
    const updatedItems = [...conflictItems];
    updatedItems[index].locked = locked;
    setConflictItems(updatedItems);
  };

  const lockAll = () => {
    const updatedItems = conflictItems.map((item) => {
      return { ...item, locked: true };
    });
    setConflictItems(updatedItems);
  };

  const unlockAll = () => {
    const updatedItems = conflictItems.map((item) => {
      return { ...item, locked: false };
    });
    setConflictItems(updatedItems);
  };

  const updateAllUnlocked = (action: string) => {
    const updatedItems = conflictItems.map((item) => {
      if (!item.locked) {
        return { ...item, action: action };
      }
      return item;
    });
    setConflictItems(updatedItems);
  };

  const handleActionChange = (index: number, action: string) => {
    const updatedItems = [...conflictItems];
    updatedItems[index].action = action;
    setConflictItems(updatedItems);
  };

  const handleApply = () => {
    const updatedItems = conflictItems.map((item) => {
      if (item.newName.includes(findValue)) {
        return {
          ...item,
          newName: item.newName.replace(findValue, replaceValue),
        };
      }
      return item;
    });

    setConflictItems(updatedItems);
  };

  const handleSave = () => {
    // Update importedData based on conflictItems
    const updatedData = { ...importedData };
    for (let i = 0; i < conflictItems.length; i++) {
      const item = conflictItems[i];
      // Update corresponding item in importedData
      if (item.type === 'Diagram') {
        let diagram = updatedData.DiagramList.find(
          (d) => d.name === item.oldName,
        );
        if (diagram) {
          diagram.name = item.newName;
        }
      } else if (item.type === 'Logic Node') {
        let logicNode = updatedData.LogicNodeList.find(
          (ln) => ln.name === item.oldName,
        );
        if (logicNode) {
          logicNode.name = item.newName;
        }
      } else if (item.type === 'External Sim') {
        let extSim = updatedData.ExtSimList.find(
          (es) => es.name === item.oldName,
        );
        if (extSim) {
          extSim.name = item.newName;
        }
      } else if (item.type === 'Action') {
        let action = updatedData.ActionList.find(
          (a) => a.name === item.oldName,
        );
        if (action) {
          action.name = item.newName;
        }
      } else if (item.type === 'Event') {
        let event = updatedData.EventList.find((e) => e.name === item.oldName);
        if (event) {
          event.name = item.newName;
        }
      } else if (item.type === 'State') {
        let state = updatedData.StateList.find((s) => s.name === item.oldName);
        if (state) {
          state.name = item.newName;
        }
      } else if (item.type === 'Variable') {
        let variable = updatedData.VariableList.find(
          (v) => v.name === item.oldName,
        );
        if (variable) {
          variable.name = item.newName;
        }
      }
      // Add similar conditions for other types in EMRALD_Model
    }
    // Call the callback function to pass the updated data to the parent component
    console.log(updatedData);
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
                <b>Name</b>
              </TableCell>
              <TableCell align="left">
                <b>Conflict</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {conflictItems.map((row, index) => (
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
                        control={<Radio disabled={row.locked} />}
                        label="Ignore"
                      />
                      <FormControlLabel
                        value="replace"
                        control={<Radio disabled={row.locked} />}
                        label="Replace"
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
                    value={row.newName}
                    disabled={row.locked}
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
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave}>
          Save Changes
        </Button>
        <Button variant="contained" color="secondary">
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ImportForm;
