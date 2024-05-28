import { SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField/TextField';
import React from 'react';

interface TextFieldComponentProps {
  value: string;
  label: string;
  setValue: (value: string) => void;
  sx?: SxProps;
}
const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  value,
  label,
  sx,
  setValue
}) => {
  const defaultSxProps: SxProps = { mb: 0, mt: 2 };
  return (
    <TextField
      id={label}
      label={label}
      margin="normal"
      variant="outlined"
      size="small"
      sx={{ ...defaultSxProps, ...sx }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fullWidth
    />
  );
};

export default TextFieldComponent;
