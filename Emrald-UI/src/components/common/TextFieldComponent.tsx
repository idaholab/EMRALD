import TextField from '@mui/material/TextField';

interface TextFieldComponentProps {
  value: string;
  label: string;
  setValue: (value: string) => void;
  sx?: Record<string, number>;
}
export const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  value,
  label,
  sx,
  setValue,
}) => (
  <TextField
    id={label}
    label={label}
    margin="normal"
    variant="outlined"
    size="small"
    sx={{ mb: 0, mt: 2, ...sx }}
    value={value}
    onChange={e => {
      setValue(e.target.value);
    }}
    fullWidth
  />
);
