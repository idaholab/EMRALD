import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { appData } from '../../../../../../../../hooks/useAppData';
import { useActionFormContext } from '../../../../../ActionFormContext';
import { MAAPToString } from '../Parser/maap-to-string';
import { FaLink } from 'react-icons/fa6';

const Parameters = () => {
  const { formData, setFormData } = useActionFormContext();

  const variables = appData.value.VariableList.map(({ name }) => name);

  // Variables used to control React's rendering state.
  const [useVariable, setUseVariable] = useState<boolean[]>([]);

  useEffect(() => {
    const v: boolean[] = [];
    const s: string[] = [];
    const l: string[] = [];
    formData?.parameters?.forEach((parameter, i) => {
      v[i] = parameter.value.useVariable === true;
      l[i] = new MAAPToString().expressionToString(parameter.value);
      if (v[i] && parameter.value.type === 'identifier') {
        s[i] = parameter.value.value;
      }
    });
    setUseVariable(v);
  }, [formData?.parameters]);

  useEffect(() => {
    setFormData({
      ...formData,
      caType: 'MAAP',
    });
  }, [useVariable]);

  return (
    <Table sx={{ minWidth: 650 }} size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: '40%' }}>
            <b>Parameter</b>
          </TableCell>
          <TableCell sx={{ width: '40%' }}>
            <b>Value</b>
          </TableCell>
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {formData?.parameters?.map((row, idx) => (
          <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              {row.target.type === 'call_expression'
                ? new MAAPToString().callExpressionToString(row.target)
                : row.target.value}
            </TableCell>
            <TableCell>
              <Autocomplete
                freeSolo
                aria-label="Use Variable"
                size="small"
                disablePortal
                options={variables}
                value={new MAAPToString().expressionToString(row.value)}
                sx={{ width: 300 }}
                onChange={(_, newValue) => {
                  row.value = {
                    type: 'identifier',
                    value: newValue ?? '',
                    useVariable: true,
                  };
                  setUseVariable((old) => {
                    old[idx] = true;
                    return old;
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: useVariable[idx] ? (
                          <InputAdornment position="start">
                            <FaLink color="#008362" />
                          </InputAdornment>
                        ) : undefined,
                      },
                    }}
                    sx={{ input: { color: useVariable[idx] ? '#008362' : 'inherit' } }}
                    onChange={(e) => {
                      row.value = {
                        type: 'identifier',
                        value: e.target.value,
                        useVariable: false,
                      };
                      setUseVariable((old) => {
                        old[idx] = false;
                        return old;
                      });
                    }}
                  />
                )}
                getOptionLabel={(option) => option.toString()}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Parameters;
