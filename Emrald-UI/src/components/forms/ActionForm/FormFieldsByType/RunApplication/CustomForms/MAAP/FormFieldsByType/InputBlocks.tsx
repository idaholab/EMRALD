import {
  Autocomplete,
  Box,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useVariableContext } from '../../../../../../../../contexts/VariableContext';

const InputBlocks = () => {
  const { variableList } = useVariableContext();
  const variables = variableList.value.map(({ name }) => name);
  return (
    <>
      <Box>
        {/* <Typography fontWeight={600} fontSize={18}>
          When
        </Typography> */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography fontWeight={600} fontSize={18} mr={2}>
            When
          </Typography>
          <Autocomplete
            size="small"
            disablePortal
            options={variables}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} />}
          />
          <Typography fontWeight={600} fontSize={18} sx={{ px: 3 }}>
            {' '}
            {'>='}{' '}
          </Typography>
          <Autocomplete
            size="small"
            disablePortal
            options={variables}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
      </Box>
    </>
  );
};

export default InputBlocks;
