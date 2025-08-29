import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TextField,
} from '@mui/material';
import { useEventFormContext } from '../EventFormContext';
import { DurationComponent, SelectComponent } from '../../../common';
import { appData } from '../../../../hooks/useAppData';
import { StyledTableCell, StyledTableRow } from '../../ActionForm/ActionToStateTable';
import VariableChangesPiece from './VariableChangesPiece';

const FailureRate = () => {
  const {
    useVariable,
    lambda,
    failureRateMilliseconds,
    invalidValues,
    handleFailureRateDurationChange,
    setLambda,
    setInvalidValues,
    setUseVariable,
    onVarChange,
    setOnVarChange,
    persistent,
    setPersistent,
  } = useEventFormContext();

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

  const validInputRegex = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?$/;

  const handleLambdaValueBlur = (value: string) => {
    if (value && validInputRegex.test(value)) {
      setInvalidValues((prev) => {
        const newInvalidValue = new Set(prev);
        newInvalidValue.delete('Lambda');
        return newInvalidValue;
      });
      // Check if the value is in scientific notation
      const isScientificNotation = /[Ee]/.test(value);
      let numericValue;
      if (isScientificNotation) {
        numericValue = parseFloat(value);
        const exponentPart = value.split(/[Ee]/)[1];
        const exponent = Math.abs(Number(exponentPart));
        if (exponent >= 4) {
          // If it has 4 or more decimal places, keep it in scientific notation
          numericValue = value;
        }
      } else {
        numericValue = parseFloat(value);
      }
      setLambda(numericValue);
    } else {
      setInvalidValues((prev) => {
        const newInvalidValue = new Set(prev);
        newInvalidValue.add('Lambda');
        return newInvalidValue;
      });
    }
  };

  return (
    <>
      <FormControlLabel
        label="Persistent - Keeps initial time between state movement and only re-samples after it occurs."
        control={
          <Checkbox
            checked={persistent}
            value={persistent}
            onChange={(e) => setPersistent(e.target.checked)}
          ></Checkbox>
        }
      ></FormControlLabel>
      <FormControlLabel
        label="Use Variable Lambda/Frequency?"
        value={useVariable}
        control={
          <Checkbox
            checked={useVariable ? true : false}
            onChange={(e) => {
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
                {!useVariable ? (
                  <TextField
                    label="Lambda"
                    value={lambda}
                    type="text"
                    onChange={(e) => {
                      handleLambdaValueChange(e.target.value);
                    }}
                    onBlur={() => {
                      handleLambdaValueBlur(String(lambda));
                    }}
                    size="small"
                    error={invalidValues.has('Lambda')}
                    helperText={invalidValues.has('Lambda') ? 'Invalid value' : ''}
                  />
                ) : (
                  <SelectComponent
                    label="Lambda"
                    value={lambda as string}
                    setValue={(value) => {
                      setLambda(value);
                      setInvalidValues((prev) => {
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
            onChange={(e) => setPersistent(e.target.checked)}
          ></Checkbox>
        }
      ></FormControlLabel>
      {useVariable && <VariableChangesPiece />}
    </>
  );
};

export default FailureRate;
