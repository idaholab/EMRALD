import { Checkbox, FormControlLabel } from '@mui/material';
import StateDropTarget from '../../../drag-and-drop/StateDroppable';
import { useVariableFormContext } from '../VariableFormContext';

const AccrualFields = () => {
  const { resetOnRuns, setResetOnRuns } = useVariableFormContext();

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
            onChange={(e) => setResetOnRuns(e.target.checked)}
          ></Checkbox>
        }
      ></FormControlLabel>
    </>
  );
};

export default AccrualFields;
