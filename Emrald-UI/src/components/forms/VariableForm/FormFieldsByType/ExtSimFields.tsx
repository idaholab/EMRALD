import { TextField, Typography } from '@mui/material';
import React from 'react';

interface ExtSimFieldsProps {
  sim3DId: string;
  setSim3DId: (value: string) => void;
}

const ExtSimFields: React.FC<ExtSimFieldsProps> = ({ sim3DId, setSim3DId }) => {
  return (
    <>
      <TextField
        label="3DSimID"
        margin="normal"
        variant="outlined"
        size="small"
        value={sim3DId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSim3DId(e.target.value);
        }}
        fullWidth
        sx={{ mb: 0 }}
      />
      <Typography variant={'caption'}>
        <i>(Name or ID of variable in the external simulation)</i>
      </Typography>
    </>
  );
};

export default ExtSimFields;
