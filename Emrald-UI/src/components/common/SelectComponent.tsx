import type { PropsWithChildren } from 'react';
import { InputLabel, Select } from '@mui/material';
import FormControl from '@mui/material/FormControl';

interface SelectComponentProps<T> {
  value: T;
  label: string;
  fullWidth?: boolean;
  sx?: object;
  setValue: (value: T) => void;
}

export function SelectComponent<T>({
  value,
  label,
  fullWidth,
  setValue,
  children,
  sx,
}: PropsWithChildren<SelectComponentProps<T>>) {
  const labelId = `${label.replace(/[^A-z]/g, '-')}-select-label`;
  return (
    <FormControl
      sx={{ mt: 2, minWidth: 120, ...sx }}
      size="small"
      fullWidth={fullWidth}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        aria-labelledby={labelId}
        value={value || ''}
        onChange={e => {
          setValue(e.target.value as T);
        }}
        label={label}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {children}
      </Select>
    </FormControl>
  );
}
