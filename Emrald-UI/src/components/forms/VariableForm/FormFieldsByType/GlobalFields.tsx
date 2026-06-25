import type { VariableFormProps } from '../VariableForm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useVariableFormContext } from '../VariableFormContext';

interface GlobalFieldsProps extends VariableFormProps {
  // When true (external sim variables), Input/Output Variable default to checked for a new variable.
  defaultInOutChecked?: boolean;
}

export const GlobalFields: React.FC<GlobalFieldsProps> = ({
  variableData,
  defaultInOutChecked,
}) => {
  const { type, value, setValue, sync }
    = useVariableFormContext();

  const [resetOnRuns, setResetOnRuns] = useState(true);
  const [canMonitor, setCanMonitor] = useState(false);
  const [monitorInSim, setMonitorInSim] = useState(false);
  const [cumulativeStats, setCumulativeStats] = useState(false);
  const [inVariable, setInVariable] = useState(false);
  const [outVariable, setOutVariable] = useState(false);

  useEffect(() => {
    setResetOnRuns(variableData?.resetOnRuns ?? true);
    setCanMonitor(variableData?.canMonitor ?? false);
    setMonitorInSim(variableData?.monitorInSim ?? false);
    setCumulativeStats(variableData?.cumulativeStats ?? false);
    setInVariable(variableData?.inVariable ?? defaultInOutChecked ?? false);
    setOutVariable(variableData?.outVariable ?? defaultInOutChecked ?? false);
  }, []);

  useEffect(() => {
    // For external-sim variables (defaultInOutChecked) the in/out flags default to true, so persist
    // them explicitly - true or false - to remember the user's choice. For other scopes they default
    // to false, so omit when false to keep the saved model clean (absence then reads back as false).
    sync({
      resetOnRuns,
      canMonitor,
      monitorInSim,
      cumulativeStats,
      inVariable: defaultInOutChecked ? inVariable : inVariable || undefined,
      outVariable: defaultInOutChecked ? outVariable : outVariable || undefined,
    });
  }, [resetOnRuns, canMonitor, monitorInSim, cumulativeStats, inVariable, outVariable]);

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
      <Tooltip
        title="When checked, the variable is set back to its initial value at the start of every Monte Carlo run. When unchecked, it keeps the value carried over from the end of the previous run."
        placement="right"
      >
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
      </Tooltip>

      <Accordion disableGutters elevation={0} sx={{ mt: 1, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle2">Running Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', pt: 0 }}>
          <Tooltip
            title="Mark this variable as a simulation input - its value is supplied into a run (for example, set by a coupled/external application or used as a run parameter) rather than only being computed within EMRALD."
            placement="right"
          >
            <FormControlLabel
              label="Input Variable"
              control={
                <Checkbox
                  checked={inVariable}
                  onChange={e => {
                    setInVariable(e.target.checked);
                  }}
                />
              }
            />
          </Tooltip>
          <Tooltip
            title="Mark this variable as a simulation output - its value is produced during a run and exposed to the results or to a coupled/external application."
            placement="right"
          >
            <FormControlLabel
              label="Output Variable"
              control={
                <Checkbox
                  checked={outVariable}
                  onChange={e => {
                    setOutVariable(e.target.checked);
                  }}
                />
              }
            />
          </Tooltip>
          <Tooltip
            title="Allow this variable to be monitored - tracked live while a simulation runs and available for inclusion in the results, not just live viewing. Must be enabled to use the monitor options below."
            placement="right"
          >
            <FormControlLabel
              label="Allow Monitor in Simulation"
              control={
                <Checkbox
                  checked={canMonitor}
                  onChange={e => {
                    setCanMonitor(e.target.checked);
                  }}
                />
              }
            />
          </Tooltip>
          {canMonitor && (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
              <Tooltip
                title="Pre-select this variable for monitoring in the solver by default when a simulation is run."
                placement="right"
              >
                <FormControlLabel
                  label="Monitor By Default"
                  control={
                    <Checkbox
                      checked={monitorInSim}
                      onChange={e => {
                        setMonitorInSim(e.target.checked);
                      }}
                    />
                  }
                />
              </Tooltip>
              <Tooltip
                title="Output the Mean, 5th, 95th of the variable when part of a key states"
                placement="right"
              >
                <FormControlLabel
                  label="Monitor Variable Stats"
                  control={
                    <Checkbox
                      checked={cumulativeStats}
                      onChange={e => {
                        setCumulativeStats(e.target.checked);
                      }}
                    />
                  }
                />
              </Tooltip>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
