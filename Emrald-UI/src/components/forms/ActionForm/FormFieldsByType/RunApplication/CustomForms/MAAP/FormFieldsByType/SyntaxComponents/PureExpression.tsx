import { Autocomplete, Box, TextField } from '@mui/material';
import type { MAAPPureExpression } from '../../../../../../../../../types/EMRALD_Model';
import { appData } from '../../../../../../../../../hooks/useAppData';
import { ExpressionType } from './ExpressionType';
import { useState } from 'react';

export const PureExpression: React.FC<{
  value: MAAPPureExpression;
}> = ({ value }) => {
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
