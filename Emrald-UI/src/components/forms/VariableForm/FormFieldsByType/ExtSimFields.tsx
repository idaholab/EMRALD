import { MenuItem, TextField, Typography } from '@mui/material';
import { useExtSimContext } from '../../../../contexts/ExtSimContext';
import { SelectComponent } from '../../../common';

interface ExtSimFieldsProps {
  extSim: string;
  sim3DId: string;
  setExtSim: (value: string) => void;
  setSim3DId: (value: string) => void;
}

const ExtSimFields: React.FC<ExtSimFieldsProps> = ({ sim3DId, setSim3DId, extSim, setExtSim }) => {
  const { extSims } = useExtSimContext();
  return (
    <>
      <SelectComponent
        fullWidth
        label="External Sim"
        setValue={(value) => {
          setExtSim(value);
        }}
        value={extSim}
      >
        {extSims.map((e) => (
          <MenuItem key={e.id} value={e.id}>
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
        onChange={(e) => {
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

export default ExtSimFields;
