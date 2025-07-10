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
import type { MAAPAssignment, MAAPSourceElement } from '../../../../../../../../types/EMRALD_Model';
import { MAAPToString } from '../Parser/maap-to-string';

const Initiators = () => {
  const { formData, setFormData } = useActionFormContext();
  const [initiators, setInitiators] = useState<MAAPSourceElement[]>([]);

  useEffect(() => {
    setInitiators(formData?.initiators ?? []);
  }, [formData]);

  const removeInitiator = (row: MAAPSourceElement) => {
    const updatedInitiators = initiators.filter((initiator) => initiator !== row);
    setInitiators(updatedInitiators);
    setFormData((prevFormData) =>
      prevFormData ? { ...prevFormData, initiators: updatedInitiators } : undefined,
    );
  };

  const addInitiator = (desc: string) => {
    const initiator = formData?.possibleInitiators?.find((init) => init.desc === desc);
    if (initiator) {
      const newInitiator: MAAPAssignment = {
        type: 'assignment',
        target: {
          type: 'identifier',
          value: initiator.desc ?? '',
        },
        value:
          typeof initiator.value === 'string'
            ? {
                type: 'identifier',
                value: initiator.value,
              }
            : initiator.value,
        comments: [[], []],
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
                {row.type === 'comment'
                  ? row.value
                  : row.type === 'assignment'
                    ? row.target.type === 'call_expression'
                      ? new MAAPToString().callExpressionToString(row.target)
                      : row.target.value
                    : ''}
              </TableCell>
              <TableCell align="center">
                {row.type !== 'comment' ? (
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
