import { 
  Box,
  Typography, 
  FormControlLabel, 
  Checkbox } from '@mui/material';
import ActionDropTarget from '../../../drag-and-drop/ActionDroppable';
import { useActionFormContext } from '../ActionFormContext';

const Transition = () => {
  const {
    mutuallyExclusive,
    setMutuallyExclusive
  } = useActionFormContext();
  return (
    <Box>
      <Box sx={{ mt: 3 }}>
        <Typography>
          <b>Instructions:</b> To add a new destination state, drag and drop a
          State from the sidebar into the To State box and the fill in the
          probability.
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          label="Mutually Exclusive (Transitions to one and only one of the states)"
          control={
            <Checkbox
              checked={mutuallyExclusive}
              onChange={() => setMutuallyExclusive(!mutuallyExclusive)}
            />
          }
        />
      </Box>
      <ActionDropTarget />
    </Box>
  );
};

export default Transition;
