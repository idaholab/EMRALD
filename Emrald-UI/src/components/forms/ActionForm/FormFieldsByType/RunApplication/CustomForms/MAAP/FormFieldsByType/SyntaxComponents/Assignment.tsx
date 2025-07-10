import type { MAAPAssignment } from '../../../../../../../../../types/EMRALD_Model';
import { Autocomplete, Box, InputAdornment, TextField, Typography } from '@mui/material';
import { MAAPToString } from '../../Parser/maap-to-string';
import { useState } from 'react';
import { appData } from '../../../../../../../../../hooks/useAppData';
import { FaLink } from 'react-icons/fa6';
import { MultiExpression } from './MultiExpression';
import { IsExpression } from './IsExpression';

export const Assignment: React.FC<{
  value: MAAPAssignment;
}> = ({ value }) => {
  const [localValue, setLocalValue] = useState<string>(
    new MAAPToString().expressionToString(value.value),
  );
  const variables = appData.value.VariableList.map(({ name }) => name);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography>
        {value.target.type === 'call_expression'
          ? new MAAPToString().callExpressionToString(value.target)
          : value.target.value}{' '}
        =&nbsp;
      </Typography>
      {value.value.type === 'multi_expression' ? (
        <MultiExpression op={value.value.op} value={value.value.value}></MultiExpression>
      ) : value.value.type === 'is_expression' ? (
        <IsExpression target={value.value.target} value={value.value.value}></IsExpression>
      ) : (
        <Autocomplete
          freeSolo
          aria-label="Use Variable"
          size="small"
          disablePortal
          options={variables}
          value={localValue}
          sx={{ width: 300 }}
          onChange={(_, newValue) => {
            // Other possible types should be handled by the conditional rendering
            if (value.value.type === 'expression') {
              value.value.right = {
                type: 'identifier',
                value: newValue ?? '',
              };
            }
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
                // Other possible types should be handled by the conditional rendering
                if (value.value.type === 'expression') {
                  value.value.right = {
                    type: 'identifier',
                    value: e.target.value,
                  };
                }
                value.value.useVariable = variables.includes(e.target.value);
                setLocalValue(e.target.value);
              }}
            />
          )}
          getOptionLabel={(option) => option.toString()}
        />
      )}
    </Box>
  );
};
