import { InputLabel, Select } from '@mui/material';
import FormControl from '@mui/material/FormControl/FormControl';
import React, { PropsWithChildren } from 'react';

interface SelectComponentProps<T> {
  value: T;
  label: string;
  setValue: (value: T) => void;
  children: React.ReactNode;
}

const SelectComponent = <T,>({
  value,
  label,
  setValue,
  children,
}: PropsWithChildren<SelectComponentProps<T>>) => {
  return (
    <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
      <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => setValue(e.target.value as T)}
        label={label}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;