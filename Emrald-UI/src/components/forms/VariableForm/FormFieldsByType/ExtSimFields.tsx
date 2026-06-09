import type { VariableFormProps } from '../VariableForm';
import { MenuItem, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { SelectComponent } from '@/components/common';
import { useExtSimContext } from '@/contexts/ExtSimContext';
import { useVariableFormContext } from '../VariableFormContext';
import { GlobalFields } from './GlobalFields';

export const ExtSimFields: React.FC<VariableFormProps> = ({ variableData }) => {
  const { sync, setTypeProperties } = useVariableFormContext();
  const { extSims } = useExtSimContext();

  const [extSim, setExtSim] = useState<string>();
  const [sim3DId, setSim3DId] = useState<string>();

  useEffect(() => {
    setExtSim(variableData?.extSim);
    setSim3DId(variableData?.sim3DId);
    setTypeProperties(['extSim', 'sim3DId']);
  }, []);

  useEffect(() => {
    sync({ extSim, sim3DId });
  }, [extSim, sim3DId]);

  return (
    <>
      <GlobalFields />
      <SelectComponent
        fullWidth
        label="External Sim"
        setValue={value => {
          setExtSim(value);
        }}
        value={extSim}
      >
        {extSims.map(e => (
          <MenuItem key={e.id} value={e.name}>
            {e.name}
          </MenuItem>
        ))}
      </SelectComponent>
      <TextField
        label="3DSimID"
        margin="normal"
        variant="outlined"
        size="small"
        value={sim3DId}
        onChange={e => {
          setSim3DId(e.target.value);
        }}
        fullWidth
        sx={{ mb: 0 }}
      />
      <Typography variant="caption">
        <i>(Name or ID of variable in the external simulation)</i>
      </Typography>
    </>
  );
};
