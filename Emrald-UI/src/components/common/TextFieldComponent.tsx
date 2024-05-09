import TextField from '@mui/material/TextField/TextField';
import React from 'react';

interface TextFieldComponentProps {
  value: string;
  label: string;
  setValue: (value: string) => void;
}
const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  value,
  label,
  setValue
}) => {
  return (
    <TextField
      id={label}
      label={label}
      margin="normal"
      variant="outlined"
      size="small"
      sx={{ mb: 0, mt: 2 }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fullWidth
    />
  );
};

export default TextFieldComponent;
