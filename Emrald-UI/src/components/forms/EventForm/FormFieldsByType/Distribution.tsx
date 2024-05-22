import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { SelectComponent } from '../../../common';
import { useEventFormContext } from '../EventFormContext';
import { StyledTableCell, StyledTableRow } from '../../ActionForm/ActionToStateTable';
import { DistributionType } from '../../../../types/ItemTypes';
import { appData } from '../../../../hooks/useAppData';
import { EventDistributionParameter } from '../../../../types/Event';

const Distribution = () => {
  const distConfig: Record<DistributionType, string[]> = {
    dtNormal: ['Mu or Mean', 'Standard Deviation'],
    dtExponential: ['Rate (Lambda)'],
    dtWeibull: ['Shape (k)', 'Scale (Lambda)'],
    dtLogNormal: ['Mean', 'Standard Deviation'],
    dtUniform: [],
    dtTriangular: ['Peak'],
    dtGamma: ['Shape (Alpha)', 'Rate (inverse scale)'],
    dtGompertz: ['Shape (eta)', 'Scale (beta)'],
    dtBeta: [],
  };
  const getRowsForDistType = (type: DistributionType) => {
    const commonRows = ['Minimum', 'Maximum'];
    return distConfig[type] ? [...distConfig[type], ...commonRows] : commonRows;
  };

  const {
    allRows,
    dfltTimeRate,
    distType,
    onVarChange,
    parameters,
    variableChecked,
    handleChange,
    handleRateChange,
    handleUseVariableChange,
    setAllRows,
    setDfltTimeRate,
    setDistType,
    setOnVarChange,
    setParameters,
    setVariable,
  } = useEventFormContext();

  const rowsToDisplay = getRowsForDistType(distType);

  useEffect(() => {
    setAllRows((prevAllRows) => {
      const updatedAllRows = { ...prevAllRows };
      parameters.forEach((param: EventDistributionParameter) => {
        if (param.name) {
          updatedAllRows[param.name] = {
            ...prevAllRows[param.name],
            value: param.value,
            timeRate: param.timeRate,
            useVariable: param.useVariable,
            variable: param.variable,
          };
        }
      });
      return updatedAllRows;
    });
  }, [parameters]);

  useEffect(() => {
    const filteredParameters = parameters.filter(
      (param) => param.name && rowsToDisplay.includes(param.name),
    );
    setParameters(filteredParameters);
  }, [distType, parameters, rowsToDisplay]);

  const NoRate = ['Shape'];

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <Typography mr={3}>Distribution Type: </Typography>
        <SelectComponent value={distType} setValue={setDistType} label={'Distribution Type'} mt={0}>
          <MenuItem value="dtNormal">Normal Distribution</MenuItem>
          <MenuItem value="dtExponential">Exp. Distribution</MenuItem>
          <MenuItem value="dtWeibull">Weibull Distribution</MenuItem>
          <MenuItem value="dtLogNormal">LogNorm Distribution</MenuItem>
          <MenuItem value="dtUniform">Uniform Distribution</MenuItem>
          <MenuItem value="dtTriangular">Triangular Distribution</MenuItem>
          <MenuItem value="dtGamma">Gamma Distribution</MenuItem>
          <MenuItem value="dtGompertz">Gompertz Distribution</MenuItem>
        </SelectComponent>
        <Typography mx={3}>Default Rate: </Typography>
        <SelectComponent
          value={dfltTimeRate}
          setValue={setDfltTimeRate}
          label="Default Rate"
          mt={0}
        >
          <MenuItem value="trSeconds">Second</MenuItem>
          <MenuItem value="trMinutes">Minute</MenuItem>
          <MenuItem value="trHours">Hour</MenuItem>
          <MenuItem value="trDays">Day</MenuItem>
          <MenuItem value="trYears">Year</MenuItem>
        </SelectComponent>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {rowsToDisplay.map((row) => (
              <StyledTableRow key={row}>
                <StyledTableCell>{row}</StyledTableCell>
                <StyledTableCell>
                  {allRows[row]?.useVariable ? (
                    <SelectComponent
                      label="Variable"
                      value={allRows[row] ? allRows[row].variable : ''}
                      setValue={(value) => setVariable(value, row)}
                    >
                      {appData.value.VariableList.map((variable, idx) => (
                        <MenuItem key={idx} value={variable.name ? variable.name : ''}>
                          {variable.name}
                        </MenuItem>
                      ))}
                    </SelectComponent>
                  ) : (
                    <TextField
                      value={allRows[row] ? allRows[row].value : ''}
                      onChange={(e) => handleChange(row, e.target.value)}
                      size="small"
                      label={row}
                      type="text"
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {!NoRate.includes(row) && (
                    <SelectComponent
                      label="Time Rate"
                      value={allRows[row] ? allRows[row].timeRate : dfltTimeRate}
                      setValue={(value) => handleRateChange(row, value)}
                      mt={0}
                    >
                      <MenuItem value={dfltTimeRate}>Default</MenuItem>
                      <MenuItem value="trSeconds">Second</MenuItem>
                      <MenuItem value="trMinutes">Minute</MenuItem>
                      <MenuItem value="trHours">Hour</MenuItem>
                      <MenuItem value="trDays">Day</MenuItem>
                      <MenuItem value="trYears">Year</MenuItem>
                    </SelectComponent>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  <FormControlLabel
                    label="Use Variable"
                    value={allRows[row] ? allRows[row].useVariable : false}
                    control={
                      <Checkbox
                        checked={allRows[row] ? allRows[row].useVariable : false}
                        onChange={(e) => handleUseVariableChange(e.target.checked, row)}
                      />
                    }
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {variableChecked && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Typography sx={{ mr: 2 }}>If Variable Changes:</Typography>
          <Box sx={{ mr: 2 }}>
            <SelectComponent label="" value={onVarChange} setValue={setOnVarChange} mt={0}>
              <MenuItem value="ocIgnore">Ignore</MenuItem>
              <MenuItem value="ocResample">Resample</MenuItem>
              <MenuItem value="ocAdjust">Adjust</MenuItem>
            </SelectComponent>
          </Box>
          <Typography>
            {onVarChange === 'ocIgnore' && 'keep the sampled event time.'}
            {onVarChange === 'ocResample' && 'resample the event time.'}
            {onVarChange === 'ocAdjust' &&
              'use the new variable values to adjust the event time without resampling, if possible.'}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Distribution;
