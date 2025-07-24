import type { MAAPSourceElement } from '../../../../../../../../../types/EMRALD_Model';
import { Typography } from '@mui/material';
import { MAAPToString } from '../../Parser/maap-to-string';
import { Assignment } from './Assignment';

export const SourceElement: React.FC<{
  value: MAAPSourceElement;
}> = ({ value }) => {
  return (
    <>
      {value.type === 'assignment' ? (
        <Assignment value={value} />
      ) : (
        <Typography m={2}>{new MAAPToString().sourceElementToString(value)}</Typography>
      )}
    </>
  );
};
