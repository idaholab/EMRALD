import { Box, Typography } from '@mui/material';
import type { MAAPExpression } from '../../../../../../../../../types/EMRALD_Model';
import { Expression } from './Expression';

export const MultiExpression: React.FC<{
  op: string;
  value: MAAPExpression[];
}> = ({ op, value }) => {
  return (
    <Box>
      <Expression value={value[0]} />
      <Typography>{op}</Typography>
      <Expression value={value[1]} />
    </Box>
  );
};
