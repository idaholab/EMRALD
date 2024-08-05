import {
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useActionFormContext } from '../../../../../ActionFormContext';
import { useEffect, useState } from 'react';
import { Initiator } from '../../../CustomApplicationTypes';
import useRunApplication from '../../../useRunApplication';
const Initiators = () => {
  const { formData, setFormData } = useActionFormContext();
  const [initiators, setInitiators] = useState<any[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const { getInitiatorName } = useRunApplication();

  useEffect(() => {
    setInitiators(formData?.initiators || []);
    setComments(formData?.comments || {});
  }, [formData]);

  const removeInitiator = (row: any) => {
    const updatedInitiators = initiators.filter((initiator) => initiator !== row);
    setInitiators(updatedInitiators);
    setFormData((prevFormData: any) => ({ ...prevFormData, initiators: updatedInitiators }));
  };
  const addInitiator = (desc: string) => {
    const initiator = formData?.possibleInitiators?.find((init: Initiator) => init.desc === desc);
    if (initiator && !initiators.includes(initiator)) {
      const updatedInitiators = [...initiators, initiator];
      setInitiators(updatedInitiators);
      setFormData((prevFormData: any) => ({ ...prevFormData, initiators: updatedInitiators }));
    }
  };
  const getInitiatorRow = (row: Initiator) => {
    const name = getInitiatorName(row);
    const comment = comments[name];
    return name + (comment ? ` - ${comment}` : '');
  };

  return (
    <>
      <Autocomplete
        size="small"
        disablePortal
        id="combo-box-demo"
        options={
          formData?.possibleInitiators?.map((initiator: { desc: string }) => initiator.desc) || []
        }
        onChange={(e) => addInitiator(e.currentTarget.innerHTML)}
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
          {initiators.map((row: Initiator, idx: number) => (
            <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {getInitiatorRow(row)}
                </div>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Remove Initiator">
                  <DeleteIcon
                    sx={{ cursor: 'pointer', ml: 3 }}
                    onClick={() => removeInitiator(row)}
                  />
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Initiators;
