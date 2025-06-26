import { Expression } from './Expression';
import type { MAAPExpression, MAAPSourceElement } from '../../../../../../../../../types/EMRALD_Model';
import { Box, Paper, Typography } from '@mui/material';
import { SourceElement } from './SourceElement';

export const ConditionalBlock: React.FC<{
  blockType: string;
  test: MAAPExpression;
  value: MAAPSourceElement[];
}> = ({ blockType, test, value }) => {
  return (
    <Paper>
      <Box sx={{ margin: 1, display: 'flex' }}>
        <Typography m={2}>{blockType}</Typography>
        <Expression value={test} />
      </Box>
      <Box>{value.map((se) => <SourceElement value={se} />)}</Box>
    </Paper>
  );
};
