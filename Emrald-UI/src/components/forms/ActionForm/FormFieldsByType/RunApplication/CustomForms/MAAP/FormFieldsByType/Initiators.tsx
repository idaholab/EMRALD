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
import { v4 as uuid } from 'uuid';
import { MAAPFormData } from '../maap';
import { Initiator } from '../MAAPTypes';

const Initiators = () => {
  const { formData, setFormData } = useActionFormContext();
  const [initiators, setInitiators] = useState<Initiator[]>([]);

  const maapForm = formData as MAAPFormData;

  useEffect(() => {
    setInitiators(maapForm?.initiators || []);
  }, [formData]);

  const removeInitiator = (row: any) => {
    const updatedInitiators = initiators.filter((initiator) => initiator !== row);
    setInitiators(updatedInitiators);
    setFormData((prevFormData: MAAPFormData) => {
      const data: MAAPFormData = { ...prevFormData, initiators: updatedInitiators };
      return data;
    });
  };
  const addInitiator = (desc: string) => {
    const initiator = maapForm?.possibleInitiators?.find((init) => init.desc === desc);
    if (initiator && !initiators.find((init) => init.name === initiator.desc)) {
      const newInitiator = {
        name: initiator.name,
        comment: '',
        id: uuid(),
        value: initiator.value,
      };
      const updatedInitiators = [...initiators, newInitiator];
      setInitiators(updatedInitiators);
      setFormData((prevFormData: MAAPFormData) => {
        const data = { ...prevFormData, initiators: updatedInitiators };
        return data;
      });
    }
  };

  return (
    <>
      <Autocomplete
        size="small"
        disablePortal
        options={maapForm?.possibleInitiators?.map((initiator) => initiator.desc) || []}
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
          {initiators.map((row, idx) => (
            <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {row.name} {row.comment ? ` - ${row.comment}` : ''}
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
