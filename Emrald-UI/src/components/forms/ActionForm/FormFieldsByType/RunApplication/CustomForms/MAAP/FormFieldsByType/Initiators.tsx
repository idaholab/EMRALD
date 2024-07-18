import {
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useActionFormContext } from '../../../../../ActionFormContext';
const Initiators = () => {
  const { formData } = useActionFormContext();
  return (
    <>
      <Autocomplete
        size="small"
        disablePortal
        id="combo-box-demo"
        options={
          formData?.possibleInitiators?.map((initiator: { desc: string }) => initiator.desc) || []
        }
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Add Initiator" />}
      />
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '80%' }}>
              <b>Name</b>
            </TableCell>
            <TableCell align="center">
              <b>Remove</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formData.initiators?.map((row: any, idx: number) => (
            <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.type === 'assignment' ? row.target.value.value : row.value}
              </TableCell>
              <TableCell align="center">
                <DeleteIcon />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Initiators;
