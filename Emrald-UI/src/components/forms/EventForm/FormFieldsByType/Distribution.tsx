import type { EventFormProps } from '../EventForm';
import type {
  DistributionType,
  EventDistributionParameter,
  EventDistributionParameterName,
  TimeVariableUnit,
  VarChangeOptions,
} from '@/types/EMRALD_Model';
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
import { useEffect, useState } from 'react';
import { SelectComponent } from '@/components/common';
import {
  StyledTableCell,
  StyledTableRow,
} from '@/components/forms/ActionForm/ActionToStateTable';
import { appData } from '@/hooks/useAppData';
import { useEventFormContext } from '../EventFormContext';
import { VariableChangesPiece } from './VariableChangesPiece';

type RowType = Record<string, EventDistributionParameter | undefined>;

export const Distribution: React.FC<EventFormProps> = ({ eventData }) => {
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

  const getRowsForDistType = (type: DistributionType) => [
    ...distConfig[type],
    'Minimum',
    'Maximum',
  ];

  const { invalidValues, setInvalidValues, setTypeProperties, sync }
    = useEventFormContext();

  const [allRows, setAllRows] = useState<RowType>({});
  const [dfltTimeRate, setDfltTimeRate] = useState<TimeVariableUnit>();
  const [parameters, setParameters] = useState<EventDistributionParameter[]>();
  const [distType, setDistType] = useState<DistributionType>();
  const [onVarChange, setOnVarChange] = useState<VarChangeOptions>();
  const [persistent, setPersistent] = useState<boolean | undefined>();

  useEffect(() => {
    setDfltTimeRate(eventData?.dfltTimeRate);
    setParameters(eventData?.parameters);
    const rows: RowType = {};
    for (const param of eventData?.parameters ?? []) {
      if (param.name) {
        const p: EventDistributionParameter = {
          value: param.value,
          useVariable: param.useVariable,
        };
        if (param.timeRate !== undefined) {
          p.timeRate = param.timeRate;
        }
        if (param.variable !== undefined) {
          p.variable = param.variable;
        }
        rows[param.name] = p;
      }
    }
    setAllRows(rows);
    setDistType(eventData?.distType ?? 'dtNormal');
    setPersistent(eventData?.persistent);
    setTypeProperties([
      'dfltTimeRate',
      'parameters',
      'distType',
      'persistent',
      'onVarChange',
    ]);
  }, []);

  useEffect(() => {
    sync({ distType, persistent, onVarChange });
  }, [distType, persistent, onVarChange]);

  const variableChecked = Object.values(allRows)
    .map(row => row?.useVariable)
    .some(Boolean);

  const rowsToDisplay = getRowsForDistType(distType ?? 'dtNormal');

  const handleDistTypeChange = (newDistType: DistributionType) => {
    setDistType(newDistType);
    setInvalidValues(() => {
      const newInvalidValues = new Set<string>();
      for (const row of getRowsForDistType(newDistType)) {
        if (typeof allRows[row]?.value !== 'number') {
          newInvalidValues.add(row);
        }
      }
      return newInvalidValues;
    });
  };

  useEffect(() => {
    setAllRows(prevAllRows => {
      const updatedAllRows = { ...prevAllRows };
      for (const param of parameters ?? []) {
        if (param.name !== undefined) {
          updatedAllRows[param.name] = {
            ...prevAllRows[param.name],
            value: param.value,
            timeRate: param.timeRate,
            useVariable: param.useVariable,
            variable: param.variable,
          };
        }
      }
      return updatedAllRows;
    });
  }, [parameters, setAllRows]);

  useEffect(() => {
    setParameters(
      parameters?.filter(
        param => param.name && rowsToDisplay.includes(param.name),
      ),
    );
    sync({ parameters });
  }, [
    distType,
    JSON.stringify(parameters),
    JSON.stringify(rowsToDisplay),
    setParameters,
  ]);

  const getSuffix = (row: string) => {
    const suffixes: { [k in DistributionType]?: Record<string, string> } = {
      dtExponential: {
        Rate: '(Lambda)',
      },
      dtWeibull: {
        Shape: '(k)',
        Scale: '(Lambda)',
      },
      dtGamma: {
        Shape: '(Alpha)',
        Rate: '(inverse scale)',
      },
      dtGompertz: {
        Shape: '(eta)',
        Scale: '(beta)',
      },
    };
    return distType ? suffixes[distType]?.[row] : undefined;
  };

  useEffect(() => {
    if (!dfltTimeRate) {
      setDfltTimeRate('trHours');
    }
    sync({ dfltTimeRate });
  }, [dfltTimeRate]);

  const handleSetParameters = (
    row: string,
    value: string | number | boolean | undefined,
    varName: string,
  ) => {
    const newParameters = parameters ? [...parameters] : [];
    let index = newParameters.findIndex(param => param.name === row);
    if (index === -1) {
      newParameters.push({
        name: row as EventDistributionParameterName,
        value: varName === 'value' ? (value as string | number) : '',
        timeRate:
          varName === 'timeRate'
            ? value === 'default'
              ? undefined
              : (value as TimeVariableUnit)
            : undefined,
        useVariable: varName === 'useVariable' ? (value as boolean) : false,
        variable: varName === 'variable' ? (value as string) : undefined,
      });
      index = newParameters.length - 1;
    }

    newParameters[index] = {
      ...newParameters[index],
      [varName]:
        varName === 'timeRate' && value === 'default' ? undefined : value,
    };
    setParameters(newParameters);
  };

  const updateRow = (
    row: string,
    value: string | number | boolean | undefined,
    varName: 'value' | 'timeRate' | 'useVariable' | 'variable',
  ) => {
    setAllRows(prevAllRows => ({
      ...prevAllRows,
      [row]: {
        ...prevAllRows[row],
        value:
          varName === 'value'
            ? (value as string | number)
            : (prevAllRows[row]?.value ?? ''),
        timeRate:
          varName === 'timeRate'
            ? value === 'default'
              ? undefined
              : (value as TimeVariableUnit)
            : (prevAllRows[row]?.timeRate ?? undefined),
        useVariable:
          varName === 'useVariable'
            ? (value as boolean)
            : (prevAllRows[row]?.useVariable ?? false),
        variable:
          varName === 'variable'
            ? (value as string)
            : (prevAllRows[row]?.variable ?? undefined),
      },
    }));
  };

  const setParameterVariable = (value: string, row: string) => {
    handleSetParameters(row, value, 'variable');
    updateRow(row, value, 'variable');
  };

  const handleRateChange = (row: string, value?: TimeVariableUnit) => {
    handleSetParameters(row, value, 'timeRate');
    updateRow(row, value, 'timeRate');
  };

  const handleChange = (row: string, value: string) => {
    handleSetParameters(row, value, 'value');
    updateRow(row, value, 'value');
  };

  const handleBlur = (row: string, value: string) => {
    if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?$/.test(value)) {
      setInvalidValues(prev => {
        prev.delete(row);
        return prev;
      });
      // Check if the value is in scientific notation
      let numericValue;
      if (/[Ee]/.test(value)) {
        numericValue = Number.parseFloat(value);
        if (Math.abs(Number(value.split(/[Ee]/)[1])) >= 4) {
          // If it has 4 or more decimal places, keep it in scientific notation
          numericValue = value;
        }
      } else {
        numericValue = Number.parseFloat(value);
      }
      handleSetParameters(row, numericValue, 'value');
      updateRow(row, numericValue, 'value');
    } else {
      setInvalidValues(invalidValues.add(row));
    }
  };

  const handleUseVariableChange = (checked: boolean, row: string) => {
    handleSetParameters(row, checked, 'useVariable');
    updateRow(row, checked, 'useVariable');
    if (typeof onVarChange !== 'string' || onVarChange.length === 0) {
      setOnVarChange('ocIgnore');
    }
  };

  const handleVariableChange = (row: string) => {
    setInvalidValues(prev => {
      const newInvalidValue = new Set(prev);
      newInvalidValue.delete(row);
      return newInvalidValue;
    });
  };

  return (
    <>
      <FormControlLabel
        label="Persistent - Keeps initial time between state movement and only re-samples after it occurs."
        control={
          <Checkbox
            checked={persistent}
            value={persistent}
            onChange={e => {
              setPersistent(e.target.checked);
            }}
          />
        }
      />
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <SelectComponent
          value={distType ?? 'dtNormal'}
          setValue={handleDistTypeChange}
          label="Distribution Type"
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
          value={dfltTimeRate ?? 'trHours'}
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
            {rowsToDisplay.map(row => (
              <StyledTableRow key={row}>
                <StyledTableCell>
                  {row} {getSuffix(row)}
                </StyledTableCell>
                <StyledTableCell>
                  {allRows[row]?.useVariable ? (
                    <SelectComponent
                      label="Variable"
                      value={allRows[row].variable ?? ''}
                      setValue={value => {
                        setParameterVariable(value, row);
                        handleVariableChange(row);
                      }}
                    >
                      {appData.value.VariableList.map((variable, idx) => (
                        <MenuItem key={idx} value={variable.name}>
                          {variable.name}
                        </MenuItem>
                      ))}
                    </SelectComponent>
                  ) : (
                    <TextField
                      value={allRows[row]?.value ?? ''}
                      onChange={e => {
                        handleChange(row, e.target.value);
                      }}
                      onBlur={e => {
                        handleBlur(row, e.target.value);
                      }}
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
                      value={
                        allRows[row]?.timeRate
                        ?? ('default' as TimeVariableUnit)
                      }
                      setValue={value => {
                        handleRateChange(row, value);
                      }}
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
                    value={allRows[row]?.useVariable ?? false}
                    control={
                      <Checkbox
                        checked={allRows[row]?.useVariable ?? false}
                        onChange={e => {
                          handleUseVariableChange(e.target.checked, row);
                        }}
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
        <VariableChangesPiece
          onVarChange={onVarChange}
          setOnVarChange={setOnVarChange}
        />
      )}
    </>
  );
};
