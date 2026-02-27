import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import type { MAAPPureExpression } from '../../../../../../../../../types/EMRALD_Model';
import { appData } from '../../../../../../../../../hooks/useAppData';
import { ExpressionType } from './ExpressionType';
import { useState } from 'react';
import { FaLink } from 'react-icons/fa6';
import { MAAPToString } from '../../Parser/maap-to-string';

export const PureExpression: React.FC<{
  value: MAAPPureExpression;
}> = ({ value }) => {
  const [localValue, setLocalValue] = useState<string>(new MAAPToString().sourceElementToString(value.right));
  const variables = appData.value.VariableList.map(({ name }) => name);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ExpressionType value={value.left} />
      &nbsp;{value.op}&nbsp;
      {value.right.type === 'expression' ? (
        <PureExpression value={value.right} />
      ) : value.right.type === 'number' ||
        value.right.type === 'identifier' ||
        value.right.type === 'parameter_name' ? (
        <Autocomplete
          freeSolo
          aria-label="Use Variable"
          size="small"
          disablePortal
          options={variables}
          value={localValue}
          sx={{ width: 300 }}
          onChange={(_, newValue) => {
            value.right = {
              type: 'identifier',
              value: newValue ?? '',
            };
            value.right.useVariable = variables.includes(newValue ?? '');
            setLocalValue(newValue ?? '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: value.right.useVariable ? (
                    <InputAdornment position="start">
                      <FaLink color="#008362" />
                    </InputAdornment>
                  ) : undefined,
                },
              }}
              sx={{ input: { color: value.right.useVariable ? '#008362' : 'inherit' } }}
              onChange={(e) => {
                value.right = {
                  type: 'identifier',
                  value: e.target.value,
                };
                value.right.useVariable = variables.includes(e.target.value);
                setLocalValue(e.target.value);
              }}
            />
          )}
          getOptionLabel={(option) => option.toString()}
        />
      ) : (
        <ExpressionType value={value.right} />
      )}
    </Box>
  );
};
