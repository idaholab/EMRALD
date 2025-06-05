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
import type { MAAPParameter } from '../../../../../../../../types/EMRALD_Model';

const Parameters = () => {
  const { formData, setFormData } = useActionFormContext();
  const [useVariable, setUseVariable] = useState<Record<string, boolean>>({});
  const [variable, setVariable] = useState<Record<string, string>>({});
  const [parameters, setParameters] = useState<MAAPParameter[]>([]);

  useEffect(() => {
    setUseVariable(
      formData?.parameters?.reduce((accumulator: Record<string, boolean>, param) => {
        accumulator[param.id] = param.useVariable === true;
        return accumulator;
      }, {}) ?? {},
    );
    setVariable(
      formData?.parameters?.reduce((accumulator: Record<string, string>, param) => {
        accumulator[param.id] = param.variable ?? '';
        return accumulator;
      }, {}) ?? {},
    );
  }, []);

  useEffect(() => {
    setParameters(formData?.parameters ?? []);
  }, [formData?.parameters]);

  const handleSetVariable = (variableName: string, row: MAAPParameter) => {
    setVariable((prev) => ({ ...prev, [row.id]: variableName }));
    const updatedParameters = parameters.map((param) =>
      param.id === row.id ? { ...param, variable: variableName } : param,
    );
    setParameters(updatedParameters);
    setFormData((prevFormData) =>
      prevFormData ? { ...prevFormData, parameters: updatedParameters } : undefined,
    );
  };

  const handleCheckbox = (row: MAAPParameter) => {
    const value = !useVariable[row.id];
    setUseVariable((prev) => ({ ...prev, [row.id]: value }));
    const updatedParameters = parameters.map((param) =>
      param.id === row.id ? { ...param, useVariable: value } : param,
    );
    setParameters(updatedParameters);
    setFormData((prevFormData) =>
      prevFormData ? { ...prevFormData, parameters: updatedParameters } : undefined,
    );
  };

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
        {parameters.map((row, idx) => (
          <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell>
              {useVariable[row.id] ? (
                <SelectComponent
                  value={variable[row.id] || ''}
                  label={'EMRALD Variable'}
                  setValue={(e) => {
                    handleSetVariable(e, row);
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
                <TextField size="small" value={row.value} />
              )}
            </TableCell>
            <TableCell align="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useVariable[row.id] || false}
                    value={useVariable[row.id] || false}
                    onChange={() => {
                      handleCheckbox(row);
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
