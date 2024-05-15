import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from '@mui/material';
import {
  StyledTableCell,
  StyledTableRow,
} from '../../ActionForm/ActionToStateTable';
import { useVariableFormContext } from '../VariableFormContext';
import { AccrualVarTableType } from '../../../../types/ItemTypes';
import { ChangeEvent, useEffect, useState } from 'react';

const StateTable = () => {
  const { accrualStatesData, setAccrualStatesData } = useVariableFormContext();
  const [accrualMults, setAccrualMults] = useState<number[]>([]);
  const [multRates, setMultRates] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [accrualTables, setAccrualTables] = useState<number[][][]>([]);
  const [tableMinimized, setTableMinimized] = useState<boolean[]>([]);

  useEffect(() => {
    if (accrualStatesData && accrualStatesData.length > 0) {
      const defaultRates = accrualStatesData.map((state) => state.accrualMult);
      setAccrualMults(defaultRates);

      const defaultMultRates = accrualStatesData.map(
        (state) => state.multRate || '',
      );
      setMultRates(defaultMultRates);

      const defaultTypes = accrualStatesData.map((state) => state.type);
      setTypes(defaultTypes);

      const defaultAccrualTables = accrualStatesData.map(
        (state) => state.accrualTable || [],
      );
      setAccrualTables(defaultAccrualTables);
    }
  }, [accrualStatesData, multRates, types, accrualTables]);

  useEffect(() => {
    const newAccrualTables = [...accrualTables];
    // Check if there are more accrual states than arrays in accrualTables
    if (
      accrualStatesData &&
      accrualStatesData.length > newAccrualTables.length
    ) {
      // Add empty arrays for each new accrual state
      for (let i = newAccrualTables.length; i < accrualStatesData.length; i++) {
        newAccrualTables.push([]);
      }
      setAccrualTables(newAccrualTables);
    }
  }, [accrualStatesData, accrualTables]);

  const handleStaticAccrualMultChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const parsedValue = parseFloat(e.target.value); // Convert string to number
    if (!isNaN(parsedValue)) {
      if (accrualStatesData) accrualStatesData[index].accrualMult = parsedValue;
      const newAccrualMults = [...accrualMults];
      newAccrualMults[index] = parsedValue;
      setAccrualMults(newAccrualMults);
    }
  };
  const handleMultRateChange = (event: SelectChangeEvent, index: number) => {
    if (accrualStatesData)
      accrualStatesData[index].multRate = event.target.value;
    const newMultRates = [...multRates];
    newMultRates[index] = event.target.value;
    setMultRates(newMultRates);
  };
  const handleTypeChange = (event: SelectChangeEvent, index: number) => {
    if (accrualStatesData)
      accrualStatesData[index].type = event.target.value as AccrualVarTableType;
    const newTypes = [...types];
    newTypes[index] = event.target.value as AccrualVarTableType;
    setTypes(newTypes);
  };

  const getMultRateOptions = (index: number, min?: boolean) => {
    return (
      (multRates[index] || multRates[index] === '') && (
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: min ? 80 : 120,
            width: min ? 'min-content' : '100%',
            my: 1,
          }}
        >
          <InputLabel id="demo-simple-select-standard-label">
            {min ? 'Rate' : 'Multiplication Rate'}
          </InputLabel>
          <Select
            labelId="rate"
            id="rate"
            defaultValue={multRates[index]}
            value={multRates[index]}
            onChange={(event: SelectChangeEvent<string>) =>
              handleMultRateChange(event, index)
            }
            label={min ? 'Rate' : 'Multiplication Rate'}
          >
            <MenuItem value="trSeconds">{min ? 'Sec' : 'Second'}</MenuItem>
            <MenuItem value="trMinutes">{min ? 'Min' : 'Minute'}</MenuItem>
            <MenuItem value="trHours">{min ? 'Hr' : 'Hour'}</MenuItem>
            <MenuItem value="trDays">{min ? 'Day' : 'Day'}</MenuItem>
          </Select>
        </FormControl>
      )
    );
  };

  function handleAccrualTableChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    idx: number,
    arg2: number,
  ): void {
    const parsedValue = parseFloat(event.target.value); // Convert string to number
    if (!isNaN(parsedValue)) {
      const newAccrualTables = [...accrualTables];
      newAccrualTables[index][idx][arg2] = parsedValue;
      setAccrualTables(newAccrualTables);
      if (accrualStatesData)
        accrualStatesData[index].accrualTable[idx] =
          newAccrualTables[index][idx];
    }
  }

  const addRow = (index: number) => {
    const newTables = [...accrualTables];
    newTables[index].push([0, 0]);
    setAccrualTables(newTables);
  };
  const deleteAccrualState = (index: number) => {
    if (accrualStatesData) {
      const newAccrualStates = [...accrualStatesData];
      newAccrualStates.splice(index, 1);
      setAccrualStatesData(newAccrualStates);
    }
  };

  function deleteRow(index: number, idx: number): void {
    const newTables = [...accrualTables];
    newTables[index].splice(idx, 1);
    setAccrualTables(newTables);
  }

  function addRowBelow(index: number, idx: number): void {
    const newTables = [...accrualTables];
    const newRow = [0, 0]; // Default values for the new row

    // Calculate the index to insert the new row below the specified row
    const insertIndex = idx + 1;

    // Insert the new row into the newTables array
    newTables[index].splice(insertIndex, 0, newRow);

    // Update the state with the new tables
    setAccrualTables(newTables);
  }

  function toggleMinimize(index: number): void {
    const newTableMinimized = [...tableMinimized];
    newTableMinimized[index] = !newTableMinimized[index];
    setTableMinimized(newTableMinimized);
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="State Table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell sx={{ width: '15%' }}>Type</StyledTableCell>
            <StyledTableCell>Accrual Rate</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {accrualStatesData &&
            accrualStatesData.map((item, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>
                  <Typography variant="h6">{item.stateName}</Typography>
                  <Button
                    onClick={() => deleteAccrualState(index)}
                    variant="contained"
                    sx={{
                      minWidth: 'unset',
                      minHeight: 'unset',
                      width: 'max-content',
                      my: 2,
                    }}
                  >
                    Remove This State
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                  {types[index] && (
                    <RadioGroup
                      sx={{ margin: '8px' }}
                      aria-label="status-value"
                      name="status-value"
                      value={types[index]}
                      onChange={(event) => handleTypeChange(event, index)}
                      row
                    >
                      <FormControlLabel
                        value="ctMultiplier"
                        control={
                          <Radio checked={types[index] === 'ctMultiplier'} />
                        }
                        label="Static"
                      />
                      <FormControlLabel
                        value="ctTable"
                        control={<Radio checked={types[index] === 'ctTable'} />}
                        label="Dynamic"
                      />
                    </RadioGroup>
                  )}
                </StyledTableCell>
                {types[index] === 'ctMultiplier' ? (
                  <StyledTableCell>
                    <TextField
                      label="Accrual Multiplication Factor"
                      variant="outlined"
                      size="small"
                      multiline
                      margin="normal"
                      type="number"
                      value={accrualMults[index]}
                      onChange={(event) =>
                        handleStaticAccrualMultChange(event, index)
                      }
                    />
                    <Typography>per</Typography>
                    {getMultRateOptions(index)}
                  </StyledTableCell>
                ) : (
                  <StyledTableCell>
                    <Button onClick={() => toggleMinimize(index)}>
                      {tableMinimized[index] ? 'Expand Table' : 'Hide Table'}
                    </Button>
                    <Button onClick={() => addRow(index)}>Add Row</Button>

                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <StyledTableRow>
                            <StyledTableCell>
                              <Box
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                              >
                                <Typography sx={{ mx: 1 }}>
                                  Simulation Time
                                </Typography>{' '}
                                {getMultRateOptions(index, true)}
                              </Box>
                            </StyledTableCell>
                            <StyledTableCell>
                              <Box
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                              >
                                <Typography sx={{ mx: 1 }}>
                                  Accrual Rate
                                </Typography>{' '}
                                {getMultRateOptions(index, true)}
                              </Box>
                            </StyledTableCell>
                          </StyledTableRow>
                        </TableHead>
                        <TableBody>
                          {accrualTables[index] &&
                            !tableMinimized[index] &&
                            accrualTables[index].map(
                              (item: number[], idx: number) => (
                                <StyledTableRow key={idx}>
                                  <StyledTableCell>
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      margin="normal"
                                      type="number"
                                      value={item[0]}
                                      onChange={(event) =>
                                        handleAccrualTableChange(
                                          event,
                                          index,
                                          idx,
                                          0,
                                        )
                                      }
                                    />
                                  </StyledTableCell>
                                  <StyledTableCell
                                    sx={{
                                      display: 'flex',
                                    }}
                                  >
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      margin="normal"
                                      type="number"
                                      value={item[1]}
                                      onChange={(event) =>
                                        handleAccrualTableChange(
                                          event,
                                          index,
                                          idx,
                                          1,
                                        )
                                      }
                                    />
                                    <Button
                                      onClick={() => deleteRow(index, idx)}
                                      title="Delete Row"
                                      sx={{
                                        width: 'min-content',
                                        marginLeft: 1,
                                        padding: '1px',
                                        fontSize: '1rem',
                                        minWidth: 'unset',
                                        minHeight: 'unset',
                                      }}
                                    >
                                      X
                                    </Button>
                                    <Button
                                      onClick={() => addRowBelow(index, idx)}
                                      title="Add Row (Below)"
                                      sx={{
                                        width: 'min-content',
                                        marginLeft: 1,
                                        padding: '1px',
                                        fontSize: '1.6rem',
                                        minWidth: 'unset', // Remove minimum width
                                        minHeight: 'unset', // Remove minimum height
                                      }}
                                    >
                                      +
                                    </Button>
                                  </StyledTableCell>
                                </StyledTableRow>
                              ),
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StateTable;
