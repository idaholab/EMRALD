import { Checkbox, FormControlLabel } from '@mui/material';
import StateDropTarget from '../../../drag-and-drop/StateDroppable';
import { useVariableFormContext } from '../VariableFormContext';

const AccrualFields = () => {
  const {
    resetOnRuns,
    setResetOnRuns,
    canMonitor,
    setCanMonitor,
    monitorInSim,
    setMonitorInSim,
    cumulativeStats,
    setCumulativeStats,
  } = useVariableFormContext();

  return (
    <>
      State Accrual Variables
      <StateDropTarget />
      <FormControlLabel
        label="Reset to initial value for every simulation run"
        value={resetOnRuns}
        control={
          <Checkbox
            checked={resetOnRuns}
            onChange={(e) => {
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
            onChange={(e) => {
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
                onChange={(e) => {
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
                onChange={(e) => {
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

export default AccrualFields;
