import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Checkbox,
} from '@mui/material';

function createData(parameter: string, value: number, variable: boolean) {
  return { parameter, value, variable };
}

const rows = [
  createData('ZWCTLSG', 35, false),
  createData('IDBGTD', 0, false),
  createData('ICRBAL', 1, false),
  createData('IEMBAL', 9, false),
  createData('ISBNOD', 0, true),
];

const Parameters = () => {
  return (
    <Table sx={{ minWidth: 650 }} size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: '40%' }}>
            <b>Parameter</b>
          </TableCell>
          <TableCell sx={{ width: '40%' }} align="left">
            <b>Value</b>
          </TableCell>
          <TableCell align="center">
            <b>Use Variable</b>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.parameter}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.parameter}
            </TableCell>
            <TableCell align="left">
              <TextField size="small" value={row.value} />
            </TableCell>
            <TableCell align="center">
              <Checkbox checked={row.variable} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Parameters;
