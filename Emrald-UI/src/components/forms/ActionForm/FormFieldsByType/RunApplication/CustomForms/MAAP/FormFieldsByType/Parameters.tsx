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
import { Parameter } from '../MAAPTypes';
import { MAAPFormData } from '../maap';

const Parameters = () => {
  const { formData, setFormData } = useActionFormContext();
  const [useVariable, setUseVariable] = useState<{ [key: string]: boolean }>({});
  const [variable, setVariable] = useState<{ [key: string]: string }>({});
  const [parameters, setParameters] = useState<Parameter[]>([]);

  const maapForm = formData as MAAPFormData;

  useEffect(() => {
    setUseVariable(
      maapForm?.parameters?.reduce((accumulator: Record<string, boolean>, param) => {
        accumulator[param.id as string] = param.useVariable;
        return accumulator;
      }, {}) || {},
    );
    setVariable(
      maapForm?.parameters?.reduce((accumulator: Record<string, string>, param) => {
        accumulator[param.id as string] = param.variable || '';
        return accumulator;
      }, {}) || {},
    );
  }, []);

  useEffect(() => {
    setParameters(maapForm?.parameters || []);
  }, [formData?.parameters]);

  const handleSetVariable = (variableName: string, row: Parameter) => {
    setVariable((prev) => ({ ...prev, [row.id as string]: variableName }));
    const updatedParameters = parameters.map((param) =>
      param.id === row.id ? { ...param, variable: variableName } : param,
    );
    setParameters(updatedParameters);
    setFormData((prevFormData: MAAPFormData) => {
      const data: MAAPFormData = { ...prevFormData, parameters: updatedParameters };
      return data;
    });
  };

  const handleCheckbox = (row: Parameter) => {
    const value = !useVariable[row.id as string];
    setUseVariable((prev) => ({ ...prev, [row.id as string]: value }));
    const updatedParameters = parameters.map((param) =>
      param.id === row.id ? { ...param, useVariable: value } : param,
    );
    setParameters(updatedParameters);
    setFormData((prevFormData: MAAPFormData) => {
      const data: MAAPFormData = { ...prevFormData, parameters: updatedParameters };
      return data;
    });
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
        {parameters?.map((row: Parameter, idx: number) => (
          <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell>
              {useVariable[row.id as string] ? (
                <SelectComponent
                  value={variable[row.id as string] || ''}
                  label={'EMRALD Variable'}
                  setValue={(e) => handleSetVariable(e, row)}
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
                    checked={useVariable[row.id as string] || false}
                    value={useVariable[row.id as string] || false}
                    onChange={() => handleCheckbox(row)}
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
