import { Expression } from './Expression';
import type {
  MAAPExpression,
  MAAPSourceElement,
} from '../../../../../../../../../types/EMRALD_Model';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { SourceElement } from './SourceElement';

export const ConditionalBlock: React.FC<{
  blockType: string;
  test: MAAPExpression;
  value: MAAPSourceElement[];
  comment: string;
}> = ({ blockType, test, value, comment }) => {
  return (
    <Card sx={{marginBottom: 2}}>
      <CardContent>
        {comment}
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography m={2}>{blockType}</Typography>
          <Box sx={{ marginLeft: 8 }}>
            <Expression value={test} />
          </Box>
        </Box>
        <Divider />
        <Box sx={{marginTop: 2}}>
          {value.map((se) => (
            <SourceElement value={se} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
