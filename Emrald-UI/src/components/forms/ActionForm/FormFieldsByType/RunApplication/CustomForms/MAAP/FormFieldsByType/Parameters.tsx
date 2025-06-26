import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Checkbox,
  MenuItem,
  FormControlLabel,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SelectComponent } from '../../../../../../../common';
import { appData } from '../../../../../../../../hooks/useAppData';
import { useActionFormContext } from '../../../../../ActionFormContext';
import { MAAPToString } from '../Parser/maap-to-string';

const Parameters = () => {
  const { formData, setFormData } = useActionFormContext();

  // Variables used to control React's rendering state.
  const [useVariable, setUseVariable] = useState<boolean[]>([]);
  const [localVarSelection, setLocalVarSelection] = useState<string[]>([]);
  const [localValue, setLocalValue] = useState<string[]>([]);

  useEffect(() => {
    const v: boolean[] = [];
    const s: string[] = [];
    const l: string[] = [];
    formData?.parameters?.forEach((parameter, i) => {
      v[i] = parameter.value.useVariable === true;
      if (v[i]) {
        s[i] = parameter.value.value as string;
      } else if (
        typeof parameter.value.value === 'number' ||
        typeof parameter.value.value === 'string'
      ) {
        l[i] = parameter.value.value.toString(); // TODO: There are other possible data types that can be here, but I'm not sure any of the practically exist
      } else {
        console.log(parameter.value);
      }
    });
    setUseVariable(v);
    setLocalVarSelection(s);
    setLocalValue(l);
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      caType: 'MAAP',
    });
  }, [useVariable, localVarSelection, localValue]);

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
              {/* TODO: Handle this case in the upgrade script */}
              {row.target !== undefined
                ? row.target.type === 'call_expression'
                  ? new MAAPToString().callExpressionToString(row.target)
                  : row.target.value
                : 'Your project was created with an older version of the MAAP form. Please re-open your .inp file.'}
            </TableCell>
            <TableCell>
              {useVariable[idx] ? (
                <SelectComponent
                  value={localVarSelection[idx]}
                  label="EMRALD Variable"
                  setValue={(value) => {
                    //row.value.useVariable = true;
                    row.value.value = value;
                    localVarSelection[idx] = value;
                  }}
                  sx={{ width: 223, mt: 0 }}
                >
                  {appData.value.VariableList.map((variable) => (
                    <MenuItem key={variable.name} value={variable.name}>
                      {variable.name}
                    </MenuItem>
                  ))}
                </SelectComponent>
              ) : (
                <TextField
                  size="small"
                  value={localValue[idx]}
                  onChange={(e) => {
                    row.value.value = e.target.value;
                    setLocalValue([
                      ...localValue.slice(0, idx),
                      e.target.value,
                      ...localValue.slice(idx + 1),
                    ]);
                  }}
                />
              )}
              {row.value.units ?? ''}
            </TableCell>
            <TableCell align="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useVariable[idx]}
                    value={useVariable[idx]}
                    onChange={(e) => {
                      row.value.useVariable = e.target.value === 'false';
                      setUseVariable([
                        ...useVariable.slice(0, idx),
                        e.target.value === 'false',
                        ...useVariable.slice(idx + 1),
                      ]);
                    }}
                  />
                }
                label="Use Variable"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Parameters;
