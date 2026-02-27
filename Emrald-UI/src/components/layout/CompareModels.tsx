import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export interface ModelDifference {
  key: string;
  newValue: any;
  oldValue: any;
}

interface CompareModelsProps {
  differences: ModelDifference[];
}

export const CompareModels: React.FC<CompareModelsProps> = ({ differences }) => {
  const getValueToDisplay = (value: string | number) => {
    if (typeof value === 'string' && value.length === 0) {
      return '(Empty)';
    }
    return value.toString();
  };

  const getFontStyle = (value: any) => {
    if (typeof value === 'string' && ['Does not exist', '(Empty)'].includes(value)) {
      return 'italic';
    }
    return '';
  };

  return (
    <>
      {differences.length === 0 ? (
        'Uploaded model has no differences to the open model.'
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Property</b>
              </TableCell>
              <TableCell>
                <b>Current Model Value</b>
              </TableCell>
              <TableCell>
                <b>Compare Model Value</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {differences
              .map((diff) => ({
                ...diff,
                oldValue: getValueToDisplay(diff.oldValue),
                newValue: getValueToDisplay(diff.newValue),
              }))
              .map((diff) => (
                <TableRow>
                  <TableCell>{diff.key}</TableCell>
                  <TableCell sx={{ fontStyle: getFontStyle(diff.oldValue) }}>
                    {diff.oldValue}
                  </TableCell>
                  <TableCell sx={{ fontStyle: getFontStyle(diff.newValue) }}>
                    {diff.newValue}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};
