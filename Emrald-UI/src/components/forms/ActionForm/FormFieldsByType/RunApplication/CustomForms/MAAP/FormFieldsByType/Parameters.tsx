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
      if (v[i] && parameter.value.type === 'identifier') {
        s[i] = parameter.value.value;
      } else {
        l[i] = new MAAPToString().expressionToString(parameter.value);
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
            <TableCell
              component="th"
              scope="row"
            >
              {row.target.type === 'call_expression'
                ? new MAAPToString().callExpressionToString(row.target)
                : row.target.value}
            </TableCell>
            <TableCell>
              {useVariable[idx] ? (
                <SelectComponent
                  value={localVarSelection[idx]}
                  label="EMRALD Variable"
                  setValue={(value) => {
                    row.value = {
                      type: 'identifier',
                      value,
                      useVariable: true
                    };
                    setLocalVarSelection([
                      ...localVarSelection.slice(0, idx),
                      value,
                      ...localVarSelection.slice(idx + 1),
                    ]);
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
                    // Setting whatever the user enters to be an identifier will cause the toString function to always print it exactly as the user enters
                    // Assuming the user enters valid syntax, it will be subsequently parsed as whatever data type it's supposed to be.
                    row.value = {
                      type: 'identifier',
                      value: e.target.value,
                      useVariable: false,
                    };
                    setLocalValue([
                      ...localValue.slice(0, idx),
                      e.target.value,
                      ...localValue.slice(idx + 1),
                    ]);
                  }}
                />
              )}
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
