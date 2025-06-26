import { Expression } from './Expression';
import type { MAAPExpression } from '../../../../../../../../../types/EMRALD_Model';
import { Box, Paper, Typography } from '@mui/material';

export const ConditionalBlock: React.FC<{
  blockType: string;
  test: MAAPExpression;
}> = ({ blockType, test }) => {
  return (
    <Paper>
      <Box sx={{ margin: 1, display: 'flex' }}>
        <Typography m={2}>{blockType}</Typography>
        <Expression value={test} />
      </Box>
    </Paper>
  );
};
