import type { EventFormProps } from '../EventForm';
import type { VarChangeOptions } from '@/types/EMRALD_Model';
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TextField,
} from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { DurationComponent, SelectComponent } from '@/components/common';
import {
  StyledTableCell,
  StyledTableRow,
} from '@/components/forms/ActionForm/ActionToStateTable';
import { appData } from '@/hooks/useAppData';
import { convertToISOString } from '@/utils/util-functions';
import { useEventFormContext } from '../EventFormContext';
import { VariableChangesPiece } from './VariableChangesPiece';

export const FailureRate: React.FC<EventFormProps> = ({ eventData }) => {
  const { invalidValues, setInvalidValues, setTypeProperties, sync }
    = useEventFormContext();

  const [lambda, setLambda] = useState<string | number>();
  const [useVariable, setUseVariable] = useState<boolean>();
  const [lambdaTimeRate, setLambdaTimeRate] = useState<string>();
  const [failureRateMilliseconds, setFailureRateMilliseconds]
    = useState<number>();
  const [onVarChange, setOnVarChange] = useState<VarChangeOptions>();
  const [persistent, setPersistent] = useState<boolean | undefined>();

  useEffect(() => {
    setLambda(eventData?.lambda);
    setUseVariable(eventData?.useVariable);
    if (eventData?.lambdaTimeRate !== undefined) {
      setLambdaTimeRate(eventData.lambdaTimeRate);
      setFailureRateMilliseconds(
        moment.duration(eventData.lambdaTimeRate).asMilliseconds(),
      );
    }
    setOnVarChange(eventData?.onVarChange);
    setPersistent(eventData?.persistent);
    setTypeProperties([
      'lambda',
      'useVariable',
      'lambdaTimeRate',
      'onVarChange',
      'persistent',
    ]);
  }, []);

  useEffect(() => {
    sync({ lambda, useVariable, lambdaTimeRate, onVarChange, persistent });
  }, [lambda, useVariable, lambdaTimeRate, onVarChange, persistent]);

  const handleUseVariableChange = (checked: boolean) => {
    setUseVariable(checked);
    if (checked) {
      setLambda('');
      if (typeof onVarChange !== 'string') {
        setOnVarChange('ocIgnore');
      }
    }
  };

  const handleLambdaValueChange = (value: string) => {
    setLambda(value);
  };

  const handleLambdaValueBlur = (value: string) => {
    if (
      value
      && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?$/.test(value)
    ) {
      setInvalidValues(prev => {
        const newInvalidValue = new Set(prev);
        newInvalidValue.delete('Lambda');
        return newInvalidValue;
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
      setLambda(numericValue);
    } else {
      setInvalidValues(prev => {
        const newInvalidValue = new Set(prev);
        newInvalidValue.add('Lambda');
        return newInvalidValue;
      });
    }
  };

  const handleFailureRateDurationChange = (value: number) => {
    setFailureRateMilliseconds(value);
    setLambdaTimeRate(convertToISOString(value));
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
      <FormControlLabel
        label="Use Variable Lambda/Frequency?"
        value={useVariable}
        control={
          <Checkbox
            checked={useVariable ? true : false}
            onChange={e => {
              handleUseVariableChange(e.target.checked);
            }}
          />
        }
      />
      <TableContainer>
        <Table>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell>Lambda/Freq: </StyledTableCell>
              <StyledTableCell>
                {useVariable ? (
                  <SelectComponent
                    label="Lambda"
                    value={lambda as string}
                    setValue={value => {
                      setLambda(value);
                      setInvalidValues(prev => {
                        const newInvalidValue = new Set(prev);
                        newInvalidValue.delete('Lambda');
                        return newInvalidValue;
                      });
                    }}
                    sx={{ mt: 0 }}
                  >
                    {appData.value.VariableList.map((variable, index) => (
                      <MenuItem key={index} value={variable.name}>
                        {variable.name}
                      </MenuItem>
                    ))}
                  </SelectComponent>
                ) : (
                  <TextField
                    label="Lambda"
                    value={lambda}
                    type="text"
                    onChange={e => {
                      handleLambdaValueChange(e.target.value);
                    }}
                    onBlur={() => {
                      handleLambdaValueBlur(String(lambda));
                    }}
                    size="small"
                    error={invalidValues.has('Lambda')}
                    helperText={
                      invalidValues.has('Lambda') ? 'Invalid value' : ''
                    }
                  />
                )}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Time Rate: </StyledTableCell>
              <StyledTableCell>
                <DurationComponent
                  milliseconds={failureRateMilliseconds ?? 0}
                  handleDurationChange={handleFailureRateDurationChange}
                />
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
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
      {useVariable && (
        <VariableChangesPiece
          onVarChange={onVarChange}
          setOnVarChange={setOnVarChange}
        />
      )}
    </>
  );
};
