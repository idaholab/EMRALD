import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React, { Dispatch, SetStateAction } from 'react';
import { ActionType, DiagramType, EventType, MainItemTypes, StateType, VariableType } from '../../types/ItemTypes';

type ValueTypes<T extends MainItemTypes> =
  T extends 'Diagram' ? DiagramType :
  T extends 'State' ? StateType :
  T extends 'Event' ? EventType :
  T extends 'Action' ? ActionType :
  T extends 'Variable' ? VariableType :
  never;

interface MainDetailsFormProps<T extends MainItemTypes> {
  itemType: T
  typeLabel?: string;
  type: ValueTypes<T>;
  setType: Dispatch<SetStateAction<ValueTypes<T>>>;
  typeOptions: { value: string; label: string }[];
  typeDisabled?: boolean;
  name: string;
  setName: (name: string) => void;
  desc: string;
  setDesc: (desc: string) => void;
}

const MainDetailsForm = <T extends MainItemTypes>({
  typeLabel,
  type,
  setType,
  typeOptions,
  typeDisabled,
  name,
  setName,
  desc,
  setDesc,
}: MainDetailsFormProps<T>) => {
  return (
    <>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 120, width: '100%' }}>
        <InputLabel id="type-select-label">{typeLabel ? typeLabel : 'Type'}</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={type as string} // Cast type as string
          onChange={(event: SelectChangeEvent<string>) => setType(event.target.value as ValueTypes<T>)} // Cast event.target.value as ValueTypes<T>
          label={typeLabel ? typeLabel : 'Type'}
          disabled={typeDisabled}
        >
          {typeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Name"
        margin="normal"
        variant="outlined"
        size="small"
        sx={{ mb: 0 }}
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Description"
        variant="outlined"
        size="small"
        fullWidth
        multiline
        margin="normal"
        value={desc}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)}
      />
    </>
  );
};

export default MainDetailsForm;

