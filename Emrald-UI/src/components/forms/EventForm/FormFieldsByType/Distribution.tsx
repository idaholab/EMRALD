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
} from '@mui/material';
import { useEffect } from 'react';
import { SelectComponent } from '../../../common';
import { useEventFormContext } from '../EventFormContext';
import { StyledTableCell, StyledTableRow } from '../../ActionForm/ActionToStateTable';
import { DistributionType, TimeVariableUnit } from '../../../../types/ItemTypes';
import { appData } from '../../../../hooks/useAppData';
import { EventDistributionParameter } from '../../../../types/Event';
import VariableChangesPiece from './VariableChangesPiece';

const Distribution = () => {
  const distConfig: Record<DistributionType, string[]> = {
    dtNormal: ['Mean', 'Standard Deviation'],
    dtExponential: ['Rate'],
    dtWeibull: ['Shape', 'Scale'],
    dtLogNormal: ['Mean', 'Standard Deviation'],
    dtUniform: [],
    dtTriangular: ['Peak'],
    dtGamma: ['Shape', 'Rate'],
    dtGompertz: ['Shape', 'Scale'],
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
    parameters,
    variableChecked,
    invalidValues,
    handleChange,
    handleBlur,
    handleRateChange,
    handleUseVariableChange,
    handleVariableChange,
    setAllRows,
    setDfltTimeRate,
    setDistType,
    setParameters,
    setParameterVariable,
  } = useEventFormContext();

  const rowsToDisplay = getRowsForDistType(distType ? distType : 'dtNormal');

  useEffect(() => {
    setAllRows((prevAllRows) => {
      const updatedAllRows = { ...prevAllRows };
      parameters &&
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
  }, [parameters, setAllRows]);

  useEffect(() => {
    const filteredParameters = parameters
      ? parameters.filter((param) => param.name && rowsToDisplay.includes(param.name))
      : [];
    setParameters(filteredParameters);
  }, [distType, JSON.stringify(parameters), JSON.stringify(rowsToDisplay), setParameters]);

  const getSuffix = (row: string) => {
    switch (distType) {
      case 'dtExponential':
        if (row === 'Rate') {
          return '(Lambda)';
        }
        return;
      case 'dtWeibull':
        if (row === 'Shape') {
          return '(k)';
        }
        if (row === 'Scale') {
          return '(Lambda)';
        }
        return;
      case 'dtGamma':
        if (row === 'Shape') {
          return '(Alpha)';
        }
        if (row === 'Rate') {
          return '(inverse scale)';
        }
        return;
      case 'dtGompertz':
        if (row === 'Shape') {
          return '(eta)';
        }
        if (row === 'Scale') {
          return '(beta)';
        }
        return;
    }
  };

  useEffect(() => {
    if (!dfltTimeRate) {
      setDfltTimeRate('trHours');
    }
  }, [dfltTimeRate]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <SelectComponent
          value={distType || 'dtNormal'}
          setValue={setDistType}
          label={'Distribution Type'}
          sx={{ mt: 0 }}
        >
          <MenuItem value="dtNormal">Normal Distribution</MenuItem>
          <MenuItem value="dtExponential">Exp. Distribution</MenuItem>
          <MenuItem value="dtWeibull">Weibull Distribution</MenuItem>
          <MenuItem value="dtLogNormal">LogNorm Distribution</MenuItem>
          <MenuItem value="dtUniform">Uniform Distribution</MenuItem>
          <MenuItem value="dtTriangular">Triangular Distribution</MenuItem>
          <MenuItem value="dtGamma">Gamma Distribution</MenuItem>
          <MenuItem value="dtGompertz">Gompertz Distribution</MenuItem>
        </SelectComponent>

        <SelectComponent
          value={dfltTimeRate || 'trHours'}
          setValue={setDfltTimeRate}
          label="Default Rate"
          sx={{ mt: 0, ml: 3 }}
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
                <StyledTableCell>
                  {row} {getSuffix(row)}
                </StyledTableCell>
                <StyledTableCell>
                  {allRows[row]?.useVariable ? (
                    <SelectComponent
                      label="Variable"
                      value={allRows[row]?.variable || ''}
                      setValue={(value) => {
                        setParameterVariable(value, row);
                        handleVariableChange(row);
                      }}
                    >
                      {appData.value.VariableList.map((variable, idx) => (
                        <MenuItem key={idx} value={variable.name ? variable.name : ''}>
                          {variable.name}
                        </MenuItem>
                      ))}
                    </SelectComponent>
                  ) : (
                    <TextField
                      value={allRows[row]?.value !== undefined ? allRows[row]?.value : ''}
                      onChange={(e) => handleChange(row, e.target.value)}
                      onBlur={(e) => handleBlur(row, e.target.value)}
                      size="small"
                      label={row}
                      type="text"
                      error={invalidValues.has(row)}
                      helperText={invalidValues.has(row) ? 'Invalid value' : ''}
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {!row.includes('Shape') && (
                    <SelectComponent
                      label="Time Rate"
                      value={allRows[row]?.timeRate || ('default' as TimeVariableUnit)}
                      setValue={(value) => handleRateChange(row, value)}
                      sx={{ mt: 0 }}
                    >
                      <MenuItem value="default">Default</MenuItem>
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
                    value={allRows[row]?.useVariable || false}
                    control={
                      <Checkbox
                        checked={allRows[row]?.useVariable || false}
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
      {variableChecked && <VariableChangesPiece />}
    </>
  );
};

export default Distribution;
