import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TextField,
} from '@mui/material';
import React from 'react';
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

    handleFailureRateDurationChange,
    setLambda,

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
                    value={lambda as number}
                    type="number"
                    onChange={(e) => setLambda(Number(e.target.value))}
                    size="small"
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
