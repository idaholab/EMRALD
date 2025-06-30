import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import type { MAAPPureExpression } from '../../../../../../../../../types/EMRALD_Model';
import { appData } from '../../../../../../../../../hooks/useAppData';
import { ExpressionType } from './ExpressionType';
import { useState } from 'react';
import { FaLink } from 'react-icons/fa6';

export const PureExpression: React.FC<{
  value: MAAPPureExpression;
}> = ({ value }) => {
  // It doesn't matter if value.value.value.toString() returns "[object object]", because the conditional logic in the JSX elements
  // will only show this value if it is configured to use a variable.
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const [localValue, setLocalValue] = useState<string>(value.value.right.value.toString());
  const variables = appData.value.VariableList.map(({ name }) => name);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ExpressionType value={value.value.left} />
      &nbsp;{value.value.op}&nbsp;
      {value.value.right.type === 'expression' ? (
        <PureExpression value={value.value.right} />
      ) : value.value.right.type === 'number' ||
        value.value.right.type === 'identifier' ||
        value.value.right.type === 'parameter_name' ? (
        <Autocomplete
          freeSolo
          aria-label="Use Variable"
          size="small"
          disablePortal
          options={variables}
          value={localValue}
          sx={{ width: 300 }}
          onChange={(_, newValue) => {
            value.value.right.value = newValue ?? '';
            value.value.right.useVariable = variables.includes(newValue ?? '');
            setLocalValue(newValue ?? '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: value.value.right.useVariable ? (
                    <InputAdornment position="start">
                      <FaLink color="#008362" />
                    </InputAdornment>
                  ) : undefined,
                },
              }}
              sx={{ input: { color: value.value.right.useVariable ? '#008362' : 'inherit' } }}
              onChange={(e) => {
                value.value.right.value = e.target.value;
                value.value.right.useVariable = variables.includes(e.target.value);
                setLocalValue(e.target.value);
              }}
            />
          )}
          getOptionLabel={(option) => option.toString()}
        />
      ) : (
        <ExpressionType value={value.value.right} />
      )}
    </Box>
  );
};
