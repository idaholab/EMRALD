import type { VariableFormProps } from '../VariableForm';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useVariableFormContext } from '../VariableFormContext';

export const GlobalFields: React.FC<VariableFormProps> = ({ variableData }) => {
  const { type, value, setValue, sync }
    = useVariableFormContext();

  const [resetOnRuns, setResetOnRuns] = useState(true);
  const [canMonitor, setCanMonitor] = useState(false);
  const [monitorInSim, setMonitorInSim] = useState(false);
  const [cumulativeStats, setCumulativeStats] = useState(false);

  useEffect(() => {
    setResetOnRuns(variableData?.resetOnRuns ?? true);
    setCanMonitor(variableData?.canMonitor ?? false);
    setMonitorInSim(variableData?.monitorInSim ?? false);
    setCumulativeStats(variableData?.cumulativeStats ?? false);
  }, []);

  useEffect(() => {
    sync({ resetOnRuns, canMonitor, monitorInSim, cumulativeStats });
  }, [resetOnRuns, canMonitor, monitorInSim, cumulativeStats]);

  return (
    <>
      {type == 'int' || type == 'double' ? (
        <TextField
          label="Value"
          margin="normal"
          variant="outlined"
          type="number"
          size="small"
          value={value}
          onChange={e => {
            const val = Number.parseFloat(e.target.value);
            setValue(Number.isNaN(val) ? '' : val);
          }}
          fullWidth
        />
      ) : type == 'bool' ? (
        <FormControl
          variant="outlined"
          size="small"
          sx={{ minWidth: 120, width: '100%', my: 1 }}
        >
          <InputLabel>Start Value</InputLabel>
          <Select
            labelId="value"
            id="value"
            value={value as string}
            onChange={event => {
              setValue(event.target.value === 'true');
            }}
            label="Start Value"
            fullWidth
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
      ) : (
        <TextField
          label="Value"
          margin="normal"
          variant="outlined"
          type="string"
          size="small"
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
          fullWidth
        />
      )}
      <FormControlLabel
        label="Reset to initial value for every simulation run"
        control={
          <Checkbox
            checked={resetOnRuns}
            onChange={e => {
              setResetOnRuns(e.target.checked);
            }}
          />
        }
      />
      <br />
      <FormControlLabel
        label="Allow Monitor in Simulation"
        value={canMonitor}
        control={
          <Checkbox
            checked={canMonitor}
            onChange={e => {
              setCanMonitor(e.target.checked);
            }}
          />
        }
      />
      {canMonitor ? (
        <>
          <br />
          <FormControlLabel
            label="Monitor By Default"
            value={monitorInSim}
            control={
              <Checkbox
                checked={monitorInSim}
                onChange={e => {
                  setMonitorInSim(e.target.checked);
                }}
              />
            }
          />
          <br />
          <FormControlLabel
            label="Monitor Cumulative Stats"
            value={cumulativeStats}
            control={
              <Checkbox
                checked={cumulativeStats}
                onChange={e => {
                  setCumulativeStats(e.target.checked);
                }}
              />
            }
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
