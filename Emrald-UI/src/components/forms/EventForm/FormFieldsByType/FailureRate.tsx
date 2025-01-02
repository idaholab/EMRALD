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
  } = useEventFormContext();

  const handleVariableChange = (checked: boolean) => {
    setUseVariable(checked);
    if (checked) {
      setLambda('');
    } else {
      setLambda(0);
    }
  };

  const handleLambdaValueChange = (value: string) => {
    setLambda(value);
  };

  const validInputRegex = /^[+\-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+\-]?\d+)?$/;

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
        const [_, exponentPart] = value.split(/[Ee]/);
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
        label="Use Variable Lambda/Frequency?"
        value={useVariable}
        control={
          <Checkbox
            checked={useVariable ? true : false}
            onChange={(e) => handleVariableChange(e.target.checked)}
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
                    onChange={(e) => handleLambdaValueChange(e.target.value)}
                    onBlur={() => handleLambdaValueBlur(String(lambda))}
                    size="small"
                    error={invalidValues.has('Lambda')}
                    helperText={invalidValues.has('Lambda') ? 'Invalid value' : ''}
                  />
                ) : (
                  <SelectComponent
                    label="Lambda"
                    value={lambda as string}
                    setValue={setLambda}
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
                  milliseconds={failureRateMilliseconds || 0}
                  handleDurationChange={handleFailureRateDurationChange}
                />
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {useVariable && <VariableChangesPiece />}
    </>
  );
};

export default FailureRate;
