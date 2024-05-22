import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useEventFormContext } from '../EventFormContext';
import { DurationComponent, SelectComponent } from '../../../common';
import { appData } from '../../../../hooks/useAppData';
import { StyledTableCell, StyledTableRow } from '../../ActionForm/ActionToStateTable';

const FailureRate = () => {
  const {
    useVariable,
    lambda,
    milliseconds,
    onVarChange,
    handleDurationChange,
    setLambda,
    setOnVarChange,
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
                    value={lambda}
                    type="number"
                    onChange={(e) => setLambda(e.target.value)}
                    size="small"
                  />
                ) : (
                  <SelectComponent label="Lambda" value={lambda as string} setValue={setLambda}>
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
                  milliseconds={milliseconds}
                  handleDurationChange={handleDurationChange}
                />
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {useVariable && (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Typography mt={4} sx={{ display: 'flex', alignItems: 'center' }}>
              If Variable Changes:
              <SelectComponent label="" value={onVarChange} setValue={setOnVarChange}>
                <MenuItem value="ocIgnore">Ignore</MenuItem>
                <MenuItem value="ocResample">Resample</MenuItem>
                <MenuItem value="ocAdjust">Adjust</MenuItem>
              </SelectComponent>
              {onVarChange === 'ocIgnore' && 'keep the sampled event time.'}
              {onVarChange === 'ocResample' && 'resample the event time.'}
              {onVarChange === 'ocAdjust' &&
                'use the new variable values to adjust the event time without resampling, if possible.'}
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default FailureRate;
