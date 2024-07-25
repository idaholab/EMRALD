import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Checkbox,
  MenuItem,
} from '@mui/material';
import { Parameter, Value } from '../maap';
import { useState } from 'react';
import { SelectComponent } from '../../../../../../../common';
import { appData } from '../../../../../../../../hooks/useAppData';
import { useActionFormContext } from '../../../../../ActionFormContext';

const Parameters = () => {
  const { formData } = useActionFormContext();
  const [useVariable, setUseVariable] = useState<{ [key: number]: boolean }>({});
  const [variable, setVariable] = useState<{ [key: string]: string }>({});
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
        {formData?.parameters?.map((row: Parameter, id: number) => (
          <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              {row.target.type === 'call_expression'
                ? ((row.target.value as Value).value as string)
                : (row.target.value as string)}
            </TableCell>
            {useVariable[id] ? (
              <SelectComponent
                value={variable[id]}
                label={'EMRALD Variable'}
                setValue={(e) => setVariable((prev) => ({ ...prev, [id]: e }))}
                sx={{ width: 225, ml: '15px', mb: '20px' }}
              >
                {appData.value.VariableList.map((variable) => (
                  <MenuItem value={variable.name}>{variable.name}</MenuItem>
                ))}
              </SelectComponent>
            ) : (
              <TableCell align="left">
                <TextField size="small" value={row.value.value} />
              </TableCell>
            )}
            <TableCell align="center">
              <Checkbox
                checked={useVariable[id]}
                value={useVariable[id]}
                onChange={() => setUseVariable((prev) => ({ ...prev, [id]: !prev[id] }))}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Parameters;
