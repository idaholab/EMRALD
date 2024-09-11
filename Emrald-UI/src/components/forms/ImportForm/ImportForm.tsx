import React from 'react';
import { EMRALD_Model } from '../../../types/EMRALD_Model';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Icon,
  IconButton,
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
import { useImportForm } from './useImportForm';

interface ImportDiagramFormProps {
  importedData: EMRALD_Model;
  fromTemplate?: boolean;
}

const ImportForm: React.FC<ImportDiagramFormProps> = ({ importedData, fromTemplate }) => {
  const {
    findValue,
    replaceValue,
    importedItems,
    hasConflicts,
    loading,
    getConflictStatus,
    setFindValue,
    setReplaceValue,
    lockAll,
    unlockAll,
    updateAllUnlocked,
    handleLockChange,
    handleActionChange,
    handleNewNameChange,
    handleApply,
    handleSave,
    handleClose
  } = useImportForm(importedData, fromTemplate);

  return (
    <Box mx={3} pb={3}>
      <Backdrop
        sx={{ color: '#008080', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute', top: '35px' }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
              <TableCell align="left">
                <b>Conflict</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {importedItems.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.type}
                </TableCell>
                <TableCell align="center">
                  {row.locked ? (
                    <IconButton
                      sx={{ color: '#1b8f55' }}
                      disabled={row.required}
                      onClick={() => handleLockChange(index, false)}
                    >
                      <FaLock />
                    </IconButton>
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
                        value="ignore"
                        control={
                          <Radio
                            disabled={
                              row.locked ||
                              row.required ||
                              (row.type === 'State' && importedData.DiagramList.length > 0)
                            }
                          />
                        }
                        label="Ignore"
                      />
                      <FormControlLabel
                        value="replace"
                        control={
                          <Radio
                            disabled={
                              row.locked ||
                              row.required ||
                              (row.type === 'State' && importedData.DiagramList.length > 0)
                            }
                          />
                        }
                        label="Replace"
                      />
                      <FormControlLabel
                        value="rename"
                        control={<Radio disabled={row.locked || row.required} />}
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
                  <Typography
                    fontSize={14}
                    color={getConflictStatus(row) === 'NO CONFLICT' ? '#1b8f55' : '#d32c38'}
                  >
                    {getConflictStatus(row)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box mt={3} textAlign={'right'}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} disabled={hasConflicts || loading}>
          Create
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleClose()}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ImportForm;
