import { InputLabel, Select } from '@mui/material';
import FormControl from '@mui/material/FormControl/FormControl';
import React, { PropsWithChildren } from 'react';

interface SelectComponentProps<T> {
  value: T;
  label: string;
  setValue: (value: T) => void;
  children: React.ReactNode;
  mt?: number;
}

const SelectComponent = <T,>({
  value,
  label,
  setValue,
  children,
  mt,
}: PropsWithChildren<SelectComponentProps<T>>) => {
  return (
    <FormControl sx={{ mt: mt !== undefined ? mt : 2, minWidth: 120 }} size="small">
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
