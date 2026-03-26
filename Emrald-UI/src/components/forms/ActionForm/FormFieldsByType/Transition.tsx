import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { ActionDropTarget } from '../../../drag-and-drop/ActionDroppable';
import { useActionFormContext } from '../ActionFormContext';

export const Transition: React.FC = () => {
  const { mutuallyExclusive, handleMutuallyExclusiveChange } = useActionFormContext();
  return (
    <Box>
      <Box sx={{ mt: 3 }}>
        <Typography>
          <b>Instructions:</b>
          &nbsp;
          To add a new destination state, drag and drop a State from the
          sidebar into the To State box and the fill in the probability.
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          label="Mutually Exclusive (Transitions to one and only one of the states)"
          control={
            <Checkbox
              checked={mutuallyExclusive ?? false}
              onChange={() => {
                handleMutuallyExclusiveChange(!mutuallyExclusive);
              }}
            />
          }
        />
      </Box>
      <ActionDropTarget />
    </Box>
  );
};
