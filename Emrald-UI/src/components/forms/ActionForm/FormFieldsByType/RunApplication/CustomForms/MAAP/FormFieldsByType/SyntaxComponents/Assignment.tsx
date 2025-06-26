import type { MAAPAssignment } from '../../../../../../../../../types/EMRALD_Model';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { MAAPToString } from '../../Parser/maap-to-string';
import { useState } from 'react';
import { appData } from '../../../../../../../../../hooks/useAppData';

export const Assignment: React.FC<{
  value: MAAPAssignment;
}> = ({ value }) => {
  const [localValue, setLocalValue] = useState<string>(value.value.value.toString());
  const variables = appData.value.VariableList.map(({ name }) => name);

  return (
    <Box sx={{display: 'flex'}}>
      <Typography>
        {value.target.type === 'call_expression'
          ? new MAAPToString().callExpressionToString(value.target)
          : value.target.value} =
      </Typography>
      <Autocomplete
        freeSolo
        aria-label="Use Variable"
        size="small"
        disablePortal
        options={variables}
        value={localValue}
        sx={{ width: 300 }}
        onChange={(_, newValue) => {
          value.value.value = newValue ?? '';
          value.value.useVariable = variables.includes(newValue ?? '');
          setLocalValue(newValue ?? '');
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => {
              value.value.value = e.target.value;
              value.value.useVariable = variables.includes(e.target.value);
              setLocalValue(e.target.value);
            }}
          />
        )}
        getOptionLabel={(option) => option.toString()}
      />
    </Box>
  );
};
