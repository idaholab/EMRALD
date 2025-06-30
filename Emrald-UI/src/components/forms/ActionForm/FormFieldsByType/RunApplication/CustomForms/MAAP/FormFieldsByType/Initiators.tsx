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
import type { MAAPComment, MAAPInitiator } from '../../../../../../../../types/EMRALD_Model';
import { MAAPToString } from '../Parser/maap-to-string';

const Initiators = () => {
  const { formData, setFormData } = useActionFormContext();
  const [initiators, setInitiators] = useState<(MAAPInitiator | MAAPComment)[]>([]);

  useEffect(() => {
    setInitiators(formData?.initiators ?? []);
  }, [formData]);

  const removeInitiator = (row: MAAPInitiator) => {
    const updatedInitiators = initiators.filter((initiator) => initiator !== row);
    setInitiators(updatedInitiators);
    setFormData((prevFormData) =>
      prevFormData ? { ...prevFormData, initiators: updatedInitiators } : undefined,
    );
  };

  const addInitiator = (desc: string) => {
    const initiator = formData?.possibleInitiators?.find((init) => init.desc === desc);
    if (
      initiator &&
      !initiators.find((init) => init.type === 'initiator' && init.name === initiator.desc)
    ) {
      let value = '';
      if (typeof initiator.value === 'string') {
        value = initiator.value;
      } else if (initiator.value.type === 'parameter_name') {
        value = initiator.value.value;
      } else {
        value = new MAAPToString().expressionToString(initiator.value);
      }
      const newInitiator: MAAPInitiator = {
        name: initiator.desc ?? '',
        value,
        type: 'initiator',
      };
      const updatedInitiators = [...initiators, newInitiator];
      setInitiators(updatedInitiators);
      setFormData((prevFormData) =>
        prevFormData ? { ...prevFormData, initiators: updatedInitiators } : undefined,
      );
    }
  };

  return (
    <>
      <Autocomplete
        size="small"
        disablePortal
        options={formData?.possibleInitiators?.map((initiator) => initiator.desc) ?? []}
        onChange={(e) => {
          addInitiator(e.currentTarget.innerHTML);
        }}
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
                {row.type === 'comment' ? row.value : row.name}
              </TableCell>
              <TableCell align="center">
                {row.type === 'initiator' ? (
                  <Tooltip title="Remove Initiator">
                    <DeleteIcon
                      sx={{ cursor: 'pointer', ml: 3 }}
                      onClick={() => {
                        removeInitiator(row);
                      }}
                    />
                  </Tooltip>
                ) : (
                  <></>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Initiators;
