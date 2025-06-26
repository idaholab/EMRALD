import type { MAAPAssignment } from '../../../../../../../../../types/EMRALD_Model';
import { Autocomplete, Box, InputAdornment, TextField, Typography } from '@mui/material';
import { MAAPToString } from '../../Parser/maap-to-string';
import { useState } from 'react';
import { appData } from '../../../../../../../../../hooks/useAppData';
import { FaLink } from 'react-icons/fa6';

export const Assignment: React.FC<{
  value: MAAPAssignment;
}> = ({ value }) => {
  const [localValue, setLocalValue] = useState<string>(value.value.value.toString());
  const variables = appData.value.VariableList.map(({ name }) => name);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography>
        {value.target.type === 'call_expression'
          ? new MAAPToString().callExpressionToString(value.target)
          : value.target.value}{' '}
        =&nbsp;
      </Typography>
      <Autocomplete
        freeSolo
        aria-label="Use Variable"
        size="small"
        disablePortal
        options={variables}
        value={localValue}
        onChange={(_, newValue) => {
          value.value.value = newValue ?? '';
          value.value.useVariable = variables.includes(newValue ?? '');
          setLocalValue(newValue ?? '');
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: value.value.useVariable ? (
                    <InputAdornment position="start">
                      <FaLink color="#008362" />
                    </InputAdornment>
                  ) : undefined,
                },
              }}
              sx={{ input: { color: value.value.useVariable ? '#008362' : 'inherit' } }}
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
