import type { Dispatch, SetStateAction } from 'react';
import type { VarChangeOptions } from '@/types/EMRALD_Model';
import { Box, MenuItem, Typography } from '@mui/material';
import { SelectComponent } from '@/components/common';

export const VariableChangesPiece: React.FC<{
  onVarChange?: VarChangeOptions;
  setOnVarChange: Dispatch<SetStateAction<VarChangeOptions | undefined>>;
}> = ({ onVarChange, setOnVarChange }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      mt: 4,
    }}
  >
    <Typography sx={{ mr: 2 }}>If Variable Changes:</Typography>
    <Box sx={{ mr: 2 }}>
      <SelectComponent
        label="Select"
        value={onVarChange ?? 'ocIgnore'}
        setValue={setOnVarChange}
        sx={{ mt: 0 }}
      >
        <MenuItem value="ocIgnore">Ignore</MenuItem>
        <MenuItem value="ocResample">Resample</MenuItem>
        <MenuItem value="ocAdjust">Adjust</MenuItem>
      </SelectComponent>
    </Box>
    <Typography>
      {onVarChange === 'ocIgnore' && ', keep the sampled event time.'}
      {onVarChange === 'ocResample' && ', a new event time.'}
      {onVarChange === 'ocAdjust'
        && ', use the new variable values to adjust the event time without resampling, if possible.'}
    </Typography>
  </Box>
);
