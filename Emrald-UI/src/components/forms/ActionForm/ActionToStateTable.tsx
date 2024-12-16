import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useVariableContext } from '../../../contexts/VariableContext';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { NewStateItem, useActionFormContext } from './ActionFormContext';
import { scientificToNumeric } from '../../../utils/util-functions';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTextField = styled(TextField)({
  '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
    {
      WebkitAppearance: 'none',
      margin: 0,
    },
});

const ActionToStateTable: React.FC = () => {
  const {
    newStateItems,
    mutuallyExclusive,
    errorMessage,
    errorItemIds,
    hasError,
    handleProbChange,
    handleProbBlur,
    handleProbTypeChange,
    handleRemainingChange,
    handleSelectChange,
    handleDeleteToStateItem,
  } = useActionFormContext();
  const { variableList } = useVariableContext();
  const hasRemainingItem = newStateItems.some((item) => item.remaining);
  const calculateProb = () => {
    const hasVarProb = newStateItems.some(
      (item) => item.probType === 'variable',
    );
  
    if (hasVarProb) {
      return 'Calculated at runtime';
    } else {
      // Check if all prob values are valid numbers
      const convertedProbValues = newStateItems.map((item: NewStateItem) => {
          if (typeof item.prob === 'string') {
            return scientificToNumeric(item.prob);
          } else {
            return item.prob
          }
        }
      )
      const allProbValuesAreNumbers = convertedProbValues.every(
        (item) => typeof item === 'number' && !isNaN(item)
      );
  
      if (!allProbValuesAreNumbers) {
        return 'Unable to calculate';
      }
      const sumOfProbs = convertedProbValues
        .filter((item) => item !== -1)
        .reduce((acc: number, item) => acc + (item as number), 0);
  
      let remainingProb = 1 - sumOfProbs;
      if (remainingProb > 1) { 
        return 'Invalid Probability';
      }
      const roundedProb = Math.round(remainingProb * 1e10) / 1e10;
      const formattedProb = Number.isInteger(roundedProb)
        ? roundedProb.toFixed(0)
        : roundedProb.toFixed(10).replace(/\.?0+$/, '');
      return `${formattedProb}`;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Action To State Table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell sx={{ fontWeight: 'bold', p: 2 }}>
              To State
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: 'bold' }}>
              Fixed Value or Variable
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: 'bold' }}>Probability</StyledTableCell>
            <StyledTableCell sx={{ fontWeight: 'bold' }}>
              Command
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {newStateItems.map((item) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell component="th" scope="row">
                {item.toState}
              </StyledTableCell>
              <StyledTableCell>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="prob type"
                    name="prob-type"
                    value={item.probType}
                    onChange={(e) => handleProbTypeChange(e, item)}
                  >
                    <FormControlLabel
                      value="fixed"
                      control={<Radio />}
                      label="Fixed"
                      sx={{ mr: 0, height: 25 }}
                    />
                    <FormControlLabel
                      value="variable"
                      control={<Radio />}
                      disabled={item.remaining}
                      label="Variable"
                      sx={{ mr: 0, height: 25 }}
                    />
                  </RadioGroup>
                </FormControl>
              </StyledTableCell>
              <StyledTableCell>
                {item.probType === 'fixed' ? (
                  <>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {mutuallyExclusive &&
                      ((hasRemainingItem && item.remaining) ||
                        !hasRemainingItem) ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.prob === -1}
                              disabled={hasRemainingItem && !item.remaining}
                              onChange={(e) => handleRemainingChange(e, item)}
                            />
                          }
                          label="Remaining"
                        />
                      ) : (
                        <></>
                      )}
                      {item.remaining ? (
                        <Typography sx={{ ml: 2 }}>
                          {calculateProb()}
                        </Typography>
                      ) : (
                        <StyledTextField
                        value={item.prob}
                        type="text" // Change type to text
                        disabled={item.prob === -1}
                        id="prob value"
                        size="small"
                        onChange={(e) => handleProbChange(e, item)}
                        onBlur={() => handleProbBlur(item)}
                        inputProps={{
                          style: {
                            WebkitTextFillColor: item.prob === -1 ? 'transparent' : 'black',
                          },
                        }}
                        error={hasError && errorItemIds.has(item.id)}
                        helperText={errorItemIds.has(item.id) && errorMessage ? errorMessage : ''}
                        />
                      )}
                    </Box>
                  </>
                ) : (
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <Select
                      value={item.varProb || ''}
                      onChange={(e) => handleSelectChange(e, item)}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={''}>
                        <em>Not Assigned</em>
                      </MenuItem>
                      {variableList.value.map((variable) => (
                        <MenuItem value={variable.name} key={variable.id}>
                          <em>{variable.name}</em>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </StyledTableCell>
              <StyledTableCell>
                <DeleteIcon
                  sx={{ cursor: 'pointer', ml: 3 }}
                  onClick={() => handleDeleteToStateItem(item.id)}
                />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActionToStateTable;
