import { Autocomplete, Box, TextField } from '@mui/material';
import type { MAAPPureExpression } from '../../../../../../../../../types/EMRALD_Model';
import { appData } from '../../../../../../../../../hooks/useAppData';
import { ExpressionType } from './ExpressionType';

export const PureExpression: React.FC<{
  value: MAAPPureExpression;
}> = ({ value }) => {
  const variables = appData.value.VariableList.map(({ name }) => name);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ExpressionType value={value.value.left} />
      &nbsp;{value.value.op}&nbsp;
      {value.value.right.type === 'expression' ? (
        <PureExpression value={value.value.right} />
      ) : value.value.right.type === 'number' || value.value.right.type === 'identifier' || value.value.right.type === 'parameter_name' ? (
        <Autocomplete
          aria-label="Use Variable"
          size="small"
          disablePortal
          options={variables}
          defaultValue={value.value.right.value.toString()}
          onChange={(_, newValue) => {
            value.value.right.value = newValue ?? '';
            value.value.right.useVariable = true;
          }}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} />}
          getOptionLabel={(option) => option.toString()}
        />
      ) : (
        <ExpressionType value={value.value.right} />
      )}
    </Box>
  );
};
